import TodolistModel from "../models/todo.js"

export const createTodo = async (req, res) => {
    try {
        const { todo_image, todo_name, todo_desc, todo_status } = req.body

        if (!todo_image || !todo_name || !todo_desc || !todo_status) {
            return res.status(400).json({ message: "Please fill in the required fields." })
        }

        const newTodo = await TodolistModel.create({
            todo_image,
            todo_name,
            todo_desc,
            todo_status
        });

        res.status(200).json({ message: "Create a to do list successfully!", newTodo })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}