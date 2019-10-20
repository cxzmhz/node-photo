const mongoose = require("mongoose")

const URL = "mongodb://localhost:27017/cxz01"

mongoose.connect(URL)

let photoSchema = new mongoose.Schema({
  name: { type: String },
  path: { type: String }
})

let userSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
  salt: { type: String }
})

//model即数据模型，之后数据库会根据模型新建相关集合（collection）：photos和users
exports.Photo = mongoose.model("Photo", photoSchema)
exports.User = mongoose.model("User", userSchema)
