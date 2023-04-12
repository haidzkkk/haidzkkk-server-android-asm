var express = require('express');

const mongoose = require('mongoose');
const UserModel = require('../public/model/UserModel')

const bodyParser = require("body-parser");
const multer = require('multer')
const Jimp = require('jimp');
const { url } = require('inspector');

var router = express.Router();
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const uri = 'mongodb://127.0.0.1:27017/AssignmentServer'
// Kết nối tới MongoDB
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


/* GET home page. */
router.post('/', upload.single('file'), async (req, res) => {

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmpassword = req.body.confirmpassword;

  if (name != '' && email != '' && password != '' && confirmpassword != '') {

      if (password == confirmpassword) {

        try {
          // Load ảnh từ buffer bằng Jimp
          const image = await Jimp.read(req.file.buffer);
    
          // Chuyển đổi ảnh sang base64 string
          const avatar = await image.getBase64Async(Jimp.AUTO);
    
          // Lưu user vào MongoDB
          const user = new UserModel({
            name: req.body.name,
            email: req.body.name,
            password: req.body.name,
            role: 'user',
            path: avatar
          })
    
          await user.save();
          // res.send('User created successfully!');
          res.cookie('dataUser', email)                                 // lưu cookie (kiểu shearefeferent)
          res.json({ success: true, msg: 'Successful created new user.' });
        } catch (error) {
          console.error(error);
          res.json({ success: true, msg: 'failed.' });
        }
      } else {
        res.json({ success: true, msg: 'failed.' });
      }
  } else {
    res.json({ success: false, msg: 'Failed created new user.' });
  }

});

module.exports = router;