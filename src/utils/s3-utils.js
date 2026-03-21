// utils/s3.js
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const S3_BASE_URL = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;

const S3 = new S3Client({
    region: process.env.AWS_REGION,
    // no credentials needed — EC2 role handles it automatically
});

const uploadToS3 = async (fileBuffer, fileName, mimeType) => {
    const upload = new Upload({
        client: S3,
        params: {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileName,
            Body: fileBuffer,
            ContentType: mimeType,
        },
    });

    await upload.done();

    // Return the public URL
    return `${S3_BASE_URL}${key}`;
};

const deleteFromS3 = async (imageUrl) => {
    // Extract the key from the URL
    const key = imageUrl.split(".amazonaws.com/")[1];
    await S3.send(
        new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
        }),
    );
};

export default { uploadToS3, deleteFromS3, S3_BASE_URL };
