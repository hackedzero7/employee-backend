const mongoose = require('mongoose');

exports.connectMongoDB = () => {
    mongoose.connect(process.env.MONGO_DB)
    .then((con) => {
        console.log(`Mongoose Successfully Connected on ${con.connection.host}`)
    })
    .catch((error) => {
        console.log(error)
    })
}