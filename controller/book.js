const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate-sequelize");
const uploadImage = require('./uploadImage');
const MyError = require("../utils/myError");
const { Op, Sequelize } = require('sequelize');

exports.getBooks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const sort = req.query.sort;
  const op = req.query.op;
  const categoryId = req.query.categoryId;
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;

  let select = req.query.select;

  if (select) {
    select = select.split(" ");
  }

  ["select", "sort", "page", "limit", 'op', 'categoryId', 'longitude', 'latitude'].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, req.db.book);


  let query = { offset: pagination.start - 1, limit };

  if (latitude && longitude) {
    query.where = {
      latitude: {
        [Op.and]: [{ [Op.gte]: latitude - 0.05 }, { [Op.lte]: 0.05 + parseFloat(latitude) }]
      },
      longitude: {
        [Op.and]: [{ [Op.gte]: longitude - 0.05 }, { [Op.lte]: 0.05 + parseFloat(longitude) }]
      }
    };
  };

  // if (req.query || categoryId) {
  //   if (op == 'cn') {

  //     query.where = categoryId ? {
  //       [Op.and]: [{ categoryId },
  //       {
  //         [Object.keys(req.query)[0]]: { [Op.substring]: req.query[Object.keys(req.query)[0]] }
  //       }
  //       ]
  //     }
  //       : {
  //         [Object.keys(req.query)[0]]: { [Op.substring]: req.query[Object.keys(req.query)[0]] }
  //       };
  //   } else {
  //     if (categoryId) {
  //       query.where = { ['categoryId']: categoryId };

  //     } else if (!latitude) {
  //       query.where = req.query;
  //       console.log('===============DSDSDS');

  //     }
  //   }
  // }
  if (req.query || categoryId) {
    if (op == 'cn') {
      const searchKey = Object.keys(req.query)[0];
      const searchTerm = req.query[searchKey];

      query.where = categoryId
        ? {
          [Op.and]: [
            { categoryId },
            Sequelize.where(Sequelize.fn('LOWER', Sequelize.col(searchKey)), 'LIKE', `%${searchTerm.toLowerCase()}%`)
          ]
        }
        : Sequelize.where(Sequelize.fn('LOWER', Sequelize.col(searchKey)), 'LIKE', `%${searchTerm.toLowerCase()}%`);
    } else {
      if (categoryId) {
        query.where = { categoryId };
      } else if (!latitude) {
        query.where = req.query;
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
  // console.log(query);
  query.include = [req.db.user, req.db.category];
  const book = await req.db.book.findAll(query);
  // console.log('BOOK ' +
  //   book.length

  // )

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


  const book = await req.db.book.create(req.body, { include: [req.db.user, req.db.category] });
  const user = await book.getUser({ attributes: { exclude: ['password'] } });
  const category = await book.getCategory();

  if (!book || !user) {
    throw new MyError("aldaa garlaa", 501);
  }
  const bookData = book.toJSON();
  bookData.user = user.toJSON();
  bookData.category = category.toJSON();



  res.status(200).json({
    success: true,
    data: bookData,

  });
});

exports.updateBook = asyncHandler(async (req, res, next) => {
  console.log('book');
  console.log(req.body.image)
  if (req.body.image) {
    const response = await uploadImage(req.body.image);
    if (!response.url) {
      throw new MyError("Nomiin zurag oruulaxad aldaa garlaa", 501);
    }
    req.body.image = response.url;
  }

  try {
    let book = await req.db.book.findByPk(req.params.id);
    console.log(book);

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
