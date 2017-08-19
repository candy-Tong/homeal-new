// pages/order/detail/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  open: function () {
    var order_id=this.order_id
    wx.showActionSheet({
      itemList: ['付款', '联系私厨', '取消订单'],
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            // 付款
          } else if (res.tapIndex==1) {
            // 联系私厨
          } else if (res.tapIndex==2) {
            // 取消订单

            wx.navigateTo({
              url: '/pages/order/delete/index?order_id='+order_id,
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
      url: app.globalData.baseurl +'booking/' + order_id,
      header: {
        token: token
      },
      success(res) {
        console.log(res)
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