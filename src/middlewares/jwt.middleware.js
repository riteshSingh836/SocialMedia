import jwt from 'jsonwebtoken';
import { ApplicationError } from '../error-handler/applicationError.js';

const jwtAuth = (req,res,next) => {
    // Read token from headers
    const token = req.headers["authorization"];

    if (!token) {
        throw new ApplicationError("Unauthorized", 401);
    }

    try{
        const payload = jwt.verify(token, "vd5F1vjcdYUBRO9ZQiHXSSjFKuDH7Hli");
        // extracting userId value, so that we can use it further
        req.userId = payload.userId;

    }catch(err){
        throw new ApplicationError("Unauthorized catch error", 401);
    }
    next();     //NOTE: its not necessary to send next(err) whenever we throw new ApplicationError.
    // Passing this Application error to the next middleware is important, therefore use next() only (not the err in it).
}

export default jwtAuth;