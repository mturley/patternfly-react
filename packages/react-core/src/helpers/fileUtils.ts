export function readTextFile(fileHandle: File) {
  return new Promise((resolve, reject) => {
    if (fileHandle) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => {
        reader.abort();
        reject(reader.error);
      };
      reader.readAsBinaryString(fileHandle);
    } else {
      reject();
    }
  });
}
