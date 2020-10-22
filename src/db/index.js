const mongoose = require("mongoose");
const {Order} = require("../api/models");
const io = require('socket.io')(3100);

const db = () => {
    return mongoose.connect(
        process.env.DB_URL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        },
        (err) => {
            if (err) return console.log("ERROR = = = ", err);
            console.log("Mongo works ...");

            io.on('connection', (socket) => {
                console.log('user connected')
                socket.on('join', (data) => {      // data will look like => {myID: "123123"}
                    console.log('user joined room',data.my)
                    socket.join(data.my)
                })
            })

            Order.watch().on('change', (change) => {
                console.log('Changed',change)
                io.emit('changes', change.fullDocument)
            })
        }
    );
};

module.exports = db;
