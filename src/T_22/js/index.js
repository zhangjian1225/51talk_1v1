"use strict"
import '../../common/js/common_1v1.js'

$(function () {
    // ac 内是否显示授权按钮的开关
    window.h5Template = {
        hasPractice: '0'
    }
    const h5SyncActions = parent.window.h5SyncActions;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    /**
     * 创建dom元素
     */
    let source = configData.source
    let source_left = source.list[0]
    let source_right = source.list[1]

    $('.person-left').css({
        'background': `url(${source_left.person}) no-repeat`,
        'background-size': '39.6rem auto'
    })
    $('.person-right').css({
        'background': `url(${source_right.person}) no-repeat`,
        'background-size': '39.6rem auto'
    })

    if ( source_left.toy ) {
        let img = $(`<img src="${source_left.toy}">`)
        $('.toy-left').append(img)
    }
    if ( source_right.toy ) {
        let img = $(`<img src="${source_right.toy}">`)
        $('.toy-right').append(img)
    }

    if ( source_left.tips ) {
        let tip = $(`<img src="${source_left.tips}">`)
        $('.tips-left').append(tip)
    }

    if ( source_right.tips ) {
        let tip = $(`<img src="${source_right.tips}">`)
        $('.tips-right').append(tip)
    }

    $('.text-left').css({
        'background': `url(${source_left.text}) no-repeat center`,
        'background-size': 'contain'
    })
    $('.text-right').css({
        'background': `url(${source_right.text}) no-repeat center`,
        'background-size': 'contain'
    })

    let [audioL, audioR] = [$('.audio-left audio'), $('.audio-right audio')]
    if ( source_left.audio != '' ) {
        audioL.attr('src', source_left.audio)
        $(".audio-left").append('<img src="image/btn-audio.gif">')
    }
    if ( source_right.audio != '' ) {
        audioR.attr('src', source_right.audio)
        $(".audio-right").append('<img src="image/btn-audio.gif">')
    }

    // 播放按钮/点击小手图标
    if (isSync) {
        if (window.frameElement.getAttribute('user_type') == 'tea') {
            $('.hand').css('opacity','1');
        } else {
            $('.hand').css('opacity','0');
        }
    } else {
        $('.hand').css('opacity','1');
    }

    let textClick = true
  //点击播放音频
    let openAudio=false;
    let clickNum=0;   //记录点击次数。
    $('.hand').on('click touchstart', function(e) {
        if( e.type == 'touchstart' ) {
            e.preventDefault()
        }
        if (textClick) {
            textClick = false;
            clickNum++
            $('.hand').css({
                'opacity':'0',
                'background-position':'-1.55rem 0'
            });
            $(".handStyle").css({display:'none'})
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
                recoverMode:'1',
                otherInfor:{
                    clickNum:clickNum
                }
            });
        }
    })

    $('.hand').on('textClick', function(e,message) {
        if (isSync) {
			let obj = message.data[0].value.syncAction.otherInfor;
			if (message == undefined || message.operate == 1) {
			} else {
				recovery(obj)
				SDK.setEventLock()
				return
			}
		}
        $('.text-left, .text-right').removeClass('text-flex').addClass('text-none')
        $('.audio-left').addClass("hide")
        $('.audio-right').addClass("hide")
        $('.tips-left, .tips-right').hide()
        if ( source.rightItem == 0 ) {
            $('.toy-left').addClass('shake')
            setTimeout( () => {
                $('.text-left').removeClass('text-none').addClass('text-flex')
                $('.tips-left').show()
                $('.person-left').addClass('talk')
                $(".audio-left").removeClass('hide')
                $('.audio-left').find("img").attr('src','image/btn-audio.gif')
                
                if ($(window.frameElement).attr('id') === 'h5_course_self_frame' || !isSync) {
                    audioL[0].currentTime = 0;
                    source_left.audio && audioL[0].play()
                }
    
                let audioLplay = new Promise((resolve, reject) => {
                    audioL.on('ended', () => {
                        $('.person-left').removeClass('talk')
                        resolve('audioL ended')
                        $('.audio-left').find("img").attr('src','image/btn-audio.png')
                    })
                })
                audioLplay.then(() => {
                    if ($(window.frameElement).attr('id') === 'h5_course_self_frame' || !isSync) {
                        audioR[0].currentTime = 0;
                        source_right.audio && audioR[0].play()
                    }
                    $('.toy-right').addClass('shake')
                    $('.text-right').removeClass('text-none').addClass('text-flex')
                    $('.tips-right').show()
                    $('.person-right').addClass('talk')
                    $(".audio-right").removeClass('hide')
                    $('.audio-right').find("img").attr('src','image/btn-audio.gif')
                })
                let audioRplay = new Promise((resolve, reject) => {
                    audioR.on('ended', () => {
                        $('.person-right').removeClass('talk')
                        resolve('audioR ended')
                        $('.audio-right').find("img").attr('src','image/btn-audio.png')
                    })
                })
                audioRplay.then(() => {
                    $('.toy-left, .toy-right').removeClass('shake')  // 初始化元素，可以重复点击
                    if (isSync&&window.frameElement.getAttribute('user_type') == 'tea') {
                         $('.hand').css('opacity','1');  
                    }else if(!isSync){
                        $('.hand').css('opacity','1');    
                    }
                 
                    textClick = true
                    openAudio=true
                })
            }, 300 )
        } else {
            $('.toy-right').addClass('shake')
            setTimeout( () => {
                $('.text-right').removeClass('text-none').addClass('text-flex')
                $('.tips-right').show()
                $('.person-right').addClass('talk')
                $(".audio-right").removeClass('hide')
                $('.audio-right').find("img").attr('src','image/btn-audio.gif')
                
                if ($(window.frameElement).attr('id') === 'h5_course_self_frame' || !isSync) {
                    audioR[0].currentTime = 0;
                    source_right.audio && audioR[0].play()
                }
    
                let audioRplay = new Promise((resolve, reject) => {
                    audioR.on('ended', () => {
                        $('.person-right').removeClass('talk')
                        resolve('audioR ended')
                        $('.audio-right').find("img").attr('src','image/btn-audio.png')
                    })
                })
                audioRplay.then(() => {
                    if ($(window.frameElement).attr('id') === 'h5_course_self_frame' || !isSync) {
                        audioL[0].currentTime = 0;
                        source_left.audio && audioL[0].play()
                    }
                    $('.toy-left').addClass('shake')
                    $('.text-left').removeClass('text-none').addClass('text-flex')
                    $('.tips-left').show()
                    $('.person-left').addClass('talk')
                    $(".audio-left").removeClass('hide')
                    $('.audio-left').find("img").attr('src','image/btn-audio.gif')
                })
                
                let audioLplay = new Promise((resolve, reject) => {
                    audioL.on('ended', () => {
                        $('.person-left').removeClass('talk')
                        resolve('audioL ended')
                        $('.audio-left').find("img").attr('src','image/btn-audio.png')
                    })
                })
                audioLplay.then(() => {
                    $('.toy-left, .toy-right').removeClass('shake')  // 初始化元素，可以重复点击
                    if (isSync&&window.frameElement.getAttribute('user_type') == 'tea') {
                        $('.hand').css('opacity','1');   
                    }else if(!isSync){
                        $('.hand').css('opacity','1');    
                    }
                 
                    openAudio=true
                    textClick = true
                })
            }, 300 )
        }
    })

    function recovery(obj){
        $('.audio-right').find("img").attr('src','image/btn-audio.png')
        $('.person-right').removeClass('talk')
        $('.audio-left').find("img").attr('src','image/btn-audio.png')
        $('.person-left').removeClass('talk')
        if(obj.clickNum>=1){
            $('.text-left').removeClass('text-none').addClass('text-flex')
            $('.tips-left').show()
            $(".audio-left").removeClass('hide')
            $('.text-right').removeClass('text-none').addClass('text-flex')
            $('.tips-right').show()
            $(".audio-right").removeClass('hide')

          $(".hand").css({
              'background-position':'-1.55rem 0'
          })  
          $(".handStyle").css({display:'none'})
        }else{
            $(".hand").css({
                'background-position':'0 0'
            })  
        }
        openAudio=true;
    }

