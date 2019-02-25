<template>
  <div class="account-detail">
    <!-- 覆盖title -->
    <div class="view-title">
      <i class="view-title-before"/>
      <span class="title">用户信息</span>
      <div class="refresh-btn">
        <el-button icon="el-icon-close" @click="$router.go(-1)">关闭</el-button>
      </div>
    </div>
    <!-- 表单本体 -->
    <div class="main-wrapper">
      <!-- 用户头像+基本信息 -->
      <div class="avatar product-list-wrapper">
        <div class="table-left">
          <img src="https://img.xinzhibang168.com/FmR88ILyONmakl5P1khxHlEt3qxc.jpg" alt>
        </div>
        <div class="table-right">
          <table>
            <tr>
              <td>用户ID</td>
              <td>{{user.id}}</td>
              <td>职业</td>
              <td></td>
            </tr>
            <tr>
              <td>昵称</td>
              <td>{{user.realName}}</td>
              <td>个性签名</td>
              <td></td>
            </tr>
            <tr>
              <td>性别</td>
              <td>{{user.sex}}</td>
              <td>喜欢的分类</td>
              <td></td>
            </tr>
            <tr>
              <td>生日</td>
              <td>{{user.birthday}}</td>
              <td>注册时间</td>
              <td>{{user.createTime}}</td>
            </tr>
            <tr>
              <td>城市</td>
              <td>{{user.remark5}}</td>
              <td>用户来源</td>
              <td>小程序</td>
            </tr>
          </table>
        </div>
      </div>
      <!-- 统计信息 -->
      <div class="product-list-wrapper">
        <!-- 表头按钮 -->
        <header class="table-header">
          <div class="table-header-left">统计信息</div>
        </header>
        <!-- 表格本体 -->
        <el-table ref="productTable" :data="userData" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="consumption" label="消费金额" width/>
          <el-table-column prop="order_count" label="订单数量" width="150"/>
          <el-table-column prop="collection" label="收藏商品" width/>
          <el-table-column prop="evaluation" label="商品评价" width/>
          <el-table-column prop="return_record" label="退货记录" width/>
          <el-table-column prop="login_count" label="登录次数" width/>
        </el-table>
      </div>
      <!-- 收货地址 -->
      <div class="product-list-wrapper">
        <!-- 表头按钮 -->
        <header class="table-header">
          <div class="table-header-left">收货地址</div>
        </header>
        <!-- 表格本体 -->
        <el-table ref="productTable" :data="address" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="userName" label="姓名" width/>
          <el-table-column prop="phone" label="手机号码" width/>
          <el-table-column prop="address" label="收货地址" width/>
          <el-table-column prop="postalCode" label="邮政编码" width/>
          <el-table-column prop="defaultState" label="默认地址" width="150">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.defaultState"
                :inactive-value="0"
                :active-value="1"
                active-color="#5BC0BF"
                disabled
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 订单记录 -->
      <div class="product-list-wrapper">
        <!-- 表头按钮 -->
        <header class="table-header">
          <div class="table-header-left">用户列表</div>
          <div class="table-header-right">
            <label class="label">显示数据:</label>
            <el-select
              v-model="pageSize"
              clearable
              placeholder="显示条数"
              class="margin-26"
              @change="handlePageSize"
            >
              <el-option v-for="i in 10" :key="i" :label="i" :value="i"/>
            </el-select>
          </div>
        </header>
        <!-- 表格本体 -->
        <el-table
          ref="productTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="id" label="订单编号" width/>
          <el-table-column prop="creatTime" label="提交时间" width="200"/>
          <el-table-column prop="userId" label="用户账户" width/>
          <el-table-column prop="totalMoeny" label="订单金额" width/>
          <el-table-column prop="payType" label="支付方式" width>
            <template slot-scope="scope">{{payTypeTxt(scope.row.payType)}}</template>
          </el-table-column>
          <el-table-column prop="payType" label="订单来源" width>
            <template slot-scope="scope">{{payTypeTxt(scope.row.payType)}}</template>
          </el-table-column>
          <el-table-column prop="status" label="订单状态" width>
            <template slot-scope="scope">{{orderStatus(scope.row.status)}}</template>
          </el-table-column>
          <el-table-column label="订单操作" width>
            <template slot-scope="scope">
              <span
                @click="$router.push({name:'order-detail',query:{orderId:scope.row.id,mobilePhone:scope.row.mobilePhone}})"
              >查看订单</span>
              <span v-if="scope.row.status==2">订单发货</span>
              <span v-if="scope.row.status==0">删除订单</span>
              <span
                v-if="scope.row.status==5||scope.row.status==6"
                @click="deliveryInfo(scope.row.id)"
              >追踪订单</span>
              <span v-if="scope.row.status==1">关闭订单</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 表格批量操作+页码 -->
        <footer>
          <div class="select-all-wrapper"/>
          <div class="pagination-wrapper">
            <pagination
              :totalPage="totalPage"
              :dataCount="dataCount"
              :pageSize="pageSize"
              :currentPage="currentPage"
              @pageChange="pageChange"
            />
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@/util/mixin.js";
import Pagination from "../common/pagination";

