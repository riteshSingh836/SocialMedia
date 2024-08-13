import express from 'express';
import CommentController from './comment.controller.js';
import { fileupload } from '../../middlewares/fileupload.middleware.js';

const commentRouter = express.Router();
const commentController = new CommentController();

// CRUD operations

// Retrieve

commentRouter.get('/:postId', (req,res,next) => {
    commentController.getCommentsByPostId(req,res,next);
});

// add, update, delete

commentRouter.post('/:postId', fileupload.single('imageUrl'), (req,res,next) => {
    commentController.addComment(req,res,next);
});
commentRouter.put('/:commentId', (req,res,next) => {
    commentController.updateComment(req,res,next);
});
commentRouter.delete('/:commentId', (req,res,next) => {
    commentController.deleteComment(req,res,next);
});

export default commentRouter;