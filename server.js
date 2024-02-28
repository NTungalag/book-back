const express = require("express");
const dotenv = require("dotenv");
const fileUpload = require('express-fileupload');
const asyncHandler = require("express-async-handler");
const MyError = require("./utils/myError");

// Router оруулж ирэх
const categoriesRoutes = require("./routes/categories");
const booksRoutes = require("./routes/books");
const usersRoutes = require("./routes/users");
const chatsRoutes = require("./routes/chats");

const injectDb = require("./middleware/injectDb");
const errorHandler = require("./middleware/error");


// Аппын тохиргоог process.env рүү ачаалах
dotenv.config({ path: "./config/config.env" });
const db = require("./config/db-mysql");

const app = express();
//chat
const server = require('http').Server(app);
const io = require('socket.io')(server);


// app.use(express.bodyParser({limit: '2.3mb'}));
app.use(fileUpload());
app.use(express.json());
app.use(injectDb(db));
app.use("/api/categories", categoriesRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/chats", chatsRoutes);

app.use(errorHandler);


db.book.belongsTo(db.user, { onDelete: 'NO ACTION', onupdate: 'NO ACTION' });
db.user.hasMany(db.book, { onDelete: 'NO ACTION', onupdate: 'NO ACTION' });
db.book.belongsTo(db.category, { onDelete: 'NO ACTION', onupdate: 'NO ACTION' });
db.category.hasMany(db.book, { onDelete: 'NO ACTION', onupdate: 'NO ACTION' });

db.chatRoom.belongsToMany(db.user, { through: 'chatRoomUser' });
db.user.belongsToMany(db.chatRoom, { through: 'chatRoomUser' });

db.chatRoom.hasMany(db.message);
db.message.belongsTo(db.chatRoom);

db.user.hasMany(db.message);
db.message.belongsTo(db.user);

//

db.sequelize
  // .sync({force: true  })
  .sync()//{force: true  }

  .then((result) => {
    console.log("sync hiigdlee...");
  })
  .catch((err) => console.log(err));


// app.listen(
//   process.env.PORT,
//   console.log(`Express сэрвэр ${process.env.PORT} порт дээр аслаа... `)
// );
server.listen(
  process.env.PORT,
  console.log(`Express сэрвэр ${process.env.PORT} порт дээр аслаа... `)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Алдаа гарлаа : ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});


// chat
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('joinRoom', ({ roomId }) => {
    socket.join(roomId);
  });

  socket.on('chatHistory', asyncHandler(async ({ chatRoomId }) => {
    try {
      // Fetch the chat history from the database
      const messages = await db.message.findAll({
        where: { chatRoomId },
        include: [{ model: db.user, attributes: ['name'] }],
      });
      console.log(messages[0])
      // Map the messages to a new array with a simpler format
      const simplifiedMessages = messages.map((message) => ({
        id: message.id,
        message: message.message,
        status: message.status,
        senderUsername: message.user.username,
        createdAt: message.createdAt,
        userId: message.userId,
        chatRoomId: message.chatRoomId,
        updatedAt: message.updatedAt
      }));

      // Emit the chat history to the client
      socket.emit('chatHistory', simplifiedMessages);
    } catch (error) {
      throw new MyError(error);
    }
  }));

  // Handle incoming chat messages
  socket.on('message', asyncHandler(async ({ messageText, senderUserId, chatRoomId, roomId }) => {
    console.log(messageText, senderUserId, chatRoomId)
    // Insert the message into the database
    if (socket.rooms.has(roomId)) {
      if (socket.rooms.has(roomId)) {

        try {
          // Create a new chat message
          const chatMessage = await db.message.create({
            message: messageText,
            status: 0,
            userId: senderUserId,
            chatRoomId: chatRoomId,
          });

          if (chatMessage != null)
          // Broadcast the message to the room
          io.to(roomId).emit('message', {
            message: chatMessage.dataValues,
            // userId: senderUserId,
            // createdAt: new Date().toISOString(),
          });


        } catch (error) {
          throw new MyError(error);
        }
      }
    }
  })
  );
});
