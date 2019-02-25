<template>
  <div class="types">
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
          <el-button @click="$router.push({name: 'add-type',query: {parentId: 0}})">添加分类</el-button>
          <el-button @click="gobackTable" v-if="isSecond">返回</el-button>
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
        <el-table-column label="编号" prop="id" width/>
        <el-table-column prop="typeName" label="分类名称" width/>
        <el-table-column prop="parentId" label="级别" width>
          <template slot-scope="scope">{{scope.row.parentId ? '二级' : '一级'}}</template>
        </el-table-column>
        <el-table-column prop="goodsNum" label="商品数量"/>
        <el-table-column prop="goodsUnit" label="数量单位" width/>
        <el-table-column prop="showStatus" label="是否显示" width>
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.showStatus"
              :inactive-value="1"
              :active-value="0"
              active-color="#5BC0BF"
              @change="handleShowStatus($event,scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="goodsSort" label="排序" width/>
        <el-table-column prop="name" label="设置" width>
          <template slot-scope="scope">
            <span @click="transType(scope.row)">转移商品</span>
            <span
              v-if="!isSecond"
              @click="$router.push({name: 'add-type',query: {parentId: scope.row.id}})"
            >新增下级</span>
            <span v-if="!isSecond" @click="toSecond(scope.row.id)">查看下级</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作" width>
          <template slot-scope="scope">
            <span @click="$router.push({name: 'add-type',query: {id: scope.row.id}})">编辑</span>
            <span class="warning" @click="remove(scope.row.id)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格批量操作+页码 -->
      <footer>
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
    <!-- 转移商品 -->
    <el-dialog title="转移商品" :visible.sync="dialogVisible" width="30%">
      <p class>
        <span>原商品分类</span>
        <el-select v-model="oldType[0]" disabled>
          <el-option
            v-for="item in oldType"
            :key="item.typeName"
            :label="item.typeName"
            :value="item.id"
          />
        </el-select>
      </p>
      <p>
        <span>目标商品分类</span>
        <el-select v-model="newTypeId" placeholder="请选择目标分类">
          <el-option
            v-for="item in typeList"
            :key="item.typeName"
            :label="item.typeName"
            :value="item.id"
          />
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitTrans">确 定</el-button>
      </span>
    </el-dialog>
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
      isSecond: false,
      dialogVisible: false,
      //转移商品
      oldType: [],
      originalId: "",
      typeList: [],
      newTypeId: ""
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    getTableData(page, id) {
      //获取typeList
      this.$axios("api/merchantGoodsType/merchant_goods_type_list")
        .then(res => {
          //console.log(res);
          this.typeList = res.data.data;
          //   //   处理数据,分成parentlist和childrenlist
          //   this.tableData = this.list.filter((item)=>{
          //       return item.parentId === 0;
          //   })
        })
        .catch(err => {
          console.log(err);
        });
      // 获取表格信息
      this.$axios({
        method: "post",
        url: "api/merchantGoodsType/merchant_goods_type_list_page",
        data: {
          parentId: id || 0,
          currentPage: page || this.currentPage,
          pageSize: this.pageSize
        }
      })
        .then(res => {
          //console.log(res);
          this.tableData = res.data.data.list;
          this.totalPage = res.data.data.totalPage;
          this.dataCount = res.data.data.totalCount;
        })
        .catch(err => {
          console.log(err);
        });
    },
    toSecond(id) {
      this.isSecond = true;
      this.getTableData(1, id);
    },
    //新增下级
    addType(id) {
      this.$router.push({
        name: "add-type",
        query: { parentId: id }
      });
    },
    //返回
    gobackTable() {
      this.getTableData(1);
      this.isSecond = false;
    },
    //是否显示
    handleShowStatus($event, data) {
      let show = $event ? 1 : 0;
      this.$axios({
        method: "post",
        url: "api/merchantGoodsType/merchant_goods_type_update",
        data: {
          id: data.id,
          showStatus: show
        }
      })
        .then(res => {
          //console.log(res);
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
    //转移商品
    transType(data) {
      this.dialogVisible = true;
      this.oldType = [];
      this.oldType.push(data);
    },
    submitTrans() {
      this.$axios({
        method: "post",
        url: "api/merchantGoodsType/merchant_goods_type_transfer",
        data: {
          originalId: this.oldType[0].id,
          lastId: this.newTypeId
        }
      })
        .then(res => {
          //console.log(res);
          this.msg();
        })
        .catch(err => {
          // console.log(err);
          this.msg(err, "error");
        });
      this.dialogVisible = false;
      this.isSecond = false;
      this.getTableData();
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
          url: "api/merchantGoodsType/merchant_goods_type_delete",
          data: {
            id: id
          }
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

.types {
  @include table();
  
  footer {
    justify-content: flex-end !important;
  }

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
