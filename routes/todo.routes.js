import express from "express";
import { createTodo } from "../controllers/todo.controller.js";

const router = express.Router()

router.post("/add_todo", createTodo)

export default router