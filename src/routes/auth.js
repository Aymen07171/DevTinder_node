const express = require('express');
const authRouter = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { userAuth } = require('../middleware/auth');

// LOGIN
authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(404).json({ message: 'Invalid Credentials' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await user.passwordMatch(password); // Assumes passwordMatch is defined on User schema
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        // Generate JWT token
        const token = await user.getJWTToken(); // Assumes getJWTToken is defined on User schema

        // Set the token in a cookie (8 * 900000 ms = 2 hours)
        res.cookie('token', token, { expires: new Date(Date.now() + 8 * 900000), httpOnly: true });

        // Send user data (never send password)
        res.status(200).json({
            message: 'Login successful',
            user: {
                userId: user._id,
                token: token,
                firstName: user.firstName,
                lastName: user.lastName,
                emailId: user.emailId,
                age: user.age,
                photoUrl: user.photoUrl,
                skills : user.skills,

            }
    
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            message: 'Error during login',
            error: error.message
        });
    }
});

// SIGNUP
authRouter.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, emailId, age, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ emailId });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Encrypt password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: encryptedPassword,
            age
        });

        // Save the user to the database
        const savedUser = await user.save();

        
        // Generate JWT token
        const token = await user.getJWTToken(); // Assumes getJWTToken is defined on User schema

        // Set the token in a cookie (8 * 900000 ms = 2 hours)
        res.cookie('token', token, { expires: new Date(Date.now() + 8 * 900000), httpOnly: true });

        res.status(201).json({
            message: 'User created successfully',
            data: savedUser
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            message: 'Error creating user',
            error: error.message
        });
    }
});

// LOGOUT
authRouter.post('/logout', userAuth, async (req, res) => {
    try {
        // Expire the token by setting the cookie's expiration to the past
        res.cookie('token', '', { expires: new Date(0), httpOnly: true });
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({
            message: 'Error during logout',
            error: error.message
        });
    }
});

module.exports = authRouter;