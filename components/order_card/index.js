function seeOrder(){
  wx.navigateTo({
    url: '/pages/order/detail/index',
    success: function(res) {},
    fail: function(res) {},
    complete: function(res) {},
  });
}

module.exports.seeOrder = seeOrder