export default {
  mixins: [mixin], //vue 混入
  components: {
    Pagination
  },
  data() {
    return {
      userData: [],
      user: {},
      address: [],
      orderData: [],
      deliveryData: {}
    };
  },
  created() {
    this.getUserData();
    this.getTableData();
  },
  computed: {},
  methods: {
    //获取用户信息(前3张表)
    getUserData() {
      this.$axios({
        method: "post",
        url: "api/user_detail/query/" + this.$route.query.userId
      })
        .then(res => {
          console.log(res);
          this.userData.push(res.data.data);
          this.user = res.data.data.user;
          this.address = res.data.data.addressList;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取订单记录(后1张表)
    getTableData() {
      this.$axios({
        method: "post",
        url: "api/merchant_order/query_for_page",
        data: {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          userId: this.$route.query.userId,
          merchantId: JSON.parse(localStorage.user).merchantId
        }
      })
        .then(res => {
          //   console.log(res);
          this.tableData = res.data.data.list;
          this.totalPage = res.data.data.totalPage;
          this.dataCount = res.data.data.totalCount;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //支付方式
    payTypeTxt(type) {
      return "微信小程序";
    },
    //订单状态
    orderStatus(status) {
      //0关闭1待付款2待发货3已发货 4已收货5已评价 6已完成 20删除
      switch (status) {
        case 0:
          return "已关闭";
          break;
        case 1:
          return "代付款";
          break;
        case 2:
          return "代发货";
          break;
        case 3:
          return "已发货";
          break;
        case 4:
          return "已收货";
          break;
        case 5:
          return "已完成";
          break;
        case 6:
          return "已完成";
          break;
        case 20:
          return "已删除";
          break;
      }
    },
    //追踪订单
    deliveryInfo(id) {
      console.log(id);
      this.dialogVisible = true;
      this.$axios({
        method: "post",
        url: "api/merchant_order/query_By_Id",
        data: {
          id: id,
          merchantId: JSON.parse(localStorage.user).merchantId
        }
      })
        .then(res => {
          console.log(res);
          this.deliveryData = res.data.data;
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

.account-detail {
  @include title();
  //表单
  .main-wrapper {
    padding: 0 45px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    @include table();

    .table-header {
      .table-header-left {
        line-height: 35px;
        & > span {
          margin: 0;
          font-size: 16px;
          color: #d23029;
        }
      }
      .table-header-right {
        .add-btn:first-child {
          width: 130px !important;
        }
      }
    }
    .product-list-wrapper {
      margin-top: 40px;
      border-bottom: 1px solid rgba(184, 184, 184, 1);
    }
    .no-bottom {
      border-bottom: none;
    }
    .avatar {
      display: flex;
      border: 1px solid rgba(184, 184, 184, 1);
      .table-left {
        width: 20%;
        display: flex;
        justify-content: center;
        align-items: center;
        & img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
        }
      }
      .table-right {
        width: 80%;
        & table {
          width: 100%;
          & tr {
            height: 50px;
            border-bottom: 1px solid rgba(184, 184, 184, 1);
            &:last-child {
              border: none;
            }
            & td {
              line-height: 50px;
              padding: 0 15px;
              font-size: 16px;
              color: rgba(89, 87, 87, 1);
              border-left: 1px solid rgba(184, 184, 184, 1);
              &:nth-child(odd) {
                background: #efefef;
                text-align: center;
                width: 20%;
              }
              &:nth-child(even) {
                width: 30%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
