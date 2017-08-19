// pages/order/delete/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reasonLength: 0
  },
  reason: "",

  getReason(e) {
    this.reason = e.detail.value
    this.setData({
      reasonLength: e.detail.value.length
    })
  },

  deleteOrder(e) {
    var _this = this
    var order_id = this.order_id
    var token = app.globalData.token
    var reason = this.reason
    if(!reason||reason.length==0){
      wx.showModal({
        content: '原因不能为空',
        showCancel:false
      })
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.baseurl +'booking/' + order_id + "?reason=" + reason,
      header: {
        token: token
      },
      method: "DELETE",
      success(res) {
        console.log(res)
        if(res.data.result=="success"){
          app.globalData.reflashOrder = true
          wx.switchTab({
            url: '/pages/order/index',
          })
        }else{
          console.log("发生错误，删除失败，可能是服务器问题")
        }
      },
      fail(res){
        console.log("删除失败，可能是请求失调了")
        console.log(res)
      },
      complete(res){
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("确定后删除booking_id为"+options.order_id)
    this.order_id = options.order_id
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