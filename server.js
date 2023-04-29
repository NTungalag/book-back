const express = require("express");
const dotenv = require("dotenv");
const fileUpload = require('express-fileupload');


// Router оруулж ирэх
const categoriesRoutes = require("./routes/categories");
const booksRoutes = require("./routes/books");
const usersRoutes = require("./routes/users");

const injectDb = require("./middleware/injectDb");
const errorHandler = require("./middleware/error");


// Аппын тохиргоог process.env рүү ачаалах
dotenv.config({ path: "./config/config.env" });
const db = require("./config/db-mysql");

const app = express();
// app.use(express.bodyParser({limit: '2.3mb'}));
app.use(fileUpload());
app.use(express.json());
app.use(injectDb(db));
app.use("/api/categories", categoriesRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/users", usersRoutes);
app.use(errorHandler);


db.book.belongsTo(db.user, { onDelete: 'NO ACTION', onupdate: 'NO ACTION' });
db.user.hasMany(db.book, { onDelete:'NO ACTION', onupdate: 'NO ACTION' });
db.book.belongsTo(db.category, { onDelete: 'NO ACTION', onupdate: 'NO ACTION' });
db.category.hasMany(db.book, { onDelete: 'NO ACTION', onupdate: 'NO ACTION' });


db.user.hasMany(db.chatRoom, { onDelete:'NO ACTION', onupdate: 'NO ACTION' });
db.user.hasMany(db.message, { onDelete:'NO ACTION', onupdate: 'NO ACTION' });

db.chatRoom.hasMany(db.user, { onDelete: 'NO ACTION', onupdate: 'NO ACTION' });
db.chatRoom.hasMany(db.message, { onDelete: 'NO ACTION', onupdate: 'NO ACTION' });


db.message.belongsTo(db.chatRoom, { onDelete: 'NO ACTION', onupdate: 'NO ACTION' });
db.message.belongsTo(db.user, { onDelete: 'NO ACTION', onupdate: 'NO ACTION' });


db.sequelize
  .sync()//{force: true  }
  .then((result) => {
    console.log("sync hiigdlee...");
  })
  .catch((err) => console.log(err));


app.listen(
  process.env.PORT,
  console.log(`Express сэрвэр ${process.env.PORT} порт дээр аслаа... `)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Алдаа гарлаа : ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
