export enum AspectRatio {
  SQUARE = "1:1",
  PORTRAIT_4_3 = "3:4",
  LANDSCAPE_4_3 = "4:3",
  PORTRAIT_16_9 = "9:16",
  LANDSCAPE_16_9 = "16:9",
}

export interface GeneratedImageResult {
  imageUrl: string;
  text?: string;
}

export type LoadingState = 'idle' | 'uploading' | 'generating' | 'error' | 'success';

export interface ImageUploadState {
  file: File | null;
  previewUrl: string | null;
  base64Data: string | null; // Raw base64 data without prefix
  mimeType: string;
}