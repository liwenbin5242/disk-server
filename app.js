const path = require('path');
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const { logger } = require('./utils/logger');
const { tokenAuth } = require('./lib/auth');
const { urlecodes } = require('./lib/utils');

const userRotes = require('./routes/user');
const diskRotes = require('./routes/disk');
const menuRotes = require('./routes/menu');
const app = express();
const cors = require('cors');

// view engine setup

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(urlecodes);
app.all('*', (req, res, next)=> {
    logger.info(`Method:${req.method} from ${req.ip.slice(7)}${req.path}`);
    next();
});
app.all('*', tokenAuth, );
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'static')));

app.use('/api/user', userRotes);
app.use('/api/disk', diskRotes);
app.use('/api/menu', menuRotes);
app.use('/api', diskRotes);
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