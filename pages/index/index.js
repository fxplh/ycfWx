//index.js
//获取应用实例
const app = getApp()

Page({
    data:{

        imgUrls: [],
        indicatorDots: true,
        autoplay: true,
        circular:true,
        indicatorColor: '#fedb00',
        interval: 2000,
        duration: 400,
        activeCategoryId: 1,
        category: [],
        scroll: [{
            id: 1,
            parentId: "10001",
            img: "/images/jiachangcai.jpg",
            name: '家常菜'
        },
        {
            id: 2,
            parentId: "10001",
            img: "/images/kuaishouc.jpg",
            name: '快手菜'
        },
        {
            id: 3,
            parentId: "10001",
            img: "/images/chuangyicai.jpg",
            name: '创意菜'
        },
        {
            id: 4,
            parentId: "10001",
            img: "/images/sucai.jpg",
            name: '素菜'
        },
        {
            id: 5,
            parentId: "10001",
            img: "/images/liangcai.jpg",
            name: '凉菜'
        },
        {
            id: 6,
            parentId: "10001",
            img: "/images/hongbei.jpg",
            name: '烘焙'
        },
        {
            id: 7,
            parentId: "10001",
            img: "/images/mianshi.jpg",
            name: '面食'
        }
        ],
        list: [],
        avatarUrl: './user-unlogin.png',
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: ''
    },
    goSearch(e) {
        wx.navigateTo({
            url: `/pages/search/search`,
        })
    },
    goMenu(e) {
        wx.switchTab({
            url: `/pages/menu/menu`,
        })
    },
    goDetail(e) {
        wx.navigateTo({
            url: `/pages/detail/detail?foodId=${e.currentTarget.dataset.foodid}`,
        })
    },

    goList(e) {
        console.log(e)
        wx.navigateTo({
            url: `/pages/list/list?content=${e.currentTarget.dataset.content}&tags=${e.currentTarget.dataset.tags}`,
        })
    },

    onLoad: function () {
        var names;
        var that = this;
        wx.request({
            url: 'http://127.0.0.1/foodClass',
            data: {names :'早餐,午餐,下午茶,晚餐,夜宵'},
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res){
                var c = [];
                var ca = [];
                for(var index in res.data)(
                    c = [{
                        id : res.data[index].id,
                        img: res.data[index].photo,
                        name : res.data[index].name
                    }],
                    ca = ca.concat(c)
                )
                that.setData({
                    category: ca
                })
            }
        })
        wx.request({
            url: 'http://127.0.0.1/hotfood/getHotFood',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                var c = [];
                var ca = [];
                for (var index in res.data.foods) (
                    c = [{
                        id: res.data.foods[index].id,
                        img: res.data.foods[index].photo,
                        name: res.data.foods[index].name
                    }],
                    ca = ca.concat(c)
                )
                that.setData({
                    list: ca
                })
            }
        })
        wx.request({
            url: 'http://127.0.0.1/foodRecommend/wxGetFoodRe',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                var c = [];
                var ca = [];
                for (var index in res.data) (
                    c = [{
                        foodId: res.data[index].id,
                        url: res.data[index].photo,
                        name: res.data[index].name
                    }],
                    ca = ca.concat(c)
                )
                that.setData({
                    imgUrls: ca
                })
            }
        })

    }
})
