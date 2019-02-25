<template>
  <div class="refund-detail">
    <div class="main-wrapper">
      <div class="table-wrapper">
        <div class="header">退款单信息</div>
        <table>
          <tr>
            <td>服务单号</td>
            <td>{{tableData.code}}</td>
          </tr>
          <tr>
            <td>申请状态</td>
            <td>{{returnStatus(tableData.status)}}</td>
          </tr>
          <tr>
            <td>订单编号</td>
            <td>{{tableData.orderCode}}</td>
          </tr>
          <tr>
            <td>申请时间</td>
            <td>{{tableData.creatTime}}</td>
          </tr>
          <tr>
            <td>用户账号</td>
            <td>{{tableData.mobilePhone}}</td>
          </tr>
        </table>
        <table>
          <tr>
            <td>订单金额</td>
            <td>{{tableData.applicationReturnMoney}}</td>
          </tr>
          <tr>
            <td>确认退款金额</td>
            <td>
              <span v-if="tableData.status !== 1">{{tableData.returnMoney}}</span>
            </td>
          </tr>
          <tr>
            <td>退款方式</td>
            <td>退回到原支付渠道</td>
          </tr>
          <tr>
            <td>退款类型</td>
            <td>{{tableData.returnReason}}</td>
          </tr>
        </table>
        <table>
          <tr>
            <td>处理备注</td>
            <td>
              <el-input
                v-model="resolveRemark"
                v-if="tableData.status == 1 || tableData.status == 2"
              />
              <span v-if="tableData.status !== 1">{{tableData.resolveRemark}}</span>
            </td>
          </tr>
        </table>
      </div>
      <div class="btn-group">
        <el-button v-if="tableData.status== 2" @click="agreeOrRejectReturn(4)">确定退款</el-button>
        <el-button type="danger" v-if="tableData.status== 2" @click="agreeOrRejectReturn(5)">拒绝退款</el-button>
        <el-button v-if="tableData.status !== 2" @click="$router.go(-1)">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@/util/mixin.js";

export default {
  mixins: [mixin], //vue 混入
  data() {
    return {
      resolveRemark: ""
    };
  },

  created() {
    this.getTableData();
  },
  computed: {
    //分离图片
    problemPics() {
      let picArr = [];
      if (this.tableData.problemPhoto) {
        if (this.tableData.problemPhoto.indexOf(",") !== -1) {
          picArr = this.this.tableData.problemPhoto.split(",");
        } else {
          picArr.push(this.tableData.problemPhoto);
        }
      }
      return picArr;
    }
  },
  methods: {
    //刷新页面，重新获取数据
    getTableData() {
      //商品数据
      this.$axios({
        method: "post",
        url: "api/merchant_return_goods/query_By_Id",
        data: {
          id: this.$route.query.orderId,
          merchantId: JSON.parse(localStorage.user).merchantId
        }
      })
        .then(res => {
          console.log(res);
          //服务单信息
          this.tableData = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //订单状态
    returnStatus(status) {
      //0关闭1待付款2待发货3已发货 4已收货5已评价 6已完成 20删除
      switch (status) {
        case (1, 2):
          return "未处理";
          break;
        default:
          return "已处理";
      }
    },
    //提交
    agreeOrRejectReturn(status) {
      this.$axios({
        method: "post",
        url: "api/merchant_return_goods/update",
        data: {
          id: this.tableData.id,
          status: status,
          resolveRemark: this.resolveRemark
        }
      }).then(
        res => {
          this.$message({
            message: "提交成功",
            type: "success",
            showClose: true,
            duration: 2500
          });
          setTimeout(() => {
            this.$router.back();
          }, 3000);
        },
        err => {}
      );
    },
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/mixin.scss";

.refund-detail {
  .main-wrapper {
    //退货商品
    @include table();
    width: 900px;
    margin-left: auto;
    margin-right: auto;
    .product-list-wrapper {
      border-bottom: 1px solid rgba(191, 191, 191, 1);
    }
    //表2
    .table-wrapper {
      // margin-top: 40px;
      div.header {
        color: #595757;
        font-weight: 900;
        font-size: 20px;
        padding: 0 20px;
        margin-left: auto;
        margin-right: auto;
        height: 55px;
        line-height: 55px;
        background: rgb(239, 239, 239);
        border: 1px solid rgba(191, 191, 191, 1);
        border-bottom: none;
      }
      table {
        margin-bottom: 40px;
        margin-left: auto;
        margin-right: auto;
        width: 900px;
        // border: 1px solid rgba(191, 191, 191, 1);
        tr {
          height: 50px;
          font-size: 16px;
          line-height: 50px;
          color: #595757;
          td {
            padding: 0 20px;
            border: 1px solid rgba(191, 191, 191, 1);
            & > div.pic {
              display: inline-block;
            }
          }
          & > :first-child {
            width: 300px;
            text-align: center;
          }
        }
        tr.header {
          background: rgb(239, 239, 239);
        }
      }
    }
    .btn-group {
      display: flex;
      justify-content: center;
      & > button {
        margin: 0 20px;
        width: 150px;
      }
    }
  }
}
</style>
