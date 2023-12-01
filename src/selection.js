import SelectionArea from 'https://esm.sh/@viselect/vanilla';
import { LCMLive } from './lcm-live.js';

const app = document.querySelector('.container');

let startIndex = { row: 0, col: 0 };
let endIndex = { row: 100, col: 100 };

const fragment = document.createDocumentFragment();
for (let i = 0; i < 100 * 100; i++) {
  fragment.appendChild(document.createElement('div'));
}
app.appendChild(fragment);

const result = document.querySelector('#result');
const selection = new SelectionArea({
  selectables: ['.container > div'],
  boundaries: ['.container'],
})
  .on('start', ({ store, event }) => {
    if (!event.ctrlKey && !event.metaKey) {
      for (const el of store.stored) {
        el.classList.remove('selected');
      }

      selection.clearSelection();
    }
  })
  .on(
    'move',
    ({
      store: {
        changed: { added, removed },
      },
    }) => {
      result.childNodes.forEach(node => {
        result.removeChild(node);
      });
      for (const el of added) {
        el.classList.add('selected');
      }

      for (const el of removed) {
        el.classList.remove('selected');
      }
    },
  )
  .on('stop', ({ store }) => {
    startIndex = getIndex(store.stored[0]);
    endIndex = getIndex(store.stored[store.stored.length - 1]);
  });

const webcamVideo = document.querySelector('video');
const { start, send } = LCMLive(webcamVideo, document.querySelector('#result'));
start();

setInterval(() => {
  try {
    const [WIDTH, HEIGHT] = [768, 768];

    const canvas = new OffscreenCanvas(WIDTH, HEIGHT);

    const newCanvas = captureVideoImage(
      startIndex.col,
      startIndex.row,
      endIndex.col,
      endIndex.row,
      canvas,
    );

    newCanvas.convertToBlob({ type: 'image/jpeg', quality: 1 }).then(blob => {
      send(blob, document.querySelector('input').value || '');

      const newImg = document.querySelector('#source');
      const url = URL.createObjectURL(blob);
      newImg.src = url;
    });
  } catch {}
}, [3 * 1000]);

function getIndex(childDiv) {
  const parentDiv = childDiv.parentElement;
  const children = parentDiv.children;
  const index = Array.from(children).indexOf(childDiv);

  // 计算行数和列数
  const row = Math.floor(index / 100);
  const col = index % 100;

  return { row, col };
}

function captureVideoImage(startX, startY, endX, endY, canvas) {
  console.log(startX, startY, endX, endY, canvas);
  const video = document.querySelector('video');
  const ctx = canvas.getContext('2d');

  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;

  // 计算截取区域的像素坐标
  const startPixelX = (startX / 100) * videoWidth;
  const startPixelY = (startY / 100) * videoHeight;
  const endPixelX = (endX / 100) * videoWidth;
  const endPixelY = (endY / 100) * videoHeight;

  // 计算截取区域的宽度和高度
  const captureWidth = endPixelX - startPixelX;
  const captureHeight = endPixelY - startPixelY;

  const captureAspectRatio = captureWidth / captureHeight;
  const canvasAspectRatio = canvas.width / canvas.height;

  let drawWidth, drawHeight, drawX, drawY;

  if (captureAspectRatio > canvasAspectRatio) {
    drawWidth = canvas.width;
    drawHeight = drawWidth / captureAspectRatio;
    drawX = 0;
    drawY = (canvas.height - drawHeight) / 2;
  } else {
    drawHeight = canvas.height;
    drawWidth = drawHeight * captureAspectRatio;
    drawY = 0;
    drawX = (canvas.width - drawWidth) / 2;
  }

  ctx.drawImage(
    video,
    startPixelX,
    startPixelY,
    captureWidth,
    captureHeight,
    drawX,
    drawY,
    drawWidth,
    drawHeight,
  );

  // 获取绘制的图像数据
  const imageData = ctx.getImageData(drawX, drawY, drawWidth, drawHeight);

  // 创建一个新的OffscreenCanvas
  const newCanvas = new OffscreenCanvas(drawWidth, drawHeight);
  const newContext = newCanvas.getContext('2d');

  // 将图像数据绘制到新的OffscreenCanvas上
  newContext.putImageData(imageData, 0, 0);

  return newCanvas;
}
