// pages/order/index.js
var order_card = require("../../components/order_card/index.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["选项一", "选项二", "选项三"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  seeOrder: order_card.seeOrder,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    var callback = [
      {
        func: function () {
          _this.setData({
            isLogin: true
          })
        }
      },
      {
        isError: true,
        func: function () {
          _this.setData({
            isLogin: false
          })
        }
      }
    ]
    // 检查是否登录
    app.checkUserInfoModule(callback)
    
  },

  // 用户点击登陆
  bindgetuserinfo(e) {
    var _this = this
    console.log(e)
    var userinfo = e.detail
    if (userinfo.errMsg && userinfo.errMsg.indexOf('fail') > 0) {
      console.log("无法获取用户userInfo")
    } else if (userinfo.errMsg && userinfo.errMsg.indexOf('ok') > 0) {
      // 配置回调函数
      var callback = [
        {
          func: function () {
            wx.hideLoading()
            _this.setData({
              isLogin: true
            })
          }
        },
        {
          isError: true,
          func: function () {
            wx.hideLoading()
            console.log("已授权登录却发生登录错误,可能是存储token出现问题")
            _this.setData({
              isLogin: false
            })
          }
        }
      ]
      // 按钮登录
      wx.login({
        success: function (response) {
          var code = response.code
          if (code) {
            var login_info = {
              code: code,
              iv: userinfo.iv,
              encrypted_data: userinfo.encryptedData
            }
            console.log(login_info)
            wx.showLoading({
              title: '登录中',
              mask: true
            })
            app.loginModule(login_info,callback)
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        },
        fail: function () {
          console.log("login 失败")
        }
      })
    } else {
      console.log("发生错误，bindgetuserinfo出现其他状况")
    }
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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})