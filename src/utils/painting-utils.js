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
    return (
        value
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z0-9\s]/g, "")
            .split(/\s+/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
            // remove trailing numbers at end of final string to prevent possible file overwriting
            .replace(/(\s*\d+)+$/, "")
    );
}

export function buildImageFileName(name, index = 0) {
    if (!name || typeof name !== "string") return undefined;
    const baseName = normalizeString(name).replace(/\s+/g, "");
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

export function extractKey(url) {
    if (!url) return null;
    if (url.includes(".amazonaws.com/")) {
        return url.split(".amazonaws.com/")[1].split("?")[0];
    }
    return url;
}

export function normalizeSlots(imageTypes, files, imageRefs) {
    const compactTypes = [];
    const compactFiles = [];
    const compactRefs = [];

    let fileIdx = 0;
    let refIdx = 0;

    for (const type of imageTypes) {
        if (type === "new") {
            compactTypes.push("new");
            compactFiles.push(files[fileIdx++]);
        } else if (type === "existing") {
            compactTypes.push("existing");
            compactRefs.push(imageRefs[refIdx++]);
        }
    }

    return {
        imageTypes: compactTypes,
        files: compactFiles,
        imageRefs: compactRefs,
    };
}

const currentFile = typeof process !== "undefined" && process.argv?.[1];
if (currentFile && fileURLToPath(import.meta.url) === currentFile) {
    console.log(
        "painting-utils.js cannot be run directly without additional arguments.",
    );
}
