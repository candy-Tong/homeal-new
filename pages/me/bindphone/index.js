// pages/me/bindphone/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getCode: "获取验证码"
  },
  phone: "",
  code: "",

  bindGetCode() {

    if (this.data.getCode == '获取验证码' || this.data.getCode == '重新获取') {
      console.log(this.phone)

      if (this.phone.length == 10 || this.phone.length == 11) {
        var time = 10
        var _this = this
        _this.setData({
          getCode: time-- + "s"
        })
        var timeChangeFunc = function () {
          if (time == 0) {
            _this.setData({
              getCode: "重新获取"
            })
          } else {
            _this.setData({
              getCode: time + "s"
            })
            time--
            setTimeout(timeChangeFunc, 1000)
          }
        }
        setTimeout(timeChangeFunc, 1000)
        var token = app.getToken()
        var phone = _this.phone
        console.log(token)
        console.log(phone)
        wx.request({
          url: 'https://homeal.com.hk/lrl/api/bind/smscode',
          header: {
            phone: phone,
            token: token
          },
          success(res) {
            _this.submitPhone = phone
            // console.log(res)
            _this.setData({
              code: res.data.result
            })
          }
        })
      } else {
        wx.showModal({
          content: '请填写正确手机号码',
          showCancel: false
        });
      }
    }
  },

  bindPhone(e) {
    var phone = this.submitPhone
    var smscode = this.code
    var token = app.getToken()
    console.log(phone)
    console.log(smscode)
    console.log(token)
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: 'https://homeal.com.hk/lrl/api/bind/phone',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        "phone": phone,
        "token": token,
        "smscode": smscode
      },
      success(res) {
        wx.hideLoading()
        console.log(res)
        if (res.data.error_code == "h0008") {
          wx.showModal({
            content: '验证码错误',
            showCancel: false
          });
          return
        }
        //该手机已经被使用
        if (res.data.error_code == "h0001") {
          wx.showModal({
            content: '该手机已经被使用，请联系管理员或更换绑定手机',
            showCancel: false
          });
          return
        }
        if (res.data.is_error == false) {
          app.globalData.token = res.data.result
          app.globalData.is_phone_bound = true
          try {
            wx.setStorageSync('bindPhone', true)
            wx.showToast({
              title: '绑定成功',
              icon: 'success',
              duration: 2000
            })
            wx.navigateBack({
              delta: 1
            })
          } catch (e) {
            console.log("存储bindPhone出现问题")
          }
        }


      },
      fail(res) {
        wx.hideLoading()
      }
    })
  },

  bindPhoneInput(e) {
    console.log(e)
    this.phone = e.detail.value
  },
  bindCodeInput(e) {
    this.code = e.detail.value
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // test
    if (app.globalData.isLogin) {
      // 已登录
      wx.showModal({
        content: '已绑定过手机，绑定后的界面没做',
        showCancel: false
      });
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})