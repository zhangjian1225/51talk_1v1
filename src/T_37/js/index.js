"use strict"
import '../../common/js/common_1v1.js'

$(function () {
    window.h5Template = {
        hasPractice: '0'
    }
    let h5SyncActions = parent.window.h5SyncActions;
    let source = configData.source.maskBg;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    if (isSync) {
        if (window.frameElement.getAttribute('user_type') == 'tea') {
            $('.btn').css('opacity', '1');
        } else {
            $('.btn').css('opacity', '0');
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
        if (role_num == '1') {
            $('.btn').css('opacity', '1');
        } else if (role_num == '2') {
            $('.btn').remove();
        }
    }

    if (source) {
        $('.mask').css({
            'background': 'url(' + source + ') no-repeat',
            'background-size': '100% 100%'
        })
    }
    if (configData.source.audio) {
        $('.audioBg').show().append(`<audio src="${configData.source.audio}" class="audio"></audio>`)
    }

    /**
     * 点击按钮
    */
    let itemClick = true;
    let isOpen = false;
    $('.btn').on('click touchstart', function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation();
        if (itemClick) {
            itemClick = false;
            // 判断幕布是否开启
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
                    otherInfor: {
                        isOpenStatus: isOpen
                    },
                    recoveryMode: '1'
                });
            }
        }
    })
    $('.btn').on('btnClick', function (e, message) {
        if (isSync) {
            isOpen = message.data[0].value.syncAction.otherInfor.isOpenStatus;
        }
        if (isOpen) {
            $('.btn').removeClass('res');
            $('.mask').animate({
                'left': '100%'
            }, 1000)
        } else {
            $('.btn').addClass('res');
            $('.mask').animate({
                'left': '0'
            }, 1000)
        }
        if (isOpen) {
            isOpen = false;
        } else {
            isOpen = true;
        }
        itemClick = true;
        SDK.setEventLock();
    })

    /**
     * 点击声音按钮
    */

    let audioBgClick = true;
    $('.audioBg').on('click touchstart', function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation();
        if (audioBgClick) {
            audioBgClick = false;
            // 判断幕布是否开启
            if (!isSync) {
                $(this).trigger('audioBgClick')
                return;
            }
            if (window.frameElement.getAttribute('user_type') == 'tea') {
                SDK.bindSyncEvt({
                    index: $(e.currentTarget).data('syncactions'),
                    eventType: 'click',
                    method: 'event',
                    funcType: 'audio',
                    syncName: 'audioBgClick',
                    otherInfor: {
                        isOpenStatus: isOpen
                    },
                    recoveryMode: '1'
                });
            }
        }
    })
    $('.audioBg').on('audioBgClick', function (e, message) {
        if (isSync) {
            isOpen = message.data[0].value.syncAction.otherInfor.isOpenStatus;
            if (message.operate == "5") {
                if (isOpen) {
                    $('.btn').removeClass('res');
                    $('.mask').animate({
                        'left': '100%'
                    }, 1000)
                } else {
                    $('.btn').addClass('res');
                    $('.mask').animate({
                        'left': '0'
                    }, 1000)
                }
                if (isOpen) {
                    isOpen = false;
                } else {
                    isOpen = true;
                }
                return;
            }
        }
        $('.audioInit').hide();
        $('.audioGif').show();
        $('.audio').get(0).play()
        $('.audio').get(0).onended = function () {
            $('.audioInit').show();
            $('.audioGif').hide();
        };
        audioBgClick = true;
        SDK.setEventLock();
    })
})