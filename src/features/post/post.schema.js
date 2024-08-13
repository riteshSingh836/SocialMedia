import mongoose, { Mongoose } from "mongoose";

const postSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    caption: {type: String, required: [true, "Please enter Caption"]},
    imageUrl: {type: String, required: [true, "Please enter image Url"]},
    createdAt: {type: Date, default: Date.now},
    // Single User and multiple likes and comments
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Like'}],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

export const PostModel = mongoose.model('Post', postSchema);