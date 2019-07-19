<template>
  <div class="product-list">
    <!-- filter栏 -->
    <!-- <div class="filter-group">
      <div class="search-filter" :class="status === -1 ?  'active' : ''" @click="handleStatus(-1)">
        <p>
          全部商品 (
          <span>{{tableData.length}}</span>
          )
        </p>
      </div>
      <div class="search-filter" :class="status === 1 ?  'active' : ''" @click="handleStatus(1)">
        <p>
          已上架 (
          <span>{{onSale}}</span>
          )
        </p>
      </div>
      <div class="search-filter" :class="status === 0 ?  'active' : ''" @click="handleStatus(0)">
        <p>
          未上架 (
          <span>{{unSale}}</span>
          )
        </p>
      </div>
    </div>-->
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
          <el-input v-model="goodsName" placeholder="商品名称" clearable @change="getTableData(1)"/>
        </div>
        <div class="search-bar">商品分类：
          <el-select v-model="typeId" clearable placeholder="请选择商品分类" @change="getTableData(1)">
            <el-option
              v-for="item in productTypes"
              :key="item.typeName"
              :label="item.typeName"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="search-bar">选择品牌：
          <el-select v-model="brandId" clearable placeholder="请选择商品品牌" @change="getTableData(1)">
            <el-option
              v-for="item in brandList"
              :key="item.id"
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
          <el-button @click="addProduct">添加商品</el-button>
        </div>
      </header>
      <!-- 表格本体 -->
      <el-table
        v-loading="loading"
        ref="productTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="56"/>
        <el-table-column prop="id" label="编号" width />
        <el-table-column prop="name" label="商品图片" width="130">
          <template slot-scope="scope">
            <img :src="transImg(scope.row.goodsImg)">
          </template>
        </el-table-column>
        <el-table-column prop="address" label="商品名称" width>
          <template slot-scope="scope">
            <p>{{scope.row.goodsName}}</p>
            <p>品牌：{{scope.row.brand.name}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="价格/货号" width="150">
          <template slot-scope="scope">
            <p>价格：¥{{recInt(scope.row.goodsPrice)}}</p>
            <p>货号：{{scope.row.goodsNo}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="上架" width>
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :inactive-value="false"
              :active-value="true"
              active-color="#5BC0BF"
              @change="handleShowStatus($event,scope.row)"
            />
          </template>
        </el-table-column>
        <!-- <el-table-column prop="name" label="排序" width="120"></el-table-column> -->
        <el-table-column prop="name" label="SKU库存" width>
          <template slot-scope="scope">
            <i class="edit" @click="editProduct(scope.row.id, scope.row.goodsNo)"/>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="销量" width>
          <template slot-scope="scope">{{scope.row.buyNum}}</template>
        </el-table-column>
        <el-table-column prop="name" label="状态" width>
          <template slot-scope="scope">{{statusTxt(scope.row.status)}}</template>
        </el-table-column>
        <el-table-column prop="name" label="操作" width>
          <template slot-scope="scope">
            <span @click="$router.push({name:'add-product',query:{id:scope.row.id}})">编辑</span>
            <span @click="remove([scope.row.id])">删除</span>
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

    <!-- 编辑商品信息 -->
    <el-dialog title="编辑货品信息" :visible.sync="dialogVisible" v-loading="loading">
      <div class="dialog-searchbar">
        <span>商品货号：{{editGoodsNo}}</span>
        <!-- <el-autocomplete
          popper-class="my-autocomplete"
          v-model="state3"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          @select="handleSelect"
        >
          <i class="el-icon-search el-input__icon" slot="suffix" @click="handleIconClick"></i>
          <template slot-scope="{ item }">
            <div class="name">{{ item.value }}</div>
            <span class="addr">{{ item.address }}</span>
          </template>
        </el-autocomplete>-->
      </div>

      <!-- 编辑商品信息 -->
      <div class="edit-product-table">
        <!-- <el-table :data="stockList"> -->
        <!-- :span-method="objectSpanMethod" -->
        <!-- <el-table-column prop="goodsName" label="商品" width></el-table-column> -->
        <!-- <el-table-column prop="skuCode" label="SKU编码"></el-table-column> -->
        <!-- <template v-for="item in editProductInfo.map"> -->
        <!-- <el-table-column
            v-for="(item,index) in stockList[0].nameValue"
            :key="index"
            :label="item.name"
            width
          >
            <template slot-scope="scope">{{item.value}}</template>
        </el-table-column>-->
        <!-- </template> -->
        <!-- <el-table-column prop="goodsSalePrice" label="销售价格" width>
            <template slot-scope="scope">
              <el-input v-model="scope.row.goodsSalePrice" type="number"/>
            </template>
          </el-table-column>
          <el-table-column prop="goodsStock" label="商品库存" width>
            <template slot-scope="scope">
              <el-input v-model="scope.row.goodsStock" type="number"/>
            </template>
          </el-table-column>
          <el-table-column prop="stockWarning" label="库存预警" width>
            <template slot-scope="scope">
              <el-input v-model="scope.row.stockWarning" type="number"/>
            </template>
          </el-table-column>
        </el-table>-->
        <table v-if="stockList.length">
          <thead>
            <td>商品</td>
            <!-- <td>SKU编码</td> -->
            <td v-for="(item,index) in stockList[0].nameValue" :key="index">{{item.name}}</td>
            <td>销售价格</td>
            <td>商品库存</td>
            <td>库存预警值</td>
          </thead>
          <tbody>
            <tr v-for="(item,index) in stockList" :key="index">
              <td>{{item.goodsName}}</td>
              <td v-for="(el,index) in item.nameValue" :key="index">{{el.value}}</td>
              <td>
                <el-input
                  v-model="item.goodsSalePrice"
                  size="mini"
                  type="number"
                  :max="99999"
                  :min="0"
                />
              </td>
              <td>
                <el-input
                  v-model="item.goodsStock"
                  size="mini"
                  type="number"
                  :max="99999"
                  :min="0"
                />
              </td>
              <td>
                <el-input
                  v-model="item.stockWarning"
                  size="mini"
                  type="number"
                  :max="99999"
                  :min="0"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateStock">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixin from "@/util/mixin.js";
// import Tag from "./product-list-tag";
import Pagination from "../common/pagination";

export default {
  mixins: [mixin], //vue 混入
  components: {
    // Tag,
    Pagination
  },
  data() {
    return {
      status: 0,
      dialogVisible: false,
      editGoodsNo: "",
      goodsId: "",
      stockList: []
    };
  },
  created() {
    this.getTableData(1);
    //分类数据
    this.$axios(this.$api.type_list)
      .then(res => {
        // console.log(res);
        this.productTypes = res.data;
      })
      .catch(err => {
        this.msg(err, "error");
      });
    //品牌数据
    this.$axios(this.$api.brand_list)
      .then(res => {
        this.brandList = res.data;
      })
      .catch(err => {
        this.msg(err, "error");
      });
  },
  computed: {},
  methods: {
    //获取图片url
    transImg(src) {
      console.log(src)
      if (src) {
        return this.adjustImg(src[0]);
      }
    },
    statusTxt(status) {
      return status == 1 ? "已上架" : "未上架";
    },
    //新增商品
    addProduct() {
      this.$router.push({ name: "add-product" });
    },
    //判断价格小数
    recInt(num) {
      return parseInt(num) == num ? num + ".00" : num;
    },
    handleStatus(status) {
      // console.log(status);
      if (status == -1) {
        this.status = "";
      } else {
        this.status = status;
      }
      this.getTableData();
    },
    //刷新页面，重新获取数据
    getTableData(page) {
      this.loading = true;
      this.$axios({
        method: "post",
        url: this.$api.product_list,
        data: {
          currentPage: page || this.currentPage,
          pageSize: this.pageSize,
          // status: this.status,
          goodsName: this.goodsName,
          typeId: this.typeId,
          brandId: this.brandId
        }
      })
        .then(res => {
          console.log(res);
          this.tableData = res.data.data;
          this.totalPage = res.data.totalPage;
          this.dataCount = res.data.totalCount;
          this.loading = false;
        })
        .catch(err => {
          this.msg(err, "error");
        });
    },
    //上架
    handleShowStatus($event, data) {
      if ($event) {
        //变化后的值
        this.$axios({
          method: "post",
          url: this.$api.product_put, //上架
          data: {
            id: data.id
          }
        })
          .then(() => {
            this.getTableData();
            this.msg('上架成功');
          })
          .catch(err => {
            this.msg(err, "error");
          });
      } else {
        this.$axios({
          method: "post",
          url: this.$api.product_pull, //下架
          data: {
            id: data.id
          }
        })
          .then(() => {
            this.getTableData();
            this.msg('下架成功');
          })
          .catch(err => {
            this.msg(err, "error");
          });
      }
    },

    //编辑商品信息
    editProduct(id, no) {
      // 弹出对话框
      this.dialogVisible = true;
      this.loading = true;
      this.editGoodsNo = no;
      this.goodsId = id;
      //获取商品信息
      this.$axios({
        method: "post",
        url: this.$api.product_detail,
        data: {
          id: id
        }
      })
        .then(res => {
          // console.log(res);
          this.adjust(res.data.data);
          this.loading = false;
        })
        .catch(err => {
          this.msg(err, "error");
        });
    },
    //重构编辑表格
    adjust(data) {
      this.stockList = [];
      this.stockList = data.merchantGoodsTypePropertyList;
      this.stockList.forEach(val => {
        val.goodsName = data.goodsName;
      });
    },
    //提交表单
    updateStock() {
      for (let i = 0, len = this.stockList.length; i < len; i++) {
        if (
          !this.stockList[i].goodsSalePrice ||
          !this.stockList[i].goodsStock ||
          !this.stockList[i].stockWarning
        ) {
          this.msg("请完整填写信息", "error");
          return;
        }
      }
      //剔除form中的goodsName
      delete this.stockList[0].goodsName;
      this.$axios({
        method: "post",
        url: "api/merchantGoods/merchant_goods_update_sku",
        data: {
          id: this.goodsId,
          merchantGoodsTypePropertyList: this.stockList
        }
      })
        .then(res => {
          this.msg("提交成功");
          this.dialogVisible = false;
          this.getTableData();
        })
        .catch(err => {
          this.msg(err, "error");
        });
    },
    //表格头列合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return {
          rowspan: 2,
          colspan: 1
        };
      } else {
        return {
          rowspan: 1,
          colspan: 1
        };
      }
    },
    // 删除（批量+单个）
    remove(ids) {
      //id一定要为[]
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios({
          method: "post",
          url: this.$api.product_delete,
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
        case "关闭":
          this.remove(arr);
          break;
      }
    }
  }
};
</script>


<style lang="scss" scoped>
@import "../../assets/scss/mixin.scss";

div.product-list {
  @include table();

  //dialog
  .el-dialog {
    .edit-product-table {
      border: none;
    }
    table {
      border: 1px solid rgba(191, 191, 191, 1);
      width: 100%;
      text-align: center;
      // border-bottom: transparent 1px solid;
      thead {
        background: rgba(239, 239, 239, 1);
        td {
          padding: 0 20px;
        }
      }
      td {
        padding: 0 5px;
        height: 50px;
        line-height: 50px;
        border: 1px solid rgba(191, 191, 191, 1);
      }
    }
  }
}
</style>
