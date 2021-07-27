const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const { logger } = require('./utils/logger');
const { tokenAuth } = require('./lib/auth')
const { urlecodes } = require('./lib/utils')

const userRotes = require('./routes/user');
const diskRotes = require('./routes/disk');
const app = express();
const config = require('config')
const CORS = config.get('CORS')
const cors = require('cors')


// view engine setup

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(urlecodes);
// app.use(express.static(path.join(__dirname, 'public')));
app.all('*', tokenAuth, )
app.all('*', (req, res, next)=> {
    logger.info(`Method:${req.method} from ${req.ip.slice(7)}${req.path}`);
    const origin = req.headers.origin;
    // if (CORS.includes(origin)) {
        // res.header('Access-Control-Allow-Origin', '*');
    // }
    // res.setHeader('Access-Control-Allow-Origin','*')
    // res.header('Access-Control-Allow-Credentials', true);
    // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    // res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,PATCH,OPTIONS');
    // res.header('X-Powered-By', ' 3.2.1');
    // res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});
app.use(express.static('public'));
app.use('/user', userRotes);
app.use('/disk', diskRotes);

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

app.use('/oauth_redirect', async(req, res, next) => {
    req
})
module.exports = app;