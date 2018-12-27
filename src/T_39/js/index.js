"use strict"
import '../../common/js/common_1v1.js'
import '../../common/js/drag.js'
import { callbackify } from 'util';

$(function () {
    window.h5Template = {
    	hasPractice: '1' 
    }
    let h5SyncActions = parent.window.h5SyncActions;
    let source = configData.bg;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    if (isSync) {
        if (window.frameElement.getAttribute('user_type') == 'tea') {
            $('.btns').css('opacity','1');
        } else {
            $('.btns').css('opacity','0');
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
        if (role_num =='1') {
            $('.btns').css('opacity','1');
        } else if(role_num =='2'){
            $('.btns').remove();
        }
    }
    
    if (source) {
        $('.glass p').css({
            'background':'url('+source+') no-repeat',
            'background-size': '19.2rem 10.8rem'
        })
    }
    let m_left = ($('.move_item .glass p').offset().left - $('.container').offset().left) / window.base;
    let m_top = ($('.move_item .glass p').offset().top - $('.container').offset().top) / window.base;
    $('.glass p').css({
        'background-position-x':-m_left+'rem',
        'background-position-y':-m_top+'rem'
    })

    /**
     * 拖拽
    */
    $('.move_item').drag({
        before: function(e) {
            m_left = ($('.move_item .glass p').offset().left - $('.container').offset().left) / window.base;
            m_top = ($('.move_item .glass p').offset().top - $('.container').offset().top) / window.base;
            $('.glass p').css({
                'background-position-x':-m_left+'rem',
                'background-position-y':-m_top+'rem'
            })
        },
        process: function(e) {
            m_left = ($('.move_item .glass p').offset().left - $('.container').offset().left) / window.base;
            m_top = ($('.move_item .glass p').offset().top - $('.container').offset().top) / window.base;
            $('.glass p').css({
                'background-position-x':-m_left+'rem',
                'background-position-y':-m_top+'rem'
            })
        },
        end: function(e) {
            m_left = ($('.move_item .glass p').offset().left - $('.container').offset().left) / window.base;
            m_top = ($('.move_item .glass p').offset().top - $('.container').offset().top) / window.base;
            $('.glass p').css({
                'background-position-x':-m_left+'rem',
                'background-position-y':-m_top+'rem'
            })
            if (isSync) {
                SDK.bindSyncEvt({
                    index: $(this).data('syncactions'),
                    eventType: 'click',
                    method: 'event',
                    syncName: 'syncDragEnd',
                    otherInfor:{
                        scaleMsg: scale,
                        left: $('.move_item').attr('data-left'),
                        top: $('.move_item').attr('data-top'),
                        pos_l: m_left,
                        pos_t: m_top
                    },
                    recoveryMode:'1'
                })
            }
        }
    })
    $('.move_item').on('syncDragEnd',function (e, message) {
        let otherInfo = message.data[0].value.syncAction.otherInfor
        scale = otherInfo.scaleMsg;
        m_left = otherInfo.pos_l;
        m_top = otherInfo.pos_t;
        if (message.operate=='5') {
            callback(otherInfo.left,otherInfo.top);
            return;
        }
        $('.move_item').css({
            'left': otherInfo.left,
            'top': otherInfo.top
        })
        $('.glass p').css({
            'background-position-x':-m_left+'rem',
            'background-position-y':-m_top+'rem'
        })
    })
    /**
     * 点击变大按钮
    */
    let maxClick = true;
    let scale = 1;
    $('.btn_1').on('click touchstart', function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation();
        if (maxClick && scale <3) {
            maxClick = false;
            scale ++;
            if (!isSync) {
                $(this).trigger('btnClick')
                return;
            }
            if (window.frameElement.getAttribute('user_type') == 'tea') {
                SDK.bindSyncEvt({
                    index: $(e.currentTarget).data('syncactions'),
                    eventType: 'click',
                    method: 'event',
                    funcType: 'audio',
                    syncName: 'btnClick',
                    otherInfor:{
                        scaleMsg: scale,
                        left: $('.move_item').attr('data-left'),
                        top: $('.move_item').attr('data-top'),
                        pos_l: m_left,
                        pos_t: m_top
                    },
                    recoveryMode:'1'
                });
            }
        }
    })
    $('.btn_1').on('btnClick', function (e,message) {
        if (isSync) {
            let otherInfo = message.data[0].value.syncAction.otherInfor
            scale = otherInfo.scaleMsg;
            m_left = otherInfo.pos_l;
            m_top = otherInfo.pos_t;
            if (message.operate=='5') {
                callback(otherInfo.left,otherInfo.top);
                return;
            }
        }
        if (scale == '2') {
            $('.move_item').css({
                'width':'7.125rem',
                'height':'6.6rem'
            })
            $('.glass').css({
                'width':'6.15rem',
                'height':'6.465rem'
            })
            $('.glass p').css({
                'width':'5.025rem',
                'height':'5.03rem',
                'left':'.54rem',
                'top':'.825rem',
                'border-radius': '2.52rem'
            })
            $('.btns').css({
                'width':'1.2755rem',
                'height':'1.485rem',
                'right':'.18rem',
                'bottom':'.18rem'
            })
            $('.btns span').css({
                'width':'.75rem',
                'height':'.75em',
                'border-radius':'.38rem'
            })
        } else if(scale == '3'){
            $('.move_item').css({
                'width':'9.5rem',
                'height':'8.8rem'
            })
            $('.glass').css({
                'width':'8.2rem',
                'height':'8.62rem'
            })
            $('.glass p').css({
                'width':'6.7rem',
                'height':'6.74rem',
                'left':'.72rem',
                'top':'1.1rem',
                'border-radius': '3.36rem'
            })
            $('.btns').css({
                'width':'1.7rem',
                'height':'1.98rem',
                'right':'.24rem',
                'bottom':'.24rem'
            })
            $('.btns span').css({
                'width':'1rem',
                'height':'1rem',
                'border-radius':'.5rem'
            })
        }
        maxClick = true;
        SDK.setEventLock();
    })

    /**
     * 点击变小按钮
    */
    let smallClick = true;
    $('.btn_2').on('click touchstart', function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation();
        if (smallClick && scale >1) {
            smallClick = false;
            scale --;
            if (!isSync) {
                $(this).trigger('btnClick2')
                return;
            }
            if (window.frameElement.getAttribute('user_type') == 'tea') {
                SDK.bindSyncEvt({
                    index: $(e.currentTarget).data('syncactions'),
                    eventType: 'click',
                    method: 'event',
                    funcType: 'audio',
                    syncName: 'btnClick2',
                    otherInfor:{
                        scaleMsg: scale,
                        left: $('.move_item').attr('data-left'),
                        top: $('.move_item').attr('data-top'),
                        pos_l: m_left,
                        pos_t: m_top
                    },
                    recoveryMode:'1'
                });
            }
        }
    })
    $('.btn_2').on('btnClick2', function (e,message) {
        if (isSync) {
            let otherInfo = message.data[0].value.syncAction.otherInfor
            scale = otherInfo.scaleMsg;
            m_left = otherInfo.pos_l;
            m_top = otherInfo.pos_t;
            if (message.operate=='5') {
                callback(otherInfo.left,otherInfo.top);
                return;
            }
        }
        if (scale == '2') {
            $('.move_item').css({
                'width':'7.125rem',
                'height':'6.6rem'
            })
            $('.glass').css({
                'width':'6.15rem',
                'height':'6.465rem'
            })
            $('.glass p').css({
                'width':'5.025rem',
                'height':'5.03rem',
                'left':'.54rem',
                'top':'.825rem',
                'border-radius': '2.52rem'
            })
            $('.btns').css({
                'width':'1.2755rem',
                'height':'1.485rem',
                'right':'.18rem',
                'bottom':'.18rem'
            })
            $('.btns span').css({
                'width':'.75rem',
                'height':'.75em',
                'border-radius': '.35rem'
            })
        } else if(scale == '1'){
            $('.move_item').css({
                'width':'4.75rem',
                'height':'4rem'
            })
            $('.glass').css({
                'width':'4.1rem',
                'height':'4.31rem'
            })
            $('.glass p').css({
                'width':'3.35rem',
                'height':'3.37rem',
                'left':'.36rem',
                'top':'.551rem',
                'border-radius': '1.68rem'
            })
            $('.btns').css({
                'width':'.85rem',
                'height':'.99rem',
                'right':'.12rem',
                'bottom':'.12rem'
            })
            $('.btns span').css({
                'width':'.5rem',
                'height':'.5rem',
                'border-radius': '.25rem'
            })
        }
        smallClick = true;
        SDK.setEventLock();
    })

    /**
     * 退出教室重新进入
    */

    function callback (l,t) {
        $('.move_item').css({
            'left': l,
            'top': t
        })
        $('.glass p').css({
            'background-position-x':-m_left+'rem',
            'background-position-y':-m_top+'rem'
        })
        if (scale == '2') {
            $('.move_item').css({
                'width':'7.125rem',
                'height':'6.6rem'
            })
            $('.glass').css({
                'width':'6.15rem',
                'height':'6.465rem'
            })
            $('.glass p').css({
                'width':'5.025rem',
                'height':'5.03rem',
                'left':'.54rem',
                'top':'.825rem',
                'border-radius': '2.52rem'
            })
            $('.btns').css({
                'width':'1.2755rem',
                'height':'1.485rem',
                'right':'.18rem',
                'bottom':'.18rem'
            })
            $('.btns span').css({
                'width':'.75rem',
                'height':'.75em',
                'border-radius': '.35rem'
            })
        } else if(scale == '1'){
            $('.move_item').css({
                'width':'4.75rem',
                'height':'4rem'
            })
            $('.glass').css({
                'width':'4.1rem',
                'height':'4.31rem'
            })
            $('.glass p').css({
                'width':'3.35rem',
                'height':'3.37rem',
                'left':'.36rem',
                'top':'.551rem',
                'border-radius': '1.68rem'
            })
            $('.btns').css({
                'width':'.85rem',
                'height':'.99rem',
                'right':'.12rem',
                'bottom':'.12rem'
            })
            $('.btns span').css({
                'width':'.5rem',
                'height':'.5rem',
                'border-radius': '.25rem'
            })
        } else {
            $('.move_item').css({
                'width':'9.5rem',
                'height':'8.8rem'
            })
            $('.glass').css({
                'width':'8.2rem',
                'height':'8.62rem'
            })
            $('.glass p').css({
                'width':'6.7rem',
                'height':'6.74rem',
                'left':'.72rem',
                'top':'1.1rem',
                'border-radius': '3.36rem'
            })
            $('.btns').css({
                'width':'1.7rem',
                'height':'1.98rem',
                'right':'.24rem',
                'bottom':'.24rem'
            })
            $('.btns span').css({
                'width':'1rem',
                'height':'1rem',
                'border-radius':'.5rem'
            })
        }
    }
})