const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const { logger } = require('./utils/logger');
const {wechatSchedule} = require('./lib/wechatSchedule');

const wechatRouter = require('./routes/wechat');
const bar = require('./routes/bar');
const msg = require('./routes/msg');
const app = express();

// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.all('*', (req, res, next)=> {
    logger.info(`from ${req.ip} ${req.method} ${req.url} ${req.path}`);
    next();
});
app.use(express.static('public'));
app.use('/', wechatRouter);
app.use('/bar', bar);
app.use('/msg', msg);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
wechatSchedule();
module.exports = app;