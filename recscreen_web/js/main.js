//Recording Code

//Found code in this article: https://dev.to/sebastianstamm/screen-recording-in-10-lines-of-vanilla-js-3bo8
//Naturally edited some of it ;)

const start = document.getElementById("start");
const stop = document.getElementById("stop");
const del = document.getElementById("delete");
const save = document.getElementById("save");
const video = document.querySelector("video");
const popup = document.getElementById("popup");
const download = document.getElementById("download");
const timer = document.getElementById("timer");
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
    stopTimer();

    const completeBlob = new Blob(chunks, { type: chunks[0].type });
    video.srcObject = null;
    video.src = URL.createObjectURL(completeBlob);

    
    download.addEventListener("click", () => {
      downloadBlob(completeBlob, 'myvideo.flv');
    })
  };
  startTimer();
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

save.addEventListener('click', () => {
  popup.style.display = 'block';      
})



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


function closePopup() {
  popup.style.display = 'none';
}



var hr = 0;
var min = 0;
var sec = 0;
var stoptime = true;

function startTimer() {
  if (stoptime == true) {
		stoptime = false;
		timerCycle();
	}
}
function stopTimer() {
  if (stoptime == false) {
    stoptime = true;
  }
}

function timerCycle() {
	if (stoptime == false) {
    sec = parseInt(sec);
    min = parseInt(min);
    hr = parseInt(hr);

    sec = sec + 1;

    if (sec == 60) {
      min = min + 1;
      sec = 0;
    }
    if (min == 60) {
      hr = hr + 1;
      min = 0;
      sec = 0;
    }

    if (sec < 10 || sec == 0) {
      sec = '0' + sec;
    }
    if (min < 10 || min == 0) {
      min = '0' + min;
    }
    if (hr < 10 || hr == 0) {
      hr = '0' + hr;
    }

    timer.innerHTML = hr + ':' + min + ':' + sec;

		setTimeout("timerCycle()", 1000);
  }
}