// pages/user/user.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        avatarUrl: '',
        rdsession: '',
        logged: false,
        username: '',
        place: '',
        collectList: [],
        haveNumber:false,
        havePass:false,
        update:false,
        updatePass : false,
        number:'',
        pass:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('进入用户页检查是否登录:', this.data.logged)
        console.log('是否已授权：', wx.getStorageSync('isLogin'))

        wx.showLoading({
            title: '正在加载...',
            mask: true
        });

        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    if (wx.getStorageSync('rdsession')){
                        console.log('已授权存在rdsession')
                        wx.getUserInfo({
                            success: res => {
                                this.setData({
                                    logged: true,
                                    avatarUrl: res.userInfo.avatarUrl,
                                    userInfo: res.userInfo,
                                    username: res.userInfo.nickName,
                                    place: res.userInfo.province + ', ' + res.userInfo.country
                                })
                                if (wx.getStorageSync("haveNumber")){
                                    this.setData({
                                        haveNumber: true,
                                        number: wx.getStorageSync("number")
                                    })
                                }
                                if ((wx.getStorageSync("havePass"))) {
                                    this.setData({
                                        havePass: true
                                    })
                                }
                            }
                        })
                    }
                }
                wx.hideLoading();
            }
        })

    },

    goDetail(e) {
        wx.navigateTo({
            url: `/pages/detail/detail?foodId=${e.currentTarget.dataset.id}`,
        })
    },

    onGetUserInfo: function () {
        let that = this;
        // 登录
        wx.login({
            success: function (res) {
                wx.request({
                    url: 'http://127.0.0.1/login/wxLogin',
                    data: { code: res.code },
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                        let info = res.data.info;
                        console.log('userinfo',info)
                        if (info.indexOf("success") >= 0) {
                            app.globalData.rdsession = res.data.rdsession;
                            wx.setStorageSync('rdsession', res.data.rdsession);
                            wx.getSetting({
                                success: res => {
                                    if (res.authSetting['scope.userInfo']) {
                                        wx.getUserInfo({
                                            success: function (res) {
                                                that.setData({
                                                    logged: true,
                                                    userInfo: res.userInfo,
                                                    avatarUrl: res.userInfo.avatarUrl,
                                                    username: res.userInfo.nickName,
                                                    place: res.userInfo.province + ', ' + res.userInfo.country
                                                })
                                                wx.setStorageSync('isLogin', 'isLogin');
                                                wx.request({
                                                    url: 'http://127.0.0.1/user/wxUserInfo',
                                                    data: { encryptedData: res.encryptedData, iv: res.iv, rdsession: app.globalData.rdsession },
                                                    header: {
                                                        'content-type': 'application/x-www-form-urlencoded'
                                                    },
                                                    success: function (res) { 
                                                        if(res.data.info.indexOf('success')>=0){
                                                            if(res.data.haveEmail.indexOf('true')>=0){
                                                                that.setData({
                                                                    haveNumber : true,
                                                                    number: res.data.email
                                                                })
                                                                wx.setStorageSync('number', that.data.number);
                                                            }
                                                            if (res.data.havePass.indexOf('true') >= 0) {
                                                                that.setData({
                                                                    havePass: true
                                                                })
                                                            }
                                                        }
                                                        wx.setStorageSync('haveNumber', that.data.haveNumber);
                                                        wx.setStorageSync('havePass', that.data.havePass);
                                                        console.log(that.data.haveNumber);
                                                        console.log("用户信息保存成功");
                                                    }
                                                })
                                            }
                                        })
                                    }
                                    that.getcollect();
                                    wx.hideLoading();
                                }
                            })
                        } else {
                            console.log("微信调用失败");
                        }
                    }
                })
            }
        })
    },

    updatePass :function(){
        let that = this;
        that.setData({
            updatePass: true
        })
    },

    onSetEmailPass : function(e){
        let that = this;
        that.setData({
            update:true
        })
        console.log(that.data.update)
    },

    cancel:function(){
        let that = this;
        that.setData({
            update: false
        })
    },

    cancel1: function () {
        let that = this;
        that.setData({
            updatePass: false
        })
    },

    confirm:function(e){
        let that = this;
        let password = that.data.pass;
        let num = that.data.number;
        if(!num){
            wx.showToast({
                title: '邮箱不能为空',
            })
            return
        }
        if (!password) {
            wx.showToast({
                title: '密码不能为空',
            })
            return
        }
        let str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
        if (!str.test(num)){
            wx.showToast({
                title: '请输入正确的邮箱',
            })
            return
        }
        wx.request({
            url: 'http://127.0.0.1/user/setUserInfo',
            data: { rdsession: app.globalData.rdsession,email:num,password:password },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if(res.data.info.indexOf('success')>=0){
                    console.log('数据库用户信息设置成功');
                    that.setData({
                        update: false,
                        haveNumber: true,
                        havePass: true,
                        number: num,
                    })
                    wx.setStorageSync('haveNumber', 'true');
                    wx.setStorageSync('havePass', 'true' );
                }
            }
        })
       
    },

    confirm1: function (e) {
        let that = this;
        let password = that.data.pass;
        if (!password) {
            wx.showToast({
                title: '密码不能为空',
            })
            return
        }
        wx.request({
            url: 'http://127.0.0.1/user/updatePassword',
            data: { rdsession: app.globalData.rdsession, password: password },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.info.indexOf('success') >= 0) {
                    console.log('密码修改成功');
                    that.setData({
                        updatePass: false
                    })
                    wx.showToast({
                        title: '密码修改成功',
                    })
                }
            }
        })

    },

    setValue:function(e){
        let name = e.currentTarget.dataset.name;
        if (e.detail.value.indexOf(' ')>=0){
            wx.showToast({
                title: '不能输入空格',
            })
            if (name.indexOf('number')>=0) {
                this.setData({
                    number: ''
                })
            } else {
                this.setData({
                    pass: ''
                })
            }
            return
        }
        if (name.indexOf('number')>=0){
            this.setData({
                number: e.detail.value
            })
        }else{
            this.setData({
                pass: e.detail.value
            })
        } 
    },
    // 读取收藏列表
    getcollect() {
        let that = this;
        wx.request({
            url: 'http://127.0.0.1/userCollection/getUserCollection',
            data: { rdsession: app.globalData.rdsession},
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                let info = res.data.info;
                let foods = [];
                if (info.indexOf("success") >= 0) {
                    if ((res.data.foods).indexOf("null") < 0) {
                        foods = res.data.foods
                    }
                    that.setData({
                        collectList: foods
                    })
                }
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
        this.getcollect()
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