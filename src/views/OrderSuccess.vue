<template>
  <div>
    <nav-header></nav-header>
    <div class="container">
      <div class="page-title-normal">
        <h2 class="page-title-h2"><span>check out</span></h2>
      </div>
      <!-- 进度条 -->
      <div class="check-step">
        <ul>
          <li class="cur"><span>Confirm</span> address</li>
          <li class="cur"><span>View your</span> order</li>
          <li class="cur"><span>Make</span> payment</li>
          <li class="cur"><span>Order</span> confirmation</li>
        </ul>
      </div>

      <div class="order-create">
        <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
        <div class="order-create-main">
          <h3>Congratulations! <br>Your order is under processing!</h3>
          <p>
            <span>Order ID：{{ $route.query.orderId }}</span>
            <span>Order total：{{ orderTotal }}</span>
          </p>
          <div class="order-create-btn-wrap">
            <div class="btn-l-wrap">
              <router-link class="btn btn--m" to="/cart">Cart List</router-link>
            </div>
            <div class="btn-r-wrap">
              <router-link class="btn btn--m" to="/">Goods List</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
  import NavHeader from '../components/Header.vue'
  import NavFooter from '../components/NavFooter.vue'
  import NavBread from '../components/NavBread.vue'

  import Model from '../components/Model.vue'

  import axios from 'axios';

  export default {
    data() {
      return {
        orderTotal: 0
      }
    },
    mounted() {
      this.getOrder();
    },
    methods: {
      getOrder() {
        axios.get('/users/orderDetail', {
          params: {orderId: this.$route.query.orderId}
        }).then(res => {
          if (res.data.status === 0) {
            this.orderTotal = res.data.result.orderTotal
          }
        })
      }
    },
    components: {
      NavBread,
      NavHeader,
      NavFooter,
      Model
    }
  }
</script>
