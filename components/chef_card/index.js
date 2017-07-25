function seeChef(){
  wx.navigateTo({
    url: '/pages/chef/index',
    success: function(res) {},
    fail: function(res) {},
    complete: function(res) {},
  })
}
module.exports.seeChef = seeChef