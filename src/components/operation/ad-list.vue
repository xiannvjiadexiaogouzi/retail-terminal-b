<template>
  <div class="ad-list">
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
          <el-button @click="$router.push('add-ad')">添加广告</el-button>
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
        <el-table-column prop="adName" label="广告名称" width/>
        <el-table-column prop="adPosition" label="广告位置" width>
          <template slot-scope="scope">{{scope.row.adPosition}}</template>
        </el-table-column>
        <el-table-column prop="goodsNum" label="广告图片">
          <template slot-scope="scope">
            <img :src="scope.row.adPicture" alt>
          </template>
        </el-table-column>
        <el-table-column prop="online" label="是否上线" width>
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.online"
              inactive-value="0"
              active-value="1"
              active-color="#5BC0BF"
              @change="handleShowStatus($event,scope.row)"
            />
            {{scope.row.online == 1 ? '上线' : '下线'}}
          </template>
        </el-table-column>
        <el-table-column prop="clickNumber" label="点击次数" width/>
        <el-table-column prop="name" label="操作" width="230">
          <template slot-scope="scope">
            <span @click="$router.push({name: 'add-ad',query:{adId:scope.row.id}})">编辑</span>
            <span @click="top(scope.row)">{{scope.row.topState == 0 ? '置顶' : '取消置顶'}}</span>
            <span class="warning" @click="remove(scope.row.id)">删除</span>
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
import mixin from "@/util/mixin.js";
import Pagination from "../common/pagination";

export default {
  mixins: [mixin],
  components: {
    Pagination
  },
  data() {
    return {};
  },
  created() {
    this.getTableData();
  },
  methods: {
    getTableData(page, id) {
      // 获取表格信息
      this.$axios({
        method: "post",
        url: "api/merchant_ad/get_merchant_ad_list",
        data: {
          currentPage: page || this.currentPage,
          pageSize: this.pageSize
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
    //新增
    addAd(id) {
      this.$router.push({
        name: "add-type",
        query: { parentId: id }
      });
    },
    //是否显示
    handleShowStatus($event, data) {
      // let show = $event ? 1 : 0;
      this.$axios({
        method: "post",
        url: "api/merchant_ad/change_merchant_ad",
        data: {
          id: data.id,
          online: $event
        }
      })
        .then(res => {
          this.msg("提交成功");
        })
        .catch(err => {
          this.msg(err, "error");
        });
    },
    //置顶
    top(data) {
      let top = data.topState == 0 ? 1 : 0;
      this.$axios({
        method: "post",
        url: "api/merchant_ad/change_merchant_ad",
        data: {
          id: data.id,
          topState: top
        }
      })
        .then(res => {
          this.msg("提交成功");
          this.getTableData();
        })
        .catch(err => {
          this.msg(err, "error");
        });
    },
    // 删除（单个）
    remove(ids) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios({
          method: "post",
          url: "api/merchant_ad/delete_merchant_ad",
          data: { remark: ids }
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
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/mixin.scss";

.ad-list {
  @include table();

  .el-dialog {
    p {
      height: 60px;
      &:first-child > span {
        margin-right: 14px;
      }
    }
    .el-select {
      margin-left: 20px;
    }
  }
}
</style>
