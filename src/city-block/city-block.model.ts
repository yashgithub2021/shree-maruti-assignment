import mongoose, { model, Mongoose } from "mongoose";

const city = new mongoose.Schema({
    name: { type: String, required: true },
    blocks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Block' }],
});

const block = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true }
})

const rateMatrixSchema = new mongoose.Schema({
    origin: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    rate: { type: Number, required: true },
});

export const City = model('City', city);
export const Block = model('Block', block);
export const RateMatrix = model('RateMatrix', rateMatrixSchema);
