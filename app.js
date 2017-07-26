//app.js
App({
  onLaunch: function () {
    this.checkSession();

    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: true,
        success: function (res) {
          console.log(res)
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  // 验证登录是否过期
  checkSession(callback) {
    var _this = this
    console.log("检查登录有效期")
    wx.checkSession({
      success: function (res) {
        // 登录有效
        console.log("登录有效")
        if (callback) {
          callback()
        }
      },
      fail: function (res) {
        // 登陆过期，调用login
        console.log("登录过期")
        if (callback) {
          _this.login(callback)
        } else {
          _this.login()
        }

      },
      complete: function (res) { },
    })
  },


  login(callback) {
    var _this = this
    wx.login({
      success: function (response) {
        var code = response.code
        if (code) {
          wx.getUserInfo({
            withCredentials: true,
            success: function (resp) {
              wx.request({
                url: 'http://homeal.com.hk/lrl/api/wechat/mini/user',
                data: {
                  js_code: code,
                  iv: resp.iv,
                  encrypted_data: resp.encryptedData
                },
                success: function (res) {
                  //应该返回token
                  console.log(res.data)
                  if (callback) {
                    callback()
                  }
                }
              })
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
  },

  globalData: {
    userInfo: null
  }
})
