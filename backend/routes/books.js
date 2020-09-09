const express = require("express");
const multer = require("multer");
const fs = require("fs");

const Books = require('../models/book');
const Genre = require('../models/genre');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "backend/images/bookImages");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase();
        cb(null, Date.now() + "-" + name);
    }
});

router.post("/addBookImage", multer({ storage: storage }).single("image"), (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const book = new Books({
        title: req.body.title,
        imagePath: url + "/images/bookImages/" + req.file.filename,
        authors: req.body.authors,
        issueDate: req.body.issueDate,
        genres: req.body.genres,
        description: req.body.description,
        allowed: req.body.allowed
    });
    book.save()
        .then(newBook => {
            console.log(newBook);
            res.status(201).json({
                message: "Ok"
            });
        });
});



router.post("/addBookNoImage", (req, res, next) => {
    const name = Date.now() + "-" + "book.jpg";
    const path = "backend/images/bookImages/" + name;
    fs.copyFileSync("backend/images/bookGenericImage/book.jpg", path);
    const url = req.protocol + "://" + req.get("host");
    let date = new Date(req.body.issueDate);
    let dateString = date.toDateString();
    const book = new Books({
        title: req.body.title,
        imagePath: url + "/images/bookImages/" + name,
        authors: req.body.authors,
        issueDate: dateString,
        genres: req.body.genres,
        description: req.body.description,
        allowed: req.body.allowed
    });
    book.save()
        .then(newBook => {
            console.log(newBook);
            res.status(201).json({
                message: "Ok"
            });
        });
});


router.get("/getBooks", (req, res, next) => {
    Books.find()
        .then(books => {
            res.status(200).json({
                message: "Sve je ok",
                data: books
            });
        });
});

router.post("/findBooks", (req, res, next) => {
    Books.find()
        .then(books => {
            let title = req.body.title;
            let author = req.body.author;
            let genres = req.body.genres;
            if (title != null && title != "") {
                books = books.filter(function(elem) {
                    let e = "" + elem.title;
                    // e = e.toLowerCase();
                    let t = "" + title;
                    // t = t.toLowerCase();
                    // if (e.includes(t)) return true;
                    // else return false;
                    if (e.toLowerCase().indexOf(t.toLowerCase()) !== -1) return true;
                    else return false;
                });
            }
            if (author != null && author != "") {
                books = books.filter(function(elem) {
                    let arr = JSON.parse(elem.authors);
                    let a = "" + author;
                    //a = a.toLowerCase();
                    for (let i = 0; i < arr.length; i++) {
                        let name = "" + arr[i];
                        ///name = name.toLowerCase();
                        //if (name.includes(a)) return true;
                        if (name.toLowerCase().indexOf(a.toLowerCase()) !== -1) return true;
                    }
                    return false;
                });
            }
            if (genres != null && genres.length > 0) {
                books = books.filter(function(elem) {
                    let dbgenres = JSON.parse(elem.genres);
                    for (let i = 0; i < genres.length; i++) {
                        for (let j = 0; j < dbgenres.length; j++) {
                            let a = "" + genres[i];
                            //a = a.toLowerCase();
                            let b = "" + dbgenres[j];
                            //b = b.toLowerCase();
                            // if (b === a) {
                            //     return true;
                            // }
                            if (b.toLowerCase() === a.toLowerCase()) return true;
                        }
                    }
                    return false;
                });
            }
            res.status(200).json({
                message: "Sve je ok",
                data: books
            });
        });
});

router.get("/getBook/:id", (req, res, next) => {
    Books.findById(req.params.id)
        .then(book => {
            res.status(200).json({
                message: "Sve je ok",
                data: book
            });
        });
});

router.get("/getBooksNotAllowed", (req, res, next) => {
    Books.find({ allowed: "0" })
        .then(books => {
            res.status(200).json({
                message: "Sve je ok",
                data: books
            });
        });
});

router.get("/acceptBookRequest/:id", (req, res, next) => {
    Books.updateOne({ _id: req.params.id }, {
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

router.delete("/refuseBookRequest/:id", (req, res, next) => {
    Books.deleteOne({ _id: req.params.id })
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

router.put("/updateBookNewImage/:id", multer({ storage: storage }).single("image"), (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const image = url + "/images/bookImages/" + req.file.filename;
    Books.updateOne({ _id: req.params.id }, {
            title: req.body.title,
            imagePath: image,
            authors: req.body.authors,
            issueDate: req.body.issueDate,
            genres: req.body.genres,
            description: req.body.description
        })
        .then(result => {
            console.log(result)
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

router.put("/updateBookOldImage/:id", (req, res, next) => {
    let date = new Date(req.body.issueDate);
    let dateString = date.toDateString();
    Books.updateOne({ _id: req.params.id }, {
            title: req.body.title,
            imagePath: req.body.imagePath,
            authors: req.body.authors,
            issueDate: dateString,
            genres: req.body.genres,
            description: req.body.description
        })
        .then(result => {
            console.log(result)
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

router.put("/updateBookDefaultImage/:id", (req, res, next) => {
    const name = Date.now() + "-" + "book.jpg";
    const path = "backend/images/bookImages/" + name;
    fs.copyFileSync("backend/images/bookGenericImage/book.jpg", path);
    const url = req.protocol + "://" + req.get("host");
    const image = url + "/images/bookImages/" + name;
    let date = new Date(req.body.issueDate);
    let dateString = date.toDateString();
    Books.updateOne({ _id: req.params.id }, {
            title: req.body.title,
            imagePath: image,
            authors: req.body.authors,
            issueDate: dateString,
            genres: req.body.genres,
            description: req.body.description
        })
        .then(result => {
            console.log(result)
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

router.post("/addGenre", (req, res, next) => {
    const genre = new Genre({
        name: req.body.name
    });
    genre.save()
        .then(newGenre => {
            console.log(newGenre);
            res.status(201).json({
                message: "Ok"
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Zanr vec postoji"
            })
        });;
});

router.get("/getGenres", (req, res, next) => {
    Genre.find()
        .then(genres => {
            res.status(200).json({
                message: "Sve je ok",
                data: genres
            });
        });
});

router.post("/deleteGenre", (req, res, next) => {
    let reg = new RegExp(req.body.name, 'g');
    Books.find({ genres: reg })
        .then(books => {
            if (books.length == 0) {
                Genre.deleteOne({ _id: req.body._id })
                    .then(result => {
                        if (result.deletedCount > 0) {
                            res.status(200).json({
                                message: "Ok"
                            });
                        } else {
                            res.status(500).json({
                                message: "Nijedno polje nije promenjeno"
                            });
                        }
                    })
                    .catch(error => {
                        res.status(500).json({
                            message: "Problem s azuriranjem"
                        })
                    });
            } else {
                res.status(500).json({
                    message: "Postoji knjiga sa tim zanrom"
                });
            }
        });
});



module.exports = router;
