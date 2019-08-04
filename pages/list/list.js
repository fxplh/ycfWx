// miniprogram/pages/list/list.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        index: 0, // 页码起始下标
        num: 5, // 每页展示个数
        searchContent: '', // 搜索内容或者搜索标签id
        searchIsTags: false, // 是否搜索的是标签id
        loading: false, // 是否正在加载
        isOver: false, // 滑动到底
        noList: false // 搜索结果为空
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: options.content //页面标题为路由参数
        })

        console.log(options)

        if (options.tags) {
            this.data.searchContent = options.tags
            this.data.searchIsTags = true
            this.loadList("no", options.tags, 'http://127.0.0.1/food/getByClassId?fcId')
        } else {
            this.data.searchContent = options.content
            this.loadList("no", options.content, 'http://127.0.0.1/food/getBySearch?content')
        }

    },

    goDetail(e) {
        wx.navigateTo({
            url: `/pages/detail/detail?foodId=${e.currentTarget.dataset.id}`,
        })
    },


    // 加载列表
    loadList(isUp,content, url) {
        let that = this

        if (!this.data.isOver) {
            let { list, index, num } = this.data;
            wx.showLoading({
                title: '正在加载...',
                mask: true
            });
            this.setData({
                loading: true
            });
            if (isUp == 'yes'){
                that.setData({
                    index: that.data.index+that.data.num
                });
            }
            wx.request({
                url: url + "=" + content + "&index=" + that.data.index + "&num=" + that.data.num,
                success: function(res) {
                    console.log(res)
                    if (!res.data.length) { // 没搜索到
                        if (isUp == 'yes'){
                            that.setData({
                                loading: false,
                                isOver: true
                            });
                        }else{
                            that.setData({
                                loading: false,
                                noList: true
                            });
                        }
                        
                    } else {
                        let food = [];
                        let foods = that.data.list;
                        for(let index in res.data){
                            food = [{
                                id : res.data[index].id,
                                title : res.data[index].name,
                                img : res.data[index].photo,
                                ingredients: res.data[index].ingredients,
                                burden: res.data[index].burden
                            }];
                            foods = foods.concat(food);
                        }
                        that.setData({
                           list : foods,
                           loading : false
                        });
                    }
                    wx.hideLoading();
                }
            })
        }
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
        if (!this.data.loading) {
            if (this.data.searchIsTags) {
                this.loadList("yes", this.data.searchContent, 'http://127.0.0.1/food/getByClassId?fcId')
            } else {
                this.loadList("yes", this.data.searchContent, 'http://127.0.0.1/food/getBySearch?content')
            }

        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})