import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    riotGameName: {
        type: String,
        required: false,
    },
    riotTagLine: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('User', userSchema);