// var express = require('express');
// var router = express.Router();

var fs = require('fs');
var path = require("path");
var formidable = require('formidable');

const { Pics, Img } = require('../models/index');

// /* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'Express' });
// });

const UPLOAD_DIR = 'public'

let upload = (req, res) => {
  console.log('开始文件上传....');
  var form = new formidable.IncomingForm();
  //设置编辑
  form.encoding = 'utf-8';
  //设置文件存储路径, 根目录
  form.uploadDir = UPLOAD_DIR;
  //保留后缀
  form.keepExtensions = true;
  //设置单文件大小限制
  form.maxFieldsSize = 2 * 1024 * 1024;

  form.parse(req, (err, fields, files) => {
    if (err) console.log(err)
    // console.log(files);
    // console.log(files.thumbnail.path);
    // console.log('文件名:' + files.thumbnail.name);
    // var t = (new Date()).getTime();
    // //生成随机数
    // var ran = parseInt(Math.random() * 8999 + 10000);
    // //拿到扩展名
    // var extname = path.extname(files.thumbnail.name);
    // //path.normalize('./path//upload/data/../file/./123.jpg'); 规范格式文件名

    let oldPath = './' + path.normalize(files.file.path);
    let newPath = './' + UPLOAD_DIR + '/' + files.file.name;
    // console.log(newPath)
    // console.log(oldPath)
    //重命名
    console.log(req.url)
    fs.rename(oldPath, newPath, async err => {
      if (err) console.error(err);

      // img数据库保存
      let pics = await Pics.findOne({
        id: 1,
      }) //找到默认相册
      console.log(pics._id)
      let img = await Img.create({
        imgUrl: req.headers.origin,
        path: '/static/',
        image: files.file.name,
        pics: pics._id,//默认相册
      })
      // 返回
      res.send({
        msg: '上传成功',
        data: img
      });
    });

    //res.end(util.inspect({fields: fields, files: files}));
  });
}

module.exports = upload;