const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const fs = require("fs");
const nodemailer = require('nodemailer');

const User = require('../models/user');

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
    if (req.body.username === "admin") {
        const url = req.protocol + "://" + req.get("host");
        //let date = new Date(req.body.birthdate);
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    imagePath: url + "/images/profileImages/" + req.file.filename,
                    username: req.body.username,
                    password: hash,
                    birthdate: req.body.birthdate,
                    city: req.body.city,
                    country: req.body.country,
                    email: req.body.email,
                    privilege: "A",
                    allowed: "1"
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
    } else {
        const url = req.protocol + "://" + req.get("host");
        //let date = new Date(req.body.birthdate);
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    imagePath: url + "/images/profileImages/" + req.file.filename,
                    username: req.body.username,
                    password: hash,
                    birthdate: req.body.birthdate,
                    city: req.body.city,
                    country: req.body.country,
                    email: req.body.email,
                    privilege: "U",
                    allowed: "0"
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
    }
});

router.post("/signupNoImage", (req, res, next) => {
    if (req.body.username === "admin") {
        const name = Date.now() + "-" + "profile.png";
        const path = "backend/images/profileImages/" + name;
        fs.copyFileSync("backend/images/profileGenericImage/profile.png", path);
        const url = req.protocol + "://" + req.get("host");
        let date = new Date(req.body.birthdate);
        let dateString = date.toDateString();
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    imagePath: url + "/images/profileImages/" + name,
                    username: req.body.username,
                    password: hash,
                    birthdate: dateString,
                    city: req.body.city,
                    country: req.body.country,
                    email: req.body.email,
                    privilege: "A",
                    allowed: "1"
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
    } else {
        const name = Date.now() + "-" + "profile.png";
        const path = "backend/images/profileImages/" + name;
        fs.copyFileSync("backend/images/profileGenericImage/profile.png", path);
        const url = req.protocol + "://" + req.get("host");
        let date = new Date(req.body.birthdate);
        let dateString = date.toDateString();
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    imagePath: url + "/images/profileImages/" + name,
                    username: req.body.username,
                    password: hash,
                    birthdate: dateString,
                    city: req.body.city,
                    country: req.body.country,
                    email: req.body.email,
                    privilege: "U",
                    allowed: "0"
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
    }
});


router.post("/login", (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then((user) => {
            if (!user) {
                res.status(500).json({
                    message: "Unesen je nepostojeci username!",
                    _id: null,
                    username: null,
                    privilege: null
                });
            } else {
                let condition = bcrypt.compareSync(req.body.password, user.password);
                if (!condition) {
                    res.status(500).json({
                        message: "Nije dobra lozinka!",
                        _id: null,
                        username: null,
                        privilege: null
                    });
                } else if (user.allowed === "0") {
                    res.status(500).json({
                        message: "Nalog nije odobren od strane administratora!",
                        _id: null,
                        username: null,
                        privilege: null
                    });
                } else {
                    res.status(200).json({
                        message: " ",
                        _id: user._id,
                        username: user.username,
                        privilege: user.privilege
                    })
                }
            }

        });
});

router.get("/getUser/:id", (req, res, next) => {
    User.findById(req.params.id)
        .then(user => {
            res.status(200).json({
                message: "Sve je ok",
                data: user
            });
        });
});

router.put("/updateUser/:id", (req, res, next) => {
    let date = new Date(req.body.birthdate);
    let dateString = date.toDateString();
    User.updateOne({ _id: req.params.id }, {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            birthdate: dateString,
            city: req.body.city,
            country: req.body.country
        })
        .then(result => {
            if (result.nModified > 0) {
                res.status(200).json({
                    message: "Ok"
                });
            } else {
                res.status(500).json({
                    message: "Nijedno polje nije promenjeno"
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Problem s azuriranjem"
            })
        });
});

router.put("/changePassword/:id", (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .then((user) => {
            if (!user) {
                res.status(500).json({
                    message: "Nepostojeci korisnik!"
                });
            } else {
                let condition = bcrypt.compareSync(req.body.oldPassword, user.password);
                if (!condition) {
                    res.status(500).json({
                        message: "Nije dobra stara lozinka!"
                    });
                } else {
                    bcrypt.hash(req.body.newPassword, 10)
                        .then(hash => {
                            User.updateOne({ _id: req.params.id }, { password: hash })
                                .then(result => {
                                    if (result.nModified > 0) {
                                        console.log(req.body.newPassword)
                                        res.status(200).json({
                                            message: "Ok"
                                        });
                                    } else {
                                        res.status(500).json({
                                            message: "Nijedno polje nije promenjeno"
                                        })
                                    }
                                })
                                .catch(error => {
                                    res.status(500).json({
                                        message: "Problem s promenom lozinke"
                                    });
                                });
                        });
                }
            }

        });

});

const sender = "mean_project@yahoo.com";

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.yahoo.com',
    port: 587,
    service: 'yahoo',
    secure: false,
    auth: {
        user: sender,
        pass: 'pikcxgabrrjhuaar'
    },
    debug: false,
    logger: true,
    tls: { rejectUnauthorized: false }
});

