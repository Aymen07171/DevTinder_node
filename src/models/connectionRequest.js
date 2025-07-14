const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {  // Identifiant de l'utilisateur qui envoie la demande
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the user collection 
        required: true
    },
    toUserId: {    // Identifiant de l'utilisateur qui reçoit la demande
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ['ignored', 'accepted', 'rejected'],
            message: '{VALUE} n\'est pas un statut valide. Statuts autorisés : interested, ignored, pending, accepted, rejected'
        },
        default: 'pending'
    }
}, {
    timestamps: true // Crée automatiquement createdAt et updatedAt
});

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);
module.exports = ConnectionRequest;