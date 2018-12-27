"use strict"
import '../../common/js/common_1v1.js'

$(function () {
    window.h5Template = {
        hasPractice: '0'
    }
    let h5SyncActions = parent.window.h5SyncActions;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    const configList = configData.source.list;
    const cardNum = configList.length; // 获取上传图片的数量

    /**
     * 创建元素
    */
    let listHtml = '<ul>';
    $.each(configList, function (index, val) {
        listHtml += `
            <li>
                <img src="${val.img}" />
            </li>
        `
    })
    listHtml += '<ul>';
    $('.list').html(listHtml);

    /**
     * 判断页数及左右翻页按钮状态
    */
    if (cardNum <= 1) {
        $('.leftBtn').hide();
        $('.rightBtn').hide();
    }
    $('.tv .num').html(cardNum);

    /**
     * 声音区域
    */
    let thisIndex = 0;
    let nowIndex = 2;
    let voiceStatus = true;
    let initPage = 0;
    $(".control span").on("click touchstart", function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation();
        if (voiceStatus) {
            voiceStatus = false;
            thisIndex = $(this).index();
            if (!isSync) {
                $(this).trigger("voiceClick");
                return;
            }
            if (window.frameElement.getAttribute('user_type') == 'tea') {
                SDK.bindSyncEvt({
                    sendUser: '',
                    receiveUser: '',
                    index: $(e.currentTarget).data("syncactions"),
                    eventType: 'click',
                    method: 'event',
                    syncName: 'voiceClick',
                    otherInfor: {
                        thisIndex: thisIndex,
                        nowIndex: nowIndex,
                        initPage: initPage,
                        isScroll: false
                    },
                    recoveryMode: '1'
                });
            }
        }
    });
    $(".control span").on('voiceClick', function (e, message) {
        if (isSync) {
            let otherInfor = message.data[0].value.syncAction.otherInfor;
            if (message.operate == '5') {
                initStatusFn();
                thisIndex = otherInfor.thisIndex;
                nowIndex = otherInfor.nowIndex;
                initPage = otherInfor.initPage;
                callbackFn(otherInfor.isScroll);
                return;
            } else {
                thisIndex = otherInfor.thisIndex;
                nowIndex = otherInfor.nowIndex;
                initPage = otherInfor.initPage;
            }
        }
        if (thisIndex == 0) {
            $('.choose').eq(1).removeClass($('.choose').eq(1).attr('data-class'));
            $('.choose').eq(2).removeClass($('.choose').eq(2).attr('data-class'));
        } else if (thisIndex == 1) {
            $('.choose').eq(0).removeClass($('.choose').eq(0).attr('data-class'));
            $('.choose').eq(2).removeClass($('.choose').eq(2).attr('data-class'));
        } else {
            $('.choose').eq(0).removeClass($('.choose').eq(0).attr('data-class'));
            $('.choose').eq(1).removeClass($('.choose').eq(1).attr('data-class'));
        }
        $('.choose').eq(thisIndex).addClass($('.choose').eq(thisIndex).attr('data-class'));
        console.log('thisIndex',thisIndex)
        console.log('nowIndex',nowIndex)
        animateFn('voiceStatus');
    })


    /**
     * 点击选项按钮
    */
    let chooseStatus = true;
    $(".chooseBtns .choose").on("click touchstart", function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation();
        if (chooseStatus) {
            chooseStatus = false;
            thisIndex = $(this).index();
            if (!isSync) {
                $(this).trigger("chooseClick");
                return;
            }
            if (window.frameElement.getAttribute('user_type') == 'tea') {
                SDK.bindSyncEvt({
                    sendUser: '',
                    receiveUser: '',
                    index: $(e.currentTarget).data("syncactions"),
                    eventType: 'click',
                    method: 'event',
                    syncName: 'chooseClick',
                    otherInfor: {
                        thisIndex: thisIndex,
                        nowIndex: nowIndex,
                        initPage: initPage,
                        isScroll: false
                    },
                    recoveryMode: '1'
                });
            }
        }
    });
    $(".chooseBtns .choose").on('chooseClick', function (e, message) {
        if (isSync) {
            let otherInfor = message.data[0].value.syncAction.otherInfor;
            if (message.operate == '5') {
                initStatusFn();
                thisIndex = otherInfor.thisIndex;
                nowIndex = otherInfor.nowIndex;
                initPage = otherInfor.initPage;
                callbackFn(otherInfor.isScroll);
                return;
            } else {
                thisIndex = otherInfor.thisIndex;
                nowIndex = otherInfor.nowIndex;
                initPage = otherInfor.initPage;
            }
        }
        if (thisIndex == 0) {
            $('.choose').eq(1).removeClass($('.choose').eq(1).attr('data-class'));
            $('.choose').eq(2).removeClass($('.choose').eq(2).attr('data-class'));
        } else if (thisIndex == 1) {
            $('.choose').eq(0).removeClass($('.choose').eq(0).attr('data-class'));
            $('.choose').eq(2).removeClass($('.choose').eq(2).attr('data-class'));
        } else {
            $('.choose').eq(0).removeClass($('.choose').eq(0).attr('data-class'));
            $('.choose').eq(1).removeClass($('.choose').eq(1).attr('data-class'));
        }
        $('.choose').eq(thisIndex).addClass($('.choose').eq(thisIndex).attr('data-class'));
        animateFn('chooseStatus');
    })


    /**
     * 点击左右按钮
    */
    let canClickL = true;
    let stepDis = 6.8; // 每次滚动距离
    $(".leftBtn").on("click touchstart", function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation();
        if (canClickL) {
            canClickL = false;
            thisIndex = $(this).index();
            if (initPage>0) {
                initPage --;
                if (!isSync) {
                    $(this).trigger("leftClick");
                    return;
                }
                // if (window.frameElement.getAttribute('user_type') == 'tea') {
                    SDK.bindSyncEvt({
                        sendUser: '',
                        receiveUser: '',
                        index: $(e.currentTarget).data("syncactions"),
                        eventType: 'click',
                        method: 'event',
                        syncName: 'leftClick',
                        otherInfor: {
                            thisIndex: 0,
                            nowIndex: 2,
                            initPage: initPage,
                            isScroll: true
                        },
                        recoveryMode: '1'
                    });
                // }
            } else {
                canClickL = true;
            }
        }
    });
    $(".leftBtn").on('leftClick', function (e, message) {
        if (isSync) {
            let otherInfor = message.data[0].value.syncAction.otherInfor;
            if (message.operate == '5') {
                initStatusFn();
                thisIndex = otherInfor.thisIndex;
                nowIndex = otherInfor.nowIndex;
                initPage = otherInfor.initPage;
                callbackFn(otherInfor.isScroll);
                return;
            } else {
                thisIndex = otherInfor.thisIndex;
                nowIndex = otherInfor.nowIndex;
                initPage = otherInfor.initPage;
            }
        }
        if (initPage <=0) {
            $(this).addClass('noClick');
        }
        $('.rightBtn').removeClass('noClick');
        $('.list ul').animate({
            left: -(stepDis*initPage)+"rem"
        }, 500);
        $('.pageNum .page').html(initPage+1);
        initStatusFn();
        canClickL = true;
        SDK.setEventLock();
    })

    let canClickR = true;
    $(".rightBtn").on("click touchstart", function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation();
        if (canClickR) {
            canClickR = false;
            thisIndex = $(this).index();
            if (initPage < configList.length - 1) {
                initPage ++;
                if (!isSync) {
                    $(this).trigger("rightClick");
                    return;
                }
                // if (window.frameElement.getAttribute('user_type') == 'tea') {
                    SDK.bindSyncEvt({
                        sendUser: '',
                        receiveUser: '',
                        index: $(e.currentTarget).data("syncactions"),
                        eventType: 'click',
                        method: 'event',
                        syncName: 'rightClick',
                        otherInfor: {
                            thisIndex: 0,
                            nowIndex: 2,
                            initPage: initPage,
                            isScroll: true
                        },
                        recoveryMode: '1'
                    });
                // }
            } else {
                canClickR = true;
            }
        }
    });
    $(".rightBtn").on('rightClick', function (e, message) {
        if (isSync) {
            let otherInfor = message.data[0].value.syncAction.otherInfor;
            if (message.operate == '5') {
                initStatusFn();
                thisIndex = otherInfor.thisIndex;
                nowIndex = otherInfor.nowIndex;
                initPage = otherInfor.initPage;
                callbackFn(otherInfor.isScroll);
                return;
            } else {
                thisIndex = otherInfor.thisIndex;
                nowIndex = otherInfor.nowIndex;
                initPage = otherInfor.initPage;
            }
        }
        if (initPage >= configList.length - 1) {
            $(this).addClass('noClick');
        }
        $('.leftBtn').removeClass('noClick');
        $('.list ul').animate({
            left: -(stepDis*initPage)+"rem"
        }, 500);
        $('.pageNum .page').html(initPage+1);
        initStatusFn();
        canClickR = true;
        SDK.setEventLock();
    })


    /**
     * 翻页后初始化声音状态
    */
    
    function initStatusFn() {
        chooseStatus = true;
        voiceStatus = true;
        thisIndex = 0;
        nowIndex = 2;
        $('.monkey').removeClass('monkeyNow');
        $('.control span').removeClass('end').find('em').removeClass('toMin').removeClass('toMax').off('animationend webkitAnimationEnd');
        for (let i=0; i<$('.choose').length; i++) {
            $('.choose').eq(i).removeClass($('.choose').eq(i).attr('data-class'));
        }
    }


    /**
     * 执行动画
    */

    function animateFn(item) {
        if (thisIndex == 0) {
            $('.monkey').addClass('monkeyNow');
        } else {
            $('.monkey').removeClass('monkeyNow');
        }
        $('.audioMp3_'+thisIndex).get(0).play();
        if (thisIndex <= nowIndex) {
            if (thisIndex == nowIndex) {
                if (nowIndex == 2) {
                    $(".control span").eq(2).addClass('end').find('em').removeClass('toMin').addClass('toMax').on('animationend webkitAnimationEnd', function () {
                        if (item == 'voiceStatus') {
                            voiceStatus = true;
                        } else if (item == 'chooseStatus') {
                            chooseStatus = true;
                        }
                        SDK.setEventLock();
                    });
                }
                if (item == 'voiceStatus') {
                    voiceStatus = true;
                }  else if (item == 'chooseStatus') {
                    chooseStatus = true;
                }
                SDK.setEventLock();
            } else {
                if (!$(".control span").eq(2).hasClass('end')) {
                    $(".control span").eq(2).addClass('end').find('em').removeClass('toMin').addClass('toMax').on('animationend webkitAnimationEnd', function () {
                        if (thisIndex <= 1) {
                            $(".control span").eq(1).addClass('end').find('em').removeClass('toMin').addClass('toMax').on('animationend webkitAnimationEnd', function () {
                                if (thisIndex <= 0) {
                                    $(".control span").eq(0).addClass('end').find('em').removeClass('toMin').addClass('toMax').on('animationend webkitAnimationEnd', function () {
                                        if (item == 'voiceStatus') {
                                            voiceStatus = true;
                                        }  else if (item == 'chooseStatus') {
                                            chooseStatus = true;
                                        }
                                        SDK.setEventLock();
                                    });
                                } else {
                                    if (item == 'voiceStatus') {
                                        voiceStatus = true;
                                    }  else if (item == 'chooseStatus') {
                                        chooseStatus = true;
                                    }
                                    SDK.setEventLock();
                                }
                            });
                        } else {
                            if (item == 'voiceStatus') {
                                voiceStatus = true;
                            }  else if (item == 'chooseStatus') {
                                chooseStatus = true;
                            }
                            SDK.setEventLock();
                        }
                    });
                } else if (!$(".control span").eq(1).hasClass('end')) {
                    $(".control span").eq(1).addClass('end').find('em').removeClass('toMin').addClass('toMax').on('animationend webkitAnimationEnd', function () {
                        if (thisIndex <= 0) {
                            $(".control span").eq(0).addClass('end').find('em').removeClass('toMin').addClass('toMax').on('animationend webkitAnimationEnd', function () {
                                if (item == 'voiceStatus') {
                                    voiceStatus = true;
                                }  else if (item == 'chooseStatus') {
                                    chooseStatus = true;
                                }
                                SDK.setEventLock();
                            });
                        } else {
                            if (item == 'voiceStatus') {
                                voiceStatus = true;
                            }  else if (item == 'chooseStatus') {
                                chooseStatus = true;
                            }
                            SDK.setEventLock();
                        }
                    });
                } else if (!$(".control span").eq(0).hasClass('end')) {
                    $(".control span").eq(0).addClass('end').find('em').removeClass('toMin').addClass('toMax').on('animationend webkitAnimationEnd', function () {
                        if (item == 'voiceStatus') {
                            voiceStatus = true;
                        }  else if (item == 'chooseStatus') {
                            chooseStatus = true;
                        }
                        SDK.setEventLock();
                    });
                } else {
                    if (item == 'voiceStatus') {
                        voiceStatus = true;
                    }  else if (item == 'chooseStatus') {
                        chooseStatus = true;
                    }
                    SDK.setEventLock();
                }
            }
            nowIndex = thisIndex;
        } else {
            nowIndex = thisIndex;
            if ($(".control span").eq(0).hasClass('end')) {
                $(".control span").eq(0).removeClass('end').find('em').removeClass('toMax').addClass('toMin').on('animationend webkitAnimationEnd', function () {
                    if (thisIndex > 1) {
                        $(".control span").eq(1).removeClass('end').find('em').removeClass('toMax').addClass('toMin').on('animationend webkitAnimationEnd', function () {
                            if (item == 'voiceStatus') {
                                voiceStatus = true;
                            }  else if (item == 'chooseStatus') {
                                chooseStatus = true;
                            }
                            SDK.setEventLock();
                        });
                    } else {
                        if (item == 'voiceStatus') {
                            voiceStatus = true;
                        }  else if (item == 'chooseStatus') {
                            chooseStatus = true;
                        }
                        SDK.setEventLock();
                    }
                });
            } else if ($(".control span").eq(1).hasClass('end')) {
                $(".control span").eq(1).removeClass('end').find('em').removeClass('toMax').addClass('toMin').on('animationend webkitAnimationEnd', function () {
                    if (item == 'voiceStatus') {
                        voiceStatus = true;
                    }  else if (item == 'chooseStatus') {
                        chooseStatus = true;
                    }
                    SDK.setEventLock();
                });
            } else {
                if (item == 'voiceStatus') {
                    voiceStatus = true;
                }  else if (item == 'chooseStatus') {
                    chooseStatus = true;
                } else {
                    if (thisIndex == 0) {
                        $(".control span").eq(2).addClass('end').find('em').addClass('toMax').on('animationend webkitAnimationEnd', function () {
                            $(".control span").eq(1).addClass('end').find('em').addClass('toMax').on('animationend webkitAnimationEnd', function () {
                                $(".control span").eq(0).addClass('end').find('em').addClass('toMax').on('animationend webkitAnimationEnd', function () {
                            
                                });
                            });
                        });
                    } else if(thisIndex == 1) {
                        $(".control span").eq(2).addClass('end').find('em').addClass('toMax').on('animationend webkitAnimationEnd', function () {
                            $(".control span").eq(1).addClass('end').find('em').addClass('toMax').on('animationend webkitAnimationEnd', function () {
                            
                            });
                        });
                    } else {
                        $(".control span").eq(2).addClass('end').find('em').addClass('toMax');
                    }
                }
                SDK.setEventLock();
            }
        }
    };

    /**
     * 重新教室后恢复
    */

    function callbackFn (status) {
        $('.leftBtn').removeClass('noClick');
        $('.rightBtn').removeClass('noClick');
        if (initPage >= configList.length - 1) {
            $(this).addClass('noClick');
        }
        if (initPage <=0) {
            $(this).addClass('noClick');
        }
        $('.list ul').css({
            left: -(stepDis*initPage)+"rem"
        });
        $('.pageNum .page').html(initPage+1);
        if (status == false) {
            if (thisIndex == 0) {
                $('.choose').eq(1).removeClass($('.choose').eq(1).attr('data-class'));
                $('.choose').eq(2).removeClass($('.choose').eq(2).attr('data-class'));
            } else if (thisIndex == 1) {
                $('.choose').eq(0).removeClass($('.choose').eq(0).attr('data-class'));
                $('.choose').eq(2).removeClass($('.choose').eq(2).attr('data-class'));
            } else {
                $('.choose').eq(0).removeClass($('.choose').eq(0).attr('data-class'));
                $('.choose').eq(1).removeClass($('.choose').eq(1).attr('data-class'));
            }
            $('.choose').eq(thisIndex).addClass($('.choose').eq(thisIndex).attr('data-class'))
            console.log('thisIndex',thisIndex)
            console.log('nowIndex',nowIndex)
            animateFn('callback');
        }
    };
})