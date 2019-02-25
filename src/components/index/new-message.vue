<template>
  <div class="new-message">
    <ul>
      <div class="msg-title">订单提示</div>
      <li>
        <span>待付款订单</span>
        <span>
          （
          <span class="red">10</span> ）
        </span>
      </li>
      <li>
        <span>待付款订单</span>
        <span>
          （
          <span class="red">10</span> ）
        </span>
      </li>
      <li>
        <span>待付款订单</span>
        <span>
          （
          <span class="red">10</span> ）
        </span>
      </li>
      <li>
        <span>待付款订单</span>
        <span>
          （
          <span class="red">10</span> ）
        </span>
      </li>
    </ul>
    <ul>
      <div class="msg-title">订单提示</div>
      <li>
        <span>待付款订单</span>
        <span>
          （
          <span class="red">10</span> ）
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.new-message {
  width: 416px;
  // height: 420px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 6px 10px 0px rgba(4, 0, 0, 0.2);
  border-radius: 0px 0px 6px 6px;
  padding: 0 18px;
  & > ul {
    padding: 25px 20px 20px 20px;
    border-bottom: 1px solid rgba(210,210,210,1);
    &:last-child{
      border: none;
    }
    .msg-title {
      font-size: 18px;
      font-weight: bold;
      color: rgba(89, 87, 87, 1);
      margin-bottom: 20px;
    }
    & > li {
      display: flex;
      justify-content: space-between;
      height: 48px;
      font-size: 16px;
      color: rgba(114, 113, 113, 1);
      line-height: 48px;
      &>span{
        display: inline-block;
        .red{
          color: #D23029;
        }
      }
    }
  }
}
</style>
