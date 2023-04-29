class MyError extends Error {
  constructor(message, statusCode) {
    console.log(message, statusCode)
    super(message);

    this.statusCode = statusCode;
  }
}

module.exports = MyError;
