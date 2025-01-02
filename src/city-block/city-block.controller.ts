import { StatusCodes } from "http-status-codes";
import catchAsyncError from "../../utils/catch-async-error";
import { calculateShipmentCost } from "../../utils/rate-calculation";
import { Block, City, RateMatrix } from "./city-block.model";
import ErrorHandler from "../../utils/error-handler";

export const addCity = catchAsyncError(async (req: any, res: any, next: any) => {
    const { name } = req.body

    let city = await City.findOne({ name })
    if (city) {
        city.name = name;
        await city.save();
        return res.status(StatusCodes.OK).json({ message: 'City updated successfully', city });
    }
    city = new City({ name });
    await city.save();
    return res.status(StatusCodes.CREATED).json({ message: 'City added successfully', city });
})

export const addBlock = catchAsyncError(async (req: any, res: any, next: any) => {
    const { name, city } = req.body

    const existing_city = await City.findById(city)
    if (!existing_city)
        return next(new ErrorHandler("City not found!", StatusCodes.NOT_FOUND))

    let block = await Block.findOne({ name, city });
    if (block) {
        block.name = name;
        await block.save();
        return res.status(200).json({ message: 'Block updated successfully', block });
    }
    block = new Block({ name, city });
    await block.save();
    return res.status(201).json({ message: 'Block added successfully', block });
})

export const addRate = catchAsyncError(async (req: any, res: any, next: any) => {
    const { origin, destination, rate } = req.body

    if (!origin || !destination || !rate)
        return next(new ErrorHandler("All fields are required", StatusCodes.BAD_REQUEST))

    let rate_matrix = await RateMatrix.findOne({ origin, destination })
    if (rate_matrix) {
        rate_matrix.rate = rate;
        await rate_matrix.save();
        return res.status(200).json({ message: 'Rate matrix updated successfully', rate_matrix });
    }

    rate_matrix = new RateMatrix({ origin, destination, rate });
    await rate_matrix.save();
    return res.status(201).json({ message: 'Rate matrix added successfully', rate_matrix });
})

export const getCityBlock = catchAsyncError(async (req: any, res: any, next: any) => {
    const cities = await City.aggregate([
        {
            $lookup: {
                from: 'blocks',
                localField: '_id',
                foreignField: 'city',
                as: 'blocks',
            },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                blocks: {
                    $map: {
                        input: '$blocks',
                        as: 'block',
                        in: {
                            _id: '$$block._id',
                            name: '$$block.name',
                        },
                    },
                },
            },
        },
    ]);

    if (!cities || cities.length === 0) {
        return res.status(404).json({ success: false, message: 'No cities found' });
    }

    return res.status(200).json({ success: true, cities });
});

export const getRates = catchAsyncError(async (req: any, res: any, next: any) => {
    const rates = await RateMatrix.find().populate('origin destination');

    if (!rates) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'No rates found' });
    }

    return res.status(StatusCodes.OK).json({ rates });
})

export const calculateRate = catchAsyncError(async (req: any, res: any) => {
    const { origin, destination, weight, invoiceValue, riskType } = req.body;

    if (!origin || !destination || !weight || !invoiceValue) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const {
        baseFreight,
        fuelSurcharge,
        docketCharges,
        fovCharge,
        totalCost
    } = await calculateShipmentCost(origin, destination, weight, invoiceValue, riskType);

    return res.json({
        baseFreight, fuelSurcharge, docketCharges, fovCharge, totalCost,
    });

});