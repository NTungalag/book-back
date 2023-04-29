const express = require("express");

const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} = require("../controller/book");

const router = express.Router();

//"/api/v1/categories"
router.route("/").get(getBooks).post(createBook);

router
  .route("/:id")
  .get(getBook)
  .put(updateBook)
  .delete(deleteBook);

module.exports = router;
