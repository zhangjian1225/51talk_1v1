"use strict"
import '../../common/js/common_1v1.js'

$(function () {
    window.h5Template = {
    	hasPractice: '1' 
    }
    let h5SyncActions = parent.window.h5SyncActions;
    let configDatas = configData;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    if (isSync) {
        if (window.frameElement.getAttribute('user_type') == 'tea') {
            $('.hand').css('opacity','1');
        }
    } else {
        $('.hand').css('opacity','1');
    }
    /**
     * 创建dom
    */
    let cardBgImg = configDatas.source.cardBg;
    let cardImgSrc = './image/card.png';
    if (cardBgImg) {
        cardImgSrc = cardBgImg
    };
    // 判断几张卡片
    var posLeftThree = [0,3.5,7];
    var posLeftFour = [0,3.2,6.4,9.6];
    var posLeft = [];
    if (configDatas.source.cardList.length == '4') {
        posLeft = posLeftFour;
        $('.card_list').css('width','11.3rem');
        $('.card').css({
            width:'2.7rem',
            height:'4rem'
        })
    } else {
        posLeft = posLeftThree;
    }
    let cardHtml = ''
    for (let i = 0; i<configDatas.source.cardList.length; i++) {
        cardHtml += `<div class="card c_${i+1}" style="left:${posLeft[i]}rem" data-syncactions='card_item_${i}'>
            <audio src='./audio/re.mp3'></audio>
            <div class="num_box">
                <img src=${cardImgSrc} alt="" class="card_img">
            </div>
            <div class="img_box">
                <img src=${configDatas.source.cardList[i].img} alt="" class="main_img">
            </div>
        </div>`
    }
    $('.card_list').html(cardHtml)
    $('.card').addClass('card_rotate_one');

    if (configDatas.source.cardList.length == '4') {
        $('.card').css({
            width:'2.7rem',
            height:'4rem'
        })
    }
    /**
     * 点击魔术师 开始执行动画
    */
    let clickCardNum = 0;
    let game_num = 1;
    let itemClick = true;
    let cardCanClick = false;
    let hasCLArr = [];
    let cardNum = configDatas.source.cardList.length;// 图片数量
    $('.person').on('click touchstart', function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation();
        if (game_num<=3){
            if (itemClick) {
                itemClick = false;
                if (!isSync) {
                    $(this).trigger('personClick')
                    return;
                }
                if (window.frameElement.getAttribute('user_type') == 'tea') {
                    SDK.bindSyncEvt({
                        index: $(e.currentTarget).data('syncactions'),
                        eventType: 'click',
                        method: 'event',
                        funcType: 'audio',
                        syncName: 'personClick',
                        otherInfor:{
                            hasClsaaArr: [],
                            game_num_msg: game_num,
                            clickCardNum_msg: 0
                        },
                        recoveryMode:'1'
                    });
                }
            }
        }
    })

    $('.person').on('personClick', function (e,message) {
        if (isSync && message.operate=='5') {
            var otherInfor = message.data[0].value.syncAction.otherInfor;
            clickCardNum = otherInfor.clickCardNum_msg*1;
            hasCLArr = otherInfor.hasClsaaArr;
            game_num = otherInfor.game_num_msg*1;
            person_fn (game_num,hasCLArr,clickCardNum);
        } else {
            hasCLArr = [];
            game_num = game_num;
            cardCanClick = false;
            $('.hand').css('opacity','0');
            $('.card').removeClass('card_rotate_one');
            $('#person').addClass('person_animate');
            $('#person').on('animationend webkitAnimationEnd', function () {
                $('#person').removeClass('person_animate');
            })
            setTimeout(function () {
                if (cardNum == '3') {
                    $('.all').get(0).play();
                    if (game_num == 1) {
                        $('.card').eq(0).css('left', '7rem');
                        $('.card').eq(2).css('left', '0rem');
                    } else if (game_num == 2){
                        $('.card').eq(1).css('left', '3.5rem');
                        $('.card').eq(0).css('left', '7rem');
                    } else {
                        $('.card').eq(1).css('left', '7rem');
                        $('.card').eq(0).css('left', '0rem');
                    }
                    setTimeout(function () {
                        $('.all2').get(0).play();
                        if (game_num == 1) {
                            $('.card').eq(0).css('left', '3.5rem');
                            $('.card').eq(1).css('left', '7rem');
                        } else if (game_num == 2){
                            $('.card').eq(1).css('left', '0rem');
                            $('.card').eq(2).css('left', '3.5rem');
                        } else {
                            $('.card').eq(1).css('left', '3.5rem');
                            $('.card').eq(2).css('left', '7rem');
                        }
                        $('.card').css('cursor', 'pointer')
                        cardCanClick = true;
                        SDK.setEventLock();
                    },500)
                } else {
                    $('.all').get(0).play();
                    if (game_num == 1) {
                        $('.card').eq(0).css('left', '6.4rem');
                        $('.card').eq(2).css('left', '0rem');
                    } else if (game_num == 2){
                        $('.card').eq(0).css('left', '9.6rem');
                        $('.card').eq(1).css('left', '6.4rem');
                    } else {
                        $('.card').eq(0).css('left', '0rem');
                        $('.card').eq(2).css('left', '9.6rem');
                    }
                    setTimeout(function () {
                        $('.all2').get(0).play();
                        if (game_num == 1) {
                            $('.card').eq(3).css('left', '3.2rem');
                            $('.card').eq(1).css('left', '9.6rem');
                        } else if (game_num == 2){
                            $('.card').eq(3).css('left', '0rem');
                            $('.card').eq(2).css('left', '3.2rem');
                        } else {
                            $('.card').eq(3).css('left', '6.4rem');
                            $('.card').eq(1).css('left', '3.2rem');
                        }
                        $('.card').css('cursor', 'pointer')
                        cardCanClick = true;
                        SDK.setEventLock();
                    }, 500)
                }
            }, 1000)
        }
    })
    /**
     * 点击卡片
    */

    $('.card').on('click touchstart', function (e,message) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation(cardCanClick);
        if (game_num<=cardNum && !$(this).hasClass('card_rotate_one')){
            if (cardCanClick) {
                cardCanClick = false;
                if (!isSync) {
                    $(this).trigger('cardClick')
                    return;
                }
                hasCLArr.push($(this).index());
                SDK.bindSyncEvt({
                    index: $(e.currentTarget).data('syncactions'),
                    eventType: 'click',
                    method: 'event',
                    funcType: 'audio',
                    syncName: 'cardClick',
                    otherInfor:{
                        hasClsaaArr: hasCLArr,
                        game_num_msg: game_num,
                        clickCardNum_msg: clickCardNum
                    },
                    recoveryMode:'1'
                });
            }
        }
    })
    $('.card').on('cardClick', function (e, message) {
        if (isSync && message.operate=='5') {
            var otherInfor = message.data[0].value.syncAction.otherInfor;
            clickCardNum = otherInfor.clickCardNum_msg*1;
            hasCLArr = otherInfor.hasClsaaArr;
            game_num = otherInfor.game_num_msg;
            person_fn (game_num,hasCLArr,clickCardNum)
            SDK.setEventLock();
        } else {
            $(this).find('audio').get(0).play();
            if (isSync) {
                var otherInfor = message.data[0].value.syncAction.otherInfor;
                hasCLArr = otherInfor.hasClsaaArr;
            }
            clickCardNum ++;
            $(this).addClass('card_rotate_one');
            if (clickCardNum>=cardNum) {
                clickCardNum = 0;
                game_num++;
                itemClick = true;
            } else {
                cardCanClick = true;
            }
            SDK.setEventLock();
        }
    })
    function person_fn (game_nums,hasCLArrs,clickCardNums) {
        cardCanClick = false;
        itemClick = false;
        $('.hand').css('opacity','0');
        $('.card').removeClass('card_rotate_one');
        $('#person').addClass('person_animate');
        $('#person').on('animationend webkitAnimationEnd', function () {
            $('#person').removeClass('person_animate');
        })
        setTimeout(function () {
            if (cardNum == '3') {
                if (game_nums == 1) {
                    $('.card').eq(0).css('left', '7rem');
                    $('.card').eq(2).css('left', '0rem');
                } else if (game_nums == 2){
                    $('.card').eq(1).css('left', '3.5rem');
                    $('.card').eq(0).css('left', '7rem');
                } else {
                    $('.card').eq(1).css('left', '7rem');
                    $('.card').eq(0).css('left', '0rem');
                }
                setTimeout(function () {
                    if (game_nums == 1) {
                        $('.card').eq(0).css('left', '3.5rem');
                        $('.card').eq(1).css('left', '7rem');
                    } else if (game_nums == 2){
                        $('.card').eq(1).css('left', '0rem');
                        $('.card').eq(2).css('left', '3.5rem');
                    } else {
                        $('.card').eq(1).css('left', '3.5rem');
                        $('.card').eq(2).css('left', '7rem');
                    }
                    $('.card').css('cursor', 'pointer');
                    cardCanClick = true;
                    game_num = game_nums*1;
                    clickCardNum = clickCardNums*1;
                    clickCardNum ++;
                    for (let i = 0; i<hasCLArr.length; i++) {
                        $('.card').eq(hasCLArr[i]).addClass('card_rotate_one');
                    }
                    if (clickCardNum>=cardNum) {
                        clickCardNum = 0;
                        game_num++;
                        itemClick = true;
                    } else {
                        cardCanClick = true;
                    }
                    SDK.setEventLock();
                }, 500)
            } else {
                if (game_nums == 1) {
                    $('.card').eq(0).css('left', '6.4rem');
                    $('.card').eq(2).css('left', '0rem');
                } else if (game_nums == 2){
                    $('.card').eq(0).css('left', '9.6rem');
                    $('.card').eq(1).css('left', '6.4rem');
                } else {
                    $('.card').eq(0).css('left', '0rem');
                    $('.card').eq(2).css('left', '9.6rem');
                }
                setTimeout(function () {
                    if (game_nums == 1) {
                        $('.card').eq(3).css('left', '3.2rem');
                        $('.card').eq(1).css('left', '9.6rem');
                    } else if (game_nums == 2){
                        $('.card').eq(3).css('left', '0rem');
                        $('.card').eq(2).css('left', '3.2rem');
                    } else {
                        $('.card').eq(3).css('left', '6.4rem');
                        $('.card').eq(1).css('left', '3.2rem');
                    }
                    $('.card').css('cursor', 'pointer')
                    $('.card').css('cursor', 'pointer')
                    cardCanClick = true;
                    game_num = game_nums*1;
                    clickCardNum = clickCardNums*1;
                    clickCardNum ++;
                    for (let i = 0; i<hasCLArr.length; i++) {
                        $('.card').eq(hasCLArr[i]).addClass('card_rotate_one');
                    }
                    if (clickCardNum>=cardNum) {
                        clickCardNum = 0;
                        game_num++;
                        itemClick = true;
                    } else {
                        cardCanClick = true;
                    }
                    SDK.setEventLock();
                }, 500)
            }
        }, 1000)
    }    
})
