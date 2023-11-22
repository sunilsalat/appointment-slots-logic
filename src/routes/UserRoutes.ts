import { Router } from "express";
import { createUser, updateUser } from "../controllers/UserController";

const router = Router();

router.post("/create", createUser);
router.post("/update", updateUser);

export default router;
