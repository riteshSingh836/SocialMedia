import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {type: String, required: [true, "Please write the content to proceed"]},
    // User will be common for all, it shows on which user id comments are being posted
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Like', required: true}]
});

export const CommentModel = mongoose.model('Comment', commentSchema);