import Painting from "../model/painting.js";
import s3 from "../utils/s3-utils.js";
import crypto from "crypto";
import {
    normalizeString,
    buildImageFileName,
    processImageBuffer,
    extractKey,
    normalizeSlots,
} from "../utils/painting-utils.js";

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

/** Process and upload a single new file to S3. Throws with an appropriate status on failure. */
async function processAndUpload(file, filename) {
    let processedBuffer;
    try {
        processedBuffer = await processImageBuffer(file.buffer);
    } catch {
        throw Object.assign(
            new Error(
                `Failed to process image "${file.originalname}": unsupported format or corrupted file`,
            ),
            { status: 400 },
        );
    }
    try {
        await s3.uploadToS3(processedBuffer, filename, "image/webp");
    } catch {
        throw Object.assign(
            new Error(`Failed to upload image "${file.originalname}" to S3`),
            { status: 502 },
        );
    }
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

    for (let i = 0; i < 5; i++) {
        try {
            await s3.deleteFromS3(buildImageFileName(painting.name, i));
        } catch (_) {
            // Slot may not exist — that's fine
        }
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
    const normalizedName = normalizeString(name);
    const existing = await Painting.findOne({ name: normalizedName });
    if (existing) {
        throw Object.assign(
            new Error(`A painting named "${normalizedName}" already exists`),
            { status: 409 },
        );
    }

    for (let i = 0; i < (files?.length || 0); i++) {
        await processAndUpload(files[i], buildImageFileName(normalizedName, i));
    }

    const painting = await Painting.create({
        name: normalizedName,
        image: buildImageFileName(normalizedName, 0),
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
        slots,
    },
) {
    const parsedSlots = JSON.parse(slots || "[]");
    const SLOT_COUNT = Math.max(5, parsedSlots.length);

    const painting = await Painting.findOne({ name });
    if (!painting) return null;

    const normalizedNewName = newName
        ? normalizeString(newName)
        : painting.name;

    const originalKeys = new Set();
    const survivingKeys = new Set();
    const renameOperations = [];

    // old keys
    for (let i = 0; i < SLOT_COUNT; i++) {
        originalKeys.add(buildImageFileName(painting.name, i));
    }

    let fileIndex = 0;

    for (let slot = 0; slot < SLOT_COUNT; slot++) {
        const curSlot = parsedSlots[slot];
        const targetKey = buildImageFileName(normalizedNewName, slot);

        if (!curSlot || curSlot.type === "empty") {
            continue;
        }

        if (curSlot.type === "existing") {
            const srcKey = curSlot.key;

            survivingKeys.add(targetKey);

            if (srcKey && srcKey !== targetKey) {
                renameOperations.push({
                    srcKey,
                    targetKey,
                });
            }
        }

        if (curSlot.type === "new") {
            const file = files?.[fileIndex++];

            if (!file) continue;

            await processAndUpload(file, targetKey);
            survivingKeys.add(targetKey);
        }
    }

    // =========================
    // SAFE RENAME (2 PHASE)
    // =========================

    const tempOps = [];

    for (const op of renameOperations) {
        const tempKey = `temp-${crypto.randomUUID()}-${op.srcKey}`;

        await s3.renameInS3(op.srcKey, tempKey, "image/webp");

        tempOps.push({
            tempKey,
            finalKey: op.targetKey,
        });
    }

    for (const op of tempOps) {
        await s3.renameInS3(op.tempKey, op.finalKey, "image/webp");
    }

    // =========================
    // DELETE OLD UNUSED KEYS
    // =========================

    for (const key of originalKeys) {
        if (!survivingKeys.has(key)) {
            try {
                await s3.deleteFromS3(key);
            } catch (_) {}
        }
    }

    // =========================
    // UPDATE MONGO
    // =========================

    painting.name = normalizedNewName;
    painting.image = buildImageFileName(normalizedNewName, 0);

    painting.dimensions = {
        length: length ? Number(length) : painting.dimensions?.length,
        width: width ? Number(width) : painting.dimensions?.width,
        depth: depth ? Number(depth) : painting.dimensions?.depth,
    };

    painting.date = date ? Number(date) : painting.date;

    painting.paint =
        paint !== undefined ? normalizeString(paint) : painting.paint;
    painting.canvas =
        canvas !== undefined ? normalizeString(canvas) : painting.canvas;
    painting.finish =
        finish !== undefined ? normalizeString(finish) : painting.finish;

    painting.desc = desc !== undefined ? desc.trim() : painting.desc;

    painting.price = price ? Number(price) : painting.price;

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
