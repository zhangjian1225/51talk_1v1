"use strict"
import '../../common/js/common_1v1.js'

$(function () {
    // ac 内是否显示授权按钮的开关
    window.h5Template = {
        hasPractice: '1'
    }
    const h5SyncActions = parent.window.h5SyncActions;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    const page = parent.window.h5SyncActions && h5SyncActions.classConf.h5Course.localPage;
    const self_frame_id = $(window.frameElement).attr('id');
    /**
     * 创建dom元素
     */
    let items = configData.source.items
    let textArr = items.map((item) => item.text )
    console.log(textArr)
    let imgArr = items.map((item) => {
        return {
            img: item.img, 
            w: item.text
        }
    } )
    let audioArr = items.map((item) => item.audio )
    let [texts, imgs] = ['', '']
    let sugars = []
    let eatSugars = ['./image/sugar1.png', './image/sugar2.png', './image/sugar3.png', './image/sugar2.png']

    if ( items[0].sugarImg ) {
        sugars = items.map((item) => item.sugarImg )
    } else {
        sugars = ['./image/sugar_01.png', './image/sugar_02.png', './image/sugar_03.png', './image/sugar_02.png']
    }
    // 打乱顺序
    imgArr = reRamdom(imgArr, 6)
    // 生成 dom 结构
    textArr.forEach((item, index) => {
        texts += `
            <div class="texts-box-text"  data-syncactions='texts-box-text-${index}' style="background:url(${sugars[index]}) no-repeat center;background-size: cover;">
                <p class="text">${item}</p>
                <audio src="${audioArr[index]}" data-syncactions='audio-${index}'></audio>
            </div>
        `
        imgs += `
            <div class="imgs-box-img" word="${imgArr[index].w}"  data-syncactions='imgs-box-img-${index}'>
                <div class="monster">
                    <div class="monster-body"></div>
                    <div class="monster-head"></div>
                    <div class="monster-hand monster-hand-left"></div>
                    <div class="monster-hand monster-hand-right"></div>
                    <img class="monster-sugar" src="${eatSugars[index]}">
                    <img class="monster-sweat" src="./image/sweat.png">
                </div>
                <div class="img">
                    <img src="${imgArr[index].img}">
                </div>
            </div>
        `
    })

    $('.texts-box').html(texts)
    $('.imgs-box').html(imgs)

    // 初始化糖的位置

    // 选择文字
    let word = ''
    let textClick = true
    let sugarPos = ''
    let textIndex = ''
    let hideIndex = {}
    $('.texts-box-text').on('click touchstart', function(e) {
        if(e.type=="touchstart"){
			e.preventDefault()
		}
        e.stopPropagation()
        // 老师不能点击
        // if (isSync && window.frameElement.getAttribute('user_type') == 'tea') return

        if ( $(this).hasClass('disabled') ) {
            return
        }
        if (textClick) {
            textClick = false
            if (!isSync) {
                $(this).trigger('textClick')
                return
            }
            SDK.bindSyncEvt({
                index: $(e.currentTarget).data('syncactions'),
                eventType: 'click',
                method: 'event',
                funcType: 'audio',
                syncName: 'textClick',
                otherInfor:{
                    hideIndex: hideIndex
                },
                recoveryMode:'1'
            });
        }
        
        
    })

    $('.texts-box-text').on('textClick', function(e) {
        let audio = $(this).find('audio')
        if ( audio.attr('src') != '' ) {
            audio[0].play()
        }
        // if ( audio.attr('src') != '' ) {
        //     if (isSync ) {
        //         if ( window.frameElement.getAttribute('user_type') == 'stu' ) {
        //             audio[0].play()
        //         }
        //     } else {
        //         audio[0].play()
        //     }
        // }
        $('.texts-box-text').removeClass('active')
        $(this).removeClass('shake').addClass('active')
        textIndex = $(this).index()
        word = $(this).find('p').html()
        sugarPos = $(this).offset().left
        textClick = true
    })

    let imgClick = true
    $('.imgs-box-img').on('click touchstart', function(e) {
        if(e.type=="touchstart"){
			e.preventDefault()
		}
        e.stopPropagation();

        if (isSync && window.frameElement.getAttribute('user_type') == 'tea') return

        if ( $(this).hasClass('disabled') ) {
            return
        }
        if ( word == '' ) {
            return
        }

        if (imgClick) {
            imgClick = false;
            if (!isSync) {
                $(this).trigger('imgClick')
                return
            }
            SDK.bindSyncEvt({
                index: $(e.currentTarget).data('syncactions'),
                eventType: 'click',
                method: 'event',
                funcType: 'audio',
                syncName: 'imgClick',
                otherInfor:{
                    hideIndex: hideIndex
                },
                recoveryMode:'1'
            });
        }
    })

    $('.imgs-box-img').on('imgClick', function(e, message) {
        if (isSync && message.operate=='5') {
            console.log('掉线重连:')
            var otherInfor = message.data[0].value.syncAction.otherInfor
            offlineInit(otherInfor);
            return;
        }
        let answer = $(this).attr('word')
        if ( word == answer ) {
            if (isSync) {
                var otherInfor = message.data[0].value.syncAction.otherInfor
                hideIndex = otherInfor.hideIndex;
            }
            hideIndex[textIndex] = true
            console.log('答对了')
            $('.texts-box-text').addClass('disabled')
            let pos = (sugarPos - $(this).offset().left) / window.base
            $(this).addClass('disabled')
            $(this).find('.monster-sugar').css({
                'left': `${pos + 1}rem`,
                'top': '-2.5rem'
            })
            setTimeout(() => {
                $(this).find('.monster-sugar').css({
                    'transition': '1s linear',
                    'left': `1rem`,
                    'top': '.5rem',
                    'z-index': 1
                })
            }, 100)
            setTimeout(() => {
                $(this).find('.monster-sugar').hide()
                $(this).find('.monster-head').addClass('eat')
            }, 1000)
            setTimeout(() => {
                $(this).find('.monster-head').removeClass('eat').addClass('happy')
                $('.texts-box-text').eq(textIndex).addClass('disabled').css('opacity', '0')
                $('.texts-box-text').removeClass('disabled')
                word = ''
                imgClick = true
            }, 2500)
        } else {
            console.log('答错了')
            $('.texts-box-text').removeClass('active')
            $('.texts-box-text').eq(textIndex).addClass('shake')
            $('.texts-box-text').eq(textIndex).on('animationend WebkitAnimationEnd', function() {
                $(this).removeClass('shake')
            })
            $(this).find('.monster-head').addClass('sad')
            $(this).find('.monster-sweat').css('display', 'block').addClass('sweat')
            $(this).find('.monster-sweat').on('animationend WebkitAnimationEnd', () => {
                $(this).find('.monster-sweat').removeClass('sweat').css('display', 'none')
                $(this).find('.monster-head').removeClass('sad')
                if ( !imgClick ) {
                    word = ''
                    imgClick = true
                }
            })
        }

        setTimeout(() => {
            word = ''
            imgClick = true
        },100)
    })

    // 掉线重连恢复状态
    function offlineInit (message) {
        console.log('offline message: ', message)
        hideIndex = message.hideIndex;
        for ( let i in message.hideIndex ) {
            $('.texts-box-text').eq(i).css('opacity', 0)
            for ( let j=0; j<$('.imgs-box-img').length; j++ ) {
                if ( $('.imgs-box-img').eq(j).attr('word') == $('.texts-box-text').eq(i).find('p').html() ) {
                    console.log('item index: ',  $('.imgs-box-img').eq(j).index)
                    $('.imgs-box-img').eq(j).addClass('disabled')
                    $('.imgs-box-img').eq(j).find('.monster-head').addClass('happy')
                }
            }
            // $('.imgs-box-img').each((item, index) => {
            //     if ( item.attr('word') == $('.texts-box-text').eq(i).find('p').html() ) {
            //         console.log('item: ', item)
            //         item.addClass('disabled')
            //         item.find('.monster-head').addClass('happy')
            //     }
            // })
        }
    }

    function reRamdom (a, page = 17) {
        if ( a.length < 3 ) {
            return a.reverse();
        }
        if ( a.length == 3 ) {
            if ( page % 2 != 0 ) {
                return a.reverse();
            } else {
                return [a[1], a[0], a[2]];
            }
        }
        var newArr = [];
        var arr1 = a.splice(0, Math.floor(a.length/2));
        if ( page % 2 != 0 ) {
            var last = arr1.pop();
            var first = arr1.shift();
            arr1.unshift(last);
            // arr1.push(first);
            arr1[1] = first;
            a.unshift(a.pop());
        } else {
            var last = a.pop();
            var first = a.shift();
            a.unshift(last);
            a.push(first);
        }
        arr1 = arr1.reverse();
        a = a.reverse();
    
        for ( var i=0; i<arr1.length; i++ ) {
            newArr.push(arr1[i], a[i]);
        }
    
        if ( arr1.length < a.length ) {
            newArr.push(a[a.length-1]);
        }
    
        return newArr;
    }

})