const express = require("express");
const {
  create,getChatRoom
 
} = require("../controller/chats");

const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

//"/api/users"
router.route("/").post( create);

router
  .route("/:id")
  .get( getChatRoom)
//   .put( updateUser)
//   .delete( deleteUser);

module.exports = router;
