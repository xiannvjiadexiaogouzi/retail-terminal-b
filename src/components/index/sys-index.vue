<template>
  <div class="sys-index">
    <header>
      <div class="header-item">
        <div class="sys-index-item-wrapper">
          <div class="header-order"></div>
          <div>
            <p>今日订单总数</p>
            <p>{{orderData.todayOrderNum}}</p>
          </div>
        </div>
      </div>
      <div class="header-item">
        <div class="sys-index-item-wrapper">
          <div class="header-money"></div>
          <div>
            <p>今日销售总额</p>
            <p>{{orderData.todayOrderMoney}}</p>
          </div>
        </div>
      </div>
      <div class="header-item">
        <div class="sys-index-item-wrapper">
          <div class="header-moneys"></div>
          <div>
            <p>昨日销售总额</p>
            <p>{{orderData.yesterdayOrderMoney}}</p>
          </div>
        </div>
      </div>
      <div class="header-item">
        <div class="sys-index-item-wrapper">
          <div class="header-charts"></div>
          <div>
            <p>近7天销售总额</p>
            <p>{{orderData.nearlySevenDaysOrderMoney}}</p>
          </div>
        </div>
      </div>
    </header>

    <div class="todo">
      <div class="title-wrapper">
        <span class="title">待处理事务</span>
      </div>
      <tr>
        <td>
          <span @click="$router.push('/order/order-list')">待付款订单</span>
          <span>
            （
            <span class="todo-num">{{orderData.dfk}}</span> ）
          </span>
        </td>
        <td>
          <span @click="$router.push('/order/order-list')">已完成订单</span>
          <span>
            （
            <span class="todo-num">{{orderData.ywc}}</span> ）
          </span>
        </td>
        <td>
          <span @click="$router.push('/order/return')">待确认退货订单</span>
          <span>
            （
            <span class="todo-num">{{returnData.dcl}}</span> ）
          </span>
        </td>
      </tr>
      <tr>
        <td>
          <span @click="$router.push('/order/order-list')">待发货订单</span>
          <span>
            （
            <span class="todo-num">{{orderData.dfh}}</span> ）
          </span>
        </td>
        <td>
          <span @click="$router.push('/order/refund')">待处理退款申请</span>
          <span>
            （
            <span class="todo-num">{{returnData.thz}}</span> ）
          </span>
        </td>
        <td>
          <span @click="$router.push('/order/order-list')">已发货订单</span>
          <span>
            （
            <span class="todo-num">{{orderData.yfh}}</span> ）
          </span>
        </td>
      </tr>
      <tr>
        <td>
          <span @click="$router.push('/operation/ad-list')">广告位即将到期</span>
          <span>
            （
            <span class="todo-num">0</span> ）
          </span>
        </td>
        <td>
          <span @click="$router.push('/order/order-list')">总订单数量</span>
          <span>
            （
            <span class="todo-num">{{orderData.allOrder}}</span> ）
          </span>
        </td>
        <!-- <td>
          <span>待付款订单</span>
          <span>
            （
            <span class="todo-num">10</span> ）
          </span>
        </td>-->
      </tr>
    </div>

    <div class="shortcut">
      <div class="title-wrapper">
        <span class="title">运营快捷入口</span>
      </div>
      <div class="content-wrapper">
        <div class="content-icon-wrapper" v-for="(item,index) in shortcuts" :key="index" @click="$router.push(item.path)">
          <i class="shortcut-icon" :class="item.name"/>
          <p>{{item.title}}</p>
        </div>
      </div>
    </div>

    <div class="overall">
      <div class="product-overall">
        <div class="title-wrapper">
          <span class="title">商品总览</span>
        </div>
        <div class="content-wrapper">
          <div class="content-icon-wrapper">
            <p class="red-num">{{productData.notPull}}</p>
            <p class="normal-font">已下架</p>
          </div>
          <div class="content-icon-wrapper">
            <p class="red-num">{{productData.put}}</p>
            <p class="normal-font">已上架</p>
          </div>
          <div class="content-icon-wrapper">
            <p class="red-num">{{productData.count}}</p>
            <p class="normal-font">库存紧张</p>
          </div>
          <div class="content-icon-wrapper">
            <p class="red-num">{{productData.all}}</p>
            <p class="normal-font">全部商品</p>
          </div>
        </div>
      </div>

      <div class="user-overall">
        <div class="title-wrapper">
          <span class="title">用户总览</span>
        </div>
        <div class="content-wrapper">
          <div class="content-icon-wrapper">
            <p class="red-num">{{userData.todayAddUserCount}}</p>
            <p class="normal-font">今日新增</p>
          </div>
          <div class="content-icon-wrapper">
            <p class="red-num">{{userData.yesterdayAddUserCount}}</p>
            <p class="normal-font">昨日新增</p>
          </div>
          <div class="content-icon-wrapper">
            <p class="red-num">{{userData.monthAddUserCount}}</p>
            <p class="normal-font">本月新增</p>
          </div>
          <div class="content-icon-wrapper">
            <p class="red-num">{{userData.allUserCount}}</p>
            <p class="normal-font">会员总数</p>
          </div>
        </div>
      </div>
    </div>

    <div class="order-statistics"></div>
    <div class="sale-statistics"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shortcuts: [
        { title: "添加商品", name: "add", path:'/product/add-product'},
        { title: "订单列表", name: "order", path:'/order/order-list' },
        { title: "用户管理", name: "users", path:'/account/account-list' },
        { title: "交易统计", name: "data", path:'' },
        // { title: "短信营销", name: "msg" },
        { title: "广告管理", name: "ad", path:'/operation/ad-list' },
        // { title: "专题管理", name: "heart", path:'/product/add-product' },
        // { title: "秒杀管理", name: "flash" },
        { title: "首页推荐", name: "good", path:'' }
      ],
      overall: [
        {
          title: "商品总览",
          proOverall: ["已下架", "", "", ""]
        },
        {}
      ],
      orderData: {},
      returnData: {},
      productData: {
        // notPull: "0",
        // put: "0",
        // count: "0",
        // all: "0"
      },
      userData: {}
    };
  },
  created() {
    this.getOrderData();
    this.getReturnData();
    this.getProductData();
    this.getUserData();
  },
  methods: {
    //订单
    getOrderData() {
      this.$axios({
        method: "post",
        url: this.$api.order_count,
        // url: 'https://bird.ioliu.cn/v1?url=http://47.107.167.164:8080/merchant_order/getOrderAllCount',
        // url: "api/merchant_order/getOrderAllCount",
        data: {
          merchantId: JSON.parse(localStorage.user).merchantId
        },
        // type:'json',
        // headers: { "Content-Type": "application/json" }
      })
        .then(res => {
          console.log(res);
          this.orderData = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getReturnData() {
      this.$axios({
        method: "post",
        url: this.$api.return_view,
        data: {
          merchantId: JSON.parse(localStorage.user).merchantId
        },
      })
        .then(res => {
          console.log(res);
          this.returnData = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //商品总览
    getProductData() {
      this.$axios(this.$api.good_count_statistic)
        .then(res => {
          console.log(res);
          if (res.data) {
            this.productData = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //用户总览
    getUserData() {
      this.$axios(this.$api.user_index)
        .then(res => {
          console.log(res);
          this.userData = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/mixin.scss";

.sys-index {
  & > header {
    display: flex;
    justify-content: space-between;
    .header-item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 280px;
      height: 105px;
      background: rgba(247, 248, 248, 1);
      border: 1px solid rgba(91, 192, 191, 1);
      margin-right: 55px;
      &:last-child {
        margin: 0;
      }
      .sys-index-item-wrapper {
        display: flex;
        .header-order {
          @include bg-icon("../../assets/img/index/sys-index/header-order.png");
          width: 48px;
          height: 53px;
          margin-right: 20px;
        }
        .header-money {
          @include bg-icon("../../assets/img/index/sys-index/header-money.png");
          width: 53px;
          height: 53px;
          margin-right: 20px;
        }
        .header-moneys {
          @include bg-icon(
            "../../assets/img/index/sys-index/header-moneys.png"
          );
          width: 45px;
          height: 56px;
          margin-right: 20px;
        }
        .header-charts {
          @include bg-icon("../../assets/img/index/sys-index/charts.png");
          width: 53px;
          height: 51px;
          margin-right: 20px;
        }
        & p:first-child {
          line-height: 18px;
          font-size: 18px;
          color: rgba(89, 87, 87, 1);
          margin-bottom: 14px;
        }
        & p:last-child {
          font-size: 24px;
          font-weight: bold;
          color: rgba(210, 48, 41, 1);
        }
      }
    }
  }
  .todo {
    @include box(100%, 240px);
    .title-wrapper {
      border-top: none;
    }
    tr {
      display: flex;
      height: 60px;
      width: 100%;
      border-bottom: 1px solid rgba(181, 181, 181, 1);
      &:last-child {
        border: none;
      }

      & > td {
        flex: 1;
        display: flex;
        justify-content: space-between;
        padding: 0 48px;
        line-height: 60px;
        border-right: 1px solid rgba(181, 181, 181, 1);
        &:last-child {
          border: none;
        }

        font-size: 18px;
        color: rgba(89, 87, 87, 1);
        &:hover {
          color: rgba(91, 192, 191, 1);
          cursor: pointer;
        }
        & > span {
          display: inline-block;
          .todo-num {
            color: rgb(255, 0, 0);
          }
        }
      }
    }
  }
  .shortcut {
    @include box(100%, 230px);
    border-top: none;
    .content-wrapper {
      display: flex;
      justify-content: space-between;
      padding: 38px 43px 43px 43px;
      height: 170px;
      // border: 1px solid rgba(181, 181, 181, 1);
      border-top: none;
      line-height: 18px;
      font-size: 18px;
      color: rgba(89, 87, 87, 1);
      .content-icon-wrapper {
        &:hover {
          cursor: pointer;
          .add {
            @include url("add_on");
          }
          .order {
            @include url("order_on");
          }
          .users {
            @include url("users_on");
          }
          .data {
            @include url("data_on");
          }
          .msg {
            @include url("msg_on");
          }
          .ad {
            @include url("ad_on");
          }
          .heart {
            @include url("heart_on");
          }
          .flash {
            @include url("flash_on");
          }
          .good {
            @include url("good_on");
          }
          p {
            color: $blue;
          }
        }
        .add {
          @include url("add");
        }
        .order {
          @include url("order");
        }
        .users {
          @include url("users");
        }
        .data {
          @include url("data");
        }
        .msg {
          @include url("msg");
        }
        .ad {
          @include url("ad");
        }
        .heart {
          @include url("heart");
        }
        .flash {
          @include url("flash");
        }
        .good {
          @include url("good");
        }
      }
    }
    .shortcut-icon {
      display: inline-block;
      width: 50px;
      height: 50px;
      margin-bottom: 20px;
    }
  }
  .overall {
    display: flex;
    justify-content: space-between;
    .product-overall,
    .user-overall {
      @include box(450px, 220px);
      width: 48%;
    }
    .product-overall {
      border-top: none;
      .title-wrapper {
        border-right: none;
      }
    }
    .user-overall {
      border-top: none;
    }
    .content-wrapper {
      padding: 40px 50px 53px 50px;
    }
    .red-num {
      font-size: 26px;
      font-family: MicrosoftYaHei-Bold;
      font-weight: bold;
      color: rgba(210, 48, 41, 1);
      margin-bottom: 26px;
    }
    .normal-font {
      font-size: 18px;
      color: rgba(89, 87, 87, 1);
    }
  }
  .tstbox {
    @include box(100%, 160px);
  }
}
</style>
