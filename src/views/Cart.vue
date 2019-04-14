<template>
  <div>
    <!--头部组件-->
    <nav-header></nav-header>

    <nav-bread>
      <span>My Cart</span>
    </nav-bread>
    <!--购物车主体结构-->
    <div class="container">
      <div class="cart">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>My Cart</span></h2>
        </div>
        <div class="item-list-wrap">
          <div class="cart-item">
            <!--列表标题-->
            <div class="cart-item-head">
              <ul>
                <li>Items</li>
                <li>Price</li>
                <li>Quantity</li>
                <li>Subtotal</li>
                <li>Edit</li>
              </ul>
            </div>
            <!--列表内容-->
            <ul class="cart-item-list">
              <li v-for="item in cartList" :key="item.productId">
                <div class="cart-tab-1">
                  <div class="cart-item-check">
                    <a class="checkbox-btn item-check-btn" :class="{'check':item.checked===true}"
                       @click="editCart('check', item)">
                    </a>
                  </div>
                  <div class="cart-item-pic">
                    <img :src="/static/ + item.productImage" :alt="item.productName">
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{ item.productName }}</div>
                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{ item.salePrice }}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self select-self-open">
                      <div class="select-self-area">
                        <a class="input-sub" :disabled="minus" @click="editCart('minu',item)">-</a>
                        <span class="select-ipt">{{ item.productNum }}</span>
                        <a class="input-add" @click="editCart('add',item)">+</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{ item.productNum * item.salePrice }}</div>
                </div>
                <div class="cart-tab-5">
                  <div class="cart-item-opration">
                    <a href="#" @click.prevent="delCartConfirm(item.productId,item.productNum)" class="item-edit-btn">
                      <span class="icon-bin"></span>
                    </a>
                  </div>
                </div>
              </li>
            </ul>

          </div>
        </div>
        <div class="cart-foot-wrap">
          <div class="cart-foot-inner">
            <div class="cart-foot-l">
              <div class="item-all-check">
                <a @click="checkAll">
                  <span class="checkbox-btn item-check-btn" :class="{'check': checkAllFlag}">
                  </span>
                  <span>Select all</span>
                </a>
              </div>
            </div>
            <div class="cart-foot-r">
              <div class="item-total">
                Item total: <span class="total-price">{{totalPrice}}</span>
              </div>
              <div class="btn-wrap">
                <button class="btn btn--red"
                        :class="{'btn--dis':checkoutDis}"
                        :disabled="checkoutDis"
                        @click="checkout">Checkout</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Model :loginModalFlag="modalFlag" @close="closeModal">
      <p slot="content">获取购物车数据失败：未登录</p>
      <button slot="btn-group" class="btn btn--m" @click="closeModal">关闭</button>
    </Model>
    <Model :loginModalFlag="modalFlag1" @close="closeModal">
      <p slot="content">你确认要删除此条数据吗？</p>
      <div slot="btn-group">
        <button class="btn btn--m" @click="delCart">确认</button>
        <button class="btn btn--m" @click="closeModal">关闭</button>
      </div>
    </Model>
    <!--底部组件-->
    <nav-footer></nav-footer>

  </div>
</template>

<script>
  import '../assets/css/checkout.css'
  import '../assets/icomoon/style.css'

  import NavHeader from '../components/Header.vue'
  import NavFooter from '../components/NavFooter.vue'
  import NavBread from '../components/NavBread.vue'

  import Model from '../components/Model.vue'

  import axios from 'axios';

  export default {
    data() {
      return {
        cartList: [],
        modalFlag: false,
        modalFlag1: false,
        currentId: 0,
        minus: false,
        count:0
      }
    },
    mounted() {
      this.getCartList();
    },
    methods: {
      getCartList() {
        axios.get('/users/cartList')
          .then(res => {
            if (res.data.status === 0) {
              this.cartList = res.data.result
            } else {
              this.modalFlag = true;
            }
          })
      },
      closeModal() {
        this.modalFlag = false;
        this.modalFlag1 = false;
      },
      delCartConfirm(id,num) {
        //  确认删除购物车数据的方法
        this.modalFlag1 = true;
        this.currentId = id;
        this.count = num;
      },
      delCart() {
        axios.post('/users/cartDel', {
          productId: this.currentId
        }).then(res => {
          if (res.data.status === 0) {
            this.modalFlag1 = false;
            this.getCartList();
            this.$store.commit('updateCartCount', -this.count)
          }
        })
      },
      editCart(flag, item) {
        if (flag === 'add') {
          item.productNum++;
          this.$store.commit('updateCartCount', 1)
        } else if (flag === 'minu') {
          if (item.productNum <= 1) {
            this.minus = true;
            return;
          }
          item.productNum--;
          this.$store.commit('updateCartCount', -1)
        } else {
          item.checked = !item.checked;
        }
        axios.post('/users/cartEdit', {
          productId: item.productId,
          productNum: item.productNum,
          checked: item.checked
        }).then(res => {
          if (res.data.status === 0) {

          }
        })
      },
      checkAll() {
        var allflag = !this.checkAllFlag;
        this.cartList.forEach(item=>{
          item.checked = allflag;
        });
        axios.post('/users/cartCheckAll',{
          checkAll:allflag
        }).then(res=>{
          if (res.data.status === 0) {

          }
        })
      },
      checkout(){
        this.$router.push({
          path:'/address'
        })
      }
    },
    computed: {
      totalPrice() {
        let total = 0;
        this.cartList.forEach(item => {
          if (item.checked === true) {
            total += item.productNum * item.salePrice;
          }
        });
        return parseInt(total);
      },
      checkAllFlag(){
          return this.cartList.every(item=>{
            return item.checked === true
          });
        },
      checkoutDis(){
         return this.cartList.every(item=>{
          return item.checked === false
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
<style>
  .input-sub, .input-add {
    min-width: 40px;
    height: 100%;
    border: 0;
    color: #605F5F;
    text-align: center;
    font-size: 16px;
    overflow: hidden;
    display: inline-block;
    background: #f0f0f0;
  }

  .item-quantity .select-self-area {
    background: none;
    border: 1px solid #f0f0f0;
  }

  .item-quantity .select-self-area .select-ipt {
    display: inline-block;
    padding: 0 3px;
    width: 30px;
    min-width: 30px;
    text-align: center;
  }

  .icon-bin {
    font-size: 20px;
  }
</style>
