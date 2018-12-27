// 第二期通用功能
"use strict"
require('./commonFunctions.js');
$(function(){

	const data = {
		bg:configData.bg,
		tgs:configData.tg,
		tgMoved:false,
		sync:parent.window.h5SyncActions && parent.window.h5SyncActions.isSync,
		getQueryString:function(key){
			var hrefParam=this.parseURL("http://www.example.com");
         	if(top.frames[0]&&top.frames[0].frameElement){
			    hrefParam = this.parseURL(top.frames[0].frameElement.src)
			}
			return hrefParam.params[key]
		},
		parseURL: function(url) {
		   var a =  document.createElement('a')
		   a.href = url
		   return {
		       source: url,
		       protocol: a.protocol.replace(':',''),
		       host: a.hostname,
		       port: a.port,
		       query: a.search,
		       params: (function(){
		           var ret = {},
		             seg = a.search.replace(/^\?/,'').split('&'),
		             len = seg.length, i = 0, s
		           for (;i<len;i++) {
		               if (!seg[i]) { continue; }
		               s = seg[i].split('=')
		               ret[s[0]] = s[1]
		           }
		           return ret
		       })(),
		       file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
		       hash: a.hash.replace('#',''),
		       path: a.pathname.replace(/^([^\/])/,'/$1'),
		       relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
		       segments: a.pathname.replace(/^\//,'').split('/')
		   }
		},
		userType:function(){
			let userType = 'tea'
			if(this.sync){
				userType = window.frameElement.getAttribute('user_type')
			}else{
				userType = this.getQueryString('role') === '1' ? 'tea':'stu'
			}
			return userType
		},
		setBg:function(){
			if(this.bg){
				$('.container').css('background-image','url('+ this.bg +')')
			}
		},
		createTg:function(){
            let str = ''
            let tgTemp = ''
        	this.tgs.forEach(function(item,index){
        		str += `
        		<li>
				    <div class="tg-list-tit clearfix">
				    <span class="fl tg-list-num">${index+1}</span>
				    <h3 class="fl">${item.title}</h3>
				    </div>
				    <p class="tg-list-des">${item.content}</p>
			    </li>
        		`
        	})
        	tgTemp = `<img src="image/tg.png" alt="" class="tg" style="display: none">
            <div class="tg-content">
                <ul>${str}</ul>
            </div>
            `
            $(tgTemp).appendTo('#tg')
		},
		showTg:function(){
			if( this.tgs && this.tgs.length > 0 && (this.tgs[0].title.length > 0 || this.tgs[0].content.length > 0) ){
				this.createTg()
				$('.tg').show()
			}
		},
		showStu:function(){
			$('.tea').remove()
			$('.stu').removeClass('hide')
		},
		showTea:function(){
			$('.stu').remove()
			$('.tea').removeClass('hide')
			this.showTg()
		},
		showMainPage:function(){
			let userType = this.userType()
			switch (userType) {
				case 'stu' : 
					this.showStu();
					break;
				default:
					this.showTea();
			}
		},
		bindEvents:function() {
			$('#tg').on('click','.tg',function() {
				if(!this.tgMoved){
					this.tgMoved = true
					$('.tg-content,.tg').addClass('active').removeClass('re-active')
				}else{
					this.tgMoved = false
					$('.tg-content,.tg').addClass('re-active').removeClass('active')
				}
			})
		},
		init:function(){
			this.setBg()
			this.showMainPage()
			this.bindEvents()
		}
	}
	data.init()
})