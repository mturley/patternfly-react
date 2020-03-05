/**
 * Read a text file as a binary string using the FileReader API.
 * Returns a promise which will resolve with the file contents as a string or reject with a DOMException.
 *
 * @param {File} fileHandle - File object to read
 */
export function readTextFile(fileHandle: File) {
  return new Promise((resolve, reject) => {
    if (fileHandle) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.onabort = () => reject(reader.error);
      reader.readAsBinaryString(fileHandle);
    } else {
      reject();
    }
  });
}
