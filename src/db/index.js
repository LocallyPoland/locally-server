const mongoose = require("mongoose");
const {Order} = require("../api/models");

const db = (io) => {
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
                    console.log('user joined room',data.email)
                    socket.join(data.email)
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
