let express = require('express');
let router = express.Router();
let path = require("path")
let join = path.join;
const model = require("../model/model")
const bcrypt = require("bcrypt")

function login(req, res, next) {
  console.log(req.session)
  function cb(user) {
    if (user.length == 0) {
      return res.send({ code: 0, message: "fail" })
    }
    bcrypt.hash(req.body.password, user[0].salt, (err, hash) => {
      if (err) return next(err)
      if (user[0].password == hash) {
        req.session.loginedname = user[0].username;
        res.send({ code: 1, message: "success" })
      } else {
        res.send({ code: 0, message: "密码错误" })
      }
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

router.post("/", login)


module.exports = router;