let express = require('express');
let router = express.Router();
let path = require("path")
let join = path.join;
const model = require("../model/model")
const bcrypt = require("bcrypt")

function register(req, res, next) {
  function cb(user) {
    if (user.length > 0) {
      return res.send({ code: 0, message: "fail" })
    }
    bcrypt.genSalt(12, (err, salt) => {
      if (err) return next(err)
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) return next(err)
        model.User.create({
          username: req.body.username,
          password: hash,
          salt: salt
        }, (err) => {
          if (err) return next(err)
          res.send({ code: 1, message: "success" })
        })
      })
    })
  }
  valifyExist(req.body.username, next, cb)
}
function valifyExist(username, next, cb) {
  return model.User.find({ "username": username }, (err, user) => {
    if (err) return next(err)
    cb(user);
  })
}

router.post("/", register)


module.exports = router;