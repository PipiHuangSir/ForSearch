var url1 = 'http://192.168.43.92:8080/search';
var url2 = 'http://192.168.1.106:8080/search';
var url3 = 'http://10.7.5.66:8080/search';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsData: [],
    searchSongList: [], //放置返回数据的数组  
    searchLoadingComplete: false,  //“没有数据”的变量
    keyword : '',
    from: 0,
    size: 16,
    //热词
    mediaType:[
      {
        "type":"综合"
      },
      {
        "type":"频道"
      },
      {
        "type":"文章"
      }
    ],
    selectIndex: 0,

    searchType:[
      {
        "type":"information"
      },
      {
        "type":"channel"
      },
      {
        "type":"article"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      keyword: ''
    })
    wx.setStorage({
      key: 'keyword',
      data: '',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var method = wx.getStorageSync('method');
    let that = this;
    //获取查询关键字
    that.data.keyword = wx.getStorageSync("keyword");
    if (method == 'access' || method == 'search'){
      that.clearPage();
      that.searchData();
    } else {
      console.log('cancel');
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      keyword: ''
    })
    wx.setStorage({
      key: 'keyword',
      data: '',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
    this.searchData('');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    that.data.from += that.data.size;
    that.doSearch(that.data.keyword);
    console.log("下拉")
  },

  clearPage: function(){
    //清楚分页
    this.data.from = 0;
    //清楚数据
    this.data.newsData = new Array();
    this.scrollTop = 0;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  //点击变色
  changeColor: function(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      selectIndex: index
    })
  },

  gotoSearch(){
    wx: wx.navigateTo({
      url: '../search/search',
    })
  },

  //切换栏目
  changeIndex:function(e){
    this.clearPage();
    this.doSearch('');
  },

  //查询按钮执行动作
  searchData:function(){
    this.doSearch(this.data.keyword);
  },

  //执行查询
  doSearch: function (keyword) {
    var that = this;
    //获取查询type下标
    var index = that.data.selectIndex;
    //获取查询类型
    var typeValue = that.data.searchType[index].type;
    // console.log(keyword);
    // console.log(typeValue);
    wx.request({
      url: url2,
      data: {
        'type': typeValue,
        'keyword': keyword,
        'from':that.data.from,
        'size':that.data.size
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log(res.data)
        if(res.data!=null){
            that.setData({
              //追加数据
              newsData: that.data.newsData.concat(res.data)
            })
        }
      },
      fail: function (res){
        that.netClosed();
      }
    })
  },

//连接失败提示
  netClosed: function() {
    wx.showLoading({
      title: '连接失败',
    }),
    setTimeout(function (){
      wx.hideLoading()
    },2000);
  },
})