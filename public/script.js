var socket = io();

io.on("connection", (socket) => {
  socket.on("new_photo", (msg) => {
    alert("message: " + msg);
  });
});
