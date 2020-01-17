const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const catRoutes = require("./api/routes/cats");
const deerRoutes = require("./api/routes/deers");

const productRoutes = require("./api/routes/products");
const userRoutes = require("./api/routes/users");

mongoose.connect("mongodb+srv://littlezoo:"+ process.env.MONGO_PASS +"@rg-8xuyu.mongodb.net/test?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true });

app.use("/uploads", express.static("uploads"));
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use("/cats", catRoutes);
app.use("/deers", deerRoutes);

app.use("/products", productRoutes);
app.use("/users", userRoutes);

// osbsługa nieznanego routu
app.use((req, res, next)=> {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});
app.use((error, req, res, next)=> {
    res.status(error.status || 500).json({error: error.message});
});

module.exports = app;
