const express = require('express');
const debug = require('debug')('app:userrouter');

const multer = require('multer');
const path = require('path');

//set the storage destination and naming 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

//will be using this for uploading
const upload = multer({ storage: storage });

//router basically acts like a mini app.
const router = express.Router();



let users = [
    {
        'id':0,
        'name': 'a',
        'age': 2
    },
    {
        'id':1,
        'name': 'b',
        'age': 3
    }
]
//all endpoints do not require /users/ anymore

router.get('/', function(req,res) {
    return res.send(users);
})

router.get('/:id', function(req,res) {
    let id = req.params.id;
    return res.send(users[id]);
})

router.post('/', function(req,res) {
    users.push(req.body);
    return res.send(users);
})

//request will first go through multer and then req.file will be available
router.post('/register', upload.single('file'), function(req,res) {
    debug(req.file);
    return res.send(req.file);
})

router.put('/:index', function(req,res){
    let index = req.params.index;
    users[index] = req.body;
    return res.send(users);
})

router.delete('/last', function(req,res){
    res.send(users.pop());
})
//make it available to be used in index.js
module.exports = router;