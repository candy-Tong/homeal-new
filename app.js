//app.js
App({
  onLaunch: function () {
    var _this = this
    
    // this.checkSession();
    
    // this.getUserInfo(function (userInfo) {
    //   //更新数据
    //   _this.setData({
    //     userInfo: userInfo
    //   })
    // })
    // this.testLogin()



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

        // _this.login()

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
        console.log(response)

        var code = response.code
        if (code) {
          wx.getUserInfo({
            withCredentials: true,
            success: function (resp) {
              console.log(code + '\n' + resp.encryptedData + '\n' + resp.iv)
              
              wx.request({
                // url:"https://candycute.cn/idea/advanced/frontend/web/index.php",
                url: 'http://homeal.com.hk/lrl/api/wechat/mini/user',
                data: {
                  js_code: code,
                  iv: resp.iv,
                  encrypted_data: resp.encryptedData
                },
                success: function (res) {
                  console.log("登陆返回")
                  console.log(res.data)
                  //应该返回token
                  _this.saveToken(res.data.result.token)
                  
                  if (callback) {
                    callback()
                  }
                }
              })
            },
            fail(){
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

  saveToken(token){
    try {
      console.log("缓存token")
      wx.setStorageSync('token', token)
    } catch (e) {
      console.log("保存token错误")
      console.log(e)
    }
  },

  testLogin(){
    wx.login({
      success(res){
        console.log(res)
      }
    })
  },

  getToken(){
    try {
      var token = wx.getStorageSync('token')
      if (token) {
        // Do something with return value
        // console.log("token:"+token)
      }else{
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
