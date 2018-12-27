"use strict"
import '../../common/js/common_1v1.js'
$(function() {

  // 埋点：进入页面
  var h5SyncActions = parent.window.h5SyncActions;
  // if ( $(window.frameElement).attr('id') === 'h5_course_self_frame' ) {
  // 	Tracking.init(h5SyncActions.classConf, {
  // 		tplate: 'TS002'
  // 	});
  // }

  const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync

  let currentPage = configData.source.random;
  if (isSync) {
    if (!configData.source.random) {
      currentPage = SDK.getClassConf().h5Course.localPage//页码打乱顺序
    } 
  } else {
      if (!configData.source.random) {
        currentPage = Math.round(Math.random() * 100);
      } 
  }

  const answerArr = configData.source.words.split('#')
  const answerStr = answerArr.join('')
  const page = { 
    themePic: configData.source.themePic,
    audio: configData.source.audio,
    question: configData.source.question,
    words: configData.source.words.split('#'),
    james: configData.source.james,
    addPic: function() {
      if(this.themePic){
        let picEle = `<img src="${this.themePic}" alt="" class="shadow">`;
        $(".picBox").append(picEle);
        $(".picBox").show();
      }else{
        $(".picBox").hide();
      }
    },
    tofit: function() {
      // if(this.title.length>0){
      // 	$('.stu-content').css('height','5.84rem')
      // 	$('.tea-content').css('height','5.84rem')
      // }
    },
    intermingleWords: function() {
      // 打乱句子顺序
      let wordsArr = "";
      wordsArr = this.words.concat(this.james);
      if (wordsArr.length > 2) {
        let temp = wordsArr[0]
        let mid = Math.round(wordsArr.length / 2)
        wordsArr[0] = wordsArr[mid]
        wordsArr[mid] = temp
      } else if (wordsArr.length == 2) {
        let temp = wordsArr[0]
        wordsArr[0] = wordsArr[1]
        wordsArr[1] = temp
      }
      if (wordsArr.length == 2) {
        return wordsArr
      } else if (wordsArr.length == 3) {
        let item = wordsArr.splice(1, 1)
        wordsArr.unshift(item)
        return wordsArr
      }
      wordsArr = reRamdom(wordsArr, currentPage)
      return wordsArr
    }, 
    setImg: function() {
      if (this.themePic) {
        $('.theme-pic').attr('src', this.themePic).show()
      }
    },
    setAudio: function() {
      if (this.audio) {
        $('audio').attr('src', this.audio)
        $('.btn-audio').show()
      }else{
        $('.btn-audio').hide()
      }
    },
    setQuestion: function() {
      $('.question').text(this.question)
    },
    setWords: function() {
      let str = ''
      let arr = this.intermingleWords()
        // console.log(arr)
      arr.forEach(function(ele, i) {
        str += `<li class="w-${i}" data-syncactions="w-${i}">${ele}</li>`
      })
      $(str).appendTo('.words ul')
    },
    setBottomAnswer: function() {
      $('.answer span').text(configData.source.words.split('#').join(' '))
    },
    tStuNames: function() {
      let str = ''
      this.stuNames.forEach(function(ele) {
        str += `<li class="flex-box">
              <div class="name">${ele}</div>
              <div class="result"></div>
            </li>`
        $(str).appendTo('.tea-answers ul')
      })
    },
    setSubmit: function(){
      if (isSync&&window.frameElement.getAttribute('user_type') == 'tea') {
        $(".submit").addClass('hide') 
      }
    },
    setContent: function() {
      // this.tofit()
      this.addPic() 
      this.setImg()
      this.setAudio()
      this.setQuestion()
      this.setWords()
      this.setBottomAnswer()
      this.setSubmit()
        // this.setStuNames()
    },
    bindEvents: function() {
      $('.sentence').on('mouseover', 'span', function() {
        if ($('.sentence').hasClass('forbid')) {
          return
        }
        $(this).css('color', '#56a200')
      })

      $('.sentence').on('mouseout', 'span', function() {
        if ($('.sentence').hasClass('forbid')) {
          return
        }
        $(this).css('color', '#000')
      })
    },
    init: function() {
      this.setContent()
        // this.bindEvents()
    }
  }
  page.init()

  // 音频播放同步
  const audioEle = document.querySelector('audio')
  let play = false
  let audioPlay = function() {
    audioEle.currentTime = 0
    audioEle.play()
    play = true
    $('.btn-audio img').attr('src', './image/btn-audio.gif')
  }
  let audioPause = function() {
    audioEle.pause()
    play = false
    $('.btn-audio img').attr('src', './image/btn-audio.png')
  }

  let audioClick = true
  $('.btn-audio').on('click touchstart', function(e) {
    if (e.type == "touchstart") {
      e.preventDefault()
    }
    e.stopPropagation();

    if (audioClick) {
      audioClick = false
      if (!isSync) {
        $(this).trigger('syncAudioClick')
        return
      }
      if (window.frameElement.getAttribute('user_type') == 'tea') {
        SDK.bindSyncEvt({
          sendUser: '',
          receiveUser: '',
          index: $(e.currentTarget).data('syncactions'),
          eventType: 'click',
          method: 'event',
          syncName: 'syncAudioClick',
          funcType: 'audio'
        })
      }else{
        $(this).trigger('syncAudioClick')
      } 
    }

  })

  $('.btn-audio').on('syncAudioClick', function(e) {
    if (play) {
      audioPause()
    } else {
      audioPlay()
      audioEle.onended = function() {
        play = false
        $('.btn-audio img').attr('src', './image/btn-audio.png')
      }
    }
    SDK.setEventLock()
    audioClick = true
  })

  SDK.recover = function(data){
    let words = data.words;
    let submitFlag = data.submit; 
    if(!words){
      return;
    } 
    for(let i=0;i<words.length;i++){
      let word = words[i];
      let _this = $(".words").find("[data-syncactions=" + word + "]");
      let sClass = _this.attr('class');
      let txt = _this.text();
      let span = `<span class="${sClass}" data-syncactions="${word}">${txt}</span>`
      $(span).appendTo('.sentence')
      _this.css('opacity', 0)
      $('.sentence').css('background', 'rgba(222,222,222,.75)'); 
    }
    
    if(submitFlag){
      $('.sentence').hide()
      result = $('.sentence').text()
      let isRight = result === answerStr ? true : false

      if (isRight) {
        $('.icon').show().addClass('right')
        $('.answer-right').text(answerArr.join(' ')).show() 
      } else {
        $('.icon').attr('src', 'image/cross.png').show().addClass('cross')
        $('.ans-false').html($('.sentence').html())
        $('.ans-correct span').text(answerArr.join(' '))
        $('.answer-wrong').fadeIn(300) 
      }

      $(".submit").addClass('submited') 
      wordsClick = false
      sentenceClick = false
    }
  }

  // 答题同步

  let result = ''
  let wordsClick = true
  $('.words').on('click touchstart', 'li', function(e) {
    if (e.type == "touchstart") {
      e.preventDefault()
    }

    if (wordsClick) {
      wordsClick = false
      if (!isSync) {
        $(this).trigger('syncWordsClick')
        return
      }
      if (window.frameElement.getAttribute('user_type') == 'stu') {
        let index = $(e.currentTarget).data('syncactions');
        if(SDK.syncData.words){
          SDK.syncData.words.push(index);
        }else{
          SDK.syncData.words = [index];
        }
        SDK.bindSyncEvt({
          sendUser: '',
          receiveUser: '',
          index: index,
          eventType: 'click',
          method: 'event',
          syncName: 'syncWordsClick'
        })
      }
    }

  })

  $('.words').on('syncWordsClick', 'li', function(e) {
    let _this = $(this)

    if (_this.css('opacity') == 0) {
      SDK.setEventLock()
      wordsClick = true
      return
    }
    let sClass = _this.attr('class')
    let syncactions = _this.data('syncactions')
    let txt = _this.text()

    let span = `<span class="${sClass}" data-syncactions="${syncactions}">${txt}</span>`
    $(span).appendTo('.sentence')
    _this.css('opacity', 0)
    $('.sentence span').length > 0 ? $('.sentence').css('background', 'rgba(222,222,222,.75)') : $('.sentence').css('background', 'rgba(255,255,255,.75)')
      // $('.stu .sentence span').length === answerArr.length?$('.submit').addClass('active'):$('.submit').removeClass('active')
    SDK.setEventLock()
    wordsClick = true
  })

  // 取消答题 同步
  let sentenceClick = true
  $('.sentence').on('click touchstart', 'span', function(e) {
    if (e.type == "touchstart") {
      e.preventDefault()
    }

    if (sentenceClick) {
      sentenceClick = false
      if (!isSync) {
        $(this).trigger('syncSentenceClick')
        return
      }
      if (window.frameElement.getAttribute('user_type') == 'stu') {
        let index = $(e.currentTarget).data('syncactions');
        if(SDK.syncData.words&&SDK.syncData.words.length>0){
          let remove = SDK.syncData.words.indexOf(index);
          if(remove>-1){
            SDK.syncData.words.splice(remove, 1);  
          }
        } 
        SDK.bindSyncEvt({
          sendUser: '',
          receiveUser: '',
          index: index,
          eventType: 'click',
          method: 'event',
          syncName: 'syncSentenceClick'
        })
      }
    }

  })

  $('.sentence').on('syncSentenceClick', 'span', function(e) {
    if ($('.sentence').hasClass('forbid')) {
      SDK.setEventLock()
      sentenceClick = true
      return
    }
    let _this = $(this)
    let sClass = _this.attr('class')
    _this.remove()
    $(`.words li.${sClass}`).css('opacity', 1)
    $('.sentence span').length === 0 ? $('.sentence').css('background', 'rgba(255,255,255,.75)') : $('.sentence').css('background', 'rgba(222,222,222,.75)')
      // $('.stu .sentence span').length === answerArr.length?$('.submit').addClass('active'):$('.submit').removeClass('active')
    SDK.setEventLock()
    sentenceClick = true
  })

  // 提交答案  同步
  let submitClick = true
  $('.main').on('click touchstart', '.submit', function(e) {
    if (e.type == "touchstart") {
      e.preventDefault()
    }

    if (submitClick) {
      submitClick = false
      if (!isSync) {
        $(this).trigger('syncSubmit')
        return
      }
      if (window.frameElement.getAttribute('user_type') == 'stu') {
        SDK.syncData.submit = true;
        SDK.bindSyncEvt({
          sendUser: '',
          receiveUser: '',
          index: $(e.currentTarget).data('syncactions'),
          eventType: 'click',
          method: 'event',
          syncName: 'syncSubmit'
        })
      }
    }
  })
  $('.main').on('syncSubmit', '.submit', function(e, message) {
    $('.sentence').hide()
    result = $('.sentence').text()
    let isRight = result === answerStr ? true : false

    if (isRight) {
      $('.icon').show().addClass('right')
      $('.answer-right').text(answerArr.join(' ')).show()
      // if (isSync) {
      //   SDK.bindSyncResultEvt({
      //     sendUser: message.data[0].value.sendUser,
      //     receiveUser: message.data[0].value.receiveUser,
      //     sendUserInfo: message.data[0].value.sendUserInfo,
      //     index: $('#container').data('syncresult'),
      //     resultData: { isRight: isRight },
      //     syncName: 'teaShowResult',
      //     starSend: message.data[0].value.starSend
      //   })
      // }
    } else {
      $('.icon').attr('src', 'image/cross.png').show().addClass('cross')
      $('.ans-false').html($('.sentence').html())
      $('.ans-correct span').text(answerArr.join(' '))
      $('.answer-wrong').fadeIn(300)
      // if (isSync) {
      //   SDK.bindSyncResultEvt({
      //     sendUser: message.data[0].value.sendUser,
      //     receiveUser: message.data[0].value.receiveUser,
      //     sendUserInfo: message.data[0].value.sendUserInfo,
      //     index: $('#container').data('syncresult'),
      //     resultData: { isRight: isRight },
      //     syncName: 'teaShowResult'
      //   })
      // }
    }

    $(this).addClass('submited')

    // 答题结束
    // submitClick = true
    wordsClick = false
    sentenceClick = false
  })

})