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

    timeSelecor: {
      "startTime": "11:00",
      "endTime": "14:00"
    },
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
    return {
      "startTime": startTime,
      "endTime": endTime
    }
  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var checkedIndex = e.detail.value
    var timeSelecor = this.limitTimeSelector(checkedIndex)
    this.setData({
      "time.checkedIndex": checkedIndex,
      timeSelecor,
      "time.time": timeSelecor.startTime
    });
  },
  bindDateChange: function (e) {
    this.setData({
      "time.date": e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      "time.time": e.detail.value
    })
  },

  finish() {
    var curaPages = getCurrentPages()
    // console.log(curaPages[curaPages.length - 2])
    var bookingPage = curaPages[curaPages.length - 2]
    bookingPage.setData({
      time: this.data.time
    })
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var time = JSON.parse(options.time)

    var startDate = this.getDateStr(new Date())
    var endDate = this.getDateStr(new Date(), 30)
    //首次打开
    if (time.date == "" && time.time == "") {
      console.log("首次选择时间")
      var curDate = this.getDateStr(new Date(), 2)
      time = {
        date: curDate,
        time: "12:00",
        checkedIndex:0
      }
    }
    this.setData({
      time,
      startDate,
      endDate
    })

  },
  // 求相差 date days 天的日期字符串
  getDateStr(date, days = 0) {
    date.setDate(date.getDate() + days)
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
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

  }

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})