// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    access_token: '',
    img_url:'../../assels/cartoonimg.jpg'

  },
  //获取百度AI鉴权
  getAccessToken(){
    if(wx.getStorageSync('access_token')){
       this.setData({
        access_token:wx.getStorageSync('access_token')
      })
      wx.showToast({
        title: '鉴权成功'
      })
      console.log(__wxConfig.envVersion)
      return
    }
    
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=TRUYp9BQ15BDosV9nCmkM1UT&client_secret=8Yjvr7qdcrGSBtGL6uuzKtta5FOaq77n',
      success: res =>{
        console.log(res)
        if(res.data.err){
          return wx.showToast({
            title: '鉴权失败'
          })
        }
        wx.showToast({
          title: '鉴权成功'
        })
        this.setData({
          access_token:res.data.access_token
        })
        wx.setStorageSync('access_token', res.data.access_token)


      }
    })
  },
  // 选择图片
  chooseImg(e) {
    console.log(e.currentTarget.dataset.type)
      wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: res => {
        console.log(res.tempFilePaths[0])
        this.imgTransFormBase64(res.tempFilePaths[0], e.currentTarget.dataset.type)
        }
    })
  },
// 将图片转为BASE64
imgTransFormBase64(imgUrl,type){
  wx.showLoading({
    title: '图片正在制作中',
  })
  const fileSystem = wx.getFileSystemManager()
  fileSystem.readFile({
    filePath:imgUrl,
    encoding:'base64',
    success:res =>{
      console.log(res)
      const data = {
        image:res.data
      }
      if(type==='masks'){
        data.type = 'anime_mask'
        data.mask_id = Math.ceil(Math.random()*8)
      }
      this.cartoonImg(data)
    }
  })

},
// 人像动漫画
cartoonImg(data){
 console.log(data)
wx.request({
url:'https://aip.baidubce.com/rest/2.0/image-process/v1/selfie_anime?access_token=' +this.data.access_token,
  header:{
    'Content-Type':'application/x-www-form-urlencoded'
  },
  method:'POST',
  data,
  success: res => {
   console.log(res) 
   this.setData({
     img_url:"data:image/png;base64," +res.data.image
   })
   wx.hideLoading()
  }
})
},

// 点击图片预览保存
previewImg() {
  wx.previewImage({
    urls: [this.data.img_url],
    current:this.data.img_url
  })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.getAccessToken()
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

  },

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {

  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  },

})

