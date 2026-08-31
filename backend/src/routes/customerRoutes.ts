import { Router } from "express";
import { getCustomers } from "../controllers/customersController";

const router = Router();

router.get("/", getCustomers);

export default router;