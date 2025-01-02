import express from 'express';
import dotenv from 'dotenv';
import errorMiddleware from './middleware/error';
import { shipmentRouter } from './src/city-block/city-block.index';

dotenv.config({ path: './config/.env' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: any, res: any) =>
    res.send(`<h1>Its working. Click to visit Link.!!!</h1>`)
);

app.use('/api', shipmentRouter)

app.all("*", (req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

app.use(errorMiddleware)

export default app