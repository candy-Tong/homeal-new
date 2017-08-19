//app.js

App({
  onLaunch: function () {
    var _this = this
    this.autoLogin()
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
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  autoLogin() {
    var _this = this
    // 异步登录
    wx.getStorage({
      key: 'isLogin',
      success: function (res) {
        var isLogin = res.data
        if (isLogin) {
          // Do something with return value
          console.log("读取缓存，已登录")
          wx.login({
            success: function (res) {
              if (res.code) {
                //发起网络请求
                wx.request({
                  url: _this.globalData.baseurl+'wechat/mini/second',
                  data: {
                    js_code: res.code
                  },
                  success(res){
                    console.log(res)
                    _this.updateLoginMsg(res.data)
                  }
                })
              } else {
                console.log('获取用户登录态失败！' + res.errMsg)
              }
            }

          })
          _this.globalData.isLogin = true

        } else {
          console.log("未登录")
        }
      },
      fail(res){
        console.log("获取isLogin失败，未登录")
        console.log(res)
      }
    })
  },

  first_login(e, callbackObject) {
    var _this = this
    var userinfo = e.detail
    wx.login({
      success: function (response) {
        var code = response.code
        if (code) {
          var login_info = {
            code: code,
            iv: userinfo.iv,
            encrypted_data: userinfo.encryptedData
          }
          console.log(userinfo)
          wx.showLoading({
            title: '登录中',
            mask: true
          })
          wx.request({
            url: _this.globalData.baseurl+'wechat/mini/user',
            data: {
              js_code: login_info.code,
              iv: login_info.iv,
              encrypted_data: login_info.encrypted_data
            },
            success: function (res) {
              console.log("2.登陆返回")
              console.log(res.data)

              //更新数据
              _this.updateLoginMsg(res.data, callbackObject)

            },fail(res){
              console.log(res)
              console.log("登录错误,可能是服务器没有回应，或者超时")
              if (typeof callBackObject == 'object') {
                callBackObject.forEach(function (item, index, object) {
                  if (item.isError && item.func) {
                    if (item.parm) {
                      item.func(item.parm)
                    } else {
                      item.func()
                    }
                  }
                })
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
  },

  updateLoginMsg(data, callBackObject) {
    var isError = false
    if (data.result && data.result.token) {
      var token = data.result.token
      console.log(token)
      this.globalData.token = token
    } else {
      isError = true
      console.log("发生错误，token不存在")
    }

    if (isError == false) {
      try {
        wx.setStorageSync('isLogin', true)
        wx.setStorageSync('token', token)
      } catch (e) {
        console.log("缓存isLogin/token发生错误")
      }
      this.globalData.reflashLogin=true
      this.globalData.isLogin = true
      this.globalData.is_phone_bound = data.result.is_phone_bound
      console.log("登录回调开始")
      if (typeof callBackObject == 'object') {
        callBackObject.forEach(function (item, index, object) {
          if (item.func && (item.isError == undefined || item.isError != true)) {
            if (item.parm) {
              item.func(item.parm)
            } else {
              item.func()
            }
          }
        })
      }
    } else if (isError == true) {
      console.log("登录错误回调开始")
      if (typeof callBackObject == 'object') {
        callBackObject.forEach(function (item, index, object) {
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
      console.log("isError出现特殊情况，位置updateLoginMsg")
    }

  },

  checkLogin(callBackObject) {
    var isLogin = this.globalData.isLogin
    if (isLogin && isLogin == true) {
      //已登录
      console.log("已登录，回调开始")
      if (typeof callBackObject == 'object') {
        callBackObject.forEach(function (item, index, object) {
          if (item.func && (item.isError == undefined || item.isError != true)) {
            if (item.parm) {
              item.func(item.parm)
            } else {
              item.func()
            }
          }
        })
      }

    } else {
      //未登录
      console.log("未登录，错误处理回调开始")
      callBackObject.forEach(function (item, index, object) {
        if (item.isError && item.func) {
          if (item.parm) {
            item.func(item.parm)
          } else {
            item.func()
          }
        }
      })
    }
  },


// 很可能会放弃使用，但目前很多还是依赖这个
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
    baseurl:'http://39.108.117.116/api/',
    // staticResUrl:"http://119.29.162.17/homeal/icon/",
    userInfo: null,
    reflashOrder:false,
    reflashLogin:false
  }
})
