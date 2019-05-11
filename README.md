# imoocmall

> Imooc Mall (全栈电子商城项目)

## 项目启动

``` bash
# 安装依赖
npm install

# 启动服务器之前先打开数据库MongoDB
mongod

# 启动服务器
node server/bin/www

# 页面热重载在 localhost:8080
npm run dev

```

## 项目所使用的技术栈

1. 前端部分

   1.1 Vue全家桶：Vue-cli、Vue-router、axios、vuex、vue-lazyload

   1.2 页面为响应式布局，适配了不同大小的屏幕

   1.3 使用了滚动加载数据的插件，使用了webpack进行打包

2. 后端部分

   2.1 Node.js+Express框架实现后端的RESTful接口，并以json的形式进行输出

   2.2 使用MongoDB+mongoose框架将数据以JSON形式进行存储

