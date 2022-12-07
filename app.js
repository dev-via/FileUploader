const express = require('express');
const app = express();
const debug = require('debug')('myapp:server');
const flash = require('connect-flash')
const session = require("express-session")
const multer = require('multer');
const logger = require('morgan'); //shows requests in console
const serveIndex = require('serve-index');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars')
const fs = require('fs');
const cors = require("cors");
const path = require('path')
const methodOverride = require('method-override')

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/storage', express.static('./public/uploads'), serveIndex('./public/uploads', {'icons': false}))
app.use(express.static(__dirname + "/public/"));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
    cookie: { maxAge: 60000 * 30 }
  })
)

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)

// Connect flash
app.use(flash())

app.disable('x-powered-by')

// Global variables
app.use(function(req, res, next) {
  res.locals.user = req.user || null
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.pw_error_msg = req.flash('pw_error_msg')
  next()
})

// CORS
global.__basedir = __dirname;

const corsOptions = {
   origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }))

// Handlebars
app.engine('.hbs',exphbs({
  helpers: {},
  defaultLayout: 'main',
  extname: '.hbs',
  })
)

app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))

//Routes
app.use('/', require('./routes/index'))

// Start Server
const PORT = process.env.PORT || 3000
app.listen(PORT, console.log(`Server started on port ${PORT}`))
