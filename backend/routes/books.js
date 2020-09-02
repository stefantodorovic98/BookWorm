const express = require("express");
const multer = require("multer");
const fs = require("fs");

const BookRequest = require('../models/book');
const { fstat } = require("fs");
const { arrayify } = require("tslint/lib/utils");

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
    const book = new BookRequest({
        title: req.body.title,
        imagePath: url + "/images/bookImages/" + req.file.filename,
        authors: req.body.authors,
        issueDate: req.body.issueDate,
        genres: req.body.genres,
        description: req.body.description
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
    const book = new BookRequest({
        title: req.body.title,
        imagePath: url + "/images/bookImages/" + name,
        authors: req.body.authors,
        issueDate: req.body.issueDate,
        genres: req.body.genres,
        description: req.body.description
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
    BookRequest.find()
        .then(books => {
            res.status(200).json({
                message: "Sve je ok",
                data: books
            });
        });
});

router.post("/findBooks", (req, res, next) => {
    BookRequest.find()
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

module.exports = router;
