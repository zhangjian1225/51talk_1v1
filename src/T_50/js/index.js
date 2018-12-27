"use strict"
import '../../common/js/common_1v1.js'

$(function () {
    window.h5Template = {
        hasPractice: '0'
    }
    let h5SyncActions = parent.window.h5SyncActions;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    const configDatas = configData.source;
    let randArrList = configDatas.randArrList;
    let nowIndex = 0;
    let score = 0; // 分数
    let timeInt = null; // 定时器
    let classStatus = '';

    /**
     * 区分学生老师
    */
    if (isSync) {
        classStatus = parent.window.h5SyncActions.classConf.h5Course.classStatus
        if (window.frameElement.getAttribute('user_type') == 'stu' && classStatus != '0') {
            $('.startBox').css('opacity','0')
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
                $('.startBox').css('opacity','1')
            } else if(role_num =='2'){
                $('.startBox').css('opacity','0')
            }
    }
    /**
     * 创建元素
    */
    $.each(configDatas.cardList, function (index, item) {
        let thisHtml = `
            <div class="item_${index + 1} item">
                <div class="digletBox">
                    <div class="digletImg">
                        <div class="imgMsg">
                            <img src="${item.img}">
                        </div>
                        <div class="head initFace"></div>
                    </div>
                </div> 
                <div class="choose hide" style="${isSync && window.frameElement.getAttribute('user_type') == 'stu' && classStatus != '0'?'opacity:0':'opacity:1'}">
                    <span class="trueChoose chooseBtn" data-name="trueChoose" data-syncactions="item_true_${index}">
                        <audio src="./audio/dizzy.mp3"></audio>
                    </span>
                    <span class="falseChoose chooseBtn" data-index="${index}" data-name="falseChoose" data-syncactions="item_false_${index}">
                        <audio src="./audio/laugh.mp3"></audio>
                    </span>
                </div>
                <div class="hammer"></div>
            </div>
        `
        if (index < 5) {
            $('.diglet_' + (index + 1)).append(thisHtml);
        } else {
            let indexPer = index % 5;
            $('.diglet_' + (indexPer + 1)).append(thisHtml);
        }
    })

    /**
     * 倒计时
    */
    let moveItemW = $('.proprogressBar').width() / window.base; // 获取时间轴长度
    let time = configDatas.time;
    let everLen = moveItemW / time // 每秒移动距离
    function timeStartFn() {
        window.localStorage.setItem('countDownTime',time);
        timeInt = setInterval(function () {
            time--;
            if (time <= 0) {
                clearInterval(timeInt);
                $('.digletImg').removeClass('showAn');
                $('.choose').addClass('hide');
                if (score>0) {
                    $('.endImg').addClass('wrong');
                    $('.winAudio').get(0).play();
                } else {
                    $('.failAudio').get(0).play();
                }
                $('.endAlert').show().find('span').html(score);
                $('.mask').show();
                window.localStorage.removeItem('countDownTime');
            } else {
                window.localStorage.setItem('countDownTime',time);
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
            // if (window.frameElement.getAttribute('user_type') == 'tea') {
            SDK.bindSyncEvt({
                sendUser: '',
                receiveUser: '',
                index: $(e.currentTarget).data("syncactions"),
                eventType: 'click',
                method: 'event',
                syncName: 'startBtnClick',
                otherInfor: {
                    nowIndex: nowIndex,
                    score: score,
                    randArrList: randArrList,
                    time: time,
                    isStart: true
                },
                recoveryMode: '1'
            });
            // }
        }
    })
    $(".startBtn").on('startBtnClick', function (e, message) {
        if (isSync) {
            let otherInfor = message.data[0].value.syncAction.otherInfor;
            nowIndex = otherInfor.nowIndex;
            score = otherInfor.score;
            randArrList = otherInfor.randArrList;
            if (message.operate == '5') {
                callbackFn(otherInfor);
                return;
            }
        }
        let q = 1;
        $('.startBox').hide().siblings('.timeChangeBox').show().find('.numberList');
        $('.timeLowAudio_'+q).get(0).play();
        let audioPlay = setInterval(function () {
            q++;
            if (q>4) {
                clearInterval(audioPlay);
                $('.mask').hide();
                $('.timeChangeBox').hide();
                $('.item_' + (randArrList[nowIndex] + 1)).find('.digletImg').addClass('showAn');
                $('.item_' + (randArrList[nowIndex] + 1)).find('.choose').removeClass('hide');
                timeStartFn();
            } else {
                $('.timeLowAudio_'+q).get(0).play();
                $('.numberList').css({
                    'background-position-x': -(1.5*(q-1))+'rem'
                })
            }
        },1000)
    });

    /**
     * 老师点击对错按钮
    */
    let chooseBtnStatus = true;
    $(".chooseBtn").on("click touchstart", function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation();
        if (chooseBtnStatus) {
            chooseBtnStatus = false;
            let that = $(this).parents('.item');
            if ($(this).attr('data-name') == 'trueChoose') {
                $(this).parents('.choose').addClass('trueBg');
                score ++;
            } else {
                $(this).parents('.choose').addClass('falseBg');
                randArrList.push($(this).attr('data-index')*1);
            }
            if (!isSync) {
                $(this).trigger("chooseBtnClick");
                return;
            }
            
            // if (window.frameElement.getAttribute('user_type') == 'tea') {
                SDK.bindSyncEvt({
                    sendUser: '',
                    receiveUser: '',
                    index: $(e.currentTarget).data("syncactions"),
                    eventType: 'click',
                    method: 'event',
                    syncName: 'chooseBtnClick',
                    otherInfor: {
                        nowIndex: nowIndex,
                        score: score,
                        randArrList: randArrList,
                        itemEle: that.attr('class').split(' ')[0],
                        isStart: true
                    },
                    recoveryMode: '1'
                });
            // }
        } 
    })
    $(".chooseBtn").on('chooseBtnClick', function (e, message) {
        if (isSync) {
            let otherInfor = message.data[0].value.syncAction.otherInfor;
            nowIndex = otherInfor.nowIndex;
            randArrList = otherInfor.randArrList;
            score = otherInfor.score;
            if (message.operate == '5') {
                callbackFn(otherInfor);
                return;
            }
        }
        let thisDataName = $(this).attr('data-name');
        let that = $(this);
        let thisItem = $(this).parents('.item');
        $(this).find('audio').get(0).play();
        if (thisDataName == 'trueChoose') {
            thisItem.find('.hammer').show().addClass('hammerPlay').on('animationend webkitAnimationEnd', function () {
                thisItem.find('.hammer').hide().removeClass('hammerPlay').off('animationend webkitAnimationEnd');
                thisItem.find('.head').addClass('trueFace').on('animationend webkitAnimationEnd', function () {
                    thisItem.find('.head').addClass('wrongFace').off('animationend webkitAnimationEnd');
                    thisItem.find('.head').removeClass('trueFace');
                    thisItem.find('.digletImg').removeClass('showAn');
                    thisItem.find('.choose').addClass('hide');
                    $('.scoreNum').html(score)
                    $('.intSatge .face').addClass('wrong');
                    that.parents('.choose').removeClass('trueBg');
                    nextFn();
                });
            })
        } else {
            thisItem.find('.head').addClass('wrongFace').on('animationend webkitAnimationEnd', function () {
                thisItem.find('.head').addClass('wrongFace').off('animationend webkitAnimationEnd');
                thisItem.find('.head').removeClass('wrongFace');
                thisItem.find('.digletImg').removeClass('showAn');
                thisItem.find('.choose').addClass('hide');
                that.parents('.choose').removeClass('falseBg');
                nextFn();     
            });
        }
    })

    /**
     * 选择下一个元素
    */

    function nextFn () {
        chooseBtnStatus = true;
        nowIndex ++;
        if (randArrList[nowIndex] != undefined) {
            $('.item_' + (randArrList[nowIndex] + 1)).find('.digletImg').addClass('showAn');
            $('.item_' + (randArrList[nowIndex] + 1)).find('.choose').removeClass('hide');
        } else {
            $('.digletImg').removeClass('showAn');
            $('.choose').addClass('hide');
            if (score>0) {
                $('.endImg').addClass('wrong');
                $('.winAudio').get(0).play();
            } else {
                $('.failAudio').get(0).play();
            }
            $('.endAlert').show().find('span').html(score);
            $('.mask').show();
            clearInterval(timeInt);
            window.localStorage.removeItem('countDownTime');
        }
    }

    /**
     * 掉线重连恢复数据
    */

    function callbackFn (otherInfor) {
        if (otherInfor.isStart) {
            $('.mask').hide();
            $('.timeChangeBox').hide();
            $('.startBox').hide();
            $('.item_' + (randArrList[nowIndex] + 1)).find('.digletImg').addClass('showAn');
            $('.item_' + (randArrList[nowIndex] + 1)).find('.choose').removeClass('hide');
            time = window.localStorage.getItem('countDownTime');
            moveItemW = moveItemW - (configDatas.time - time)*everLen;
            $('.proprogressBar').css('width', moveItemW + 'rem');
            
            timeInt = setInterval(function () {
                time--;
                if (time <= 0) {
                    clearInterval(timeInt);
                    $('.digletImg').removeClass('showAn');
                    $('.choose').addClass('hide');
                    if (score>0) {
                        $('.endImg').addClass('wrong');
                        $('.winAudio').get(0).play();
                    } else {
                        $('.failAudio').get(0).play();
                    }
                    $('.endAlert').show().find('span').html(score);
                    $('.mask').show();
                    window.localStorage.removeItem('countDownTime');
                } else {
                    window.localStorage.setItem('countDownTime',time);
                    moveItemW = moveItemW - everLen;
                    $('.proprogressBar').css('width', moveItemW + 'rem');
                }
            }, 1000);
            $('.scoreNum').html(score);
            $('.'+otherInfor.itemEle).find('.digletImg').removeClass('showAn');
            $('.'+otherInfor.itemEle).find('.choose').addClass('hide');
            nextFn();
        }
    }

    /**
    * 断线后对端暂停处理 
    */
    window.SDK.memberChange = function (message) {
        if(isSync) {
            // 进入教室
            if (message.state == 'enter') {
                if (timeInt) {
                    timeInt = setInterval(function () {
                        time--;
                        if (time <= 0) {
                            clearInterval(timeInt);
                            $('.digletImg').removeClass('showAn');
                            $('.choose').addClass('hide');
                            if (score>0) {
                                $('.endImg').addClass('wrong');
                                $('.winAudio').get(0).play();
                            } else {
                                $('.failAudio').get(0).play();
                            }
                            $('.endAlert').show().find('span').html(score);
                            $('.mask').show();
                            window.localStorage.removeItem('countDownTime');
                        } else {
                            window.localStorage.setItem('countDownTime',time);
                            moveItemW = moveItemW - everLen;
                            $('.proprogressBar').css('width', moveItemW + 'rem');
                        }
                    }, 1000);
                }
            } else if(message.state == 'out'){  // 退出教室
                if (timeInt) {
                    clearInterval(timeInt);
                }
            }
        }
    }
})