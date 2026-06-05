import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
    cookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,

    },
    name: {
        type: String,
        required: true,
        trim: true,

    },
    description: {
        type: String,
        default: '',

    },
    mealType: {
        type: String,
        enum: ['veg', 'non-veg'],
        required: true,

    },
    cuisine: {
        type: String,
        required: true,
        trim: true,

    },
    category: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snacks'],
        required: true,

    },
    price: {
        type: Number,
        required: true,

    },
    image: {
        type: String,
        default: '',

    },
    imagePublicId: {
        type: String,
        default: '',

    },
    isAvailable: {
        type: Boolean,
        default: true,
        required: true,

    },
}, { timestamps: true });

const Menu = mongoose.model('Menu', menuSchema);
export default Menu;