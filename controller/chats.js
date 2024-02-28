const asyncHandler = require("express-async-handler");
const MyError = require("../utils/myError");
const { Op } = require('sequelize');

exports.getChatRoom = asyncHandler(async (req, res, next) => {

    let user = await req.db.user.findOne({
        include: [{
            model: req.db.chatRoom,
            attributes: ['id', 'name', 'description'],

            through: {
                attributes: [],
            },
            include: [{
                model: req.db.user,
                attributes: ['id', 'name', 'email', 'image'],
                through: {
                    attributes: [],
                },
            },
            {
                model: req.db.message,
                attributes: ['id', 'message', 'createdAt',],
                through: {
                    attributes: [],
                },
                order: [['createdAt', 'DESC']],
                limit: 1,
            },]

        }],
        where: { id: req.params.id },
    });

    if (!user) {
        throw new MyError("Nom oldsongui", 404);
    }
    res.status(200).json({
        success: true,
        data: user.chatRooms,
    });
});

exports.create = asyncHandler(async (req, res, next) => {

    const userOne = req.body.userOne;
    const userTwo = req.body.userTwo;
    ["userTwo", "userOne"].forEach((el) => delete req.body[el]);

    // const chatRoomEx = await req.db.chatRoom.findOne({
    //     include: [
    //         {
    //             model: req.db.user,
    //             where: { id: [userOne, userTwo] } // Replace userId1 and userId2 with the actual user IDs
    //         }
    //     ],
    //     group: ['chatRoom.id'],
    //     having: req.db.sequelize.literal(`COUNT(DISTINCT chatRoom.id) = 2`)
    // });
    // const chatRoomEx = await req.db.chatRoom.findOne({
    //     include: [
    //         {
    //             model: req.db.user,
    //             where: { id: [userOne,userTwo] },
    //         },
    //         // {
    //         //     model: req.db.user,
    //         //     where: { id: userTwo },
    //         // },
    //         {
    //             model: req.db.message,
    //         },
    //     ],
    //     group: ['chatRoom.id'],
    //     having: req.db.sequelize.literal(`COUNT(DISTINCT chatRoom.id) = 2`)
    // });
    const chatRoom = await req.db.user.findByPk(userOne, {
        include: [
            {
                model: req.db.chatRoom,
                through: {
                    attributes: []
                },
                include: [
                    {
                        model: req.db.user,
                        where: { id: [userTwo] }
                        , attributes: []
                        , 
                    },
                    {
                        model: req.db.message,


                    }
                ]
            }
        ]
    });
    const chatRoomEx = await req.db.chatRoom.findByPk(chatRoom.chatRooms[0].id);



    console.log(chatRoomEx);

    if (chatRoomEx) {
        const chatRoom = chatRoomEx.toJSON();
        chatRoom.users = await chatRoomEx.getUsers( );
        chatRoom.messages = await chatRoomEx.getMessages();

        // chatRoom.message = [];

        res.status(200).json({
            success: true,
            data: chatRoom,
        });
    } else {
        const chatroom = await req.db.chatRoom.create(req.body, { include: [req.db.user, req.db.message] });

        if (!chatroom) {
            throw new MyError("Chatroom uusgehej chadsangui", 404);
        }
        const user1 = await req.db.user.findByPk(userOne);
        const user2 = await req.db.user.findByPk(userTwo);


        chatroom.addUser(user1);
        chatroom.addUser(user2);

        const chatRoom = chatroom.toJSON();
        chatRoom.user = [user1.toJSON(), user2.toJSON()];
        chatRoom.message = [];


        res.status(200).json({
            success: true,
            data: chatRoom,
        });
    }
});