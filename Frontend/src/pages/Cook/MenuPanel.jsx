import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    toggleMenuAvailability,
    deleteMenu,
    updateMenu,
    createMenu,
    getMyMenus
} from '../../api/menuAPI.js';
import { setMenus } from '../../rtk/slices/menuSlice.js';
import { Edit2, Trash2, Plus, X, ImagePlus, AlertTriangle } from 'lucide-react';
import { notify } from '../../utils/toast.jsx';

const CATEGORY_OPTIONS = ['breakfast', 'lunch', 'dinner', 'snacks'];
const MEAL_TYPE_OPTIONS = ['veg', 'non-veg'];

const MenuPanel = () => {
    const dispatch = useDispatch();
    const { menus } = useSelector((state) => state.menu);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [togglingId, setTogglingId] = useState(null);

    const [deleteTarget, setDeleteTarget] = useState(null); 
    const [deletingId, setDeletingId] = useState(null);

    const [form, setForm] = useState({
        name: '',
        description: '',
        mealType: '',
        cuisine: '',
        category: '',
        price: '',
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(null);
    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const res = await getMyMenus();
                dispatch(setMenus(res.data.data));
            } catch (err) {
                notify.error('Failed to fetch menus:', err);
            }
        };
        fetchMenus();
    }, []);

    const resetForm = () => {
        setForm({
            name: '',
            description: '',
            mealType: '',
            cuisine: '',
            category: '',
            price: '',
            image: null,
        });
        setImagePreview(null);
        setEditingItem(null);
    };

    const openAddModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setForm({
            name: item.name || '',
            description: item.description || '',
            mealType: item.mealType || '',
            cuisine: item.cuisine || '',
            category: item.category || '',
            price: item.price || '',
            image: null,
        });
        setImagePreview(item.image || null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setForm((prev) => ({ ...prev, image: file }));
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('description', form.description);
            formData.append('mealType', form.mealType);
            formData.append('cuisine', form.cuisine);
            formData.append('category', form.category);
            formData.append('price', form.price);
            if (form.image) {
                formData.append('image', form.image);
            }

            let res;
            if (editingItem) {
                res = await updateMenu(editingItem._id, formData);
                dispatch(
                    setMenus(
                        menus.map((m) => (m._id === editingItem._id ? res.data.data : m))
                    )
                );
            } else {
                res = await createMenu(formData);
                dispatch(setMenus([res.data.data, ...menus]));
            }

            closeModal();
        } catch (err) {
            notify.error('Failed to save menu item:', err);
            alert(err?.response?.data?.message || 'Failed to save menu item');
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggle = async (item) => {
        setTogglingId(item._id);
        try {
            await toggleMenuAvailability(item._id);
            const res = await getMyMenus();
            dispatch(setMenus(res.data.data));
        } catch (err) {
            notify.error('Failed to toggle availability:', err);
            alert(err?.response?.data?.message || 'Failed to toggle availability');
        } finally {
            setTogglingId(null);
        }
    };

    const confirmDelete = (item) => {
        setDeleteTarget(item);
    };

    const cancelDelete = () => {
        setDeleteTarget(null);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        const item = deleteTarget;
        setDeletingId(item._id);
        try {
            await deleteMenu(item._id);
            dispatch(setMenus(menus.filter((m) => m._id !== item._id)));
            setDeleteTarget(null);
        } catch (err) {
            notify.error('Failed to delete menu item:', err);
            alert(err?.response?.data?.message || 'Failed to delete menu item');
        } finally {
            setDeletingId(null);
        }
    };

    const inputCls = "w-full px-3 py-2 rounded-md border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all bg-white text-[var(--color-text)]";
    const labelCls = "block text-sm font-semibold text-[var(--color-text)] mb-1.5";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-[var(--color-text)]"
                    style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 700 }}>
                    My Menu
                </h1>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[var(--color-primary)] text-white rounded-md text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors active:scale-95"
                >
                    <Plus size={16} />
                    Add Item
                </button>
            </div>

            {menus.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-md border border-[var(--color-border)]/40">
                    <p className="text-[var(--color-text-muted)]">You haven't added any menu items yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {menus.map((m) => (
                        <div key={m._id} className="bg-white rounded-md border border-[var(--color-border)]/40 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                            <div className="h-60 bg-[var(--color-surface-container)] overflow-hidden">
                                <img src={m.image || 'https://placehold.co/400x160/ffe9e2/ab3500?text=🍛'}
                                    alt={m.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-1">
                                    <h3 className="font-semibold text-[var(--color-text)] text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
                                        {m.name}
                                    </h3>
                                    <span className="font-bold text-[var(--color-primary)] text-sm">₹{m.price}</span>
                                </div>
                                <p className="text-xs text-[var(--color-text-muted)] capitalize mb-3">
                                    {m.category} · {m.mealType}
                                </p>
                                <div className="flex items-center justify-between mb-3">
                                    <button
                                        onClick={() => handleToggle(m)}
                                        disabled={togglingId === m._id}
                                        className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-opacity disabled:opacity-50 ${m.isAvailable
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-500'
                                            }`}
                                    >
                                        {togglingId === m._id
                                            ? 'Updating...'
                                            : m.isAvailable
                                                ? 'Available'
                                                : 'Unavailable'}
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 pt-2 border-t border-[var(--color-border)]/40">
                                    <button
                                        onClick={() => openEditModal(m)}
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text)] hover:bg-[var(--color-surface-low)] transition-colors active:scale-95"
                                    >
                                        <Edit2 size={13} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(m)}
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors active:scale-95"
                                    >
                                        <Trash2 size={13} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white w-full max-w-lg rounded-md shadow-xl border border-[var(--color-border)]/50 overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]/50 sticky top-0 bg-white">
                            <h3 className="text-lg font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
                                {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="p-1 rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-surface-low)] transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div className="flex items-center gap-4">
                                <label
                                    htmlFor="menuImageInput"
                                    className="relative w-20 h-20 rounded-md bg-[var(--color-surface-container)] overflow-hidden shrink-0 border border-[var(--color-border)] cursor-pointer group block"
                                    title="Click to choose image"
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl">🍛</div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                                        <ImagePlus size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </label>
                                <div className="flex-1">
                                    <label className={labelCls}>Image</label>
                                    <label
                                        htmlFor="menuImageInput"
                                        className="inline-block text-sm text-[var(--color-primary)] font-medium cursor-pointer underline-offset-2 hover:underline"
                                    >
                                        {form.image ? form.image.name : 'Choose image'}
                                    </label>
                                    <input
                                        id="menuImageInput"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={labelCls}>Name</label>
                                <input
                                    required
                                    name="name"
                                    type="text"
                                    value={form.name}
                                    onChange={handleFormChange}
                                    className={inputCls}
                                    placeholder="Paneer Butter Masala"
                                />
                            </div>

                            <div>
                                <label className={labelCls}>Description</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleFormChange}
                                    rows={3}
                                    className={inputCls}
                                    placeholder="Short description of the dish"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Meal Type</label>
                                    <select
                                        required
                                        name="mealType"
                                        value={form.mealType}
                                        onChange={handleFormChange}
                                        className={inputCls}
                                    >
                                        <option value="">Select</option>
                                        {MEAL_TYPE_OPTIONS.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>Category</label>
                                    <select
                                        required
                                        name="category"
                                        value={form.category}
                                        onChange={handleFormChange}
                                        className={inputCls}
                                    >
                                        <option value="">Select</option>
                                        {CATEGORY_OPTIONS.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Cuisine</label>
                                    <input
                                        required
                                        name="cuisine"
                                        type="text"
                                        value={form.cuisine}
                                        onChange={handleFormChange}
                                        className={inputCls}
                                        placeholder="North Indian"
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>Price (₹)</label>
                                    <input
                                        required
                                        name="price"
                                        type="number"
                                        min="0"
                                        value={form.price}
                                        onChange={handleFormChange}
                                        className={inputCls}
                                        placeholder="150"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-low)] transition-all"
                                    style={{ fontSize: '14px', fontWeight: 600 }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex items-center justify-center min-w-[120px] px-5 py-2 rounded-md bg-[var(--color-primary)] text-white shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-wait"
                                    style={{ fontSize: '14px', fontWeight: 600 }}
                                >
                                    {isSaving ? (editingItem ? 'Updating...' : 'Adding...') : (editingItem ? 'Update Item' : 'Add Item')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white w-full max-w-sm rounded-md shadow-xl border border-[var(--color-border)]/50 overflow-hidden">
                        <div className="p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-full bg-red-100 text-red-600">
                                    <AlertTriangle size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
                                    Delete Item
                                </h3>
                            </div>
                            <p className="text-sm text-[var(--color-text-muted)]">
                                Are you sure you want to delete <span className="font-semibold text-[var(--color-text)]">"{deleteTarget.name}"</span>? This action cannot be undone.
                            </p>
                            <div className="flex gap-3 justify-end mt-5">
                                <button
                                    type="button"
                                    onClick={cancelDelete}
                                    disabled={deletingId === deleteTarget._id}
                                    className="px-4 py-2 rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-low)] transition-all disabled:opacity-50"
                                    style={{ fontSize: '14px', fontWeight: 600 }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={deletingId === deleteTarget._id}
                                    className="flex items-center justify-center min-w-[100px] px-4 py-2 rounded-md bg-red-600 text-white shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-wait"
                                    style={{ fontSize: '14px', fontWeight: 600 }}
                                >
                                    {deletingId === deleteTarget._id ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuPanel;
