const defaultErrorMessage = "Oops something went wrong";

const createError = (code = 500, error, optionalData = null) => ({
  error: error ? error : "Oops that's an error",
  code: Number(code),
  ...optionalData,
});

const throwCustomError = (code, errorMessage) => (error) => {
  throw createError(code, errorMessage ?? error?.message ?? defaultErrorMessage, error);
};

const throwInternalError = (errorMessage) => (error) => {
  throw createError(500, errorMessage ?? error?.message ?? defaultErrorMessage, error);
};

const handleInternalError = async (promiseFunction, ...args) => {
  try {
    return await promiseFunction(...args);
  } catch (error) {
    throwInternalError()(error);
  }
};

export {
  createError,
  throwCustomError,
  throwInternalError,
  handleInternalError,
};
