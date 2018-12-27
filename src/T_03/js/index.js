"use strict"
import '../../common/js/common_1v1.js'
import '../../common/js/drag.js'

$(function () {
    window.h5Template = {
    	hasPractice: '1' 
    }
    let h5SyncActions = parent.window.h5SyncActions;
    let configDatas = configData;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    /**
     * 创建dom
    */
    let goodHtml = ''
    let goodsList = configDatas.source.goodsList;
    let boxHtml = '';
    for (let i = 0; i< configDatas.source.fontList.length; i++) {
        if (configDatas.source.fontList[i].img) {
            boxHtml+=`
            <div class="box box_${i+1} pos_ev" data-syncactions='box_${i}' data-name='box_${i+1}' style="background: url('${configDatas.source.fontList[i].img}') no-repeat;background-size: contain;">
                <audio src="./audio/fly.mp3" class="fly_mp3"></audio>
                <audio src="./audio/wrong.mp3" class="wrong_mp3"></audio>
                <p>${configDatas.source.fontList[i].name}</p>
            </div>
            `
        } else {
            boxHtml+=`
            <div class="box box_${i+1} pos_ev" data-syncactions='box_${i}' data-name='box_${i+1}'>
                <audio src="./audio/fly.mp3" class="fly_mp3"></audio>
                <audio src="./audio/wrong.mp3" class="wrong_mp3"></audio>
                <p>${configDatas.source.fontList[i].name}</p>
            </div>
            `
        }
    }
    $('.allBox').html(boxHtml);
    for (let i = 0; i<goodsList.length; i++) {
        goodHtml += `<div class="pos pos_${i+1} pos_ev" data-cn = "pos_${i+1}" data-syncactions="item_${i}" data-name = "box_${goodsList[i].name}">
            <audio src="./audio/click.mp3" class="click_mp3"></audio>
            <img src=${goodsList[i].img_init} class='img_default'/>
        </div>`
    }
    $('.goods').html(goodHtml);
    let posObj = {};
    for (let i = 0; i<goodsList.length; i++) {
        posObj['pos_'+(i+1)] = {
            isEnd: false,
            left: 0,
            top:0
        };
        $(`.pos_${i+1}`).attr({
            'init-left': ($(`.pos_${i+1}`).offset().left - $('.container').offset().left)/window.base,
            'init-top': ($(`.pos_${i+1}`).offset().top - $('.container').offset().top)/window.base
        })
    }
    /**
     * 滑过物体
    */
    $('.goods .pos').on('mousemove', function (e) {
        $(this).css('transform','scale(1.2)')
    })
    $('.goods .pos').on('mouseout', function (e) {
        $(this).css('transform','scale(1)')
    })
    /**
     * 拖拽物体
    */
    
    $('.goods .pos').drag({
        before: function(e) {
            $(this).css({
                'transition':'0s',
                'transform':'scale(.8)',
                'z-index': '11'
            }).off('mousemove');
        },
        process: function(e) {

        },
        end: function(e) {
            $(this).css({
                'transition':'0.5s',
                'transform':'scale(.8)',
                'z-index': '10'
            }).on('mousemove', function (e) {
                $(this).css('transform','scale(1.2)')
            });
            let that= $(this);
            let boxEl = $(this).attr('data-name');
            let boxPos = { // 对应箱子的位置
                left: ($(`.${boxEl}`).offset().left - $('.container').offset().left)/window.base,
                top: ($(`.${boxEl}`).offset().top - $('.container').offset().top)/window.base,
                width:$(`.${boxEl}`).width()/window.base/2,
                height:$(`.${boxEl}`).height()/window.base/2
            }
            let goodPos = { // 物体的位置
                left: (that.offset().left - $('.container').offset().left)/window.base,
                top: (that.offset().top - $('.container').offset().top)/window.base,
                width:that.width()/window.base/2,
                height:that.height()/window.base/2
            }
            if (Math.abs((goodPos.left+goodPos.width) - (boxPos.left+goodPos.width))<goodPos.width*2 && Math.abs((goodPos.top+goodPos.height) - (boxPos.top+goodPos.height))<boxPos.height*2) {
                let name = that.attr('data-cn');
                posObj[name].isEnd = true;
                posObj[name].left = boxPos.left+goodPos.width/2.5+'rem';
                posObj[name].top = boxPos.top-boxPos.height+'rem';
                posObj.nowObj = {
                    name: name,
                    left: boxPos.left+goodPos.width/2.5+'rem',
                    top: boxPos.top-boxPos.height/1.5+'rem'
                };
                if (isSync) {
                    SDK.bindSyncEvt({
                        index: $(e.currentTarget).data('syncactions'),
                        eventType: 'click',
                        method: 'event',
                        funcType: 'audio',
                        syncName: 'posDrag',
                        otherInfor:{
                           posObj: posObj
                        },
                        recoveryMode:'1'
                    });
                } else {
                    $(this).trigger('posDrag');
                }
            } else {
                that.css({
                    left: that.attr('init-left')+'rem',
                    top: that.attr('init-top')+'rem'
                })
            }
        }
    });
    $('.goods .pos').on('posDrag', function (e, message) {
        let msg = '';
        if (isSync) {
            msg = message.data[0].value.syncAction.otherInfor.posObj;
            posObj = msg;         
            if (message.operate=='5') {
                backFn(msg);
            }
        } else {
            msg = posObj;
        }
        $('.endGoods').append($('.'+msg.nowObj.name));
        $("."+msg.nowObj.name).css({
            left: msg.nowObj.left,
            top: msg.nowObj.top,
            'z-index': '11'
        })
        SDK.setEventLock();
    })


    /**
     * 恢复数据
    */
    function backFn (message) {
        $.each(message,function (key, val) {
            if (val.isEnd) {
                $('.'+key).css({
                    left: val.left,
                    top:val.top
                }).appendTo($('.endGoods'));
            }
        })
    }
})
