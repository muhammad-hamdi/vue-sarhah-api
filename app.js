const express = require('express');
const app = express();
const bodyParser  = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes/api');
const config = require('./config');

const port = process.env.PORT || 3000;

mongoose.connect(config.database);
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

app.use('/api', routes);

app.listen(port);
console.log(`\nApp Running at => http://localhost:${port}\n`);
