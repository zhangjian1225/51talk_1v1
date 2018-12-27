// var domain = 'http://172.16.0.107:9011/pages/10003/';
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
            options:[
                {
                    themePic:'',
                    audio:''
                }
             ],
            bomb:'',
            time: ''
        }
    }
};
$.ajax({
    type:"get",
    url: domain + "content?_method=put",
    async:false,
    success: function(res){
        if(res.data!=""){
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
    error: function(res){
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
        sourceImgCheck: function(input, data) {
            let dom = $(input),
                size = dom.attr("size").split(",");
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
            }
            return checkSize;
        },
        validate: function() {
            var data = this.configData.source
            var check = false

            if(data.time > 0){
                check = true
            }
            return check
            
        },
        onSend: function() {
            var data = this.configData;
            var reg = /^[1-9]\d*$/;
            var isNumber = reg.test(data.source.time)
            var options=this.configData.source.options;
            var timeNum=this.configData.source.time;
            // console.log(timeNum,'aaa')
            if(!isNumber||timeNum>99){
                alert('请选择1~99范围的正整数')
                return
            }
            for(var i=0;i<options.length;i++){
                if((options[i].audio==''&&options[i].themePic=='')){
                    alert('图片和音频不能同时为空')
                    return
                }
            }

            var _data = JSON.stringify(data);
            console.log(_data);
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
                alert('带*号的为必填项')
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
                    console.log(err)
                }
            })
        },
        audioUpload: function(e, item, attr,fileSize) {console.log(attr)
            var file = e.target.files[0],
                type = file.type,
                size = file.size,
                name = file.name,
                path = e.target.value;
            if ((size / 1024).toFixed(2) > fileSize) {
                alert("您上传的声音大小为：" + (size / 1024).toFixed(2) + "KB, 超过"+fileSize+"KB上限，请检查后上传！");
                e.target.value = '';
                return;
            }
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
        deleTg: function(item) {
            this.configData.tg.remove(item);
        },
        play: function(e) {
            e.target.children[0].play();
        },
        addOption: function() {
            if ( this.configData.source.options.length >= 6 ) {
                return;
            }
            this.configData.source.options.push({
                themePic: '',
                audio: ''
            })
        },
        delPrew: function(item) {
            item.themePic = ''
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