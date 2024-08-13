import express from 'express';
import applicationErrorMiddleware from './src/error-handler/applicationError.js';
import loggerMiddleware from './src/middlewares/logger.middleware.js';
import userRouter from './src/features/user/user.routes.js';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import postRouter from './src/features/post/post.routes.js';
import commentRouter from './src/features/comment/comment.routes.js';
import likeRouter from './src/features/like/like.routes.js';
import friendRouter from './src/features/friends/friends.routes.js';
import otpRouter from './src/features/otp/otp.routes.js';

const app = express();

// json parser
app.use(express.json());
// app.use(express.urlencoded({extended:true}));

// logger-middleware
app.use(loggerMiddleware);

app.use('/api/users', userRouter);
app.use('/api/posts', jwtAuth, postRouter);
app.use('/api/comments', jwtAuth, commentRouter);
app.use('/api/likes', jwtAuth, likeRouter);
app.use('/api/friends', jwtAuth, friendRouter);

app.use('/api/otp', jwtAuth, otpRouter);


app.get('/', (req,res) => {
    res.send("Welcome to Postaway");
})

// Error-Handler
app.use(applicationErrorMiddleware);    //running at application level,
//  "next(err)" parameter will reach here (app level) & display our customised Application error to client.

export default app;