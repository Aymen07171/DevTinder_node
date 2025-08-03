const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail'); // Import the sendEmail utility





// Route to send a connection request
// This route allows a user to send a connection request to another user






requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {  
    try {
        const fromUserId = req.user._id;
        const { toUserId, status } = req.params;

        // Validate status
        const allowedStatus = ['accepted', 'rejected', 'pending'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Connection requests must be created with "pending" status'
            });
        }

        // Check if users exist
        const [fromUser, toUser] = await Promise.all([
            User.findById(fromUserId),
            User.findById(toUserId)
        ]);

        if (!fromUser || !toUser) {
            return res.status(404).json({
                success: false,
                message: 'One or both users not found'
            });
        }

        // Check if request already exists
        const existingRequest = await ConnectionRequest.findOne({
            fromUserId,
            toUserId,
            status: { $in: ['pending', 'accepted'] }
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: 'Connection request already exists or users are already connected'
            });
        }

        // Create new connection request
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const savedRequest = await connectionRequest.save();

        // Send email notification
        
        const emailResponse = await sendEmail.run(
            "A new Friend Request from " + fromUser.firstName + ' ' + fromUser.lastName, // Subject
            "You have received a new connection request from " + fromUser.firstName + ' ' + fromUser.lastName + ". Please log in to your account to review the request.", // Body
   
        )



        return res.status(201).json({
            success: true,
            message: 'Connection request sent successfully',
            connectionRequest: savedRequest
        });

    } catch (error) {
        console.error('Error sending connection request:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});


requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const { status, requestId } = req.params;

        // Validate status
        const allowedStatus = ['accepted', 'rejected'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Use "accepted" or "rejected"'
            });
        }

        // Find and verify connection request
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUserId,
            status: 'accepted'
        });

        if (!connectionRequest) {
            return res.status(404).json({
                success: false,
                message: 'Connection request not found or already processed'
            });
        }

        // Update request status
        connectionRequest.status = status;
        
        const updatedRequest = await connectionRequest.save();

        return res.status(200).json({
            success: true,
            message: `Connection request ${status} successfully`,
            data : updatedRequest

        });

    } catch (error) {
        console.error('Error reviewing connection request:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});




module.exports = requestRouter;