router.get("/resetPassword/:email", (req, res, next) => {
    User.findOne({ email: req.params.email })
        .then((user) => {
            if (!user) {
                res.status(500).json({
                    message: "Unesen je nepostojeci email!",
                    _id: null
                });
            } else if (user.allowed === "0") {
                res.status(500).json({
                    message: "Unesen je mail naloga koji jos uvijek nije odobren!",
                    _id: null
                });
            } else {
                let link = "http://localhost:4200/newPassword/" + user._id;
                let mailOptions = {
                    from: sender,
                    to: user.email,
                    subject: "Slanje poruke za resetovanje lozinke",
                    html: '<p>Klikni <a href=' + link + '>ovde</a> da restartujes svoju lozinku</p>'
                }
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Email sent: " + info.response);
                    }
                });
                res.status(200).json({
                    message: "Poslana je poruka na adresu " + user.email,
                    _id: user._id
                });

            }
        });
});

router.put("/newPassword/:id", (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .then((user) => {
            if (!user) {
                res.status(500).json({
                    message: "Nepostojeci korisnik!",
                    _id: null,
                    username: null,
                    privilege: null
                });
            } else {
                bcrypt.hash(req.body.password, 10)
                    .then(hash => {
                        User.updateOne({ _id: req.params.id }, { password: hash })
                            .then(result => {
                                if (result.nModified > 0) {
                                    console.log(req.body.password)
                                    res.status(200).json({
                                        message: "Ok",
                                        _id: user._id,
                                        username: user.username,
                                        privilege: user.privilege
                                    });
                                } else {
                                    res.status(500).json({
                                        message: "Nijedno polje nije promenjeno",
                                        _id: null,
                                        username: null,
                                        privilege: null
                                    })
                                }
                            })
                            .catch(error => {
                                res.status(500).json({
                                    message: "Problem s promenom lozinke",
                                    _id: null,
                                    username: null,
                                    privilege: nulls
                                });
                            });
                    });
            }

        });
});

router.get("/getUserRegisterRequests", (req, res, next) => {
    User.find({ allowed: "0" })
        .then(users => {
            res.status(200).json({
                message: "Sve je ok",
                data: users
            });
        });
});

router.get("/acceptRegisterRequest/:id", (req, res, next) => {
    User.updateOne({ _id: req.params.id }, {
            allowed: "1"
        })
        .then(result => {
            if (result.nModified > 0) {
                res.status(200).json({
                    message: "Ok"
                });
            } else {
                res.status(500).json({
                    message: "Nijedno polje nije promenjeno"
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Problem s azuriranjem"
            })
        });
});

router.delete("/refuseRegisterRequest/:id", (req, res, next) => {
    User.deleteOne({ _id: req.params.id })
        .then(result => {
            if (result.deletedCount > 0) {
                res.status(200).json({
                    message: "Ok"
                });
            } else {
                res.status(500).json({
                    message: "Nijedno polje nije promenjeno"
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Problem s azuriranjem"
            })
        });
});

router.get("/getRegistredUsers", (req, res, next) => {
    User.find({ allowed: "1", privilege: { $ne: "A" } })
        .then(users => {
            res.status(200).json({
                message: "Sve je ok",
                data: users
            });
        });
});

router.get("/upgradeToModerator/:id", (req, res, next) => {
    User.updateOne({ _id: req.params.id }, {
            privilege: "M"
        })
        .then(result => {
            if (result.nModified > 0) {
                res.status(200).json({
                    message: "Ok"
                });
            } else {
                res.status(500).json({
                    message: "Nijedno polje nije promenjeno"
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Problem s azuriranjem"
            })
        });
});

router.get("/downgradeToUser/:id", (req, res, next) => {
    User.updateOne({ _id: req.params.id }, {
            privilege: "U"
        })
        .then(result => {
            if (result.nModified > 0) {
                res.status(200).json({
                    message: "Ok"
                });
            } else {
                res.status(500).json({
                    message: "Nijedno polje nije promenjeno"
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Problem s azuriranjem"
            })
        });
});


module.exports = router;
