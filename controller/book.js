const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate-sequelize");
const uploadImage = require('./uploadImage');
const MyError = require("../utils/myError");
const  {Op} = require('sequelize');

exports.getBooks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const sort = req.query.sort;
  const op = req.query.op;
  const categoryId = req.query.categoryId;


  let select = req.query.select;

  if (select) {
    select = select.split(" ");
  }

  ["select", "sort", "page", "limit", 'op','categoryId'].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, req.db.book);


  let query = { offset: pagination.start - 1, limit };

  if (req.query||categoryId) {
    if (op == 'cn') {
    //  console.log( Object.keys(req.query));
    //  console.log( req.query);
      // query.where = {
      //  [ Object.keys(req.query)[0]]:   {[Op.substring]: req.query[Object.keys(req.query)[0]]}
      // };

      query.where = categoryId ? {
        [Op.and]: [{ categoryId },
        {
          [Object.keys(req.query)[0]]: { [Op.substring]: req.query[Object.keys(req.query)[0]] }
        }
        ]
      }
        : {
          [Object.keys(req.query)[0]]: { [Op.substring]: req.query[Object.keys(req.query)[0]] }
        };
    } else {
      if(categoryId){
        query.where =  {['categoryId']:categoryId};

      }else{
        query.where =  req.query;

      }
    }
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
  query.include = [req.db.user, req.db.category];
  const book = await req.db.book.findAll(query);

  res.status(200).json({
    success: true,
    data: book,
    query,
    pagination,
  });
});

exports.getBook = asyncHandler(async (req, res, next) => {
  let book = await req.db.book.findByPk(req.params.id);
  if (!book) {
    throw new MyError("Nom oldsongui", 404);
  }
  res.status(200).json({
    success: true,
    data: book
  });
});

exports.createBook = asyncHandler(async (req, res, next) => {
  console.log(req.body.image)
  const response = await uploadImage(req.body.image);
  if (!response.url) {
    throw new MyError("Nomiin zurag oruulaxad aldaa garlaa", 501);
  }
  req.body.image = response.url;

  const book = await req.db.book.create(req.body);

  res.status(200).json({
    success: true,
    data: book,
    body: 'body'
  });
});

exports.updateBook = asyncHandler(async (req, res, next) => {

  try {
    let book = await req.db.book.findByPk(req.params.id);

    if (!book) {
      throw new MyError();
    }

    book = await book.update(req.body);

    res.status(200).json({
      success: true,
      data: book
    });

  } catch (e) {

  }

});

exports.deleteBook = asyncHandler(async (req, res, next) => {
  let book = await req.db.book.findByPk(req.params.id);
  if (!book) {
    throw new MyError("Nomiin medeelel oldsongui", 404);
  }
  await book.destroy();
  res.status(200).json({
    success: true,
    data: book
  });
});
