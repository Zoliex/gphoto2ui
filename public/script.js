var socket = io();

io.on("connection", (socket) => {
    console.log("connected");
  socket.on("new_photo", (msg) => {
    alert("message: " + msg);
  });
});
