import {connection, connect} from 'mongoose';
import mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const getDBUri = () => {
    if (process.env.isTesting === 'true') return 'mongodb://localhost/omer_app'
    if (process.env.PORT) return 'mongodb://____';
    return 'mongodb://localhost/omer_app';
}

connect(getDBUri(),{ useNewUrlParser: true,  useFindAndModify: false });