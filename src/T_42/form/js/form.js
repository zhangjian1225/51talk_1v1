//var domain = 'http://172.16.0.107:9011/pages/159/';
var domain = '';
var Data = {
  configData: {
    bg: "",
    desc: "",
    title: "",
    tg: [{
      title: "",
      content: "",
    }],
    level: {
      high: [{
        title: "",
        content: ""
      }],
      low: [{
        title: "",
        content: "",
      }]
    },
    source: {
      random: Math.random(),
      title: '',
      options: [{
          pic: '',
          text: '',
          audio: ''

        },
        {
          pic: '',
          text: '',
          audio: ''
        }
      ]
    }
  }
};


$.ajax({
  type: "get",
  url: domain + "content?_method=put",
  async: false,
  success: function(res) {
    if (res.data != "") {
      Data.configData = JSON.parse(res.data);
      if (!Data.configData.level) {
        Data.configData.level = {
          high: [{
            title: "",
            content: "",
          }],
          low: [{
            title: "",
            content: "",
          }]
        }
      }
    }
  },
  error: function(res) {
    console.log(res)
  }
});

new Vue({
  el: '#container',
  data: Data,
  mounted: function() {

  },
  methods: {
    imageUpload: function(e, item, attr, index, fileSize) {
      var file = e.target.files[0],
        size = file.size,
        naturalWidth = -1,
        naturalHeight = -1,
        that = this;

      if ((size / 1024).toFixed(2) > fileSize) {
        alert("您上传的图片大小为：" + (size / 1024).toFixed(2) + "KB, 超过" + fileSize + "KB上限，请检查后上传！");
        e.target.value = '';
        return;
      }

      var img = new Image();
      img.onload = function() {
        naturalWidth = img.naturalWidth;
        naturalHeight = img.naturalHeight;
        var check = that.sourceImgCheck(e.target, {
          height: naturalHeight,
          width: naturalWidth
        });
        if (check) {
          item[attr] = "./form/img/loading.jpg";
          that.postData(file, item, index, attr);
          img = null;
        } else {
          img = null;
        }
      }
      var reader = new FileReader();
      reader.onload = function(evt) {
        img.src = evt.target.result;
      }
      reader.readAsDataURL(file, "UTF-8"); //读取文件
    },
    sourceImgCheck: function(input, data) {
      console.log(input)
      let dom = $(input),
        size = dom.attr("size").split(",");
      console.log(size)
      if (size == "") return true;
      let checkSize = size.some(function(item, idx) {
        let _size = item.split("*"),
          width = _size[0],
          height = _size[1];
        if (width == data.width && height == data.height) {
          return true;
        }
        return false;
      });
      if (!checkSize) {
        alert("应上传图片大小为：" + size.join("或") + ", 上传图片尺寸为：" + data.width + "*" + data.height);
        input.value = '';
        // item[attr] = "";
        // alert("图片尺寸不符合要求！");
      }
      return checkSize;
    },
    validate: function() {
      var data = this.configData.source.options
      var check = true
      var num = 0
      console.log(data)
      for (let i = 0; i < data.length; i++) {
        if (!data[i].pic || !data[i].text) {
          num++
        }
      }
      console.log('num: ' + num)
      if (num > 0) {
        check = false
      }
      return check
    },
    onSend: function() {
      var data = this.configData;
      var _data = JSON.stringify(data);
      // console.log(_data);
      var val = this.validate();
      if (val) {
        $.ajax({
          url: domain + 'content?_method=put',
          type: 'POST',
          data: {
            content: _data
          },
          success: function(res) {
            console.log(res);
            window.parent.postMessage('close', '*');
          },
          error: function(err) {
            console.log(err)
          }
        });
      } else {
        alert("带“*”为必填项");
      }
    },
    postData: function(file, item, index, attr) {
      var FILE = 'file';
      bg = arguments.length > 2 ? arguments[2] : null;
      var oldImg = item[attr];
      var data = new FormData();
      var _this = this
      data.append('file', file);
      if (oldImg != "") {
        data.append('key', oldImg);
      };
      $.ajax({
        url: domain + FILE,
        type: 'post',
        data: data,
        async: false,
        processData: false,
        contentType: false,
        success: function(res) {
          var options = _this.configData.source.options
          item[attr] = domain + res.data.key;

          Vue.set(_this.configData.source.options, index, {
            pic: options[index].pic,
            text: options[index].text,
            audio: item.audio
          })
          console.log(Data.configData);

        },
        error: function(err) {
          console.log(err)
        }
      })
    },
    audioUpload: function(e, item, index, attr) {
      //校验规则
      //var _type = this.rules.audio.sources.type;
      console.log(this.configData, '111')
      console.log(item, '222')

      //获取到的内容数据
      var file = e.target.files[0],
        type = file.type,
        size = file.size,
        name = file.name,
        path = e.target.value;
      // if (!_type.test(type)) {
      //     alert("您上传的文件类型错误，请检查后再上传！");
      //     return;
      // }
      if ((size / 1024).toFixed(2) > 500) {
        console.warn("您上传的音频文件大小：", (size / 1024).toFixed(2) + "K");
      } else {
        console.log("您上传的音频文件大小：", (size / 1024).toFixed(2) + "K");
      }
      if ((size / 1024).toFixed(2) > 50) {
        console.error("您上传的音频存储大小为：" + (size / 1024).toFixed(2) + "KB");
        alert("您上传的声音大小为：" + (size / 1024).toFixed(2) + "KB, 超过50KB上限，请检查后上传！");
        e.target.value = '';
        return;
      }
      item[attr] = "./form/img/loading.jpg";
      this.postData(file, item, index, attr);
    },
    addScreen: function(items, obj) {
      // items.push({
      //     "id": Date.now(),
      //     "subTitle": "",
      //     "img": "",
      //     "audio": "",
      //     "text": ""
      // })
    },
    delQue: function(item, array) {
      array.remove(item);
    },
    addTg: function(item) {
      this.configData.tg.push({
        title: '',
        content: ''
      });
    },
    deleTg: function(item) {
      this.configData.tg.remove(item);
    },
    play: function(e) {
      e.target.children[0].play();
    },
    addOption: function() {
      if (this.configData.source.options.length >= 4) {
        return;
      }
      this.configData.source.options.push({
        pic: '',
        text: '',
        audio: ''
      })
    },
    delOption: function(item) {
      this.configData.source.options.remove(item)
    },
    delPrew: function(item) {
      item.pic = ''
    },
    setAnswer: function(item) {
      this.configData.source.right = item;
    },
    addH: function() {
      this.configData.level.high.push({ title: '', content: '' });
    },
    addL: function(item) {
      this.configData.level.low.push({ title: '', content: '' });
    },
    deleH: function(item) {
      this.configData.level.high.remove(item);
    },
    deleL: function(item) {
      this.configData.level.low.remove(item);
    }
  },
  updated: function() {
    let source = this.configData.source;
    source.isHaveAudio = source.article ? true : false;
  }
});
Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};