// pages/home/index.js
var chef_card = require('../../components/chef_card/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  pageSize: 2,
  // 预加载cache
  cache: {},
  curPage: 1,
  seeChef: chef_card.seeChef,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this

    wx.request({
      url: 'http://homeal.com.hk/lrl/api/miscel/banner',
      success(res) {
        // console.log(res)
        var banner = res.data.result
        _this.setData({
          banner: res.data.result
        })
      }
    })
    wx.request({
      url: 'http://homeal.com.hk/lrl/api/miscel/maingrid',
      data: {
        page: 1,
        count: this.pageSize
      },
      success(res) {
        _this.setData({
          chef_cards: res.data.result
        })
      }
    })
    this.curPage++
    wx.request({
      url: 'http://homeal.com.hk/lrl/api/miscel/maingrid',
      data: {
        page: this.curPage,
        count: this.pageSize
      },
      success(res) {
        _this.cache = res.data.result
      }
    })
    this.curPage++
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
    var _this = this
    this.curPage = 1
    wx.request({
      url: 'http://homeal.com.hk/lrl/api/miscel/maingrid',
      data: {
        page: 1,
        count: this.pageSize
      },
      success(res) {
        _this.setData({
          chef_cards: res.data.result
        })
        wx.stopPullDownRefresh()
      }
    })
    this.curPage++
    wx.request({
      url: 'http://homeal.com.hk/lrl/api/miscel/maingrid',
      data: {
        page: this.curPage,
        count: this.pageSize
      },
      success(res) {
        _this.cache = res.data.result
      }
    })
    this.curPage++
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this
    var chef_cards = this.data.chef_cards
    chef_cards=chef_cards.concat(this.cache)
    
    this.setData({
      chef_cards
    })
    wx.request({
      url: 'http://homeal.com.hk/lrl/api/miscel/maingrid',
      data: {
        page: this.curPage,
        count: this.pageSize
      },
      success(res) {
        _this.cache = res.data.result
      }
    })
    this.curPage++
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})