const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const fs = require("fs");

const RegisterRequest = require('../models/user');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "backend/images/profileImages"); //relativno u odnosu na server
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase();
        cb(null, Date.now() + "-" + name);
    }
});

router.post("/signupImage", multer({ storage: storage }).single("image"), (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new RegisterRequest({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                imagePath: url + "/images/profileImages/" + req.file.filename,
                username: req.body.username,
                password: hash,
                birthdate: req.body.birthdate,
                city: req.body.city,
                country: req.body.country,
                email: req.body.email
            });
            user.save()
                .then(newUser => {
                    console.log(user);
                    res.status(201).json({
                        message: " "
                    });
                })
                .catch(error => {
                    console.log(user);
                    const path = "backend/images/profileImages/" + req.file.filename;
                    fs.unlinkSync(path);
                    res.status(500).json({
                        message: "Uneseni username ili email se vec koristi"
                    });
                });
        });
});

router.post("/signupNoImage", (req, res, next) => {
    const name = Date.now() + "-" + "profile.png";
    const path = "backend/images/profileImages/" + name;
    fs.copyFileSync("backend/images/profileGenericImage/profile.png", path);
    const url = req.protocol + "://" + req.get("host");
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new RegisterRequest({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                imagePath: url + "/images/profileImages/" + name,
                username: req.body.username,
                password: hash,
                birthdate: req.body.birthdate,
                city: req.body.city,
                country: req.body.country,
                email: req.body.email
            });
            user.save()
                .then(newUser => {
                    console.log(user);
                    res.status(201).json({
                        message: " "
                    });
                })
                .catch(error => {
                    console.log(user);
                    const path = "backend/images/profileImages/" + name;
                    fs.unlinkSync(path);
                    res.status(500).json({
                        message: "Uneseni username ili email se vec koristi"
                    });
                });
        });
});

router.post("/resetPassword", (req, res, next) => {

});



router.get("/get", (req, res, next) => {
    User.find()
        .then(documents => {
            res.status(200).json({
                message: "Ok",
                users: documents
            });
        });

});

module.exports = router;
