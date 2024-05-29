// models/userProfile.js
const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
    username: String,
    fullName: String,
    followerCount: Number,
    followingCount: Number,
    postCount: Number,
    bio: String,
    profilePicUrl: String,
    history: [{
        date: { type: Date, default: Date.now },
        followerCount: Number,
        followingCount: Number,
        postCount: Number
    }]
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', UserProfileSchema);
