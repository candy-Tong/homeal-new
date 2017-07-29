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
    // 检查是否登录
    wx.getSetting({
      success: function (res) {
        var isLogin
        console.log(res)
        // 登录未授权
        if (res.authSetting["scope.userInfo"] == undefined || res.authSetting["scope.userInfo"] == false) {
          isLogin = false
        } else {
          // 登录已授权
          isLogin = true
        }
        _this.setData({
          isLogin
        })
      },
      fail: function (res) {
        console.log("读取设置失败")
      }
    })
  },

  // 用户点击登陆
  bindgetuserinfo(e) {
    var _this = this
    console.log(e)
    var userinfo = e.detail
    if (userinfo.errMsg && userinfo.errMsg.indexOf('fail')>0) {
      console.log("无法获取用户userInfo")
    } else if (userinfo.errMsg && userinfo.errMsg.indexOf('ok')>0) {
      // app.login(function () {
      //   _this.setData({
      //     isLogin: true
      //   })
      // })
    
    // 按钮登录
      wx.login({
        success: function (response) {
          var code = response.code
          if (code) {
            wx.request({
              url: 'http://homeal.com.hk/lrl/api/wechat/mini/user',
              data: {
                js_code: code,
                iv: userinfo.iv,
                encrypted_data: userinfo.encryptedData
              },
              success: function (res) {
                console.log("登陆返回")
                console.log(res.data)
                //应该返回token
                app.saveToken(res.data.result.token)

                if (sucCallback) {
                  sucCallback()
                }
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        },
        fail: function () {
          console.log("login 失败")
        }
      })
    }else{
      console.log("bindgetuserinfo出现其他状况")
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