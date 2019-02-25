<template>
  <div class="tag">
    <!-- 传参上架 -->
    <el-switch v-model="value1" active-color="#5BC0BF" active-text="上架"/>
    <el-switch v-model="value2" active-color="#5BC0BF" active-text="新品"/>
    <el-switch v-model="value3" active-color="#5BC0BF" active-text="推荐"/>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: Number,
      required: true
    },
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      value1: Boolean,
      value2: true,
      value3: true
    };
  },
  created(){
    this.value1 = this.status == 1 ? true : false;
  },
  computed: {
    value() {
      return this.status === 1 ? true : false;
    }
  },
  watch: {
    value1: function() {
      if (this.value1) {
        //变化后的值
        this.$axios({
          method: "post",
          url: "api/merchantGoods/merchant_goods_put",
          data: {
            id: this.id
          }
        })
          .then(() => {
            this.$emit("getTableData");
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$axios({
          method: "post",
          url: "api/merchantGoods/merchant_goods_pull",
          data: {
            id: this.id
          }
        })
          .then(() => {
            this.$emit("getTableData");
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
  }
};
</script>

<style lang="scss" scoped>
div.tag {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 20px;

  .el-switch {
    margin: 6.5px 0;
  }
}
</style>
