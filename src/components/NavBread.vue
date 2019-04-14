<template>
  <div class="nav-breadcrumb-wrap">
    <div class="container">
      <nav class="nav-breadcrumb">
        <a href="/">Home</a>
        <!-- 为别的模板页面提供插槽内容 -->
        <slot></slot>
      </nav>
    </div>
  </div>
</template>

<script>
    export default {
        name: "NacBread"
    }
</script>

<style scoped>

</style>
