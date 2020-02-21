const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://heroku_t8sdqpj3:1ohkrj1s9ng197p9ut58ipog1h@ds351987.mlab.com:51987/heroku_t8sdqpj3', { useNewUrlParser: true, useUnifiedTopology: true , })
    .then(()=> console.log('MongoDB has started'))
    .catch((e) => console.log(e))
// let db = mongoose.connection;
// db.on('error', console.error.bind(console, 'Mongo connection error'));