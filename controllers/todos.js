const Todo = require("../models/Todo");

module.exports = {
    getTodos: async(req, res) => {
        try {
            const todoItems = await Todo.find({ userId:req.user.id });
            const itemsCompleted = await Todo.countDocuments({ userId:req.user.id,completed: true });
            const itemsTotal = await Todo.countDocuments({ userId:req.user.id });
            res.render("todos.ejs", { todos: todoItems, completed: itemsCompleted, total: itemsTotal, user:req.user });
        } catch(err) { console.log(err); }
    },

    createTodo: async(req, res) => {
        try {
            await Todo.create({ todo: req.body.todoItem, completed: false, userId: req.user.id });
            console.log("Todo has been added.");
            res.redirect("/todos");
        } catch(err) { console.log(err); }
    },

    markComplete: async(req, res) => {
        try {
            await Todo.findOneAndUpdate({ _id: req.body.todoIdFromJSFile }, { completed: true });
            console.log("Marked complete.");
            res.json("Marked complete.");
        } catch(err) { console.log(err); }
    },

    markIncomplete: async(req, res) => {
        try {
            await Todo.findOneAndUpdate({ _id: req.body.todoIdFromJSFile }, { completed: false });
            console.log("Marked incomplete.");
            res.json("Marked incomplete");
        } catch(err) { console.log(err); }
    },

    deleteTodo: async(req, res) => {
        try {
            await Todo.findOneAndDelete({ _id: req.body.todoIdFromJSFile });
            console.log("Deleted item.");
            res.json("Deleted item.");
        } catch(err) { console.log(err); }
    }
}
