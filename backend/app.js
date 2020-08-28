const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const userRoutes = require("./routes/users");

const app = express();

mongoose.connect("mongodb+srv://stefan:2f6ZujtBhKTSvtqS@cluster0.hmsch.mongodb.net/projectPIA?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Conected to database");
    })
    .catch(() => {
        console.log("Connection failed!");
    });

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-AlLow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

app.use("/api/user", userRoutes);

module.exports = app;