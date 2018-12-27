"use strict"
import '../../common/js/common_1v1.js'
import '../../common/js/drag.js'
const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;

$(function() {
	var h5SyncActions = parent.window.h5SyncActions;
	window.h5Template = {
		hasPractice: '1' // 是否有授权按钮 1：是 0：否
	}
	// if ($(window.frameElement).attr('id') === 'h5_course_self_frame') {
	// 	initTrack('TD003')
	// }

	let staticData = configData.source;
	let seleList = "";
	let scroolDis = 1.8; //每个放置盒子的高
	let trueCount = 0; //正确答案的个数
	//打乱顺序
	if (isSync) {
		let pages = SDK.getClassConf().h5Course.localPage //页码打乱顺序
		let seleListOne = window.reSort(staticData.seleList, pages);
		seleList = window.reSort(seleListOne, staticData.random).reverse();
	} else {
		seleList = window.reSort(staticData.seleList, staticData.random).reverse();
	}
	let imgCount = seleList.length; //图片的个数
	let allPos = {};
	(function() {
		//渲染图片
		let imgList = '';
		let freeList = '';
		//创建拖拽项
		for (let i = 0; i < seleList.length; i++) {
			allPos['move_'+i] = ((scroolDis+.18)*i+1.6);
			if (seleList[i].img != "") { //渲染图片
				imgList += `
					<div class="ans-area move_${i}" data-id="move_${i}" data-initLeft="0.2" data-initTop="${((scroolDis+.18)*i+1.6)}" style=" top:${((scroolDis+.18)*i+1.6)+'rem'};" data-index ="${seleList[i].pos!='#'?seleList[i].pos-1:'#'}" data-syncactions="item_${i}">
						<img class="img" src="${seleList[i].img}"/>
					</div>
				`
			} else { //渲染文字
				imgList += `
					<div class="ans-area move_${i}" data-id="move_${i}" data-isFont="true" id="ansFont" data-initW = "2.4" data-initH = ".96" data-initLeft="0.2" data-initTop="${((scroolDis+.18)*i+1.6)}"  style="top:${((scroolDis+.18)*i+1.6)+'rem'};" data-index ="${seleList[i].pos!='#'?seleList[i].pos-1:'#'}" data-syncactions="item_${i}">
						<p>${seleList[i].font}</p>
					</div>
				`
			}
			if (seleList[i].pos != "#") {
				trueCount++;
			}
		}
		let imgFontHeight = 1000;
		$('.freeArea').css({
			'background': 'url(' + staticData.img + ') no-repeat',
			'background-size': '100% 100%'
		})
		$('.imgFont').css('height', imgFontHeight + "rem").html(imgList)
		for (let m = 0; m < 18; m++) {
			if (m < 18) { //创建虚线框
				if (m < 6) {
					freeList += `<li class="box${m}" style="top:0;left:${2.46*m}rem"></li>`
				} else if (m < 12) {
					freeList += `<li class="box${m}" style="top:2.46rem;left:${2.46*(m-6)}rem"></li>`
				} else {
					freeList += `<li class="box${m}" style="top:4.92rem;left:${2.46*(m-12)}rem"></li>`
				}
			}
		}
		$('.freeDom ul').html(freeList);
		//图片尺寸大小判断
		$(".ans-area img").on("load", function() {
			contrImgSize.call(this);
		});

		function contrImgSize() {
			var thisImg = $(this),
				imgWidth = thisImg.get(0).naturalWidth / 100,
				imgHeight = thisImg.get(0).naturalHeight / 100,
				containerScale = imgWidth / imgHeight; //容器的宽高比
			if (containerScale < 1) { //瘦高型
				if (imgHeight > 1.8) {
					thisImg.css({
						height: '100%',
						width: 'auto'
					});
					// thisImg.data("size",{width:'auto',height:'100%'})//记录图片开始位置尺寸
				} else {
					thisImg.css({
						height: imgHeight + "rem",
						width: 'auto'
					});
					// thisImg.data("size",{width:'auto',height:imgHeight/100+"rem"})
				}
				thisImg.parent('.ans-area').attr("data-initW", imgWidth) //记录图片本身尺寸，用于拖动后父容器重新调整大小
				thisImg.parent('.ans-area').attr("data-initH", imgHeight)
			} else { //胖矮型
				if (imgWidth > 1.8) {
					thisImg.css({
						width: '100%',
						height: 'auto'
					});
					// thisImg.data("size",{width:'100%',height:'auto'})
				} else {
					thisImg.css({
						width: imgWidth + "rem",
						height: 'auto'
					});
					// thisImg.data("size",{width:imgWidth/100+"rem",height:'auto'})
				}
				thisImg.parent('.ans-area').attr("data-initW", imgWidth) //记录图片本身尺寸，用于拖动后父容器重新调整大小
				thisImg.parent('.ans-area').attr("data-initH", imgHeight)
			}
		}
	})()


	//点击上下按钮
	let isScrollUp = true;
	let contentUp = 0;
	let scroolLen = 2;
	let endObj = {};
	let lock = false;//填到合适位置变为true
	let moveHalf = 0.9; //拖拽体的一半宽高
	let boxHalf = 1.22; //对应坑的一半宽高
	let breakAre = 1; //碰撞的有效面积
	let setBoxWidth = 2.8//左边区域宽
	let isEnd = false; //是否答完
	let choosecount = 0; //答对的个数
	let thisLeft = "";
	let thisTop = "";
	$(".upBtn").on("click touchstart", function(e) {
		if (e.type == "touchstart") {
			e.preventDefault()
		}
		e.stopPropagation();
		if (isScrollUp) {
			isScrollUp = false;
			if (imgCount > 3) {
				$('.downBtn').removeClass("noChange").css("background", "#ffc600")
				$(".downBtn img").css("opacity", "1")
			}
			if (contentUp <= 0) {
				$('.upBtn').addClass("noChange").css("background", "#fdd132")
				$('.upBtn img').css("opacity", ".8")
				isScrollUp = true;
			} else {
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
					otherInfor: {
						allPos: allPos,
						left : thisLeft,
						top : thisTop,
						count : choosecount,
						isEnd : isEnd,
						scrool : (contentUp-scroolLen),
						allEndObj : endObj
					},
					recoveryMode:'1'
				});
			}
		}
	});
	$(".upBtn").on("syncgoUp", function(e,message) {
		let otherInfors = "";
		if(isSync){
			otherInfors = message.data[0].value.syncAction.otherInfor;
			if (message.operate=='5') {
				callbackFn(message);
				return;
			}
			endObj = otherInfors.allEndObj;
			contentUp = otherInfors.scrool;
		}
		contentUp = isSync?otherInfors.scrool:contentUp-scroolLen ;
		$('.imgFont').css({
			'top': -contentUp + 'rem',
			"transition": "all 0.3s"
		});
		SDK.setEventLock();
		isScrollUp = true;
	});

	let isScrollDown = true;
	if (imgCount < 4) {
		isScrollDown = false;
		$('.upBtn img').css("opacity", ".8")
	}
	$(".downBtn").on("click touchstart", function(e) {
		if (e.type == "touchstart") {
			e.preventDefault()
		}
		e.stopPropagation();
		if (isScrollDown) {
			isScrollDown = false;
			if (imgCount > 3) {
				$(".upBtn img").css("opacity", "1")
				$(".upBtn").removeClass("noChange").css("background", "#ffc600")
			}
			//----------------------------------------------
			if (contentUp + scroolLen > (scroolLen + 0.18) * (imgCount - 3)) { //不可触发
				$(this).find("img").css("opacity", ".8")
				$('.downBtn').addClass("noChange").css("background", "#fdd132")
				isScrollDown = true;
				return;
			} else {
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
					otherInfor: {
						allPos: allPos,
						left : thisLeft,
						top : thisTop,
						count : choosecount,
						isEnd : isEnd,
						scrool : (contentUp+scroolLen),
						allEndObj : endObj
					},
					recoveryMode:'1'
				});
			}
			//----------------------------------------------
		}
	});
	$(".downBtn").on("syncgodown", function(e, message) {
		let otherInfors = "";
		if(isSync){
			otherInfors = message.data[0].value.syncAction.otherInfor;
			if (message.operate=='5') {
				callbackFn(message);
				return;
			}
			endObj = otherInfors.allEndObj;
			contentUp = otherInfors.scrool;
		}
		
		contentUp = isSync?otherInfors.scrool:contentUp+scroolLen ;
		$('.imgFont').css({
			'top': -contentUp + 'rem',
			"transition": "all 0.3s"
		});
		SDK.setEventLock();
		isScrollDown = true;
	});

	//按钮按下改样式
	$('.sameBtn').on('mousedown touchstart', function(e) {
		if (e.type == "touchstart") {
			e.preventDefault()
		}
		e.stopPropagation()
		if (!$(this).hasClass('noChange')) {
			$(this).css({
				"background": "#ffba00",
			})
			$(this).find('img').css('opacity', 0.7)
		}
	})
	$('.sameBtn').on('mouseup touchend', function(e) {
		if (e.type == "touchstart") {
			e.preventDefault()
		}
		e.stopPropagation()
		if (!$(this).hasClass('noChange')) {
			$(this).css({
				"background": "#ffc600",
			})
			$(this).find('img').css('opacity', 1)
		}
	})

	//添加拖拽
	$('.ans-area').drag({
		before: function(e) {
			$(this).css({
				transition: "",
				"z-index": 45
			});
			$('.line').fadeIn('slow')
			$('.click').get(0).play()
		},
		process: function(e) {

		},
		end: function(e) {
			if (Math.abs(($(this).offset().left - $('.container').offset().left)) / window.base < setBoxWidth) { //拖拽没到自由摆放区
				$('.drag').addClass('showDrag')
				$(this).css({
					left: $(this).attr('data-initLeft') + "rem",
					top: $(this).attr('data-initTop') + "rem",
					"transition": "all 0.5s",
					"z-index": 20
				})
				$('.line').fadeOut('slow')
				$('.back').get(0).play()
				setTimeout(function() {
					$('.drag').removeClass('showDrag')
				}, 500)
			} else {
				let ansIndex = $(this).attr('data-index');
				if (ansIndex == "#") { //干扰项
					let that = $(this)
					$('.drag').addClass('showDrag')
					$('.wrong').get(0).play()
					$('.line').addClass('emShake')
					$('.line').off('animationend webkitAnimationEnd');
					$('.line').on('animationend webkitAnimationEnd', function() {
						that.css({
							left: that.attr('data-initLeft') + "rem",
							top: that.attr('data-initTop') + "rem",
							"transition": "all 0.5s",
							"z-index": 20
						})
						$('.line').removeClass('emShake')
						$('.back').get(0).play()
						$('.line').fadeOut('slow')
						setTimeout(function() {
							$('.drag').removeClass('showDrag')
						}, 500)
					})
				} else {
					let moveLeft = ($(this).offset().left - $('.container').offset().left) / window.base + moveHalf; //拖拽体的中心left
					let moveTop = ($(this).offset().top - $('.container').offset().top) / window.base + moveHalf; //拖拽体的中心top
					let boxLeft = ($('.box' + ansIndex).offset().left - $('.container').offset().left) / window.base + boxHalf; //拖拽坑的left位置
					let boxTop = ($('.box' + ansIndex).offset().top - $('.container').offset().top) / window.base + boxHalf; //拖拽坑的位置
					let sameLeft = Math.abs(moveLeft - boxLeft);
					let sameTop = Math.abs(moveTop - boxTop);
					//判断中心点是否在检测区域
					if (sameLeft <= breakAre && sameTop <= breakAre) {
						lock = true;
						thisLeft = (boxHalf * 2 - $(this).attr('data-initW')) / 2;
						thisTop = (boxHalf * 2 - $(this).attr('data-initH')) / 2;
						$('.true').get(0).play();
						$('.line').fadeOut('slow');
						choosecount++;
						if (choosecount >= trueCount) {
							isEnd = true;
						}
						endObj[$(this).attr('data-id')] = [ansIndex,thisLeft,thisTop,$(this).index()];
					} else { //答错
						$('.drag').addClass('showDrag')
						let that = $(this);
						$('.wrong').get(0).play();
						$('.line').addClass('emShake');
						$('.line').off('animationend webkitAnimationEnd');
						$('.line').on('animationend webkitAnimationEnd', function() {
							$('.line').removeClass('emShake');
							that.css({
								left: that.attr('data-initLeft') + "rem",
								top: that.attr('data-initTop') + "rem",
								"transition": "all 0.5s",
								"z-index": 20
							})
							$('.back').get(0).play();
							$('.line').fadeOut('slow');
							setTimeout(function() {
								$('.drag').removeClass('showDrag');
							}, 500)
						})
					}
				}

			}
			if (lock) {
				scrool($(this).index());
				if (!isSync) {
					// $(this).trigger('syncDragEnd', {
					// 	left: thisLeft,
					// 	top: thisTop,
					// 	pageX: '',
					// 	pageY: '',
					// });
					$(this).trigger('syncDragEnd');
					return;
				}
				SDK.bindSyncEvt({
					index: $(this).data('syncactions'),
					eventType: 'click',
					method: 'event',
					syncName: 'syncDragEnd',
					otherInfor: {
						allPos: allPos,
						left : thisLeft,
						top : thisTop,
						count : choosecount,
						isEnd : isEnd,
						scrool : contentUp,
						allEndObj : endObj
					},
					recoveryMode:'1'
				});
			}
		}
	});
	//抬起回调
	$('.imgFont .ans-area').on("syncDragEnd", function(e, message) {
		let otherInfors = ''
		if(isSync){
			otherInfors = message.data[0].value.syncAction.otherInfor;
			if (message.operate=='5') {
				callbackFn(message);
				return;
			}
			endObj = otherInfors.allEndObj;
			contentUp = otherInfors.scrool;
			choosecount = otherInfors.count;
			allPos = otherInfors.allPos;
		}
		let posX = isSync ? otherInfors.left : thisLeft;
		let posY = isSync ? otherInfors.top : thisTop;
		let thisIndex = $(this).index()
		let ansIndex = $(this).attr('data-index');
		$(this).removeClass("ans-area")
		$('.box' + ansIndex).prepend($(this))
		if ($(this).attr('data-isFont')) {
			$(this).css({
				width: $(this).attr('data-initW') + "rem",
				height: $(this).attr('data-initH') + "rem",
				transform: "translateX(" + (posX + 0.022) + "rem) translateY(1.4rem)"
			})
		} else {
			$(this).css({
				width: $(this).attr('data-initW') + "rem",
				height: $(this).attr('data-initH') + "rem",
				transform: "translateX(" + (posX + 0.03) + "rem) translateY(" + (posY + 0.05) + "rem)"
			})
		}
		if (isSync && otherInfors.isEnd) {
			$('.drag').addClass('showDrag')
			// SDK.bindSyncResultEvt({
			// 	sendUser: message.data[0].value.sendUser,
			// 	receiveUser: message.data[0].value.receiveUser,
			// 	sendUserInfo: message.data[0].value.sendUserInfo,
			// 	index: $('#container').data('syncresult'),
			// 	resultData: {
			// 		isRight: true
			// 	},
			// 	syncName: 'teaShowResult',
			// 	starSend: message.data[0].value.starSend,
			// 	questionType: 'TD',
			// 	tplate: 'TD003',
			// 	operate:message.operate,
			// 	otherInfor: {
			// 		left : thisLeft,
			// 		top : thisTop,
			// 		count : choosecount,
			// 		isEnd : isEnd,
			// 		scrool : contentUp,
			// 		allEndObj : endObj
			// 	},
			// 	recoveryMode:'1'
			// });
		}
		posSet(allPos);
		SDK.setEventLock();
		lock = false;
	});
	function posSet(msg) {
		$.each(msg,function (key,val) {
			$('.'+key).attr('data-initTop', val);
			$('.'+key).animate({
				'top': val + 'rem'
			}, 100);
		})
	} 
	function posSetCall(msg) {
		$.each(msg,function (key,val) {
			$('.'+key).attr('data-initTop', val);
			$('.'+key).css({
				'top': val + 'rem'
			});
		})
	} 
	function scrool(index) {
		imgCount = $('.ans-area').length;
		let dis = 0.18;
		//当前元素后兄弟元素上移
		if (contentUp > 0) {
			contentUp -= scroolLen;
			$('.imgFont').css({
				'top': -contentUp + 'rem'
			});
			for (let i = index; i < imgCount; i++) {
				let thisT = $('.imgFont .ans-area').eq(i).attr('data-initTop') - (scroolDis + dis)
				$('.imgFont .ans-area').eq(i).attr('data-initTop', thisT)
				$('.imgFont .ans-area').eq(i).animate({
					'top': thisT + 'rem'
				}, 100);
			}
		} else {
			for (let i = index; i < imgCount; i++) {
				let thisT = $('.imgFont .ans-area').eq(i).attr('data-initTop') - (scroolDis + dis)
				$('.imgFont .ans-area').eq(i).attr('data-initTop', thisT)
				$('.imgFont .ans-area').eq(i).animate({
					'top': thisT + 'rem'
				}, 100);
			}
		}
		if (imgCount < 4) {
			contentUp = 0;
			$('.imgFont').css({
				'top': -contentUp + 'rem'
			});
		}
		for (let i = index; i < imgCount; i++){
			let top = $('.imgFont .ans-area').eq(i).attr('data-initTop');
			let id = $('.imgFont .ans-area').eq(i).attr('data-id');
			allPos[id] = top;
		}
	}
	/**
	 * 重新教室后执行函数
	*/

	function callbackFn (message) {
		let msg = message.data[0].value.syncAction.otherInfor
		choosecount = msg.count;
		endObj = msg.allEndObj;
		isEnd = msg.isEndl;
		allPos = msg.allPos;
		// 上下翻页恢复位置
		contentUp = msg.scrool;
		$('.imgFont').css({
			'top':-contentUp + 'rem',
			"transition": "all 0.3s"
		});
		isScrollDown = true;
		$.each(endObj, function(key,val) {
			let posX = val[1];
			let posY = val[2];
			let thisItem = key;
			let ansIndex = val[0];
			$('.box'+ansIndex).prepend($("."+thisItem));
			
			if($("."+thisItem).attr('data-isFont')){
				$("."+thisItem).css({
					width:$("."+thisItem).attr('data-initW')+"rem",
					height:$("."+thisItem).attr('data-initH')+"rem",
					transform:"translateX("+(posX+0.022)+"rem) translateY(1.4rem)"
				})
			}else{
				$("."+thisItem).css({
					width:$("."+thisItem).attr('data-initW')+"rem",
					height:$("."+thisItem).attr('data-initH')+"rem",
					transform:"translateX("+(posX+0.03)+"rem) translateY("+(posY+0.05)+"rem)"
				})
			}
			$("."+thisItem).removeClass("ans-area");
			if (isSync && msg.isEnd) {
				$('.drag').addClass('showDrag')
				// SDK.bindSyncResultEvt({
				// 	sendUser: message.data[0].value.sendUser,
				// 	receiveUser: message.data[0].value.receiveUser,
				// 	sendUserInfo: message.data[0].value.sendUserInfo,
				// 	index: $('#container').data('syncresult'),
				// 	resultData: {
				// 		isRight: true
				// 	},
				// 	syncName: 'teaShowResult',
				// 	starSend: message.data[0].value.starSend,
				// 	operate:message.operate,
				// 	otherInfor: {
				// 		left : thisLeft,
				// 		top : thisTop,
				// 		count : choosecount,
				// 		isEnd : isEnd,
				// 		scrool : contentUp,
				// 		allEndObj : endObj
				// 	},
				// 	recoveryMode:'1'
				// });
			}
			posSetCall(allPos);
			lock = false;
			SDK.setEventLock();
		})
	}
});