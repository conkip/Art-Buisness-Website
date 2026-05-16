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
        files,       // new File uploads, in the order they appear among imageTypes
        imageTypes,  // ordered array: "new" | "existing" — one entry per occupied display slot
        imageRefs,   // S3 URLs for "existing" slots, in the order they appear among imageTypes
    },
) {
    ({ imageTypes, files, imageRefs } = normalizeSlots(imageTypes, files, imageRefs));
    const painting = await Painting.findOne({ name });
    if (!painting) return null;
 
    const normalizedNewName = newName ? normalizeString(newName) : painting.name;

    // track all og keys currently in S3
    const originalKeys = new Set();

    for (let i = 0; i < 5; i++) {
        originalKeys.add(buildImageFileName(painting.name, i));
    }

    // track keys that survive after update
    const survivingKeys = new Set();

    const renameOperations = [];

    let newFileIndex = 0;
    let existingRefIndex = 0;
    
    let slot = 0;

    for (let i = 0; i < imageTypes.length; i++) {
        const type = imageTypes[i];
        const newFilename = buildImageFileName(normalizedNewName, i);

        if (type === "existing") {
            const srcUrl = imageRefs[i]; // 👈 direct slot access
            if (!srcUrl) continue;

            const srcKey = extractKey(srcUrl);

            survivingKeys.add(newFilename);

            if (srcKey !== newFilename) {
                renameOperations.push({
                    srcKey,
                    newKey: newFilename,
                });
            }
        }

        if (type === "new") {
            await processAndUpload(files[i], newFilename);
            survivingKeys.add(newFilename);
        }

        if (type === "empty") {
            // ensure deletion safety handled later
        }
    }

    /*
        must do this next part for this scenario:

        slot 0:
        A0 -> A1

        slot 1:
        A1 -> A0

        so that renaming A1 wont overwrite A0
    */

    // phase 1: move existing images to temp keys
    const tempOperations = [];
    for (const op of renameOperations) {
        const srcKey = op.srcUrl.includes(".amazonaws.com/")
            ? op.srcUrl.split(".amazonaws.com/")[1]
            : op.srcUrl;

        const tempKey =
            `temp-${crypto.randomUUID()}-${srcKey}`;

        await s3.renameInS3(
            srcKey,
            tempKey,
            "image/webp",
        );

        tempOperations.push({
            tempKey,
            newFilename: op.newFilename,
        });
    }

    // phase 2: temp -> final
    for (const op of tempOperations) {
        await s3.renameInS3(
            op.tempKey,
            op.newFilename,
            "image/webp",
        );
    }

    // delete the removed or replaced images from s3
    for (const ogKey of originalKeys) {
        if (!survivingKeys.has(ogKey)) {
            try {
                await s3.deleteFromS3(ogKey);
            } catch (_) {
                // already gone is fine
            }
        }
    }

    // update mongo entry in paintings collection
 
    painting.name = normalizedNewName;
    painting.image = buildImageFileName(normalizedNewName, 0);
    painting.dimensions = {
        length: length ? Number(length) : painting.dimensions?.length,
        width:  width  ? Number(width)  : painting.dimensions?.width,
        depth:  depth  ? Number(depth)  : painting.dimensions?.depth,
    };
    painting.date   = date   ? Number(date)   : painting.date;
    painting.paint  = paint  !== undefined ? normalizeString(paint)  : painting.paint;
    painting.canvas = canvas !== undefined ? normalizeString(canvas) : painting.canvas;
    painting.finish = finish !== undefined ? normalizeString(finish) : painting.finish;
    painting.desc   = desc   !== undefined ? desc.trim()            : painting.desc;
    painting.price  = price  ? Number(price)  : painting.price;
    painting.mult   = toBoolean(mult);
    painting.framed = toBoolean(framed);
    painting.sold   = toBoolean(sold);
 
    await painting.save();
    return imageResponse(painting.toObject());
}