// var domain = 'http://172.16.0.107:9011/pages/10003/';
var domain = '';
var Data = {
    configData: {
        bg: "",
        desc: "",
        title: '',
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
                    letter:[{words:'',color:-1}],  //单词拆分
                    wrongLetter:[{interfere:'',wcolor:-1},{interfere:'',wcolor:-1}],
                    recordStatus:false,  //录音状态  true为添加录音按钮
                    timeLong:'',   //录音时长
                    words:'',    //合并单词
                    random:Math.random(),
                    audio:''
                }
            ],
        }
    }
};
$.ajax({
    type:"get",
    url: domain + "content?_method=put",
    async:false,
    success: function(res){
        if(res.data!=""){
            console.log(res.data,'11')
            Data.configData = JSON.parse(res.data);
            var options=Data.configData.source.options;
            for(var i=0;i<options.length;i++){
                for(var j=0;j<options[i].letter.length;j++){
                    options[i].letter[j].color=-1
                }
                for(var n=0;n<options[i].wrongLetter.length;n++){
                    options[i].wrongLetter[n].wcolor=-1
                }
            }
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
        console.log(res.data,'22')
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
            var options=this.configData.source.options;
            var check = true
            var num=0;
            var timeRange=0;
            var reg = /^[1-9]\d*$/;
            var wordsNum=0;
            var regWord=/^[a-zA-Z]+$/
            var noWord=false
            for(var i=0;i<options.length;i++){
                if(options[i].audio==''){
                    num++
                }
                for(var k=0;k<options[i].letter.length;k++){
                    if(options[i].letter[k].words==''){
                        wordsNum++
                    }
                    
                }
                for(var j=0;j<options[i].letter.length;j++){
                    console.log(options[i].letter[j].words)
                    if(!regWord.test(options[i].letter[j].words)){
                        this.$set(options[i].letter[j],'color',j)
                        noWord=true
                    }else{
                       this.$set(options[i].letter[j],'color',-1) 
                    }
                }
                for(var n=0;n<options[i].wrongLetter.length;n++){
                    console.log(options[i].wrongLetter[n].interfere)
                    if(options[i].wrongLetter[n].interfere.length>0&&!regWord.test(options[i].wrongLetter[n].interfere)){
                        this.$set(options[i].wrongLetter[n],'wcolor',n)
                        noWord=true
                    }else{
                        this.$set(options[i].wrongLetter[n],'wcolor',-1)
                    }
                }
                if(options[i].recordStatus==true&&options[i].timeLong<3||options[i].recordStatus==true&&options[i].timeLong>20||options[i].recordStatus==true&&!reg.test(options[i].timeLong)){
                   timeRange++;     
                }
            }
            if(noWord){
                alert("只能输入字母，不可输入空格或其他特殊字符")
                return
            }
            if(wordsNum>0){
                alert("正确字母选项不能为空")
                return
            }
            if(timeRange>0){
                alert("录音时长为3~20之间的正整数")
                return
            }
            return check  
        },
        onSend: function() {
            var data = this.configData;
            var _data = JSON.stringify(data);
            var options=this.configData.source.options;
            console.log(_data,'aaa');
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
                 //alert('带*号的为必填项')
                // alert('图片、音频和文字不能同时为空')
            }
        },
        postData: function(file, item, attr) {
            var FILE = 'file';
            bg = arguments.length > 2 ? arguments[2] : null;
            var oldImg = item[attr];
            var data = new FormData();
            data.append('file', file);
            var _this=this;
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
            if ( this.configData.source.options.length >= 10 ) {
                return;
            }
            this.configData.source.options.push({
                    letter:[{words:'',color:-1}], 
                    wrongLetter:[{interfere:'',wcolor:-1},{interfere:'',wcolor:-1}],
                    recordStatus:false, 
                    timeLong:'',
                    words:'' ,
                    random:Math.random(),
                    audio:''
            })
        },
        addWordOption:function(item){
            if ( item.letter.length >= 4 ) {
                return;
            }
            item.letter.push({
                    words:'' ,
                    color:-1
            })
        },
        delWordOption:function(arr,index,i){
            console.log(arr,index,i,'aaaaaaaaa')
           this.configData.source.options[index].letter.remove(arr[i])
        },
        addWrongOption:function(item){
            if ( item.wrongLetter.length >= 2 ) {
                return;
            }
            item.wrongLetter.push({
                    interfere:'' 
            })
        },
        delWrongOption:function(arr,index){
            // console.log(arr.length,index,'aaaaaaaaa')
           this.configData.source.options[index].wrongLetter.remove(arr[arr.length-1])
        },
        delPrew: function(item) {
            item.themePic = ''
        },
        delOption: function(item) {
            this.configData.source.options.remove(item)
        },
        setAnswer: function(item) {
            this.configData.source.right = item;
        },
        spelWords:function(index){
            // console.log(index,'bbb')
            var letter=this.configData.source.options[index].letter
            var rightWords=''
            for(let i=0;i<letter.length;i++){
                rightWords+=letter[i].words
            }
            this.configData.source.options[index].words=rightWords
            return rightWords
        }
    },
    mounted:function(){
        this.$watch(function(){
            var options = this.configData.source.options;
            for (var i = 0; i < options.length; i++) {
                if(options[i].words == ''){
                    options[i].recordStatus=false
                    options[i].timeLong=''
                }
            } 
        })
    }
});
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};