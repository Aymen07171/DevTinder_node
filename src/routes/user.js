const express = require('express');
const userRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const { userAuth } = require('../middleware/auth');
const User = require('../models/User');
const USER_SAFE_DATA = ['firstName', 'lastName', 'age', 'gender','photoUrl','skills', '_id'];

// Get all the the pending connections request for the loggedIn user

userRouter.get('/user/requests/received',userAuth, async (req, res) => {
    try {
        // Assuming req.user is populated with the logged-in user's information
        const userId = req.user._id;

        // Fetch all connection requests where the user is the recipient
        const connectionRequests = await ConnectionRequest.find({

                toUserId: userId,
                status: 'accepted', // Only fetch accepted requests

            
            })
            .populate('fromUserId', USER_SAFE_DATA)



        res.status(200).json(connectionRequests);
    } catch (error) {
        console.error('Error fetching connection requests:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch all accepted connection requests for the user
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: userId, status: 'accepted' },
                { toUserId: userId, status: 'accepted' }
            ]
        })
        .populate('fromUserId', USER_SAFE_DATA)
        .populate('toUserId', USER_SAFE_DATA);

        // Map the data to return the connected user's information

        const data = connectionRequests.map((row) => {{
            if(row.fromUserId._id.toString() === userId.toString()) {
                return {
                    ...row.toUserId._doc, // Spread the toUserId data
                };
            }
        }})

        return res.status(200).json({
            success: true,
            data: data
        });
    
    } catch (error) {
        console.error('Error fetching connections:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});


// Feed API to get the logged-in user's information
userRouter.get('/user/feed', userAuth, async (req, res) => {

    try {


        const userId = req.user._id;

        // Pagniation parameters
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit; // Calculate the number of items to skip
        



        //  Find all connection requests (sent + received)
        // Populate the fromUserId and toUserId fields with safe user data
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: userId, },
                { toUserId: userId, }
            ]
        }).select("fromUserId toUserId") // Select only necessary fields
        .populate('fromUserId', USER_SAFE_DATA) // Populate fromUserId with safe user data

        // Hide FromUserId and ToUserId from the feed

        const hideUserData = new Set();

        connectionRequests.forEach((req) => {

            hideUserData.add(req.fromUserId._id.toString());
            hideUserData.add(req.toUserId._id.toString());

        })

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserData) } // Exclude users already in connection requests
                },

                {
                    _id: { $ne: userId } // Exclude the logged-in user
                }
            ]
            
        })
        .select(USER_SAFE_DATA) // Select only safe user data
        .skip(skip) // Skip for pagination
        .limit(limit); // Limit for pagination

        res.status(200).json({
            success: true,
            data: users
        });
        

    } catch (error) {
        console.error('Error fetching user feed:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




// Export the user router
module.exports = userRouter;
