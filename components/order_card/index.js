require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js').default
var app = getApp()

function seeOrder(e) {
  console.log(e.currentTarget.id)
  var index = e.currentTarget.id
  var order = this.data.order[index]
  console.log(order)
  wx.navigateTo({
    url: '/pages/order/detail/index?order_id=' + order.booking_id
  });
}

// 联系私厨
function contactWithChef(e) {
  var that = this
  console.log(e.currentTarget.dataset.easemobUsername)
  WebIM.conn.addRoster({ 'name': e.currentTarget.dataset.easemobUsername })
  var nameList = {
    myName: wx.getStorageSync('easemobUsername'),
    your: e.currentTarget.dataset.easemobUsername
  }
  wx.navigateTo({
    url: '../im/chatroom/chatroom?username=' + JSON.stringify(nameList)
  })
}

function payMoney(e) {
  app.payMoney(e.currentTarget.dataset.orderId, function () {
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
}

module.exports.contactWithChef = contactWithChef
module.exports.seeOrder = seeOrder
module.exports.payMoney = payMoney

