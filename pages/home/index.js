// pages/home/index.js
var app=getApp()
var chef_card = require('../../components/chef_card/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  pageSize: 10,
  // 预加载cache
  cache: {},
  // 防止加载过快发生错误
  cacheLock: false,
  curPage: 1,
  seeChef: chef_card.seeChef,


  // 查看图片
  previewImage: function (e) {
    console.log(e)
    var imageUrl = e.currentTarget.dataset.url
    var index = e.currentTarget.id
    wx.previewImage({
      current: imageUrl, // 当前显示图片的http链接
      urls: this.data.chef_cards[index].maingrid_photo_url // 需要预览的图片http链接列表
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this

    wx.request({
      url: app.globalData.baseurl +'miscel/banner',
      success(res) {
        // console.log(res)
        var banner = res.data.result
        _this.setData({
          banner: res.data.result
        })
      }
    })
    _this.cacheLock = true
    wx.request({
      url: app.globalData.baseurl +'miscel/maingrid',
      data: {
        page: 1,
        count: this.pageSize
      },
      success(res) {
        _this.setData({
          chef_cards: res.data.result
        })
        // 预加载
        _this.curPage++
        wx.request({
          url: app.globalData.baseurl +'miscel/maingrid',
          data: {
            page: _this.curPage,
            count: _this.pageSize
          },
          success(res) {
            _this.cache = res.data.result
            console.log("cache:")
            console.log(_this.cache)
            if (_this.cache.length != 0) {
              _this.curPage++
            }
            _this.cacheLock = false
            console.log(_this.curPage)
          }
        })
      }
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
    var _this = this
    this.curPage = 1
    wx.request({
      url: app.globalData.baseurl +'miscel/banner',
      success(res) {
        // console.log(res)
        var banner = res.data.result
        _this.setData({
          banner: res.data.result
        })
      }
    })
    _this.cacheLock = true
    wx.request({
      url: app.globalData.baseurl +'miscel/maingrid',
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
      url: app.globalData.baseurl +'miscel/maingrid',
      data: {
        page: this.curPage,
        count: this.pageSize
      },
      success(res) {
        _this.cache = res.data.result
        console.log(_this.cache)
        if (_this.cache.length != 0) {
          _this.curPage++
        }
        _this.cacheLock = false
        console.log(_this.curPage)
      },
      fail(res) {
        _this.cache = []
        console.log("加载新的chef_card失败")
        _this.cacheLock = false
      }
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this
    var chef_cards = this.data.chef_cards
    if (chef_cards && this.cache) {
      chef_cards = chef_cards.concat(this.cache)
      this.cache = []

      this.setData({
        chef_cards
      })
      if (_this.cacheLock) {
        console.log("上次加载未完成")
        return
      }
      _this.cacheLock = true
      wx.request({
        url: app.globalData.baseurl +'miscel/maingrid',
        data: {
          page: this.curPage,
          count: this.pageSize
        },
        success(res) {
          _this.cache = res.data.result
          console.log(_this.cache)
          if (_this.cache.length != 0) {
            _this.curPage++
          }
          _this.cacheLock = false
          console.log(_this.curPage)
        },
        fail(res) {
          _this.cache = []
          console.log("加载新的chef_card失败")
          _this.cacheLock = false
        }
      })
    } else {
      console.log("页面未加载完毕")
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})