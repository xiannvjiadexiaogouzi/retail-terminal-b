import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'login',
      component: () => import( /* webpackChunkName: "about" */ './views/Login.vue')
    },
    {
      path: '/index',
      name: 'index',
      // alias: '/index/sys-index',
      component: () => import( /* webpackChunkName: "about" */ './views/Index.vue'),
      // meta: { requiresAuth: true }, //用不到元信息
      children: [
        // index
        {
          path: 'sys-index',
          name: 'sys-index',
          component: () => import( /* webpackChunkName: "about" */ './components/index/sys-index.vue'),
        },
        {
          path: 'account-setting',
          name: 'account-setting',
          component: () => import( /* webpackChunkName: "about" */ './components/index/account-setting.vue')
        },
        {
          path: 'sys-info',
          name: 'sys-info',
          component: () => import( /* webpackChunkName: "about" */ './components/index/sys-info.vue')
        },
        {
          path: 'login-log',
          name: 'login-log',
          component: () => import( /* webpackChunkName: "about" */ './components/index/login-log.vue')
        },
        //product
        {
          path: '/product/product-list',
          name: 'product-list',
          component: () => import( /* webpackChunkName: "about" */ './components/product/product-list.vue')
        },
        {
          path: '/product/add-product',
          name: 'add-product',
          component: () => import( /* webpackChunkName: "about" */ './components/product/add-product.vue')
        },
        {
          path: '/product/recycle',
          name: 'recycle',
          component: () => import( /* webpackChunkName: "about" */ './components/product/recycle.vue')
        },
        {
          path: '/product/rating',
          name: 'rating',
          component: () => import( /* webpackChunkName: "about" */ './components/product/rating.vue')
        },
        {
          path: '/product/rating/:userId',
          name: 'rating-detail',
          component: () => import( /* webpackChunkName: "about" */ './components/product/rating-detail.vue')
        },
        {
          path: '/product/styles',
          name: 'styles',
          component: () => import( /* webpackChunkName: "about" */ './components/product/styles.vue')
        },
        {
          path: '/product/styles/property/:styleId',
          name: 'property',
          component: () => import( /* webpackChunkName: "about" */ './components/product/property.vue')
        },
        {
          path: '/product/styles/param/:styleId',
          name: 'param',
          component: () => import( /* webpackChunkName: "about" */ './components/product/param.vue')
        },
        {
          path: '/product/styles/add-property',
          name: 'add-property',
          component: () => import( /* webpackChunkName: "about" */ './components/product/add-property.vue')
        },
        {
          path: '/product/styles/add-param',
          name: 'add-param',
          component: () => import( /* webpackChunkName: "about" */ './components/product/add-param.vue')
        },
        {
          path: '/product/types',
          name: 'types',
          component: () => import( /* webpackChunkName: "about" */ './components/product/types.vue')
        },
        {
          path: '/product/types/add-type',
          name: 'add-type',
          component: () => import( /* webpackChunkName: "about" */ './components/product/add-type.vue')
        },
        {
          path: '/product/brands',
          name: 'brands',
          component: () => import( /* webpackChunkName: "about" */ './components/product/brands.vue')
        },
        {
          path: '/product/add-brand',
          name: 'add-brand',
          component: () => import( /* webpackChunkName: "about" */ './components/product/add-brand.vue')
        },
        {
          path: '/product/pics',
          name: 'pics',
          component: () => import( /* webpackChunkName: "about" */ './components/product/pics.vue')
        },
        {
          path: '/product/add-pic',
          name: 'add-pic',
          component: () => import( /* webpackChunkName: "about" */ './components/product/add-pic.vue')
        },
        {
          path: '/product/check-pics',
          name: 'check-pics',
          component: () => import( /* webpackChunkName: "about" */ './components/product/check-pics.vue')
        },
        //order
        {
          path: '/order/order-list',
          name: 'order-list',
          component: () => import( /* webpackChunkName: "about" */ './components/order/order-list.vue')
        },
        {
          path: '/order/order-detail',
          name: 'order-detail',
          component: () => import( /* webpackChunkName: "about" */ './components/order/order-detail.vue')
        },
        {
          path: '/order/receipt',
          name: 'receipt',
          component: () => import( /* webpackChunkName: "about" */ './components/order/receipt.vue')
        },
        {
          path: '/order/order-setting',
          name: 'order-setting',
          component: () => import( /* webpackChunkName: "about" */ './components/order/order-setting.vue')
        },
        {
          path: '/order/return',
          name: 'return',
          component: () => import( /* webpackChunkName: "about" */ './components/order/return.vue')
        },
        {
          path: '/order/return-detail',
          name: 'return-detail',
          component: () => import( /* webpackChunkName: "about" */ './components/order/return-detail.vue')
        },
        {
          path: '/order/refund',
          name: 'refund',
          component: () => import( /* webpackChunkName: "about" */ './components/order/refund.vue')
        },
        {
          path: '/order/refund-detail',
          name: 'refund-detail',
          component: () => import( /* webpackChunkName: "about" */ './components/order/refund-detail.vue')
        },
        {
          path: '/order/return-reason',
          name: 'return-reason',
          component: () => import( /* webpackChunkName: "about" */ './components/order/return-reason.vue')
        },
        {
          path: '/order/return-site',
          name: 'return-site',
          component: () => import( /* webpackChunkName: "about" */ './components/order/return-site.vue')
        },
        {
          path: '/order/add-site',
          name: 'add-site',
          component: () => import( /* webpackChunkName: "about" */ './components/order/add-site.vue')
        },
        //stock
        {
          path: '/stock/in',
          name: 'in',
          component: () => import( /* webpackChunkName: "about" */ './components/stock/in.vue')
        },
        {
          path: '/stock/out',
          name: 'out',
          component: () => import( /* webpackChunkName: "about" */ './components/stock/out.vue')
        },
        //account
        {
          path: '/account/account-list',
          name: 'account-list',
          component: () => import( /* webpackChunkName: "about" */ './components/account/account-list.vue')
        },
        {
          path: '/account/account-detail',
          name: 'account-detail',
          component: () => import( /* webpackChunkName: "about" */ './components/account/account-detail.vue')
        },
        //sale
        {
          path: '/sale/head-list',
          name: 'head-list',
          component: () => import( /* webpackChunkName: "about" */ './components/sale/head-list.vue')
        },
        {
          path: '/sale/add-head',
          name: 'add-head',
          component: () => import( /* webpackChunkName: "about" */ './components/sale/add-head.vue')
        },
        //operation
        {
          path: '/operation/ad-list',
          name: 'ad-list',
          component: () => import( /* webpackChunkName: "about" */ './components/operation/ad-list.vue')
        },
        {
          path: '/operation/add-ad',
          name: 'add-ad',
          component: () => import( /* webpackChunkName: "about" */ './components/operation/add-ad.vue')
        },
        //setting
        {
          path: '/setting/pay-setting',
          name: 'pay-setting',
          component: () => import( /* webpackChunkName: "about" */ './components/setting/pay-setting.vue')
        },
        {
          path: '/setting/refund-certificate',
          name: 'refund-certificate',
          component: () => import( /* webpackChunkName: "about" */ './components/setting/refund-certificate.vue')
        },
        {
          path: '/setting/merchant-QRcode',
          name: 'merchant-QRcode',
          component: () => import( /* webpackChunkName: "about" */ './components/setting/merchant-QRcode.vue')
        },
        {
          path: '/setting/program-authorize',
          name: 'program-authorize',
          component: () => import( /* webpackChunkName: "about" */ './components/setting/program-authorize.vue')
        },
        //permisssion
        {
          path: '/permission/operation-log',
          name: 'operation-log',
          component: () => import( /* webpackChunkName: "about" */ './components/permission/operation-log.vue')
        },

      ]
    },
  ]
})