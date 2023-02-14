export function sanitizeFilename(file) {
  const newFilename = file.name.replace(/[^a-zA-Z0-9]/g, "_");
  const renamedFile = new File([file], newFilename, { type: file.type });
  return renamedFile;
}
