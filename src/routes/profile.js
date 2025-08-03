const express = require('express');
const profileRouter = express.Router();
const User = require('../models/User');
const userAuth = require('../middleware/auth').userAuth;





profileRouter.get('/profile/view',userAuth, async (req, res) => {

    try {

        
    
        // Get the user from the request object (set by userAuth middleware)
        const user = req.user;
        res.send(user)

        // If user is not found, send a 404 response

        if (!user) {
            throw new Error('User not found');
        }


    }  catch (error) {
            // Handle any errors that occur during user creation.
            console.error('Error creating user:', error);
            res.status(500).json({
                message: 'Error creating user',
                error: error.message
            });
        }

    });






profileRouter.patch('/profile/edit', userAuth,async (req, res) => {

  // Ensure userId is provided in the request body
  const userId = req.body.userId;
  
  // Correct destructuring - getting specific fields from req.body
  const { emailId, firstName, lastName, age,photoUrl,skills,gender } = req.body;
  
  // Build update object with only provided fields
  const updateData = {};
  if (userId !== undefined) updateData.userId = userId; // Ensure userId is included if provided
  if (emailId !== undefined) updateData.emailId = emailId;
  if (firstName !== undefined) updateData.firstName = firstName;
  if (lastName !== undefined) updateData.lastName = lastName;
  if (age !== undefined) updateData.age = age;
  if (photoUrl !== undefined) updateData.photoUrl = photoUrl;
  if (skills !== undefined) updateData.skills = skills; // Ensure skills is included if  



  if (gender !== undefined) updateData.gender = gender; // Ensure

if(userId)

  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }
  
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: 'At least one field to update is required' });
  }
  
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { $set: updateData }, // Fixed: use updateData directly, not wrapped in object
      { 
        new: true,
        runValidators: true,
      }
    );
    
    if (!updatedUser) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      message: 'Error updating user',
      error: error.message
    });
  }
});


// Forgot Password Route
profileRouter.patch('/profile/password', async (req, res) => {

  try {

      // Update the user's password
    const { userId, newPassword } = req.body;
    if (!userId || !newPassword) {
      return res.status(400).json({ message: 'userId and newPassword are required' });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: newPassword },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      message: 'Password updated successfully', 
    }); 
    

  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({
      message: 'Error in forgot password',
      error: error.message
    });
  }
});


module.exports = profileRouter ;