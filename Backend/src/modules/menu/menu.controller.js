import Menu from "../../models/Menu.js";
import cloudinary from "../../config/cloudinary.js";
import uploadToCloudinary from "../../utils/uploadToCloudinary.js";

export const getAllMenuItems = async (req, res, next) => {
    try {
        const { cookId, mealType, cuisine, mealPlan, minPrice, maxPrice, category, search } = req.query;
        const filter = { isAvailable: true };
        if (cookId) filter.cookId = cookId;
        if (mealType) filter.mealType = mealType;
        if (cuisine) filter.cuisine = { $regex: cuisine, $options: 'i' };
        if (mealPlan) filter.mealPlan = mealPlan;
        if (category) filter.category = category;

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }
        const menuItems = await Menu.find(filter)
            .populate({ path: 'cookId', select: 'name image address serviceArea deliveryTimings isApproved' })
            .sort({ createdAt: -1 });

        // Only show items from approved cooks
        const filtered = menuItems.filter((m) => m.cookId?.isApproved);
        res.status(200).json({
            success: true,
            message: 'Fetched All Menu Items',
            data: filtered,
        });
    } catch (error) {
        next(error);
    }
}
export const getMenuItemById = async (req, res, next) => {
    try {
        const item = await Menu.findById(req.params.id).populate({
            path: 'cookId',
            select: 'name image address serviceArea deliveryTimings'
        });
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found!'
            });
        }
        if (!item.isAvailable) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found!',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Fetched Single Menu Item',
            data: item,
        })
    } catch (error) {
        next(error);
    }
}
export const getMyCookMenu = async (req, res, next) => {
    try {
        const item = await Menu.find({ cookId: req.user.id })
            .select('-__v')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: 'Cook Menu Item Fetched',
            data: item,
        });
    } catch (error) {
        next(error);
    }
}
export const createMenuItem = async (req, res, next) => {
    try {
        const { name, description, mealType, cuisine, category, mealPlan, price } = req.body;
        let image = '';
        let imagePublicId = '';
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, 'homefeast/menu')
            image = result.secure_url;
            imagePublicId = result.public_id;
        }
        const item = await Menu.create({
            cookId: req.user.id,
            name,
            description,
            mealType,
            cuisine,
            category,
            mealPlan,
            price,
            image,
            imagePublicId,
        });
        res.status(201).json({
            success: true,
            message: 'Menu Item Added',
            data: item,
        });
    } catch (error) {
        next(error);
    }
}
export const updateMenuItem = async (req, res, next) => {
    try {
        const item = await Menu.findById(req.params.id);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found',
            });
        }
        if (!item.cookId.equals(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized',
            });
        }
        const { name, description, mealType, cuisine, category, mealPlan, price, isAvailable, } = req.body;
        if (name) item.name = name;
        if (description !== undefined) item.description = description;
        if (mealType) item.mealType = mealType;
        if (cuisine) item.cuisine = cuisine;
        if (category) item.category = category;
        if (mealPlan) item.mealPlan = mealPlan;
        if (price) item.price = price;
        if (isAvailable !== undefined) item.isAvailable = isAvailable;
        if (req.file) {
            if (item.imagePublicId) {
                await cloudinary.uploader.destroy(item.imagePublicId);
            }
            const result = await uploadToCloudinary(
                req.file.buffer,
                'homefeast/menu'
            );
            item.image = result.secure_url;
            item.imagePublicId = result.public_id;
        }

        await item.save();
        res.status(200).json({
            success: true,
            message: 'Menu item updated successfully',
            data: item,
        });
    } catch (error) {
        next(error);
    }
}
export const deleteMenuItem = async (req, res, next) => {
    try {
        const item = await Menu.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Menu item not found' });
        }
        if (!item.cookId.equals(req.user.id)) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        if (item.imagePublicId) {
            await cloudinary.uploader.destroy(item.imagePublicId);
        }
        const deletedItemName = item.name;

        await item.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Menu item deleted',
            data: deletedItemName,

        });
    } catch (error) {
        next(error);
    }
}
export const toggleAvailability = async (req, res, next) => {
    try {
        const item = await Menu.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Menu item not found' });
        }
        if (!item.cookId.equals(req.user.id)) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        item.isAvailable = !item.isAvailable;
        await item.save();

        res.status(200).json({
            success: true,
            message: `Item is now ${item.isAvailable ? 'available' : 'unavailable'}`,
            data: item,
        })
    } catch (error) {
        next(error);
    }
}