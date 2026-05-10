// utils/s3.js
import {
    S3Client,
    DeleteObjectCommand,
    CopyObjectCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.AWS_REGION;

const S3_BASE_URL = `https://${bucketName}.s3.${region}.amazonaws.com/`;

const S3 = new S3Client({
    region,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const uploadToS3 = async (fileBuffer, fileName, mimeType) => {
    const upload = new Upload({
        client: S3,
        params: {
            Bucket: bucketName,
            Key: fileName,
            Body: fileBuffer,
            ContentType: mimeType,
        },
    });

    await upload.done();
    return `${S3_BASE_URL}${fileName}`;
};

const deleteFromS3 = async (imageUrlOrKey) => {
    const key = imageUrlOrKey.includes(".amazonaws.com/")
        ? imageUrlOrKey.split(".amazonaws.com/")[1]
        : imageUrlOrKey;

    await S3.send(
        new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
        }),
    );
};

const copyInS3 = async (sourceKey, destinationKey, mimeType) => {
    await S3.send(
        new CopyObjectCommand({
            Bucket: bucketName,
            CopySource: `${bucketName}/${sourceKey}`,
            Key: destinationKey,
            ContentType: mimeType,
            MetadataDirective: "REPLACE",
        }),
    );
    return `${S3_BASE_URL}${destinationKey}`;
};

const renameInS3 = async (oldKeyOrUrl, newKey, mimeType = "image/webp") => {
    const sourceKey = oldKeyOrUrl.includes(".amazonaws.com/")
        ? oldKeyOrUrl.split(".amazonaws.com/")[1]
        : oldKeyOrUrl;

    if (sourceKey === newKey) {
        return `${S3_BASE_URL}${newKey}`;
    }

    await copyInS3(sourceKey, newKey, mimeType);
    await deleteFromS3(sourceKey);
    return `${S3_BASE_URL}${newKey}`;
};

export default { uploadToS3, deleteFromS3, renameInS3, S3_BASE_URL };
