import express from "express";
import multer from "multer";
import {
  uploadAndSummarizeDocument,
  handleQuestion,
  getDocumentDetails,
  getUserDocuments,
} from "../controllers/documentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.route("/").get(protect, getUserDocuments);

router.post(
  "/upload",
  protect,
  upload.single("pdfFile"),
  uploadAndSummarizeDocument
);

router.post("/:id/qa", protect, handleQuestion);

router.get("/:id", protect, getDocumentDetails);

export default router;
