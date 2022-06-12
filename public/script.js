/*var socket = io();

socket.on("new_photo", (msg) => {
  var image_name = document.getElementById("image_name");
  image_name.innerHTML = msg;
});*/
const imageUrl = " http://localhost:5555/public/D90-20220612234922.nef";

(async () => {
  const response = await fetch(imageUrl);
  var buf = new Uint8Array(await response.arrayBuffer());
  var thumbnail = dcraw(buf, { extractThumbnail: true });
  var blob = new Blob([thumbnail], { type: "image/jpeg" });
  var urlCreator = window.URL || window.webkitURL;
  var thumbnail_src = urlCreator.createObjectURL(blob);
  var img = document.getElementById("img");
  img.src = thumbnail_src;
})();
