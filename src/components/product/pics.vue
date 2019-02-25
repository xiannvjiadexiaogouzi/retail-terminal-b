<template>
  <div class="pics">
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
          <el-input v-model="name" placeholder="相册名称/关键词" clearable @change="getTableData(1)"/>
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
          <el-button @click="$router.push({name: 'add-pic',query: {picsId: 0}})">添加相册</el-button>
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
        <el-table-column prop="id" label="编号" width/>
        <el-table-column prop="name" label="相册名称" width/>
        <el-table-column prop="cover" label="封面" width>
        <template slot-scope="scope">
            <img :src="scope.row.cover" alt="cover" class="cover">
        </template>
        </el-table-column>
        <el-table-column prop="imgTotal" label="图片数量" width/>
        <el-table-column prop="sorting" label="排序" width/>
        <el-table-column prop="description" label="描述" width=""/>
        <el-table-column label="操作" width="">
          <template slot-scope="scope">
            <span @click="$router.push({name:'check-pics',query:{picsId:scope.row.id}})">查看</span>
            <span @click="$router.push({name:'add-pic',query:{picsId:scope.row.id}})">编辑</span>
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
  data(){
    return{
      name: '',
    }
  },
  created() {
    this.getTableData();
  },
  methods: {
    //刷新页面，重新获取数据
    getTableData(page) {
      this.$axios({
        method: "post",
        url: "api/merchant_goods_galleries/query_for_page",
        data: {
          currentPage: page || this.currentPage,
          pageSize: this.pageSize,
          name: this.name
        }
      })
        .then(res => {
          console.log(res);
          this.tableData = res.data.data.list;
          this.totalPage = res.data.data.totalPage;
          this.dataCount = res.data.data.totalCount;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //是否显示
    handleShowStatus($event, data) {
      let show = $event ? 1 : 0;
      this.$axios({
        method: "post",
        url: "api/merchant_goods_brand/update",
        data: {
          id: data.id,
          name: data.name,
          logo: data.logo,
          isShow: show
        }
      })
        .then(res => {
          //   console.log(res);
          this.$message({
            message: "提交成功",
            type: "success",
            showClose: true,
            duration: 2500
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 删除
    remove(ids) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios({
          method: "post",
          url: "api/merchant_goods_galleries/delete_batch",
          data: ids
        })
          .then(() => {
            this.msg("删除成功");
            this.getTableData();
          })
          .catch(err => {
            this.msg(err, "error");
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

div.pics {
  @include table();
}
</style>
