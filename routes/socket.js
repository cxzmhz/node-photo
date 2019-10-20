const wsServer = require("ws").Server
const ws = new wsServer({ port: 8881 })

ws.on("connection", (socket) => {
  console.log("linked")
  socket.send("hello")
  socket.on("message", (message) => {
    console.log(message)
    console.log("messaging---")
  })
})