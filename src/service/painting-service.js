import Painting from "../model/painting.js";
import s3 from "../utils/s3-utils.js";
import {
    normalizePaintingName,
    normalizeString,
    normalizeImageBaseName,
    buildImageFileName,
    processImageBuffer,
} from "../utils/reformat-paintings.js";

const toBoolean = (val) => val === "true" || val === true;

function getUrlList(baseFilename) {
    if (!baseFilename) return [];
    const baseUrl = `${s3.S3_BASE_URL}${baseFilename}`;
    const urls = [baseUrl];
    const [path, query] = baseUrl.split("?");
    const lastDot = path.lastIndexOf(".");
    if (lastDot === -1) return urls;
    const prefix = path.slice(0, lastDot);
    const extension = path.slice(lastDot);
    for (let i = 2; i <= 5; i++) {
        const variant = `${prefix}${i}${extension}`;
        urls.push(query ? `${variant}?${query}` : variant);
    }
    return urls;
}

function imageResponse(painting) {
    const urls = getUrlList(painting.image);
    return {
        ...painting,
        image: urls[0] || null,
        images: urls,
    };
}

async function getAllPaintings() {
    const paintings = await Painting.find({})
        .collation({ locale: "en", strength: 2 })
        .sort({ name: 1 })
        .lean();

    return paintings.map(imageResponse);
}

async function getPaintingByName(name) {
    const painting = await Painting.findOne({ name }).lean();
    if (!painting) return null;
    return imageResponse(painting);
}

async function deletePainting(id) {
    const painting = await Painting.findById(id);
    if (!painting) return;

    try {
        const baseName = normalizeImageBaseName(painting.name);
        for (let i = 0; i < 5; i++) {
            const filename = buildImageFileName(baseName, i);
            await s3.deleteFromS3(filename);
        }
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
    files,
}) {
    const normalizedName = normalizePaintingName(name); // e.g., "black cAt" -> "Black Cat"
    const existing = await Painting.findOne({ name: normalizedName });
    if (existing) {
        throw Object.assign(new Error(`A painting named "${normalizedName}" already exists`), { status: 409 });
    }


    const baseName = normalizeImageBaseName(normalizedName); // e.g., "Black Cat" -> "BlackCat.webp"
    const baseFilename = buildImageFileName(baseName, 0);

    for (let i = 0; i < (files?.length || 0); i++) {
        const filename = buildImageFileName(baseName, i);
        let processedBuffer;
        try {
            processedBuffer = await processImageBuffer(files[i].buffer);
        } catch (err) {
            throw Object.assign(new Error(`Failed to process image "${files[i].originalname}": unsupported format or corrupted file`), { status: 400 });
        }
        try {
            await s3.uploadToS3(processedBuffer, filename, "image/webp");
        } catch (err) {
            throw Object.assign(new Error(`Failed to upload image "${files[i].originalname}" to S3`), { status: 502 });
        }
    }

    const painting = await Painting.create({
        name: normalizedName,
        image: baseFilename,
        dimensions: {
            length: length ? Number(length) : undefined,
            width: width ? Number(width) : undefined,
            depth: depth ? Number(depth) : undefined,
        },
        date: date ? Number(date) : undefined,
        paint: normalizeString(paint),
        canvas: normalizeString(canvas),
        finish: normalizeString(finish),
        desc: desc ? desc.trim() : undefined,
        price: price ? Number(price) : undefined,
        mult: toBoolean(mult),
        framed: toBoolean(framed),
        sold: toBoolean(sold),
    });

    return imageResponse(painting.toObject());
}

async function updatePainting(
    name,
    {
        newName,
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
        files,
        imageSlots = []
    },
) {
    const painting = await Painting.findOne({ name });
    if (!painting) return null;

    const normalizedNewName = newName
        ? normalizePaintingName(newName)
        : painting.name;
    const normalizedPaint =
        paint !== undefined ? normalizeString(paint) : painting.paint;
    const normalizedCanvas =
        canvas !== undefined ? normalizeString(canvas) : painting.canvas;
    const normalizedFinish =
        finish !== undefined ? normalizeString(finish) : painting.finish;
    const normalizedDesc = desc !== undefined ? desc.trim() : painting.desc;
    const normalizedLength = length
        ? Number(length)
        : painting.dimensions?.length;
    const normalizedWidth = width ? Number(width) : painting.dimensions?.width;
    const normalizedDepth = depth ? Number(depth) : painting.dimensions?.depth;
    const normalizedPrice = price ? Number(price) : painting.price;
    const normalizedDate = date ? Number(date) : painting.date;

    const newBaseName = normalizeImageBaseName(normalizedNewName);
    const oldBaseName = normalizeImageBaseName(painting.name);
    const uploadedSlots = new Set();

    // upload new painting images
    if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const slot = imageSlots[i] ?? i;
            uploadedSlots.add(slot);

            const oldFilename = buildImageFileName(oldBaseName, slot);
            const newFilename = buildImageFileName(newBaseName, slot);

            try {
                await s3.deleteFromS3(oldFilename);
            } catch (err) {
                console.warn(`Unable to delete slot ${slot} from S3`, err);
            }

            let processedBuffer;
            try {
                processedBuffer = await processImageBuffer(files[i].buffer);
            } catch (err) {
                throw Object.assign(new Error(`Failed to process image "${files[i].originalname}": unsupported format or corrupted file`), { status: 400 });
            }
            try {
                await s3.uploadToS3(processedBuffer, newFilename, "image/webp");
            } catch (err) {
                throw Object.assign(new Error(`Failed to upload image "${files[i].originalname}" to S3`), { status: 502 });
            }
        }
    }

    // rename old painting images
    if (normalizedNewName !== painting.name) {
        for (let i = 0; i < 5; i++) {
            if (uploadedSlots.has(i)) continue;
            const oldFilename = buildImageFileName(oldBaseName, i);
            const newFilename = buildImageFileName(newBaseName, i);
            try {
                await s3.renameInS3(oldFilename, newFilename, "image/webp");
            } catch (err) {
                console.warn(`Unable to rename S3 file from ${oldFilename} to ${newFilename}`, err);
            }
        }
    }

    painting.name = normalizedNewName;
    painting.image = buildImageFileName(newBaseName, 0);
    painting.dimensions = {
        length: normalizedLength,
        width: normalizedWidth,
        depth: normalizedDepth,
    };
    painting.date = normalizedDate;
    painting.paint = normalizedPaint;
    painting.canvas = normalizedCanvas;
    painting.finish = normalizedFinish;
    painting.desc = normalizedDesc;
    painting.price = normalizedPrice;
    painting.mult = toBoolean(mult);
    painting.framed = toBoolean(framed);
    painting.sold = toBoolean(sold);

    await painting.save();
    return imageResponse(painting.toObject());
}

export default {
    getAllPaintings,
    getPaintingByName,
    deletePainting,
    createPainting,
    updatePainting,
};
