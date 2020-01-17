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
        cb(null, true);
    } else {
        cb(null, false);
    }    
}

const upload = multer({ 
    storage: storage,
    limits: {fieldSize: 1024*1024*5},
    fileFilter: fileFilter
});

const Cat = require("../models/cat");

router.get("/", (req, res, next)=> {
    res.status(200).json({wiadomosc: "Lista kotków"});
});

router.post("/", upload.single("catImage"), checkAuth, (req, res, next)=> {
    console.log(req.file);
    const cat = new Cat({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        catImage: req.file.path
    });
    cat.save()
    .then(result => {
        res.status(200).json({
            wiadomosc: "Dodanie nowego kotka",
            stworzonyKotek: result
        });
    })
    .catch(err => {
        res.status(500).json({error: err});
    });
    
    
});

router.get("/:catId", (req, res, next)=> {
    const id = req.params.catId;
    res.status(200).json({wiadomosc: "Szczegóły kotka o numerze " + id});
});

router.patch("/:catId", (req, res, next)=> {
    const id = req.params.catId;
    res.status(200).json({wiadomosc: "Zmiana kotka o numerze " + id});
});

router.delete("/:catId", (req, res, next)=> {
    const id = req.params.catId;
    res.status(200).json({wiadomosc: "Usunięcie kotka o numerze " + id});
});

module.exports = router;