import app from "./index.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";

app.listen(8000, () => {
    console.log("Server is listening to port 8000");
    connectUsingMongoose();
})

