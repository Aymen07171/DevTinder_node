const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is not valid");
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (value.length < 6) {
                throw new Error("Password must be at least 6 characters long");
            }
        }
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Gender data is not valid");
            }
        },
    },
    photoUrl: {
        type: String,
        default: "",
    },
    skills: {
        type: [String],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Check if password is already hashed
function isPasswordHashed(password) {
    // bcrypt hashes start with $2a$, $2b$, or $2y$ and are 60 chars long
    return password.startsWith('$2') && password.length === 60;
}

// Pre-save hook
userSchema.pre('save', async function (next) {
    const user = this;

    // Hash password if it's new, modified, or not already hashed
    if (user.isNew || user.isModified('password')) {
        if (!isPasswordHashed(user.password)) {
            try {
                const saltRounds = 10;
                user.password = await bcrypt.hash(user.password, saltRounds);
            } catch (error) {
                return next(error);
            }
        }
    }

    // Generate photoUrl if missing or email changed
    if (user.isNew || user.isModified('emailId') || !user.photoUrl) {
        const hash = crypto.createHash('md5')
            .update(user.emailId.trim().toLowerCase())
            .digest('hex');
        // Changed from d=404 to d=identicon to avoid 404 errors
        user.photoUrl = `https://www.gravatar.com/avatar/${hash}?s=200&d=identicon&r=g`;
    }

    next();
});

// Static method to process imported data
userSchema.statics.processImportedData = async function() {
    try {
        const users = await this.find({
            $or: [
                { password: { $not: /^\$2[ayb]\$/ } }, // Not hashed
                { photoUrl: { $in: [null, ""] } }      // Missing photoUrl
            ]
        });

        console.log(`Processing ${users.length} users...`);

        for (const user of users) {
            let needsUpdate = false;

            // Hash password if not already hashed
            if (!isPasswordHashed(user.password)) {
                user.password = await bcrypt.hash(user.password, 10);
                needsUpdate = true;
            }

            // Generate photoUrl if missing
            if (!user.photoUrl) {
                const hash = crypto.createHash('md5')
                    .update(user.emailId.trim().toLowerCase())
                    .digest('hex');
                // Changed from d=404 to d=identicon to avoid 404 errors
                user.photoUrl = `https://www.gravatar.com/avatar/${hash}?s=200&d=identicon&r=g`;
                needsUpdate = true;
            }

            if (needsUpdate) {
                await user.save();
                console.log(`Updated user: ${user.firstName} ${user.lastName}`);
            }
        }

        console.log('Processing complete!');
    } catch (error) {
        console.error('Error processing imported data:', error);
    }
};

// Instance methods
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

userSchema.methods.generateToken = function () {
    const payload = {
        id: this._id,
        emailId: this.emailId,
        firstName: this.firstName,
        lastName: this.lastName
    };
    
    return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '7d'
    });
};


// Add this method to compare passwords
userSchema.methods.passwordMatch = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
};

// Example getJWTToken method (if not already present)
userSchema.methods.getJWTToken = function () {
    const JWT_SECRET = process.env.JWT_SECRET || 'JWT@DAIKI@2025';
    return jwt.sign({ _id: this._id }, JWT_SECRET, { expiresIn: '2h' });
};

module.exports = mongoose.model('User', userSchema);