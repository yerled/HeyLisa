import { desktopCapturer, BrowserWindow } from 'electron';

export function initDesktopCapturer(mainWindow: BrowserWindow) {
  desktopCapturer.getSources({ types: ['screen'] }).then(async sources => {
    let sourceId = '';
    for (const source of sources) {
      sourceId = source.id;
      console.log('source', source);
      break;
    }
    mainWindow.webContents.send('SET_SOURCE', sourceId);
  });
}
