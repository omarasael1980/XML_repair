import { modifyXml } from "../controllers/work.js";
import express from "express";
const router = express.Router();

//corregir XML
router.post("/", modifyXml);

export default router;
