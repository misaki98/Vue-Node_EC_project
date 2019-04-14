<template>
  <div>
    <!-- 登录页面弹窗组件 -->
    <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':loginModalFlag}">
      <div class="md-modal-inner">
        <div class="md-top">
          <slot name="title"></slot>
          <button class="md-close" @click="closeFlag">Close</button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <slot name="content"></slot>
          </div>
          <div class="login-wrap">
            <slot name="btn-group"></slot>
          </div>
        </div>

      </div>
    </div>
    <div class="md-overlay" v-if="loginModalFlag" @click="closeFlag"></div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
      }
    },
    props:[
      "loginModalFlag"
    ],
    methods:{
      closeFlag(){
        this.$emit('close')
      }
    }
  }
</script>

<style scoped>
  .login-wrap{
    display: flex;
    justify-content: center;
  }
</style>
