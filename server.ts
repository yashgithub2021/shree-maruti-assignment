import { StatusCodes } from "http-status-codes";
import { connectDB } from "./config/db";
import ErrorHandler from "./utils/error-handler";
import app from "./app";

const port = process.env.PORT

const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log('Server is running on port:', port);
        });
    } catch (error) {
        console.error(new ErrorHandler("Failed to connect to DB", StatusCodes.INTERNAL_SERVER_ERROR));
        process.exit(1);
    }
}

startServer();