const merchant = require('./user-router.js');
const brand = require('./brand-router.js');
const type = require('./type-router.js');
const pics = require('./pics-router.js');
const img = require('./img-router.js');
const style = require('./style-router.js');
const property = require('./property-router.js');
const param = require('./param-router.js');
const product = require('./product-router.js');
const comment = require('./comment-router.js');
const order = require('./order-router.js');
const returning = require('./return-router.js');
const site = require('./site-router.js');
const reason = require('./reason-router.js');
const stock = require('./stock-router.js');
const account = require('./account-router.js');
const ad = require('./ad-router.js');
const pay = require('./setting-router.js');
const operate = require('./operate-router.js');


const routers = [
  {
    path: 'merchant',
    router: merchant,
  },
  {
    path: 'merchant_goods_brand',
    router: brand,
  },
  {
    path: 'merchant_goods_galleries',
    router: pics,
  },
  {
    path: 'merchant_goods_galleries_detail',
    router: img,
  },
  {
    path: 'merchantGoodsType',
    router: type,
  },
  {
    path: 'merchantGoodsStyle',
    router: style,
  },
  {
    path: 'merchantGoodsProperty',
    router: property,
  },
  {
    path: 'merchantGoodsParam',
    router: param,
  },
  {
    path: 'merchantGoods',
    router: product,
  },
  {
    path: 'merchantGoodsComment',
    router: comment,
  },
  {
    path: 'merchant_order',
    router: order,
  },
  {
    path: 'merchant_return_goods',
    router: returning,
  },
  {
    path: 'return_send',
    router: site,
  },
  {
    path: 'return_reason',
    router: reason,
  },
  {
    path: 'merchant_goods_log',
    router: stock,
  },
  {
    path: 'user',
    router: account,
  },
  {
    path: 'merchant_ad',
    router: ad,
  },
  {
    path: 'merchant_pay_mode',
    router: pay,
  },
  {
    path: 'user_operation_log',
    router: operate,
  },
]

module.exports = routers;
