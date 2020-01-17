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

const Dog = require("../models/dog");

router.get("/", (req, res, next)=> {
    res.status(200).json({wiadomosc: "Lista piesków"});
});

router.post("/", upload.single("dogImage"), checkAuth, (req, res, next)=> {
    console.log(req.file);
    const dog = new Dog({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        dogImage: req.file.path
    });
    dog.save()
    .then(result => {
        res.status(200).json({
            wiadomosc: "Dodanie nowego pieska",
            stworzonyKotek: result
        });
    })
    .catch(err => {
        res.status(500).json({error: err});
    });
    
    
});

router.get("/:dogId", (req, res, next)=> {
    const id = req.params.dogId;
    res.status(200).json({wiadomosc: "Szczegóły pieska o numerze " + id});
});

router.patch("/:dogId", (req, res, next)=> {
    const id = req.params.dogId;
    res.status(200).json({wiadomosc: "Zmiana pieska o numerze " + id});
});

router.delete("/:dogId", (req, res, next)=> {
    const id = req.params.dogId;
    res.status(200).json({wiadomosc: "Usunięcie pieska o numerze " + id});
});

module.exports = router;