<template>
  <div>
    <nav-header></nav-header>

    <nav-bread>
      <span>Order Confirm</span>
    </nav-bread>

    <div class="container">
      <div class="checkout-order">
        <!-- process step -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>Confirm</span> address</li>
            <li class="cur"><span>View your</span> order</li>
            <li><span>Make</span> payment</li>
            <li><span>Order</span> confirmation</li>
          </ul>
        </div>

        <!-- order list -->
        <div class="page-title-normal checkout-title">
          <h2><span>Order content</span></h2>
        </div>
        <div class="item-list-wrap confirm-item-list-wrap">
          <div class="cart-item order-item">
            <div class="cart-item-head">
              <ul>
                <li>Order contents</li>
                <li>Price</li>
                <li>Quantity</li>
                <li>Subtotal</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for="item in cartList" :key="item.productId" v-if="item.checked">
                <div class="cart-tab-1">
                  <div class="cart-item-pic">
                    <img :src="/static/ + item.productImage" alt="XX">
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{item.productName}}</div>

                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{item.salePrice}}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self">
                      <div class="select-self-area">
                        <span class="select-ipt">×{{item.productNum}}</span>
                      </div>
                    </div>
                    <div class="item-stock item-stock-no">In Stock</div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{ item.productNum * item.salePrice }}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Price count -->
        <div class="price-count-wrap">
          <div class="price-count">
            <ul>
              <li>
                <span>Item subtotal:</span>
                <span>{{ subOrderTotal }}</span>
              </li>
              <li>
                <span>Shipping:</span>
                <span>{{ shipping }}</span>
              </li>
              <li>
                <span>Discount:</span>
                <span>{{ discount }}</span>
              </li>
              <li>
                <span>Tax:</span>
                <span>{{ tax }}</span>
              </li>
              <li class="order-total-price">
                <span>Order total:</span>
                <span>{{ subOrderTotal + shipping - discount + tax}}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="order-foot-wrap">
          <div class="prev-btn-wrap">
            <router-link class="btn btn--m" to="/address">Previous</router-link>
          </div>
          <div class="next-btn-wrap">
            <button class="btn btn--m btn--red" @click="payment">Proceed to payment</button>
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
        cartList:[],
        shipping:10,
        discount:200,
        tax:400
      }
    },
    mounted(){
      this.getAllGoods();
    },
    methods:{
      getAllGoods(){
        axios.get('/users/cartList').then(res=>{
          if (res.data.status === 0) {
            this.cartList = res.data.result;
          }
        })
      },
      payment(){
      //  生成订单
        axios.post("/users/payMent",{
          addressId:this.$route.query.addressId,
          orderTotal:this.subOrderTotal + this.shipping - this.discount + this.tax
        }).then(res=>{
          if (res.data.status === 0) {
            this.$router.push({
              path:'/orderSuccess?orderId=' + res.data.result.orderId
            })
          }
        })
      }
    },
    computed:{
      subOrderTotal(){
        let total = 0;
        this.cartList.forEach(item=>{
          if (item.checked) {
            total += item.productNum * item.salePrice;
          }
        });
        return total;
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
