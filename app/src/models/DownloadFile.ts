export interface DownloadFile {
  path: string;
  filename: string;
  buffer: Buffer;
}

export interface AppwriteFile {
  file: string;
  bucket: string;
}
