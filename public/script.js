var socket = io();

socket.on("new_photo", (name) => {
  var image_name = document.getElementById("image_name");
  image_name.innerHTML = name;
  const imageUrl = "photos/" + name;

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
});

document.onclick = function (event) {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
};