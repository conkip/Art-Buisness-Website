box._state = {
    type: "empty" | "existing" | "new",
    file: File | null,
    key: string | null,      // S3 key only
    url: string | null,      // for preview only
    blobUrl: string | null   // lifecycle tracked safely
};