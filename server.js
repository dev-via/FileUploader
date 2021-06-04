const express = require('express');
const app = express();
const debug = require('debug')('myapp:server');
const path = require('path');
const multer = require('multer');
const logger = require('morgan');
const serveIndex = require('serve-index');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const fs = require('fs');
const cors = require("cors");

//date formating and files renaming
const date = new Date();
const uploadDate = (date.getFullYear() +
   '-' + addZero((date.getMonth()+1)) +
   '-' + addZero(date.getDate()) +
   '_' + addZero(date.getHours()) + 
   ':' + addZero(date.getMinutes()) + 
   ':' + addZero(date.getSeconds())
);

function addZero(num) {
   if (num <= 9) {
      return '0' + num;
   } else {
      return num;
   }
};

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, './public/uploads')
   },
   filename: (req, file, cb) => {
      cb(null, file.fieldname + '_' + uploadDate + path.extname(file.originalname))
   }
});


// configure Handlebars view engine
app.engine('handlebars', expressHandlebars({
   defaultLayout: 'main',
   helpers: {
      section: function(name, options) {
         if(!this._sections) this._sections = {}
         this._sections[name] = options.fn(this)
         return null
      },
   },
}))

app.set('view engine', 'handlebars')


//will be using this for uploading
const upload = multer({ storage: storage });

//get the router
const userRouter = require('./routes/user.route');

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/storage', express.static('./public/uploads'), serveIndex('./public/uploads', {'icons': false}));
app.use(express.static(__dirname + "/public/"));
app.get('/', (req, res) => res.render('home'))

app.get('/succes-download-message', (req, res) => res.render('succes-download-message'));

app.get('/no-file-to-upload', (req, res) => res.render('no-file-to-upload'));

app.post('/', upload.single('file'), function(req, res) {
   if (req.file == undefined) {
      res.redirect('no-file-to-upload');
   } else {
      debug(req.file);
      console.log('storage location is ', req.hostname +'/' + req.file.path);
      res.redirect('succes-download-message');
   }
});

// (cors) sending JSON to client
global.__basedir = __dirname;

const corsOptions = {
   origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

const initRoutes = require("./routes");

app.use(express.urlencoded({ extended: true }));
initRoutes(app);

//if end point is /users/, use the router.
app.use('/users', userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
   debug('Server is up and running on port ', port);
})
