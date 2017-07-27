function seeChef(e){
  console.log(e)
  wx.navigateTo({
    url: '/pages/chef/index?chef_id=' + e.currentTarget.id,
    success: function(res) {},
    fail: function(res) {},
    complete: function(res) {},
  })
}
module.exports.seeChef = seeChef