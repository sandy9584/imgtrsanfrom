// pages/category/category.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    access_token: '',
    img_url: '../../assels/sky.jpg'
    // option:[]
    // option: ['cartoon', 'pencil', 'color_pencil', 'warm', 'wave', 'lavender', 'mononoke', 'scream','gothic']
    // option: ['cartoon', 'pencil']


  },
  //获取百度AI鉴权
  getAccessToken() {
    if (wx.getStorageSync('access_token')) {
      this.setData({
        access_token: wx.getStorageSync('access_token')
      })
      wx.showToast({
        title: '鉴权成功'
      })
      // console.log(__wxConfig.envVersion)
      return
    }

    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=TRUYp9BQ15BDosV9nCmkM1UT&client_secret=8Yjvr7qdcrGSBtGL6uuzKtta5FOaq77n',
      success: res => {
        console.log(res)
        if (res.data.err) {
          return wx.showToast({
            title: '鉴权失败'
          })
        }
        wx.showToast({
          title: '鉴权成功'
        })
        this.setData({
          access_token: res.data.access_token
        })
        wx.setStorageSync('access_token', res.data.access_token)


      }
    })
  },
  // 选择图片
  chooseImg(e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: res => {
        console.log(res.tempFilePaths[0])
        this.imgTransFormBase64(res.tempFilePaths[0], e.currentTarget.dataset.type)
        // e.currentTarget.dataset.type
      }
    })

  },
  // 将图片转为BASE64
  imgTransFormBase64(imgUrl) {
    console.log(imgUrl)
    wx.showLoading({
      title: '图片正在制作中',
    })
    const fileSystem = wx.getFileSystemManager()
    fileSystem.readFile({
      filePath: imgUrl,
      encoding: 'base64',
      success: res => {
        console.log(res)
        const data = {
          image: res.data,
          // option:['option'] 
          // option:this.option
          // option: ['cartoon', 'pencil', 'color_pencil', 'warm', 'wave', 'lavender', 'mononoke', 'scream','gothic']
          // option: Math.random() 
          // option: Math.ceil(Math.random(option))
          //  
        }

        this.cartoonImg(data)
      }
    })
  },
  // 图像风格转换
  //
  cartoonImg(data) {
    console.log(data)
    wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/image-process/v1/image_definition_enhance?access_token=' + this.data.access_token,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data,
      success: res => {
        console.log(res)
        this.setData({
          img_url: "data:image/png;base64," + res.data.image
        })
        wx.hideLoading()
      }
    })
  },
  // 图片预览保存
  previewImg() {
    wx.previewImage({
      urls: [this.data.img_url],
      current: this.data.img_url
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAccessToken()
    // this.globelData.options()

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