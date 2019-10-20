let express = require('express');
let router = express.Router();
let path = require("path")
let join = path.join;
const model = require("../model/model")
const bcrypt = require("bcrypt")

function register(req, res, next) {
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
function login(req, res, next) {
  bcrypt.hash(req.body.password, res.user[0].salt, (err, hash) => {
    if (err) return next(err)
    if (res.user[0].password == hash) {
      req.session.loginedname = res.user[0].username;
      res.send({ code: 1, message: "success", loginedname: res.user[0].username })
    } else {
      res.send({ code: 0, message: "密码错误" })
    }
    res.user = null;
  })
}
function logout(req, res, next) {
  req.session.loginedname = null
  res.send({
    code: 1,
    message: "注销成功"
  })
}

//中间件：校验数据库中是否有当前用户名存在
function valifyExist(method) {
  return function (req, res, next) {
    model.User.find({ "username": req.body.username }, (err, user) => {
      if (err) return next(err)
      if (method == "register" && user.length > 0) {
        return res.send({ code: 0, message: "用户名已存在！" })
      } else if (method == "login" && user.length == 0) {
        return res.send({ code: 0, message: "用户名不存在！" })
      } else {
        method == "login" && (res.user = user)
        next()
      }
    })
  }

}

router.post("/register", valifyExist("register"), register)
router.post("/login", valifyExist("login"), login)
router.post("/logout", logout)


module.exports = router;