// pages/order/detail/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  open: function () {
    var order_id = this.order_id
    wx.showActionSheet({
      itemList: ['付款', '联系私厨', '取消订单'],
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            // 付款
            var token = app.globalData.token
            wx.request({
              url: app.globalData.baseurl + 'booking/get-outtradeno?bookingid=' + order_id,
              header: {
                token: token
              },
              success(res) {
                if (app.globalData.showError && res.statusCode != '200') {
                  var errorMsg
                  if (res.data.error_msg) {
                    errorMsg = res.data.error_msg
                  } else {
                    errorMsg = '未知错误'
                  }
                  errorMsg += res.statusCode
                  app.showError(errorMsg)
                  return
                }
                const outTradeNo = res.data.result.out_trade_no
                console.log(res.data.result.out_trade_no)

                wx.request({
                  url: app.globalData.baseurl + 'wechat/unified-order',
                  method: 'post',
                  header: {
                    token: token
                  },
                  data: {
                    'order': res.data.result.out_trade_no
                  },
                  success(res) {
                    if (app.globalData.showError && res.statusCode != '200') {
                      var errorMsg
                      if (res.data.error_msg) {
                        errorMsg = res.data.error_msg
                      } else {
                        errorMsg = '未知错误'
                      }
                      errorMsg += res.statusCode
                      app.showError(errorMsg)
                      return
                    }
                    console.log(res.data.result)
                    wx.requestPayment({
                      'timeStamp': String(res.data.result.timeStamp),
                      'nonceStr': res.data.result.nonceStr,
                      'package': res.data.result.package,
                      'signType': res.data.result.signType,
                      'paySign': res.data.result.sign,
                      'success': function (res) {

                        wx.request({
                          url: app.globalData.baseurl + 'wechat/get-order-status?order=' + outTradeNo,
                          header: {
                            token: token
                          },
                          success(res){
                            if (app.globalData.showError && res.statusCode != '200') {
                              var errorMsg
                              if (res.data.error_msg) {
                                errorMsg = res.data.error_msg
                              } else {
                                errorMsg = '未知错误'
                              }
                              errorMsg += res.statusCode
                              app.showError(errorMsg)
                              return
                            }

                            if (res.data.result.paid == 0)
                            {
                              app.showError('支付未成功，请到订单页面确认')
                            }
                            else{
                              wx.showModal({
                                title: '支付成功',
                                content: '家厨将尽快确认您的订单',
                                showCancel: false,
                                success: function (res) {
                                  // if (res.confirm) {
                                  //   console.log('用户点击确定')
                                  // } else if (res.cancel) {
                                  //   console.log('用户点击取消')
                                  // }
                                }
                              })
                            }
                          }
                        })

                      },
                      'fail': function (res) {
                        console.log('failed', res)
                        app.showError(res.errMsg)
                      }
                    })
                  }
                })

              }
            })
          } else if (res.tapIndex == 1) {
            // 联系私厨
          } else if (res.tapIndex == 2) {
            // 取消订单

            wx.navigateTo({
              url: '/pages/order/delete/index?order_id=' + order_id,
            })
          } else {
            console.log("ActionSheet发生错误，位置tapIndex")
          }
        }
      }
    });
  },

  goChef(e) {
    console.log(e.currentTarget.id)
    wx.navigateTo({
      url: '/pages/chef/index?chef_id=' + e.currentTarget.id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    console.log(options.order_id)
    var order_id = options.order_id
    var token = app.globalData.token
    wx.request({
      url: app.globalData.baseurl + 'booking/' + order_id,
      header: {
        token: token
      },
      success(res) {
        console.log(res)
        if (app.globalData.showError && res.statusCode != '200') {
          var errorMsg
          if (res.data.error_msg) {
            errorMsg = res.data.error_msg
          } else {
            errorMsg = '未知错误'
          }
          errorMsg += res.statusCode
          app.showError(errorMsg)
          return
        }
        _this.setData({
          order: res.data.result
        })
      }
    })
    this.order_id = order_id
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

  // /**
  //  * 页面相关事件处理函数--监听用户下拉动作
  //  */
  // onPullDownRefresh: function () {

  // },

  // /**
  //  * 页面上拉触底事件的处理函数
  //  */
  // onReachBottom: function () {

  // },

  // 不允许转发
  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})