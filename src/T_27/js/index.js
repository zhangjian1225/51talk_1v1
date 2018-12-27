"use strict"
import '../../common/js/common_1v1.js'
import '../../common/js/drag.js'
const isSync =parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;

$(function(){
	var h5SyncActions = parent.window.h5SyncActions;
	// if ( $(window.frameElement).attr('id') === 'h5_course_self_frame' ) {
    //     Tracking.init(h5SyncActions.classConf,{
    //     	tplate:'TD001'
    //     });
    // }

	let staticData = configData.source;
	let seleList = staticData.seleList;

	//spell
	(function fnSpell(){
		//判断question是否有内容
		var textHtml = ''
		var imgHtml = ''
		if(staticData.question){
			textHtml = `
				<div class="dis-img" style="width:100%;height:6.3rem;border-radius: 0.6rem;overflow:hidden">
					<img src="${staticData.img}" style="width:100%;height:100%;"/>
				</div>
				<div class='dis-text'>
					<p>${staticData.question}</p>
				</div>
			`
			$('.dis-area').html(textHtml)
		}else{
			imgHtml = ` <div class="dis-img" style="width:100%;height:100%;border-radius: 0.6rem;overflow:hidden"><img src="${staticData.img}" style="width:100%;height:100%;"/></div>`
			$('.dis-area').html(imgHtml)
			$('.btns').hide()
		}
		const pos = {l:9.85,t:.35};
		let ele='',x,y,l_val = 2.8,t_val = 2.64;
		for(let i=0,length=seleList.length;i<length;i++){
			x = pos.l+(i%3)*l_val;
			y = pos.t+(parseInt(i/3))*t_val;
			ele+='<div class="ansBot-area" style="left:'+x+'rem;top:'+y+'rem"></div><div class="ans-area" data-syncactions=item-'+i+' style="left:'+x+'rem;top:'+y+'rem"><img src="'+seleList[i].img+'" style="left:'+x+'rem;top:'+y+'rem" /><i></i></div>'
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
	if (isSync && window.frameElement.getAttribute('user_type') == 'tea') {
		$('.ans-btn').text('Done');
	}
	// if( !configData.desc && !configData.source.title ) {
	// 	$('.commom').hide();
	// 	$('.stage').css('margin-top', '1.3rem');
	// }
	// if( configData.desc!='' && staticData.title=='' ) {
	// 	$('.commom .title').hide();
	// 	$('.stage').css('margin-top', '.4rem');
	// }

	if(configData.source.question ) {
		if($('.dis-text p').height()/window.base<0.5){
			$('.dis-text p').css({
				"height":"1rem",
				"line-height":"1rem",
				"text-align": "center"
			})
		}
	  }
	//=================================
	//点击上下翻页按钮
	if(($('.dis-text p').height() / window.base - $('.dis-text').height() / window.base)<=0){
		$(".downBtn").addClass('noChange').find('img').css('opacity','0.3')
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
				$(this).addClass('noChange').find('img').css('opacity','0.3')
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
		$(".downBtn").removeClass('noChange').find('img').css('opacity','1')
		$('.dis-text p').css('top', -contentReUp + 'rem').css({
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
			let diffHeight = $('.dis-text p').height() / window.base - $('.dis-text').height() / window.base;
			if (contentReUp >= diffHeight) {
				$(this).addClass('noChange').find('img').css('opacity','0.3')
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
		$(".upBtn").removeClass('noChange').find('img').css('opacity','1')
		$('.dis-text p').css({'top':-contentReUp + 'rem',"transition": "all 0.3s"})
		SDK.setEventLock();
		isScrollReDown = true;
	});
	//鼠标按下改变状态
	$('.sameBtn').on('mousedown touchstart',function(e){
		if(e.type=="touchstart"){
            e.preventDefault()
        }
		e.stopPropagation()
		if(!$(this).hasClass('noChange')){
			$(this).css({
				"background":"rgba(0,0,0,0.08)",
			})
			$(this).find('img').css({
				opacity:0.2
			})
		}
	})
	$('.sameBtn').on('mouseup touchend',function(e){
		if(e.type=="touchstart"){
            e.preventDefault()
        }
		e.stopPropagation()
		if(!$(this).hasClass('noChange')){
			$(this).css({
				"background":"none",
			})
			$(this).find('img').css({
				opacity:1
			})
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
			// if (!isSync) {
			// 	$(this).trigger('syncDragProcess', {
			// 		left: $(this).attr('data-left'),
			// 		top: $(this).attr('data-top'),
			// 		pageX: '',
			// 		pageY: '',
			// 	});
			// 	return;
			// }


			// if (lock) {
			// 	lock = false;
			// 	setTimeout(function() {
			// 		SDK.bindSyncEvt({
			// 			index: $(this).data('syncactions'),
			// 			eventType: 'dragProcess',
			// 			method: 'drag',
			// 			left: $(this).attr('data-left'),
			// 			top: $(this).attr('data-top'),
			// 			pageX: '',
			// 			pageY: '',
			// 			syncName: 'syncDragProcess'
			// 		});
			// 		lock = true;
			// 	}.bind(this), 300);
			// }
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

			SDK.bindSyncEvt({
				index: $(this).data('syncactions'),
				eventType: 'dragEnd',
				method: 'drag',
				left: $(this).attr('data-left'),
				top: $(this).attr('data-top'),
				pageX: '',
				pageY: '',
				syncName: 'syncDragEnd'
			});
		}
	});
	//=======================================================
	var existNum = 0;
	$('.ans-area').on("syncDragBefore", function(e, pos) {
		//if($(this).attr('tag')!='true'){//定位层级控制
			$(this).css('z-index',existNum);
			existNum++;
		//}
		$(this).attr('tag','true');//是否可提交标记
		// $(this).data('startPos', {
		// 	left: pos.left,
		// 	top: pos.top
		// });
		SDK.setEventLock();
	});

	/*
	$('.ans-area').on("syncDragProcess", function(e, pos) {
		$(this).css({
			'left': pos.left,
			'top': pos.top
		});
		SDK.setEventLock();
		//lock = true;
	});
	*/
	$('.ans-area').on("syncDragEnd", function(e, pos) {
		var startPos = $(this).data('startPos');
		let criticlaValue = $('.dis-area').position().left + $('.dis-area').width() - ($(this).width() / 2),
			nowLeft = parseInt(pos.left) * window.base;
		if(nowLeft<criticlaValue){
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
			$(this).resetStart();
		}

		//检测是否可提交
		if($(".ans-area[tag=true]").length>0){
			if (isSync && window.frameElement.getAttribute('user_type') == 'stu') {
				$('.ans-btn').addClass('allowSub');
			} else if (!isSync) {
				$('.ans-btn').addClass('allowSub');
			}
			SDK.setEventLock();
		}else{
			$('.ans-btn').removeClass('allowSub');
			SDK.setEventLock();
		}
	});
	//提交
	var btnClickTimer = true;
	$('.ans-btn').on("click", function(e) {
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
					syncName: 'syncBtnClick'
				});
			}
		}
	});
	$('.ans-btn').on('syncBtnClick',function(e,message){
		
			$(this).text('Done').removeClass('allowSub');
			$('.cover').show();
			// if(isSync){
			// 	SDK.bindSyncResultEvt({
			// 		sendUser: message.data[0].value.sendUser,
            //         receiveUser: message.data[0].value.receiveUser,
            //         sendUserInfo: message.data[0].value.sendUserInfo,
	        //         index: $('#container').data('syncresult'),
	        //         syncName: 'syncResultClick',
	        //         resultData:{}
	        //     });
		    // }
		
		SDK.setEventLock();
		btnClickTimer = true;
	})

	//老师端响应
	let stuNameEle = '',
		userList = [];

	/*if(isSync){
		const _appointMemberList = SDK.getClassConf().appointMemberList;
		if(_appointMemberList!=null && _appointMemberList.length>0){
			for(let i=0,length=_appointMemberList.length;i<length;i++){
				if(_appointMemberList[i].role == 'stu'){
					userList.push(_appointMemberList[i]);
				}
			}
			
			for(let i=0,length=userList.length;i<length;i++){
				stuNameEle+= '<div class="stuNameList" id='+userList[i].uid+'>'+userList[i].name+'</div>';
			}
			$('.showName-area').html(stuNameEle);
		}
	}*/

	let userId = '';
	$('#container').on('syncResultClick',function(e,message){
		var sendUserInfo = message.data[0].value.sendUserInfo;
		if(sendUserInfo.type == 'stu'){
			userId = sendUserInfo.id;
		}
		$('.stuNameList[id='+userId+']').addClass('stuName-active');
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
			'width': '2.06rem',
			'height': '2.06rem',
			'border-radius': '.8rem'
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