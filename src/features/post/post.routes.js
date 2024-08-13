import express from 'express';
import PostController from './post.controller.js';
import { fileupload } from '../../middlewares/fileupload.middleware.js';

const postRouter = express.Router();
const postController = new PostController();

// CRUD operations

// Retrieve

postRouter.get('/all', (req,res,next) => {      //this was throwing error when kept below, therefore keep it above all
    postController.getAllPost(req,res,next);
});
postRouter.get('/user-post', (req,res,next) => {      //this was throwing error when kept below, therefore keep it above all
    postController.getPostByUserId(req,res,next);
});
postRouter.get('/:postId', (req,res,next) => {
    postController.getPostById(req,res,next);
});

// add, update, delete

postRouter.post('/', fileupload.single('imageUrl'), (req,res,next) => {
    postController.addPost(req,res,next);
});
postRouter.put('/:postId', (req,res,next) => {
    postController.updatePost(req,res,next);
});
postRouter.delete('/:postId', (req,res,next) => {
    postController.deletePost(req,res,next);
});

export default postRouter;