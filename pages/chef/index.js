// pages/chef/index.js
var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default

var app = getApp()
var menu_card = require('../../components/menu_card/index.js')
var menu_card = require('../../components/comment_card/comment_card.js')

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
  previewMenuPhoto(e) {
    console.log(e)
    var imageUrl = e.currentTarget.dataset.url
    var index = e.currentTarget.id
    wx.previewImage({
      current: imageUrl, // 当前显示图片的http链接
      urls: this.data.chef.menus[index].menu_photo_urls // 需要预览的图片http链接列表
    })
  },
  
  into_room: function (event) {
    var that = this
    console.log(that.data.chef)
    WebIM.conn.addRoster({ 'name': that.data.chef.easemob_username})
    var nameList = {
      myName: wx.getStorageSync('easemobUsername'),
      your: that.data.chef.easemob_username
    }
    wx.navigateTo({
      url: '../im/chatroom/chatroom?username=' + JSON.stringify(nameList)
    })
  },
  booking: menu_card.booking,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var chef_id = options.chef_id
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          sliderLeft: 0,
          sliderOffset: res.windowWidth / _this.data.tabs.length * _this.data.activeIndex
        });
      }
    });
    wx.request({
      url: app.globalData.baseurl + 'chef/' + chef_id,
      success(res) {
        console.log(res)
        if (app.globalData.showError && res.statusCode != '200') {
          var errorMsg
          if (res.data.error_msg) {
            errorMsg = res.data.error_msg
          } else {
            errorMsg = '未知错误'
          }
          errorMsg += res.statusCode
          app.showError(errorMsg)
          return
        }
        _this.setData({
          chef: res.data.result,
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

  // /**
  //  * 页面相关事件处理函数--监听用户下拉动作
  //  */
  // onPullDownRefresh: function () {

  // },

  // /**
  //  * 页面上拉触底事件的处理函数
  //  */
  // onReachBottom: function () {

  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})