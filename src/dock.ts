import { app, nativeImage } from 'electron';
import path from 'path';

export function configDock() {
  const icon = nativeImage.createFromPath(
    path.join(__dirname, '../assets/icons/128x128.png'),
  );
  app.dock.setIcon(icon);
}
