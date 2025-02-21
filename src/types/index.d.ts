export interface FileRequest {
  buffer: ArrayBuffer;
  metadata: {
    filename: string;
    size: number;
    format: string;
  };
}
