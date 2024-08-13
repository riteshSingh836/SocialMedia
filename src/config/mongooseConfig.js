import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.DB_URL;

export const connectUsingMongoose = async() => {
    try{
        await mongoose.connect(url);
        console.log("Mongodb using mongoose is connected");
    }catch(err) {
        console.log("Error while connecting to DB: " + err);
    }
}