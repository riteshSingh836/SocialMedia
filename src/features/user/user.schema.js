import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {type: String, required: [true, "Please enter name"], maxlength: [25, "Length should be under 25 letters"]},
    email: {type: String, required: [true, "Please enter email"], unique: true, match: [/.+\@.+\../, "Please enter a valid email."]},
    password: {type: String, required: [true, "Please enter password"]},
    gender: {type: String, required: [true, "Please enter gender"]},
    avatar: {type: String, default: ""},
    token: [{type: String}],
    // it can have multiple posts
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}]
});

export const UserModel = mongoose.model('User', userSchema);