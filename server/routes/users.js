var express = require('express');
var router = express.Router();
// 加载日期格式化工具类，因为该文件直接对函数原型进行操作，没有导出，所以不需要挂载
require('../util/util');

// 获取User数据模型
const User = require('../model/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// 登录接口
router.post('/login', function (req, res, next) {
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  };
  User.findOne(param)
    .then((doc, err) => {
      if (err) {
        res.json({
          status: 1,
          msg: err
        })
      } else {
        if (doc) {
          res.cookie('userId', doc.userId, {
            path: '/',
            maxAge: 1000 * 60 * 60 //保存一个小时
          });
          res.cookie('userName', doc.userName, {
            path: '/',
            maxAge: 1000 * 60 * 60
          });
          res.json({
            // 将用户名数据返回给前端
            status: 0,
            msg: '',
            result: {
              userName: doc.userName
            }
          })
        }
      }
    })
});

//  登出接口
router.post('/logout', function (req, res, next) {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  });
  res.json({
    status: 0,
    msg: '',
    result: ''
  })
});

// 校验接口
router.get('/checkLogin', function (req, res, next) {
  if (req.cookies.userId) {
    res.json({
      status: 0,
      msg: '',
      result: req.cookies.userName
    })
  } else {
    res.json({
      status: 1,
      msg: '未登录',
      result: ''
    })
  }
});

// 购物车数据查询接口
router.get('/cartList', function (req, res, next) {
  var userId = req.cookies.userId;
  User.findOne({
    userId: userId
  }).then((doc, err) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      });
    } else {
      if (doc) {
        res.json({
          status: 0,
          msg: '',
          result: doc.cartList
        })
      }
    }
  })
});

// 购物车删除数据接口
router.post('/cartDel', function (req, res, next) {
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  User.update({
    userId: userId
  }, {
    $pull: {
      //  删除指定的数据
      'cartList': {
        'productId': productId
      }
    }
  }).then((doc, err) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: 0,
        msg: '',
        result: 'del success'
      })
    }
  })
});

// 修改购物车数据接口
router.post('/cartEdit', function (req, res, next) {
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  var productNum = req.body.productNum;
  var checked = req.body.checked;
  User.update({
    userId,
    'cartList.productId': productId
  }, {
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked
  }).then((doc, err) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: 0,
        msg: '',
        result: 'update success'
      })
    }
  })
});

// 修改购物车选中的接口
router.post('/cartCheckAll', function (req, res, next) {
  var userId = req.cookies.userId;
  var checkAll = req.body.checkAll;
  User.findOne({
    userId
  }).then((user, err) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      })
    } else {
      if (user) {
        user.cartList.forEach(item => {
          item.checked = checkAll;
        })
        user.save();
      }
      res.json({
        status: 0,
        msg: '',
        result: 'update success'
      })
    }
  })
});

// 收货地址查询的接口
router.get('/addressList', function (req, res, next) {
  var userId = req.cookies.userId;
  User.findOne({
    userId
  }).then(doc => {
    if (doc) {
      res.json({
        status: 0,
        msg: '',
        result: doc.addressList
      })
    }
  })
});

// 修改默认地址的接口
router.post('/setDefault', function (req, res, next) {
  var userId = req.cookies.userId;
  User.findOne({
    userId
  }).then(doc => {
    if (doc) {
      doc.addressList.forEach(item => {
        if (item.addressId === req.body.addressId) {
          item.isDefault = true;
        } else {
          item.isDefault = false;
        }
      })
    }
    doc.save();
    res.json({
      status: 0,
      msg: '',
      result: 'save succ'
    })
  })
});

// 删除地址的接口
router.post('/delAddress', function (req, res, next) {
  var userId = req.cookies.userId;
  var addressId = req.body.addressId;
  User.update({
    userId
  }, {
    $pull: {
      'addressList': {
        'addressId': addressId
      }
    }
  }).then(doc => {
    if (doc) {
      res.json({
        status: 0,
        msg: '',
        result: ''
      });
    }
  })
});

// 生成订单的接口
router.post('/payMent', function (req, res, next) {
  var userId = req.cookies.userId;
  var orderTotal = req.body.orderTotal;
  var addressId = req.body.addressId;
  User.findOne({
    userId
  },function (err, doc) {
    if (doc) {
      // 获取地址信息
      console.log(doc);
      var address = {};
      var goodsList = [];
      doc.addressList.forEach(item => {
        if (addressId == item.addressId) {
          address = item;
        }
      });
      // 获取用户购物车的购买商品
      doc.cartList.filter(item => {
        if (item.checked === true) {
          goodsList.push(item)
        }
      });

      // 生成订单号
      var platform = '622';
      var r1 = Math.floor(Math.random() * 10);
      var r2 = Math.floor(Math.random() * 10);

      // 16位系统数字
      var sysDate = new Date().Format('yyyyMMddhhmmss');
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');

      var orderId = platform + r1 + sysDate + r2;

      //创建订单
      var order = {
        orderId,
        orderTotal,
        addressInfo: address,
        goodsList,
        orderStatus: "1",
        createDate
      };
      console.log(order);
      doc.orderList.push(order);
      doc.save(function (err1,doc1) {
        if(err1){
          res.json({
            status:1,
            msg:err1.message,
            result:''
          });
        }else{
          res.json({
            status: 0,
            msg: '',
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          });
        }
      });

    }
  })

});

// 查询订单信息的接口
router.get('/orderDetail', function (req, res, next) {
  var userId = req.cookies.userId;
  var orderId = req.query.orderId;
  User.findOne({
    userId
  },function (err, userInfo) {
    if (err) {
      res.json({
        status:1,
        msg:err.message,
        result:''
      })
    }else {
      var orderList = userInfo.orderList;
      if (orderList.length > 0) {
        var orderTotal = 0;
        orderList.forEach(item=>{
          if (orderId === item.orderId) {
            orderTotal = item.orderTotal;
          }
        });
        res.json({
          status:0,
          msg:'',
          result:{
            orderId,
            orderTotal
          }
        })
      }
    }
  })
});

// 查询购物车数量的接口
router.get('/getCartCount', function (req, res, next) {
  var userId = req.cookies.userId;
  User.findOne({
    userId
  }, function (err, doc) {
    if (err) {

    }else{
      var cartList = doc.cartList;
      var count = 0;
      cartList.forEach(item=>{
        count += item.productNum;
      });
      res.json({
        status:0,
        msg:'',
        result:count
      })
    }
  })
});

module.exports = router;
