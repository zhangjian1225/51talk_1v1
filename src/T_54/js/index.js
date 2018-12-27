"use strict"
import '../../common/js/common_1v1.js';
import '../../common/js/drag.js';
import { resultWin, resultLose } from '../../common/template/resultPage/index.js';
console.log()
$(function () {
    window.h5Template = {
        hasPractice: '0'
    }
    let h5SyncActions = parent.window.h5SyncActions;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    const configDatas = configData.source;
    /**
     * 控制台移动
    */
    $('.control').drag();
    /**
     * 区分学生老师
    */
   
    
    if (isSync) {
        if (window.frameElement.getAttribute('user_type') == 'stu') {
            $('.control').css('opacity', '0');
            $('.startBox').css('opacity','0');
        }
    } else {
        var hrefParam = parseURL("http://www.example.com");
        if (top.frames[0] && top.frames[0].frameElement) {
            hrefParam = parseURL(top.frames[0].frameElement.src)
        }
        var role_num = hrefParam.params['role']
        function parseURL(url) {
            var a = document.createElement('a')
            a.href = url
            return {
                source: url,
                protocol: a.protocol.replace(':', ''),
                host: a.hostname,
                port: a.port,
                query: a.search,
                params: (function () {
                    var ret = {},
                        seg = a.search.replace(/^\?/, '').split('&'),
                        len = seg.length, i = 0, s
                    for (; i < len; i++) {
                        if (!seg[i]) { continue; }
                        s = seg[i].split('=')
                        ret[s[0]] = s[1]
                    }
                    return ret
                })(),
                file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
                hash: a.hash.replace('#', ''),
                path: a.pathname.replace(/^([^\/])/, '/$1'),
                relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
                segments: a.pathname.replace(/^\//, '').split('/')
            }
        }
        if (role_num == '1' || role_num == undefined) {
            $('.control').css('opacity', '1');
        } else if (role_num == '2') {
            $('.control').css('opacity', '0');
            $('.startBox').css('opacity','0');
        }
    }

    /**
     * 创建元素
    */
    let time = '';
    let startBtn = false;
    let initLi = '';
    for (let i = 0; i < 15; i++) {
        initLi += `<li class='pos_${i} pos'></li>`
    }
    $('.initBubbleList').html(initLi);

    let initBubHtml = '';// 初始泡泡
    $.each(configDatas.addList, function (index, val) {
        $('.pos_' + index).removeClass('pos');
        let left = (($('.pos_' + index).offset().left - $('.container').offset().left) - ($('.initBubble').offset().left - $('.container').offset().left)) / window.base;
        let top = (($('.pos_' + index).offset().top - $('.container').offset().top) - ($('.initBubble').offset().top - $('.container').offset().top)) / window.base;
        initBubHtml += `
            <div class="bubbleBox initBu_${index} chooseBu_${val.id} showBub" data-pos='pos_${index}' style="left:${left}rem; top:${top}rem;">
                <img src="${val.img}"/>
            </div>
        `
    });
    $('.bubbleBoxList').html(initBubHtml);

    let playBubHtml = '';// 发射台泡泡
    $.each(configDatas.ranList, function (index, val) {
        playBubHtml += `
            <div class="ranBu_${index} showPlayBub playBub" data-id="chooseBu_${val.id}">
                <img src="${val.img}"/>
            </div>
        `
    });
    $('.showBubbleList').html(playBubHtml);

    /**
     * 倒计时
    */
    let moveItemW = $('.proprogressBar').width() / window.base; // 获取时间轴长度
    let timeNum = configDatas.time;
    let everLen = moveItemW / timeNum // 每秒移动距离
    let timeInt = null; // 定时器
    function timeStartFn() {
        window.localStorage.setItem('countDownTime', timeNum);
        time = setInterval(function () {
            timeNum--;
            if (timeNum < 0) {
                clearInterval(time);
                $('.digletImg').removeClass('showAn');
                $('.choose').addClass('hide');
                resultLose({
                    'src':'./image/resultSnow.png',  // 雪图片
                    'loseIsLoop': true, // 答错声音是否重复播放 true/false
                    'Mask_Z_Index':'', // 遮罩层z_index
                    'Snow_Z_Index':'1'// 雪z_index
                });
                window.localStorage.removeItem('countDownTime');
            } else {
                window.localStorage.setItem('countDownTime', timeNum);
                moveItemW = moveItemW - everLen;
                $('.proprogressBar').css('width', moveItemW + 'rem');
            }
        }, 1000);
    };
    /**
     * 点击开始按钮 
    */
    let startBtnStatus = true;
    $(".startBtn").on("click touchstart", function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation();
        if (startBtnStatus) {
            startBtnStatus = false;
            if (!isSync) {
                $(this).trigger("startBtnClick");
                return;
            }
            if (window.frameElement.getAttribute('user_type') == 'tea') {
                SDK.bindSyncEvt({
                    sendUser: '',
                    receiveUser: '',
                    index: $(e.currentTarget).data("syncactions"),
                    eventType: 'click',
                    method: 'event',
                    syncName: 'startBtnClick',
                    otherInfor: {
                        startBtn: true
                    },
                    recoveryMode: '1'
                });
            }
        }
    })
    $(".startBtn").on('startBtnClick', function (e, message) {
        if (isSync) {
            let otherInfor = message.data[0].value.syncAction.otherInfor;
            if (message.operate == '5') {
                callbackFn(otherInfor);
                return;
            }
        }
        let q = 1;
        $('.startBox').hide().siblings('.timeChangeBox').show().find('.numberList');
        $('.timeLowAudio_' + q).get(0).play();

        let audioPlay = setInterval(function () {
            q++;
            if (q > 4) {
                clearInterval(audioPlay);
                $('.mask').hide();
                $('.timeMask').hide();
                timeStartFn();
            } else {
                $('.timeLowAudio_' + q).get(0).play();
                $('.numberList').css({
                    'background-position-x': -(1.5 * (q - 1)) + 'rem',

                })
            }
        }, 1000)
    });



    /**
     * 点击控制台
    */
    let aniTNum = 1; // 控制气球相关
    let playBubNum = configDatas.ranList.length;
    let showPlayBubIndex = 0; // 发射台泡泡显示的index
    let btnStatus = true;
    let arrMessage = {
        nowMsg: {},
        allMsg: []
    }
    $('.ranBu_' + showPlayBubIndex).show();
    $(".btn").on("click touchstart", function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation();
        if (btnStatus) {
            btnStatus = false;
            // 判断对错
            let nowBubId = $('.ranBu_' + showPlayBubIndex).attr('data-id');
            let thisBtnName = $(this).attr('data-val');
            let posClassName = $('.' + nowBubId).attr('data-pos')
            if (thisBtnName == 'trueBtn') { // 老师点击正确
                arrMessage.nowMsg = {
                    playBubClass: 'ranBu_' + showPlayBubIndex,
                    initBubClass: $('.ranBu_' + showPlayBubIndex).attr('data-id'),
                    posClass: posClassName,
                    playBubNum: playBubNum,
                    showPlayBubIndex: showPlayBubIndex,
                    isShow: 'true',
                }
                arrMessage.allMsg.push({
                    playBubClass: 'ranBu_' + showPlayBubIndex,
                    initBubClass: $('.ranBu_' + showPlayBubIndex).attr('data-id'),
                    posClass: posClassName,
                    playBubNum: playBubNum,
                    showPlayBubIndex: showPlayBubIndex,
                    isShow: 'true',
                })
                arrMessage.startBtn = true;
                $('.btns').addClass('trueBg');
            } else {
                arrMessage.nowMsg = {
                    playBubClass: 'ranBu_' + showPlayBubIndex,
                    initBubClass: $('.ranBu_' + showPlayBubIndex).attr('data-id'),
                    posClass: posClassName,
                    playBubNum: playBubNum,
                    showPlayBubIndex: showPlayBubIndex,
                    isShow: 'false'
                }
                arrMessage.allMsg.push({
                    playBubClass: 'ranBu_' + showPlayBubIndex,
                    initBubClass: $('.ranBu_' + showPlayBubIndex).attr('data-id'),
                    posClass: posClassName,
                    playBubNum: playBubNum,
                    showPlayBubIndex: showPlayBubIndex,
                    isShow: 'false'
                })
                arrMessage.startBtn = true;
                $('.btns').addClass('falseBg');
            }
            if (!isSync) {
                $(this).trigger("btnClick");
                return;
            }
            if (window.frameElement.getAttribute('user_type') == 'tea') {
                SDK.bindSyncEvt({
                    sendUser: '',
                    receiveUser: '',
                    index: $(e.currentTarget).data("syncactions"),
                    eventType: 'click',
                    method: 'event',
                    syncName: 'btnClick',
                    otherInfor: arrMessage,
                    recoveryMode: '1'
                });
            }
        }
    })
    $(".btn").on('btnClick', function (e, message) {

        if (isSync) {
            let otherInfor = message.data[0].value.syncAction.otherInfor;
            arrMessage = otherInfor;
            if (message.operate == '5') {
                callbackFn(otherInfor);
                return;
            }
        }
        let nowPlayClass = arrMessage.nowMsg.playBubClass; // 发射元素class
        let nowInitClass = arrMessage.nowMsg.initBubClass; // 碰撞的元素class
        let posClass = arrMessage.nowMsg.posClass; // 占位元素的class
        // 发射元素变小
        $('.' + nowPlayClass).addClass('min');
        // 判断正确还是错误
        if (arrMessage.nowMsg.isShow == 'true') {
            let element = $('.' + nowPlayClass).get(0); // 发射元素
            let target = $('.' + nowInitClass).get(0); // 碰撞的元素
            $('.' + posClass).addClass('pos'); // 添加pos表示现在位置为空
            $('.' + nowPlayClass).removeClass('showPlayBub'); // 表示该元素已经打中用于判断完成
            $('.' + nowInitClass).removeClass('showIntBub'); // 表示该元素已经被击中用于判断完成
             // 炮弹全部打完
             if ($('.showIntBub').length <= 0 && $('.showPlayBub').length <= 0) {
                clearInterval(time);
                time = '';
                window.localStorage.removeItem('countDownTime');
            }
            let parabola = funParabola(element, target, {
                curvature: '.1',
                complete: function () {
                    setTimeout(function () { // 定时器用于视觉感受柔和

                        $('.' + nowPlayClass).remove();
                        $('.' + nowInitClass).remove();
                        if ($('.showIntBub').length <= 0 && $('.showPlayBub').length <= 0) {
                            resultWin({
                                'WinIsLoop': true, // 答对声音是否重复播放 true/false
                                'Mask_Z_Index': "9" // 遮罩层z_index
                            });
                        }
                        btnStatus = true;
                        SDK.setEventLock();
                    }, 500)
                    showPlayBubIndex++;
                    $('.ranBu_' + showPlayBubIndex).show();
                    $('.btns').removeClass('trueBg');
                    $('.trueMp3').get(0).play();
                }
            }).mark(1, 100);
            parabola.init();
        } else {
            let element = $('.' + nowPlayClass).get(0); // 发射元素
            let target = $('.pos').eq(0).get(0); // 停止的位置
            let parabola = funParabola(element, target, {
                curvature: '0',
                complete: function () {
                    let left = (($('.pos').eq(0).offset().left - $('.container').offset().left) - ($('.initBubble').offset().left - $('.container').offset().left)) / window.base;
                    let top = (($('.pos').eq(0).offset().top - $('.container').offset().top) - ($('.initBubble').offset().top - $('.container').offset().top)) / window.base;
                    // 游戏结束失败
                    playBubNum = playBubNum + 2;
                    let thisHtml = `
                        <div class="ranBu_${playBubNum - 2} showPlayBub playBub" data-id="chooseBu_${playBubNum - 2}">
                            <img src="${$('.' + nowPlayClass).find('img').attr('src')}"/>
                        </div>
                        <div class="ranBu_${playBubNum - 1} showPlayBub playBub" data-id="${$('.' + nowPlayClass).attr('data-id')}">
                            <img src="${$('.' + nowPlayClass).find('img').attr('src')}"/>
                        </div>
                    `
                    $('.showBubbleList').append(thisHtml);
                    let thatHtml = `
                        <div class="bubbleBox initBu_${playBubNum - 2} chooseBu_${playBubNum - 2} showBub" data-pos='${$('.pos').eq(0).attr('class').split(' ')[0]}' style="left:${left}rem; top:${top}rem;">
                            <img src="${$('.' + nowPlayClass).find('img').attr('src')}"/>
                        </div>
                    `
                    $('.bubbleBoxList').append(thatHtml);
                    $('.' + nowPlayClass).remove();
                    $('.falseMp3').get(0).play();
                    showPlayBubIndex++;
                    $('.ranBu_' + showPlayBubIndex).show();
                    $('.btns').removeClass('falseBg');
                    $('.pos').eq(0).removeClass('pos');
                    if ($('.pos').length <= 0) {
                        resultLose({
                            'src':'./image/resultSnow.png',  // 雪图片
                            'loseIsLoop': true, // 答错声音是否重复播放 true/false
                            'Mask_Z_Index':'', // 遮罩层z_index
                            'Snow_Z_Index':'1'// 雪z_index
                        });
                        
                        clearInterval(time);
                        time = '';
                        window.localStorage.removeItem('countDownTime');
                    }
                    setTimeout(function () {
                        btnStatus = true;
                        SDK.setEventLock();
                    }, 500)
                }
            }).mark(1, 0);
            parabola.init();
        }

    })

    /**
     * 恢复操作数据
    */

    function callbackFn(msg) {
        timeNum = window.localStorage.getItem('countDownTime');
        if (msg.startBtn == true) {
            $('.timeMask').hide();
            moveItemW = moveItemW - (configDatas.time - timeNum)*everLen;
            $('.proprogressBar').css('width', moveItemW + 'rem');
            time = setInterval(function () {
                timeNum--;
                if (timeNum < 0) {
                    clearInterval(time);
                    $('.digletImg').removeClass('showAn');
                    $('.choose').addClass('hide');
                    resultLose({
                        'src':'./image/resultSnow.png',  // 雪图片
                        'loseIsLoop': true, // 答错声音是否重复播放 true/false
                        'Mask_Z_Index':'', // 遮罩层z_index
                        'Snow_Z_Index':'1'// 雪z_index
                    });
                    window.localStorage.removeItem('countDownTime');
                } else {
                    window.localStorage.setItem('countDownTime', timeNum);
                    moveItemW = moveItemW - everLen;
                    $('.proprogressBar').css('width', moveItemW + 'rem');
                }
            }, 1000);
            $.each(arrMessage.allMsg, function (index, val) {
                playBubNum = val.playBubNum;
                showPlayBubIndex = val.showPlayBubIndex;
                let nowPlayClass = val.playBubClass; // 发射元素class
                let nowInitClass = val.initBubClass; // 碰撞的元素class
                let posClass = val.posClass; // 占位元素的class
                // 发射元素变小
                $('.' + nowPlayClass).addClass('min');
                // 判断正确还是错误
                if (val.isShow == 'true') {
                    let left = (($('.' + nowInitClass).offset().left - $('.container').offset().left) - ($('.initBubble').offset().left - $('.container').offset().left)) / window.base;
                    let top = (($('.' + nowInitClass).offset().top - $('.container').offset().top) - ($('.initBubble').offset().top - $('.container').offset().top)) / window.base;
                    $('.' + nowPlayClass).css({
                        left: left + "rem",
                        top: top + "rem"
                    });
                    $('.' + posClass).addClass('pos'); // 添加pos表示现在位置为空
                    $('.' + nowPlayClass).removeClass('showPlayBub'); // 表示该元素已经打中用于判断完成
                    $('.' + nowInitClass).removeClass('showIntBub'); // 表示该元素已经被击中用于判断完成
                    $('.' + nowPlayClass).remove();
                    $('.' + nowInitClass).remove();
                    // 炮弹全部打完
                    if ($('.showIntBub').length <= 0 && $('.showPlayBub').length <= 0) {
                        resultWin({
                            'WinIsLoop': true, // 答对声音是否重复播放 true/false
                            'Mask_Z_Index': "9" // 遮罩层z_index
                        });
                        clearInterval(time);
                        time = '';
                        window.localStorage.removeItem('countDownTime');
                    }
                    showPlayBubIndex++;
                    $('.ranBu_' + showPlayBubIndex).show();
                    $('.btns').removeClass('trueBg');
                    btnStatus = true;
                    SDK.setEventLock();
                } else {
                    let left = (($('.pos').eq(0).offset().left - $('.container').offset().left) - ($('.initBubble').offset().left - $('.container').offset().left)) / window.base;
                    let top = (($('.pos').eq(0).offset().top - $('.container').offset().top) - ($('.initBubble').offset().top - $('.container').offset().top)) / window.base;
                    // 游戏结束失败
                    playBubNum = playBubNum + 2;
                    let thisHtml = `
                    <div class="ranBu_${playBubNum - 2} showPlayBub playBub" data-id="chooseBu_${playBubNum - 2}">
                        <img src="${$('.' + nowPlayClass).find('img').attr('src')}"/>
                    </div>
                    <div class="ranBu_${playBubNum - 1} showPlayBub playBub" data-id="${$('.' + nowPlayClass).attr('data-id')}">
                        <img src="${$('.' + nowPlayClass).find('img').attr('src')}"/>
                    </div>
                `
                    $('.showBubbleList').append(thisHtml);
                    let thatHtml = `
                    <div class="bubbleBox initBu_${playBubNum - 2} chooseBu_${playBubNum - 2} showBub" data-pos='${$('.pos').eq(0).attr('class').split(' ')[0]}' style="left:${left}rem; top:${top}rem;">
                        <img src="${$('.' + nowPlayClass).find('img').attr('src')}"/>
                    </div>
                `
                    $('.bubbleBoxList').append(thatHtml);
                    $('.' + nowPlayClass).remove();
                    showPlayBubIndex++;
                    $('.ranBu_' + showPlayBubIndex).show();
                    $('.btns').removeClass('falseBg');
                    $('.pos').eq(0).removeClass('pos');
                    if ($('.pos').length <= 0) {
                        resultLose({
                            'src':'./image/resultSnow.png',  // 雪图片
                            'loseIsLoop': true, // 答错声音是否重复播放 true/false
                            'Mask_Z_Index':'', // 遮罩层z_index
                            'Snow_Z_Index':'1'// 雪z_index
                        });
                        clearInterval(time);
                        time = '';
                        window.localStorage.removeItem('countDownTime');
                    }
                    btnStatus = true;
                    SDK.setEventLock();
                }
            })
        }
    };

    /**
    * 断线后对端暂停处理 
    */

    window.SDK.memberChange = function (message) {
        if (isSync) {
            // 进入教室
            if (message.state == 'enter') {
                if (time) {
                    time = setInterval(function () {
                        timeNum--;
                        if (timeNum > 0) {
                            moveItemW = moveItemW - everLen;
                            window.localStorage.setItem('countDownTime', timeNum);
                            $('.proprogressBar').css('width', moveItemW + 'rem');
                        } else {
                            clearInterval(time);
                            $('.digletImg').removeClass('showAn');
                            $('.choose').addClass('hide');
                            resultLose({
                                'src':'./image/resultSnow.png',  // 雪图片
                                'loseIsLoop': true, // 答错声音是否重复播放 true/false
                                'Mask_Z_Index':'', // 遮罩层z_index
                                'Snow_Z_Index':'1'// 雪z_index
                            });
                            window.localStorage.removeItem('countDownTime');
                        }
                        $('.num').html(timeNum);
                    }, 1000)
                }
            } else if (message.state == 'out') {  // 退出教室
                if (time) {
                    $('.digletImg').removeClass('showAn');
                    clearInterval(time);
                }
            }
        }
    }
})
