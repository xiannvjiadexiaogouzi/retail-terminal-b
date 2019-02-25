<template>
  <div class="return">
    <!-- filter栏 -->
    <div class="filter-group">
      <div class="search-filter" :class="status === '' ?  'active' : ''" @click="handleStatus(-1)">
        <p>
          全部处理 (
          <span>{{orderCount.all}}</span>
          )
        </p>
      </div>
      <div class="search-filter" :class="status === 1 ?  'active' : ''" @click="handleStatus(1)">
        <p>
          待处理 (
          <span>{{orderCount.dcl}}</span>
          )
        </p>
      </div>
      <div class="search-filter" :class="status === 2 ?  'active' : ''" @click="handleStatus(2)">
        <p>
          退货中 (
          <span>{{orderCount.thz}}</span>
          )
        </p>
      </div>
      <div class="search-filter" :class="status === 6 ?  'active' : ''" @click="handleStatus(6)">
        <p>
          已完成 (
          <span>{{orderCount.ywc}}</span>
          )
        </p>
      </div>
      <div class="search-filter" :class="status === 3 ?  'active' : ''" @click="handleStatus(3)">
        <p>
          已拒绝 (
          <span>{{orderCount.yjj}}</span>
          )
        </p>
      </div>
    </div>

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
        <div class="search-bar">收货人：
          <el-input v-model="receiver" placeholder="收货人姓名" clearable @change="getTableData(1)"/>
        </div>
        <div class="search-bar">申请时间：
          <el-date-picker
            v-model="date"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd hh:mm:ss"
            @change="getTableData()"
          />
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <div class="product-list-wrapper">
      <!-- 表头按钮 -->
      <header class="table-header">
        <div class="table-header-left">数据列表</div>
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
        <el-table-column prop="creatTime" label="申请时间" width="120"/>
        <el-table-column prop="mobilePhone" label="用户账户" width/>
        <el-table-column prop="applicationReturnMoney" label="订单金额" width/>
        <el-table-column prop="status" label="申请状态" width>
          <template slot-scope="scope">{{returnStatus(scope.row.status)}}</template>
        </el-table-column>
        <el-table-column label="订单操作" width>
          <template slot-scope="scope">
            <span @click="$router.push({name:'return-detail',query:{orderId:scope.row.id}})">查看详情</span>
            <span v-if="scope.row.status==0">删除订单</span>
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
      statusList: [-1, 1, 2, 3, 6],
      searchcode: null,
      receiver: null,
      date: "",
      orderCount: {
        all: "",
        dcl: "",
        thz: "",
        ywc: "",
        yjj: ""
      },
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
  computed: {},
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
    //刷新页面，重新获取数据
    getTableData(page) {
      //获取status数量
      let promiseAll = this.statusList.map(val =>
        this.$axios({
          method: "post",
          url: "api/merchant_return_goods/getCountByStatus",
          data: {
            merchantId: JSON.parse(localStorage.user).merchantId,
            status: val === -1 ? "" : val
          }
        })
      );
      let that = this;
      this.$axios.all(promiseAll).then(function(resArr) {
        //   console.log(resArr)
        resArr.forEach(function(res, i) {
          let statusName = "";
          switch (i) {
            case 0:
              statusName = "all";
              break;
            case 1:
              statusName = "dcl";
              break;
            case 2:
              statusName = "thz";
              break;
            case 3:
              statusName = "yjj";
              break;
            case 4:
              statusName = "ywc";
              break;
          }
          that.orderCount[statusName] = res.data.data;
        });
      });
      //表格数据
      this.$axios({
        method: "post",
        url: "api/merchant_return_goods/query_for_page",
        data: {
          currentPage: page || this.currentPage,
          pageSize: this.pageSize,
          merchantId: JSON.parse(localStorage.user).merchantId,
          contact: this.receiver,
          code: this.searchcode,
          status: this.status,
          creatTime: this.date
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
          url: "api/merchant_return_goods/delete",
          data: { ids: ids }
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

div.return {
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
