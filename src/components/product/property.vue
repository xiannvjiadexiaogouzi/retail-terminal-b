<template>
  <div class="property">
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
          <el-button @click="$router.push({name:'add-property'})">新增属性</el-button>
          <el-button @click="$router.push({name:'styles'})">返回</el-button>
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
        <el-table-column prop="propertyName" label="属性名称" width/>
        <el-table-column prop="styleName" label="商品类型" width/>
        <el-table-column prop="propertySelect" label="属性是否可选">
          <template slot-scope="scope">{{scope.row.paramSelect == 2 ? '多选参数' : '单选参数'}}</template>
        </el-table-column>
        <el-table-column prop="propertyList" label="可选值列表" width/>
        <el-table-column prop="propertyOrder" label="排序" width/>
        <el-table-column prop="name" label="操作" width>
          <template slot-scope="scope">
            <span @click="addProperty(scope.row.id)">编辑</span>
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
    return {};
  },
  created() {
    this.getTableData(1);
  },
  methods: {
    //刷新页面，重新获取数据
    getTableData(page) {
      this.$axios({
        method: "post",
        url: "api/merchantGoodsProperty/merchant_goods_property_list_page",
        data: {
          styleId: this.$route.params.styleId
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
    //打开编辑
    addProperty(id) {
      this.$router.push({
        name: "add-property",
        query: {
          propertyId: id
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
          url: "api/merchantGoodsProperty/delete_batch",
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
    batchOperate(){
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
      }
    }
  }
};
</script>


<style lang="scss" scoped>
@import "../../assets/scss/mixin.scss";

.property {
  @include table();
}
</style>
