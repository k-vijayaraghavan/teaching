/*
 *  Copyright (c) 2020 Krishna Vijayaragahvan. All Rights Reserved.
 *  [Adapted from  The WebRTC project authors.]
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';
//Selection
const videoElement = document.querySelector('video');
//const audioOutputSelect = document.querySelector('select#audioOutput');
const videoSelect = document.querySelector('select#videoSource');
const selectors = [videoSelect];
/*const resolutions = [
{width: {exact: 320}, height: {exact: 240}},
{width: {exact: 640}, height: {exact: 480}},
{width: {exact: 1280}, height: {exact: 720}},
{width: {exact: 1920}, height: {exact: 1080}},
{width: {exact: 4096}, height: {exact: 2160}},
{width: {exact: 7680}, height: {exact: 4320}}
];*/
const resolutions = [
{width: {ideal: 320}, height: {ideal: 240}},
{width: {ideal: 640}, height: {ideal: 480}},
{width: {ideal: 1280}, height: {ideal: 720}},
{width: {ideal: 1920}, height: {ideal: 1080}},
{width: {ideal: 4096}, height: {ideal: 2160}},
{width: {ideal: 7680}, height: {ideal: 4320}}
];

const dimensions = document.querySelector('#dimensions');
const video = document.querySelector('video');
let stream;

const resolution = document.querySelector('#resolution');

const videoblock = document.querySelector('#videoblock');
const messagebox = document.querySelector('#errormessage');

//const widthInput = document.querySelector('div#width input');
const widthOutput = document.querySelector('div#width span');
const aspectLock = document.querySelector('#aspectlock');
//const sizeLock = document.querySelector('#sizelock');

let currentWidth = 0;
let currentHeight = 0;

function gotDevices(deviceInfos) {
  // Handles being called several times to update labels. Preserve values.
  const values = selectors.map(select => select.value);
  selectors.forEach(select => {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  });
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
      videoSelect.appendChild(option);
    } else {
      console.log('Some other kind of source/device: ', deviceInfo);
    }
  }
  selectors.forEach((select, selectorIndex) => {
    if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
      select.value = values[selectorIndex];
    }
  });
}

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

videoSelect.onchange = start;
start();

//Resolution





//resolution.onchange = () => {
function resolutionfn() {
  //getMedia(resolutions[resolution.selectedIndex]);
  //start();
  const constraints = {
    	width: resolutions[resolution.selectedIndex].width,
    	height: resolutions[resolution.selectedIndex].height
  };
  clearErrorMessage();
  console.log('applying ' + JSON.stringify(constraints));
  const track = window.stream.getVideoTracks()[0];
  track.applyConstraints(constraints)
      .then(() => {
        console.log('applyConstraint success');
        displayVideoDimensions('applyConstraints');
      })
      .catch(err => {
        errorMessage('applyConstraints', err.name);
      });

}

//Merged
function start() {
  const videoSource = videoSelect.value;
  //console.log(resolutions[resolution.selectedIndex].width);
  const constraints = {
    video: {
    	deviceId: videoSource ? {exact: videoSource} : undefined,
    	//resolutions[resolution.selectedIndex][0]
    	frameRate: 25,
    	width: resolutions[resolution.selectedIndex].width,
    	height: resolutions[resolution.selectedIndex].height
    }
  };
  navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);
}
//--
function gotStream(mediaStream) {
  stream = window.stream = mediaStream; // stream available to console
  video.srcObject = mediaStream;
  messagebox.style.display = 'none';
  videoblock.style.display = 'block';
  const track = mediaStream.getVideoTracks()[0];
  const constraints = track.getConstraints();
  console.log('Result constraints: ' + JSON.stringify(constraints));
  if (constraints && constraints.width && constraints.width.exact) {
    //widthInput.value = constraints.width.exact;
    widthOutput.textContent = constraints.width.exact;
  } else if (constraints && constraints.width && constraints.width.min) {
    //widthInput.value = constraints.width.min;
    widthOutput.textContent = constraints.width.min;
  }
  return navigator.mediaDevices.enumerateDevices();
}

function errorMessage(who, what) {
  const message = who + ': ' + what;
  messagebox.innerText = message;
  messagebox.style.display = 'block';
  console.log(message);
}

function clearErrorMessage() {
  messagebox.style.display = 'none';
}

function displayVideoDimensions(whereSeen) {
  if (video.videoWidth) {
    dimensions.innerText = 'Actual video dimensions: ' + video.videoWidth +
      'x' + video.videoHeight + 'px.';
    if (currentWidth !== video.videoWidth ||
      currentHeight !== video.videoHeight) {
      console.log(whereSeen + ': ' + dimensions.innerText);
      currentWidth = video.videoWidth;
      currentHeight = video.videoHeight;
    }
  } else {
    dimensions.innerText = 'Video not ready';
  }
}

video.onloadedmetadata = () => {
  displayVideoDimensions('loadedmetadata');
};

video.onresize = () => {
  displayVideoDimensions('resize');
};

/*
function constraintChange(e) {
  widthOutput.textContent = e.target.value;
  const track = window.stream.getVideoTracks()[0];
  let constraints;
  if (aspectLock.checked) {
    constraints = {
      width: {exact: e.target.value},
      aspectRatio: {
        exact: video.videoWidth / video.videoHeight
      }
    };
  } else {
    constraints = {width: {exact: e.target.value}};
  }
  clearErrorMessage();
  console.log('applying ' + JSON.stringify(constraints));
  track.applyConstraints(constraints)
      .then(() => {
        console.log('applyConstraint success');
        displayVideoDimensions('applyConstraints');
      })
      .catch(err => {
        errorMessage('applyConstraints', err.name);
      });
}
*/

//widthInput.onchange = constraintChange;
/*
sizeLock.onchange = () => {
  if (sizeLock.checked) {
    console.log('Setting fixed size');
    video.style.width = '100%';
  } else {
    console.log('Setting auto size');
    video.style.width = 'auto';
  }
};
*/
//Merged
function getMedia(constraints) {
  if (stream) {
    stream.getTracks().forEach(track => {
      track.stop();
    });
  }

  clearErrorMessage();
  videoblock.style.display = 'none';
  navigator.mediaDevices.getUserMedia(constraints)
      .then(gotStream)
      .catch(handleError);
}

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

//From cam
$(document).ready(function() {
  shortcut.add("Space", function() {
    $("#save").trigger("click");
    return false;
  });

  // Take and Save Snapshot
  $("#save").click(function() {
    // ctx.drawImage(video,window.innerWidth,window.innerHeight);
    canvas.width = $("video").width();
    canvas.height = $("video").height();
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(function(blob) {
      saveAs(blob, "photo (" + counter++ + ").jpg");
      return false;
    });
    return false;
  });

  // Toggle dialog
  $(document).keydown(function(e) {
    if (e.which == 9) {
      $("[data-action=toggle]").toggleClass("hide");
      return false;
    }
  });

  // Escape key to close CamDesk
  shortcut.add("Ctrl+R", function() {
    location.reload(true);
  });

  // Escape key to close CamDesk
  shortcut.add("Esc", function() {
    window.close();
  });
});
