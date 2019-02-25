<template>
  <div class="receipt">
    <!-- 搜索栏 -->
    <div class="search-box">
      <div class="search-top">
        <div class="search-box-left">
          <span>
            <i class="el-icon-search"/>筛选查询
          </span>
        </div>
        <div class="search-box-right">
          <span @click="searchShow">
            <i :class="showSearch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"/>
            {{showSeachTxt}}
          </span>
          <el-button @change="getTableData(1)">查询结果</el-button>
        </div>
      </div>
      <div class="search-bottom" v-if="showSearch">
        <div class="search-bar">订单编号：
          <el-input v-model="searchcode" placeholder="订单编号" clearable @change="getTableData(1)"/>
        </div>
        <div class="search-bar">用户账户：
          <el-input v-model="receiver" placeholder="用户账户/关键词" clearable @change="getTableData(1)"/>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <div class="product-list-wrapper">
      <!-- 表头按钮 -->
      <header class="table-header">
        <div class="table-header-left">订单列表</div>
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
          <el-button @click="exportExcel">导出列表</el-button>
        </div>
      </header>
      <!-- 表格本体 -->
      <el-table
        id="out-table"
        ref="productTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="56"/>
        <el-table-column prop="code" label="订单编号" width/>
        <el-table-column prop="creatTime" label="提交时间" width="120"/>
        <el-table-column prop="mobilePhone" label="用户账户" width/>
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
        <div class="select-all-wrapper">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >全选</el-checkbox>
          <el-select v-model="nowBatchOperation" clearable placeholder="批量操作" class="margin">
            <el-option v-for="item in batchOperation" :key="item" :value="item" :label="item"/>
          </el-select>
          <el-button @click="batchOperate">确定</el-button>
        </div>
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
</template>

<script>
import mixin from "@/util/mixin.js";
import Pagination from "../common/pagination";
import FileSaver from "file-saver";
import XLSX from "xlsx";

export default {
  mixins: [mixin], //vue 混入
  components: {
    Pagination
  },
  data() {
    return {
      status: "",
      orderCount: {},
      deliveryData: {},
      dialogVisible: false,
      editGoodsNo: "",
      editProductInfo: ""
    };
  },
  created() {
    this.getTableData(1);
    //分类数据
    this.$axios("api/merchantGoodsType/query_goods_type_tree")
      .then(res => {
        // console.log(res);
        this.productTypes = res.data.data;
      })
      .catch(err => {
        this.msg(err, "error");
      });
  },
  computed: {
    showSeachTxt() {
      return this.showSearch ? "收起筛选" : "展开筛选";
    },
    onSale() {
      return this.tableData.filter(val => {
        return val.status == 1;
      }).length;
    },
    unSale() {
      return this.tableData.filter(val => {
        return val.status == 0;
      }).length;
    }
  },
  methods: {
    handleStatus(status) {
      switch (status) {
        case -1:
          this.status = "";
          break;
        case 0:
          this.status = 0;
          break;
        default:
          this.status = status;
          break;
      }
      //   this.status = status === 0 ? 0 : status;
      this.getTableData();
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
    //刷新页面，重新获取数据
    getTableData(page) {
      this.$axios({
        method: "post",
        url: "api/merchant_order/query_for_page",
        data: {
          currentPage: page || this.currentPage,
          pageSize: this.pageSize,
          merchantId: JSON.parse(localStorage.user).merchantId,
          phone: this.receiver,
          code: this.searchcode,
          status: 3
        }
      })
        .then(res => {
          // console.log(res);
          this.tableData = res.data.data.list;
          this.totalPage = res.data.data.totalPage;
          this.dataCount = res.data.data.totalCount;
        })
        .catch(err => {
          this.msg(err, "error");
        });
    },
    //追踪订单
    deliveryInfo(id) {
      // console.log(id);
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
          // console.log(res);
          this.deliveryData = res.data.data;
        })
        .catch(err => {
          this.msg(err, "error");
        });
    },
    // 删除（批量+单个）
    remove(ids) {
      //id一定要为[]
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios({
          method: "post",
          url: "api/merchantGoods/delete_batch",
          data: ids
        })
          .then(() => {
            this.msg("删除成功");
            this.getTableData();
          })
          .catch(err => {
            // console.log(err);
            this.msg(err, "error");
            this.getTableData();
          });
      });
    },
    //批量操作
    batchOperate() {
      let arr = [];
      this.tableSelection.forEach(item => {
        arr.push(item.id);
      });
      switch (this.nowBatchOperation) {
        case "":
          this.msg("请选择操作", "error");
          break;
        case "删除":
          this.remove(arr);
          break;
        case "关闭":
          this.remove(arr);
          break;
      }
    },
    //导出数据
    exportExcel() {
      let time = new Date().getTime();
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          time + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    }
  }
};
</script>


<style lang="scss" scoped>
@import "../../assets/scss/mixin.scss";

div.receipt {
  @include table();

  //dialog
  .el-dialog {
    p {
      font-size: 16px;
      color: rgba(89, 87, 87, 1);
      line-height: 48px;
    }
  }
}
</style>
