const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const checkAuth = require("../middleware/check-auth");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(":","_").replace(":","_") + file.originalname);
    }
});

const fileFilter = (req, file, cb)=> {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true); //przepuszcza plik
    } else {
        cb(null, false); //odrzuca plik
    }    
}

const upload = multer({ 
    storage: storage,
    limits: {fieldSize: 1024*1024*5},
    fileFilter: fileFilter
});

const Product = require("../models/product");

router.get("/", (req, res, next)=> {
    res.status(200).json({wiadomosc: "Lista wszystkich produktów"});
});

router.post("/", upload.single("productImage"), checkAuth, (req, res, next)=> {
    console.log(req.file);
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save()
    .then(result => {
        res.status(200).json({
            wiadomosc: "Dodanie nowego produktu",
            stworzonyProdukt: result
        });
    })
    .catch(err => {
        res.status(500).json({error: err});
    });
    
    
});

router.get("/:productId", (req, res, next)=> {
    const id = req.params.productId;
    res.status(200).json({wiadomosc: "Szczegóły produktu o numerze " + id});
});

router.patch("/:productId", (req, res, next)=> {
    const id = req.params.productId;
    res.status(200).json({wiadomosc: "Zmiana produktu o numerze " + id});
});

router.delete("/:productId", (req, res, next)=> {
    const id = req.params.productId;
    res.status(200).json({wiadomosc: "Usunięcie produktu o numerze " + id});
});

module.exports = router;