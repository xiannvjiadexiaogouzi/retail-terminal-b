const http = require('http');

const mixins = {
  // 获取 req 的参数
  getFront(req) {
    if (req.body.currentPage) {
      return {
        currentPage: req.body.currentPage || 1,
        pageSize: req.body.pageSize || 5,
        // orderBy: req.body.orderBy || null,
        // name: req.body.name || null
      };
    } else return {}
  },
  // 获取 查询参数
  getOption(req, option) {
    let options = Array.from(arguments);
    options.shift();
    let obj = {};
    for (let i = 0, len = options.length; i < len; i++) {
      if (len === 1) {
        if (req[options[i]] || req[options[i]] === 0) {
          obj[options[i]] = req[options[i]];
          return obj;
        } else return null
      } else {
        if (req[options[i]] || req[options[i]] === 0) {
          obj[options[i]] = req[options[i]];
        }
      }
    }
    return obj;
  },
  // 获取 formdata
  getForm(req, oldData) {
    // 浅拷贝req.body数据，对应到data里面
    for (let key in req) {
      oldData[key] = req[key];
    }
    // 除去id
    delete oldData.id;
  },
  // 计算 页数-数据
  async getPages(front, database, options) {
    let pages = {};
    let allData = await database.find().where(options); //找到所有数据
    pages.totalCount = allData.length; // 总数据量
    pages.totalPage = Math.ceil(pages.totalCount / front.pageSize); //总数据页数
    return pages;
  },
  // 获取时间
  getTime() {
    let time = new Date();
    return time.toLocaleString();
  },
  // 获取ip
  getIp(req) {
    let ip = req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null) || req.headers['x-forwarded-for']; // x-forwarded-for容易被伪造
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7);
    }
    return ip;
  },
  // 获取ip城市信息
  getIpInfo(model) {
    let tb_server = 'http://ip.taobao.com/service/getIpInfo.php?ip=';
    let url = tb_server + model.ip;
    let des = '';
    http.get(url, (res) => {
      res.setEncoding('utf-8');
      let code = res.statusCode;
      if (code == 200) {
        res.on('data', (data) => {
          des = JSON.stringify(JSON.parse(data));
        });
        res.on('end', () => {
          model.des = des;
          model.save();
        })
      }
    })
  },
  // 获取浏览器信息
  getBrowser(req) {
    // console.log(req.headers['user-agent']);
    let str = req.headers['user-agent'];
    let i = -1;
    let browser = ['Chrome', 'Safari', 'Firefox', 'MSIE']
    for (let j = 0, len = browser.length; j < len; j++) {
      if (i !== -1) {
        str = str.slice(i);
        i = str.indexOf('.') + 2;
        return str.slice(0, i);
      }
      i = str.indexOf(browser[j]);
    }
  },
  // 自动生成递增编号
  async createNo(database) {
    let lastId = 0;
    let datas = await database.find().sort({ id: -1 });
    if (datas.length) lastId = datas[0].id;
    return ++lastId;
  },
  // 递归深拷贝对象
  deepCopy(obj, dataObj) {
    let that = this;
    if (typeof obj != 'object') return obj;
    for (let key in obj) {
      dataObj[key] = (obj[key].constructor === Array) ? [] : {};
      dataObj[key] = that.deepCopy(obj[Key], dataObj[key])
    }
  },
  //随机时间
  randomDate(y, boolean, y3 ) {
    let y1 = new Date(y).getTime();
    let y2 = new Date().getTime();
    let dif = 0;
    if(!boolean){
      dif = y2 - y1
      dif *= Math.random();
    }
    y3 = y3 || 0;
    dif += y3;
    y1 += dif
    return new Date(y1).toLocaleString();
  },
  //随机数
  randomNum(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
  },
}

module.exports = mixins;