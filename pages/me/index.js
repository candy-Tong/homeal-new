// pages/me/index.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  handelLogin:function(e){
    wx.showLoading({
      title: '登录中',
      mask: true,
    })
  },

  bindgetuserinfo(e){
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
            app.getUserInfo(function (userInfo) {
              //更新数据
              _this.setData({
                userInfo: userInfo,
                isLogin: true
              })
            })
            if (app.globalData.is_phone_bound) {
              // 已绑定手机
              // 个人界面无操作
            } else {
              // 未绑定手机
              wx.showModal({
                content: '未绑定手机，是否现在绑定',
                showCancel: true,
                confirmColor: "#E64340",
                success(res) {
                  if (res.confirm == true) {
                    wx.navigateTo({
                      url: '/pages/me/bindphone/index',
                    })
                  }
                }
              })
            }
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
      app.first_login(e, callback)

    } else {
      console.log("发生错误，bindgetuserinfo出现其他状况")
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

 
    var _this = this
    var callback = [
      {
        func: function () {
          //调用应用实例的方法获取全局数据
          app.getUserInfo(function (userInfo) {
            //更新数据
            _this.setData({
              userInfo: userInfo,
              isLogin: true
            })
          })
        }
      },
    ]
    // 检查是否登录
    app.checkLogin(callback)

    // 检查是否绑定手机
    if (app.globalData.is_phone_bound) {
     this.setData({
       is_phone_bound: true
     })
    }else{
      this.setData({
        is_phone_bound: false
      })
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
    var _this=this
    if(app.globalData.reflashLogin){
      // 在其他界面登录了，重新刷新登录信息
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function (userInfo) {
        //更新数据
        _this.setData({
          userInfo: userInfo,
          isLogin: true
        })
      })
    }
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
  
  },
})