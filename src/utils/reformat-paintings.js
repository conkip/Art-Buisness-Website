/*
    Author: Connor Kippes

    Short utility to normalize painting titles and convert images to webp at 1600px width.
*/

import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const maxWidth = 1600;
const supportedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

export function normalizeString(value) {
    if (!value || typeof value !== "string") return undefined;
    return value
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export function normalizePaintingName(value) {
    return normalizeString(value)?.replace(/[?#%]/g, "");
}

export function normalizeImageBaseName(value) {
    if (!value || typeof value !== "string") return undefined;
    return normalizeString(value).replace(/\s+/g, "");
}

export function buildImageFileName(baseName, index = 0) {
    if (!baseName) return undefined;
    return `${baseName}${index === 0 ? "" : index + 1}.webp`;
}

export async function processImageBuffer(buffer) {
    return sharp(buffer)
        .rotate()
        .resize({ width: maxWidth })
        .webp({ quality: 80 })
        .toBuffer();
}

export async function reformatPaintings({ inputFolder, outputFolder, files }) {
    if (!inputFolder || !outputFolder || !files) {
        throw new Error(
            "Missing inputFolder, outputFolder, or files to reformat.",
        );
    }

    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
    }

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (!supportedExtensions.includes(ext)) {
            console.log(`Skipping unsupported file: ${file}`);
            continue;
        }

        const inputPath = path.join(inputFolder, file);
        const outputFileName = path.basename(file, ext) + ".webp";
        const outputPath = path.join(outputFolder, outputFileName);

        try {
            await sharp(inputPath)
                .resize({ width: maxWidth })
                .webp({ quality: 80 })
                .toFile(outputPath);
            console.log(`Processed ${file} -> ${outputFileName}`);
        } catch (err) {
            console.error(`Error processing ${file}:`, err);
        }
    }
}

const currentFile = typeof process !== "undefined" && process.argv?.[1];
if (currentFile && fileURLToPath(import.meta.url) === currentFile) {
    console.log(
        "reformat-paintings.js cannot be run directly without additional arguments.",
    );
}
