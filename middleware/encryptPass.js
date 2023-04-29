const bcrypt = require("bcrypt");

exports.encrypt = (async (req, res, next) => {

    // Нууц үг өөрчлөгдөөгүй бол дараачийн middleware рүү шилж
    // if (!this.isModified("password")) next();

    // Нууц үг өөрчлөгдсөн
    console.time("salt");
    const salt = await bcrypt.genSalt(10);
    console.timeEnd("salt");

    console.time("hash");
    req.body.password = await bcrypt.hash(req.body.password, salt);
    console.timeEnd("hash");
    next();
});