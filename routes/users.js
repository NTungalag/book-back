const express = require("express");
const {
  register,login,
  getUsers,
  getUser,

  updateUser,
  deleteUser,
} = require("../controller/user");

const router = express.Router();
const { protect, authorize } = require("../middleware/protect");
const { encrypt } = require("../middleware/encryptPass");


//"/api/users"
router.route("/register").post(encrypt, register);
router.route("/login").post(login);
// router.route("/forgot-password").post(forgotPassword);
// router.route("/reset-password").post(resetPassword);



//"/api/users"
// router.route("/").get(authorize("admin"), getUsers);

router
  .route("/:id")
  .get( getUser)
  .put( updateUser)
  .delete( deleteUser);

module.exports = router;
