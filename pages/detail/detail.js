// miniprogram/pages/detail/detail.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        detail: [],
        rdsession: '',
        tags: [], // 标签
        ingredients: [], // 主料
        burden: [], // 辅料
        steps:[],
        loading: true,
        logged: false,
        isExit: true, // 此菜品是否存在
        isCollect: true // 菜品是否已收藏
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let isLogin = wx.getStorageSync('isLogin')
        this.loadDetail(options.foodId) // 加载详情
        wx.setStorageSync('shareId', options.foodId)
        console.log("菜谱id", options.foodId)
        this.setData({
            logged: isLogin ? true : false
        })
        // 是否存在用户的rdsession
        console.log('app.globalData.rdsession', app.globalData.rdsession)
        if (app.globalData.rdsession) {
            this.setData({
                rdsession: app.globalData.rdsession
            })
        }
        console.log('rdsession', this.data.rdsession)
        this.getcollect(options.foodId) // 获取收藏菜品，并判断是否已收藏 */
        wx.request({
            url: 'http://127.0.0.1//foodStep/wxGetStep',
            data: { foodId: options.foodId },
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                console.log('查询结果:', res.data.foodStep);
                let step = [];
                let foodStep = that.data.steps;
                if(res.data.info.indexOf('success')>=0){
                    for (let index in res.data.foodStep) {
                        step = [{
                            id: res.data.foodStep[index].id,
                            index: res.data.foodStep[index].index,
                            title: res.data.foodStep[index].link,
                            img: res.data.foodStep[index].info
                        }];
                        foodStep = foodStep.concat(step);
                    }
                }
                that.setData({
                    steps: foodStep,
                });
            }
        })
    },

    loadDetail(param) {
        let that = this
        wx.showLoading({
            title: '详情加载中...',
        })
        wx.request({
            url: 'http://127.0.0.1/food',
            data:{id : param},
            method : "POST",
            header : {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success : function(res) {
                console.log('查询结果:', res.data);
                if (res.data.id != 'undefined') {
                    that.setData({
                        detail: [{
                            id: res.data.id,
                            title : res.data.name,
                            img: res.data.photo,
                            imtro: res.data.imtro
                        }],
                        tags: res.data.tags.split(';'),
                        ingredients: res.data.ingredients.split(',').join('：').split(';'),
                        burden: res.data.burden.split(',').join('：').split(';')
                    })
                    wx.setNavigationBarTitle({
                        title: res.data.name
                    })
                } else {
                    console.log('该id为空')
                    that.setData({
                        isExit: false
                    })
                }
                wx.hideLoading();
            }
        })
    },

    // 登录授权
    getUser(e) {
        console.log(e);
        wx.getUserInfo({
            success: (res) => {
                console.log(res)
                wx.setStorageSync('isLogin', 'isLogin')
                this.setData({
                    logged: true
                })
            }
        })
    },

    // 授权后可以收藏
    bindCollect() {
        let that = this
        // 先检查是否以获取openId
        console.log('this.data.rdsession', this.data.rdsession)
        if (!this.data.rdsession) {
            wx.vibrateLong({
                success: res => {
                    console.log('震动成功');
                },
                fail: (err) => {
                    console.log('震动失败');
                }
            })
            wx.showToast({
                icon: '收藏',
                title: '请先登录',
            })
        } else {
            that.onCollect()
            wx.vibrateLong({
                success: res => {
                    console.log('震动成功');
                },
                fail: (err) => {
                    console.log('震动失败');
                }
            })
            if (that.data.isCollect) {
                wx.showToast({
                    icon: '收藏',
                    title: '收藏成功',
                })
            } else {
                wx.showToast({
                    icon: '收藏',
                    title: '已经取消收藏',
                })
            }
        }
    },

    // 收藏
    onCollect() {
        let that = this
        let flag = false;
        console.log('shareId', wx.getStorageSync('shareId'))
        wx.request({
            url: 'http://127.0.0.1/userCollection/addCollect',
            data: { rdsession: that.data.rdsession, foodId: wx.getStorageSync('shareId') },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                let info = res.data.info;
                if (info.indexOf("success") >= 0) {
                    if ((res.data.flag).indexOf("true") >= 0){
                        flag = true;
                    }
                } else if (info.indexOf("notLogin") >= 0) {
                    wx.removeStorageSync("rdsession");
                    wx.removeStorageSync("isLogin");
                    app.globalData.rdsession = null;
                    app.globalData.userInfo = null;
                    wx.showToast({
                        icon: '收藏',
                        title: '请重新登录',
                    })
                };
                that.setData({
                    isCollect: !flag
                })
                console.log('isCollect', that.data.isCollect);
            }
        })
    },

    // 读取收藏列表
    getcollect(param) {
        let that = this;
        let flag = false;
        wx.request({
            url: 'http://127.0.0.1/userCollection/isCollect',
            data: { rdsession: that.data.rdsession, foodId: param },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                let info = res.data.info;
                if (info.indexOf("success") >= 0){
                    if ((res.data.isCollect).indexOf("true")>=0){
                        flag = true;
                    }
                    that.setData({
                        isCollect: !flag
                    })
                } else if (info.indexOf("notLogin") >= 0){
                    wx.removeStorageSync("rdsession");
                    wx.removeStorageSync("isLogin");
                    app.globalData.rdsession = null;
                    app.globalData.userInfo = null;
                    wx.showToast({
                        icon: '收藏',
                        title: '请重新登录',
                    })
                }
            }
        })
    },

    onShareAppMessage(res) {
        let id = wx.getStorageSync('shareId')
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '宜厨房',
            path: `pages/detail/detail?id=${id}`
        }
    },

    onBackhome() {
        wx.switchTab({
            url: `/pages/index/index`,
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