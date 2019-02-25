<template>
  <div class="recycle">
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
        <div class="search-bar">商品分类：
          <el-select v-model="typeId" clearable placeholder="请选择商品分类" @change="getTableData">
            <el-option
              v-for="item in productTypes"
              :key="item.typeName"
              :label="item.typeName"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="search-bar">选择品牌：
          <el-select v-model="brandId" clearable placeholder="请选择商品品牌" @change="getTableData">
            <el-option
              v-for="item in brandList"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
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
        <el-table-column prop="id" label="编号" width/>
        <el-table-column prop="goodsImg" label="商品图片" width>
          <template slot-scope="scope">
            <img :src="scope.row.goodsImg" alt>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" width/>
        <el-table-column prop="typeName" label="商品分类" width/>
        <el-table-column prop="goodsPrice" label="价格" width/>
        <el-table-column prop="goodsNo" label="货号" width/>
        <el-table-column label="操作" width>
          <template slot-scope="scope">
            <span @click="restore(scope.row.id)">还原</span>
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
  created() {
    this.getTableData();
    //分类数据
    this.$axios("api/merchantGoodsType/query_goods_type_tree")
      .then(res => {
        // console.log(res);
        this.productTypes = res.data.data;
      })
      .catch(err => {
        // console.log(err);
        this.msg(err, "error");
      });
    //品牌分类
    this.$axios("api/merchant_goods_brand/query_list")
      .then(res => {
        // console.log(res);
        this.brandList = res.data.data;
      })
      .catch(err => {
        this.msg(err, "error");
      });
    //批量操作选项
    this.batchOperation.push("还原");
  },
  methods: {
    //刷新页面，重新获取数据
    getTableData(page) {
      this.$axios({
        method: "post",
        url: "api/merchantGoods/merchant_goods_recycling",
        data: {
          currentPage: page || this.currentPage,
          pageSize: this.pageSize,
          goodsName: this.goodsName,
          typeId: this.typeId,
          brandId: this.brandId
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
    //还原(单个)
    restore(id) {
      this.$confirm("确定还原?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios({
          method: "post",
          url: "api/merchantGoods/merchant_goods_recycling_reduction",
          data: {
            id: id
          }
        })
          .then(res => {
            this.msg("还原成功");
            this.getTableData();
          })
          .catch(err => {
            this.msg(err, "error");
          });
      });
    },
    //还原(批量)
    bartchRestore(ids) {
      this.$confirm("确定还原?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios({
          method: "post",
          url: "api/merchantGoods/merchant_goods_batch_reduction",
          data: ids
        })
          .then(res => {
            this.msg("还原成功");
            this.getTableData();
          })
          .catch(err => {
            this.msg(err, "error");
          });
      });
    },
    // 删除(批量+单个)
    remove(id) {
      //id一定要为[]
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios({
          method: "post",
          url: "api/merchantGoods/delete_batch_recycling",
          data: id
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
          this.msg('请选择操作', 'error');
          break;
        case "删除":
          this.remove(arr);
          break;
        case "还原":
          this.bartchRestore(arr);
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/mixin.scss";

div.recycle {
  @include table();
}
</style>
