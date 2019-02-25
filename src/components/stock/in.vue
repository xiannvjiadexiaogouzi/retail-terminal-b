<template>
  <div class="in">
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
          <el-input v-model="name" clearable placeholder="商品名称 / 商品货号" @change="getTableData()"/>
        </div>
        <div class="search-bar">操作类型：
          <el-select v-model="typeId" clearable placeholder="请选择操作类型" @change="getTableData()">
            <el-option
              v-for="item in productTypes"
              :key="item.name"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </div>
        <div class="search-bar">操作时间：
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
        <el-table-column prop="id" label="编号" width="60"/>
        <el-table-column prop="goodsImg" label="商品图片" width>
          <template slot-scope="scope">
            <img :src="handleImg(scope.row.goodsImg)" alt>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" width>
          <template slot-scope="scope">
            <p>{{scope.row.goodsName}}</p>
            <p>品牌：{{scope.row.brandName}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="goodsNo" label="货号/属性" width>
          <template slot-scope="scope">
            <p>{{scope.row.goodsNo}}/{{scope.row.property}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="orderCode" label="订单号" width/>
        <el-table-column prop="stock" label="库存" width>
          <template slot-scope="scope">
            <p>数量: {{ scope.row.changeNumber }}</p>
            <p>剩余: {{ scope.row.changeAfter }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="operateTypeName" label="操作类型" width/>
        <el-table-column prop="createTime" label="操作信息" width="180"/>
      </el-table>
      <!-- 表格批量操作+页码 -->
      <footer>
        <div class="select-all-wrapper"></div>
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
  mixins: [mixin], //vue 混入
  components: {
    Pagination
  },
  data() {
    return {
      stockTypeList: "",
      date: "",
      name:'',
      beginTime: "",
      endTime: ""
    };
  },
  created() {
    this.getTableData(1);
    //出入库库类型数据
    this.getStockType(1); //1入库 0 出库
  },
  computed: {},
  methods: {
    // 获取入库类型
    getStockType(type) {
      this.$axios({
        method: "post",
        url: "api/merchant_goods_log/query_type",
        type: "form",
        data: { type: type },
        //使用qs模块转化data为form格式提交
        transformRequest: [
          function(data) {
            data = Qs.stringify(data);
            return data;
          }
        ],
        // 修改header为formdata格式
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
        .then(res => {
          // console.log(res);
          this.productTypes = res.data.data;
        })
        .catch(err => {
          this.msg(err, "error");
        });
    },
    //刷新页面，重新获取数据
    getTableData(page) {
      this.$axios({
        method: "post",
        url: "api/merchant_goods_log/query_for_page",
        data: {
          currentPage: page || this.currentPage,
          pageSize: this.pageSize,
          search: this.name,
          operateType: this.typeId,
          beginTime: this.beginTime,
          endTime: this.endTime,
          orderCode: "",
          type: 1 //1入库 0 出库
        }
      })
        .then(res => {
          // console.log(res);
          this.tableData = res.data.data.list;
          this.totalPage = res.data.data.totalPage;
          this.dataCount = res.data.data.totalCount;
        })
        .catch(err => {
          this.mag(err, "error");
        });
    },
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
    }
  }
};
</script>


<style lang="scss" scoped>
@import "../../assets/scss/mixin.scss";

div.in {
  @include table();
  .search-box .search-bottom .search-bar {
    margin-right: 5px;
  }
  .el-table {
    table p {
      text-align: center;
    }
  }
}
</style>
