import User from '../../models/User.js';
import bcrypt from 'bcrypt';
import generateToken from '../../utils/generateToken.js';

export const register = async (req, res) => {
    try {
        const {
            name, email, password, phone, role, image,
            address, serviceArea, deliveryTimings, bio,
        } = req.body;
        const existingUser = await User.findOne({ email: email.toLowerCase().trim(), });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }
        const allowedRoles = ['user', 'cook'];
        if (role && !allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role',
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            role: role || 'user',
            image,
            address,
            serviceArea,
            deliveryTimings,
            bio,
            cookingRequestStatus: role === 'cook' ? 'pending' : 'none',
        })
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        }
        res.status(201).json({
            success: true,
            message: role === 'cook'
                ? 'Cook registered successfully. Awaiting admin approval.'
                : 'User registered successfully',
            data: userData,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase().trim(), });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }
        res.status(200).json({
            success: true,
            message: "Login Successful",
            token: generateToken(user),
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                image: user.image,
                address: user.address,
                serviceArea: user.serviceArea,
                deliveryTimings: user.deliveryTimings,
                bio: user.bio,
                isApproved: user.isApproved,
                cookingRequestStatus: user.cookingRequestStatus,
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}