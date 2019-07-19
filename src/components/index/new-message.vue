<template>
  <div class="new-message">
    <ul>
      <div class="msg-title">订单提示</div>
      <li>
        <span>待付款订单</span>
        <span>
          （
          <span class="red">{{orderData.dfk}}</span> ）
        </span>
      </li>
      <li>
        <span>待确认退货订单</span>
        <span>
          （
          <span class="red">{{returnData.dcl}}</span> ）
        </span>
      </li>
      <li>
        <span>待发货订单</span>
        <span>
          （
          <span class="red">{{orderData.dfh}}</span> ）
        </span>
      </li>
      <li>
        <span>待处理退款申请</span>
        <span>
          （
          <span class="red">{{returnData.thz}}</span> ）
        </span>
      </li>
    </ul>
    <ul>
      <div class="msg-title">订单总数</div>
      <li>
        <span>已完成订单</span>
        <span>
          （
          <span class="red">{{orderData.ywc}}</span> ）
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderData: {},
      returnData: {}
    };
  },
  created() {
    this.getOrderData();
    this.getReturnData();
  },
  methods: {
    getOrderData() {
      this.$axios({
        method: "post",
        url: this.$api.order_count,
        data: {
          merchantId: JSON.parse(localStorage.user).merchantId
        }
      })
        .then(res => {
          // console.log(res);
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
        }
      })
        .then(res => {
          // console.log(res);
          this.returnData = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.new-message {
  width: 416px;
  // height: 420px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 6px 10px 0px rgba(4, 0, 0, 0.2);
  border-radius: 0px 0px 6px 6px;
  padding: 0 18px;
  & > ul {
    padding: 25px 20px 20px 20px;
    border-bottom: 1px solid rgba(210, 210, 210, 1);
    &:last-child {
      border: none;
    }
    .msg-title {
      font-size: 18px;
      font-weight: bold;
      color: rgba(89, 87, 87, 1);
      margin-bottom: 20px;
    }
    & > li {
      display: flex;
      justify-content: space-between;
      height: 48px;
      font-size: 16px;
      color: rgba(114, 113, 113, 1);
      line-height: 48px;
      & > span {
        display: inline-block;
        .red {
          color: #d23029;
        }
      }
    }
  }
}
</style>
