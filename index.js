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

app.use(express.static("public"));

io.on("connection", (socket) => {
  child.stdout.on("data", function (data) {
    console.log("Gphoto2 output: " + data);
    if (data.includes("Overwrite? [y|n]")) child.stdin.write("y\n");
    if (data.includes("Saving file as")) {
      data.split("\n");
      socket.emit(
        "photo",
        data.filter((photo) => photo.includes("Saving file as"))[0]
      );
      console.log("Photo taken");
    }
  });
});

server.listen(5600, () => {
  console.log("listening on *:5600");
});