"use strict"
import '../../common/js/common_1v1.js'
import '../../common/js/drag.js'

$(function () {
    window.h5Template = {
        hasPractice: '0'
    }
    let h5SyncActions = parent.window.h5SyncActions;
    let configDatas = configData.source;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;

    /**
     * 创建元素
    */
    if(configDatas.audio!=''){
        $(".doorAre").append(`<audio class="showAudio" src="${configDatas.audio}" style="width:0;height:0;opacity:0"></audio>`)
    }
    $('.img').css({
        'background': `url(${configDatas.doorImg}) no-repeat`,
        'background-size': '20rem 6.7rem'
    })
    $('.fontName').html(configDatas.font);
    if (configDatas.font.length>10) {
        $('.font').css('font-size','.3rem');
    }

    if (configDatas.doorBg) {
        $('.door').css({
            'background': `url(${configDatas.doorBg}) no-repeat`,
            'background-size': '100% 100%'
        });
    }
    if (configDatas.lockOne) {
        $('.step_1').css({
            'background': `url(${configDatas.lockOne}) no-repeat`,
            'background-size': '100% 100%'
        });
    }
    if (configDatas.lockTwo) {
        $('.step_2').css({
            'background': `url(${configDatas.lockTwo}) no-repeat`,
            'background-size': '100% 100%'
        });
    }
    if (configDatas.lockThree) {
        $('.step_3').css({
            'background': `url(${configDatas.lockThree}) no-repeat`,
            'background-size': '100% 100%'
        });
    }
    /**
     * 区分学生老师
    */
    if (isSync) {
        if (window.frameElement.getAttribute('user_type') == 'stu') {
            $('.controls').css('opacity', '0')
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
            $('.controls').css('opacity', '1')
        } else if (role_num == '2') {
            $('.controls').css('opacity', '0')
        }
    }
    /**
     * 移动控制台
    */
    $('.controls').drag();

    /**
     * 老师点击按钮
    */

    let btnStatus = true;
    let clickNum = 0; // 按钮点机的次数
    let timer=null;
    $(".trueBtn").on("click touchstart", function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation();
        if (btnStatus && clickNum < 3) {
            btnStatus = false;
            clickNum++;
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
                    otherInfor: clickNum,
                    recoveryMode: '1'
                });
            }
        }
    })
    $(".trueBtn").on('btnClick', function (e, message) {
        if (isSync) {
            let otherInfor = message.data[0].value.syncAction.otherInfor;
            clickNum = otherInfor;
            if (message.operate == '5') {
                callbackFn(otherInfor);
                return;
            }
        }
        $('.step_' + clickNum).show();
        $('.trueA').get(0).play();
        if (clickNum >= 3) {
            $('.trueBtn').css('cursor', 'not-allowed').addClass('grey');
            setTimeout(function () {
                $('.openA').get(0).play();
                $('.door').addClass('doorAn').on('animationend webkitAnimationEnd', function () {
                   $(this).css({
                       display:"none"
                   })
                    $('.img').show().css({
                        animation:'showStyle 0.8s steps(2) '+configData.source.num ,
                        ' -webkit-animation':'showStyle 0.8s steps(2) '+configData.source.num
                    }).on('animationend webkitAnimationEnd',function(){
                        clearInterval(timer)
                        $(this).css({
                            'background-position':'100% 0'
                        })
                    })
                   
                    timer=setInterval(function(){ 
                        if( $('.showAudio').length>0){
                            $('.showAudio').get(0).currentTime=0;
                            $('.showAudio').get(0).play();
                        }
                    },800);
                });
            }, 500)
        }
        btnStatus = true;
        SDK.setEventLock();
    })

    /**
     * 恢复数据
    */

    function callbackFn(otherInfor) {
        $('.step_' + clickNum).show();
        if (clickNum >= 3) {
            $('.trueBtn').css('cursor', 'not-allowed').addClass('grey');
            $('.door').hide();
            $('.img').show();
        }
    }
})
