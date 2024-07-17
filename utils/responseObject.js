function response({ message = "default message", status, success, data }) {
  return {
    message,
    status,
    success,
    data,
  };
}

module.exports = response;
