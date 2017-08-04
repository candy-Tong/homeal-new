// pages/order/index.js
var order_card = require("../../components/order_card/index.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["待付款", "进行中", "历史订单"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    isLogin: true
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  deleteOrder(e){
    
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
          _this.getOrder()
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
    app.checkLogin(callback)

    // test
    wx.showModal({
      content: '此界面只能查询订单和取消订单，付款没有完成',
      showCancel: false
    });
  },

  getOrder() {
    var _this = this
    wx.showLoading({
      title: '加载中',
    })
    if (app.globalData.token) {
      var token = app.globalData.token
    } else {
      // 如果全局变量没有加载完成，读取缓存中的token
      var token = app.getToken()
    }
    // 查询订单
    wx.request({
      url: 'https://homeal.com.hk/lrl/api/booking',
      header: {
        token: token
      },
      success(res) {
        console.log(res)
        _this.setData({
          order: res.data.result.reverse(),
          isLogin: true
        })
        wx.hideLoading()
      }
    })
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
            if (app.globalData.is_phone_bound) {
              // 已绑定手机
              _this.getOrder()
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(app.globalData.refalshLogin){
      // 在其他页面登录，需要刷新界面
      _this.setData({
        isLogin: true
      })
      _this.getOrder()
    }
    if (app.globalData.reflashOrder){
      var _this = this
      var callback = [
        {
          func: function () {
            _this.setData({
              isLogin: true
            })
            _this.getOrder()
            app.globalData.reflashOrder=false
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
      app.checkLogin(callback)
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
    var _this = this
    var callback = [
      {
        func: function () {
          _this.setData({
            isLogin: true
          })
          _this.getOrder()
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
    app.checkLogin(callback)
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