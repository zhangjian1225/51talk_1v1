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
            random: '',
            themePic: '',
            audio: '',
            question:'',
            words: '',
            editJames:[''],
            james:[]
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
                // item[attr] = "";
                // alert("图片尺寸不符合要求！");
            }
            return checkSize;
        },
        validate: function() {
            let source = Data.configData.source
            let check = true
            if (source.words.length < 1) {
                check = false
            }
            return check
        },
        onSend: function() {
            let source = Data.configData.source
            source.james = [];
            let reg = /\S\w*/
            source.editJames.forEach(function(item,index){
                if(item.match(reg)){
                    source.james.push(item)
                }
            })
            source.random = Math.round(Math.random() * 100);
            var data = this.configData; 
            var _data = JSON.stringify(data); 
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
                // console.error('提交失败');
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
        audioUpload: function(e, item, attr, ram) {
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
            if ((size / 1024).toFixed(2) > ram) {
                console.error("您上传的音频存储大小为：" + (size / 1024).toFixed(2) + "KB");
                alert("您上传的声音大小为：" + (size / 1024).toFixed(2) + "KB, 超过" + ram + "KB上限，请检查后上传！");
                return;
            }
            item[attr] = "./form/img/loading.jpg";
            this.postData(file, item, attr);
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
        addJames:function(){
            this.configData.source.editJames.push(' ')
        },
        deleJames:function(item){
            this.configData.source.editJames.remove(item)
        }
    }
});
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};