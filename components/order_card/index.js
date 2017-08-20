require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js').default

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
  var options = {
    apiUrl: WebIM.config.apiURL,
    user: '29837123984',
    pwd: '29837123984',
    grant_type: 'password',
    appKey: WebIM.config.appkey
  }
  wx.setStorage({
    key: "myUsername",
    data: '29837123984'
  })
  //console.log('open')
  WebIM.conn.open(options, function (userId) {
    setTimeout(function () {
      wx.redirectTo({
        url: '/pages/im/main/main?myName=' + userId
      })
    }, 1000);
  })

}

module.exports.contactWithChef = contactWithChef
module.exports.seeOrder = seeOrder

