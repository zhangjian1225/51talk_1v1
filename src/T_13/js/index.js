"use strict"
import '../../common/js/common_1v1.js'

$(function () {
    window.h5Template = {
        hasPractice: '1'
    }
    let h5SyncActions = parent.window.h5SyncActions;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    let addClassArr = ['light_one', 'light_three', 'light_two', 'light_three', 'light_one', 'light_three', 'light_two', 'light_three'];
    let personArr = ['person_one', 'person_three', 'person_two', 'person_three', 'person_one', 'person_three', 'person_two', 'person_three'];
    let childImgSrc = configData.source.childImg == '' ? './image/child.png' : configData.source.childImg;
    if (configData.source.topImg) {
        $('.top_img').css({
            'background': 'url('+configData.source.topImg+') no-repeat',
            'background-size':'100% 100%'
        })
    }
    $('.child').css({
        'background': 'url(' + childImgSrc + ') no-repeat',
        'background-size': '300% auto'
    })
    $('.cloud').css({
        'background':'url('+configData.source.cloudImg+') no-repeat',
        'background-size':'100%'
    });
    $('.animate_img').attr('src', configData.source.animasteImg);
    $('.childAud').attr('src',configData.source.sayAud)
    if (configData.source.audio) {
        $('.stage').append('<audio src="' + configData.source.audio + '" class="audio"></audio>')
    }
    let fontArt = configData.source.font;
    // let fontCon = '';
    // for (let i = 0; i < configData.source.font.length; i++) {
    //     if (configData.source.font[i].hasOwnProperty('attributes') && configData.source.font[i].attributes.hasOwnProperty('underline')) {
    //         fontCon += `<span>${configData.source.font[i].insert}</span>`
    //     } else {
    //         fontCon += configData.source.font[i].insert
    //     }
    // }
    // $('.cloud p').html(fontCon);
    window.onload = function () {
        let itemIndex = 0;
        let itemClick = true;
        $('.tag').on('click touchstart', function (e) {
            if (e.type == "touchstart") {
                e.preventDefault()
            }
            e.stopPropagation();
            if (itemClick) {
                itemClick = false;
                if (!isSync) {
                    $(this).trigger('buttonClick')
                    return;
                }
                SDK.bindSyncEvt({
                    index: $(e.currentTarget).data('syncactions'),
                    eventType: 'click',
                    method: 'event',
                    funcType: 'audio',
                    syncName: 'buttonClick'
                });
            }
        })
        $('.tag').on('buttonClick', function () {
            $('#light').fadeIn(1000);
            $('.hand').fadeOut(500);
            $('.person_two').addClass('choose');
            let starNum = 0;
            let time = setInterval(function () {
                $('#light').attr('class', addClassArr[starNum]);
                $('.' + personArr[starNum]).addClass('choose').siblings().removeClass('choose');
                $('.' + personArr[starNum]).find('audio').get(0).play();
                starNum++;
                if (starNum >= addClassArr.length) {
                    clearInterval(time);
                    $('#light').attr('class', 'light_' + configData.source.choosePerson);
                    $('.person_' + configData.source.choosePerson).addClass('choose').siblings().removeClass('choose');
                    setTimeout(function () {
                        switchStage()
                    }, 2000)
                }
            }, 500)
            SDK.setEventLock();
        })

        // 第二个场景
        function switchStage() {
            $('#light').fadeOut(2000);
            $('.person').addClass('per_' + configData.source.choosePerson);
            $('.stage_one').fadeOut(2000, function () {
                $('.stage_two').fadeIn(2000, function () {
                    $('#light').fadeIn(2000, function () {
                        let element = $('.animate_img').get(0);
                        let target = $('.box').get(0);
                        let parabola = funParabola(element, target, {
                            curvature: '.4',
                            speed: 4 / window.base,
                            complete: function () {
                                if ($('.audio').length >= '1') {
                                    $('.audio').get(0).play();
                                }
                                setTimeout(function () {
                                    $('.stage_two .person').addClass('none')
                                    $('#light').hide();
                                    $('.stage_two').addClass('toMax');
                                    setTimeout(function () {
                                        $('.cloud').css({ 'opacity': '1' })
                                        $('.childAud').get(0).play();
                                        $('.child').addClass('childAnt');
                                        $('.childAud').get(0).onended = function () {
                                            $('.child').removeClass('childAnt');
                                        }
                                    },2000)
                                },2000)
                            }
                        })
                        parabola.init();
                    }).attr('class', 'light_four');

                });
            });
        }
    }
})
