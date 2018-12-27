"use strict"
import '../../common/js/common_1v1.js'
import '../../common/js/commonFunctions.js'
const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;

$(function() {
	var h5SyncActions = parent.window.h5SyncActions;
	if ( $(window.frameElement).attr('id') === 'h5_course_self_frame' ) {
        // Tracking.init(h5SyncActions.classConf,{
        // 	tplate:'T005'
        // });
	}
	/**
	 * 控制器调用的变量
	 */
	window.h5Template = {
        hasPractice: '0'
    }
	let article = configData.source.article,
		dialImg = configData.source.dial,
		dialNum = configData.source.dialNum;

	let [dial, start, stop] = [$('.dial'), $('.start-dial'), $('.stop-dial')];
	let textList = $('.left-text .text-list');
	let angle = 360 / dialNum;
	let rotateTimer = null;
	let randomNum = 0;
	let ForNum = 0;
	let deg = 0; // 旋转度数
	let arr = ['0']; // 存放随机数

	if( !article ) {
		$('.left-text').hide();
	}
	// 页面初始化
	$('.dial').attr('src', dialImg);

	textList.html(article);

	let startRotate;
	let isAllowClick = true;

	// 开始转
	var startClick = true;
	start.on('click', function(e) {
		e.stopPropagation();
		if (startClick) {
			startClick = false;
			let nowR = (Math.random()*dialNum).toFixed(0);
			if (arr.length >dialNum) {
				randomNum = nowR;
			} else {
				if (arr.indexOf(nowR)>=0) {
					nowRfn();
					randomNum = ForNum;
				} else {
					randomNum = nowR;
				}
			}
			if (!isSync) {
				$(this).trigger('syncStartClick');
				return;
			}
			SDK.bindSyncEvt({
				index: $(e.currentTarget).data('syncactions'),
				eventType: 'click',
				method: 'event',
				syncName: 'syncStartClick',
				questionType: 'TB',
                tplate: 'T005',
				otherInfor:{
					deg: deg,
					randomNum: randomNum
				},
				recoveryMode:'1'
			});
		}
	});

	start.on('syncStartClick', function (e, message) {
		if (!isAllowClick) {
			return
		}
		randomNum = isSync ? message.data[0].value.syncAction.otherInfor.randomNum : randomNum;
		if (arr.length <= dialNum) {
			arr.push(randomNum);
		}
		deg = randomNum*angle;
		dial.addClass('animate')
		dial.css({
			'transform': 'rotate(' + deg + 'deg)',
			'transition': 'none'
		});

		start.hide();
		stop.show();
	});



	// 停止转
	var stopClick = true;
	stop.on('click', function(e) {

		e.stopPropagation();

		if (stopClick) {

			stopClick = false;

			if (!isSync) {
				$(this).trigger('syncStopClick');
				return;
			}

			SDK.bindSyncEvt({
				index: $(e.currentTarget).data('syncactions'),
				eventType: 'click',
				method: 'event',
				syncName: 'syncStopClick',
				questionType: 'TB',
                tplate: 'T005',
				otherInfor:{
					deg: deg,
					randomNum: randomNum
				},
				recoveryMode:'1'
			});

		}
	});
	stop.on('syncStopClick', function(e, message) {


		if (isSync && message.operate=='5') {
			var otherInfor = message.data[0].value.syncAction.otherInfor
			offlineInit(otherInfor)
			return
		}

		if (!isAllowClick) {
			return
		}
		isAllowClick = false;

		start.show();
		stop.hide();
		deg += 360;
		dial.removeClass('animate')

		setTimeout(() => {
			dial.css({
				'transform': 'rotate(' + deg + 'deg)',
				'transition': '1.8s ease-out'
			});
		}, 50);

		setTimeout(function() {
			SDK.setEventLock();
			isAllowClick = true;
			startClick = true;
			stopClick = true;
		}, 1900)

	});


	/**
	 * 恢复数据
	*/
	function offlineInit (message) {
		dial.removeClass('animate')
		dial.css({
			'transform': 'rotate(' + message.deg + 'deg)'
			// 'transition': '1.8s ease-out'
		})
		start.show();
		stop.hide();
	}

	/**
	 * 生成不一样随机数
	*/
	function nowRfn () {
		let num = (Math.random()*dialNum).toFixed(0);
		if (arr.indexOf(num) >= 0) {
			nowRfn();
		} else {
			ForNum =  num;
		}
	}
})