const mongoose = require('mongoose');


async function getMongoDB() {
    mongoose
        .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB connected successfully'))
        .catch(err => console.log('Mongo DB connection error: ', err));
}

module.exports = {
    getMongoDB
}