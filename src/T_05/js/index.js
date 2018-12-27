"use strict"
import '../../common/js/common_1v1.js';

$(function () {
    window.h5Template = {
    	hasPractice: '0' 
    }
    let h5SyncActions = parent.window.h5SyncActions
    let configDatas = configData
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync
    
    // 渲染初始化
    let toyList = configDatas.source.toys
    let html = ''

    toyList.forEach((item, index) => {
        html += `<li class="toy" data-syncactions="toy-${index}"><img src="${item.img}" alt=""><audio src = "./audio/click.mp3"/></li>`
    })
    
    $('#toys-list').html(html)
    if (configDatas.source.stuCar) {
        $('.road-stu img').attr('src',configDatas.source.stuCar);
    } 
    if (configDatas.source.teaCar) {
        $('.road-tea img').attr('src',configDatas.source.teaCar);
    } 
    if (configDatas.source.flagImg) {
        $('.flag img').attr('src',configDatas.source.flagImg);
    } 
    // 触发点击事件
    let toys = $('#toys-list li');
    let cars = $('#cars .car');
    let toyCurrent = 0;
    let positionStu = 0;
    let positionTea = 0;
    let toy_Index = '';
    let toyClick = true
    toys.on('click touchstart', function(e) {

        if( e.type == 'touchstart' ) {
            e.preventDefault()
        }
        if (toyClick && !$(this).hasClass('scale')) {
            toyClick = false;
            toy_Index = $(this).index();
            if (!isSync) {
                $(this).trigger('toyClick')
                return
            }
            SDK.bindSyncEvt({
                index: $(e.currentTarget).data('syncactions'),
                eventType: 'click',
                method: 'event',
                funcType: 'audio',
                syncName: 'toyClick',
                otherInfor:{
                    tea_pos: positionTea,
                    stu_pos: positionStu,
                    toyIndex: toy_Index
                },
                recoveryMode:'1'
            });
        }
    })

    toys.on('toyClick', function(e, message) {
        if (isSync) {
            var otherInfor = message.data[0].value.syncAction.otherInfor;
            positionTea = otherInfor.tea_pos;
            positionStu = otherInfor.stu_pos;
            toy_Index = otherInfor.toyIndex;
            toyCurrent = toy_Index;
            if (message.operate=='5') {
                callbackFn();
                return;
            }
        } else {
            toyCurrent = $(this).index();
        }
        $(this).find('audio').get(0).play();
        $(this).addClass('scale').siblings().removeClass('scale')
        toyClick = true;
        SDK.setEventLock();
    })

    let flagClick = true
    $('#flag').on('click touchstart', function(e) {

        if( e.type == 'touchstart' ) {
            e.preventDefault()
        }

        if (flagClick) {
            flagClick = false
             // 比赛结束
            if ( positionStu == 13.2 || positionTea == 13.2 ) {
                return;
            }

            positionStu += 2.2
            positionTea += 2.2

            if (!isSync) {
                $(this).trigger('flagClick')
                return
            }
            SDK.bindSyncEvt({
                index: $(e.currentTarget).data('syncactions'),
                eventType: 'click',
                method: 'event',
                funcType: 'audio',
                syncName: 'flagClick',
                otherInfor:{
                    tea_pos: positionTea,
                    stu_pos: positionStu,
                    toyIndex: toy_Index
                },
                recoveryMode:'1'
            });
        }
    })

    $('#flag').on('flagClick', function(e,message) {
        $('.road-stu audio').get(0).play();
        if (isSync) {
            var otherInfor = message.data[0].value.syncAction.otherInfor;
            positionTea = otherInfor.tea_pos;
            positionStu = otherInfor.stu_pos;
            toy_Index = otherInfor.toyIndex;
            toyCurrent = toy_Index;
            if (message.operate=='5') {
                callbackFn();
                return;
            }
        }
        moveCar()
        flagClick = true;
        SDK.setEventLock();
    })

    let carClick = true
    cars.on('click touchstart', function(e) {

        if( e.type == 'touchstart' ) {
            e.preventDefault()
        }

        if (carClick) {
            carClick = false
            if ( positionStu === 13.2 || positionTea === 13.2 ) {
                return
            }
    
            if ( $(this).hasClass('stu_et') ) {
                if (positionStu < 13.2){
                    positionStu += 2.2
                }
            }
            if ( $(this).hasClass('tea_et') ) {
                if (positionTea < 13.2) {
                    positionTea += 2.2
                }
            }
            if (!isSync) {
                $(this).trigger('carClick')
                return
            }
            SDK.bindSyncEvt({
                index: $(e.currentTarget).data('syncactions'),
                eventType: 'click',
                method: 'event',
                funcType: 'audio',
                syncName: 'carClick',
                otherInfor:{
                    tea_pos: positionTea,
                    stu_pos: positionStu,
                    toyIndex: toy_Index
                },
                recoveryMode:'1'
            });
        }

    })

    cars.on('carClick', function(e,message) {
        $(this).parent().find('audio').get(0).play();
        if (isSync) {
            var otherInfor = message.data[0].value.syncAction.otherInfor;
            positionTea = otherInfor.tea_pos;
            positionStu = otherInfor.stu_pos;
            toy_Index = otherInfor.toyIndex;
            toyCurrent = toy_Index;
            if (message.operate=='5') {
                callbackFn();
                return;
            }
        } 
        $(this).addClass('car-animate')
        $(this).one('webkitAnimationEnd animationend', () => {
            $(this).removeClass('car-animate')
            moveCar()
        })

        carClick = true;
        SDK.setEventLock();
    })
    // 小车移动
    function moveCar () {
        $('#cars img.stu_et').css({
            'left': `${positionStu}rem`
        })
        $('#cars img.tea_et').css({

            'left': `${positionTea}rem`
        })
        if (toyCurrent) {
            toys.eq(toyCurrent).removeClass('scale')
        }
        toy_Index = '';
        if ( positionStu == 13.2 || positionTea == 13.2 ) {
            setTimeout(function () {
                $('.mask').show().find('.winImg').addClass('max');
                $('.winAudio').get(0).play();
                setTimeout (function () {
                    $('.mask').fadeOut(1000);
                },5000)
            },1000)
        }
    }
    // 重新进入教室
    function callbackFn () {
        $('#cars img.stu_et').css({
            'left': `${positionStu}rem`
        })
        $('#cars img.tea_et').css({
            'left': `${positionTea}rem`
        })
        if (toyCurrent) {
            toys.eq(toyCurrent).addClass('scale');
        } else {
            toys.eq(toyCurrent).removeClass('scale');
        }
        toy_Index = '';
        SDK.setEventLock();
    }
})
