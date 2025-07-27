
// snippet-start:[ses.JavaScript.createclientv3]
const  { SESClient } = require("@aws-sdk/client-ses");
// Set the AWS Region.
const REGION = "us-east-1";
// Create SES service object.
const sesClient = new SESClient({ region: REGION, credentials:{
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SES_SECRET
    } });
// Export the client for use in other modules
module.exports = { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]