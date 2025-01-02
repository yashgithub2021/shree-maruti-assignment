import { Block, City, RateMatrix } from "../src/city-block/city-block.model";

export const calculateShipmentCost = async (
    origin: string,
    destination: string,
    weight: number,
    invoiceValue: number,
    riskType: string
) => {

    const block1 = await Block.findOne({ name: origin });
    const block2 = await Block.findOne({ name: destination });

    const originCity = await City.findById(block1?.city)
    const destinationCity = await City.findById(block2?.city)

    if (!originCity?.name || !destinationCity?.name) {
        throw new Error('Origin or Destination city not found');
    }

    const rateMatrix = await RateMatrix.findOne({
        origin: originCity._id,
        destination: destinationCity._id
    });

    if (!rateMatrix) {
        throw new Error('Rate matrix not found for the given origin and destination');
    }

    const baseFreightRate = rateMatrix.rate;

    const baseFreight = Math.max(40, weight) >= 40 ? baseFreightRate * weight : 400;

    const oda1 = Math.max(750, weight * 5);
    const oda2 = Math.max(1500, weight * 7);
    let odaCharge = 0;

    if (originCity?.name != destinationCity?.name) {
        odaCharge = oda1;
        if (odaCharge > 1500) {
            odaCharge = oda2;
        }
    }
    const fuelSurcharge = baseFreight * 0.20;

    const docketCharges = 100;

    const fovCharge = riskType === "carrier" ? Math.max(invoiceValue * 0.02, 300) : Math.max(invoiceValue * 0.0005, 50);

    // Calculate total shipment cost
    const totalCost = baseFreight + odaCharge + fuelSurcharge + docketCharges + fovCharge;

    return {
        baseFreight,
        fuelSurcharge,
        docketCharges,
        fovCharge,
        totalCost
    };
};