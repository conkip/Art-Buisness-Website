import express from "express";
import paintingController from "../controller/painting-controller.js";
import { requireAdmin } from "../utils/auth-utils.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", paintingController.getAllPaintings);
router.get("/:name", paintingController.getPaintingByName);
router.post(
    "/",
    requireAdmin,
    upload.array("images", 5),
    paintingController.createPainting,
);
router.put(
    "/:name",
    requireAdmin,
    upload.array("images", 5),
    paintingController.updatePainting,
);
router.delete("/:id", requireAdmin, paintingController.deletePainting);

export default router;
