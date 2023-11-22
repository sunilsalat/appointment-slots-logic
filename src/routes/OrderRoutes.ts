import { Router } from "express";
import {
    checkAvailability,
    createOrder,
    updateOrder,
} from "../controllers/OderController";

const router = Router();

router.post("/create", createOrder);
router.post("/slots", checkAvailability);

export default router;
