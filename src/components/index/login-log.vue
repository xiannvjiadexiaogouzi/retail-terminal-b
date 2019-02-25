<template>
  <div class="login-log">
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
        <el-table-column prop="operateTime" label="时间" width/>
        <el-table-column prop="ip" label="IP" width/>
        <el-table-column prop="region" label="地区" width>
          <template slot-scope="scope">{{region(scope.row.description)}}</template>
        </el-table-column>
        <el-table-column prop="pack" label="浏览器" width/>
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
//使用axios中的qs模块转化request
import Qs from "qs";
import mixins from "@/util/mixin.js";
import Pagination from "../common/pagination.vue";

export default {
  mixins: [mixins],
  components: {
    Pagination
  },
  data() {
    return {
      // tableData: [],
      // pageSize: 13,
      // totalPage: Number,
      // dataCount: Number
    };
  },
  created() {
    this.getTableData(1);
  },
  methods: {
    getTableData(page) {
      this.$axios({
        method: "post",
        url: "api/merchant/get_merchant_login_info_list",
        data: {
          currentPage: page || this.currentPage,
          pageSize: this.pageSize,
          orderBy: "operate_time desc"
        },
        // type: "form",
        //使用qs模块转化data为form格式提交
        transformRequest: [
          function(data) {
            data = Qs.stringify(data);
            return data;
          }
        ],
        // 修改header为formdata格式
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
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
    region(data) {
      let re = {};
      if (data.length > 2) {
        re = JSON.parse(data).data;
        return re.country + " - " + re.region + " - " + re.city;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/mixin.scss";

.login-log {
  @include table();

}
</style>
