const UserService = require('../services/user.service');
const AuthService = require('../services/auth.service');

exports.register = async (req, res) => {
    try {
        const userData = req.body;
        const newUser = await UserService.createUser(userData);
        res.status(201).json({
            message: 'User registered successfully',
            user: newUser
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error registering user',
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await AuthService.login(email, password);
        res.status(200).json({
            message: 'Login successful',
            token
        });
    } catch (error) {
        res.status(401).json({
            message: 'Invalid credentials',
            error: error.message
        });
    }
};

exports.logout = (req, res) => {
    // Logic for logging out the user (e.g., invalidating the token)
    res.status(200).json({
        message: 'Logout successful'
    });
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        await AuthService.sendPasswordResetEmail(email);
        res.status(200).json({
            message: 'Password reset email sent'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error sending password reset email',
            error: error.message
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        await AuthService.resetPassword(token, newPassword);
        res.status(200).json({
            message: 'Password reset successfully'
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error resetting password',
            error: error.message
        });
    }
};