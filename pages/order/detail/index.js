// pages/order/detail/index.js
var app = getApp()
var WebIM = require('../../../utils/WebIM.js')
var WebIM = WebIM.default


Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  contactWithChef(){
    var that = this
    console.log(that.data.order)
    console.log(that.data.order.easemob_username)
    WebIM.conn.addRoster({ 'name': that.data.order.easemob_username })
    var nameList = {
      myName: wx.getStorageSync('easemobUsername'),
      your: that.data.order.easemob_username
    }
    wx.navigateTo({
      url: '../../im/chatroom/chatroom?username=' + JSON.stringify(nameList)
    })
  },
  payMoney(){
    // 付款
    var order_id = this.order_id
    app.payMoney(order_id, function () {
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
    })
  },
  cancelOrder(){
    var order_id = this.order_id
    // 取消订单
    wx.navigateTo({
      url: '/pages/order/delete/index?order_id=' + order_id,
    })
  },


  open: function () {
    var order_id = this.order_id
    var itemList=[]
    var funcList=[]
    if(this.data.order.booking_status==1){
      itemList.push('付款')
      funcList.push(this.payMoney)
    }
    itemList.push('联系私厨')
    itemList.push('取消订单')
    funcList.push(this.contactWithChef)
    funcList.push(this.cancelOrder)
    wx.showActionSheet({
      itemList,
      success: function (res) {
        if (!res.cancel) {
          // if (res.tapIndex == 0) {
          //   funcList[res.tapIndex].call()
            
          // } else if (res.tapIndex == 1) {
          //   // 联系私厨
          //   funcList[res.tapIndex].call()
          // } else if (res.tapIndex == 2) {
           
          // } else {
          //   console.log("ActionSheet发生错误，位置tapIndex")
          // }
          funcList[res.tapIndex].call()
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
    var _this = this
    var order_id = this.order_id
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