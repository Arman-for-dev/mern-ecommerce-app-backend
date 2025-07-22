import express from "express";
import { activateEmail, signIn, signUp, userInformation } from "../controllers/user.controller.js";
import { auth } from "../middleware.js";

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/activation", activateEmail);
router.post("/sign-in", signIn);
router.get("/info", auth, userInformation);

export default router