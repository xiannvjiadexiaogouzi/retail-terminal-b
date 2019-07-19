<template>
  <div class="rating">
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
        <div class="search-bar">输入搜索：
          <el-input v-model="goodsName" placeholder="商品名称/关键词" clearable @change="getTableData(1)"/>
        </div>
        <div class="search-bar">用户昵称：
          <el-input v-model="userName" placeholder="用户昵称/关键词" clearable @change="getTableData(1)"/>
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
          <!-- <el-select v-model="nowSort" clearable placeholder="排序方式">
            <el-option v-for="item in sort" :key="item" :label="item" :value="item"/>
          </el-select>-->
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
        <el-table-column type="selection" width="56"/>
        <el-table-column label="编号" width>
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column prop="name" label="用户昵称" width>
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>
        <el-table-column prop="address" label="商品名称" width>
          <template slot-scope="scope">
            <p>{{scope.row.goodsName}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="commentLevel" label="评价" width="150">
          <template slot-scope="scope">
            <el-rate v-model="scope.row.commentLevel" disabled></el-rate>
          </template>
        </el-table-column>
        <el-table-column prop="commentIp" label="IP地址" width>
          <template slot-scope="scope">{{scope.row.commentIp}}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="评论时间" width>
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column prop="status" label="是否显示" width>
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="true"
              :inactive-value="false"
              active-color="#5BC0BF"
              @change="handleStatus(scope.row.id, $event)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作" width>
          <template slot-scope="scope">
            <span @click="showRatingDetail(scope.row.id)">查看</span>
            <span class="warning" @click="remove([scope.row.id])">删除</span>
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

export default {
  mixins: [mixin],
  components: {
    Pagination
  },
  data() {
    return {
      // userName: ""
    };
  },
  created() {
    //评论数据
    this.getTableData(1);
  },
  methods: {
    //刷新页面，重新获取数据
    getTableData(page) {
      this.$axios({
        method: "post",
        url: this.$api.comment,
        data: {
          currentPage: page || this.currentPage,
          pageSize: this.pageSize,
          goodsName: this.goodsName,
          userName: this.userName
        }
      })
        .then(res => {
          // console.log(res);
          this.tableData = res.data.data;
          this.totalPage = res.data.totalPage;
          this.dataCount = res.data.totalCount;
        })
        .catch(err => {
          this.msg(err, "error");
        });
    },
    //是否显示评论
    handleStatus(id, $event) {
      this.$axios({
        method: "post",
        url: this.$api.comment_show,
        data: {
          id: id,
          status: $event
        }
      })
        .then(res => {
          this.msg();
        })
        .catch(err => {
          this.msg(err, "error");
        });
    },
    showRatingDetail(id) {
      this.$router.push({
        name: "rating-detail",
        params: {
          userId: id
        }
      });
    },
    // 删除(批量+单个)
    remove(ids) {
      //id一定要为[]
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios({
          method: "post",
          url: this.$api.comment_delete,
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
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/mixin.scss";

div.rating {
  @include table();
}
</style>
