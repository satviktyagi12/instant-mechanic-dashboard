import { Router } from "express";
import { getMechanics } from "../controllers/mechanicsController";

const router = Router();

router.get("/", getMechanics);

export default router;