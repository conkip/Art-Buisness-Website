import paintingService from "../service/painting-service.js";
 
function parsePaintingBody(body) {
    const { name, length, width, depth, date, paint, canvas, finish, desc, price, mult, framed, sold } = body;
    return { name, length, width, depth, date, paint, canvas, finish, desc, price, mult, framed, sold };
}
 
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
    await paintingService.deletePainting(req.params.id);
    res.sendStatus(204);
}
 
async function createPainting(req, res) {
    try {
        const painting = await paintingService.createPainting({
            ...parsePaintingBody(req.body),
            files: req.files,
        });
        res.status(201).json(painting);
    } catch (err) {
        res.status(err.status || 500).send(err.message || "Error adding painting");
    }
}
 
async function updatePainting(req, res) {
    try {
        const name = decodeURIComponent(req.params.name);
        const { name: newName } = req.body;
        const imageTypes = [].concat(req.body.imageTypes || []);
        const imageRefs  = [].concat(req.body.imageRefs  || []);
        const painting = await paintingService.updatePainting(name, {
            ...parsePaintingBody(req.body),
            newName,
            files: req.files,
            imageTypes,
            imageRefs,
        });
        if (!painting) return res.status(404).json({ error: "Painting not found" });
        res.json(painting);
    } catch (err) {
        res.status(err.status || 500).send(err.message || "Error updating painting");
    }
}
 
export default {
    getAllPaintings,
    getPaintingByName,
    deletePainting,
    createPainting,
    updatePainting,
};