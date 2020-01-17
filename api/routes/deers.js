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

const Deer = require("../models/deer");

router.get("/", (req, res, next)=> {
    res.status(200).json({wiadomosc: "Lista jelonków"});
});

router.post("/", upload.single("deerImage"), checkAuth, (req, res, next)=> {
    console.log(req.file);
    const deer = new Deer({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        deerImage: req.file.path
    });
    deer.save()
    .then(result => {
        res.status(200).json({
            wiadomosc: "Dodanie nowego jelonka",
            stworzonyJelonek: result
        });
    })
    .catch(err => {
        res.status(500).json({error: err});
    });
    
    
});

router.get("/:deerId", (req, res, next)=> {
    const id = req.params.deerId;
    res.status(200).json({wiadomosc: "Szczegóły jelonka o numerze " + id});
});

router.patch("/:deerId", (req, res, next)=> {
    const id = req.params.deerId;
    res.status(200).json({wiadomosc: "Zmiana jelonka o numerze " + id});
});

router.delete("/:deerId", (req, res, next)=> {
    const id = req.params.deerId;
    res.status(200).json({wiadomosc: "Usunięcie jelonka o numerze " + id});
});

module.exports = router;