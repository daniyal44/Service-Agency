const UserService = require('../services/user.service');

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const userData = req.body;
        const newUser = await UserService.createUser(userData);
        res.status(201).json({
            success: true,
            data: newUser,
            message: 'User created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserService.getUserById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update user by ID
exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const userData = req.body;
        const updatedUser = await UserService.updateUser(userId, userData);
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            data: updatedUser,
            message: 'User updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await UserService.deleteUser(userId);
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await UserService.getAllUsers();
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};