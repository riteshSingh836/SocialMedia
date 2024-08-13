

export class ApplicationError extends Error {
    constructor(message,code) {
        super(message);
        this.code = code;
    }
}

const applicationErrorMiddleware = (err,req,res,next) => {
    if (err instanceof ApplicationError) {
        res.status(err.code).send(err.message);
    }else{
        // console.log(err);
        res.status(500).send("Something went wrong, Please try again");
    }
    next();
}

export default applicationErrorMiddleware;