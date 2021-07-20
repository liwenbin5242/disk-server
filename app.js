const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const { logger } = require('./utils/logger');

const userRotes = require('./routes/user');
const app = express();

// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.all('*', (req, res, next)=> {
    logger.info(`Method:${req.method} from ${req.ip.slice(7)}${req.path}`);
    next();
});
app.use(express.static('public'));
app.use('/user', userRotes);

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
module.exports = app;