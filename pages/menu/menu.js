// pages/menu/menu.js

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadList()
    },

    // 获取列表数据
    loadList() {
        let that = this;
        wx.showLoading({
            title: '正在加载...',
            mask: true
        });
        this.setData({
            loading: true
        });
        wx.request({
            url: 'http://127.0.0.1/foodClass/getMenu',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success : function(res){
                that.setData({
                    list : res.data
                })
                wx.hideLoading()
            }
        })
    },

    goList(e) {
        console.log(e)
        wx.navigateTo({
            url: `/pages/list/list?content=${e.currentTarget.dataset.content}&tags=${e.currentTarget.dataset.tags}`,
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