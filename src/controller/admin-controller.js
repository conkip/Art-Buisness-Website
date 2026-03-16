import paintingService from "../service/painting-service.js";

async function uploadPainting(req, res) {
    const {
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
    } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No image provided" });

    try {
        const painting = await paintingService.createPainting({
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
        });
        res.status(201).json(painting);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Upload failed" });
    }
}

export default { uploadPainting };
