import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'cook', 'admin'],
        default: 'user',
    },
    image: {
        type: String,
        default: '',
    },
    address: {
        street: { type: String, default: "", },
        city: { type: String, default: "", },
        state: { type: String, default: "", },
        pincode: { type: String, default: "", },
    },
    // Cook Specific Fields
    isApproved: {
        type: Boolean,
        default: false,
    },
    cookingRequestStatus: {
        type: String,
        enum: ['none', 'pending', 'approved', 'rejected'],
        default: 'none'
    },
    // Service area and timing (for cooks)
    serviceArea: {
        type: String,
        default: '',
    },
    deliveryTimings:{
        type: String,
        default: '',
    },
    bio:{
        type: String,
        default: '',
    },

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;