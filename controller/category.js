const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate-sequelize");


exports.getCategories =  asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const sort = req.query.sort;
  let select = req.query.select;

  if (select) {
    select = select.split(" ");
  }

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, req.db.category);

  let query = { offset: pagination.start - 1, limit };

  if (req.query) {
    query.where = req.query;
  }

  if (select) {
    query.attributes = select;
  }

  if (sort) {
    query.order = sort
      .split(" ")
      .map((el) => [
        el.charAt(0) === "-" ? el.substring(1) : el,
        el.charAt(0) === "-" ? "DESC" : "ASC",
      ]);
  }

  const category = await req.db.category.findAll(query);

  res.status(200).json({
    success: true,
    data: category,
    query,
    pagination,
  });
  });
  
exports.getCategory = asyncHandler( async (req, res, next) => {
  let category = await req.db.category.findByPk(req.params.id);

  res.status(200).json({
    success: true,
    data: category
  });
});

exports.createCategory = asyncHandler(async (req, res, next) => {

  const category = await req.db.category.create(req.body);

  res.status(200).json({
    success: true,
    data: category,
  });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {

  try {
    let category = await req.db.category.findByPk(req.params.id);

    if (!category) {
      throw new Error();
    }

    category = await category.update(req.body);

    res.status(200).json({
      success: true,
      data: category
    });

  } catch (e) {

  }

});

exports.deleteCategory = asyncHandler( async (req, res, next) => {
  let category = await req.db.category.findByPk(req.params.id);

  await category.destroy();
  res.status(200).json({
    success: true,
    data: category
  });
});
