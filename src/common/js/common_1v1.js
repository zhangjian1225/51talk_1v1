// 第二期通用功能
"use strict"
require('./commonFunctions.js');
$(function(){

	const data = {
		bg:configData.bg,
		tgs:configData.tg,
		tgMoved:false,
		level:configData.level?configData.level:{
			high:[],
			low:[]
		},
		highMoved: false,
		lowMoved: false,
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
			let that = this;
			$('#tg').on('click','.tg',function() {
				if(!that.tgMoved){
					that.tgMoved = true
					$('.tg-content,.tg').addClass('active').removeClass('re-active')
				}else{
					that.tgMoved = false
					$('.tg-content,.tg').addClass('re-active').removeClass('active')
				}
			})
			$('#highTgBtn').on('click',function () {
				if(!that.highMoved){
					that.highMoved = true;
					that.lowMoved = false;
					$('.highTg').addClass('active').removeClass('re-active').css('z-index','1000');
					$('.lowTg').addClass('re-active').removeClass('active').css('z-index','1001');
				}else{
					that.highMoved = false
					$('.highTg').addClass('re-active').removeClass('active')
				}
			})
			$('#lowTgBtn').on('click',function () {
				if(!that.lowMoved){
					that.lowMoved = true;
					that.highMoved = false;
					$('.lowTg').addClass('active').removeClass('re-active').css('z-index','1000');
					$('.highTg').addClass('re-active').removeClass('active').css('z-index','1001');

				}else{
					that.lowMoved = false
					$('.lowTg').addClass('re-active').removeClass('active');
				}
			})
		},
		/**
		 * 控制显示lev 
		*/
		showLev: function () {
			if (this.sync) {
				if (window.frameElement.getAttribute('user_type') == 'tea' ) {
					if (this.level) {
						this.createLevel('1');
					} else {
						this.createLevel('0');
					}	
				}
			} else {
				if (this.getQueryString('role') === '1') {// 代表老师iframe
					this.createLevel('3');
				} else if (this.getQueryString('role') === '2') {

				} else {
					this.createLevel('3');
				}
			}
		},
		/**
		 * 创建元素 
		*/
		createLevel: function (status) {
			let levelHighHtml = '';
			let levelLowHtml = '';
			this.level.high.forEach(function(item,index){
				levelHighHtml+=`
					<div class="highTitle">
						<span class="highIndex">${index+1}</span>
						<h3>${item.title}</h3>
					</div>
					<p class="highCon">${item.content}</p>
				`
			})
			this.level.low.forEach(function(item,index){
				levelLowHtml+=`
					<div class="lowTitle">
						<span class="lowIndex">${index+1}</span>
						<h3>${item.title}</h3>
					</div>
					<p class="lowCon">${item.content}</p>
				`
			})
			let levHigh = ``;
			if (this.level.high.length>0 && this.level.high[0].title != ''  || this.level.high[0].content != '') {
				levHigh = `
					<div class="highTg">
						<div class="highTgCon">
							${levelHighHtml}
						</div>
						<span class="highTgBtn" id="highTgBtn">H</span>
					</div>
				`
			}
			let levLow = ``;
			if (this.level.low.length>0 && this.level.low[0].title != '' || this.level.low[0].content != '') {
				levLow = `
					<div class="lowTg">
						<div class="lowTgCon">
							${levelLowHtml}
						</div>
						<span class="lowTgBtn" id="lowTgBtn">L</span>
					</div>
				`
			}
			let levelHtml = `
				<div class="level">
					${levHigh}
					${levLow}
				</div>

			`
			if (this.sync) {
				if (status == '1') {
					parent.window.h5SyncActions.isCreateLevelTg('1',levelHtml);
				} else {
					parent.window.h5SyncActions.isCreateLevelTg('0','');
				}
			} else {
				$('.container').append(levelHtml);
			}
		},
		init:function(){
			this.showLev();
			this.showTg();
			this.setBg();
			this.setTitle();
			this.bindEvents();
		}
	}

	data.init()
})