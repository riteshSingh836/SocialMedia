import { CommentModel } from "../comment/comment.schema.js";
import { PostModel } from "../post/post.schema.js";
import { LikeModel } from "./like.schema.js";
import { ObjectId } from "mongodb";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class LikeRepository {

    async getLikes(id, type) {
        try{
            let likeable;
            if(type === 'Post') {
                likeable = await PostModel.findById(id);
            }else if(type === 'Comment') {
                likeable = await CommentModel.findById(id);
            }
            if (!likeable) {        // done for only checking the id is there or not.
                throw new ApplicationError("No type found with this id", 400);
            }
            const likes = await LikeModel.find({likeable: new ObjectId(id), types: type});
            if (!likes || likes.length == 0) {
                throw new ApplicationError("No likes found", 404);
            }
            return likes;
        }catch(err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }

    async toggleLike(userId, type, id) {
        try{
            let likeable;
            if(type === 'Post') {
                likeable = await PostModel.findById(id);
            }else if(type === 'Comment') {
                likeable = await CommentModel.findById(id);
            }
            if (!likeable) {
                throw new ApplicationError("No type found with this id", 400);
            }

            const existingLike = await LikeModel.findOne({user: new ObjectId(userId), likeable: new ObjectId(id), types: type});
            // here existingLike provide the full object/document, we can access each attribute using dot.
            if (!existingLike) {
                // create a new like
                const newLike = new LikeModel({user: userId, likeable: new ObjectId(id), types: type});
                await newLike.save();

                // now appending this new like in the required "type"
                likeable.likes.push(newLike._id);
                await likeable.save();
                return {message: "Like Added successfully!"};
            }else{
                // delete the existing like
                await LikeModel.findByIdAndDelete(existingLike._id);

                // remove that like._id from the given "type"
                const index = likeable.likes.indexOf(existingLike._id);
                if (index > -1) {
                    likeable.likes.splice(index, 1);
                    likeable.save();
                }
                return {message: "Like removed successfully"};
            }
        }catch(err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }

}