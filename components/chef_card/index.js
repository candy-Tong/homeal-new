function seeChef(e){
  // console.log(e)
  wx.navigateTo({
    url: '/pages/chef/index?chef_id=' + e.currentTarget.id
  })
}
module.exports.seeChef = seeChef