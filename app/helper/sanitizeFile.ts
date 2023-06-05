export function sanitizeFilename(file:any) {
  // const sanitized = file.name.replace(/[^\w\s\.\-]/g, "_");

  // // Trim whitespace from the beginning and end of the filename
  // const trimmed = sanitized.trim();

  // // Replace multiple spaces with a single space
  // const normalized = trimmed.replace(/\s+/g, " ");

  // // Limit the filename to 255 characters
  // const newFilename = normalized.slice(0, 255);
  const newFilename = file.name.replace(/[^a-zA-Z0-9\.]/g, "_");
  const renamedFile = new File([file], newFilename, { type: file.type });
  return renamedFile;
}