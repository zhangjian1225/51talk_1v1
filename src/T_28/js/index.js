"use strict"
import '../../common/js/common_1v1.js'
import '../../common/js/drag.js'
const isSync =parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;

$(function(){
	var h5SyncActions = parent.window.h5SyncActions;
	if ( $(window.frameElement).attr('id') === 'h5_course_self_frame' ) {
        Tracking.init(h5SyncActions.classConf,{
        	tplate:'TD002'
        });
    }
	let staticData = configData.source;
	let seleList = staticData.seleList;

	//spell
	(function fnSpell(){
		let showImg = new Image();
		showImg.src = staticData.img;
		$('.dis-area-img').append(showImg);

		const pos = {l:9.8,t:0};
		const pos1 = {l:10,t:0.2};
		let ele='',x,y,x1,y1,l_val = 2.8,t_val = 2.8;
		for(let i=0,length=seleList.length;i<length;i++){
			x = pos.l+(i%3)*l_val;
			y = pos.t+(parseInt(i/3))*t_val;
			x1 = pos1.l+(i%3)*l_val;
			y1 = pos1.t+(parseInt(i/3))*t_val;
			ele+='<div class="ansBot-area" data-index="item-'+i+'" style="left:'+x+'rem;top:'+y+'rem"></div><div class="ans-area" data-syncactions=item-'+i+' style="left:'+x1+'rem;top:'+y1+'rem"><img src="'+seleList[i].img+'"/></div>'
		}
		$('.stage').append(ele);


		//图片尺寸大小判断
		$(".ans-area img").on("load",function(){
		   contrImgSize.call(this);
		});
  
	  	function contrImgSize(){
	    	var _this = $(this),
	    	imgWidth = _this.get(0).naturalWidth,
	    	imgHeight = _this.get(0).naturalHeight,
	    	containerScale = imgWidth / imgHeight;   //容器的宽高比
	    	if( containerScale < 1 ){//瘦高型
	    		if(imgHeight>206){
	    			_this.css({
		        		height:'100%',
		        		width:'auto'
		      		});
		      		_this.data("size",{width:'auto',height:'100%'})//记录图片开始位置尺寸
	    		}else{
		      		_this.css({
		        		height:imgHeight/100+"rem",
		        		width:'auto'
		      		});
		      		_this.data("size",{width:'auto',height:imgHeight/100+"rem"})
	    		}
	    		_this.parent('.ans-area').data("size",{width:imgWidth,height:imgHeight})//记录图片本身尺寸，用于拖动后父容器重新调整大小
	    	}else{//胖矮型
	    		if(imgWidth>206){
	    			_this.css({
		        		width:'100%',
	        			height:'auto'
		      		});
		      		_this.data("size",{width:'100%',height:'auto'})
	    		}else{
		      		_this.css({
		        		width:imgWidth/100+"rem",
		        		height:'auto'
		      		});
		      		_this.data("size",{width:imgWidth/100+"rem",height:'auto'})
	    		}
	      		_this.parent('.ans-area').data("size",{width:imgWidth,height:imgHeight})
	    	}
	  	}
	})()

	  if(configData.source.question ) {
	    $('.dis-area-img').css('height','6rem')
		$('.title-text p').text(configData.source.question)
		$('.btns').show()
		if($('.title-text p').height()/window.base<0.8){
			$('.title-text p').css({
				"height":"0.8rem",
				"line-height":"1rem",
				"text-align": "center"
			})
			$('.downBtn').css({
				"opacity":"0.6"
			})
		}
	  }


	//点击上下翻页按钮
	if(($('.title-text p').height() / window.base - $('.title-text').height() / window.base)<=0){
		$(".downBtn").addClass('noChange').css('background','#fdd132').find('img').css('opacity',0.8)
	}
	let isReScrollUp = true;
	let contentReUp = 0;
	$(".upBtn").on("click touchstart", function(e) {
		if(e.type=="touchstart"){
            e.preventDefault()
        }
        e.stopPropagation();
		if (isReScrollUp) {
			isReScrollUp = false;
			if (contentReUp <= 0) {
				$(this).css('background','#fdd132').find('img').css('opacity',0.8);
				$(this).addClass('noChange')
				isReScrollUp = true;
			}else{
				if (!isSync) {
					$(this).trigger("syncgoReUp");
					return;
				}
				SDK.bindSyncEvt({
					sendUser: '',
					receiveUser: '',
					index: $(e.currentTarget).data("syncactions"),
					eventType: 'click',
					method: 'event',
					syncName: 'syncgoReUp'
				});	
			}
		}
	});
	$(".upBtn").on("syncgoReUp", function(e) {
		contentReUp -= 0.6;
		contentReUp = parseFloat(contentReUp);
		$('.downBtn').removeClass('noChange').css('background','#ffc600').find('img').css('opacity',1);
		$('.title-text p').css('top', -contentReUp + 'rem').css({
			"transition": "all 0.3s"
		});
		SDK.setEventLock();
		isReScrollUp = true;
	});
	let isScrollReDown = true;
	$(".downBtn").on("click touchstart", function(e) {
		if(e.type=="touchstart"){
            e.preventDefault()
        }
        e.stopPropagation();
		if (isScrollReDown) {
			isScrollReDown = false;
			let diffHeight = $('.title-text p').height() / window.base - $('.title-text').height() / window.base;
			if (contentReUp >= diffHeight) {
				$(this).css('background','#fdd132').find('img').css('opacity',0.8);
				$(this).addClass('noChange')
				isScrollReDown = true;
			}else{
				if (!isSync) {
					$(this).trigger("syncgoRedown");
					return;
				}
				SDK.bindSyncEvt({
					sendUser: '',
					receiveUser: '',
					index: $(e.currentTarget).data("syncactions"),
					eventType: 'click',
					method: 'event',
					syncName: 'syncgoRedown'
				});
			}
		}
	});
	$(".downBtn").on("syncgoRedown", function(e) {
		contentReUp += 0.6;
		contentReUp = parseFloat(contentReUp);
		$('.upBtn').removeClass('noChange').css('background','#ffc600').find('img').css('opacity',1);
		$('.title-text p').css({'top':-contentReUp + 'rem',"transition": "all 0.3s"})
		SDK.setEventLock();
		isScrollReDown = true;
	});
	//鼠标按下改变状态
	$(".sameBtn").on("mousedown touchstart", function(e) {
		if(e.type=="touchstart"){
			e.preventDefault()
		}
		e.stopPropagation()
		if(!$(this).hasClass('noChange')){
			$(this).css({
				"background":"#ffba00",
			})
			$(this).find('img').css('opacity',0.7)
		}
	})
	$(".sameBtn").on("mouseup touchend", function(e) {
		if(e.type=="touchstart"){
			e.preventDefault()
		}
		e.stopPropagation();
		if(!$(this).hasClass('noChange')){
			$(this).css({
				"background":"#ffc600",
			})
			$(this).find('img').css('opacity',1)
		}
	})
	//===============================
	//添加拖拽
	var dragBefore = true;
	var dragEnd = true;
	var dragProcess = true;
	var lock = true;

	$('.ans-area').drag({
		before: function(e) {
			//if(dragBefore) {
			//dragBefore = false;

			if (!isSync) {

				$(this).trigger('syncDragBefore', {
					left: $(this).data('startPos').left,
					top: $(this).data('startPos').top,
					pageX: '',
					pageY: '',
				});
				return;
			}

			SDK.bindSyncEvt({
				index: $(this).data('syncactions'),
				eventType: 'dragBefore',
				method: 'drag',
				left: $(this).data('startPos').left,
				top: $(this).data('startPos').top,
				pageX: '',
				pageY: '',
				syncName: 'syncDragBefore'

			});
		},
		process: function(e) {
			/*if (!isSync) {
				$(this).trigger('syncDragProcess', {
					left: $(this).attr('data-left'),
					top: $(this).attr('data-top'),
					pageX: '',
					pageY: '',
				});
				return;
			}


			if (lock) {
				lock = false;
				setTimeout(function() {
					SDK.bindSyncEvt({
						index: $(this).data('syncactions'),
						eventType: 'dragProcess',
						method: 'drag',
						left: $(this).attr('data-left'),
						top: $(this).attr('data-top'),
						pageX: '',
						pageY: '',
						syncName: 'syncDragProcess'
					});
					lock = true;
				}.bind(this), 300);
			}*/
		},
		end: function(e) {
			if (!isSync) {
				$(this).trigger('syncDragEnd', {
					left: $(this).attr('data-left'),
					top: $(this).attr('data-top'),
					pageX: '',
					pageY: '',
				});
				return;
			}

			setTimeout(function() {
				SDK.bindSyncEvt({
					index: $(this).data('syncactions'),
					eventType: 'dragEnd',
					method: 'drag',
					left: $(this).attr('data-left'),
					top: $(this).attr('data-top'),
					pageX: '',
					pageY: '',
					syncName: 'syncDragEnd',
					questionType:'TD',
                    tplate:'TD002'
				});
			}.bind(this), 300);
		}
	});
	var existNum = 0;
	$('.ans-area').on("syncDragBefore", function(e, pos) {
		$(this).css('z-index',existNum);
		var dataIndex = $(this).data('syncactions')
			
		let criticlaValue = $('.dis-area').position().left + $('.dis-area').width() - ($(this).width() / 2),
			nowLeft = parseInt($(this).position().left);
		if(nowLeft<criticlaValue){
			$('.ansBot-area[data-index='+dataIndex+']').css('display','block')
			$('.ansButton-area').css('display','none')
		}else{
			$('.ansBot-area[data-index='+dataIndex+']').css('display','none')
		}
		existNum++;
		$(this).attr('tag','true');//是否可提交标记
		SDK.setEventLock();
	});

	/*$('.ans-area').on("syncDragProcess", function(e, pos) {
		$(this).css({
			'left': pos.left,
			'top': pos.top
		});
		SDK.setEventLock();
		//lock = true;
	});*/

	$('.ans-area').on("syncDragEnd", function(e, pos) {

		var startPos = $(this).data('startPos');
		var dataIndex = $(this).data('syncactions')
		let criticlaValue = $('.dis-area').position().left + $('.dis-area').width() - ($(this).width() / 2),
			nowLeft = parseInt(pos.left) * window.base;
		if(nowLeft<criticlaValue){
			$('.ansBot-area[data-index='+dataIndex+']').css('display','none')
			var _size = $(this).data('size');
			$(this).css({
				'width':_size.width/100+'rem',
				'height':_size.height/100+'rem',
				'border-radius':'0',
				'line-height':'0',
				'left': pos.left,
				'top': pos.top
			});

			$(this).find('img').css({'width':_size.width/100+'rem','height':_size.height/100+'rem'});
		}else{
			$('.ansBot-area[data-index='+dataIndex+']').css('display','block')
			var startPos = $(this).data('startPos');
			$(this).css({'left':startPos.left,'top':startPos.top});
			var dataIndex = $(this).data('syncactions')
			$('.ansBot-area[data-index='+dataIndex+']').css('display','block')
			$(this).attr('tag','false');
			$(this).resetStart();
		}

		//检测是否可提交
		if($(".ans-area[tag=true]").length>=$('.ans-area').length){
			$('.ansButton-area').css('display','block')
			SDK.setEventLock();
		}else{
			$('.ansButton-area').css('display','none')
			SDK.setEventLock();
		}
		//SDK.setEventLock();

	});

	//提交
	var btnClickTimer = true;
	$('.ans-btn').on("click touchstart", function(e) {
		if(e.type=="touchstart"){
            e.preventDefault()
        }
        e.stopPropagation();
		if (btnClickTimer) {
			btnClickTimer = false;

			if (!isSync) {
				$(this).trigger('syncBtnClick');

				return;
			}
			if (window.frameElement.getAttribute('user_type') == 'stu') {
				SDK.bindSyncEvt({
					sendUser: '',
					receiveUser: '',
					index: $(this).data('syncactions'),
					eventType: 'click',
					method: 'event',
					syncName: 'syncBtnClick',
					questionType:'TD',
					tplate:'TD002'
				});	
			}
		}
	});
	$('.ans-btn').on('syncBtnClick',function(e,message){//学生提交操作
		$('.cover').show();
		$('.ans-btn img').attr('src','./image/submit2.png')
		if(isSync){
			SDK.bindSyncResultEvt({
				sendUser: message.data[0].value.sendUser,
                receiveUser: message.data[0].value.receiveUser,
                sendUserInfo: message.data[0].value.sendUserInfo,
                index: $('#container').data('syncresult'),
                syncName: 'syncResultClick',
                resultData:{},
				questionType:'TD',
                tplate:'TD002'
            });
	    }
		SDK.setEventLock();
		btnClickTimer = true;
	})
});
jQuery.fn.extend({ 
		resetStart: function(size){
			var thisObj=this;
			//sync
			var startPos = $(this).data('startPos');
			var $left = startPos.left;
			var $top = startPos.top;
			thisObj.css({
				'left':$left,
				'top':$top,
				'width': '2rem',
				'height': '2rem',
				'border-radius': '.3rem'
			});
			var _img = thisObj.find('img');
			var _originSize = _img.data('size');
			_img.css({
				'width': _originSize.width,
				'height': _originSize.height
			})
			$(this).attr('tag','false');
			
	    }
	});