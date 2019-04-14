//  链接数据库的路由
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
var goods = require('../model/goods');
var User = require('../model/user');

mongoose.connect('mongodb://localhost:27017/config', {useMongoClient: true});

mongoose.connection.on('connected', () => {
  console.log('数据库已连接,并成功挂载到端口上')
});

//查询商品列表的接口
router.get('/list', function (req, res, next) {
  //在后台实现查询功能，无需在前端设置，只需接受来自前端的数据并写成api即可
  let query = req.query;  //获取地址栏传进来的参数
  let page = parseInt(query.page);
  let pageSize = parseInt(query.pageSize);
  let sort = query.sort;  //接收传入的排序方式
  let priceChecked = query.priceChecked;  //接收需要过滤的数据标识

  let skip = (page - 1) * pageSize;  //当传入某页时，自动忽略该页面之前的所有数据
  let params = {};
  // 声明最大值最小值区间
  var priceGt = '';
  var priceLte = '';
  if (priceChecked !== 'all') {
    switch (parseInt(priceChecked)) {
      case 0 :
        priceGt = 0;
        priceLte = 500;
        break;
      case 1 :
        priceGt = 500;
        priceLte = 1000;
        break;
      case 2 :
        priceGt = 1000;
        priceLte = 2000;
        break;
      case 3 :
        priceGt = 2000;
        priceLte = 5000;
        break;
    }
    params = {
      salePrice: {
        $gt: priceGt, //大于
        $lte: priceLte  //小于
      }
    }
  }


  let goodsModel = goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice': sort});

  goodsModel.exec(function (err, doc) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    } else {
      res.json({
        status: 0,
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
});

router.post('/addCart', function (req, res, next) {
//  加入购物车的接口
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  // 只拿当前第一个用户
  User.findOne({
    userId: userId
  }, function (err, userDoc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      console.log(userDoc);
      if (userDoc) {
        // 查找是否有相同
        let goodsItem = '';
        userDoc.cartList.forEach(item => {
          if (item.productId === productId) {
            item.productNum++;
            goodsItem = item;
          }
        });
        if (goodsItem) {
          userDoc.save();
          res.json({
            status: 0,
            msg: ''
          })
        } else {
          goods.findOne({
            productId: productId
          }, function (err, doc) {
            if (err) {
              res.json({
                status: '1',
                msg: err.message
              })
            } else {
              if (doc) {
                doc.productNum = 1;
                doc.checked = true;
                userDoc.cartList.push(doc);
                userDoc.save();
                res.json({
                  status: 0,
                  msg: ''
                })
              }
            }
          })
        }
      }
    }
  })
});

module.exports = router;
