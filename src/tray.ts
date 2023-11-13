import { app, Tray, Menu, nativeImage } from 'electron';
import path from 'path';

let tray;
export function createTray() {
  const icon = nativeImage
    .createFromPath(path.join(__dirname, '../../assets/icons/32x32.png'))
    .resize({ width: 16, height: 16 });

  icon.setTemplateImage(true);
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    { label: '显示', type: 'radio', checked: true, click: () => app.show() },
    { label: '隐藏', type: 'radio', click: () => app.hide() },
    { label: '退出', type: 'radio', click: () => app.quit() },
  ]);

  tray.setContextMenu(contextMenu);

  tray.setToolTip('HeyLisa');
}
