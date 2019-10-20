var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require("multer")//用于Node.js multipart/form-data请求数据处理的中间件
const session = require('express-session')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var photosRouter = require('./routes/photos');
var uploadRouter = require('./routes/upload');
var accountRouter = require('./routes/account');
var agentRouter = require('./routes/agent');//代理中间件
// var cors = require("cors")

var app = express();

// app.use(cors())//跨域处理
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('photos', path.join(__dirname, '/public/photos'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true, cookie: { maxAge: 100 * 60000 } }))
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({ dest: path.join(__dirname, '/public/photos') }).any())//处理文件上传，能直接拿到上传的文件file

app.use((req, res, next) => {
  if (req.url.includes("account")) {
    next()
  } else {
    if (req.session.loginedname) {
      next()
    } else {
      res.send({
        code: 2,
        message: "please login first!"
      })
    }
  }
})

// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/photo', photosRouter);
app.use('/upload', uploadRouter);
app.use('/account', accountRouter);
app.use('/agent', agentRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.error(err.stack)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
