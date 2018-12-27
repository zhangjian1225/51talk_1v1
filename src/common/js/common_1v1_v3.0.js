// 第二期通用功能
"use strict"
require('./commonFunctions.js');
$(function(){

	const data = {
		bg:configData.bg,
		tgs:configData.tg,
		tgMoved:false,
		desc: configData.desc,
		title: configData.title,
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
		/**
		 * 设置标题
		 */
		setTitle: function () {
			if (configData.desc != '') {
				$('.desc').show();
				$('.desc').html(configData.desc);
			}
			if (configData.title != '') {
				$('.title').show();
				$('.title h3').html(configData.title);
			}
		},
		/**
		 * 设置背景图
		*/
		setBg:function(){
			if(this.bg){
				$('.container').css('background-image','url('+ this.bg +')')
			}
		},
		/**
		 * 控制是否显示tg 
		*/
		showTg: function () {
			if (this.sync) {
				if (window.frameElement.getAttribute('user_type') == 'tea' ) {
					if( this.tgs && this.tgs.length > 0 && (this.tgs[0].title.length > 0 || this.tgs[0].content.length > 0) ){
						this.createTg('1')
					} else {
						this.createTg('0')
					}
				}
			} else {
				if (this.getQueryString('role') === '1') {// 代表老师iframe
					if( this.tgs && this.tgs.length > 0 && (this.tgs[0].title.length > 0 || this.tgs[0].content.length > 0) ){ 
						let html = `<section class="tea">
							<div id="tg"></div>
						</section>`
						$('.container').append(html);
						this.createTg('3')
					}
				} else if (this.getQueryString('role') === '2') {

				} else {
					if( this.tgs && this.tgs.length > 0 && (this.tgs[0].title.length > 0 || this.tgs[0].content.length > 0) ){ 
						let html = `<section class="tea">
							<div id="tg"></div>
						</section>`
						$('.container').append(html);
						this.createTg('3')
					}	
				}
			}
		},
		/**
		 * 构建tg结构
		*/
		createTg: function (msg) {
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
			tgTemp = `<img src="image/tg.png" alt="" class="tg">
			<div class="tg-content">
				<ul>${str}</ul>
			</div>`
			if (this.sync) {
				if ( msg == '1' ) {
					parent.window.h5SyncActions.isCreateTg('1', tgTemp);
				} else if ( msg == '0') {
					parent.window.h5SyncActions.isCreateTg('0', '');
				}
			} else {
				if (msg == '3') {
					$(tgTemp).appendTo('#tg')
				}
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
			this.showTg();
			this.setBg();
			this.setTitle();
			this.bindEvents();
		}
	}

	data.init()
})