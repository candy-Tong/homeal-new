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

  // 验证登录接口
  checkLoginModule: function (AfterCallback) {
    console.log('AfterCallback is ' + typeof AfterCallback)
    console.log(AfterCallback)

    this.checkSessionModule(AfterCallback)
  },

  checkSessionModule(AfterCallback) {
    var _this = this
    console.log("1.检查原生登录是否有效")
    wx.checkSession({
      success: function (res) {
        // 登录有效
        console.log("1.原生登录有效，getUserInfo不一定成功")
        if (AfterCallback) {
          _this.checkUserInfoModule(AfterCallback)
        } else {
          _this.checkUserInfoModule()
        }

      },
      fail: function (res) {
        // 原生登陆过期，调用login
        console.log("2.登录过期")
        // 尝试授权登录
        wx.login({
          success: function (response) {
            // console.log(response)
            var code = response.code
            if (code) {
              wx.getUserInfo({
                withCredentials: true,
                success: function (resp) {
                  console.log(resp)
                  console.log("2.getUserInfo success")
                  var login_info = {
                    code: code,
                    iv: resp.iv,
                    encrypted_data: resp.encryptedData
                  }
                  _this.loginModule(login_info, AfterCallback)
                },
                // 用户拒绝
                fail() {
                  console.log("2.getUserInfo 失败,用户拒绝授权")
                  if (AfterCallback) {
                    _this.checkUserInfoModule(AfterCallback)
                  } else {
                    _this.checkUserInfoModule()
                  }
                }
              })
            } else {
              console.log('2.没有code，获取用户登录态失败！' + res.errMsg)
            }
          },
          fail: function () {
            console.log("2.login 失败")
          }
        })
      }
    })
  },

  loginModule(login_info, AfterCallback) {
    var _this = this
    console.log(login_info)
    wx.request({
      url: 'https://homeal.com.hk/lrl/api/wechat/mini/user',
      data: {
        js_code: login_info.code,
        iv: login_info.iv,
        encrypted_data: login_info.encrypted_data
      },
      success: function (res) {
        console.log("2.登陆返回")
        console.log(res.data)
        //应该返回token
        try {
          wx.setStorageSync('loginError', "")
          console.log("2.缓存token")
          if (res.data.result.token) {
            console.log("token" + res.data.result.token)
            wx.setStorageSync('token', res.data.result.token)
          } else {
            // 登录服务器错误
            wx.setStorageSync('loginError', "登录过程中服务器端出现错误")
          }


          // 存储是否已绑定手机


        } catch (e) {
          console.log("2.保存token错误,登录失败")
          console.log(e)
          // 登录服务器错误
          wx.setStorageSync('loginError', "登录过程中服务器端出现错误")
        }
        if (AfterCallback) {
          _this.checkUserInfoModule(AfterCallback)
        } else {
          _this.checkUserInfoModule()
        }

      }
    })
  },

  // 检查用户是否授权，不授权无法完整整个登录流程
  checkUserInfoModule(AfterCallback) {
    // 此步骤用于检查登录服务器是否出现错误
    try {
      var loginError = wx.getStorageSync('loginError')
      console.log("loginError:" + loginError)
    } catch (e) {
      console.log("读取loginError信息错误")
    }
    var _this = this
    wx.getSetting({
      success: function (res) {
        console.log(res)
        // 未授权
        if (loginError != "" || res.authSetting["scope.userInfo"] == undefined || res.authSetting["scope.userInfo"] == false) {
          console.log("3.登录验证失败，错误处理")
          wx.hideLoading()
          var pages = getCurrentPages()
          var curPage = pages[pages.length - 1]
          if (!_this.contains(_this.globalData.loginPage, curPage['__route__']))
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
          console.log("4.登录错误回调开始")
          if (typeof AfterCallback == 'object') {
            AfterCallback.forEach(function (item, index, object) {
              if (item.isError && item.func) {
                if (item.parm) {
                  item.func(item.parm)
                } else {
                  item.func()
                }
              }
            })
          }
        } else {
          // 通过授权，登录完成，执行业务
          console.log("3.登录验证成功")
          console.log("4.执行业务")
          if (typeof AfterCallback == 'object') {
            AfterCallback.forEach(function (item, index, object) {
              if (item.func && (item.isError == undefined || item.isError != true)) {
                if (item.parm) {
                  item.func(item.parm)
                } else {
                  item.func()
                }
              }
            })
          }
        }
      },
      fail: function (res) {
        console.log("3.读取设置失败")
      }
    })
  },

  // 检查微信是否绑定手机
  checkBindPhone(){
    try {
      var value = wx.getStorageSync('key')
      if (value) {
        // Do something with return value
        return value
      }else{
        console.log("发生错误，位置手机绑定状态") 
      }
    } catch (e) {
      // Do something when catch error
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

  contains: function (arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) {
        return true;
      }
    }
    return false;
  },

  globalData: {
    userInfo: null,
    // 配置登录页面，在此页面不再弹出登录跳转框
    loginPage: [
      "pages/order/index"
    ]
  }
})
