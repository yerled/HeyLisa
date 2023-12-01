import { ipcRenderer } from 'electron';

ipcRenderer.on('SET_SOURCE', async (event, sourceId) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId,
          // minWidth: 500,
          // maxWidth: 500,
          // minHeight: 500,
          // maxHeight: 500,
        },
      },
    });

    handleStream(stream);
  } catch (e) {
    handleError(e);
  }
});

function handleStream(stream) {
  const video = document.querySelector('video');
  video.srcObject = stream;
  video.onloadedmetadata = e => video.play();

  return;
  const recorder = new MediaRecorder(stream);

  recorder.ondataavailable = event => {
    if (event.data.size > 0) {
      console.log(event.data);
      window.yerledBlob = new Blob([event.data], { type: 'image/jpeg' });
      console.log('yerledBlob ~~~~~~', window.yerledBlob);
    }
  };
  recorder.start(200);
}

function handleError(e) {
  console.log(e);
}
