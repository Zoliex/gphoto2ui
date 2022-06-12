const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var spawn = require("child_process").spawn;
// Create a child process
var child = spawn("gphoto2", ["--wait-event-and-download"], {
  cwd: "/home/pi/photos",
});
child.stderr.on("data", function (data) {
  //throw errors
  console.log("stderr: " + data);
});

child.on("close", function (code) {
  console.log("child process exited with code " + code);
});
var last_img_name = "";
var img_name = "";

app.use(express.static("public"));

child.stdout.on("data", function (data) {
    console.log("Gphoto2 output: " + data);
    data = data.toString();
    if (data.includes("Overwrite? [y|n]")) child.stdin.write("y\n");
    if (data.includes("Saving file as")) {
      data = data.split("\n");
      console.log(data);
      img_name = data.filter((item) => item.includes("Saving file as"))[0];
      img_name = img_name.split(" ")[3];
      console.log("Photo taken");
    }
});

io.on("connection", (socket) => {
  if (last_img_name != img_name) {
    socket.emit("new_photo", img_name);
    last_img_name = img_name;
  }
});

server.listen(5600, () => {
  console.log("listening on *:5600");
});
