const express = require("express");
const app = express();
const cors = require('cors');
const redis = require('redis');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const redisClient = redis.createClient();
const port = 8081;
app.use(bodyParser.json({ limit: '20mb', type: 'application/json' }));
app.use(cookieParser());
const corsHandler = cors({
  // origin: (origin, callback) => {
  //   if (origin === undefined || whitelist.indexOf(origin) !== -1) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error('Not allowed by CORS'));
  //   }
  // },
  origin: (origin, callback) => {
    callback(null, true);
  },
  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE',
  ],
  allowedHeaders: [
    'Accept',
    'Accept-Encoding',
    'Access-Control-Request-Headers',
    'Connection',
    'Content-Type',
    'Content-Length',
    'Content-Disposition',
    'Cookie',
    'Origin',
    'User-Agent',
    'Pragma',
    'Authorization'
  ],
  credentials: true,
});

app.use(corsHandler);
app.options('*', corsHandler);

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/librarySystem', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Mongoose connected'));

// === Redis
redisClient.on('error', (err) => {
  console.log('Redis error: ', err);
});

// === Passport

const expressSession = require('express-session');

const RedisStore = require('connect-redis');
app.use(expressSession({
  secret: 'secretAuthYeah',
  resave: false,
  rolling: true,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 86400000,
  },
  name: 'Audit.Tool.sid',
}));
// const passport = require('passport');
// app.use(passport.initialize());
// app.use(passport.session());


// === Routes
require('./routes/index')(app);
// === Error handling
app.use((err, req, res, next) => {
  if (err.status === 'ERR') {
    return res.json(err);
  }

  return null;
});

app.listen(port, () => console.log(`Listening on port ${port}!`)

);