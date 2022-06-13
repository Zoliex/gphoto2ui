var socket = io();

var download_url = "";
socket.on("new_photo", (name) => {
  const imageUrl = "photos/" + name;

  (async () => {
    var loader = document.getElementById("loader");
    loader.style.display = "block";
    const response = await fetch(imageUrl);
    var buf = new Uint8Array(await response.arrayBuffer());
    var thumbnail = dcraw(buf, { extractThumbnail: true });
    var blob = new Blob([thumbnail], { type: "image/jpeg" });
    var urlCreator = window.URL || window.webkitURL;
    var thumbnail_src = urlCreator.createObjectURL(blob);
    var img = document.getElementById("img");
    img.src = thumbnail_src;
    var image_name = document.getElementById("image_name");
    image_name.innerHTML = name;
    download_url = "photos/" + name;
    loader.style.display = "none";
  })();
});
window.onload = function () {
  if (window.location.hostname == "localhost") {
    document.onclick = function (event) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
    };
  } else {
    console.log("Not localhost");
    var download = document.getElementById("download");
    download.style.display = "block";
    download.onclick = function () {
      window.open(download_url, "_blank").focus();
    };
  }
};
