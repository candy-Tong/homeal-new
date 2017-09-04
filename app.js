//app.js
require('./utils/strophe.js')
var WebIM = require('./utils/WebIM.js').default

App({
  getRoomPage: function () {
    return this.getPage("pages/im/chatroom/chatroom")
  },
  getPage: function (pageName) {
    var pages = getCurrentPages()
    return pages.find(function (page) {
      return page.__route__ == pageName
    })
  },
  onLaunch: function () {
    var _this = this
    var that = this
    this.autoLogin()
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 接入环信demo
    WebIM.conn.listen({
      onOpened: function (message) {
        //WebIM.conn.setPresence()
        console.log("***** onOpened *****")
      },
      onPresence: function (message) {
        switch (message.type) {
          case "unsubscribe":
            pages[0].moveFriend(message);
            break;
          case "subscribe":
            if (message.status === '[resp:true]') {
              return
            } else {
              pages[0].handleFriendMsg(message)
            }
            break;
          case "joinChatRoomSuccess":
            wx.showToast({
              title: "JoinChatRoomSuccess",
            });
            break;
          case "memberJoinChatRoomSuccess":
            wx.showToast({
              title: "memberJoinChatRoomSuccess",
            });
            break;
        }
      },
      onRoster: function (message) {
        var pages = getCurrentPages()
        if (pages[0]) {
          pages[0].onShow()
        }
      },
      onReceivedMessage: function(message) {
        console.log("***** onReceivedMessage *****")
      },
      onVideoMessage: function (message) {
        console.log('onVideoMessage: ', message);
        var page = that.getRoomPage()
        if (message) {
          if (page) {
            page.receiveVideo(message, 'video')
          } else {
            var chatMsg = that.globalData.chatMsg || []
            var time = WebIM.time()
            var msgData = {
              info: {
                from: message.from,
                to: message.to
              },
              username: message.from,
              yourname: message.from,
              msg: {
                type: 'video',
                data: message.url
              },
              style: '',
              time: time,
              mid: 'video' + message.id
            }
            msgData.style = ''
            chatMsg = wx.getStorageSync(msgData.yourname + message.to) || []
            chatMsg.push(msgData)
            wx.setStorage({
              key: msgData.yourname + message.to,
              data: chatMsg,
              success: function () {
                //console.log('success')
              }
            })
          }
        }
      },

      onAudioMessage: function (message) {
        console.log('onAudioMessage', message)
        var page = that.getRoomPage()
        console.log(page)
        if (message) {
          if (page) {
            page.receiveMsg(message, 'audio')
          } else {
            var chatMsg = that.globalData.chatMsg || []
            var value = WebIM.parseEmoji(message.data.replace(/\n/mg, ''))
            var time = WebIM.time()
            var msgData = {
              info: {
                from: message.from,
                to: message.to
              },
              username: message.from,
              yourname: message.from,
              msg: {
                type: 'audio',
                data: value
              },
              style: '',
              time: time,
              mid: 'audio' + message.id
            }
            console.log("Audio msgData: ", msgData);
            chatMsg = wx.getStorageSync(msgData.yourname + message.to) || []
            chatMsg.push(msgData)
            wx.setStorage({
              key: msgData.yourname + message.to,
              data: chatMsg,
              success: function () {
                //console.log('success')
              }
            })
          }
        }
      },

      onLocationMessage: function (message) {
        console.log("Location message: ", message);
      },

      onTextMessage: function (message) {
        console.log("***** onTextMessage *****")
        var page = that.getRoomPage()
        console.log("onTextMessage: " , page)
        if (message) {
          if (page) {
            page.receiveMsg(message, 'txt')
          } else {
            var chatMsg = that.globalData.chatMsg || []
            var value = WebIM.parseEmoji(message.data.replace(/\n/mg, ''))
            var time = WebIM.time()
            var msgData = {
              info: {
                from: message.from,
                to: message.to
              },
              username: message.from,
              yourname: message.from,
              msg: {
                type: 'txt',
                data: value
              },
              style: '',
              time: time,
              mid: 'txt' + message.id
            }
            chatMsg = wx.getStorageSync(msgData.yourname + message.to) || []
            chatMsg.push(msgData)
            wx.setStorage({
              key: msgData.yourname + message.to,
              data: chatMsg,
              success: function () {
                //console.log('success')
              }
            })
          }
        }
      },
      onEmojiMessage: function (message) {
        //console.log('onEmojiMessage',message)
        var page = that.getRoomPage()
        //console.log(pages)
        if (message) {
          if (page) {
            page.receiveMsg(message, 'emoji')
          } else {
            var chatMsg = that.globalData.chatMsg || []
            var time = WebIM.time()
            var msgData = {
              info: {
                from: message.from,
                to: message.to
              },
              username: message.from,
              yourname: message.from,
              msg: {
                type: 'emoji',
                data: message.data
              },
              style: '',
              time: time,
              mid: 'emoji' + message.id
            }
            msgData.style = ''
            chatMsg = wx.getStorageSync(msgData.yourname + message.to) || []
            chatMsg.push(msgData)
            //console.log(chatMsg)
            wx.setStorage({
              key: msgData.yourname + message.to,
              data: chatMsg,
              success: function () {
                //console.log('success')
              }
            })
          }
        }
      },
      onPictureMessage: function (message) {
        //console.log('Picture',message);
        var page = that.getRoomPage()
        if (message) {
          if (page) {
            //console.log("wdawdawdawdqwd")
            page.receiveImage(message, 'img')
          } else {
            var chatMsg = that.globalData.chatMsg || []
            var time = WebIM.time()
            var msgData = {
              info: {
                from: message.from,
                to: message.to
              },
              username: message.from,
              yourname: message.from,
              msg: {
                type: 'img',
                data: message.url
              },
              style: '',
              time: time,
              mid: 'img' + message.id
            }
            msgData.style = ''
            chatMsg = wx.getStorageSync(msgData.yourname + message.to) || []
            chatMsg.push(msgData)
            wx.setStorage({
              key: msgData.yourname + message.to,
              data: chatMsg,
              success: function () {
                //console.log('success')
              }
            })
          }
        }
      },
      // 各种异常
      onError: function (error) {
        // 16: server-side close the websocket connection
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_DISCONNECTED) {
          if (WebIM.conn.autoReconnectNumTotal < WebIM.conn.autoReconnectNumMax) {
            return;
          }

          wx.showToast({
            title: 'server-side close the websocket connection',
            duration: 1000
          });
          wx.redirectTo({
            url: '../login/login'
          });
          return;
        }

        // 8: offline by multi login
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR) {
          wx.showToast({
            title: 'offline by multi login',
            duration: 1000
          })
          wx.redirectTo({
            url: '../login/login'
          })
          return;
        }
      },
    })
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: true,
        success: function (res) {
          console.log("User Info", res)
          wx.setStorageSync('myUsername')
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        },
      })
    }
  },

  autoLogin() {
    var _this = this
    // 异步登录
    wx.getStorage({
      key: 'isLogin',
      success: function (res) {
        var isLogin = res.data
        if (isLogin) {
          // Do something with return value
          console.log("读取缓存，已登录")
          wx.login({
            success: function (res) {
              console.log(res)
              if (res.code) {
                //发起网络请求
                wx.request({
                  url: _this.globalData.baseurl + 'wechat/mini/second',
                  data: {
                    js_code: res.code
                  },
                  success(res) {
                    if (_this.globalData.showError && res.statusCode != '200') {
                      var errorMsg
                      if (res.data.error_msg) {
                        errorMsg = res.data.error_msg
                      } else {
                        errorMsg = '未知错误'
                      }
                      errorMsg += res.statusCode
                      app.showError(errorMsg)
                      return
                    }
                    console.log("***", res)
                    _this.updateLoginMsg(res.data)
                  }
                })
              } else {
                console.log('获取用户登录态失败！' + res.errMsg)
              }
            }

          })
          _this.globalData.isLogin = true

        } else {
          console.log("未登录")
        }
      },
      fail(res) {
        console.log("获取isLogin失败，未登录")
        console.log(res)
      }
    })
  },

  first_login(e, callbackObject) {
    var _this = this
    var userinfo = e.detail
    wx.login({
      success: function (response) {
        var code = response.code
        if (code) {
          var login_info = {
            code: code,
            iv: userinfo.iv,
            encrypted_data: userinfo.encryptedData
          }
          console.log(userinfo)
          wx.showLoading({
            title: '登录中',
            mask: true
          })
          wx.request({
            url: _this.globalData.baseurl + 'wechat/mini/user',
            data: {
              js_code: login_info.code,
              iv: login_info.iv,
              encrypted_data: login_info.encrypted_data
            },
            success: function (res) {

              wx.hideLoading()

              if (_this.globalData.showError && res.statusCode != '200') {
                var errorMsg
                if (res.data.error_msg) {
                  errorMsg = res.data.error_msg
                } else {
                  errorMsg = '未知错误'
                }
                errorMsg += res.statusCode
                _this.showError(errorMsg)
                return
              }
              
              console.log("2.登陆返回")
              console.log(res.data)
              //更新数据
              _this.updateLoginMsg(res.data, callbackObject)

            }, fail(res) {
              console.log(res)
              console.log("登录错误,可能是服务器没有回应，或者超时")

              if (typeof callBackObject == 'object') {
                callBackObject.forEach(function (item, index, object) {
                  if (item.isError && item.func) {
                    if (item.parm) {
                      item.func(item.parm)
                    } else {
                      item.func()
                    }
                  }
                })
              }
            }
          })

        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail: function () {
        console.log("login 失败")
      }
    })
  },

  updateLoginMsg(data, callBackObject) {
    var isError = false
    if (data.result && data.result.token) {
      var token = data.result.token
      var easemobUsername = data.result.easemob_username
      var easemobPassword = data.result.easemob_password

      console.log("=== easemobUsername: " + easemobUsername + ", " + token)

      this.globalData.token = token
      this.globalData.easemobUsername = easemobUsername
      this.globalData.easemobPassword = easemobPassword
    } else {
      isError = true
      console.log("发生错误，token不存在")
    }

    if (isError == false) {
      try {
        wx.setStorageSync('isLogin', true)
        wx.setStorageSync('token', token)
        wx.setStorageSync('easemobUsername', easemobUsername)
        wx.setStorageSync('easemobPassword', easemobPassword)
      } catch (e) {
        console.log("缓存isLogin/token发生错误")
      }
      this.globalData.reflashLogin = true
      this.globalData.isLogin = true
      this.globalData.is_phone_bound = data.result.is_phone_bound
      console.log("登录回调开始")
      if (typeof callBackObject == 'object') {
        callBackObject.forEach(function (item, index, object) {
          if (item.func && (item.isError == undefined || item.isError != true)) {
            if (item.parm) {
              item.func(item.parm)
            } else {
              item.func()
            }
          }
        })
      }

      console.log("Login Easemob")
      this.loginEasemob(easemobUsername, easemobPassword)

    } else if (isError == true) {
      console.log("登录错误回调开始")
      if (typeof callBackObject == 'object') {
        callBackObject.forEach(function (item, index, object) {
          if (item.isError && item.func) {
            if (item.parm) {
              item.func(item.parm)
            } else {
              item.func()
            }
          }
        })
      }
    } else {
      console.log("isError出现特殊情况，位置updateLoginMsg")
    }

  },

  checkLogin(callBackObject) {
    var isLogin = this.globalData.isLogin
    if (isLogin && isLogin == true) {
      //已登录
      console.log("已登录，回调开始")
      
      if (typeof callBackObject == 'object') {
        callBackObject.forEach(function (item, index, object) {
          if (item.func && (item.isError == undefined || item.isError != true)) {
            if (item.parm) {
              item.func(item.parm)
            } else {
              item.func()
            }
          }
        })
      }
    } else {
      //未登录
      console.log("未登录，错误处理回调开始")
      callBackObject.forEach(function (item, index, object) {
        if (item.isError && item.func) {
          if (item.parm) {
            item.func(item.parm)
          } else {
            item.func()
          }
        }
      })
    }
  },


  // 很可能会放弃使用，但目前很多还是依赖这个
  getToken() {
    try {
      var token = wx.getStorageSync('token')
      if (token) {
        // Do something with return value
        // console.log("token:"+token)
      } else {
        console.log("token为空")
      }
    } catch (e) {
      // Do something when catch error
      console.log("获取token发生错误")
      console.log(e)
    }
    return token
  },

  contains: function (arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) {
        return true;
      }
    }
    return false;
  },

  showError(errorMsg) {
    wx.showModal({
      title: '错误',
      content: errorMsg,
      showCancel: false,
      success: function (res) {
        // if (res.confirm) {
        //   console.log('用户点击确定')
        // } else if (res.cancel) {
        //   console.log('用户点击取消')
        // }
      }
    })
  },
  
  loginEasemob: function(username, password) {
    var options = {
      apiUrl: WebIM.config.apiURL,
      user: username,
      pwd: password,
      grant_type: 'password',
      appKey: WebIM.config.appkey
    }
    WebIM.conn.open(options)
  },

  globalData: {
    // showError为true时，网络请求非200会弹框报错
    showError: true,
    baseurl: 'https://api.homeal.imhey.com.cn/api/',
    //baseurl: 'http://api.homeal.dev:8888/api/',
    // staticResUrl:"http://119.29.162.17/homeal/icon/",
    userInfo: null,
    reflashOrder: false,
    reflashLogin: false
  }
})
