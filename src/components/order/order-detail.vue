<template>
  <div class="order-detail">
    <!-- 覆盖title -->
    <div class="view-title">
      <i class="view-title-before"/>
      <span class="title">订单详情</span>
      <div class="refresh-btn">
        <el-button icon="el-icon-close" @click="$router.go(-1)">关闭</el-button>
      </div>
    </div>
    <!-- 表单本体 -->
    <div class="main-wrapper">
      <el-steps :active="tableData[0].status" finish-status="success" align-center>
        <el-step title="提交订单" :description="tableData[0].creatTime"/>
        <el-step title="支付订单" :description="tableData[0].payTime"/>
        <el-step title="平台发货" :description="tableData[0].sendTime"/>
        <el-step title="确认收货" :description="tableData[0].sendEndTime"/>
        <el-step title="完成评价" :description="tableData[0].finishTime"/>
      </el-steps>
      <div class="product-list-wrapper no-bottom">
        <header class="table-header">
          <div class="table-header-left">
            <span>
              <span class="el-icon-warning"/>
              当前订单状态：{{statusTxt}}
            </span>
          </div>
          <div class="table-header-right">
            <el-button @click="showDialog(1)">修改收货人信息</el-button>
            <el-button @click="showDialog(0)">备注订单</el-button>
            <el-button v-if="tableData[0].status == 1">关闭订单</el-button>
          </div>
        </header>
      </div>

      <!-- 基本信息 -->
      <div class="product-list-wrapper">
        <!-- 表头按钮 -->
        <header class="table-header">
          <div class="table-header-left">基本信息</div>
        </header>
        <!-- 表格本体 -->
        <el-table
          ref="productTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="id" label="订单ID" width/>
          <el-table-column prop="code" label="订单编号" width/>
          <el-table-column prop="mobilePhone" label="用户账户" width>
            <template slot-scope="">{{$route.query.mobilePhone}}</template>
          </el-table-column>
          <el-table-column prop="payType" label="支付方式" width>
            <template slot-scope="">微信小程序</template>
          </el-table-column>
          <el-table-column prop="payType" label="订单来源" width>
            <template slot-scope="">微信小程序</template>
          </el-table-column>
          <el-table-column prop="type" label="订单类型" width>
            <template slot-scope="scope">{{scope.row.type == 1 ? '普通订单' : '秒杀订单'}}</template>
          </el-table-column>
          <el-table-column prop="sendCompany" label="配送方式" width/>
          <el-table-column prop="sendCode" label="物流单号" width/>
          <el-table-column prop="sendEndTime" label="自动确认收货时间" width/>
        </el-table>
      </div>
      <!-- 收货人信息 -->
      <div class="product-list-wrapper">
        <!-- 表头按钮 -->
        <header class="table-header">
          <div class="table-header-left">收货人信息</div>
        </header>
        <!-- 表格本体 -->
        <el-table
          ref="productTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="receiver" label="收货人" width/>
          <el-table-column prop="phone" label="手机号码" width/>
          <el-table-column prop label="邮政编码" width/>
          <el-table-column prop="address" label="收货地址" width/>
        </el-table>
      </div>
      <!-- 商品信息 -->
      <div class="product-list-wrapper">
        <!-- 表头按钮 -->
        <header class="table-header">
          <div class="table-header-left">商品信息</div>
        </header>
        <!-- 表格本体 -->
        <el-table
          ref="productTable"
          :data="tableData[0].details"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="GoodsPic" label="商品图片" width>
            <template slot-scope="scope">
              <img :src="scope.row.goodsPic" alt>
            </template>
          </el-table-column>
          <el-table-column prop="goodsName" label="商品名称" width/>
          <el-table-column prop="goodsNo" label="货号" width/>
          <el-table-column prop="goodsPrice" label="价格" width/>
          <el-table-column prop="goodsDesc" label="属性" width/>
          <el-table-column prop="buyNum" label="数量" width/>
          <el-table-column prop="goodsBrand" label="品牌" width/>
          <el-table-column prop="totalMoney" label="总金额" width/>
        </el-table>
      </div>
      <!-- 费用信息 -->
      <div class="product-list-wrapper">
        <!-- 表头按钮 -->
        <header class="table-header">
          <div class="table-header-left">费用信息</div>
        </header>
        <!-- 表格本体 -->
        <el-table
          ref="productTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="totalMoeny" label="商品合计" width/>
          <el-table-column prop="code" label="运费" width>
            <template slot-scope="">包邮</template>
          </el-table-column>
          <el-table-column prop="totalMoeny" label="订单总金额" width/>
          <el-table-column prop="totalMoeny" label="应付款金额" width/>
        </el-table>
      </div>
    </div>
    <!-- 修改收货人信息 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        v-if="dialogStatus == 1"
      >
        <!-- 修改收货人信息 -->
        <el-form-item label="收货人姓名" prop="receiver">
          <el-input v-model="ruleForm.receiver" placeholder="请输入收件人"/>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="ruleForm.phone" placeholder="请输入手机号码"/>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="ruleForm.address" placeholder="请输入详细地址"/>
        </el-form-item>
      </el-form>
      <!-- 备注订单 -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        v-if="dialogStatus == 0"
      >
        <el-form-item label="操作备注" prop="merchantRemark">
          <el-input v-model="ruleForm.mechantRemark" type="textarea"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRuleForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
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
      dialogVisible: false,
      dialogStatus: 1,
      ruleForm: {
        id: "",
        receiver: "",
        phone: "",
        address: ""
      },
      rules: {
        receiver: [
          { required: true, message: "请输入收件人", trigger: "blur" }
        ],
        phone: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getTableData();
  },
  computed: {
    statusTxt() {
      //0关闭1待付款2待发货3已发货 4已收货5已评价 6已完成 20删除
      switch (this.tableData[0].status) {
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
    dialogTitle() {
      return this.dialogStatus ? "修改收货人信息" : "备注订单";
    }
  },
  methods: {
    //获取data
    getTableData() {
      this.$axios({
        method: "post",
        url: "api/merchant_order/query_By_Id",
        data: {
          id: this.$route.query.orderId,
          merchantId: JSON.parse(localStorage.user).merchantId
        }
      })
        .then(res => {
          console.log(res);
          this.tableData.push(res.data.data);
          this.ruleForm.id = res.data.data.id;
          this.ruleForm.receiver = res.data.data.receiver;
          this.ruleForm.phone = res.data.data.phone;
          this.ruleForm.address = res.data.data.address;
        })
        .catch(err => {
          this.msg(err, "error");
        });
    },
    //打开编辑
    showDialog(i) {
      this.dialogVisible = true;
      this.dialogStatus = i;
    },
    //提交表单
    submitRuleForm(formName) {
      this.$refs[formName].validate(valid => {
        //先检验表单
        if (valid) {
          this.submitForm("api/merchant_order/updateOrder", this.ruleForm);
          this.msg("提交成功");
          setTimeout(() => {
            this.$router.back();
          }, 50);
        } else {
          this.msg("error submit!!", "error");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/mixin.scss";

.order-detail {
  // position: absolute;
  // width: 1380px;
  // top: 90px;
  // left: 400px;
  // //覆盖title
  // .view-title {
  //   display: flex;
  //   height: 60px;
  //   background: rgba(239, 239, 239, 1);
  //   border-bottom: 1px solid rgb(229, 229, 229);
  //   .view-title-before {
  //     display: inline-block;
  //     margin: 16px 0;
  //     width: 14px;
  //     height: 28px;
  //     margin-right: 30px;
  //     background: rgba(91, 192, 191, 1);
  //   }
  //   .refresh-btn {
  //     position: absolute;
  //     top: 9.5px;
  //     right: 45px;
  //     margin: auto;
  //     width: 88px;
  //     height: 40px;
  //     background: rgba(247, 248, 248, 1);
  //     border: 1px solid rgba(184, 184, 184, 1);
  //     border-radius: 6px;
  //     padding: 0 17px;
  //     & > span {
  //       margin-left: 4px;
  //       // margin-right: 14px;
  //       line-height: 38px;
  //       font-size: 16px;
  //       font-weight: 400;
  //       color: rgba(137, 137, 137, 1);
  //     }
  //   }
  // }
  @include title();

  //表单
  .main-wrapper {
    padding: 37px 45px 0 45px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    @include table();

    .table-header {
      margin-top: 40px;
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
      border-bottom: 1px solid rgba(184, 184, 184, 1);
    }
    .no-bottom {
      border-bottom: none;
    }
  }
}
</style>
