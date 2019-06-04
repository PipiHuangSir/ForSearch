// 提示集合
var __tipKeys = [];
// 搜索回调函数 
var __searchFunction = null;
// 返回函数 
var __gobackFunction = null;
// 引用变量
var __that = null;

// 初始化函数
function init(that, hotKeys, searchFunction, gobackFunction) {
  __that = that;
  //__tipKeys = tipKeys;
  //查找跳转
  __searchFunction = searchFunction;
  //返回跳转
  __gobackFunction = gobackFunction;

  var temData = {};
  var barHeight = 43;
  var view = {
    barHeight: barHeight
  }
  temData.hotKeys = hotKeys;

  //获取系统信息
  wx.getSystemInfo({
    success: function (res) {
      var wHeight = res.windowHeight;
      view.seachHeight = wHeight - barHeight;
      temData.view = view;
      __that.setData({
        searchData: temData
      });
    }
  });
  getHisKeys();
}

// 搜索框输入时候操作
function searchInput(e) {
  var inputValue = e.detail.value;
  // 页面数据
  var temData = __that.data.searchData;
  // 寻找提示值 
  var tipKeys = [];
  if (inputValue && inputValue.length > 0) {
    for (var i = 0; i < __tipKeys.length; i++) {
      var mindKey = __tipKeys[i];
      // 包含字符串
      if (mindKey.indexOf(inputValue) != -1) {
        tipKeys.push(mindKey);
      }
    }
  }
  // 更新数据
  temData.value = inputValue;
  temData.tipKeys = tipKeys;
  // 更新视图
  __that.setData({
    searchData: temData
  });
}

// 清空输入
function searchClear() {
  // 页面数据
  var temData = __that.data.searchData;
  // 更新数据
  temData.value = "";
  temData.tipKeys = [];
  // 更新视图
  __that.setData({
    searchData: temData
  });
}

// 点击提示或者关键字、历史记录时的操作
function searchKeyTap(e) {
  search(e.target.dataset.key);
}

// 确任或者回车
function searchConfirm(e) {
  var key = e.target.dataset.key;
  if (key == 'back') {
    __gobackFunction();
  } else {
    search(__that.data.searchData.value);
  }
}

//执行搜索
function search(inputValue) {
  //console.log(inputValue)
  if (inputValue && inputValue.length > 0) {
    // 添加历史记录
    searchAddHisKey(inputValue);
    // 更新
    var temData = __that.data.searchData;
    temData.value = inputValue;
    __that.setData({
      searchData: temData
    });
    // 回调搜索
    __searchFunction(inputValue);
  }
}

// 读取搜索记录缓存
function getHisKeys() {
  var value = [];
  try {
    value = wx.getStorageSync('searchHisKeys')
    if (value) {
      var temData = __that.data.searchData;
      temData.his = value;
      __that.setData({
        searchData: temData
      });
    }
  } catch (e) {
  }
}

// 添加搜索缓存
function searchAddHisKey(inputValue) {
  var value = wx.getStorageSync('searchHisKeys');
  if (value) {
    if (value.indexOf(inputValue) < 0) {
      value.unshift(inputValue);
    }
    wx.setStorage({
      key: "searchHisKeys",
      data: value,
      success: function () {
        getHisKeys(__that);
      }
    })
  } else {
    value = [];
    value.push(inputValue);
    wx.setStorage({
      key: "searchHisKeys",
      data: value,
      success: function () {
        getHisKeys(__that);
      }
    })
  }
}

// 删除缓存
function searchDeleteAll() {
  wx.removeStorage({
    key: 'searchHisKeys',
    success: function (res) {
      var value = [];
      var temData = __that.data.searchData;
      temData.his = value;
      __that.setData({
        searchData: temData
      });
    }
  })
}

// 导出接口
module.exports = {
  init: init,
  searchInput: searchInput,
  searchKeyTap: searchKeyTap,
  searchDeleteAll: searchDeleteAll,
  searchConfirm: searchConfirm,
  searchClear: searchClear,
}