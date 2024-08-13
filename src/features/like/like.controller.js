import { ApplicationError } from "../../error-handler/applicationError.js";
import LikeRepository from "./like.repository.js";


export default class LikeController {

    constructor() {
        this.likeRepository = new LikeRepository();
    }

    async getLikes(req,res,next) {
        try{
            const {id} = req.params;
            const {type} = req.body;
            if(type != 'Post' && type != 'Comment') {
                throw new ApplicationError("Please enter a valid type i.e 'Post or 'Comment'.", 400);
            }
            if(!id) {
                throw new ApplicationError("Please enter an id", 400);
            }
            const likes = await this.likeRepository.getLikes(id, type);
            if(!likes) {
                throw new ApplicationError("like not received, something went wrong", 404);
            }
            return res.status(200).send(likes);
        }catch(err) {
            next(err);
        }
    }

    async toggleLike(req,res,next) {
        try {
            const {id} = req.params;
            const {type} = req.body;
            const userId = req.userId;
            if(type != 'Post' && type != 'Comment') {
                throw new ApplicationError("Please enter a valid type i.e 'Post or 'Comment'.", 400);
            }
            if(!id) {
                throw new ApplicationError("Please enter an id", 400);
            }
            const toggleLike = await this.likeRepository.toggleLike(userId, type, id);
            if (!toggleLike) {
                throw new ApplicationError("Like cannot be toggled, something went wrong!!", 404);
            }
            return res.status(201).send(toggleLike.message);
        }catch(err) {
            next(err);
        }
    }

}