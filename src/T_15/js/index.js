"use strict"
import '../../common/js/common_1v1.js'

$(function () {
    window.h5Template = {
        hasPractice: '1'
    }
    var h5SyncActions = parent.window.h5SyncActions;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    let staticData = configData.source;
    let a_ele = '';
    let seleList = null;
    //老师端显示提示单词 
    if (isSync) {
        if (window.frameElement.getAttribute('user_type') == 'tea') {
            if (staticData.seleList[0].hasOwnProperty('font')) {
                var tipHtml = ''
                for (let i = 0, length = staticData.seleList.length; i < length; i++) {
                    tipHtml += '<li>' + (i + 1) + '. ' + staticData.seleList[i].font + '</li>'
                }
                $('.scoolBox ul').append(tipHtml)
            } else {
                $('.TrueChoose').hide();
            }
        } else {
            $('.TrueChoose').hide();
        }
    } else {
        if (staticData.seleList[0].hasOwnProperty('font')) {
            var tipHtml = ''
            for (let i = 0, length = staticData.seleList.length; i < length; i++) {
                tipHtml += '<li>' + (i + 1) + '. ' + staticData.seleList[i].font + '</li>'
            }
            $('.scoolBox ul').append(tipHtml);
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
                $('.TrueChoose').show();
            } else if(role_num =='2'){
                $('.TrueChoose').hide();
            }
        } else {
            $('.TrueChoose').hide()
        }
    }

    let parentW = .38;
    for (let i = 0; i < $('.TrueChoose ul li').length; i++) {
        parentW += $('.TrueChoose ul li').eq(i).width() / base + .38
    }
    $('.TrueChoose ul').css('width', parentW + 'rem')
    if (parentW < $('.TrueChoose .scoolBox').width() / base) {
        $('.TrueChoose .rightBtn').css('color', '#ccc')
    }
    //点击左右按钮
    let fontScrolLeft = 0;
    let sroolDis = 0;
    let overDis = $('.TrueChoose ul').width() - $('.TrueChoose .scoolBox').width();
    let isCli = true;
    $('.leftBtn').on('click touchstart', function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation();
        if (isCli) {
            if (Math.abs($('.TrueChoose ul').position().left) >= 1) {
                $('.TrueChoose .rightBtn').css('color', 'orange')
                isCli = false
                sroolDis--;
                $('.TrueChoose ul').animate({ 'left': -sroolDis + 'rem' }, 500, function () {
                    isCli = true
                })
            } else {
                $('.TrueChoose .leftBtn').css('color', 'orange')
                $(this).css('color', '#ccc')
                $('.TrueChoose ul').animate({ 'left': '0rem' }, 500, function () {
                    isCli = true
                })
            }
        }
    })
    $('.rightBtn').on('click touchstart', function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation();
        if (isCli) {
            if (Math.abs($('.TrueChoose ul').position().left) <= overDis) {
                $('.TrueChoose .leftBtn').css('color', 'orange')
                isCli = false
                sroolDis++;
                $('.TrueChoose ul').animate({ 'left': -sroolDis + 'rem' }, 500, function () {
                    isCli = true
                })
            } else {
                $(this).css('color', '#ccc')
            }
        }
    })
    if (isSync) {
        if (staticData.random) {
            let pages = SDK.getClassConf().h5Course.localPage//页码打乱顺序
            let seleListOne = window.reSort(staticData.seleList, pages);
            seleList = window.reSort(seleListOne, staticData.random);
        } else {
            let pages = SDK.getClassConf().h5Course.localPage//页码打乱顺序
            seleList = window.reSort(staticData.seleList, pages);
        }
    } else {
        if (staticData.random) {
            seleList = window.reSort(staticData.seleList, staticData.random);
        } else {
            seleList = window.reSort(staticData.seleList, Math.round(Math.random() * 100));
        }
    }

    let itemobj = {};
    //初始化页面
    (function fnSpell() {
        for (let i = 0, length = seleList.length; i < length; i++) {
            itemobj[seleList[i].key] = false
            if (seleList[i].audio) {
                a_ele += `<div class="ans-box ansBox pos_${seleList[i].key}" data-key="${seleList[i].key}"><div class="ans-img" data-syncactions="item${i}" ><img src="${seleList[i].img}"/><p><img src="image/${seleList[i].key}.png"/></p></div><div class="ans-audio" data-syncactions="audio${i}" ><img src="image/sound.png"/><audio src="${seleList[i].audio}"></audio></div></div>`
            } else {
                a_ele += `<div class="ans-box ansBox pos_${seleList[i].key}" data-key="${seleList[i].key}"><div class="ans-img" data-syncactions="item${i}" ><img src="${seleList[i].img}"/><p><img src="image/${seleList[i].key}.png"/></p></div></div>`
            }

        }
        
        $('.ans-area').append(a_ele);
        if (seleList.length == 4) {
            $('.stage .ans-area').css({ 
                'width': '11.3rem' ,
                'margin-left':'-5.51rem'
            })
        }
        if (seleList.length == 3) {
            $('.stage .ans-area').css({ 
                'height': '3.9rem',
                'margin-top': '-1rem'
            })
        }
    })()
    //老师端点击播放声音
    var chooseNum = 1;
    var itemClickTea = true
    $('.ans-audio').on('click touchstart', function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation();
        if (itemClickTea) {
            itemClickTea = false;
            if (!isSync) {
                $(this).trigger('syncSoundClick')
                return;
            }
            if (window.frameElement.getAttribute('user_type') == 'tea') {
                SDK.bindSyncEvt({
                    index: $(e.currentTarget).data('syncactions'),
                    eventType: 'click',
                    method: 'event',
                    funcType: 'audio',
                    syncName: 'syncSoundClick',
                    otherInfor: {
                        obj: itemobj,
                        num: chooseNum
                    },
                    recoveryMode: '1'
                });
            } else {
                $(this).trigger('syncSoundClick');
                return;
            }
        } else {
            $(this).trigger('syncSoundClick');
            return;
        }
    })

    //复制新的bool值变量
    let isSync_bool = ($(window.frameElement).attr('id') == 'h5_course_self_frame' || !isSync)

    $('.ans-audio').on("syncSoundClick", function (e, message) {
        if (isSync && message) {
            var otherInfor = message.data[0].value.syncAction.otherInfor;
            itemobj = otherInfor.obj;
            chooseNum = otherInfor.num;
            if (message.operate == '5') {
                callbackFn(otherInfor);
                return;
            }
        }
        if (isSync_bool) {
            if ($(this).find('audio').length > 0) { //判断是否有audio
                $(this).find('audio').get(0).load()
                $(this).find('audio').get(0).play()
                $(this).find('img').attr('src', 'image/sound.gif')
                $(this).find('audio').get(0).onended = function () {
                    $(this).find('img').attr('src', 'image/sound.png')
                }.bind($(this))
            }
        }
        SDK.setEventLock();
        itemClickTea = true
    })
    //学生开始作答
    var itemClickStu = true;
    var finishClick = true;
    $('.ans-img').on('click touchstart', function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation();
        if (itemClickStu && !$(this).hasClass('finish')) {
            itemClickStu = false;
            if (!isSync) {
                $(this).trigger('syncClickStu')
                return;
            }
            let thisKey = $(this).parents('.ans-box').data('key');
            if (thisKey == chooseNum) {
                itemobj[thisKey] = true;
            };
            if (window.frameElement.getAttribute('user_type') == 'stu' && finishClick) {
                SDK.bindSyncEvt({
                    index: $(e.currentTarget).data('syncactions'),
                    eventType: 'click',
                    method: 'event',
                    funcType: 'audio',
                    syncName: 'syncClickStu',
                    otherInfor: {
                        obj: itemobj,
                        num: chooseNum
                    },
                    recoveryMode: '1'
                });
            }
        }
    })
    $('.ans-img').on('syncClickStu', function (e, message) {
        if (isSync) {
            var otherInfor = message.data[0].value.syncAction.otherInfor;
            itemobj = otherInfor.obj;
            chooseNum = otherInfor.num;
            if (message.operate == '5') {
                callbackFn(otherInfor);
                return;
            }
        };
        var thisKey = $(this).parents('.ans-box').data('key')
        var thisParent = $(this).parents('.ans-box')
        if (thisKey == chooseNum) {
            $(this).addClass('finish')
            $('.ans-box').eq(thisKey - 1).before($(this).parents('.ans-box'))
            if (isSync) {
                if ($(window.frameElement).attr('id') === 'h5_course_self_frame') {//答对播放声音
                    if (thisParent.find('audio').length > 0) { //判断是否有audio
                        thisParent.find('audio').get(0).play()
                        thisParent.find('.ans-audio img').attr('src', 'image/sound.gif')
                        thisParent.find('audio').get(0).onended = function () {
                            thisParent.find('.ans-audio img').attr('src', 'image/sound.png')
                        }
                    }
                }
            } else {//不在ac中
                if (thisParent.find('audio').length > 0) { //判断是否有audio
                    thisParent.find('audio').get(0).play()
                    thisParent.find('.ans-audio img').attr('src', 'image/sound.gif')
                    thisParent.find('audio').get(0).onended = function () {
                        thisParent.find('.ans-audio img').attr('src', 'image/sound.png')
                    }
                }
            }
            //答对出现效果
            $(this).find('p').css({ 'display': 'block' })
            if (chooseNum >= $('.ans-box').length) {//全答完发送星星
                finishClick = false;
                $('.ans-img').find('p').css({ 'display': 'none' })
                $('.ans-img').css({ 'border': '.08rem solid #6be540' })
                /* if(isSync){
                    SDK.bindSyncResultEvt({
                        sendUser: message.data[0].value.sendUser,
                        receiveUser: message.data[0].value.receiveUser,
                        sendUserInfo: message.data[0].value.sendUserInfo,
                        index: $('#container').data('syncresult'),
                        resultData:{isRight: true},
                        syncName: 'teaShowResult',
                        starSend: message.data[0].value.starSend,
                        questionType:'TS',
                        tplate:'TS004'
                    });
                }  */
            }
            chooseNum++;
            SDK.setEventLock();
            itemClickStu = true
        } else {
            thisParent.addClass('shake')
            if (isSync) {
                if ($(window.frameElement).attr('id') === 'h5_course_self_frame') {
                    $('#wrong')[0].play()
                }
                /*SDK.bindSyncResultEvt({
                    sendUser: message.data[0].value.sendUser,
                    receiveUser: message.data[0].value.receiveUser,
                    sendUserInfo: message.data[0].value.sendUserInfo,
                    index: $('#container').data('syncresult'),
                    resultData: {
                        isRight: false
                    },
                    syncName: 'teaShowResult',
                    questionType:'TS',
                    tplate:'TS004'
                });*/
            } else {
                $('#wrong')[0].play()
            }
            thisParent.on('animationend webkitAnimationEnd', function () {
                thisParent.removeClass('shake')
            })
            SDK.setEventLock();
            itemClickStu = true
        }

    });

    function callbackFn(msg) {
        itemobj = msg.obj;
        chooseNum = msg.num+1;
        $.each(itemobj, function (key, val) {
            if (val) {
                $($('.pos_' + key)).find('.ans-img').addClass('finish');
                $('.pos_' + key).find('p').css({ 'display': 'block' });
                $('.ans-box').eq(key - 1).before($('.pos_' + key));
            }
        })
    };
})
