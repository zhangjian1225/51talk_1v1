"use strict"
import '../../common/js/common_1v1.js'

$(function () {
    // ac 内是否显示授权按钮的开关
    window.h5Template = {
        hasPractice: '0'
    }
    const h5SyncActions = parent.window.h5SyncActions;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;

    const self_frame_id = $(window.frameElement).attr('id');
    /**
     * 创建dom元素
     */
    let source = configData.source

    if (configData.bg) {
        $('.main-box').css({
            'background': `url(${configData.bg}) no-repeat center`,
            'background-size': 'cover'
        })
    } else {
        $('.main-box').addClass('main-bg')
    }

    if (source.toy) {
        $('.toy').css({
            'background': `url(${source.toy}) no-repeat center`,
            'background-size': 'contain'
        })
    }

    $('.person .box').css({
        'background': `url(${source.person}) no-repeat`,
        'background-size': '18rem auto'
    })

    if (source.text) {
        $('.text').attr('src', source.text)
    }
    let audio = $('.main-box audio');
    if (source.audio) {
        $('.ans-audio').show();
        audio.attr({
            'src': source.audio
        })

    }
    // 老师端或者浏览器环境下显示小手图标
    isShowHand();
    function isShowHand() {
        if (isSync) {
            if (window.frameElement.getAttribute('user_type') == 'stu') {
                $('.btns').hide();
            } else {
                $('.btns').show();
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
                $('.btns').show();
            } else if (role_num == '2') {
                $('.btns').hide();
            }
        }
    }
    // 开始动画（放大）
    function startAnimation() {
        if (source.isMax) {
            setTimeout(() => {
                $('.main-box').css({
                    'transform': 'scale(1.7)'
                })

                setTimeout(() => {
                    fnAni()
                }, 1500)
            }, 500)
        } else {
            fnAni();
        }
        function fnAni() {
            if (source.toy) {
                $('.toy').addClass('shake')
            }
            if (source.text) {
                $('.textBox').show();
            }
            if (source.audio) {
                $('.box').addClass('talk')
                let isSync_bool = (self_frame_id == 'h5_course_self_frame' || !isSync)
                if (isSync_bool) {
                    audio[0].play();
                    $('.audioPng').hide();
                    $('.audioGif').show();
                    audio.on('ended', () => {
                        $('.audioPng').show();
                        $('.audioGif').hide();
                        $('.box').removeClass('talk');
                        $('.main-box').removeClass('transition');
                        if (source.toy) {
                            $('.toy').removeClass('shake');
                        }
                        isShowHand();
                    })
                }
            } else {
                if (source.toy) {
                    $('.toy').removeClass('shake');
                }
                $('.box').removeClass('talk');
                $('.main-box').removeClass('transition')
                isShowHand()
            }
        }
    }

    let itemHandClick = true;
    $('.btns').on('click touchstart', function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation();
        if (itemHandClick) {
            itemHandClick = false;
            if (!isSync) {
                $(this).trigger('handClick')
                return;
            }
            SDK.bindSyncEvt({
                index: $(e.currentTarget).data('syncactions'),
                eventType: 'click',
                method: 'event',
                funcType: 'audio',
                syncName: 'handClick',
                otherInfor: {
                    clickBtn: true
                },
                recoveryMode: '1'
            });
        }
    })
    $('.btns').on('handClick', function (e, message) {
        if (isSync && message.operate == '5') {
            let msg = message.data[0].value.syncAction.otherInfor.clickBtn;
            callbackFn(msg);
            return;
        }
        $('.main-box').css({
            'transform': 'scale(1)'
        })
        $('.textBox').hide();
        $('.btns').hide().addClass('again');
        $('.hand').hide();
        setTimeout(() => {
            $('.main-box').addClass('transition')
            startAnimation();
            itemHandClick = true;
            SDK.setEventLock();
        }, 100)
    })

    /**
     * 点击声音按钮
    */

    let itemAudioClick = true;
    $('.ans-audio').on('click touchstart', function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation();
        if (itemAudioClick) {
            itemAudioClick = false;
            if (!isSync) {
                $(this).trigger('AudioClick')
                return;
            }
            SDK.bindSyncEvt({
                index: $(e.currentTarget).data('syncactions'),
                eventType: 'click',
                method: 'event',
                funcType: 'audio',
                syncName: 'AudioClick',
                otherInfor: {
                    clickBtn: true
                },
                recoveryMode: '1'
            });
        }
    })
    $('.ans-audio').on('AudioClick', function (e, message) {
        if (isSync && message.operate == '5') {
            let msg = message.data[0].value.syncAction.otherInfor.clickBtn;
            callbackFn(msg);
            return;
        }
        if (self_frame_id == 'h5_course_self_frame' || !isSync) {
            $('.audioPng').hide();
            $('.audioGif').show();
            $('.box').addClass('talk');
            audio[0].play()
            audio.on('ended', () => {
                $('.box').removeClass('talk')
                $('.audioPng').show();
                $('.audioGif').hide();
                itemAudioClick = true;
            })
        }
    })

    /**
     * 重新进入教室回调
    */
    function callbackFn(msg) {
        if (msg) {
            if (isSync) {
                if (window.frameElement.getAttribute('user_type') == 'stu') {
                    $('.btns').hide();
                } else {
                    $('.btns').show().addClass('again');
                }
            }
            if (source.isMax) {
                $('.main-box').removeClass('transition')
                $('.main-box').css({
                    'transform': 'scale(1.7)'
                })
                $('.textBox').show();
            } else {
                $('.textBox').show();
            }
        }
    }
})
