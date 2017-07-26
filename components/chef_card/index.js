function seeChef(e){
  wx.navigateTo({
    url: '/pages/chef/index?chef_id='+1,
    success: function(res) {},
    fail: function(res) {},
    complete: function(res) {},
  })
}
module.exports.seeChef = seeChef