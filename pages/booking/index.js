// pages/booking/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: {
      menu: "/image/icon_menu.png",
      people: "/image/icon_people.png",
      date: "/image/icon_date.png"
    },

    menu: ["套餐一", "套餐二", "套餐三"],
    menuIndex: 0,

    people: [1, 2, 3, 4, 5, 6, 7, 8],
    peopleIndex: 2,
  },

  bindMenuChange: function (e) {
    console.log('picker menu 发生选择改变，携带值为', e.detail.value);

    this.setData({
      menuIndex: e.detail.value
    })
  },

  bindPeopleChange: function (e) {
    console.log('picker people 发生选择改变，携带值为', e.detail.value);

    this.setData({
      peopleIndex: e.detail.value
    })
  },

  orderSubmit() {
    wx.redirectTo({
      url: '/pages/booking/submit/index'
    })
  },

 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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