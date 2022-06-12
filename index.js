const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var cors = require("cors");
var spawn = require("child_process").spawn;

var save_path = "/home/pi/photos/";
// Create a child process
var child = spawn("gphoto2", ["--wait-event-and-download"], {
  cwd: save_path,
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
app.use("/photos", express.static(save_path));
app.use(cors());

child.stdout.on("data", function (data) {
  data = data.toString();
  if (data.includes("Overwrite? [y|n]")) child.stdin.write("y\n");
  if (data.includes("Saving file as")) {
    data = data.split("\n");
    img_name = data.filter((item) => item.includes("Saving file as"))[0];
    img_name = img_name.split(" ")[3];
    console.log("Image name: " + img_name);
  }
});

io.on("connection", (socket) => {
  console.log("client connected !");
  setInterval(() => {
    if (last_img_name != img_name) {
      console.log("Sending image name: " + img_name);
      socket.emit("new_photo", img_name);
      last_img_name = img_name;
    }
  }, 100);
});

server.listen(5600, () => {
  console.log("listening on *:5600");
});
