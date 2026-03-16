import Painting from "../model/painting.js";
import s3 from "../utils/s3.js";

async function getAllPaintings() {
    const paintings = await Painting.find({})
        .collation({ locale: "en", strength: 2 })
        .sort({ name: 1 })
        .lean();

    return paintings.map((p) => ({
        ...p,
        image: `${s3.S3_BASE_URL}${p.image}`,
    }));
}

async function getPaintingByName(name) {
    const painting = await Painting.findOne({ name }).lean();
    if (!painting) return null;
    return {
        ...painting,
        image: `${s3.S3_BASE_URL}${painting.image}`,
    };
}

async function deletePainting(id) {
    const painting = await Painting.findById(id);
    if (!painting) return;

    try {
        await deleteFromS3(painting.image);
    } catch (err) {
        console.warn("Unable to delete from S3", err);
    }

    await Painting.findByIdAndDelete(id);
}

async function createPainting({
    name,
    length,
    width,
    depth,
    date,
    paint,
    canvas,
    finish,
    desc,
    price,
    mult,
    framed,
    sold,
    file,
}) {
    const imageUrl = await uploadToS3(
        file.buffer,
        file.originalname,
        file.mimetype,
    );

    const painting = await Painting.create({
        name,
        image: imageUrl,
        dimensions: {
            length: length ? Number(length) : undefined,
            width: width ? Number(width) : undefined,
            depth: depth ? Number(depth) : undefined,
        },
        date,
        paint,
        canvas,
        finish,
        desc,
        price: price ? Number(price) : undefined,
        mult: mult !== undefined ? Boolean(mult) : false,
        framed: framed !== undefined ? Boolean(framed) : false,
        sold: sold !== undefined ? Boolean(sold) : false,
    });

    return painting;
}

export default {
    getAllPaintings,
    getPaintingByName,
    deletePainting,
    createPainting,
};
