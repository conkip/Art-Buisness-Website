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

export default { getAllPaintings, getPaintingByName, deletePainting };
