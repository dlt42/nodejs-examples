import fs from 'fs';
import isValidPath from 'is-valid-path';

export const checkFile = (filename: string) => {
  // Check that the filename has been specified
  if (filename.length === 0) {
    throw Error('Filename not specified');
  }

  // Check the filename is valid
  if (!isValidPath(filename)) {
    throw Error('Filename not valid');
  }

  // If the filename exists then delete it
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
  }
};

export const getErrorMessage = (error: unknown) => {
  if (!error) {
    return '';
  }
  return error instanceof Error ? error.message : JSON.stringify(error);
};
