//var domain = 'http://172.16.0.107:9011/pages/159/';
var domain = '';
var updata = ['one', 'two', 'three']
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
      topImg: '',
      choosePerson: 'one',
      animasteImg: '',
      childImg: '',
      sayAud: '',
      audio: '',
      font: '',
      cloudImg: ''
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
  methods: {
    imageUpload: function(e, item, attr, fileSize) {
      var file = e.target.files[0],
        size = file.size,
        naturalWidth = -1,
        naturalHeight = -1,
        that = this;
      if ((size / 1024).toFixed(2) > fileSize) {
        alert("您上传的图片大小为" + (size / 1024).toFixed(2) + "KB, 超过" + fileSize + "K上限，请检查后上传！");
        e.target.value = '';
        return;
      }
      item[attr] = "./form/img/loading.jpg";
      var img = new Image();
      img.onload = function() {
        naturalWidth = img.naturalWidth;
        naturalHeight = img.naturalHeight;
        var check = that.sourceImgCheck(e.target, {
          height: naturalHeight,
          width: naturalWidth
        }, item, attr);
        if (check) {
          that.postData(file, item, attr);
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
    sourceImgCheck: function(input, data, item, attr) {
      var dom = $(input),
        size = dom.attr("size").split(",");
      if (size == "") return true;
      var checkSize = size.some(function(item, idx) {
        var _size = item.split("*"),
          width = _size[0],
          height = _size[1];
        if (width == data.width && height == data.height) {
          return true;
        }
        return false;
      });
      if (!checkSize) {
        item[attr] = "";
        alert("应上传图片大小为：" + size.join("或") + ", 但上传图片尺寸为：" + data.width + "*" + data.height);
        // e.target.value = '';
      }
      return checkSize;
    },
    validate: function() {
      if (this.configData.source.animasteImg == '') {
        return false;
      }
      if (this.configData.source.font == '') {
        return false;
      }
      if (this.configData.source.audio == '') {
        return false;
      }
      if (this.configData.source.sayAud == '') {
        return false;
      }
      if (this.configData.source.cloudImg == '') {
        return false;
      }
      return true;
    },
    onSend: function() {
      var data = this.configData;
      var val = this.validate();
      if (val) {
        var _data = JSON.stringify(data);
        $.ajax({
          url: domain + 'content?_method=put',
          type: 'POST',
          data: {
            content: _data
          },
          success: function(res) {
            window.parent.postMessage('close', '*');
          },
          error: function(err) {
            console.log(err)
          }
        });
      } else {
        alert('带*为必填项')
      }
    },
    postData: function(file, item, attr) {
      var FILE = 'file';
      bg = arguments.length > 2 ? arguments[2] : null;
      var oldImg = item[attr];
      var data = new FormData();
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
          item[attr] = domain + res.data.key;
        },
        error: function(err) {
          item[attr] = '';
        }
      })
    },
    audioUpload: function(e, item, attr) {
      //校验规则
      //var _type = this.rules.audio.sources.type;

      //获取到的内容数据
      var file = e.target.files[0],
        type = file.type,
        size = file.size,
        name = file.name,
        path = e.target.value;
      if ((size / 1024).toFixed(2) > 500) {
        console.warn("您上传的音频文件大小：", (size / 1024).toFixed(2) + "K");
      } else {
        console.log("您上传的音频文件大小：", (size / 1024).toFixed(2) + "K");
      }
      if ((!isNaN(parseInt($(e.target).attr('volume')))) && (size / 1024).toFixed(2) > parseInt($(e.target).attr('volume'))) {
        alert("您上传的音频大小为" + (size / 1024).toFixed(2) + "KB, 超过" + $(e.target).attr('volume') + "K上限，请检查后上传！");
        e.target.value = '';
        return;
      }
      item[attr] = "./form/img/loading.jpg";
      this.postData(file, item, attr);
    },
    addSele: function() {
      this.configData.source.list.push({
        img: '',
        name: ''
      });
    },
    delSele: function(item) {
      this.configData.source.list.remove(item);
    },
    addTg: function(item) {
      this.configData.tg.push({ title: '', content: '' });
    },
    deleTg: function(item) {
      this.configData.tg.remove(item);
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
    },
    play: function(e) {
      e.target.children[0].play();
    }

  }
});
Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};