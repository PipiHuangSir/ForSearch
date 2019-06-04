var searchUtil = require('./searchUtil.js')
var url = 'http://192.168.1.106:8080/hotWords/usedWordAndSort';
Page({
  data: {
    hotWords:[]
  },

  //输入
  searchInput: searchUtil.searchInput,
  //清除缓存
  searchClear: searchUtil.searchClear,
  //点击关键字或搜索记录
  searchKeyTap: searchUtil.searchKeyTap,
  //执行动作
  searchConfirm: searchUtil.searchConfirm,
  //删除
  searchDelete: searchUtil.searchDeleteAll,


  // 搜索回调函数  
  searchFunction: function (value) {
    //console.log(value);
    wx.setStorage({
      key: 'keyword',
      data: value,
      success: function (res) {
        wx.setStorageSync('method', 'search');
        wx.navigateBack({
          url: '../home/home'
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    }) 
  },
  // 返回回调函数
  gobackFunction: function () {
    wx.setStorageSync('method', 'back');
    wx.navigateBack({
      url: '../home/home'
    })
  },
  // 初始化
  onLoad: function () {
    var that = this;
    //初始化热词
    that.initHotWords();
    
  },

  initHotWords: function() {
    let that = this;
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        that.data.hotWords = res.data;
        searchUtil.init(
          that,
          that.data.hotWords,
          that.searchFunction,
          that.gobackFunction,
        );
      }
    })
    
  }
})