var socket = io();

socket.on("new_photo", (msg) => {
  var image_name = document.getElementById("image_name");
  image_name.innerHTML = msg;
});
