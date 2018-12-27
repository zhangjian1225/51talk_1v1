"use strict"
import '../../common/js/common_1v1.js'

$(function () {
    window.h5Template = {
    	hasPractice: '1' 
    }
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync
    let itemClick = true;
    $('.main_box').prepend('<img src="'+ configData.source.img+'" class="catch_doll">')
    $('.rod').on('click touchstart', function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation();
        if (itemClick) {
            itemClick = false;
            if (!isSync) {
                $(this).trigger('rodClick')
                return;
            }
            SDK.bindSyncEvt({
                index: $(e.currentTarget).data('syncactions'),
                eventType: 'click',
                method: 'event',
                funcType: 'audio',
                syncName: 'rodClick'
            });
        }
    })
    $('.rod').on('rodClick', function () {
        $('.one_mp3').get(0).play();
        $('.hand').removeClass('handAnimate').hide();
        $('.rod').addClass('rodDown');
        $('.billot').addClass('billotAn').on('animationend webkitAnimationEnd', function () {
            setTimeout(function () {
                $('.one_mp3').get(0).pause();
                $('.two_mp3').get(0).play();
                $('.billot').off('animationend webkitAnimationEnd');
                $('.rod').addClass('rodLeft').removeClass('rodDown');
                $('.moveItem').addClass('moveItemAn').on('animationend webkitAnimationEnd',function () {
                    $('.button').addClass('buttonAn');
                    $('.moveItem').off('animationend webkitAnimationEnd');
                    setTimeout(function () {
                        $('.two_mp3').get(0).pause();
                        $('.three_mp3').get(0).play();
                        setTimeout(function () {
                            $('.behind_claw').hide()
                        },900)
                        $('.line').addClass('lineAn').on('animationend webkitAnimationEnd',function () {
                            $('.line').off('animationend webkitAnimationEnd');
                            setTimeout(function () {
                                $('.three_mp3').get(0).pause();
                                $('.four_mp3').get(0).play();
                                $('.left_claw').addClass('catchLe');
                                $('.right_claw').addClass('catchRi');
                                setTimeout(function () {
                                    $('.catch_doll').addClass('upDoll');
                                    $('.line').removeClass('lineAn').addClass('lineAn_2').on('animationend webkitAnimationEnd',function () {
                                        setTimeout(function () {
                                            $('.four_mp3').get(0).pause();
                                            $('.moveItem').off('animationend webkitAnimationEnd');
                                            $('.moveItem1').addClass('moveItemAn_2');
                                            $('.catch_doll').addClass('leftDoll');
                                            $('.five_mp3').get(0).play();
                                            setTimeout(function () {
                                                $('.left_claw').removeClass('catchLe');
                                                $('.right_claw').removeClass('catchRi');
                                                $('.catch_doll').addClass('downDoll');
                                                $('#behind_claw').show();
                                            }, 1000)
                                        },1000)
                                    });
                                },1000)
                            },1000)
                        })
                    },1000)
                })
            },1000)
        })
        // itemClick = true;
        SDK.setEventLock();
    })
})
