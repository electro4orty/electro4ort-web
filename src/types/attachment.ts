export interface Attachment {
  id: string;
  createdAt: string;
  updatedAt: string | null;
  fileName: string;
  size: number;
  mimeType: string;
}
