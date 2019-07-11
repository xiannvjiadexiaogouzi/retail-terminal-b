# express
`npm i express@next`

# mongoose
`npm i mongoose`

# session
`npm i express-session`

退出时删除保存的user
`delete req.session.user;`
or
`req.session.destroy();`

退出系统时清空cookie
`res.clearCookie(sessionId);`

# 不可逆密码加密
`npm i bcrypt`

# 数据不可重
models中
```
mongoose.connect('mongodb://localhost:27017/terminal-server',{
  useNewUrlParser: true,
  useCreateIndex: true, //为数据创建index
})
```
数据shema中
```
const userShema = new mongoose.Schema({
  ...
  username: {type: String, unique: true}, //添加unique: true;
  ...
```
# token

# 图片上传
**formidable**
- https://segmentfault.com/a/1190000011424511
