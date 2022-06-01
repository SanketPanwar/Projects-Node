"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
let todos = [];
router.get('/', (req, res, next) => {
    return res.status(200).json({ todos: todos });
});
router.post('/todos', (req, res, next) => {
    const body = req.body;
    const newTodo = {
        id: new Date().toISOString(),
        text: body.text
    };
    todos.push(newTodo);
    return res.status(201).json({ todo: newTodo });
});
router.post('/delete/:id', (req, res, next) => {
    const params = req.params;
    const id = params.id;
    let found = false;
    todos = todos.filter(todo => {
        if (todo.id == id)
            found = true;
        return todo.id != id;
    });
    if (!found)
        return res.status(404).json({ result: "item not found" });
    else
        return res.status(201).json({ success: true });
});
router.post('/edit/:id', (req, res, next) => {
    const body = req.body;
    const params = req.params;
    const id = params.id;
    let found = false;
    todos.forEach(todo => {
        if (todo.id == id) {
            todo.text = body.text;
            found = true;
        }
    });
    if (!found)
        return res.status(404).json({ result: "item not found" });
    else
        return res.json({ success: true });
});
exports.default = router;
