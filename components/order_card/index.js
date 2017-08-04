function seeOrder(e){
  console.log(e.currentTarget.id)
  var index = e.currentTarget.id
  var order = this.data.order[index]
  console.log(order)
  wx.navigateTo({
    url: '/pages/order/detail/index?order_id='+order.booking_id
  });
}

module.exports.seeOrder = seeOrder
