var express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const multer = require('multer')
const Jimp = require('jimp');
const UserModel = require('../public/model/UserModel')
var jwt = require('jsonwebtoken');
const checkToken = require('../config/checkToken')

var router = express.Router();
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const uri = 'mongodb://127.0.0.1:27017/AssignmentServer'

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var upload = multer({           // khai báo đối tượng multer
  // storage: storage,
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // Giới hạn kích thước file 5MB
  }
})

// delete
router.delete('/delete/:id',checkToken, function (req, res, next) {

  UserModel.deleteOne({ _id: req.params.id })
    .then(() => {
      res.redirect('/user/list')
    })
    .catch(() => {
      res.send("Khong xoa được user 456")
    })
})

// edit
router.post('/form/edit/:id',checkToken, upload.single('file'), async (req, res) => {

  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  const role = req.body.role
  let avatar = req.body.file

  if (name != '' && email != '' && password != '' && role != '') {

    try {
      // Load ảnh từ buffer bằng Jimp
      const image = await Jimp.read(req.file.buffer);
      // Chuyển đổi ảnh sang base64 string
      avatar = await image.getBase64Async(Jimp.AUTO);

    } catch (error) {
      console.log(error);
    }

    UserModel.updateMany({ _id: req.params.id }, { name: name, email: email, password: password, role: role, path: avatar })
      .then(() => {
        res.redirect('/user/list')
      })
      .catch((error) => {
        console.log(error);
      });
  }

})

// create
router.post('/form/create',checkToken, upload.single('file'), async function (req, res, next) {

  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  const role = req.body.role
  let avatar = req.body.file

  if (name != '' && email != '' && password != '' && role != '') {

    try {
      // Load ảnh từ buffer bằng Jimp
      const image = await Jimp.read(req.file.buffer);
      // Chuyển đổi ảnh sang base64 string
      avatar = await image.getBase64Async(Jimp.AUTO);

    } catch (error) {
      console.log(error);
    }

    UserModel.create({
      name: name, email: email, password: password, role: 'user', path: avatar
    }).then(() => {
      res.redirect('/user/list')
    })
  } else {
    res.render('user', { title: 'Express', arrUser: arrUser, user: user, isList: false, isAllow: true, userEdit: userEdit, err: 'Signup failed, check again' });
  }
})

// read
router.get('/list', checkToken, async function (req, res, next) {


  const users = await UserModel.find({ email: req.user.email })

  if (users[0]?.role == 'admin') {
    var arrUser = await UserModel.find()

    res.render('user', { arrUser: arrUser, user: users[0], isList: true, isAllow: true, userEdit: null });

  } else {
    var arrUser = await UserModel.find({ email: users[0].email })
    res.render('user', { arrUser: arrUser, user: users[0], isList: true, isAllow: false, userEdit: null });
  }


});

// show form edit
router.get('/form/:id', checkToken , function (req, res, next) {

  UserModel.find({ _id: req.params.id })
    .then((users) => {

      if (users.length == 0) {
        res.status(400).send('Khong tim thay user 123')
      } else {
          UserModel.find({ email: req.user.email })
            .then((dataUsers) => {
              
              if(dataUsers[0].role == 'admin'){
                res.render('user', { title: 'Express', arrUser: null, user: dataUsers[0], isList: false, isAllow: true, userEdit: users[0], err: '' });
              }else{
                res.render('user', { title: 'Express', arrUser: null, user: dataUsers[0], isList: false, isAllow: false, userEdit: users[0], err: '' });
              }
            })
      }
    })
    .catch((err) => {
      res.send("Khong tim thay user 456")
    })
})

// show form add
router.get('/form', checkToken, function (req, res, next) {
 
    UserModel.find({ email: req.user.email })
      .then((users) => {
        if(users[0].role == 'admin'){
          res.render('user', { title: 'Express', arrUser: null, user: users[0], isList: false, isAllow: true, userEdit: null, err: '' });
        }else{
          res.render('user', { title: 'Express', arrUser: null, user: users[0], isList: false, isAllow: false, userEdit: null, err: '' });
        }
        
      })
});

module.exports = router;
