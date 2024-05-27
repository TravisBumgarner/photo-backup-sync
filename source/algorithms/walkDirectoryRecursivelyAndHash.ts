import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';


export const generateUniqueHash = ({ filename, size }: { filename: string, size: string }): string => {
  const data: string = filename + size;
  const hashedData: string = crypto.createHash('sha256').update(data).digest('hex');

  return hashedData;
}

export const walkDirectoryRecursivelyAndHash = async (dir: string, fileLookup: Record<string, string>): Promise<void> => {
  const files = fs.readdirSync(dir);
  for (const filename of files) {
    const filePath = path.join(dir, filename);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      await walkDirectoryRecursivelyAndHash(filePath, fileLookup);
    } else {
      const fileSizeInBytes = stat.size;
      const hash = generateUniqueHash({ filename, size: String(fileSizeInBytes) });
      fileLookup[hash] = filePath; // Add to lookup
    }
  }
}