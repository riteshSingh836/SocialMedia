import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    // done by single user, has multiple refernces(Many-to-Many)
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    likeable: {type: mongoose.Schema.Types.ObjectId, refPath: 'types'},
    types: {type: String, enum: ["Post", "Comment"], required: true}
});

export const LikeModel = mongoose.model('Like', likeSchema);