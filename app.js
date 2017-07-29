//app.js

App({
  onLaunch: function () {
    console.log(this)
    var _this = this

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

  // 验证原生登录是否过期
  checkSession(sucCallback = null, failCallback = null) {
    var _this = this
    console.log("检查登录有效期")
    wx.checkSession({
      success: function (res) {
        // 登录有效
        console.log("原生登录有效，getUserInfo不一定成功")

        // _this.login()

        if (sucCallback) {
          sucCallback()
        }
      },
      fail: function (res) {
        // 登陆过期，调用login
        console.log("登录过期")
        _this.login(sucCallback, failCallback)
      },
      complete: function (res) { },
    })
  },

  // 授权登录，用户拒绝后只能用按钮登录
  login(sucCallback = null, failCallback = null) {
    var _this = this
    wx.login({
      success: function (response) {
        // console.log(response)
        var code = response.code
        if (code) {
          wx.getUserInfo({
            withCredentials: true,
            success: function (resp) {
              var login_info={
                code:code,
                iv: resp.iv,
                encrypted_data: resp.encrypted_data
              }
              _this.login_request(login_info,sucCallback)
            },
            // 用户拒绝
            fail() {
              wx.showModal({
                content: '用户未登录',
                showCancel: true,
                confirmColor: "#E64340",
                success(res) {
                  if (res.confirm == true) {
                    wx.switchTab({
                      url: '/pages/order/index',
                    })
                  }
                }
              });
              if (failCallback) {
                failCallback()
              }
              console.log("getUserInfo 失败")
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

  login_request(login_info,callback){
    var _this=this
    console.log(_this)
    console.log(getApp())
    wx.request({
      url: 'http://homeal.com.hk/lrl/api/wechat/mini/user',
      data: {
        js_code: login_info.code,
        iv: login_info.iv,
        encrypted_data: login_info.encryptedData
      },
      success: function (res) {
        console.log("登陆返回")
        console.log(res.data)
        //应该返回token
        try {
          console.log("缓存token")
          wx.setStorageSync('token', res.data.result.token)
        } catch (e) {
          console.log("保存token错误")
          console.log(e)
        }
        if (callback) {
          callback()
        }
      }
    })
  },

  // 验证是否已取得userInfo
  checkUserInfo(callback = null) {
    wx.getSetting({
      success: function (res) {
        console.log(res)
        // if (res.errMsg=="getSetting:ok"){
        //   if (callback) {
        //     callback()
        //   }
        // }
        // 未授权
        if (res.authSetting["scope.userInfo"] == undefined || res.authSetting["scope.userInfo"] == false) {
          wx.hideLoading()
          wx.showModal({
            content: '用户未登录',
            showCancel: true,
            confirmColor: "#E64340",
            success(res) {
              if (res.confirm == true) {
                wx.switchTab({
                  url: '/pages/order/index',
                })
              }
            }
          });
        } else {
          if (callback) {
            callback()
          }
          console.log("other")
        }
      },
      fail: function (res) {
        console.log("读取设置失败")
      }
    })
  },

  saveToken(token) {
    try {
      console.log("缓存token")
      wx.setStorageSync('token', token)
    } catch (e) {
      console.log("保存token错误")
      console.log(e)
    }
  },

 
  getToken() {
    try {
      var token = wx.getStorageSync('token')
      if (token) {
        // Do something with return value
        // console.log("token:"+token)
      } else {
        console.log("token为空")
      }
    } catch (e) {
      // Do something when catch error
      console.log("获取token发生错误")
      console.log(e)
    }
    return token
  },

  globalData: {
    userInfo: null
  }
})
