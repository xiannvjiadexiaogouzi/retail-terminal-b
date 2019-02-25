<template>
  <div class="operation-log">
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
        <div class="block">
          <span class="demonstration">操作时间：</span>
          <el-date-picker
            v-model="operationDate"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="handleDate"
            align="right"
            :picker-options="pickerOptions1"
          />
        </div>
      </div>
    </div>
    <!-- 表格 -->
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
        <el-table-column prop="id" label="编号" width/>
        <el-table-column prop="operator" label="操作者" width/>
        <el-table-column prop="operationDate" label="操作时间" width="200"/>
        <el-table-column prop="ip" label="IP地址" width/>
        <el-table-column prop="operationRecord" label="操作记录" width="200"/>
      </el-table>
      <!-- 表格批量操作+页码 -->
      <footer>
        <div class="select-all-wrapper"></div>
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

export default {
  mixins: [mixin],
  components: {
    Pagination
  },
  data() {
    return {
      operationDate: "",
      pickerOptions1: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      }
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    //更改日期搜索
    handleDate($date) {
      this.getTableData();
    },
    //刷新页面，重新获取数据
    getTableData(page) {
      this.$axios({
        method: "post",
        url: "api/user_operation_log/query_user_operation_log",
        data: {
          currentPage: page || this.currentPage,
          pageSize: this.pageSize,
          merchantId: JSON.parse(localStorage.user).merchantId,
          operationDate: this.operationDate
        }
      })
        .then(res => {
          // console.log(res);
          this.tableData = res.data.data.list;
          this.totalPage = res.data.data.totalPage;
          this.dataCount = res.data.data.totalCount;
        })
        .catch(err => {
          thie.msg(err, "error");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/mixin.scss";

div.operation-log {
  @include table();
}
</style>
