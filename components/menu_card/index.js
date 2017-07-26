function booking(e) {
  var _this = this
  // console.log(e)
  wx.navigateTo({
    url: '/pages/booking/index?chef=' + JSON.stringify(_this.data.chef) + '&menuIndex=' + e.currentTarget.id,
    success: function(res) { },
    fail: function (res) { },
    complete: function (res) { },
  })
}
module.exports.booking = booking