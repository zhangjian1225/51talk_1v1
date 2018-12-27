"use strict"
import '../../common/js/common_1v1.js'
import '../../common/js/commonFunctions.js';
$(function() {

	// 埋点：进入页面
	var h5SyncActions = parent.window.h5SyncActions;
	if ($(window.frameElement).attr('id') === 'h5_course_self_frame') {
		// Tracking.init(h5SyncActions.classConf, {
		// 	tplate: 'T001'
		// });
		// parent.window.dataReport.tracking && parent.window.dataReport.tracking.init(h5SyncActions.classConf, {
		// 	tplate: 'T001'
		// });
		// initTrack('T001')
	}

	/**
	 * 控制器调用的变量
	 */
	window.h5Template = {
        hasPractice: '0'
    }

	let staticData = configData.source;
	const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
	var AllTem = '';
	(function() {
		AllTem = '<div class="stage"><div class="img-edge"><div class="img-show"><img class="image" src="' + staticData.themePic + '" alt=""></div></div></div><div class="audio" data-syncactions="audoPlay"><img src="image/volumeBtn.png" alt=""><audio class="autoAudio" webkit-playsinline src="' + staticData.bkaudio + '"></audio><audio class="startAudio" webkit-playsinline preload="preload"  src="' + staticData.audio + '"></audio></div>';
		$('.main').append(AllTem);
	})()
	if (isSync) {
		if (window.frameElement.getAttribute('user_type') == 'stu') {
			$('.audio').css('opacity','0');
		} else {
			$('.audio').css('opacity','1');
		}
    } else {
		var hrefParam=parseURL("http://www.example.com");
		if(top.frames[0]&&top.frames[0].frameElement){
			hrefParam = parseURL(top.frames[0].frameElement.src)
		}
		var role_num =  hrefParam.params['role']
		function parseURL(url) {
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
		}
		if (role_num =='1' || role_num == undefined) {
			$('.audio').css('opacity','1');
		} else if(role_num =='2'){
			$('.audio').css('opacity','0');
		}
	}
	let desc, title;
	let naturalWidth;
	let naturalHeight;
	let imgShowPosition;
	let imgObj;

	var frame_id = $(window.frameElement).attr('id');
	var frame_user_id = $(window.frameElement).attr('user_id');
	if (isSync) {
		var current_user_id = SDK.getClassConf().user.id;
		if (frame_id != 'h5_course_cache_frame' && frame_user_id == current_user_id && frame_id === 'h5_course_self_frame') {
			$(".autoAudio").attr("autoplay", "autopaly");
		}
	} else {
		$(".autoAudio").attr("autoplay", "autopaly");
	}

	//判断图片大小并定位图片
	function getImage(index) {
		imgObj = $(".image");
		imgShowPosition = $(".img-show");
		imgShowPosition.find('img').on('load', function(e) {
			if (staticData.hasOwnProperty('size')) {
				let imageInfo = staticData.size
				if (imageInfo.w || imageInfo.h) {
					naturalWidth = imageInfo.w;
					naturalHeight = imageInfo.h;
				} else {
					naturalWidth = this.naturalWidth;
					naturalHeight = this.naturalHeight;
				}
			} else {
				naturalWidth = this.naturalWidth;
				naturalHeight = this.naturalHeight;
			}
			if (staticData.themePic) {
				imgShowPosition.find('img').css({
					width: "100%"
				});
				// console.log(naturalWidth/naturalHeight-16/9)
				if (Math.abs(naturalWidth / naturalHeight - 16 / 9) < 0.01) {
					//console.log("55555555555555555")
					$(".img-edge").css({
						"position": "static"
					});
					imgShowPosition.css({
						"border": "none",
						"border-radius": "0rem",
						"box-shadow": "none",
						"width": 1920 / 100 + "rem",
						"height": 1080 / 100 + "rem",
						"position": "absolute",
						"left": "50%",
						"top": "50%",
						"margin-top": -1080 / 100 / 2 + "rem",
						"margin-left": -1920 / 100 / 2 + "rem",
						"background-color": "#fff"
					});
					$(".desc").css({
						"position": "absolute",
						"z-index": 3
					});
					$(".title").css({
						"position": "absolute",
						"z-index": 3
					});
					imgObj.css({
						"border-radius": "0rem"
					});
				} else {
					//图片大小在安全区以内
					if (1920 >= naturalWidth && 760 >= naturalHeight) {
						// console.log("111111111111111111")
						imgShowPosition.css(setPosition());
						imgObj.css({
							"border-radius": "0.1rem"
						});
					}
					//图片大小超出1920
					else if (naturalWidth >= 1920 || naturalHeight >= 1080) {
						// console.log("2222222222222222222")
						// $(".img-edge").css({
						// 	"position": "static"
						// });
						imgShowPosition.css({
							"border": "none",
							"border-radius": "0rem",
							"box-shadow": "none",
							"width": 1920 / 100 + "rem",
							"height": 1080 / 100 + "rem",
							"position": "absolute",
							"left": "50%",
							"top": "50%",
							"margin-top": -1080 / 100 / 2 + "rem",
							"margin-left": -1920 / 100 / 2 + "rem",
							"background-color": "#fff"
						});
						$(".desc").css({
							"position": "absolute",
							"z-index": 3
						});
						$(".title").css({
							"position": "absolute",
							"z-index": 3
						});
						imgObj.css({
							"border-radius": "0rem"
						});
					}
					//图片大小在全屏以内安全区以外
					else if (760 < naturalHeight < 1080) {
						// console.log("333333333333333333")
						// $(".img-edge").css({
						// 	"position": "static"
						// });
						imgShowPosition.css(setPosition());
						imgObj.css({
							"border-radius": "0.1rem"
						});
						$(".title").css({
							"position": "absolute",
							"z-index": 3
						});
					}
				}
			}
		});
	}
	//判断声音是否为空
	if (staticData.audio == '') {
		$(".audio").css({
			"display": "none"
		});
	}
	//图片定位

	getImage();
	//图片定位
	function setPosition() {
		return {
			"border": "0.14rem solid #fff",
			"border-radius": "0.25rem",
			"box-shadow": "0 0 0.3rem #616060",
			"width": naturalWidth / 100 + "rem",
			"height": naturalHeight / 100 + "rem",
			"position": "absolute",
			"left": "50%",
			"top": "50%",
			"margin-top": -naturalHeight / 100 / 2 + "rem",
			"margin-left": -naturalWidth / 100 / 2 + "rem",
			"box-sizing": " border-box",
			"background-color": "#fff"
		};
	}
	let isStartBtn = true;
	let isPlaySound = true;
	$('.audio').on('click', function(e) {
		if (isStartBtn) {
			isStartBtn = false;
			if (!isSync) {
				$(this).trigger("audioSync");
				return
			}
			if (window.frameElement.getAttribute('user_type') == 'tea') {
				SDK.bindSyncEvt({
					sendUser: '',
					receiveUser: '',
					index: $(e.currentTarget).data('syncactions'),
					eventType: 'click',
					method: 'event',
					funcType: 'audio',
					syncName: 'audioSync'
				});
			}
		}
	});
	//老师端声音播放同步到学生端
	$('.audio').on("audioSync", function(e) {
		var $audio = null;
		$audio = document.getElementsByClassName("startAudio")[0];
		var $img = $(this).find("img");
		if ($(window.frameElement).attr('id') == 'h5_course_self_frame' || !isSync) {
			$audio ? $audio.play() : "";
			if ($img.length != 0) {
				$img.attr("src", $(this).find("img").attr("src").replace(".png", ".gif"));
				//播放完毕img状态
				$audio.onended = function() {
					$img.attr("src", $(this).find("img").attr("src").replace(".gif", ".png"));
					//flag = true;//恢复点击
				}.bind(this);
			}
		}
		SDK.setEventLock();
		isStartBtn = true;
	});
})