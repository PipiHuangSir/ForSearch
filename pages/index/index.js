// pages/index/index.js
Page({

  resetTag: {
      repage: 'true' //是否跳转
  },

  goToSearch: function(event){
    if (this.resetTag.repage) {
      this.resetTag.repage = 'false';
      this.goToSearchPage();
    }
  },

    onShow: function(){
      this.resetTag.repage = 'true';
  },

  goToSearchPage: function () {
    wx: wx.navigateTo({
      url: '../home/home',
      success: function (res) { 
        wx.setStorageSync('method', 'access');
      },
      fail: function (res) { },
      complete: function (res) { 
      },
    });
  }
})