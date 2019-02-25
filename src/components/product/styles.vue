<template>
  <div class="styles">
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
          <el-button @click="editStyle()">添加类型</el-button>
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
        <el-table-column label="编号" width>
          <template prop="id" slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column prop="styleName" label="类型名称" width></el-table-column>
        <el-table-column prop="propertyNum" label="属性数量" width></el-table-column>
        <el-table-column prop="paramNum" label="参数数量"></el-table-column>
        <el-table-column label="设置" width>
          <template slot-scope="scope">
            <span @click="showProperty(scope.row.id)">属性列表</span>
            <span @click="showParam(scope.row.id)">参数列表</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width>
          <template slot-scope="scope">
            <span @click="editStyle(scope.row)">编辑</span>
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
    <!-- 编辑 -->
    <el-dialog title="编辑类型" :visible.sync="dialogVisible" width="30%">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="100px"
        :rules="rules"
        class="demo-ruleForm"
      >
        <el-form-item label="类型名称" prop="styleName">
          <el-input v-model="ruleForm.styleName"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRuleForm">确 定</el-button>
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
      tableData: [],
      dialogVisible: false,
      ruleForm: {
        styleName: ""
      },
      rules: {
        styleName: [
          { required: true, message: "请输入类型名称", trigger: "blur" },
          { max: 20, message: "长度必须小于20个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    //刷新页面，重新获取数据
    getTableData(page) {
      this.$axios({
        method: "post",
        url: "api//merchantGoodsStyle/merchant_goods_style_list_page",
        data: {
          currentPage: page || this.currentPage,
          pageSize: this.pageSize
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
    editStyle(row) {
      this.isAdd = row ? false : true;
      this.ruleForm = {};
      this.dialogVisible = true;
      if (!this.isAdd) {
        this.ruleForm.id = row.id;
        this.ruleForm.styleName = row.styleName;
      }
    },
    //提交表单
    submitRuleForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.isAdd) {
            //判断是否新增
            this.submitForm(
              "api/merchantGoodsStyle/merchant_goods_type_add",
              this.ruleForm
            );
          } else {
            this.submitForm(
              "api/merchantGoodsStyle/merchant_goods_type_update",
              this.ruleForm
            );
          }
          this.msg();
          this.dialogVisible = false;
          this.getTableData();
        }
      });
    },
    //删除类型
    remove(id) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios({
          method: "post",
          url: "api/merchantGoodsStyle/merchant_goods_type_delete",
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
    //打开属性列表
    showProperty(id) {
      this.$router.push({
        name: "property",
        params: {
          styleId: id
        }
      });
    },
    //打开参数列表
    showParam(id) {
      this.$router.push({
        name: "param",
        params: {
          styleId: id
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/mixin.scss";

div.styles {
  @include table();

  footer {
    justify-content: flex-end !important;
  }
}
</style>
