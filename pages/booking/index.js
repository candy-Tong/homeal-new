// pages/booking/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // icon: {
    //   menu: "/image/icon_menu.png",
    //   people: "/image/icon_people.png",
    //   date: "/image/icon_date.png"
    // },
    time: {
      date: "",
      time: ""
    },
    phone: "",
    booking_notice: "",
    peopleIndex: 0,

  },
  // 是否可以提交booking
  canSubmit: true,

  bindChooseDate(e) {
    var time = JSON.stringify(this.data.time)
    wx.navigateTo({
      url: '/pages/booking/date/index?time=' + time
    })
  },

  bindPhoneInput(e) {
    // console.log(e)
    this.setData({
      phone: e.detail.value
    })
  },
  bindNoticeInput(e) {
    // console.log(e.detail.value)
    this.setData({
      booking_notice: e.detail.value
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

  orderSubmit(e) {
    var _this = this
    wx.showLoading({
      title: '提交中',
      mask: true
    })

    var callback = [{
      func: function () {
        var time = _this.data.time
        if (time.date == "" && time.time == "") {
          wx.showModal({
            content: '请选择时间',
            showCancel: false
          });
          wx.hideLoading()
          return
        } else {
          var meal_time = time.date + " " + time.time + ":00"
        }
        if (_this.data.phone == "") {
          wx.showModal({
            content: '请填写手机号',
            showCancel: false
          });
          wx.hideLoading()
          return
        } else {
          var phone = _this.data.phone

        }
        if (_this.data.phone.length != 10 && _this.data.phone.length != 11) {
          wx.showModal({
            content: '请填写正确手机号',
            showCancel: false
          });
          wx.hideLoading()
          return
        }

        var form_id = e.detail.formId
       
        var token = app.getToken()
        var menus = {
          menu_id: _this.data.menus[_this.data.menuIndex].menu_id,
          people_no: _this.data.peopleSelector[_this.data.menuIndex][_this.data.peopleIndex]
        }
        var chef_id = _this.data.chef.chef_id
        var booking_notice = _this.data.booking_notice

        console.log("form_id:",form_id)
        console.log("meal_time:" + meal_time)
        console.log("phone:" + phone)
        console.log("token:" + token)
        console.log("chef_id:" + chef_id)
        console.log(menus)
        console.log("booking_notice:" + booking_notice)

        wx.request({
          url: 'https://homeal.com.hk/lrl/api/booking',
          method: 'POST',
          data: {
            "phone": phone,
            "token": token,
            "chef_id": chef_id,
            "menus": [menus],
            "meal_time": meal_time,
            "booking_notice": booking_notice,
            "is_mini": 1,
            "form_id": form_id
          },
          header: {
            'content-type': 'application/json'
          },
          success(res) {
            wx.hideLoading()
            _this.canSubmit = true
            console.log(res)
            if(res.data.result){

            }else{
              console.log("订单提交出现错误")
            }
            if (res.data.is_error) {
              if (res.data.error_msg == "phone is invalid") {
                wx.showModal({
                  content: '手机号不合法',
                  showCancel: false
                });
              }
              console.log("允许提交订单")
              return
            }

            // wx.redirectTo({
            //   url: '/pages/booking/submit/index?order_no=' + res.data.result.order_no
            // })
          },
          fail(res) {
            wx.hideLoading()
            console.log("booking发送错误")
            console.log(res)
          }
        })
      }
    }, {
      isError: true,
      func: function () {
        wx.hideLoading()
        console.log("错误处理，隐藏loading")
      }
    }]
    app.checkLoginModule(callback)


    
  },

  booking(that) {
    var _this = that

    var time = _this.data.time
    if (time.date == "" && time.time == "") {
      wx.showModal({
        content: '请选择时间',
        showCancel: false
      });
      wx.hideLoading()
      return
    } else {
      var meal_time = time.date + " " + time.time + ":00"
    }
    if (_this.data.phone == "") {
      wx.showModal({
        content: '请填写手机号',
        showCancel: false
      });
      wx.hideLoading()
      return
    } else {
      var phone = _this.data.phone

    }
    var token = app.getToken()
    var menus = {
      menu_id: _this.data.menus[_this.data.menuIndex].menu_id,
      people_no: _this.data.peopleSelector[_this.data.menuIndex][_this.data.peopleIndex]
    }
    var chef_id = _this.data.chef.chef_id
    var booking_notice = _this.data.booking_notice

    console.log("meal_time:" + meal_time)
    console.log("phone:" + phone)
    console.log("token:" + token)
    console.log("chef_id:" + chef_id)
    console.log(menus)
    console.log("booking_notice:" + booking_notice)

    wx.request({
      url: 'https://homeal.com.hk/lrl/api/booking',
      method: 'POST',
      data: {
        "phone": phone,
        "token": token,
        "chef_id": chef_id,
        "menus": [menus],
        "meal_time": meal_time,
        "booking_notice": booking_notice
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        wx.hideLoading()
        _this.canSubmit = true
        console.log(res)
        if (res.data.is_error) {
          if (res.data.error_msg == "phone is invalid") {
            wx.showModal({
              content: '手机号不合法',
              showCancel: false
            });
          }
          console.log("允许提交订单")
          return
        }

        wx.redirectTo({
          url: '/pages/booking/submit/index?order_no=' + res.data.result.order_no
        })
      },
      fail(res) {
        wx.hideLoading()
        console.log("booking发送错误")
        console.log(res)
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