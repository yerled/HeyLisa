const wsDomain = '';

export function LCMLive(webcamVideo, liveImage) {
  let websocket;

  async function start() {
    return new Promise((resolve, reject) => {
      const websocketURL = `wss://${wsDomain}/ws`;

      const socket = new WebSocket(websocketURL);
      socket.onopen = () => {
        console.log('Connected to websocket');
      };
      socket.onclose = () => {
        console.log('Disconnected from websocket');
        stop();
        resolve({ status: 'disconnected' });
      };
      socket.onerror = err => {
        console.error(err);
        reject(err);
      };
      socket.onmessage = event => {
        const data = JSON.parse(event.data);
        switch (data.status) {
          case 'success':
            break;
          case 'start':
            const userId = data.userId;
            initVideoStream(userId);
            break;
          case 'timeout':
            stop();
            resolve({ status: 'timeout' });
          case 'error':
            stop();
            reject(data.message);
        }
      };
      websocket = socket;
    });
  }

  async function initVideoStream(userId) {
    liveImage.src = `https://${wsDomain}/stream/${userId}`;
  }

  function send(blob, prompt) {
    websocket.send(blob);
    websocket.send(
      JSON.stringify({
        prompt,
        guidance_scale: 8,
        lcm_steps: 50,
        seed: 2159232,
        steps: 4,
        strength: 0.7,
        width: 768,
        height: 768,
      }),
    );
  }

  async function stop() {
    websocket.close();
  }
  return {
    start,
    stop,
    send,
  };
}
