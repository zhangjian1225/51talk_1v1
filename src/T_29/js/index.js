"use strict"
import '../../common/js/common_1v1.js'
import '../../common/js/commonFunctions.js';
$(function() {
	// 埋点：进入页面
	var h5SyncActions = parent.window.h5SyncActions;
	// if ( $(window.frameElement).attr('id') === 'h5_course_self_frame' ) {
	// 	Tracking.init(h5SyncActions.classConf, {
	// 		tplate: 'TC006'
	// 	});
	// parent.window.dataReport.tracking && parent.window.dataReport.tracking.init(h5SyncActions.classConf, {
	// 	tplate: 'TC006'
	// });
	//initTrack('TC006')
	// }

	/**
	 * 控制器调用的变量
	 */
	// window.h5Template = {
	// 	hasFourWindow: '1', //0 表示不显示四格
	// }

	let staticData = configData.source;
	let optionsArr = staticData.options;
	let containAudio =staticData.audio;
		//判断选项是否为对话形式1111111111111111111
	let dialogueOpt;
	function getDialogueLength(obj,num){
			let count=obj.split('<br/>')
			// console.log(count,'qqq')
			if (count.length>=num) {
				dialogueOpt=true;
			}
		return dialogueOpt;
	}
	// //判断选项是否为对话形式222222222222222
	// let dialogueOpt2;
	// function getDialogueLength2(obj,num){
	// 		let count=obj.split('<br/>')
	// 		//console.log(count,'qqq')
	// 		if (count.length >num) {
	// 			dialogueOpt2=true;
	// 		}
	// 	return dialogueOpt2;
	// }
	//var ansRightId; //答对的ID
	function spell() {
		let str1 = '',
			str2 = '',
			str3 = '',
			optionsNum = ['A', 'B', 'C', 'D'];
		str1 = '<div class="quesArea"><div class="textArea"><div class="textAreaBox"><div class="textImage"><div class="shadow"></div><img src="'+staticData.textImage +'"/></div><div class="textShow"><div class="textContain"><div class="text">' + staticData.text + '</div></div><div class="btnBox"><div class="btn upbtn noclickUp" data-syncactions="up"></div><i class="btn-line"></i><div class="btn downbtn clickDown" data-syncactions="down"></div></div></div></div></div><div class="ques"><div class="textQues"><div class="QuesShow"><p>' + staticData.textQues + '</p></div></div><div class="optionsList"><ul>';
		//学生端
		let optionsBtn='';
		for (var i = 0, length = staticData.options.length; i < length; i++) {
			str2 += '<li class="options" data-id='+i+' data-syncactions="options-' + i + '"><audio webkit-playsinline controls preload="preload" src="audio/wrong.mp3"></audio><span class="answerIcon"></span><span class="optionsText"></span><div class="line-box"><div class="ans-line"  data-top="0" ><p class="answer">' + staticData.options[i] + '</p></div></div></li>';
			optionsBtn+=`<div class="options-btn"><span class="btn btns up_btn0 upBtn${i} up" data-syncactions='up-${i}' href="javascript:void(0);"></span><span class="btn btns down_btn0 down_btnable downBtn${i} down" data-syncactions='down-${i}' href="javascript:void(0);"></span></div>`;
		}
		str3 = str1 + str2 + '</ul>'+optionsBtn+'</div></div></div>';
		$(".stage").append(str3);
		let textH = $(".text").height();
		let textContainH = $(".textContain").height();
		//判断短文是否溢出textContain容器,产生滚动条
		if (textH > textContainH) {
			//显示反转短文按钮
			$(".btn").css({
				"display": "block"
			});
		}
		//存在音频时，添加该元素
		if(containAudio){
			let audioList=`<div class="audioList" data-syncactions="audioBtn">
								<img src="image/btn-audio.png" />
								<audio class="audioSrc" webkit-playsinline controls src="${staticData.audio}"></audio>
							</div>`
			$(".textAreaBox").append(audioList);
		}
		// 检查是否有textShow
		if(staticData.text==''){
			$(".textShow").css({display:"none"});
			$(".textImage").css({height:"8rem"});
			//不存在短文时音频的位置
			$(".audioList").css({
				top:"7.2rem",
				right:"0.35rem"
			})
		}else{
			//存在短文时音频的位置
			$(".audioList").css({
				top:"4.3rem",
				left:"3.6rem"
			})
		}
		let listBox=$(".optionsList"); //选项区域
		let list=$(".optionsList .options"); //选项
		let num=list.length; //选项个数
		let isLong=false;
		let index = [];  //存储超过限制字数的选项下标
		// if(staticData.title){
		// 	$(".lookTitle").append(`<span>${staticData.title}</span>`);
		// 	$(".lookTitle").css({
		// 		height:'1.5rem'
		// 	})
		// }else{
		// 	$(".quesArea").css({
		// 		"margin-top":"1.5rem"
		// 	});
		// 	$(".lookTitle span").css({
		// 		"margin-top": ".45rem",
		// 		display:"none"
		// 	})
		// }

		if(staticData.textQues&&!staticData.text){
			$(".textAreaBox").css({height:"8rem"});
			$(".optionsList").css({bottom:'0.2rem'})
			if(num==4){
				setListMargin(4,0.25);
				$(".options").css({
					'padding':'0.35rem 0'
				})
				isShowBtn(0.84);
				setBtnPos2(1.54,1.8)
			}else if(num==3){
				setListMargin(3,0.4);
				setListWidth(list,2);
				isShowBtn(1.36);
				setBtnPos2(2,2.4)
			}else if(num==2){
				setListMargin(2,0.6);
				setListWidth(list,2.6);
				$(".options").css({
					'padding':'0.34rem 0'
				})
				isShowBtn(1.92);
				setBtnPos2(2.6,3.2)
			}
		}else if(!staticData.textQues&&!staticData.text){
			$(".textImage").css({height:"8rem"});
		}else if(staticData.textQues){//存在问题时，选项的布局
			if(num==4){
				setListMargin(4,0.26);
				$(".options").css({
					'padding':'0.35rem 0'
				})
				isShowBtn(0.84);
				setBtnPos2(1.54,1.8)
			}else if(num==3){
				setListMargin(3,0.38);
				setListWidth(list,2);
				isShowBtn(1.36);
				setBtnPos2(2,2.38)
			
			}else if(num==2){
				setListMargin(2,0.6);
				setListWidth(list,2.6);
				$(".optionsList").css({
					'bottom':"0.62rem"
				})
				$(".options").css({
					'padding':'0.34rem 0'
				})
				isShowBtn(1.92);
				setBtnPos2(2.6,3.2)
			}
		}

			//console.log(getDialogueLength(),'11')

			// function getOptionLong(maxLength){
			// 	$(optionsArr).each(function(i, arr) {
			// 		if (arr.length >=maxLength) {
			// 			isLong=true;
			// 		}
			// 	});
			// 	return isLong;
			// }

		//没有问题时  选项的布局	
		
		if(staticData.textQues==''){
			$(".textAreaBox").css({height:"8rem"});
			listBox.css({"padding":"0.4rem 0 0 0rem "});
			$(".textArea").css({"padding":"0.4rem 0 0 0.2rem "});
			
			if(num==4){
				setListMargin(4,0.26);
				setUlPos($(".optionsList").outerHeight(true)/window.base);
				$(".options").css({
					'padding':'0.35rem 0'
				})
				isShowBtn(0.84);
				setBtnPos(1.54,1.8);
			}else if(num==3){
				setListWidth(list,2);
				setListMargin(3,0.4);
				setUlPos($(".optionsList").outerHeight(true)/window.base);
				isShowBtn(1.36);
				setBtnPos(2,2.4)
			}else {
				$(".options").css({
					'padding':'0.34rem 0'
				})
				setListWidth(list,2.6);
				setListMargin(2,0.6);
				setUlPos($(".optionsList").outerHeight(true)/window.base);
				isShowBtn(1.92);
				setBtnPos(2.6,3.2)
			}
			
		}
		//设置选项的marginbottom
		function setListMargin(num,margin){
			for(let i=0;i<num-1;i++){
				$(".optionsList .options").eq(i).css({
				"margin-bottom":margin+"rem"
				});
			}
		}
		//设置选项的高度
		function setListWidth(obj,h){
			obj.css({
				height:h+"rem",
			});
		}
		//设置选项的整体位置
		function setUlPos(h){
			$(".optionsList").css({
				'bottom':'50%',
				'margin-bottom':-h/2+"rem"
			})
		}

		//根据选项滑动按钮的位置
		function setBtnPos(h,top){
			let options=$(".options");
			if($(".options-btn")){
				let btnPos=$(".options-btn");
				options.each(function(i,arr){
					btnPos.eq(i).css({
						'height':h+'rem',
						'top':top*i+0.4+'rem'
					})
				})				
			}
		}
		function setBtnPos2(h,top){
			let options=$(".options");
			if($(".options-btn")){
				let btnPos=$(".options-btn");
				options.each(function(i,arr){
					btnPos.eq(i).css({
						'height':h+'rem',
						'top':top*i+0.26+'rem'
					})
				})				
			}
		}


		function isShowBtn(num){
			if ($(".answer")) {
				$(optionsArr).each(function(i, arr) {
					if ($(".ans-line").eq(i).height()/window.base> num) {
						index.push(i);
					}else{
						index.push("");
					}
				});
				// console.log(index,'cccccc')
				// for(let i=0;i<$(".options-btn").length;i++){
				// 	if (index[i] == i) {
				// 		console.log(i,'qqq')
				// 		$(".options-btn").eq(i).css({'display':"block"})
				// 		$(".ans-line").eq(i).addClass("optionScroll").css({
				// 			'padding-bottom':"0.35rem"
				// 		});
				// 	}
				// }

				$(".options-btn").each(function(i, arr) {
					if (index[i] == i&&index[i].toString()!="") {	
						$(arr).css({'display':"block"})
						$(".ans-line").eq(i).addClass("optionScroll").css({
							'padding-bottom':"0.35rem"
						});
					}
				});
			}			
		}
	}
	spell(); //拼写模版

	const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;

	//点击播放音频事件
	let isStartBtn=true;
	$('.audioList').on('click touchend',function(e){
		if(e.type=="touchend"){
			e.preventDefault()
		}
		if(isStartBtn){
			isStartBtn=false;
			console.log("触发音频事件")
			if(!isSync){
	    		$(this).trigger("audioSync");
	    		return 
			}
			if (window.frameElement.getAttribute('user_type') == 'tea') {
				SDK.bindSyncEvt({
					sendUser: '',
					receiveUser: '',
					index:$(e.currentTarget).data('syncactions'),
					eventType: 'click',
					method: 'event',
					funcType:'audio',
					syncName: 'audioSync'
				});
			} else {
				var $audio=null;
				$audio = document.getElementsByClassName("audioSrc")[0];
				var $img = $(this).find("img");
				$audio?$audio.play():"";
				if($img.length!=0){
					$img.attr("src", $(this).find("img").attr("src").replace(".png", ".gif"));
					  //播放完毕img状态
					  $audio.onended = function() {
						$img.attr("src", $(this).find("img").attr("src").replace(".gif", ".png"));
						//flag = true;//恢复点击
					}.bind(this);
				}
			}
    }
	});
	//老师端声音播放同步到学生端
	$('.audioList').on("audioSync",function(e,message){
		var $audio=null;
		$audio = document.getElementsByClassName("audioSrc")[0];
	    var $img = $(this).find("img");
	    if(!isSync){
	    	$audio?$audio.play():"";
		    if($img.length!=0){
			    $img.attr("src", $(this).find("img").attr("src").replace(".png", ".gif"));
			  	//播放完毕img状态
			  	$audio.onended = function() {
				    $img.attr("src", $(this).find("img").attr("src").replace(".gif", ".png"));
				    //flag = true;//恢复点击
				}.bind(this);
		    }
	    }else{
		    if( $(window.frameElement).attr('id') === 'h5_course_self_frame'&&message.operate!=5) {
		    	$audio?$audio.play():"";
			    if($img.length!=0){
				    $img.attr("src", $(this).find("img").attr("src").replace(".png", ".gif"));
				  	//播放完毕img状态
				  	$audio.onended = function() {
					    $img.attr("src", $(this).find("img").attr("src").replace(".gif", ".png"));
					    //flag = true;//恢复点击
					}.bind(this);
			    }
		    }	    	
	    }


	    SDK.setEventLock();
		isStartBtn=true;
	});

	//点击事件的所有变量
	let contentUp = 0;   //翻转短文的位置变量
	let answer;   //选择項对应的内容
	let that;   //选择项的下标

	//短文过长时出现的上下按钮可翻看全文
	let isScrollUp = false;
	// let contentUp = 0;  // 原始位置
	$(".stage .upbtn").on("click touchstart", function(e) {
		if(e.type=="touchstart"){
			e.preventDefault()
		}

		if (isScrollUp) {
			isScrollUp = false;
			if (!isSync) {
				$(this).trigger("syncgoUp");
				return;
			}
			SDK.bindSyncEvt({
				sendUser: '',
				receiveUser: '',
				index: $(e.currentTarget).data("syncactions"),
				eventType: 'click',
				method: 'event',
				syncName: 'syncgoUp',
				recoveryMode:'1',
				otherInfor:{
					contentUp:contentUp,
					answer:answer,
					choose:that!=undefined?that.index():''
				}
			});
		}
	});

	$(".stage .upbtn").on("syncgoUp", function(e,message) {
		// console.log("222up")
		if(isSync){
			//console.log("h5-svc-T103--------------------%s",JSON.stringify(message))
			let obj = message.data[0].value.syncAction.otherInfor;
			contentUp=obj.contentUp;
			if(message.operate==5){
				if(staticData.right.length>1){
					answer=obj.choose;
				}else{
					answer=obj.answer;
				}
				
				that=$(".options").eq(obj.choose);
				chooseOpt(answer,that);
			}
		}else{
			contentUp=contentUp;
		}

		let diffHeight = $('.text').height() / window.base - $('.textContain').height() / window.base;
		if (contentUp <= 0) {
			SDK.setEventLock();
			isScrollUp = false;

			$('.text').css('top', -contentUp + 'rem');
			$('.upbtn').css({
				"opacity": 0.8
			});
			return;
		}
		contentUp -= 0.48;
		// contentUp = parseFloat(contentUp.toFixed(1));
		if(isSync){
			if(message.operate!=5){
				$('.text').css('top', -contentUp + 'rem').css({
					"transition": "all 0.3s"
				});
			}else{
				$('.text').css('top', -contentUp + 'rem');
			}
		}else{
			$('.text').css('top', -contentUp + 'rem').css({
				"transition": "all 0.3s"
			});			
		}

		$('.downbtn').css({
			"opacity": 1
		});
		$('.downbtn').removeClass('noclickDown')
		isScrollDown = true;
		if (contentUp == 0) {
			$('.upbtn').css({
				"opacity": 0.8
			});
			$('.downbtn').addClass('clickDown')
			$('.upbtn').removeClass('clickUp')
		}
		SDK.setEventLock();
		isScrollUp = true;
	});

	let isScrollDown = true;
	$(".stage .downbtn").on("click touchstart", function(e) {
		if(e.type=="touchstart"){
			e.preventDefault()
		}

		if (isScrollDown) {
			isScrollDown = false;

			if (!isSync) {
				$(this).trigger("syncgodown");
				return;
			}
			SDK.bindSyncEvt({
				sendUser: '',
				receiveUser: '',
				index: $(e.currentTarget).data("syncactions"),
				eventType: 'click',
				method: 'event',
				syncName: 'syncgodown',
				recoveryMode:'1',
				otherInfor:{
					contentUp:contentUp,
					answer:answer,
					choose:that!=undefined?that.index():''
				}
			});
		}

	});
	$(".stage .downbtn").on("syncgodown", function(e,message) {
		// console.log("111down")
		if(isSync){
			// console.log("h5-svc-T103--------------------%s",JSON.stringify(message));
			let obj = message.data[0].value.syncAction.otherInfor;
			contentUp=obj.contentUp;
			if(message.operate==5){
				if(staticData.right.length>1){
					answer=obj.choose;
				}else{
					answer=obj.answer;
				}
				that=$(".options").eq(obj.choose);
				chooseOpt(answer,that)
			}
		}else{
			contentUp=contentUp;
		}
		
		let diffHeight = $('.text').height() / window.base - $('.textContain').height() / window.base;
		if (contentUp >= diffHeight) {
			SDK.setEventLock();
			isScrollDown = false;
			$('.text').css('top', -contentUp + 'rem');
			$('.downbtn').css({
				"opacity": 0.8
			});
			$('.upbtn').css({
				"opacity":1
			});
			return;
		}
		$('.upbtn').css({
			"opacity": 1
		});
		$('.upbtn').removeClass('noclickUp')
		$('.upbtn').addClass('clickUp')
		isScrollUp = true;
		contentUp += 0.48;
		// contentUp = parseFloat(contentUp.toFixed(1));
		if(isSync){
			if(message.operate!=5){
				$('.text').css('top', -contentUp + 'rem').css({
					"transition": "all 0.3s"
				});
			}else{
				$('.text').css('top', -contentUp + 'rem');
			}

		}else{
			$('.text').css('top', -contentUp + 'rem').css({
				"transition": "all 0.3s"
			});			
		}

		if (contentUp < diffHeight) {
			$('.downbtn').css({
				"opacity": 1
			});
		}
		if (contentUp >=diffHeight) {
			$('.downbtn').css({
				"opacity": 0.8
			});
			$('.downbtn').addClass('noclickDown')
			$('.downbtn').removeClass('clickDown')
			$('.upbtn').addClass('clickUp')
		}
		SDK.setEventLock();
		isScrollDown = true;
	});
	//学生端开始答题

	var isAnswer = true;
	$(".stage .options").on("click touchstart", function(e) {
		if(e.type=="touchstart"){
			e.preventDefault()
		}
		if (isAnswer) {
			//答错音效，不同步
			//answer= $(this).find(".answer").text();
			if(staticData.right.length>1){
				 answer=$(this).find(".answer").text()
			}else{
				answer= $(this).index();
			}
			//answer= $(this).index();
			let _this = $(this);

			if(answer != staticData.right){
				let $audio=this.getElementsByTagName("audio")[0];
				$audio?$audio.play():"";
			}
			isAnswer = false;
			if ($(".answerIcon").hasClass("ansWrong")) {
				$(".answerIcon").removeClass("ansWrong");
			}
			if (!isSync) {
				$(this).trigger("syncstartAns");
				return;
			}

			SDK.bindSyncEvt({
				sendUser: '',
				receiveUser: '',
				index: $(e.currentTarget).data('syncactions'),
				eventType: 'click',
				method: 'event',
				syncName: 'syncstartAns',
				recoveryMode:'1',
				otherInfor:{
					answer:answer,
					choose:_this.index(),
					contentUp:contentUp
				}
			});
		}
	});

	var startAnswer = true;
	$('.stage .options').on('syncstartAns', function(e, message) {
		let answerIndex;
		if(isSync){
			let obj = message.data[0].value.syncAction.otherInfor;
			answer = obj.answer;
			answerIndex=obj.choose;
			that = $(".options").eq(obj.choose);
			contentUp=obj.contentUp;
			//掉线后再次返回教室
			if(message.operate==5){
				setPos(contentUp);
			}
		}else{
			if(staticData.right.length>1){
				answer = $(this).find(".answer").text();
			}else{
				answer = $(this).index();				
			}
			answerIndex=$(this).index();
			//answer = $(this).find(".answer").text();
			that = $(this);
		}

		if ($(".answerIcon").hasClass("ansWrong")) {
			$(".answerIcon").removeClass("ansWrong");
		}

		for(let i=0;i<$('.options').length;i++){
			if($(".options").eq(i).attr('data-id')==$(that).index()){
				$(".options").eq(i).find(".optionsText").css({'visibility':'hidden'});
			}else{
				$(".options").eq(i).find(".optionsText").css({'visibility':'visible'});
			}
		}
		// 答对后不可再选择
		if (that.hasClass('not-click')) {
			SDK.setEventLock();
			isAnswer = false;
			return;
		}

		if (answer == staticData.right) {
			that.find(".answerIcon").addClass("ansRight");
			$(".options").addClass("not-click");
			if (isSync) {
// 				SDK.bindSyncResultEvt({
// 					sendUser: message.data[0].value.sendUser,
// 					receiveUser: message.data[0].value.receiveUser,
// 					sendUserInfo: message.data[0].value.sendUserInfo,
// 					index: $('#container').data('syncresult'),
// 					resultData: {
// 						isRight: true
// 					},
// 					syncName: 'teaShowResult',
// 					starSend: message.data[0].value.starSend,
// 					operate: message.operate,
// 					questionType: 'TC',
//                 	tplate: 'TC006',
// 				});
			}
			isAnswer = false;
		} else {
			let textOpt=that.find(".ans-line").height();
			let textOptBox=that.find(".line-box").height();
			// let num=1;
			let num2;
			if(optionsArr.length==4){
				num2=1
			}else if(optionsArr.length==3){
				num2=4
			}else{
				num2=5
			}
			// console.log(optionsArr,'1111')
			if(optionsArr[answerIndex].search('<br/>')!=-1){
				if(getDialogueLength(optionsArr[answerIndex],num2)){
					// console.log('222222')
					$(".ans-line").eq(answerIndex).addClass("optionScroll").css({
						'padding-bottom':"0.35rem"
					});
					that.find(".answerIcon").addClass("ansWrong");
					that.find(".ans-line").css('animation', 'shakeUp3 0.4s both ease-in','-webkit-animation', 'shakeUp3 0.4s both ease-in');
					that.find(".ans-line").on('animationend  webkitAnimationEnd', function() {
						that.find(".ans-line").css('animation', 'none','-webkit-animation', 'none');
					});
				}else{
					// console.log('111111')
					that.find(".answerIcon").addClass("ansWrong");
					that.find(".ans-line").css('animation', 'shakeUp2 0.4s both ease-in','-webkit-animation', 'shakeUp2 0.4s both ease-in');
					that.find(".ans-line").on('animationend  webkitAnimationEnd', function() {
						that.find(".ans-line").css('animation', 'none','-webkit-animation', 'none');
					});
				}

			}else{
				if(textOpt<=textOptBox){
					// console.log('33333')
					that.find(".answerIcon").addClass("ansWrong");
					that.find(".ans-line").css('animation', 'shakeUp2 0.4s both ease-in','-webkit-animation', 'shakeUp2 0.4s both ease-in');
					that.find(".ans-line").on('animationend  webkitAnimationEnd', function() {
						that.find(".ans-line").css('animation', 'none','-webkit-animation', 'none');
					});
				}else{
					// console.log('44444')
					that.find(".answerIcon").addClass("ansWrong");
					that.find(".ans-line").css('animation', 'shakeUp3 0.4s both ease-in','-webkit-animation', 'shakeUp3 0.4s both ease-in');
					that.find(".ans-line").on('animationend  webkitAnimationEnd', function() {
						that.find(".ans-line").css('animation', 'none','-webkit-animation', 'none');
					});
				}
			}

			if (isSync) {
// 				SDK.bindSyncResultEvt({
// 					sendUser: message.data[0].value.sendUser,
// 					receiveUser: message.data[0].value.receiveUser,
// 					sendUserInfo: message.data[0].value.sendUserInfo,
// 					index: $('#container').data('syncresult'),
// 					resultData: {
// 						isRight: false
// 					},
// 					syncName: 'teaShowResult',
// 					starSend: message.data[0].value.starSend,
// 					operate: message.operate,
// 					questionType: 'TC',
//                 	tplate: 'TC006',
// 				});
			}
			isAnswer = true;
		}
	});

	//再次上线后触发的函数
	function setPos(contentUp){
		let diffHeight = $('.text').height() / window.base - $('.textContain').height() / window.base;
		$('.text').css('top', -contentUp + 'rem');
		if (contentUp >= diffHeight) {
			$('.text').css('top', -contentUp + 'rem');
			$('.downbtn').css({
				"opacity": 0.6
			});
			$('.upbtn').css({
				"opacity":1
			});
		}else if (contentUp <= 0) {
			$('.upbtn').css({
				"opacity":0.6
			});
			$('.downbtn').css({
				"opacity": 1
			});
		}else{
			$('.upbtn').css({
				"opacity":1
			});
			$('.downbtn').css({
				"opacity": 1
			});
		}
	}

	function  chooseOpt(answer,_this){
		// console.log(_this,'defef')
		if(_this!=''){
			if (answer == staticData.right) {
				_this.find(".answerIcon").addClass("ansRight");
				$(".options").addClass("not-click");
			}else{
				_this.find(".answerIcon").addClass("ansWrong");
			}			
		}
	}
	//点击选项上下按钮
	let optionsUp;   //翻转选项的位置变量
	let optionsUpClick=true;
	$('.up').on('click touchstart',function(e){
		e.stopPropagation();
		if(e.type=="touchstart"){
			e.preventDefault()
		}
		if(optionsUpClick){
			optionsUpClick=false;
			if(!isSync){
				$(this).trigger('upSyncClick')
				return
			}
			if(window.frameElement.getAttribute('user_type') == 'tea'){
				SDK.bindSyncEvt({
					sendUser: '',
					receiveUser: '',
					index: $(this).data("syncactions"),
					eventType: 'click',
					method: 'event',
					syncName: 'upSyncClick'
				});
			}else{
				$(this).trigger('upSyncClick')
			}
		}
	})
	$('.up').on('upSyncClick',function(e,message){
		$(this).css({
			'opacity':1
		});

		let index=$(this).parent().index();
		let disHeight = $('.ans-line').eq(index-1).height() / window.base - $('.line-box').height() / window.base;
		optionsUp=parseFloat($(".ans-line").eq(index-1).attr("data-top"));

		$(".options-btn").eq(index-1).find(".down").css({
			'opacity':1
		})
		$(".options-btn").eq(index-1).find(".down").addClass('down_btnable')

		if (optionsUp <0.42) {
			$(this).removeClass('btns')
			reMoveClass();
			$(this).css({
				'opacity':0.5
			});
			$(this).removeClass('up_btnable')
			optionsUpClick=true
			SDK.setEventLock();
			return
		}else{
			$(this).addClass('btns')
		}
		
		optionsUp-=0.42;

		$('.ans-line').eq(index-1).css('top', -optionsUp + 'rem').css({
					"transition": "all 0.3s"
				}).attr("data-top",optionsUp);
		//判断是几项
		optionsUpClick=true
		SDK.setEventLock()
		
	})


	let downClick=true;
	let optionsDownClick=true
	$('.down').on('click touchstart',function(e){
		e.stopPropagation();
		if(e.type=="touchstart"){
			e.preventDefault()
		}
		if(optionsDownClick){
			optionsDownClick=false;
			if(!isSync){
				$(this).trigger('downSyncClick')
				return
			}
			if(window.frameElement.getAttribute('user_type') == 'tea'){
				SDK.bindSyncEvt({
					sendUser: '',
					receiveUser: '',
					index: $(this).data("syncactions"),
					eventType: 'click',
					method: 'event',
					syncName: 'downSyncClick'
				});
			}else{
				$(this).trigger('downSyncClick')
			}
		}
	})

	$('.down').on('downSyncClick',function(e,message){
		$(this).css({
			'opacity':1
		})

		let index=$(this).parent().index();
		let disHeight = $('.ans-line').eq(index-1).height() / window.base - $('.line-box').height() / window.base;

		$(".options-btn").eq(index-1).find(".up").css({
			'opacity':1
		})
		$(".options-btn").eq(index-1).find(".up").addClass('up_btnable')
		optionsUp=parseFloat($(".ans-line").eq(index-1).attr("data-top"));

		if(optionsUp>=disHeight){
			optionsDownClick=true
			SDK.setEventLock();
			$(this).removeClass('btns')
			reMoveClass();
			$(this).css({
				'opacity':0.5
			})
			$(this).removeClass('down_btnable')
			return;
		}else{
			$(this).addClass('btns')		
		}

		
		optionsUp+=0.42;
		$('.ans-line').eq(index-1).css('top', -optionsUp + 'rem').css({
					"transition": "top 0.3s"
				}).attr("data-top",optionsUp);

		optionsDownClick=true
		SDK.setEventLock()

	})
	function reMoveClass(){
		let parent=$(".options-btn");
		let up=parent.find(".up");
		let down=parent.find(".down");
		up.removeClass('btns')
		down.removeClass('btns')
	}
})