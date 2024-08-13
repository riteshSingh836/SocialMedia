import { ApplicationError } from "../../error-handler/applicationError.js";
import { PostModel } from "../post/post.schema.js";
import { CommentModel } from "./comment.schema.js";

export default class CommentRepository{

    // get comments for a specific post
    async getCommentsByPostId(postId) {
        try{
            // first find post is available or not, then search for the comment in it
            const post = await PostModel.findById(postId);
            if (!post) {
                throw new ApplicationError("No post Found", 400);
            }else{
                const commentsInPost = await CommentModel.find({post: postId});
                if (!commentsInPost) {
                    throw new ApplicationError("No comments found on post", 400);
                }else{
                    return commentsInPost;
                }
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }

    // add, update & delete comments

    async addComment(userId, postId, content) {
        try{
            const post = await PostModel.findById(postId);
            if (!post) {
                throw new ApplicationError("No post Found", 400);
            }else{
                const newComment = await CommentModel({
                    user: userId,
                    post: postId,
                    content
                });
                await newComment.save();
                // Adding this comment on post also
                post.comments.push(newComment);
                await post.save();
                return newComment;
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }

    async updateComment(userId, commentId, content) {
        try{
            const comment = await CommentModel.findById(commentId);
            if (!comment) {
                throw new ApplicationError("No comment found with this ID", 404);
            }else{
                if (comment.user != userId) {
                    throw new ApplicationError("You are not authorized to update this comment", 403);
                }else{
                    // return await CommentModel.findByIdAndUpdate(comment, {content}, {new: true});
                    comment.content = content;
                    return await comment.save();    // here either way is correct.
                }
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }

    async deleteComment(userId, commentId) {
        try{
            const comment = await CommentModel.findById(commentId);
            if (!comment) {
                throw new ApplicationError("No comment found with this ID", 404);
            }else{
                if (comment.user != userId) {
                    throw new ApplicationError("You are not authorized to delete this comment", 403);
                }else{
                    return await CommentModel.findByIdAndDelete(comment);
                }
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }
}