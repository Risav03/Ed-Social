import { PostType } from '@/types/types';
import mongoose, { Schema, model, models, trusted } from 'mongoose';

const PostSchema = new Schema<PostType>({

    createdBy:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    content:{
        type:String,
        default:""
    },
    media:{
        type:String,
        default:""
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

}, { collection: "posts" })


const Post = models.Post || model('Post', PostSchema);

export default Post