export interface FileRequest {
  buffer: ArrayBuffer;
  metadata: {
    type: string;
    filename: string;
    size: number;
    format: string;
  };
}
