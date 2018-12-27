"use strict"
import '../../common/js/common_1v1.js'

$(function () {
    window.h5Template = {
    	hasPractice: '0' 
    }
    let anPos = 1;
    if (configData.source.momImg.personImg && configData.source.momImg.goodImg) { 
        $('.mom').append('<img src="'+configData.source.momImg.personImg+'"/>')
    }
    if (configData.source.childImg.personImg && configData.source.childImg.goodImg) {
        $('.child').append('<img src="'+configData.source.childImg.personImg+'"/>')
    }
    if (configData.source.dadImg.personImg && configData.source.dadImg.goodImg) { 
        $('.dad').append('<img src="'+configData.source.dadImg.personImg+'"/>')
    }
    let listHtml = '';
    if (configData.source.momImg.personImg && configData.source.momImg.goodImg) { 
        listHtml += `
        <div class="pos pos_2" data-per="momImg">
            <audio src="./audio/audio.mp3"></audio>
            <img src="${configData.source.momImg.goodImg}" class="ani"/>
            <img src="./image/light.png" class="star"/>
        </div>
        `
    }
    if (configData.source.childImg.personImg && configData.source.childImg.goodImg) {
        listHtml += `
        <div class="pos pos_1" data-per="childImg">
            <audio src="./audio/audio.mp3"></audio>
            <img src="${configData.source.childImg.goodImg}" class="ani"/>
            <img src="./image/light.png" class="star"/>
        </div>
        `
    }
    if (configData.source.dadImg.personImg && configData.source.dadImg.goodImg) { 
        listHtml += `
        <div class="pos pos_3" data-per="dadImg"> 
            <audio src="./audio/audio.mp3"></audio>
            <img src="${configData.source.dadImg.goodImg}" class="ani"/>
            <img src="./image/light.png" class="star"/>
        </div>
        `
    }
    
    $('.stage').append(listHtml);
    let h5SyncActions = parent.window.h5SyncActions;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    if (isSync) {
        if (window.frameElement.getAttribute('user_type') == 'tea') {
            $('.hand').css('opacity','1');
        } else {
            $('.hand').css('opacity','0');
        }
    } else {
        $('.hand').css('opacity','1');
    }
    window.onload = function () {
        let itemClick = true;
        $('.hand').on('click touchstart', function (e) {
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
                if (window.frameElement.getAttribute('user_type') == 'tea') {
                    SDK.bindSyncEvt({
                        index: $(e.currentTarget).data('syncactions'),
                        eventType: 'click',
                        method: 'event',
                        funcType: 'audio',
                        syncName: 'buttonClick'
                    });
                }
            }
        })
        $('.hand').on('buttonClick', function () {
            $(this).hide();
            if ($('.pos_1').length>0) {
                anPos = 1;
                fun ();
            } else if ($('.pos_2').length>0) {
                anPos = 2;
                fun ()
            } else if ($('.pos_3').length>0){
                anPos = 3;
                fun ();
            }
            function fun () {
                $('.pos_'+anPos+' .ani').addClass('changeMin').on('animationend webkitAnimationEnd', function () {
                    $('.pos_'+anPos).find('audio').get(0).play();
                    $(this).hide().siblings().show();
                    let element = $('.pos_'+anPos).get(0);
                    let target = $('.person_'+anPos+' .box').get(0);
                    let parabola = funParabola(element, target, {
                        curvature: '.1',
                        speed: 2/ window.base,
                        complete: function () {
                            $('.pos_'+anPos+' .ani').removeClass('changeMin').show().siblings().hide();
                            anPos ++;
                            if ($('.pos_'+anPos).length>0) {
                                setTimeout (function(){
                                    if(anPos<=3) {
                                        fun ()
                                    };
                                },500) 

                            } else {
                                anPos ++;
                                if(anPos<=3) {
                                    fun ()
                                };
                            }
                        }
                    })
                    parabola.init();
                });
            }
            SDK.setEventLock();
        })
    }
})
