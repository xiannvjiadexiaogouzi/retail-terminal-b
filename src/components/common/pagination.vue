<template>
  <div class="page">
    <div class="page-info">
      共
      <span class="red-font">{{totalPage}}&nbsp;</span>页
      /
      <span class="red-font">{{dataCount}}&nbsp;</span>条数据
    </div>

    <el-pagination
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      layout="prev, pager, next, jumper"
      :total="dataCount"
    />
  </div>
</template>

<script>
export default {
  props: {
    totalPage: {
      type: Number,
      required: true
    },
    dataCount: {
      type: Number,
      required: true
    },
    pageSize: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    }
  },
  data() {
    return {};
  },
  methods: {
    handleCurrentChange(page) {
      // console.log(page);
      this.$emit("pageChange", page);
    }
  }
};
</script>

<style lang="scss">
div.page {
  display: flex;
  height: 100%;
  font-size: 16px;
  color: rgba(159, 160, 160, 1);
  line-height: 30px;

  .page-info {
    margin-right: 20px;
    .red-font {
      color: #d23029;
    }
  }

  //   .pages {
  //     display: flex;
  //     margin-right: 22px;
  //     & > li {
  //       width: 42px;
  //       height: 32px;
  //       background: rgba(255, 255, 255, 1);
  //       border: 1px solid rgba(210, 210, 210, 1);
  //       border-radius: 4px;
  //       font-size: 16px;
  //       color: rgba(159, 160, 160, 1);
  //       line-height: 16px;
  //       text-align: center;
  //       margin-right: 5px;
  //       padding: 8px 0;
  //       &:last-child {
  //         margin: 0;
  //       }
  //     }
  //   }
  //   .page-skip {
  //     display: flex;
  //     & > input {
  //       display: inline-block;
  //       width: 42px;
  //       height: 32px;
  //       background: rgba(255, 255, 255, 1);
  //       border: 1px solid rgba(210, 210, 210, 1);
  //       border-radius: 4px;
  //       text-align: center;
  //       margin: 0 7px;
  //     }
  //   }
}
</style>
