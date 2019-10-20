let express = require('express');
let router = express.Router();
let path = require("path")
let join = path.join;
const model = require("../model/model")

function download(dir) {
  return function (req, res, next) {
    let id = req.params.id;
    model.Photo.findById(id, (err, photo) => {
      if (err) return next(err)
      let path = join(dir, photo.path)
      res.download(path, photo.name + ".jpg")
    })
  }
}

router.get("/", (req, res, next) => {
  let pageNum = Number(req.query.pageNum);
  let pageSize = Number(req.query.pageSize);
  let skipNum = pageNum * pageSize;
  //分页查询
  model.Photo.count({}, (err, count) => {
    if (err) return next(err)
    model.Photo.find({}).skip(skipNum).limit(pageSize).exec((err, photos) => {
      if (err) return next(err)
      photos.forEach((item) => {
        item.path = `http://${process.env.host}:${process.env.port}${item.path}`
      })
      let photoData = { total: count, photos }
      res.send(JSON.stringify(photoData))
    })
  })
})

router.get("/:id/download", download(join(__dirname, "../public")))

module.exports = router;