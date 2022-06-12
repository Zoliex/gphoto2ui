var socket = io();

  socket.on("new_photo", (msg) => {
    alert("message: " + msg);
  });
