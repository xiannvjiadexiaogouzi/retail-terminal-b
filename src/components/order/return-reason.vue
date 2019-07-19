<template>
  <div class="return-reason">
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
          <el-button @click="editReason(0)">添加原因</el-button>
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
        <el-table-column prop="reasonType" label="原因类型" width/>
        <el-table-column prop="sorts" label="排序" width/>
        <el-table-column prop="isUse" label="是否启用" width>
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isUse"
              :inactive-value="false"
              :active-value="true"
              active-color="#5BC0BF"
              @change="handleShowStatus($event,scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="添加时间"/>
        <el-table-column prop="oeration" label="操作" width>
          <template slot-scope="scope">
            <span @click="editReason(scope.row)">编辑</span>
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

    <!-- 编辑原因 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="原因类型" prop="reasonType">
          <el-input v-model="ruleForm.reasonType" placeholder="请输入原因类型"/>
        </el-form-item>
        <el-form-item label="排序" prop="sorts">
          <el-input v-model="ruleForm.sorts" placeholder="请输入排序" type="number"/>
        </el-form-item>
        <el-form-item label="是否启用" prop="isUse">
          <el-switch
            v-model="ruleForm.isUse"
            :inactive-value="false"
            :active-value="true"
            active-color="#5BC0BF"
          />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRuleForm(ruleForm)">确 定</el-button>
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
      isAdd: false,
      dialogVisible: false,
      //编辑原因
      ruleForm: {
        isUse: 1,
        reasonType: "",
        sorts: ""
      },
      rules: {
        reasonType: [
          { required: true, message: "请输入原因类型", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getTableData();
  },
  computed: {
    title() {
      return this.isAdd ? "添加原因" : "修改原因";
    }
  },
  methods: {
    getTableData(page, id) {
      // 获取表格信息
      this.$axios({
        method: "post",
        url: this.$api.reason,
        data: {
          currentPage: page || this.currentPage,
          pageSize: this.pageSize,
          // merchantId: JSON.parse(localStorage.user).merchantId
        }
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
    //是否启用
    handleShowStatus($event, data) {
      this.$axios({
        method: "post",
        url: this.$api.reason_add,
        data: {
          id: data.id,
          isUse: $event,
          // merchantId: JSON.parse(localStorage.user).merchantId
        }
      })
        .then(res => {
          //console.log(res);
          this.msg("提交成功");
        })
        .catch(err => {
          this.msg(err, "error");
        });
    },
    //编辑原因
    editReason(data) {
      this.dialogVisible = true;
      this.isAdd = data ? false : true;
      this.ruleForm = data ? data : this.ruleForm;
    },
    submitRuleForm(formName) {
      if (this.isAdd) {
        this.submitForm(this.$api.reason_add, this.ruleForm, {
          // merchantId: JSON.parse(localStorage.user).merchantId
        });
        this.msg();
        setTimeout(() => {
          this.dialogVisible = false;
          this.getTableData();
        }, 50);
      } else {
        this.submitForm(this.$api.reason_add, this.ruleForm);
        this.msg();
        setTimeout(() => {
          this.dialogVisible = false;
          this.getTableData();
        }, 50);
      }
    },
    //删除
    remove(ids) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios({
          method: "post",
          url: this.$api.reason_delete,
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
    //批量操作
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

.return-reason {
  @include table();

  .el-dialog {
    p {
      display: flex;
      height: 60px;
      &:first-child > span {
        margin-right: 14px;
      }
      input {
        width: 100px;
      }
    }
    .el-select {
      margin-left: 20px;
    }
  }
}
</style>
