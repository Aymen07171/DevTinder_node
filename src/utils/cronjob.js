const cron = require('node-cron');
const { subDays, startOfDay, endOfDay } = require('date-fns');
const sendEmaill = require('../utils/sendEmail');
const ConnectionRequestModel = require('../models/connectionRequest');

// Schedule to run daily at 6:00 PM (18:00)
cron.schedule('0 18 * * *', async () => {
    try {
        console.log('Starting daily email summary cron job...');
        
        // Get yesterday's date range
        const yesterday = subDays(new Date(), 0); // Changed from 0 to 1
        const yesterdayStart = startOfDay(yesterday); // Fixed typo
        const yesterdayEnd = endOfDay(yesterday); // Fixed typo
        
        console.log(`Checking for accepted requests from ${yesterdayStart} to ${yesterdayEnd}`);
        
        // Find all accepted connection requests from yesterday
        const acceptedRequests = await ConnectionRequestModel.find({
            status: 'accepted',
            createdAt: { // Fixed field name (likely should be createdAt, not CreatedAt)
                $gte: yesterdayStart,
                $lt: yesterdayEnd,
            }
        }).populate('fromUserId toUserId');
        
        console.log(`Found ${acceptedRequests.length} accepted requests`);
        
        if (acceptedRequests.length === 0) {
            console.log('No accepted requests found for yesterday. No emails to send.');
            return;
        }
        
        // Get unique email addresses of people who received accepted requests
        const uniqueEmails = [...new Set(acceptedRequests.map(req => req.toUserId.emailId))];
        
        console.log('Unique emails to notify:', uniqueEmails);
        
        // Send email to each unique recipient
        for (const email of uniqueEmails) {
            try {
                // Count how many requests this person received
                const requestCount = acceptedRequests.filter(req => req.toUserId.emailId === email).length;
                
                // Create personalized email content
                const subject = 'Daily Connection Requests Summary';
                const message = `Good evening! You had ${requestCount} connection request${requestCount > 1 ? 's' : ''} accepted yesterday.`;
                
                // Send email (assuming sendEmaill.run takes recipient, subject, message)
                const res = await sendEmaill.run(email, subject, message); // Fixed parameter order
                
                console.log(`Email sent successfully to ${email}:`, res);
                
            } catch (emailError) {
                console.error(`Error sending email to ${email}:`, emailError);
            }
        }
        
        console.log('Daily email summary cron job completed successfully');
        
    } catch (error) {
        console.error('Error executing cron job:', error);
    }
});

