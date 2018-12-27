"use strict"
import '../../common/js/common_1v1.js'
import './animation.js'
$(function () {
  window.h5Template = {
    hasPractice: '1'
  }
  let h5SyncActions = parent.window.h5SyncActions;
  let options = configData.source.options;
  const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
  let source = configData.source
  let optionsArr = []
  let chooseWords = []   //被扣掉的字符
  let showWords = []   //源字符串
  let optionIndex = 0  //目前显示第几个单词0
  let optionIndex2=0;
  let isClickLock=false
  const page = {
    fitterChoose: function () {
      for (let i = 0; i < options.length; i++) {
        let arr = options[i].text.split("#")
        chooseWords.push(arr[1])
        showWords.push(arr)
        //console.log(showWords, chooseWords, 'aa')
      }
    },
    showOption: function () {
      let html = ''
      for (let i = 0; i < 5; i++) {
        optionsArr[i] = -1
        html += `<li class="lock lock${i}"><span class="lockIcon" data_index="${i}"></span></li>`
      }
      let html2 = `<div class="box"></div>`
      $(".mainArea").append('<ul class="lockArea">' + html + '</ul>' + html2)
      if(source.boxBefore!=''){
        $(".box").css({
          background:'url('+source.boxBefore +') no-repeat',
          'background-size':'contain'
        })
      }
      if (options.length == 2) {
        optionsArr = [0, -1, -1, 2, -1]
      } else if (options.length == 3) {
        optionsArr = [0, -1, 1, -1, 2]
      } else if (options.length == 4) {
        optionsArr = [0, -1, 1, 2, 3]
      } else {
        optionsArr = [0, 1, 2, 3, 4]
      }
    },
    showStyle: function () {
      let html = ''
      let index=-1
      for (let i = 0; i < 5; i++) {
        if (optionsArr[i] == -1) {
          $('.lock').eq(i).addClass('hide')
          html += `<li class="options hide"></li>`
        } else {
          index++
          //console.log(index)
          if (options[index].audio != '') {
            
            html += `<li class="options hide">
                      <div class="wordsList"></div>
                      <div class="audioList" data-syncactions="audio${i}">
                        <img src="image/btn-audio.png" />
                        <audio class="audioSrc" webkit-playsinline controls src="${options[index].audio}"></audio>
                      </div>
                      <ul class="chooseArea"></ul>
                  </li>`
          } else {
            html += `<li class="options hide">
                      <div class="wordsList"></div>
                      <ul class="chooseArea"></ul>
                  </li>`
          }
        }
      }
      $(".mainArea").append('<ul class="optionsArea">' + html + '</ul>')
      $(".options").eq(0).removeClass('hide')
    },
    showWords: function () {
      let index=-1
      for (let i = 0; i < optionsArr.length; i++) {
        if (optionsArr[i] != -1) {
          index++
          // console.log(index,showWords,chooseWords,'aaa')
          let html = ''
          let html2 = ''
          for (let j = 0; j < showWords[index].length; j++) {
            if (showWords[index][j] != chooseWords[index]) {
              html += `<span class="ques">${showWords[index][j]}</span>`
            } else {
              html += `<span class="ques hideQues" data_index=${j} >${showWords[index][j]}</span>`
              html2 = ` <li class="choose" data_id="${i}"data-syncactions="chooseRight${i}"><div class="chooseChild">${showWords[index][j]}</div></li>`
            }
          }
          //console.log(options[index].random * 10, 'aaaa')
          //打乱选项顺序
          if (parseInt(options[index].random * 10) > 5) {
            //console.log($(".chooseArea").eq(i),'bbbbb')
            $(".chooseArea").eq(index).append(` <li class="choose" data-syncactions="choose${i}"><div class="chooseChild" >${options[index].interfere}</div></li>` + html2)
          } else {
            //console.log($(".chooseArea").eq(i),'bbbbb')
            $(".chooseArea").eq(index).append(html2 + `<li class="choose" data-syncactions="choose${i}"><div class="chooseChild">${options[index].interfere}</div></li>`)
          }
          $(".options").eq(i).find(".choose").eq(0).addClass('one')
          $(".wordsList").eq(index).append(html)
        }
      }
    },
    init: function () {
      this.showOption()
      this.showStyle()
      this.fitterChoose()
      this.showWords()
    }
  }
  page.init()
  //let startChoose=true
  $('.choose').on("click touchstart", function (e) {
    if (e.type = "touchstart") {
      e.preventDefault()
    }
    if($(this).hasClass('ok')){
      return
    }
    if (optionIndex2 == $(this).attr("data_id")) {
      isClickLock=true
      optionIndex2++
      for(let i=0;i<optionsArr.length;i++){
        if(optionsArr[optionIndex2]==-1){
          optionIndex2++
        }else{
          break
        }
      }
    }else{
      isClickLock=false
    }
    if (!isSync) {
      $(this).trigger("chooseEventSync")
      return
    }
    if (window.frameElement.getAttribute('user_type') == 'stu') {
      SDK.bindSyncEvt({
        sendUser: '',
        receiveUser: '',
        index: $(e.currentTarget).data("syncactions"),
        eventType: 'click',
        method: 'event',
        syncName: 'chooseEventSync',
        otherInfor: {
          optionIndex: optionIndex,
          optionIndex2: optionIndex2,
          isClickLock:isClickLock
        },
        recoveryMode: '1'
      });
    }
    
  })

  $('.choose').on("chooseEventSync", function (e, message) {
    if (!isSync) {
      optionIndex = optionIndex
      isClickLock=isClickLock
    } else {
      let obj = message.data[0].value.syncAction.otherInfor;
      optionIndex2 =obj.optionIndex2
      isClickLock=obj.isClickLock
      if (message == undefined || message.operate == 1) {
        optionIndex =obj.optionIndex
      } else {
        optionIndex =obj.optionIndex2
        recovery(optionIndex,isClickLock)
        SDK.setEventLock()
        return
      }
    }

    //console.log(optionIndex, $(this).attr("data_id"), optionsArr[optionIndex], 'sssss')
    let index = $(this).index()
    if (optionIndex == $(this).attr("data_id")) {
     
      let targetObj = document.getElementsByClassName('lockIcon')[optionIndex];
      let choosePar = document.getElementsByClassName('options')[optionIndex];
      let chooseObj = choosePar.getElementsByClassName('choose')[index];
     // console.log('答对了哦', optionIndex, index, chooseObj, targetObj)
      $(this).addClass("ok")
      new Promise((resolve, reject) => {
        //console.log($(".options").eq(optionIndex).find('.ques').hasClass("hideQues"), 'cccc')
        let ques = $(".options").eq(optionIndex).find('.ques')
        for (let i = 0; i < ques.length; i++) {
          if (ques.eq(i).attr("data_index") != undefined) {
            ques.eq(i).removeClass("hideQues").addClass("showQues")
          }
        }
        setTimeout(() => {
         // console.log(chooseObj, targetObj, 'ddddd')
          let parabola = funParabola(chooseObj, targetObj, {}, {
            speed: 0.1,
            curvature: 0,
            chooseIndex: index,
            parentIndex: optionIndex
          }).mark();
          parabola.init();
          resolve()
        }, 800)
      }).then(() => {
        setTimeout(() => {
          new Promise((resolve, reject) => {
            $(".options").eq(optionIndex).find(".choose").eq(index).find(".chooseChild").css({opacity:0})
            $(".lock").eq(optionIndex).addClass('openLock')
            resolve()
          })
        }, 1000)
      }).then(() => {
        setTimeout(() => {
          new Promise((resolve, reject) => {
            // startChoose=true
            optionIndex++
            for(let i=0;i<optionsArr.length;i++){
              if(optionsArr[optionIndex]==-1){
                optionIndex++
              }else{
                break
              }
            }
            for (let i = 0; i < $(".lock").length; i++) {
              if (i == optionIndex) {
                $(".options").eq(i).removeClass('hide')
              } else {
                $(".options").eq(i).addClass('hide')
              }
            }
            resolve()
          })
          SDK.setEventLock()
        }, 1500)
      }).then(()=>{
        setTimeout(() => {
          if (optionIndex >=5) {
            new Promise((resolve, reject) => {
             // console.log(optionIndex, 'tttt')
              if (source.boxBefore != '') {
                $(".box").css({
                  background: 'url(' + source.boxAfter + ') no-repeat',
                  'background-size': 'contain'
                })
              } else {
                $(".box").addClass('boxOpen')
              }
            })
            SDK.setEventLock()
          }
        }, 2500)
        // startChoose=true
      })
    } else {
      //console.log("打错了")
      $(".options").eq(optionIndex).find(".choose").eq(index).css({
        'animation':'shake 0.4s both ease-in', 
        '-webkit-animation':'shake 0.4s both ease-in'
      })
      $(".options").eq(optionIndex).find(".choose").eq(index).on('animationend  webkitAnimationEnd', function() {
        $(this).css('animation', 'none', '-webkit-animation', 'none');
        SDK.setEventLock()
      });
      // startChoose=true
    }
  })


  //恢复机制
  
  function recovery(optionIndex,isClickLock) {
    if (optionIndex - 0 >= 5) {
      if(source.boxBefore!=''){
        $(".box").css({
          background:'url('+source.boxAfter +') no-repeat',
          'background-size':'contain'
        })
      }else{
           $(".lock").eq(optionIndex).addClass('openLock')   
      }

      $(".box").addClass("boxOpen")
    }
    $(".options").eq(optionIndex).removeClass('hide')
    for (let i = 0; i < optionIndex; i++) {
      if (i < optionIndex) {
        $(".options").eq(i).addClass('hide')
      }
      if (optionsArr[optionIndex] != -1) {
        $(".lock").eq(i).addClass('openLock')
      }
    }
  
  }


  // 音频播放
  let audioEle;
  let play = false
  let audioPlay = function (message, currentPage) {
    audioEle =$(".options").eq(optionIndex).find('.audioSrc').get(0)
    if (!isSync) {
      audioEle.play()
      $('.audioList img').attr('src', './image/btn-audio.gif')
    } else {
      if ($(window.frameElement).attr('id') === 'h5_course_self_frame') {
        if (message == undefined || message.operate == 1) {
          audioEle.play()
          $('.audioList img').attr('src', './image/btn-audio.gif')
        }
      }
    }
  }
  let audioPause = function (message, currentPage) {
    if (!isSync) {
      audioEle.pause()
    } else {
      if (message == undefined || message.operate == 1) {
        audioEle.pause()
      }
    }
    $('.audioList img').attr('src', './image/btn-audio.png')
  }
  let currentPage = 0;
  let audioClick = true;
  $('.audioList').on('click', function (e) {
    if (audioClick) {
      audioClick = false
      if (!isSync) {
        $(this).trigger('syncAudioClick')
        return
      }
      if (window.frameElement.getAttribute('user_type') == 'tea') {
        SDK.bindSyncEvt({
          index: $(e.currentTarget).data('syncactions'),
          eventType: 'click',
          method: 'event',
          syncName: 'syncAudioClick',
          funcType: 'audio',
          otherInfor: {
            optionIndex: optionIndex
          },
        })
      } else {
        $(this).trigger('syncAudioClick')
      }
    }

  })

  $('.audioList').on('syncAudioClick', function (e, message) {
    if (!isSync) {
      optionIndex = optionIndex
    } else {
      if (window.frameElement.getAttribute('user_type') == 'tea') {
        let obj = message.data[0].value.syncAction.otherInfor;
        optionIndex = obj.optionIndex
        if (message == undefined || message.operate == 1) {

        } else {
          recovery(optionIndex)
          // optionIndex++
          SDK.setEventLock()
          return
        }
      }
    }
    if (play) {
      audioPause(message, currentPage)
    } else {
      audioPlay(message, currentPage)
      audioEle.onended = function () {
        $('.audioList img').attr('src', './image/btn-audio.png')
      }
    }
    SDK.setEventLock()
    audioClick = true
  })
})



