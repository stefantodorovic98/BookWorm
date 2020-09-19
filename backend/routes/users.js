const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const fs = require("fs");
const nodemailer = require('nodemailer');

const User = require('../models/user');
const Follow = require('../models/follow');
const Notification = require('../models/notification');
const UserEvent = require('../models/userEvent');
const InviteEvent = require('../models/inviteEvent');
const ForumMessage = require('../models/forumMessage');

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

router.get("/getUsers/:id", (req, res, next) => {
    User.find({ _id: { $ne: req.params.id }, allowed: "1" })
        .then(user => {
            res.status(200).json({
                message: "Sve je ok",
                data: user
            });
        });
});

router.post("/findUsers", (req, res, next) => {
    User.find({ _id: { $ne: req.body.id }, allowed: "1" })
        .then(users => {
            let firstname = req.body.firstname;
            let lastname = req.body.lastname;
            let username = req.body.username;
            let email = req.body.email;
            if (firstname != null && firstname != "") {
                users = users.filter(function(elem) {
                    let e = "" + elem.firstname;
                    let t = "" + firstname;
                    if (e.toLowerCase().indexOf(t.toLowerCase()) !== -1) return true;
                    else return false;
                });
            }
            if (lastname != null && lastname != "") {
                users = users.filter(function(elem) {
                    let e = "" + elem.lastname;
                    let t = "" + lastname;
                    if (e.toLowerCase().indexOf(t.toLowerCase()) !== -1) return true;
                    else return false;
                });
            }
            if (username != null && username != "") {
                users = users.filter(function(elem) {
                    let e = "" + elem.username;
                    let t = "" + username;
                    if (e.toLowerCase().indexOf(t.toLowerCase()) !== -1) return true;
                    else return false;
                });
            }
            if (email != null && email != "") {
                users = users.filter(function(elem) {
                    let e = "" + elem.email;
                    let t = "" + email;
                    if (e.toLowerCase().indexOf(t.toLowerCase()) !== -1) return true;
                    else return false;
                });
            }

            res.status(200).json({
                message: "Sve je ok",
                data: users
            });
        });
});

router.post("/followUser", (req, res, next) => {
    const follow = new Follow({
        idUser: req.body.idUser,
        username: req.body.username,
        whomFollows: req.body.whomFollows,
        whomUsername: req.body.whomUsername
    });
    follow.save()
        .then(newFollow => {
            res.status(201).json({
                message: "Ok"
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Vec postoji"
            })
        });
});

router.post("/doIFollow", (req, res, next) => {
    Follow.findOne({ idUser: req.body.idUser, whomFollows: req.body.whomFollows })
        .then(user => {
            res.status(200).json({
                message: "Sve je ok",
                data: user
            });
        });
});

router.get("/getAllUsersIFollow/:id", (req, res, next) => {
    Follow.find({ idUser: req.params.id })
        .then(user => {
            res.status(200).json({
                message: "Sve je ok",
                data: user
            });
        });
});

router.get("/getAllUsersMeFollow/:id", (req, res, next) => {
    Follow.find({ whomFollows: req.params.id })
        .then(user => {
            res.status(200).json({
                message: "Sve je ok",
                data: user
            });
        });
});

