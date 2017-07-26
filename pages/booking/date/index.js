// pages/booking/date/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [
      { name: '午餐', value: '0', instruction: "11:00-14:00" },
      { name: '晚餐', value: '1', instruction: "17:00-20:00" }
    ],
    time: "12:00",
    timeSelecor:{
      "startTime": "11:00",
      "endTime": "14:00"
    },
    checkedIndex: 0
  },

  // 根据午餐、晚餐设定时间选择范围
  limitTimeSelector(index) {
    var startTime, endTime
    if (index == 0) {
      startTime = "11:00"
      endTime = "14:00"
    } else if (index == 1) {
      startTime = "17:00"
      endTime = "20:00"
    }
    return{
      "startTime": startTime,
      "endTime": endTime
    }
  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var checkedIndex = e.detail.value
    var timeSelecor=this.limitTimeSelector(checkedIndex)
    this.setData({
      checkedIndex,
      timeSelecor,
      time: timeSelecor.startTime
    });
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  finish() {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var dateObject=new Date()
      // 预约时间默认设置为后天
      dateObject.setDate(dateObject.getDate() + 2);
      var date = dateObject.getFullYear()+"-"+(dateObject.getMonth()+1)+"-"+dateObject.getDate()
      this.setData({
        date
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