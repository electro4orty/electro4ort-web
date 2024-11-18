export function getFileUrl(fileName: string) {
  return `${process.env.VITE_API_URL}/api/attachments/${fileName}`;
}
