'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const hbs = require('hbs');
const helmet = require('helmet');

const home = require('./src/routes/home');
const userRouter = require('./src/routes/UsersRouter');
const authClientRouter = require('./src/routes/AuthClientRouter');

const consistentResponseMiddleware = require('./src/middleware/consistent_response');
const oauth2 = require('./src/auth/oauth2');
const sequelize = require('./server/models').sequelize;

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sessionOpts = {
  saveUninitialized: true, // saved new sessions
  resave: false, // do not automatically write to the session store
  secret: 'some_secret',
  cookie: {
    httpOnly: true,
    maxAge: (1000 * 60 * 60 * 24 * 365),  // configure when sessions expires
  },
  store: new SequelizeStore({
    db: sequelize,
    table: 'session',
  }),
  proxy: true,
};

const app = express();

const corsOptions = {
  // origin: (origin, callback) => {
  //   // if (['http://localhost:63342'].indexOf(origin) !== -1) {
  //   //   callback(null, true);
  //   // } else {
  //   //   callback(new Error('Not allowed by CORS'));
  //   // }
  //   callback(null, true);
  // },
  origin: [/localhost.*/, /nasm.*/, /medlent.*/, /ec2.*/, /amazonaws.*/],
  credentials: true,
};

app.use(cors(corsOptions));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use((() => {
  return (req, res, next) => {
  if (req.headers['x-amz-sns-message-type']) {
  req.headers['content-type'] = 'application/json;charset=UTF-8';
}
next();
};
})());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());

app.use('/v1.0/*', consistentResponseMiddleware().middleware);

app.use('/', home);

// Start utilizing sessions for all other routes
app.use(session(sessionOpts));

app.use(passport.initialize());
app.use(passport.session());
require('./src/auth/auth');


app.use('/v1.0/oauth/token', oauth2.token);
app.use('/v1.0/oauth/clients', authClientRouter);

app.use('/v1.0/api/users', userRouter);


// error handlers
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
err.status = 404;
next(err);
});

app.use((err, req, res) => {
  const responseObject = {
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {},
  };

res.status(err.status || 500)
  .json(responseObject);
});

module.exports = app;
