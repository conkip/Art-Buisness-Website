import paintingService from "../service/painting-service.js";

async function getAllPaintings(req, res) {
    const paintings = await paintingService.getAllPaintings();
    res.json(paintings);
}

async function getPaintingByName(req, res) {
    const name = decodeURIComponent(req.params.name);
    const painting = await paintingService.getPaintingByName(name);
    res.json(painting);
}

async function deletePainting(req, res) {
    const id = req.params.id;
    await paintingService.deletePainting(id);
    res.sendStatus(204);
}

async function createPainting(req, res) {
    try {
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
        const files = req.files;
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
            files,
        });
        res.status(201).json(painting);
    } catch (err) {
        res.status(err.status || 500).send(
            err.message || "Error adding painting",
        );
    }
}

async function updatePainting(req, res) {
    try {
        const name = decodeURIComponent(req.params.name);
        const {
            name: newName,
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
        const files = req.files;
        const imageSlots = [].concat(req.body.imageSlots || []).map(Number);
        const painting = await paintingService.updatePainting(name, {
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
            imageSlots,
        });
        if (!painting)
            return res.status(404).json({ error: "Painting not found" });
        res.json(painting);
    } catch (err) {
        res.status(err.status || 500).send(
            err.message || "Error updating painting",
        );
    }
}

export default {
    getAllPaintings,
    getPaintingByName,
    deletePainting,
    createPainting,
    updatePainting,
};
