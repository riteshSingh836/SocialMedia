import { ObjectId } from "mongodb";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { UserModel } from "../user/user.schema.js";
import { PostModel } from "./post.schema.js";

export default class PostRepository {

    async addPost(caption,imageUrl,user) {
        try{
            // creating post Object
            const newPost = {user,caption,imageUrl};
            const createdPost = new PostModel(newPost);
            await createdPost.save();
            // find user and append this created post to it
            const userFound = await UserModel.findById(user);    //here it is userId
            userFound.posts = createdPost;
            await userFound.save();
            return createdPost;          
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }

    async getPostById(postId) {
        try{
            const getPost = await PostModel.findById(postId);
            return getPost;           
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);           
        }
    }

    async getPostByUserId(userId) {
        try{
            const getUserPost = await PostModel.find({user: userId});
            return getUserPost;
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);           
        }
    }

    async getAllPost() {
        try{
            const allPosts = await PostModel.find();
            // console.log(allPosts);
            return allPosts;
        }catch(err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }

    async updatePost(postId, userId, updatedPostData) {
        try{
            const post = await PostModel.findById(postId);
            if (post.user != userId) {
                throw new ApplicationError("You are not allowed to update this post", 404);
            }else{
                const postUpdated =  await PostModel.findByIdAndUpdate(postId, updatedPostData, {new: true});
                await postUpdated.save();
                return postUpdated;
            }
        }catch(err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }

    async deletePost(postId, userId) {
        try{
            const post = await PostModel.findById(postId);
            if (post.user != userId) {
                throw new ApplicationError("You are not allowed to delete this post", 404);
            }else{
                return await PostModel.findByIdAndDelete(postId);
            }
        }catch(err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }

}