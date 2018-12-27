"use strict"
import '../../common/js/common_1v1.js'

$(function () {
    window.h5Template = {
    	hasPractice: '1' 
    }
    let h5SyncActions = parent.window.h5SyncActions;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    let data = configData.source;
    let eyeHtml = '';
    let earHtml = '';
    let noseHtml = '';
    let colorHtml = '';
    let color = {}
    /**
     * 创建五官
    */
    for(let i =0; i<data.list.length; i++){
        eyeHtml +=` <div class="eye" data-syncactions="eye_${i}">
                <img src="${data.list[i].eyeImg}" />
            </div>`
        noseHtml += `<div class="nose" data-syncactions="nose_${i}">
                <img src="${data.list[i].noseImg}" />
            </div>`
        earHtml += `<div class="ear" data-syncactions="ear_${i}">
            <img src="${data.list[i].earImg}" />
        </div>`
    }
    $('.eye_box').html(eyeHtml);
    $('.ear_box').html(earHtml);
    $('.nose_box').html(noseHtml);
    /**
     * 创建色板
     */
    for(let j =0; j<data.bodyList.length; j++){
        colorHtml += `<div class="color" data-cl="color_${j}" data-syncactions="color_${j}" style="background:${data.bodyList[j].color}"></div>`
        color["color_"+j] = data.bodyList[j].img
    }
    $('.color_box').html(colorHtml);
    window.onload = function () {
        /**
         * 点击眼睛
        */
        let eyeClick = true;
        $('.eye').on('click touchstart', function (e) {
            if (e.type == "touchstart") {
                e.preventDefault()
            }
            e.stopPropagation();
            if (!$(this).find('img').hasClass('eye_move')) {
                if (eyeClick) {
                    eyeClick = false;
                    if (!isSync) {
                        $(this).trigger('eyeClick')
                        return;
                    }
                    SDK.bindSyncEvt({
                        index: $(e.currentTarget).data('syncactions'),
                        eventType: 'click',
                        method: 'event',
                        funcType: 'audio',
                        syncName: 'eyeClick'
                    });
                }
            }
        })
        $('.eye').on('eyeClick', function () {
            $(this).siblings('.eye').find('img').removeClass('eye_move').attr('style', '')
            $(this).find('img').addClass('eye_move');
            let element = $(this).find('img').get(0);
            let target = $('.eye_pos').get(0);
            let parabola = funParabola(element, target, {
                curvature: '.1',
                complete: function () {
                    eyeClick = true;
                    SDK.setEventLock();
                }
            })
            parabola.init();
        })

        /**
         * 点击鼻子
        */
        let noseClick = true;
        $('.nose').on('click touchstart', function (e) {
            if (e.type == "touchstart") {
                e.preventDefault()
            }
            e.stopPropagation();
            if (!$(this).find('img').hasClass('nose_move')) {
                if (noseClick) {
                    noseClick = false;
                    if (!isSync) {
                        $(this).trigger('noseClick')
                        return;
                    }
                    SDK.bindSyncEvt({
                        index: $(e.currentTarget).data('syncactions'),
                        eventType: 'click',
                        method: 'event',
                        funcType: 'audio',
                        syncName: 'noseClick'
                    });
                }
            }
        })
        $('.nose').on('noseClick', function () {
            $(this).siblings('.nose').find('img').removeClass('nose_move').attr('style', '');
            $(this).find('img').addClass('nose_move');
            let element = $(this).find('img').get(0);
            let target = $('.nose_pos').get(0);
            let parabola = funParabola(element, target, {
                curvature: '.1',
                complete: function () {
                    noseClick = true;
                    SDK.setEventLock();
                }
            })
            parabola.init();
        })

        /**
         * 点击耳朵
        */
        let earClick = true;
        $('.ear').on('click touchstart', function (e) {
            if (e.type == "touchstart") {
                e.preventDefault()
            }
            e.stopPropagation();
            if (!$(this).find('img').hasClass('ear_move')) {
                if (earClick) {
                    earClick = false;
                    if (!isSync) {
                        $(this).trigger('earClick')
                        return;
                    }
                    SDK.bindSyncEvt({
                        index: $(e.currentTarget).data('syncactions'),
                        eventType: 'click',
                        method: 'event',
                        funcType: 'audio',
                        syncName: 'earClick'
                    });
                }
            }
        })
        $('.ear').on('earClick', function () {
            $(this).siblings('.ear').find('img').removeClass('ear_move').attr('style', '')
            $(this).find('img').addClass('ear_move');
            let element = $(this).find('img').get(0);
            let target = $('.ear_pos').get(0);
            let parabola = funParabola(element, target, {
                curvature: '.1',
                complete: function () {
                    earClick = true;
                    SDK.setEventLock();
                }
            })
            parabola.init();
        })

        /**
         * 点击色板
        */
        let colorClick = true;
        $('.color').on('click touchstart', function (e) {
            if (e.type == "touchstart") {
                e.preventDefault()
            }
            e.stopPropagation();
            if (colorClick) {
                colorClick = false;
                if (!isSync) {
                    $(this).trigger('colorClick')
                    return;
                }
                SDK.bindSyncEvt({
                    index: $(e.currentTarget).data('syncactions'),
                    eventType: 'click',
                    method: 'event',
                    funcType: 'audio',
                    syncName: 'colorClick'
                });
            }
        })
        $('.color').on('colorClick', function () {
            let srcBg = $(this).attr('data-cl');
            $('.cat_body').css({
                'background':'url('+color[srcBg]+') no-repeat',
                'background-size': 'contain'
            })
            colorClick = true;
            SDK.setEventLock();
        })
    }
})
