var express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const session = require('express-session');
var jwt = require('jsonwebtoken');
const checkToken = require('../config/checkToken')

const UserModel = require('../public/model/UserModel')
var router = express.Router();

const uri = 'mongodb://127.0.0.1:27017/AssignmentServer'

mongoose.connect(uri)

/* GET home page. */
router.get('/', checkToken,async function (req, res, next) {
      const users = await UserModel.find({ email: req.user.email })
      // res.render('index', {user: users[0]})
      res.json(users[0]);
});

router.get('/logout', function (req, res) {
  res.clearCookie('token')
  res.send("logout thành công");
})


module.exports = router;
