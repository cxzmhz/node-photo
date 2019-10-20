const express = require('express');
const model = require("../model/model")
const path = require("path")
const fs = require("fs")
const router = express.Router();
let join = path.join;

function submit(dir) {
  return function (req, res, next) {
    let img = req.files[0]
    let name = req.body.photoName || img.originalname;

    let path = join(dir, img.originalname)
    fs.rename(img.path, path, (err) => {
      if (err) return next(err)
      model.Photo.create({
        name: name,
        path: "/photos/" + img.originalname
      }, (err) => {
        if (err) return next(err)
        res.end("ok")
      })
    })

  }
}


router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.post("/", submit(join(__dirname, "../public/photos")))


module.exports = router;
