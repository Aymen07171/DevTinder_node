const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Fixed: Capital U to match your import

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                message: 'Access denied. No token provided'
            });
        }

        // Use environment variable for JWT secret
        const JWT_SECRET =  'JWT@DAIKI@2025';
        
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Find the user by ID in the database
        const user = await User.findById(decoded._id).select('-password'); // Exclude password from result
        
        if (!user) {
            return res.status(401).json({
                message: 'Invalid token. User not found'
            });
        }
        
        // Attach user data to request object
        req.user = user;
 
        next(); // Call the next middleware or route handler
        
    } catch (error) {
        console.error('Error in userAuth middleware:', error);
        
        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Invalid token'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token expired'
            });
        }
        
        // Generic error
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {userAuth};