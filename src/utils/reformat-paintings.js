/*
    Author: Connor Kippes

    short script using node tool 'sharp' to resize all paintings to at most 1600 px wide and webp format
    to optimize web performance.
*/

import sharp from "sharp";
import path from "path";
const maxWidth = 1600;
const supportedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

function reformatPaintings() {
    files.forEach((file) => {
        const ext = path.extname(file).toLowerCase();

        if (!supportedExtensions.includes(ext)) {
            console.log(`Skipping unsupported file: ${file}`);
            return;
        }

        const inputPath = path.join(inputFolder, file);
        const outputFileName = path.basename(file, ext) + ".webp";
        const outputPath = path.join(outputFolder, outputFileName);

        sharp(inputPath)
            .resize({ width: maxWidth })
            .webp({ quality: 80 })
            .toFile(outputPath)
            .then(() => {
                console.log(`Processed ${file} -> ${outputFileName}`);
            })
            .catch((err) => {
                console.error(`Error processing ${file}:`, err);
            });
    });
}

export default reformatPaintings;
