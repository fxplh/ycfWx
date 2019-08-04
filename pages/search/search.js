// miniprogram/pages/search/search.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputValue: '',
        rdsession: '',
        showHistory: true,
        historyList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        console.log('是否已有用户rdsession：', app.globalData.rdsession)

        // 是否存在用户的rdsession
        if (app.globalData.rdsession) {
            this.setData({
                rdsession: app.globalData.rdsession
            })
        }

    },

    bindKeyInput(e) {
        this.setData({
            inputValue: e.detail.value
        })
        console.log(this.data.inputValue)
    },

    // 进入搜索结果页 -> list
    goSearch() {
        let content = this.data.inputValue;
        while(content.indexOf(' ')>=0){
            content = content.replace(' ','');
        }
        if (!content) {
            console.log('内容为空')
            return
        }

        this.onHistory(content)

        wx.navigateTo({
            url: `/pages/list/list?content=${content}`,
        })
    },

    historyGoSearch(e) {
        console.log(e)
        let content = e.currentTarget.dataset.title
        wx.navigateTo({
            url: `/pages/list/list?content=${content}`,
        })
    },

    // 清空历史记录
    bindClearHistory() {
        let that = this
        wx.request({
            url: 'http://127.0.0.1/user/clearHistory',
            data: { rdsession: that.data.rdsession},
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if ((res.data.info).indexOf('success') >= 0){
                    that.setData({
                        historyList: [] 
                    })
                    wx.showToast({
                        icon: '删除',
                        title: '历史已清空',
                    })
                }else{
                    wx.showToast({
                        icon: '删除',
                        title: '删除失败或未登录',
                    })
                }
            }
        })
    },

    // 添加历史记录
    onHistory(content) {
        let that = this
        wx.request({
            url: 'http://127.0.0.1/user/addHistory',
            data: { rdsession: that.data.rdsession,content : content },
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if((res.data.info).indexOf('success')>=0){
                    that.setData({
                        historyList: res.data.list.split(';')
                    })
                }
            }
        })
       
    },

    // 读取历史记录
    getHistory() {
        let that = this
        wx.request({
            url: 'http://127.0.0.1/user/getHistory',
            data: { rdsession: that.data.rdsession },
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if((res.data.info).indexOf('success')>=0){
                    that.setData({
                        historyList: res.data.list.split(';')
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
        this.getHistory()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.getHistory()
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