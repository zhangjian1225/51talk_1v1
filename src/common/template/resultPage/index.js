import '../../js/snow.js'
export function resultWin(msg) { // 成功
    let WinL =  msg.WinIsLoop == true ? true : false;
    $('.resultMask').css({
        'z-index':msg.Mask_Z_Index?msg.Mask_Z_Index:'10'
    })
    if (WinL) {
        $('.resultWinMp3').attr('loop','loop');
    };
    $('.resultWinMp3').get(0).currentTime = $('.resultWinMp3').get(0).duration;
    $('.resultWinMp3').get(0).play();
    $('.resultMask').show().find('.resultWin').show();
    let aniTNum = 1;
    $('.resultAPos_'+aniTNum).css({
        animation: 'resultAPosAn 8s infinite linear'
    });
    let aniT = setInterval(function () {
        let mad = Math.random()*5;
        if (aniTNum<5) {
            aniTNum ++;
            $('.resultAPos_'+aniTNum).css({
                animation: 'resultAPosAn '+(mad+2)+'s infinite linear'
            });
        } else {
            clearInterval(aniT);
        }
    },1500)
};
export function resultLose (msg) { // 失败
    let loseL =  msg.loseIsLoop == true ? true : false;
    $('.resultMask').css({
        'z-index':msg.Mask_Z_Index?msg.Mask_Z_Index:'10',
        'display':'block'
    })
    if (loseL) {
        $('.resultLoseMp3').attr('loop','loop');
    };
    $('.resultLoseMp3').get(0).currentTime = $('.resultLoseMp3').get(0).duration;
    $('.resultLoseMp3').get(0).play();
    $('.resultMask').show().find('.resultLose').css('display','block').snow({
        base: window.base,   /* px 与 各个单位换算 */
        unitType: 'rem', /* 单位 */
        minSize: 30, /* 定义雪花最小尺寸 */
        maxSize: 50,/* 定义雪花最大尺寸 */
        newOn: 600,  /* 定义密集程度，数字越小越密集 */
        flakeColor: "#AFDAEF", /* 此处可以定义雪花颜色，若要白色可以改为#FFFFFF */
        showType: 'img', /* 默认为文字 还可以为图片 img*/
        showHtml: msg.src, /* 默认为文字 还可以为图片地址*/
        zIndex: msg.Snow_Z_Index?msg.Snow_Z_Index:'1', /* z-index值*/
        imgSize: ['', '']
    });
}

export function resultHide () {
    $('.resultAPos').css('animation','');
    $('.resultLoseMp3').get(0).pause();
    $('.resultWinMp3').get(0).pause();
    $('.resultMask').hide();
    $('.resultLose').hide();
    $('.resultWin').hide();
}
