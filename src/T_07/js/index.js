"use strict"
import '../../common/js/common_1v1.js'

$(function () {
    window.h5Template = {
    	hasPractice: '1' 
    }
    let h5SyncActions = parent.window.h5SyncActions;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    if (configData.source.personImg) {
        $('#person img').attr('src',configData.source.personImg)
    }
    /**
     * 添加声音
     */

    if (configData.source.audio) {
        $('.stage').append(`<audio src="${configData.source.audio}" class="flyMp3"></audio>`);
    } else {
        $('.stage').append(`<audio src="./audio/fly.mp3" class="flyMp3"></audio>`);
    }
    let itemClick = true;
    let ever = 2.6; //筛子每张图片的大小
    let pos = configData.source.personPos;
    let diceNum = ''; // 停止点数
    let mathArr = []; // 存放随机数
    let onceNum = 0;
    let nowNum = 0; // 上一次摇出的号
    if (pos !='0' && pos != '') {
        mathArr.push();
    }
     
    //初始化六个点数的位置
    function getPosition(num){
        num = positions[parseInt(num)]; 
        let x = ((num%20-1)*0.95-0.4)+"rem";
        let y = (Math.floor(num/20)*0.49-1.5)+"rem";
        return [x,y];
    } 
    let positions = configData.source.position;
    for(let i=1;i<positions.length;i++){
        let [x,y] = getPosition(i);
        $(".pos_"+i).css({left: x, top: y});
    }
    //初始化起始位置
    let [pos_x,pos_y] = getPosition(pos);
    $('#person').css({left: pos_x, top: pos_y});

    $('.dice').on('click touchstart', function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation();
        if (itemClick) {
            itemClick = false;
            if ( configData.source.time == 'once') {
                diceNum = configData.source.diceNum;
            } else {
                nowRfn();
                diceNum = onceNum;
            }
            if (!isSync) {
                $(this).trigger('diceClick')
                return;
            }
            SDK.bindSyncEvt({ 
                index: $(e.currentTarget).data('syncactions'),
                eventType: 'click',
                method: 'event',
                funcType: 'audio',
                syncName: 'diceClick',
                otherInfor:{
                    diceNum_msg : diceNum,
                    start_pos: pos,
                    mathArr: mathArr,
                    nowNum: nowNum
                },
                recoveryMode:'1'
            });
        }
    })
    $('.dice').on('diceClick', function (e,message) {
        $('.hand').hide();
        if (isSync) {
            let otherInfor = message.data[0].value.syncAction.otherInfor;
            if(message.operate=='5') {
               callBackFn(otherInfor);
            } else {
                diceNum = otherInfor.diceNum_msg;
                pos = otherInfor.start_pos;
                mathArr = otherInfor.mathArr;
                nowNum = otherInfor.nowNum;
                ansFn();
            }
        } else {
            ansFn()
        }
        function ansFn() {
            $('.end_Dice').css('background-position',(-(diceNum-1)*ever)+'rem 0');
            $('.animateMax_end').css('background-position',(-(diceNum-1)*ever)+'rem 0')
            $('.end_Dice').hide();
            $('.animate_Dice').show().addClass('show_animate');
            $('.mask').show().find('.animateMax_Dice').addClass('show_animate');
            let isSync_bool = ($(window.frameElement).attr('id') == 'h5_course_self_frame' || !isSync)
            if (isSync_bool) {
                $('.aniMp3').get(0).play()
            }
            $('.animate_Dice').on('animationend webkitAnimationEnd', function () {
                $('.animate_Dice').off('animationend webkitAnimationEnd');
                $('.animate_Dice').removeClass('show_animate');
                $('.animateMax_Dice').removeClass('show_animate');
                $('.animateMax_Dice').hide();
                $('.animateMax_end').show();
                $('.end_Dice').show();
                $('.animate_Dice').hide();
                setTimeout(function () {
                    $('.boxAni').addClass('box_animate').on('animationend webkitAnimationEnd', function () {
                        $('.boxAni').off('animationend webkitAnimationEnd');
                        $('.mask').hide();
                        $('.animateMax_Dice').show();
                        $('.animateMax_end').hide();
                        $('.boxAni').removeClass('box_animate')
                        setTimeout( person_jump,500)
                    })
                },1000);
            });
        }

        // 开始跳connection.end();
        function person_jump () {
            let element = $('#person').get(0);
            let target = $('.pos_'+diceNum).get(0);
            $('.flyMp3').get(0).play();
            if (pos != diceNum) {
                let parabola = funParabola(element, target, {
                    curvature :'.15',
                    complete: function() {
                        pos = diceNum; 
                        let [pos_x,pos_y] = getPosition(pos); 
                        $('#person').removeAttr('style')
                        .removeAttr('data-center').css({left: pos_x, top: pos_y});
                        $('.pos_'+diceNum).removeAttr('data-center');
                        if (configData.source.time != 'once') {
                            itemClick = true;
                        } 
                        SDK.setEventLock();
                    }
                })
                parabola.init();
            } else {
                if (configData.source.time != 'once') {
                    itemClick = true;
                }
                SDK.setEventLock();
            }
        
        }
    })

    /**
     * 退出教室重新进入
    */
    
    function callBackFn (otherInfor) {
        diceNum = otherInfor.diceNum_msg;
        pos = otherInfor.pos;
        mathArr = otherInfor.mathArr;
        nowNum = otherInfor.nowNum;
        let [pos_x,pos_y] = getPosition(diceNum);
        $('#person').css({left: pos_x, top: pos_y});
        $('.end_Dice').css('background-position',(-(diceNum-1)*ever)+'rem 0');
        $('.animateMax_end').css('background-position',(-(diceNum-1)*ever)+'rem 0');
        if (configData.source.time != 'once') {
            itemClick = true;
        } else {
            itemClick = false;
        }
        SDK.setEventLock();
    }

    /**
	 * 生成不一样随机数
    */
	function nowRfn () {
        let num = Math.ceil(Math.random()*6);
        if (mathArr.length>=6) {
            mathArr = [];
        }
		if (mathArr.indexOf(num) >= 0 || nowNum == num) {
            nowRfn();
		} else {
            mathArr.push(num);
            onceNum = num;
            nowNum = num;
        }
	}
})