router.post("/unfollowUser", (req, res, next) => {
    Follow.deleteOne({ idUser: req.body.idUser, whomFollows: req.body.whomFollows })
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

router.post("/notifyFollower", (req, res, next) => {
    const data = new Notification({
        idUser: req.body.idUser,
        idBook: req.body.idBook,
        text: req.body.text,
        read: req.body.read
    });
    data.save()
        .then(newNotification => {
            res.status(201).json({
                message: "Ok"
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Vec postoji"
            })
        });
});

router.get("/getNotReadNotifications/:id", (req, res, next) => {
    Notification.find({ idUser: req.params.id, read: "0" })
        .then(notif => {
            res.status(200).json({
                message: "Sve je ok",
                data: notif
            });
        });
});

router.get("/getAllNotifications/:id", (req, res, next) => {
    Notification.find({ idUser: req.params.id })
        .then(notif => {
            res.status(200).json({
                message: "Sve je ok",
                data: notif
            });
        });
});

router.get("/markReadNotification/:id", (req, res, next) => {
    Notification.updateOne({ _id: req.params.id }, {
            read: "1"
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

router.post("/addEvent", (req, res, next) => {
    let dateBegin = new Date(req.body.dateBegin);
    let dateBeginString = dateBegin.toDateString();
    let dateEndString = "0";
    if (req.body.dateEnd) {
        let dateEnd = new Date(req.body.dateEnd);
        dateEndString = dateEnd.toDateString();
    }
    const userEvent = new UserEvent({
        idUser: req.body.idUser,
        username: req.body.username,
        title: req.body.title,
        dateBegin: dateBeginString,
        dateEnd: dateEndString,
        description: req.body.description,
        type: req.body.type,
        status: req.body.status
    });
    userEvent.save()
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: "Ok",
                id: result._id
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Vec postoji"
            })
        });
});

router.get("/updateEvent/:id", (req, res, next) => {
    UserEvent.updateOne({ _id: req.params.id }, {
            status: "closed"
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

router.get("/getAllEvents", (req, res, next) => {
    UserEvent.find()
        .then(result => {
            res.status(200).json({
                message: "Sve je ok",
                data: result
            });
        });
});

router.get("/getOneEvent/:id", (req, res, next) => {
    UserEvent.findOne({ _id: req.params.id })
        .then(result => {
            res.status(200).json({
                message: "Sve je ok",
                data: result
            });
        });
});

router.get("/closeEvent/:id", (req, res, next) => {
    UserEvent.updateOne({ _id: req.params.id }, {
            status: "closed"
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

router.get("/activeEvent/:id", (req, res, next) => {
    UserEvent.updateOne({ _id: req.params.id }, {
            status: "active"
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

router.post("/inviteUserToEvent", (req, res, next) => {
    const invite = new InviteEvent({
        idEvent: req.body.idEvent,
        idHost: req.body.idHost,
        idGuest: req.body.idGuest,
        text: req.body.text,
        hostInvitation: req.body.hostInvitation,
        userRequest: req.body.userRequest,
        status: req.body.status
    });
    invite.save()
        .then(result => {
            res.status(201).json({
                message: "Ok"
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Vec postoji"
            })
        });
});

router.post("/requestInvite", (req, res, next) => {
    const invite = new InviteEvent({
        idEvent: req.body.idEvent,
        idHost: req.body.idHost,
        idGuest: req.body.idGuest,
        text: req.body.text,
        hostInvitation: req.body.hostInvitation,
        userRequest: req.body.userRequest,
        status: req.body.status
    });
    invite.save()
        .then(result => {
            res.status(201).json({
                message: "Ok"
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Vec postoji"
            })
        });
});

router.post("/getRequest", (req, res, next) => {
    InviteEvent.findOne({ idGuest: req.body.idGuest, idEvent: req.body.idEvent, userRequest: "1", status: "0" })
        .then(user => {
            res.status(200).json({
                message: "Sve je ok",
                data: user
            });
        });
});

router.get("/getAllRequests/:id", (req, res, next) => {
    InviteEvent.find({ idHost: req.params.id, userRequest: "1", status: "0" })
        .then(result => {
            res.status(200).json({
                message: "Sve je ok",
                data: result
            });
        });
});

router.get("/getAllInvitations/:id", (req, res, next) => {
    InviteEvent.find({ idGuest: req.params.id, hostInvitation: "1", status: "0" })
        .then(result => {
            res.status(200).json({
                message: "Sve je ok",
                data: result
            });
        });
});

router.post("/getInvitation", (req, res, next) => {
    InviteEvent.findOne({ idGuest: req.body.idGuest, idEvent: req.body.idEvent, status: "1" })
        .then(user => {
            res.status(200).json({
                message: "Sve je ok",
                data: user
            });
        });
});

router.post("/getNotAcceptedInvitation", (req, res, next) => {
    InviteEvent.findOne({ idGuest: req.body.idGuest, idEvent: req.body.idEvent, status: "0" })
        .then(user => {
            res.status(200).json({
                message: "Sve je ok",
                data: user
            });
        });
});

router.get("/acceptInvitation/:id", (req, res, next) => {
    InviteEvent.updateOne({ _id: req.params.id }, {
            status: "1"
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

router.delete("/refuseInvitation/:id", (req, res, next) => {
    InviteEvent.deleteOne({ _id: req.params.id })
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

router.post("/addForumMessage", (req, res, next) => {
    const message = new ForumMessage({
        idUser: req.body.idUser,
        username: req.body.username,
        idEvent: req.body.idEvent,
        message: req.body.message
    });
    message.save()
        .then(result => {
            res.status(201).json({
                message: "Ok"
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Vec postoji"
            })
        });
});

router.get("/getForumMessages/:id", (req, res, next) => {
    ForumMessage.find({ idEvent: req.params.id })
        .then(result => {
            res.status(200).json({
                message: "Sve je ok",
                data: result
            });
        });
});



module.exports = router;
