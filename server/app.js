require('./config/config');
require('./models/db');
require('./config/passportConfig');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const router = express.Router();
const cookieParser = require('cookie-parser');
const path = require('path')
/*const auth = require('./routes/index.router');*/

const product = require('./routes/product.router');
const rtsIndex = require('./routes/index.router');
const adminRoute = require('./routes/admin.router');

const webMiddleware = require("./middlewares/web.middleware");

var app = express();

var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(corsOption));
app.use(cookieParser('my-secret'));
app.use(passport.initialize());
app.use(webMiddleware);
app.use('/api', rtsIndex);
app.use('/uploads', express.static(path.join(path.normalize(`${__dirname}/uploads`).replace('\\', '/'))));
app.use('/api/admin', adminRoute);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
    else{
        console.log(err);
    }
});


app.use('/api', router);
app.use('/product', product);

// start server
app.listen(process.env.PORT || 3000, () => console.log(`Server started at port : ${process.env.PORT}`));