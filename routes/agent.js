const express = require('express');
const http = require("http")



module.exports = function agent(req, res, next) {
  //所要代理的接口
  let opt = {
    protocol: "http:",
    host: "127.0.0.1",
    port: "8882",
    method: "GET",
    path: req.url,
    json: true,
    headers: req.headers
  }
  console.log(req.url)
  let proxy = http.request(opt, (response) => {
    response.on("data", (chunk) => {
      res.write(chunk)
    })
    response.on("end", () => {
      res.end();
    })
    res.writeHead(response.statusCode, response.headers)
  })
  req.on("data", (chunk) => {
    proxy.write(chunk)
  })
  req.on("end", () => {
    proxy.end();
  })
}
