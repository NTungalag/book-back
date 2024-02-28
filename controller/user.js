const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const MyError = require("../utils/myError");
const uploadImage = require("./uploadImage");

exports.register = asyncHandler(async (req, res, next) => {
  const user = await req.db.user.create(req.body);
  await user.reload({ attributes: { exclude: ["password"] } });

  const token = getJsonWebToken();

  res.status(200).json({
    success: true,
    token,
    user: user,
  });
});

// логин хийнэ
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new MyError("Имэйл болон нууц үгээ дамжуулна уу", 400);
  }
  console.log(email);

  // Тухайн хэрэглэгчийн хайна
  const user = await req.db.user.findOne({ where: { email: email } });
  console.log(user);

  if (!user || user === undefined || user === null) {
    throw new MyError("iim user oldsongui", 401);
  }
  const isPasswordValid = await bcrypt.compare(password, user?.password);

  if (!isPasswordValid) {
    throw new MyError("Имэйл болон нууц үгээ зөв оруулна уу", 401);
  }

  res.status(200).json({
    success: true,
    token: getJsonWebToken(),
    user: user,
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  let user = await req.db.user.findByPk(req.params.id);
  if (!user) {
    throw new MyError("Ийм хэрэглэгч байхгүй олдсонгүй!", 404);
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  console.log(req.body.image);
  if (req.body.image) {
    const response = await uploadImage(req.body.image);
    if (!response.url) {
      throw new MyError("Profile zurag oruulaxad aldaa garlaa", 501);
    }
    req.body.image = response.url;
  }

  let user = await req.db.user.findByPk(req.params.id);

  if (!user) {
    throw new MyError();
  }

  user = await user.update(req.body);

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  let user = await req.db.user.findByPk(req.params.id);

  if (!user) {
    throw new MyError(`${req.params.id} id тэй коммент олдсонгүй.`, 400);
  }

  await user.destroy();
  res.status(200).json({
    success: true,
    data: user,
  });
});
const getJsonWebToken = function () {
  const token = jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRESIN,
    }
  );

  return token;
};
