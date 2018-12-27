"use strict"
import '../../common/js/common_1v1.js'

$(function () {
    window.h5Template = {
        hasPractice: '1'
    }
    let h5SyncActions = parent.window.h5SyncActions;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    /*tips*/
    let seleList = null;
    //老师端显示提示单词 
    if (isSync) {
        if (window.frameElement.getAttribute('user_type') == 'tea') {
            if (configData.source.list[0].hasOwnProperty('font')) {
                var tipHtml = ''
                for (let i = 0, length =configData.source.list.length; i < length; i++) {
                    tipHtml += '<li>' + (i + 1) + '. ' +configData.source.list[i].font + '</li>'
                }
                $('.scoolBox ul').append(tipHtml)
            } else {
                $('.TrueChoose').hide();
            }
        } else {
            $('.TrueChoose').hide();
        }
    } else {
        if (configData.source.list[0].hasOwnProperty('font')) {
            var tipHtml = ''
            for (let i = 0, length = configData.source.list.length; i < length; i++) {
                tipHtml += '<li>' + (i + 1) + '. ' + configData.source.list[i].font + '</li>'
            }
            $('.scoolBox ul').append(tipHtml)
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


    let allHtml = ''
    for (let i = 0; i<configData.source.list.length; i++) {
        allHtml +=`
        <div class="box" data-syncactions="box_${i+1}" style="background: url('${configData.source.list[i].img}') no-repeat;background-size: 7.6rem auto;">
                <img src="./image/light.png">
            </div>
        `
    }
    $('.box_list').html(allHtml);
    let itemClick = true;
    let openArr = [];// 打开箱子的index
    $('.box').on('click touchstart', function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation();
        if (itemClick && !$(this).hasClass('end')) {
            itemClick = false;
            openArr.push($(this).index());
            if (!isSync) {
                $(this).trigger('buttonClick')
                return;
            }
            SDK.bindSyncEvt({
                index: $(e.currentTarget).data('syncactions'),
                eventType: 'click',
                method: 'event',
                funcType: 'audio',
                syncName: 'buttonClick',
                otherInfor:{
                    openArr_back: openArr
                },
                recoveryMode:'1'
            });
        }
    })
    $('.box').on('buttonClick', function (e, message) {
        $(this).addClass('end');
        if (isSync  && message.operate=='5') {
            var otherInfor = message.data[0].value.syncAction.otherInfor;
            openArr = otherInfor.openArr_back;
            for(let i=0; i<otherInfor.openArr_back.length; i++) {
                $('.box').eq(otherInfor.openArr_back[i]).css({
                    'background-position':'-3.6rem 0'
                }).find('img').hide();
            }
        } else {
            if (isSync) {
                var otherInfor = message.data[0].value.syncAction.otherInfor;
                openArr = otherInfor.openArr_back;
            }
            let that = $(this);
            $('audio').get(0).play();
            $('audio').get(0).onended = function () {
                itemClick = true;
            }
            $(this).find('img').show().addClass('max');
            $(this).on('animationend webkitAnimationEnd', function () {
                that.css({
                    'background-position':'-3.8rem 0'
                }).find('img').hide();
            })
        }
        SDK.setEventLock();
    })
})
