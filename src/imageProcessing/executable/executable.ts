export const getErrorMessage = (error: unknown) => {
  if (!error) {
    return 'Unknown error';
  }
  return error instanceof Error ? error.message : JSON.stringify(error);
};
