const express = require("express")
const router = express.Router()
const controller = require("../controller/file.controller")
const multer = require('multer')
const path = require('path')
const debug = require('debug')('myapp:server')

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, './public/uploads')
   },
   filename: (req, file, cb) => {
      cb(null, file.fieldname + '_' + uploadDate + path.extname(file.originalname))
   }
})

// Uploading
const upload = multer({ storage: storage })

// Adding formated date to filename
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
}

// Routes
router.get('/', (req, res) => res.render('home'))
router.get('/files', controller.getFiles)
router.get('/files/:name', controller.download)
router.delete('/:name', controller.deleteFile)
router.post('/', upload.single('file'), function(req, res) {
  if (req.file == undefined) {
    req.flash('error_msg', "There is no file to upload")
    res.redirect('/')
  } else {
    debug(req.file)
    // console.log('storage location is ', req.hostname +'/' + req.file.path)
    req.flash('success_msg', "The file has been uploaded successfully")
    res.redirect('/')
  }
})

module.exports = router