$(".ansListAudio").on("click touchend",function(e){
    //  e.stopPropagation();
    if (e.type == "touchend") {
        e.preventDefault()
    }
    // console.log("ok")
    if(openAudio){
        openAudio=false;
        if(!isSync){
            $(this).trigger("syncAudioClick");
            return;
        }
        SDK.bindSyncEvt({
            sendUser: '',
            receiveUser: '',
            index: $(e.currentTarget).data('syncactions'),
            eventType: 'click',
            method: 'event',
            syncName: 'syncAudioClick',
            funcType:'audio',
            recoverMode:'0'
        })
    }
});
let options=configData.source.list
$(".ansListAudio").on('syncAudioClick',function(e,message){
    if (isSync) {
        let obj = message.data[0].value.syncAction.otherInfor;
        if (message == undefined || message.operate == 1) {
        } else {
            recovery(obj)
            SDK.setEventLock()
            return
        }
    }
    let index=$(this).attr("data-id");
    let audios=$(".ansListAudio").find('audio');
    for(let i=0;i<audios.length;i++){
        // audios.eq(i).attr('src','')
        $(".ansListAudio").eq(i).find('img').attr("src", $(this).find("img").attr("src").replace(".gif", ".png"));
    }
    
    $(this).find('audio').attr('src',options[index].audio)
    var $audio = null;
    $audio = $(this).find("audio")[0];
    var $img = $(this).find("img");
    if(index==0){
        $('.person-left').addClass('talk')
    }else{
        $('.person-right').addClass('talk')
    }
    if(!isSync){
        // $audio.currentTime=0;
        $audio.play()

        if ($img.length != 0) {
        $img.attr("src", $(this).find("img").attr("src").replace(".png", ".gif"));
        //播放完毕img状态
        $audio.onended = function() {
          $img.attr("src", $(this).find("img").attr("src").replace(".gif", ".png"));
            if (index == 0) {
                $('.person-left').removeClass('talk')
            } else {
                $('.person-right').removeClass('talk')
            }
        }.bind(this);
        }
    }else{
        if(message.operate!=5) {

           
          // $audio.currentTime=0;
          $audio.play()

          if ($img.length != 0) {
            $img.attr("src", $(this).find("img").attr("src").replace(".png", ".gif"));
            //播放完毕img状态
            $audio.onended = function() {
              $img.attr("src", $(this).find("img").attr("src").replace(".gif", ".png"));
              if(index==0){
                  $('.person-left').removeClass('talk')
              } else {
                  $('.person-right').removeClass('talk')
              }
            }.bind(this);
          }
        }    		
    }
        SDK.setEventLock();
        openAudio=true;
    })
    

})