import express from "express";
import paintingController from "../controller/painting-controller.js";
import { requireAdmin } from "../utils/auth.js";

const router = express.Router();

router.get("/", paintingController.getAllPaintings);
router.get("/:name", paintingController.getPaintingByName);
router.delete("/:id", requireAdmin, paintingController.deletePainting);

export default router;
