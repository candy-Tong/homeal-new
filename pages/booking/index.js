// pages/booking/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: {
      menu: "/image/icon_menu.png",
      people: "/image/icon_people.png",
      date: "/image/icon_date.png"
    },
    date: "选择日期",
    time:"",
    peopleIndex: 0,
  },

  bindPhoneInput(e) {
    // console.log(e)
    this.setData({
      phone: e.detail.value
    })
  },

  getPrice(menu_price, peopleSelector, menuIndex, peopleIndex) {
    var people = peopleSelector[menuIndex][peopleIndex]
    var cost = menu_price[menuIndex].find(function (value, index, array) {
      return value.people == people
    }).cost
    return cost
  },

  bindMenuChange: function (e) {
    console.log('picker menu 发生选择改变，携带值为', e.detail.value);
    this.getPrice(this.data.menu_price, this.data.peopleSelector, e.detail.value, 0)
    this.setData({
      menuIndex: e.detail.value,
      peopleIndex: 0
    })
  },

  bindPeopleChange: function (e) {
    console.log('picker people 发生选择改变，携带值为', e.detail.value);
    this.getPrice(this.data.menu_price, this.data.peopleSelector, this.data.menuIndex, e.detail.value)
    this.setData({
      peopleIndex: e.detail.value
    })
  },

  orderSubmit() {
    
    var token
    wx.request({
      url: 'http://homeal.com.hk/lrl/api/booking_rest/booking',
      method: 'POST',
      data: {
        "phone": this.data.phone,
        "token": token,
        "chef_id": chef_id,
        "menus": menus,
        "meal_time": meal_time,
        "booking_notice": booking_notice
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {

        wx.redirectTo({
          url: '/pages/booking/submit/index?chef_id=' + this.data.chef.chef_id
        })
      }
    })



  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)

    // 构建选择套餐和人数的数组
    var menuSelector = []
    var peopleSelector = []
    var chef = JSON.parse(options.chef)
    chef.menus.forEach(function (value, index, array) {
      menuSelector.push(value.menu_name)
      var people = []
      for (var i = value.min_people; i <= value.max_people; i++) {
        people.push(i)
      }
      peopleSelector.push(people)
    })
    // 套餐-人数 价格二维数组
    var menu_price = []
    chef.menus.forEach(function (value, index, array) {
      menu_price.push(value.menu_price)
    })
    var cost = this.getPrice(menu_price, peopleSelector, options.menuIndex, 0)

    this.setData({
      menuIndex: options.menuIndex,
      chef,
      menus: chef.menus,
      menuSelector,
      peopleSelector,
      menu_price,
      cost
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})