// pages/chef/index.js

var menu_card = require('../../components/menu_card/index.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["套餐", "信息", "用户评价"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  booking: menu_card.booking,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var chef_id=options.chef_id
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          sliderLeft: 0,
          sliderOffset: res.windowWidth / _this.data.tabs.length * _this.data.activeIndex
        });
      }
    });
    wx.request({
      url: 'http://homeal.com.hk/lrl/api/chef/' + chef_id,
      success(res){
        console.log(res)
        _this.setData({
          chef:res.data.result,
          chef_id
        })
      }
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})