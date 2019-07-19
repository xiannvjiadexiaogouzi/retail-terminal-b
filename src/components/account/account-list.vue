<template>
  <div class="account-list">
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
        <div class="search-bar">用户昵称：
          <el-input
            v-model="realName"
            clearable
            placeholder="商品名称 / 商品货号"
            @change="getTableData()"
          />
        </div>
        <div class="search-bar">用户手机：
          <el-input
            v-model="mobilePhone"
            clearable
            placeholder="商品名称 / 商品货号"
            @change="getTableData()"
          />
        </div>
        <div class="search-bar">注册时间：
          <el-date-picker
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleDate"
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
        <el-table-column prop="id" label="用户ID" width/>
        <el-table-column prop="user.mobilePhone" label="手机号" width/>
        <el-table-column prop="user.realName" label="用户昵称" width/>
        <el-table-column prop="user.createTime" label="创建时间" width/>
        <el-table-column prop="user.userStatus" label="是否启用" width="160">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.user.userStatus"
              :inactive-value="false"
              :active-value="true"
              active-color="#5BC0BF"
              @change="handleShowStatus($event,scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <span @click="$router.push({name:'account-detail',query:{userId:scope.row.id}})">查看</span>
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
</template>

<script>
import Qs from "qs";
import mixin from "@/util/mixin.js";
import Pagination from "../common/pagination";

export default {
  mixins: [mixin],
  components: {
    Pagination
  },
  data() {
    return {
      date: "",
      realName: "",
      mobilePhone: "",
      beginTime: "",
      endTime: ""
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    //更改日期搜索
    handleDate($date) {
      if ($date) {
        this.beginTime = $date[0];
        this.endTime = $date[1];
      } else {
        this.beginTime = "";
        this.endTime = "";
      }
      this.getTableData();
    },
    //刷新页面，重新获取数据
    getTableData(page) {
      this.$axios({
        method: "post",
        url: this.$api.user,
        // type: "form",
        data: {
          currentPage: page || this.currentPage,
          pageSize: this.pageSize,
          mobilePhone: this.mobilePhone,
          realName: this.realName,
          beginTime: this.beginTime,
          endTime: this.endTime
        },
        // //使用qs模块转化data为form格式提交
        // transformRequest: [
        //   function(data) {
        //     data = Qs.stringify(data);
        //     return data;
        //   }
        // ],
        // // 修改header为formdata格式
        // headers: {
        //   "Content-Type": "application/x-www-form-urlencoded"
        // }
      })
        .then(res => {
          console.log(res);
          this.tableData = res.data.data;
          this.totalPage = res.data.totalPage;
          this.dataCount = res.data.totalCount;
        })
        .catch(err => {
          this.msg(err, "error");
        });
    },
    //是否显示
    handleShowStatus($event, data) {
      this.$axios({
        method: "post",
        url: this.$api.user_status,
        data: {
          userId: data.id,
          userStatus: $event
        },
        // type: "form",
        // //使用qs模块转化data为form格式提交
        // transformRequest: [
        //   function(data) {
        //     data = Qs.stringify(data);
        //     return data;
        //   }
        // ],
        // // 修改header为formdata格式
        // headers: {
        //   "Content-Type": "application/x-www-form-urlencoded"
        // }
      })
        .then(res => {
          //   console.log(res);
          this.msg("提交成功");
        })
        .catch(err => {
          this.msg(err, "error");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/mixin.scss";

div.account-list {
  @include table();
  .search-box .search-bottom .search-bar {
    margin-right: 5px;
  }
}
</style>
