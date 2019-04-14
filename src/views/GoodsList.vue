<template>
  <div>

    <!-- 标题组件 -->
    <nav-header></nav-header>

    <!-- 在组件中写内容会被vue文件中的插槽slot捕获并放到对应位置上 -->
    <!-- 在标签上加入slot属性，就可替换对应slot中name属性相同的对应插槽-->
    <nav-bread>
      <span>Goods</span>
    </nav-bread>

    <!--中间内容部分-->
    <div class="accessory-result-page accessory-page">
      <div class="container">

        <!-- 排序过滤器 -->
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a @click.prevent="sortGoods" href="#" class="price">Price
            <span class="icon-arrow-short">
              <i :class="{'sort-up':!sortFlag}"></i>
            </span>
          </a>
          <!-- 当页面缩小时，由于响应式布局导致左侧价格过滤器消失，此时页面右上角点击filterby可以呼出过滤器菜单 filterby-show -->
          <a href="#" class="filterby stopPop" @click.prevent="showFilterPop">Filter by</a>
        </div>


        <div class="accessory-result">


          <!-- filter -->
          <!-- 左侧商品价格过滤器部分 -->
          <div :class="['filter', 'stopPop', isActive ? 'filterby-show' : '']" id="filter">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a @click.prevent="setPriceCheckedAll" :class="{'cur':priceChecked==='all'}">All</a></dd>
              <dd v-for="(item,index) in priceFilter" :key="item.startPrice">
                <a href="#" @click.prevent="setPriceChecked(index)" :class="{'cur': priceChecked === index}">{{
                  item.startPrice }} - {{ item.endPrice }}</a>
              </dd>

            </dl>
          </div>


          <!-- search result accessories list -->
          <!-- 商品列表 -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in goodsList" :key="item.productId">
                  <div class="pic">
                    <a href="#"><img v-lazy=" /static/ + item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{ item.productName }}</div>
                    <div class="price">{{ item.salePrice }}</div>
                    <div class="btn-area">
                      <a href="#" @click.prevent="addCart(item.productId)" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy"
                   infinite-scroll-distance="10">
                <img src="../assets/loading-spinning-bubbles.svg" v-show="loading">
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
    <!-- 打开过滤器的遮罩 -->
    <div class="md-overlay" v-show="overLayFlag" @click.stop="closePop"></div>

    <model :loginModalFlag="modalFlag" @close="closeModal">
      <p slot="content" class="alert-modal">请登录</p>
      <button slot="btn-group" class="btn btn--m" @click="closeModal">关闭</button>
    </model>
    <model :loginModalFlag="modalFlag1" @close="closeModal">
      <p slot="content" class="alert-modal">加入成功</p>
      <div slot="btn-group">
        <button class="btn btn--m" @click="closeModal">继续购物</button>
        <router-link to="/cart" class="btn btn--m">进入购物车</router-link>
      </div>
    </model>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
  import '../assets/css/base.css'
  import '../assets/css/product.css'
  import '../assets/icomoon/style.css'

  import NavHeader from '../components/Header.vue'
  import NavFooter from '../components/NavFooter.vue'
  import NavBread from '../components/NavBread.vue'

  import Model from '../components/Model.vue'

  import axios from 'axios';

  export default {
    data() {
      return {
        goodsList: [],  //存储商品数据
        priceFilter: [
          //  设计左边的价格过滤器
          {
            startPrice: '0.00',
            endPrice: '500.00'
          },
          {
            startPrice: '500.00',
            endPrice: '1000.00'
          },
          {
            startPrice: '1000.00',
            endPrice: '2000.00'
          },
          {
            startPrice: '2000.00',
            endPrice: '5000.00'
          }
        ],
        // 判断商品是否全部选中
        priceChecked: 'all',
        //  点击调出显示框
        isActive: false,
        overLayFlag: false,
        sortFlag: true,   //默认排序为升序
        page: 1,
        pageSize: 8,
        busy: false,   //设置滚动刷新生效
        loading: false,  //请求接口时显示加载动画
        modalFlag: false,
        modalFlag1: false
      }
    },
    mounted() {
      this.getGoodsList();
    },
    methods: {
      getGoodsList(flag) {
        this.loading = true;
        console.log(this.loading);
        var params = {
          page: this.page,
          pageSize: this.pageSize,
          sort: this.sortFlag ? 1 : -1,
          priceChecked: this.priceChecked
        };
        axios.get('/goods/list', {
          params: params
        }).then(res => {
          this.loading = false;
          if (res.data.status === 0) {
            if (flag) {
              // 通过传入一个参数来判断是否需要拼接数据
              this.goodsList = this.goodsList.concat(res.data.result.list)

              if (res.data.result.count === 0) {
                this.busy = true;
                //  当无数据可加载时，将滚动加载禁用
              } else {
                this.busy = false;
              }
            } else {
              this.goodsList = res.data.result.list;
            }
          }
        })
      },
      //  设置过滤器弹出的时候遮罩层和对应框的变化
      setPriceChecked(index) {
        this.priceChecked = index;
        this.page = 1;
        this.getGoodsList();
        this.isActive = false;
        this.overLayFlag = false;
      },
      setPriceCheckedAll() {
        this.priceChecked = 'all';
        this.page = 1;
        this.getGoodsList();
        this.loadMore();
        this.isActive = false;
        this.overLayFlag = false;
      },
      showFilterPop() {
        this.isActive = true;
        this.overLayFlag = true;
      },
      closePop() {
        this.isActive = false;
        this.overLayFlag = false;
        this.mdShowCart = false;
      },
      //  点击排序事件
      sortGoods() {
        this.sortFlag = !this.sortFlag;
        this.page = 1;
        this.getGoodsList();
      },
      loadMore() {
        // 加载新数据的方法
        this.busy = true;
        setTimeout(() => {
          this.page++; //进入第二页
          this.getGoodsList(1);
        }, 500);
      },
      addCart(id) {
        axios.post('/goods/addCart', {
          userId: id,
          productId: id
        }).then(res => {
          if (res.data.status === 0) {
            this.modalFlag1 = true
            this.$store.commit('updateCartCount', 1)
          } else {
            this.modalFlag = true
          }
        });
      },
      closeModal() {
        this.modalFlag = false;
        this.modalFlag1 = false;
      }
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread,
      Model
    },
    watch: {}
  }
</script>
<style scoped>

  .load-more {
    height: 100px;
    line-height: 100px;
    text-align: center;
  }

  .sort-up {
    transform: rotate(-180deg);
    transition: all 0.3s ease;
  }

  .icon-arrow-short i {
    transition: all 0.3s ease;
    position: absolute;
    right: 25px;
    line-height: 55px;
  }

  .alert-modal {
    color: red;
    font-size: 25px;
    font-weight: bold;
  }

</style>
