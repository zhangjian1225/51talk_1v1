"use strict"
import '../../common/js/common_1v1.js'

$(function () {
    window.h5Template = {
        hasPractice: '0'
    }
    let h5SyncActions = parent.window.h5SyncActions;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    /**
     * 区分学生老师
    */
    if (isSync) {
        if (window.frameElement.getAttribute('user_type') == 'stu') {
            $('.hand').css('opacity', '0');
        }
    }


    /**
     * 创建元素
    */
    let liHtml = '';
    for (let i = 1; i < 801; i++) {
        liHtml += `
            <li class="pos_${i}"></li>
        `
    }
    $('.boxUl').html(liHtml);
    $('.moveImg').append(`
        <img src="${configData.source.img}" class="upImg"/>
    `);
    $('.upImg').get(0).onload = function () {
        $('.upImg').css({
            'width': $('.upImg').get(0).width/100 + "rem",
            'height': $('.upImg').get(0).height /100 + "rem"
        })
    }
    /**
     * 初始、终止位置图片
    */
    let startPos = configData.source.startPos;
    let endPos = configData.source.endPos;
    let left = ($('.pos_' + startPos).offset().left - $('.container').offset().left) / window.base + 'rem';
    let top = ($('.pos_' + startPos).offset().top - $('.container').offset().top) / window.base + 'rem';
    $('.moveImg').css({
        left: left,
        top: top
    });

    /**
     * 老师点击按钮
    */

    let btnStatus = true;
    let clickNum = 0; // 按钮点机的次数
    $(".hand").on("click touchstart", function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation();
        if (btnStatus) {
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
                    otherInfor: '',
                    recoveryMode: '1'
                });
            }
        }
    })
    $(".hand").on('btnClick', function (e, message) {
        $('.upImg').addClass('toMin').on('animationend webkitAnimationEnd', function () {
            $('.upImg').hide();
            $('.light').show();
            $('audio').get(0).play();
            let element = $('.moveImg').get(0); // 移动元素
            let target = $('.pos_' + endPos).get(0); // 最终的元素
            let parabola = funParabola(element, target, {
                curvature: '.1',
                complete: function () {
                    setTimeout(function(){
                        $('.upImg').show();
                        $('.light').hide();
                        $('.upImg').removeClass('toMin').addClass('toMax');
                        $('.upImg').addClass('toMin').off('animationend webkitAnimationEnd');
                    },1000)
                }
            }).mark(1, 100);
            setTimeout(function() {
                parabola.init();
            },500)
        })
        $('.hand').css('opacity', '0')
        // btnStatus = true;
        SDK.setEventLock();
    })
})
