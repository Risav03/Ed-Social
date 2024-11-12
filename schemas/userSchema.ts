import { UserType } from '@/types/types';
import mongoose, { Schema, model, models, trusted } from 'mongoose';

const UserSchema = new Schema<UserType>({

    username: {
        type: String,
        default: "",
        required:true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
      },
      pwd: { 
        type: String, 
        required: true, 
        select: false 
      },
      salt: {
        type: String,
        required: true,
        select: false
      },
    userhandle: {
        type: String,
        unique: true,
        required: true
    },
    profileImage: {
        type: String,
    },
    banner: {
        type: String,
    },
    bio: {
        type: String,
        default: "Enter a really cool description about yourself."
    },
    searchHistory: {
        type: [String],
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

}, { collection: "users" })


UserSchema.index({ username: 'text', email: 'text' });

const User = models.User || model('User', UserSchema);

export default User