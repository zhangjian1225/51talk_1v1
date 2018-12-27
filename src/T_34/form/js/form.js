// var domain = 'http://172.16.0.107:9011/pages/10003/';
var domain = '';

var Data = {
    configData: {
        bg: '',
        desc: '',
        tg: [{
            title: '',
            content: ''
        }],
        level:{
            high:[{
                title: "",
                content: ""
            }],
            low:[{
                title: "",
                content: "",
            }]
        },
        source: {
            title: '',
            article: '',
            dial: '',
            dialNum: ''
        }

    }
}
$.ajax({
    type: "get",
    url: domain + "content?_method=put",
    async: false,
    success: function(res) {
        if (res.data != "") {
            Data.configData = JSON.parse(res.data);
            if(!Data.configData.level){
                Data.configData.level = {
                    high:[{
                        title: "",
                        content: "",
                    }],
                    low:[{
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
        
        imageUpload: function(e, item, attr,fileSize) {
            var file = e.target.files[0],
                size = file.size,
                naturalWidth = -1,
                naturalHeight = -1,
                that = this;
            if ((size / 1024).toFixed(2) > fileSize) {
                alert("您上传的图片大小为：" + (size / 1024).toFixed(2) + "KB, 超过"+fileSize+"KB上限，请检查后上传！");
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
                },attr);
                if (check) {
                    item[attr] = "./form/img/loading.jpg";
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
        imageItemUpload: function(e, item, attr, fileSize) {
            var file = e.target.files[0],
                size = file.size,
                naturalWidth = -1,
                naturalHeight = -1,
                that = this;
                console.log(fileSize);

            if ((size / 1024).toFixed(2) > 100) {
                alert("您上传的图片大小为：" + (size / 1024).toFixed(2) + "KB, 超过" + fileSize + "KB上限，请检查后上传！");
                e.target.value = '';
                return;
            }

            var img = new Image();
            img.onload = function() {
                naturalWidth = img.naturalWidth;
                naturalHeight = img.naturalHeight;
                var check = that.sourceItemImgCheck(e.target, {
                    height: naturalHeight,
                    width: naturalWidth
                });
                if (check) {
                    item[attr] = "./form/img/loading.jpg";
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
        sourceImgCheck: function(input, data,attr) {
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
                alert("应上传图片大小为：" + size.join("或") + ", 上传图片尺寸为：" + data.width + "*" + data.height);
                // item[attr] = "";
                // alert("图片尺寸不符合要求！");
                input.value = '';
            }
            return checkSize;
        },
        sourceItemImgCheck: function(input, data) {
            var dom = $(input),
                size = dom.attr("size").split(",");
            var minSize, maxSize;
                
                
            if (size == "") return true;
            var checkSize = size.some(function(item, idx) {
                var _size = item.split("*"),
                    minSize = _size[0],
                    maxSize = _size[1];
                if (maxSize >= data.width && minSize <= data.width && data.width/data.height == 1) {
                    return true;
                }
                return false;
            });
            if (!checkSize) {
                alert("应上传图片大小为： 350*350~700*700, 上传图片尺寸为：" + data.width + "*" + data.height);
                input.value = '';
            }
            return checkSize;
        },
        validate: function() {
            var data = this.configData.source
            var check = true
            if (!(data.dial && data.dialNum)) {
                check = false
            }
            return check
        },
        onSend: function() {
            var data = this.configData;
            var _data = JSON.stringify(data);
            var num = Number(data.source.dialNum);
            if (num != num || num < 2 || num > 20 ) {
                alert('扇区数量请填写2-20之间的数字')
                return
            }
            var val = this.validate();
            if (val === true) {
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
                    console.log(res.data.key);
                    item[attr] = domain + res.data.key;
                },
                error: function(err) {
                    console.log(err)
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
            // if (!_type.test(type)) {
            //     alert("您上传的文件类型错误，请检查后再上传！");
            //     return;
            // }
            // if ((size / 1024).toFixed(2) > 500) {
            //     console.warn("您上传的音频文件大小：", (size / 1024).toFixed(2) + "K");
            // } else {
            //     console.log("您上传的音频文件大小：", (size / 1024).toFixed(2) + "K");
            // }
            if ((size / 1024).toFixed(2) < 50 || (size / 1024).toFixed(2) > 100 ) {
                console.error("您上传的音频存储大小为：" + (size / 1024).toFixed(2) + "KB");
                alert("您上传的声音大小为：" + (size / 1024).toFixed(2) + "KB，请检查后上传！");
                return;
            }
            item[attr] = "./form/img/loading.jpg";
            this.postData(file, item, attr);
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
        addH: function () {
            this.configData.level.high.push({title:'',content:''});
        },
        addL: function (item) {
            this.configData.level.low.push({title:'',content:''});
        },
        deleH:function(item){
	        this.configData.level.high.remove(item);
        },
        deleL:function(item){
	        this.configData.level.low.remove(item);
        },
        play: function(e) {
            e.target.children[0].play();
        },
        addOption: function() {
            this.configData.source.options.push('')
        },
        delOption: function(item) {
            this.configData.source.options.remove(item)
        },
        setAnswer: function(item) {
            this.configData.source.right = item;
        }
    }
});
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};