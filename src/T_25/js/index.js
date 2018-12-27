"use strict"
import '../../common/js/common_1v1.js'
import '../../common/js/drag.js'

$(function () {
	// ac 内是否显示授权按钮的开关
	window.h5Template = {
		hasPractice: '1'
	}
	const h5SyncActions = parent.window.h5SyncActions;
	const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;

	const self_frame_id = $(window.frameElement).attr('id');
    /**
     * 创建dom元素
     */
	let source = configData.source;
	let dragHTML = '';
	let left_init = 15;// 初始left
	let top_init = .15;// 初始top
	let item_width = 2;// 元素宽
	let item_height = 2;// 元素高
	let item_arr = []; // 发包使用
	for (let i = 0; i < source.list.length; i++) {
		let left_now = left_init + (i % 2) * (item_width + .1);
		let top_now = top_init + Math.floor(i / 2) * (top_init + item_height);
		item_arr[i] = {
			left: '',
			top: ''
		}
		dragHTML += `
			<div class="ans-area" style="left:${left_now}rem;top:${top_now}rem" data-initTop=${top_now} data-initLeft=${left_now} data-syncactions='item_${i}'>
				<img src="${source.list[i].img}"/>
			</div>
		`;
	}
	$('.drag_item').html(dragHTML);
	//图片尺寸大小判断
	$(".ans-area img").on("load", function () {
		contrImgSize.call(this);
	});
	function contrImgSize() {
		var thisImg = $(this),
			imgWidth = thisImg.get(0).naturalWidth / 100,
			imgHeight = thisImg.get(0).naturalHeight / 100,
			containerScale = imgWidth / imgHeight;   //容器的宽高比
		if (containerScale < 1) {//瘦高型
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
			thisImg.parent('.ans-area').attr("data-initW", imgWidth)//记录图片本身尺寸，用于拖动后父容器重新调整大小
			thisImg.parent('.ans-area').attr("data-initH", imgHeight)
		} else {//胖矮型
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
			thisImg.parent('.ans-area').attr("data-initW", imgWidth)//记录图片本身尺寸，用于拖动后父容器重新调整大小
			thisImg.parent('.ans-area').attr("data-initH", imgHeight)
		}
	}
	if (!isSync) {
		dragFn();
	} else if (isSync && window.frameElement.getAttribute('user_type') == 'stu') {
		dragFn();
	}

	function dragFn() {
		$('.ans-area').drag({
			before: function (e) {
				$(this).css('z-index', '101')
			},
			process: function (e) { },
			end: function (e) {
				if (19.2 - $(this).offset().left / window.base - $(this).width() / window.base + $('.container').offset().left / window.base <= 4) {
					$(this).css({
						left: $(this).attr('data-initLeft') + "rem",
						top: $(this).attr('data-initTop') + "rem",
						height: "2rem",
						width: "2rem"
					})
					let thisIndex = $(this).index();
					item_arr[thisIndex].left = "";
					item_arr[thisIndex].top = "";
					if (isSync) {
						SDK.bindSyncEvt({
							index: $(this).data('syncactions'),
							eventType: 'click',
							method: 'event',
							syncName: 'syncDragEnd',
							otherInfor: {
								arr: item_arr,
								index: thisIndex
							},
							recoveryMode: '1'
						});
					}
				} else {
					$(this).css({
						height: $(this).attr('data-inith') + "rem",
						width: $(this).attr('data-initw') + "rem"
					})
					let thisIndex = $(this).index();
					item_arr[thisIndex].left = $(this).attr('data-left');
					item_arr[thisIndex].top = $(this).attr('data-top');
					if (isSync) {
						SDK.bindSyncEvt({
							index: $(this).data('syncactions'),
							eventType: 'click',
							method: 'event',
							syncName: 'syncDragEnd',
							otherInfor: {
								arr: item_arr,
								index: thisIndex
							},
							recoveryMode: '1'
						});
					}
				}
				$(this).css('z-index', '100')
			}
		})
	}
	//回调
	$('.ans-area').on('syncDragEnd', function (e, message) {
		let otherInfor = message.data[0].value.syncAction.otherInfor;
		let index = otherInfor.index;
		item_arr = otherInfor.arr;
		if (message.operate == '5') {
			for (let i = 0; i < otherInfor.arr.length; i++) {
				if (otherInfor.arr[i].left) {
					$('.ans-area').eq(i).css({
						left: otherInfor.arr[i].left,
						top: otherInfor.arr[i].top,
						height: $('.ans-area').eq(i).attr('data-inith') + "rem",
						width: $('.ans-area').eq(i).attr('data-initw') + "rem"
					})
					$('.ans-area').eq(i).attr('data-left', otherInfor.arr[i].left);
					$('.ans-area').eq(i).attr('data-top', otherInfor.arr[i].top);
				}
			}
		} else {
			if (otherInfor.arr[index].left) {
				$(this).css({
					left: otherInfor.arr[index].left,
					top: otherInfor.arr[index].top,
					height: $(this).attr('data-inith') + "rem",
					width: $(this).attr('data-initw') + "rem"
				})
				$(this).attr('data-left', otherInfor.arr[index].left);
				$(this).attr('data-top', otherInfor.arr[index].top);
			} else {
				$(this).css({
					left: $(this).attr('data-initLeft') + 'rem',
					top: $(this).attr('data-initTop') + 'rem',
					height: "2rem",
					width: "2rem"
				})
				$(this).attr('data-left', $(this).attr('data-initLeft') + 'rem');
				$(this).attr('data-top', $(this).attr('data-initTop') + 'rem');
			}

		}
	})
})