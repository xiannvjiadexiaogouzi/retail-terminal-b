<template>
  <div class="return-detail">
    <div class="main-wrapper">
      <!-- 表格 -->
      <div class="product-list-wrapper">
        <!-- 表头按钮 -->
        <header class="table-header">
          <div class="table-header-left">退货商品</div>
        </header>
        <!-- 表格本体 -->
        <el-table ref="productTable" :data="table1" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="goodsPic" label="商品图片" width>
            <template slot-scope="scope">
              <img :src="adjustImg(scope.row.goodsImg[0])" alt>
            </template>
          </el-table-column>
          <el-table-column prop="goodsName" label="商品名称" width/>
          <el-table-column prop="goodsPrice" label="价格/货号" width/>
          <el-table-column prop="brandName" label="品牌" width/>
          <el-table-column prop label="数量" width>
            <template>{{tableData.buyNum}}</template>
          </el-table-column>
          <el-table-column prop="totalMoney" label="小计" width>
            <template>{{tableData.returnMoney}}</template>
          </el-table-column>
        </el-table>
      </div>

      <div class="table-wrapper">
        <div class="header">服务单信息</div>
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
            <td>{{tableData.createTime}}</td>
          </tr>
          <tr>
            <td>用户账号</td>
            <td>{{tableData.mobilePhone}}</td>
          </tr>
          <tr>
            <td>联系人</td>
            <td>{{tableData.contact}}</td>
          </tr>
          <tr>
            <td>联系电话</td>
            <td>{{tableData.phone}}</td>
          </tr>
          <tr>
            <td>退货原因</td>
            <td>{{tableData.returnReason}}</td>
          </tr>
          <tr>
            <td>问题描述</td>
            <td>{{tableData.problemDescription}}</td>
          </tr>
          <tr>
            <td>凭证照片</td>
            <td>
              <div class="pic" v-for="img in problemPics" :key="img">
                <img :src="img" alt>
              </div>
            </td>
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
              <el-input
                v-if="tableData.status== 1"
                v-model="returnMoney"
                type="number"
                step="0.01"
                min="0"
              />
              <span v-if="tableData.status !== 1">{{tableData.returnMoney}}</span>
            </td>
          </tr>
          <tr v-if="tableData.status== 1">
            <td>选择收货点</td>
            <td>
              <el-select v-model="selectId" @change="getSelectIdData" placeholder="请选择收货点">
                <el-option
                  v-for="item in returnSiteList"
                  :key="item.id"
                  :label="item.returnPname"
                  :value="item.id"
                ></el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td>收货人姓名</td>
            <td>{{tableData.returnName || selectSite.returnName}}</td>
          </tr>
          <tr>
            <td>详细地址</td>
            <td>{{tableData.returnAddress || selectSite.returnAddress}}</td>
          </tr>
          <tr>
            <td>联系电话</td>
            <td>{{tableData.returnPhone || selectSite.returnPhone}}</td>
          </tr>
        </table>
        <table>
          <tr>
            <td>处理备注</td>
            <td>
              <el-input v-model="resolveRemark" v-if="tableData.status == 1"/>
              <span v-if="tableData.status !== 1">{{tableData.resolveRemark}}</span>
            </td>
          </tr>
        </table>
      </div>
      <div class="btn-group">
        <el-button v-if="tableData.status== 1" @click="agreeOrRejectReturn(2)">确定退货</el-button>
        <el-button type="danger" v-if="tableData.status== 1" @click="agreeOrRejectReturn(3)">拒绝退货</el-button>
        <el-button v-if="tableData.status !== 1" @click="$router.go(-1)">返回</el-button>
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
      table1: [],
      returnMoney: "",
      returnSiteList: [],
      selectId: "",
      selectSite: "",
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
        url: this.$api.return_detail,
        data: {
          code: this.$route.query.code
          // merchantId: JSON.parse(localStorage.user).merchantId
        }
      })
        .then(res => {
          console.log(res);
          //服务单信息
          this.tableData = res.data;
          //退货商品
          this.table1.push(res.data.goods);
        })
        .catch(err => {
          // console.log(err);
          this.msg(err, "error");
        });
      //收货点选择列表
      this.$axios({
        method: "post",
        url: this.$api.return_site,
        data: {
          currentPage: this.currentPage,
          pageSize: this.pageSize
          // merchantId: JSON.parse(localStorage.user).merchantId
        }
      })
        .then(res => {
          // console.log(res);
          this.returnSiteList = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //订单状态
    returnStatus(status) {
      //0关闭1待付款2待发货3已发货 4已收货5已评价 6已完成 20删除
      switch (status) {
        case 1:
          return "待处理";
          break;
        case 2:
          return "同意退货";
          break;
        case 3:
          return "拒绝退货";
          break;
        case 4:
          return "收到货确认退款";
          break;
        case 5:
          return "收到货拒绝退款";
          break;
        default:
          return "已完成";
      }
    },
    //获取收货地点选中后的信息
    getSelectIdData() {
      this.$axios({
        method: "post",
        url: this.$api.return_site_detail,
        data: {
          id: this.selectId
        }
      })
        .then(res => {
          // console.log(res);
          this.selectSite = res.data.data;
        })
        .catch(err => {
          // console.log(err);
          this.msg(err, 'error')
        });
    },
    agreeOrRejectReturn(status) {
      this.$axios({
        method: "post",
        url: this.$api.return_update,
        data: {
          code: this.tableData.code,
          status: status,
          returnSendId: this.selectId,
          returnMoney: this.returnMoney,
          resolveRemark: this.resolveRemark
        }
      }).then(
        res => {
          this.msg();
          setTimeout(() => {
            this.$router.push({ name: "return" });
          }, 2500);
        },
        err => {}
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/mixin.scss";

.return-detail {
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
      margin-top: 40px;
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
