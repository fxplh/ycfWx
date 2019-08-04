// pages/game/game.js
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
        let that  = this;
        
    },
    goDetail(e) {
        wx.navigateTo({
            url: `/pages/detail/detail?foodId=${e.currentTarget.dataset.id}`,
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
        let that = this;
        wx.showLoading({
            title: '正在加载...',
            mask: true
        });
        wx.request({
            url: 'http://127.0.0.1/food/randFood',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.length) {
                    let food = [];
                    let foods = [];
                    for (let index in res.data) {
                        food = [{
                            id: res.data[index].id,
                            title: res.data[index].name,
                            img: res.data[index].photo,
                            ingredients: res.data[index].ingredients,
                            burden: res.data[index].burden
                        }];
                        foods = foods.concat(food);
                    }
                    that.setData({
                        list: foods
                    });
                    wx.hideLoading();
                }
            }
        })
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