// pages/order/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    },

  open: function () {
    wx.showActionSheet({
      itemList: ['付款', '联系私厨', '取消订单'],
      success: function (res) {
        if (!res.cancel) {
          console.log(res.tapIndex)
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this
    console.log(options.order)
    var order = JSON.parse(options.order)
    wx.request({
      url: 'https://homeal.com.hk/lrl/api/chef/' + order.chef_id,
      success(res) {
        var chef = res.data.result
        var menu=chef.menus.find(function(value){
          return value.menu_id == order.menus[0].menu_id
        })
        _this.setData({
          chef,
          order,
          menu
        })
      }
    })
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