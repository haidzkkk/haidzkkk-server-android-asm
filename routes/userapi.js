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
    .then((data) => {
      res.json({ success: true, msg: 'Successful delete new user.' });
    })
    .catch(() => {
      res.json({ success: false, msg: 'Successful delete new user.' });
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
      .then((data) => {
        res.json({ success: true, msg: 'Successful edit new user.' });
      })
      .catch((error) => {
        res.json({ success: false, msg: 'Successful failed new user.' });
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
      
      res.json({ success: true, msg: 'Successful created new user.' });
    })
  } else {
    res.json({ success: false, msg: 'Failed created new user.' });
  }
})

// read
router.get('/list', checkToken, async function (req, res, next) {


  const users = await UserModel.find({ email: req.user.email })

  if (users[0]?.role == 'admin') {
    var arrUser = await UserModel.find()

    res.json(arrUser)
  } else {
    var arrUser = await UserModel.find({ email: users[0].email })
    res.json(arrUser)
  }


});

module.exports = router;
