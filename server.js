const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("express-flash");
const logger = require("morgan");

const mainRoutes = require("./routes/main");
const todoRoutes = require("./routes/todos");

require("dotenv").config({ path: "./config/.env" });

require("./config/passport")(passport);

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.DB_STRING);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch(error) {
        console.log(error);
        process.exit(1);
    }
}

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));

app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use("/", mainRoutes);
app.use("/todos", todoRoutes);

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running.`);
    });
});