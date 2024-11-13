export function getFileUrl(fileName: string) {
  return `${import.meta.env.VITE_API_URL}/api/attachments/${fileName}`;
}
