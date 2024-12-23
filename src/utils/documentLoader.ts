// src/utils/documentLoader.ts
import fs from 'fs';
import path from 'path';

export default function loadDocument(): Promise<string> {
  return new Promise((resolve, reject) => {
    const filePath = path.join(process.cwd(), 'document.txt');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}
