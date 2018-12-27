"use strict"
import '../../common/js/common_1v1.js'
import './drag.js'
$(function () {
  window.h5Template = {
    hasPractice: '0'
  }
  let h5SyncActions = parent.window.h5SyncActions;
  let options = configData.source.options;
  const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
  let source = configData.source
  let goHigh = 4.97 / options.length   //每次爬杆距离长度
  // let lock = true   //倒计时结束后，老师无操作，则倒计时恢复到初始状态的标识
  let startAnsIndex = 0     //答题进度
  let timer = null;


  const page = {
    showEvenetBtn:function(){
      if(isSync){
        if (window.frameElement.getAttribute('user_type') == 'stu') {
          $(".timeBtn").addClass('visibility')
          $(".answBtn").addClass('visibility')
        }
      }
    },
    showOption: function () {
      let html = ''
      html = `<ul class="picArea">
                  <li class="list"><img src="${options[0].image}" alt=""></li>
              </ul>
              <div class="text">ggrtty</div>
              <div class="audioList" data-syncactions="audioBtn">
                  <img src="image/btn-audio.png" />
                  <audio class="audioSrc" webkit-playsinline controls src="${options[0].audio}"></audio>
              </div>
              <div class="page">${1 + ' / ' + options.length}</div> `
      $(".right").append(html)
    },
    showStyle: function (index) {
      $('.time').text(options[index].time + "s")
      $(".page").text(index - 0 + 1 + "/" + options.length)
      if (options[index].image == '') {
        $(".text").text(options[index].text)
        $(".list").addClass('hide')
        $(".text").removeClass('hide').addClass("bigText")
        $(".audioList").css({ bottom: '.6rem' })
        $(".page").css({ bottom: '.75rem' })
      } else {
        $(".list").removeClass('hide')
        $(".list").eq(0).find("img").attr('src', options[index].image)
        if (options[index].text == '') {
          $(".text").addClass("hide")
          $(".picArea").removeClass('hide').css({ top: '1.08rem' })
          $(".audioList").css({ bottom: '.3rem' })
          $(".page").css({ bottom: '.45rem' })
        } else {
          $(".picArea").removeClass('hide').css({ top: '0' })
          $(".text").removeClass("hide  bigText")
          $(".text").text(options[index].text)
          $(".page").css({ bottom: '-0.1rem' })
          $(".audioList").css({ bottom: '-0.35rem' })
        }
      }
      if (options[index].audio == '') {
        $(".audioList").addClass('hide')
      } else {
        $(".audioList").removeClass('hide')
        $(".audioList").find("audio").attr('src', options[index].audio)
       
      }
    },
    init: function () {
      this.showEvenetBtn()
      this.showOption()
      this.showStyle(0)
      $(".answBtn").drag()
    }
  }
  page.init()

  $('.ansright').on("click touchstart", function (e) {
    //console.log("ok2222222222222221")
    if (e.type = "touchstart") {
      e.preventDefault()
    }
    startAnsIndex++
    if (!isSync) {
      $(this).trigger("ansRightSync")
      return
    }
    if (window.frameElement.getAttribute('user_type') == 'tea') {
      SDK.bindSyncEvt({
        sendUser: '',
        receiveUser: '',
        index: $(e.currentTarget).data("syncactions"),
        eventType: 'click',
        method: 'event',
        syncName: 'ansRightSync',
        otherInfor: {
          startAnsIndex: startAnsIndex
        },
        recoveryMode: '1'
      });
    }
  })

  $('.ansright').on("ansRightSync", function (e, message) {
   // console.log(startAnsIndex,'bbbbbbbbbbbbbbb')
    if (!isSync) {
      startAnsIndex=startAnsIndex-0
    } else {
      let obj = message.data[0].value.syncAction.otherInfor;
      startAnsIndex=obj.startAnsIndex-0
      if (message == undefined || message.operate == 1) {

      } else {
        recovery(startAnsIndex,'end')
        SDK.setEventLock()
        return
      }
    }
    // lock = false
    $(this).addClass('ansRafter')
    $(".answBtn").css({
      opacity:0,
      transition:'1s'
    })
    $(".ansright").addClass("hide")
    $(".answrong").addClass("hide")
    
    $(".timeBtn").removeClass('hide')
    clearInterval(timer)

  
    if (startAnsIndex == options.length) {
      $(".timeArea").addClass('hide')
    }
    if (startAnsIndex >= options.length) {
      $(".king").addClass('hide')
      $(".leg").addClass('hide')
      $(".singelFamily").addClass('family')
    } else {
      new Promise((resolve, reject) => {
        setTimeout(() => {
          $(".king").css({
            bottom: startAnsIndex * goHigh + "rem",
            transition: '0.2s'
          })
          $(".leg").css({
            bottom: startAnsIndex * goHigh + "rem",
            transition: '0.2s'
          })
          resolve()
        }, 200)
      }).then(() => {
        setTimeout(() => {
          if(options[startAnsIndex-1].audio!=''){
            let audioEle =$('.audioSrc').get(0)
            audioEle.pause()
            $('.audioList img').attr('src','./image/btn-audio.png')
          }
          page.showStyle(startAnsIndex)
        }, 1300)
      })
    }
    SDK.setEventLock()
  })
  let $audioBg =document.getElementsByClassName('audioBg')[0]
  $('.answrong').on("click touchstart", function (e) {
    if (e.type = "touchstart") {
      e.preventDefault()
    }
    if (!isSync) {
      $(this).trigger("ansWrongSync")
      return
    }
    if (window.frameElement.getAttribute('user_type') == 'tea') {
      SDK.bindSyncEvt({
        sendUser: '',
        receiveUser: '',
        index: $(e.currentTarget).data("syncactions"),
        eventType: 'click',
        method: 'event',
        syncName: 'ansWrongSync',
        otherInfor: {
          startAnsIndex: startAnsIndex
        },
        recoveryMode: '1'
      });
    }
  })

  $('.answrong').on("ansWrongSync", function (e, message) {
   // console.log("ok1111111111")
    // lock = false
    if (!isSync) {
      startAnsIndex=startAnsIndex-0
    } else {
      let obj = message.data[0].value.syncAction.otherInfor;
      startAnsIndex=obj.startAnsIndex-0
      if (message == undefined || message.operate == 1) {

      } else {
        recovery(startAnsIndex,'end')
        SDK.setEventLock()
        return
      }
    }
    $(this).addClass('ansLafter')
    $(".answBtn").css({
      opacity:0,
      transition:'1s'
    })
    $(".ansright").addClass("hide")
    $(".answrong").addClass("hide")
    $(".timeBtn").removeClass('hide')
    clearInterval(timer)
    $(".time").text(options[startAnsIndex].time - 0 + 's')


    new Promise((resolve, reject) => {
      setTimeout(() => {
        $(".king").css({
          bottom: startAnsIndex*goHigh + goHigh + "rem",
          transition: '0.2s'
        })
        $(".leg").css({
          bottom: startAnsIndex*goHigh + goHigh + "rem",
          transition: '0.2s'
        })
        resolve()
      }, 200)
    }).then(() => {
      setTimeout(() => {
        //$audioBg.currentTime=0;
        $audioBg ? $audioBg.play() : "";
        $(".king").css({
          bottom: startAnsIndex*goHigh + "rem",
          transition: '0.5s ease-out'
        })
        $(".leg").css({
          bottom: startAnsIndex*goHigh + "rem",
          transition: '0.5s ease-out'
        })
      }, 800)
    })

    SDK.setEventLock()

  })

  $(".timeBtn").on('click touchstart', function (e) {
    if (e.type = "touchstart") {
      e.preventDefault()
    }
    if (!isSync) {
      $(this).trigger('startTimeSync')
      return
    }
    if (window.frameElement.getAttribute('user_type') == 'tea') {
      SDK.bindSyncEvt({
        sendUser: '',
        receiveUser: '',
        index: $(e.currentTarget).data("syncactions"),
        eventType: 'click',
        method: 'event',
        syncName: 'startTimeSync',
        otherInfor: {
          startAnsIndex: startAnsIndex
        },
        recoveryMode: '1'
      });
    }
  })

  $(".timeBtn").on('startTimeSync', function (e,message) {
    if (!isSync) {
      startAnsIndex=startAnsIndex-0
    } else {
      let obj = message.data[0].value.syncAction.otherInfor;
      startAnsIndex=obj.startAnsIndex-0
      if (message == undefined || message.operate == 1) {

      } else {
        recovery(startAnsIndex,'start')
        SDK.setEventLock()
        return
      }
    }
    $(this).addClass('hide')
    $('.ansright').removeClass('ansRafter')
    $('.answrong').removeClass('ansLafter')
    $(".answBtn").css({
      opacity:1
    })
    $(".ansright").removeClass("hide")
    $(".answrong").removeClass("hide")
    // lock = true
    setInterTime($('.time').text().substr(0, $('.time').text().length - 1))
    SDK.setEventLock()
  })


  function setInterTime(time) {
    let oldTime = time - 0 + 1   //存储开始倒计时的总时间
    timer = setInterval(function () {
      time--
      $('.time').text(time + 's')
      if (time == 0) {
         clearInterval(timer)
      }
    }, 1000)
  }

  //恢复机制
 
  function recovery(startAnsIndex, type) {
    if (startAnsIndex >= options.length) {
      $(".king").addClass('hide')
      $(".leg").addClass('hide')
      $(".singelFamily").addClass('family')
      $(".time").addClass('hide')
      page.showStyle(startAnsIndex-1)
    }else{
      $(".king").css({ bottom: startAnsIndex*goHigh  + "rem" })
      $(".leg").css({ bottom: startAnsIndex*goHigh + "rem" })
      page.showStyle(startAnsIndex)
      clearInterval(timer)
    }
    if (type == 'start') {
      // lock=true 
      $(".timeBtn").addClass('hide')
      $(".answBtn").css({
        opacity: 1
      })
      $(".ansright").removeClass("hide")
      $(".answrong").removeClass("hide")
      if (startAnsIndex <= options.length) {
          setInterTime(options[startAnsIndex].time)  
      }
 
    } else {
        clearInterval(timer)
        $(".timeBtn").removeClass('hide')
        $(this).addClass('ansLafter')
        $(".answBtn").css({
          opacity: 0
        })
        $(".ansright").addClass("hide")
        $(".answrong").addClass("hide")
    }
  }


  // 音频播放
	let audioEle;
	let play = false
	let audioPlay = function(message,currentPage){
		audioEle =$('.audioSrc').get(0)
		if(!isSync){
			audioEle.play()	
			$('.audioList img').attr('src','./image/btn-audio.gif')
		}else{
			if($(window.frameElement).attr('id') === 'h5_course_self_frame'){
				if(message==undefined||message.operate==1){
					audioEle.play()	
					$('.audioList img').attr('src','./image/btn-audio.gif')
				}
			}
		}
	}
	let audioPause = function(message,currentPage){
		if(!isSync){
			audioEle.pause()			
		}else {
			if(message==undefined||message.operate==1){
				audioEle.pause()		
			}
		}
		$('.audioList img').attr('src','./image/btn-audio.png')
	}
	let currentPage=0;
	let audioClick = true;
	$('.audioList').on('click',function(e){
		if(audioClick){
			audioClick = false
			if(!isSync){
				$(this).trigger('syncAudioClick')
				return
			}
			if(window.frameElement.getAttribute('user_type') == 'tea'){
				SDK.bindSyncEvt({
					index: $(e.currentTarget).data('syncactions'),
					eventType: 'click',
					method: 'event',
					syncName: 'syncAudioClick',
					funcType:'audio'
				})
			}else{
				$(this).trigger('syncAudioClick')
			}
		}
		
	})

	$('.audioList').on('syncAudioClick',function(e,message){
		if(play){
			audioPause(message,currentPage)
		}else{
			audioPlay(message,currentPage)
			audioEle.onended = function(){
				$('.audioList img').attr('src','./image/btn-audio.png')
			}
		}
		SDK.setEventLock()
		audioClick = true
  })
})



