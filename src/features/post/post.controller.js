import { ApplicationError } from "../../error-handler/applicationError.js";
import PostRepository from "./post.repository.js";


export default class PostController {

    constructor() {
        this.postRepository = new PostRepository();
    }

    async addPost(req,res,next) {
        try{
            const {caption} = req.body;
            const imageUrl = req.file.filename;
            const user = req.userId;
            
            const postCreated = await this.postRepository.addPost(caption, imageUrl, user);
            res.status(201).send(postCreated);
        }catch(err) {
            next(err);
        }
    }
    
    async getPostById(req,res,next) {
        try{
            const {postId} = req.params;   //Note: here params name should be same while retrieving, eg-> postid should be written as postId as in router url is as :postId
            const getPost = await this.postRepository.getPostById(postId);
            if (!getPost) {
                throw new ApplicationError("Post not Found", 400);
            }else{
                res.status(200).send(getPost);
            }
        }catch(err){
            next(err);
        }
    }

    async getPostByUserId(req,res,next) {
        try{
            const userId = req.userId;
            const getUserPost = await this.postRepository.getPostByUserId(userId);
            if (!getUserPost) {
                throw new ApplicationError("No user post found", 400);
            }else{
                res.status(200).send(getUserPost);
            }
        }catch(err){
            next(err);
        }
    }

    async getAllPost(req,res,next) {
        try{
            const allPosts = await this.postRepository.getAllPost();
            if (!allPosts) {
                throw new ApplicationError("No post found!!", 400);
            }else{
                res.status(200).send(allPosts);
            }
        }catch(err){
            next(err);
        }
    }

    async updatePost(req,res,next) {
        try{
            const {postId} = req.params;
            const userId = req.userId;
            const updatedPostData = {};     //empty object
            if (req.body.caption) {
                updatedPostData.caption = req.body.caption;
            }
            if (req.file) {
                updatedPostData.imageUrl = req.file.filename;
            }
            const updatedPost = await this.postRepository.updatePost(postId, userId, updatedPostData);
            if (!updatedPost) {
                throw new ApplicationError("Post was not updated", 400);
            }else{
                res.status(201).send("Post updated successfully");
            }
        }catch(err){
            next(err);
        }
    }

    async deletePost(req,res,next) {
        try{
            const {postId} = req.params;
            const userId = req.userId;
            const deletedPost = await this.postRepository.deletePost(postId, userId);
            if (!deletedPost) {
                throw new ApplicationError("Post was not deleted", 400);
            }else{
                res.status(201).send("Post deleted successfully");
            }
        }catch(err){
            next(err);
        }
    }

}