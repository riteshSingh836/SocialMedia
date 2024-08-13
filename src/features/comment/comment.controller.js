import CommentRepository from "./comment.repository.js";


export default class CommentController{

    constructor() {
        this.commentRepository = new CommentRepository();
    }

    // get comments for a specific post
    async getCommentsByPostId(req,res,next) {
        try{
            const {postId} = req.params;
            const getPostComment = await this.commentRepository.getCommentsByPostId(postId);
            if (!getPostComment) {
                return res.status(400).send("No Post comment found");
            }else{
                return res.status(200).send(getPostComment);
            }
        }catch(err){
            next(err);
        }
    }

    // add, update & delete comeents

    async addComment(req,res,next) {
        try{
            const userId = req.userId;
            const {postId} = req.params;    // or -> const postId = req.params.postId;
            const {content} = req.body;
            const newComment = await this.commentRepository.addComment(userId, postId, content);
            if (!newComment) {
                return res.status(400).send("No comments added");
            }else{
                return res.status(201).send("Comments added successfully");
            }
        }catch(err){
            next(err);
        }
    }

    async updateComment(req,res,next) {
        try{
            const userId = req.userId;
            const {commentId} = req.params;
            const {content} = req.body;
            const commentUpdated = await this.commentRepository.updateComment(userId, commentId, content);
            if (!commentUpdated) {
                return res.status(400).send('Comment updation failed');
            }else{
                return res.status(200).send("Comment updation successfull");
            }
        }catch(err){
            next(err);
        }
    }

    async deleteComment(req,res,next) {
        try{
            const userId = req.userId;
            const {commentId} = req.params;
            const commentDeleted = await this.commentRepository.deleteComment(userId, commentId);
            if (!commentDeleted) {
                return res.status(400).send('Comment deletion failed');
            }else{
                return res.status(200).send("Comment deletion successfull");
            }
        }catch(err){
            next(err);
        }
    }

}