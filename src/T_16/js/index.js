"use strict"
import '../../common/js/common_1v1'
import '../../common/js/commonFunctions.js';

/**
 * 控制器调用的变量
 */
window.h5Template = {
  hasPractice: '1' //表示授权
}
const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
$(function() {
  // 埋点：进入页面
  var h5SyncActions = parent.window.h5SyncActions;
  if ($(window.frameElement).attr('id') === 'h5_course_self_frame') {
    // Tracking.init(h5SyncActions.classConf, {
    // 	tplate: 'TC007'
    // });
    // parent.window.dataReport.tracking && parent.window.dataReport.tracking.init(h5SyncActions.classConf, {
    // 	tplate: 'TC007'
    // });
    initTrack('TC007')
  }

  let staticData = configData.source,
    title = staticData.title,
    text = staticData.text,
    options = staticData.options,
    right = staticData.right,
    words = staticData.words,
    mainAudio = staticData.mainAudio,
    image = staticData.image;
  var h5SyncActions = parent.window.h5SyncActions;
  let isImage; //标记选项为文字还是图片
  let showImg = ['', '', '', '', '', '', '', '', '']; //存储点击翻转的图片位置
  //渲染模版
  const page = {
    showImage: function() {
      let list = '';
      list = `<div class="imageList">
                    <img src="${image}" alt="">
                   </div>`
      for (let i = 0; i < 9; i++) {
        $(".showPicBox").eq(i).append(list)
      }
    },
    showOptions: function() {
      $(".answerImg").find('img').eq(0).attr('src', image);
      if (mainAudio != '') {
        let audio = ''
        audio = `<audio src="${mainAudio}"></audio>`
        $(".answerAudio").append(audio)
        $(".mainInfor").css({
          'padding-left': '1.15rem',
          'padding-right': '0.5rem'
        })
      } else {
        $(".answerAudio").css({ 'display': 'none' })
        $(".mainInfor").css({ 'padding-left': '0.5rem' })
      }
      if (words != '') {
        $(".mainInfor").append(words)
      } else {
        $(".mainInfor").css({
          'padding-left': '0rem',
          'padding-right': '0rem',

        })
        $(".answerAudio").css({
          'left': '2.7rem',
          'bottom': '-0.4rem'
        })
      }

      let listOps = '';

      $(options).each(function(i, arr) {
        if (arr.img != '') {
          $(".right").css({ 'height': '6rem' })
          isImage = true;
          if (arr.audio != '') {
            listOps += `<div class="optionsList answ answ${i+1}" data-syncactions="options_${i}">
			                        <span class="answerIcon"></span>
			                        <span class="optionsText"></span>
			                        <img src="${arr.img}" alt=''>
			                        <div class="audioBox audioClick" data-syncactions="btn_options_${i}">
                            			<audio src="${arr.audio}"></audio>
                            			<img class="audioBack" src="image/btn-Audios.png">
                        			</div>
			                    </div>`
          } else {
            listOps += `<div class="optionsList answ answ${i+1}" data-syncactions="options_${i}">
			                        <span class="answerIcon"></span>
			                        <span class="optionsText"></span>
			                        <img src="${arr.img}" alt=''>
			                    </div>`
          }
        } else {
          $(".right").css({ 'width': '8rem', 'height': '6.45rem', 'top': '0.33rem' })
          if (arr.audio != '') {
            listOps += `<div class="optionsList text text${i+1}" data-syncactions="options_${i}">
			                        <span class="answerIcon"></span>
			                        <span class="optionsText"></span>
			                        <div class="textBox">
			                        	<div class="textList"><p>${arr.text}</p></div>
			                        </div>
			                        <div class="audioBox audioClick" data-syncactions="btn_options_${i}">

                            			<audio src="${arr.audio}"></audio>
                            			<img class="audioBack" src="image/btn-Audios.png">
                        			</div>
			                    </div>`
          } else {
            listOps += `<div class="optionsList text text${i+1}" data-syncactions="options_${i}">
			                        <span class="answerIcon"></span>
			                        <span class="optionsText"></span>
			                        <div class="textBox">
			                        	<div class="textList"><p>${arr.text}</p></div>
			                        </div>
			                    </div>`
          }
        }
      })

      $(".optBox").append(listOps)
        //设置字体大小
        // for(let i=0;i<options.length;i++){
        // 	if(options[i].text.length<=57){
        // 		$(".optionsList").eq(i).css({'font-size':"0.48rem"})
        // 		console.log($(".optionsList").eq(i),"ok11111111111")
        // 	}
        // }
      if (isImage == true) {
        if (options.length == 2) {
          $(".optBox").css({
            height: '2.7rem'
          }).find(".answ").css({
            top: '1.65rem'
          })
        } else {
          $(".optBox").css({
            height: '100%'
          })
        }
      } else {
        if (options.length == 2) {
          $(".optBox").css({
            height: '3.07rem'
          })
          $(".optionsList").eq(0).css({
            'top': '1.7rem'
          })
          $(".optionsList").eq(1).css({
            'top': '3.37rem'
          })
        } else {
          $(".optBox").css({
            height: '100%'
          })
        }
      }
    },
    init: function() {
      this.showImage();
      this.showOptions();
    }
  }
  page.init();
  //阻止图片默认事件
  $("img").each(function(i, arr) {
      arr.ondragstart = function() { return false; };
    })
    //翻转图片
  let changeImg = true;
  let index
  $(".scroll").on('click touchstart', function(e) {
    if (!$(this).hasClass('scroll')) { //已经翻转的不可再点击
      return
    }
    // console.log("开始翻牌了")
    if (e.type == "touchstart") {
      e.preventDefault()
    }
    if (changeImg) {
      index = $(this).index();
      showImg[index - 1] = index;
      changeImg = false;
      if (!isSync) {
        $(this).trigger("syncShowPic");
        return;
      }

      if (window.frameElement.getAttribute('user_type') == 'tea') {
        SDK.bindSyncEvt({
          index: $(e.currentTarget).data('syncactions'),
          eventType: 'click',
          method: 'event',
          syncName: 'syncShowPic',
          recoveryMode: '1',
                              questionType: '',
                              tplate: '',
          otherInfor: {
            showImg: showImg,
            index: index
          }
        });
      }
    }
  });

  $(".scroll").on('syncShowPic', function(e, message) {
    // console.log(showImg,'aaa')
    let $audio1 = $('.audioClick').get(0)
    $audio1 ? $audio1.play() : '';
    // if($(window.frameElement).attr('id') === 'h5_course_self_frame'||!isSync){
    // 	if(message==undefined||message.operate==1){

    // 	}
    // }
    if (isSync) {
      let obj = message.data[0].value.syncAction.otherInfor;
      index = obj.index;
      if (message == undefined || message.operate == 1) {
        showImages();
      } else {
        if ($(window.frameElement).attr('id') === 'h5_course_self_frame') {
          showImg = obj.showImg;
          $(showImg).each(function(i, arr) {
            let index = i + 1;
            if (arr != '') {
              $(".showPicBox" + index).css({
                transform: "rotateY(-180deg)",
                "-webkit-transform": "rotateY(-180deg)"
              });
            }
          })
        }
        return
      }
    } else {
      index = index;
      showImages()
    }

    function showImages() {
      $('.d-box .showPicBox' + index).css({
        'animation': 'shakeUp1 0.5s  linear forwards',
        '-webkit-animation': 'shakeUp1 0.5s  linear forwards'
      });
      let $audio2 = $('.audioScroll').get(0)
      $('.d-box .showPicBox' + index).on('animationend  webkitAnimationEnd', function() {
        $(this).off('animationend webkitAnimationEnd');
        if ($(window.frameElement).attr('id') === 'h5_course_self_frame' || !isSync) {
          $audio2 ? $audio2.play() : ''
        }
        $(this).css({
          'animation': 'none',
          '-webkit-animation': 'none'
        });
        $(this).css({
          transform: "rotateY(-180deg)",
          " -webkit-transform": "rotateY(-180deg)"
        });
        $(this).find('.imageList').css({
          'z-index': '20'
        })

        SDK.setEventLock();
        changeImg = true;
      })
    }

    $(this).removeClass('scroll')

  })

  //点击选项触发事件
  let startAnsw = true;
  let indexOpt;
  let courseStatus;
  if (isSync) {
    courseStatus = SDK.getClassConf().h5Course.classStatus
  }

  $(".optionsList").on('click touchstart', function(e) {
    indexOpt = $(this).index();
    if (e.type == "touchstart") {
      e.preventDefault()
    }
    if (startAnsw) {
      startAnsw = false;
      if (!isSync) {
        $(this).trigger("syncShowAnsw");
        return;
      }
      if (courseStatus != 0) {
        if (window.frameElement.getAttribute('user_type') == 'stu') {
          SDK.bindSyncEvt({
            index: $(e.currentTarget).data('syncactions'),
            eventType: 'click',
            method: 'event',
            syncName: 'syncShowAnsw',
            recoveryMode: '1',
                            questionType: 'TC',
                                tplate: 'TC007',
            otherInfor: {
              showImg: showImg,
              indexOpt: indexOpt
            }
          });
        }
      }
    }
  })

  $(".optionsList").on('syncShowAnsw', function(e, message) {
    // console.log("开始答题了")
    if (!isSync) {
      indexOpt = indexOpt;
    } else {
      let obj = message.data[0].value.syncAction.otherInfor;
      if (message == undefined || message.operate == 1) {
        indexOpt = obj.indexOpt;
      } else {
        indexOpt = obj.indexOpt;
        reBack(indexOpt) //恢复答题状态
        return;
      }
    }
    if (indexOpt == right) {
      // console.log(indexOpt,"答对了")
      showMaskMerg(indexOpt, true);
      if (isSync) {
        SDK.bindSyncResultEvt({
          sendUser: message.data[0].value.sendUser,
          receiveUser: message.data[0].value.receiveUser,
          sendUserInfo: message.data[0].value.sendUserInfo,
          index: $('#container').data('syncresult'),
          resultData: {
            isRight: true
          },
          syncName: 'teaShowResult',
          starSend: message.data[0].value.starSend,
          operate: message.operate,
          questionType: 'TC',
                          tplate: 'TC007',
        });
      }
    } else {
      // console.log("答错了")
      showMaskMerg(indexOpt, false);
      if (isSync) {
        SDK.bindSyncResultEvt({
          sendUser: message.data[0].value.sendUser,
          receiveUser: message.data[0].value.receiveUser,
          sendUserInfo: message.data[0].value.sendUserInfo,
          index: $('#container').data('syncresult'),
          resultData: {
            isRight: false
          },
          syncName: 'teaShowResult',
          starSend: message.data[0].value.starSend,
          operate: message.operate,
          questionType: 'TC',
                          tplate: 'TC007',
        });
      }
    }
    startAnsw = false;

    function showMaskMerg(index, result) {
      console.log('ffff')
        //剩余的全部翻转
      let allScrolled = true;
      for (let i = 0; i < showImg.length; i++) {
        if (showImg[i] == '') {
          allScrolled = false;
        }
        let i = i + 1;
        $('.scroll .showPicBox' + i).css({
          'animation': 'shakeUp1 0.5s  linear 0s forwards', //时间0.5s
          '-webkit-animation': 'shakeUp1 0.5s  linear 0s forwards'
        });
        let $audio = $('.audioScroll').get(0);
        $('.scroll .showPicBox' + i).on('animationend  webkitAnimationEnd', function() {
            if ($(window.frameElement).attr('id') === 'h5_course_self_frame' || !isSync) {
              $audio ? $audio.play() : '';
            }
            $('.showPicBox').css({
              'animation': 'none',
              '-webkit-animation': 'none'
            });
            $(".showPicBox" + i).css({
              transform: "rotateY(-180deg)",
              " -webkit-transform": "rotateY(-180deg)"
            }).delay(300).queue(function() {
              //0.8s为全部翻转后判断对错的延迟时间
              //选择后左侧全部翻转在做对错效果展示
              scrollEnd(result);
            })
          })
          //若全部翻开后的情况
        if (allScrolled) {
          setTimeout(function() {
            //0.8s为全部翻转后判断对错的延迟时间
            //选择后左侧全部翻转在做对错效果展示
            scrollEnd(result)
          }, 200)
        }
      }
      if (result == true) {
        //答对时左右图片合并效果 在此之前的动作耗时1.7s 
        if (isImage) {
          $('.left').css({
            'animation': 'run1 1s forwards 2s ease-in,small1 0s forwards ease-in 3s',
            'z-index': '101'
          })
          $('.optionsList').eq(index).css({
            'animation': 'run2 1s forwards ease-in 2s'
          }).delay(2800).queue(function() {
            $(".answerImg").css({ 'opacity': '1', 'z-index': '100', 'transition': '0.6s' })
            $(this).dequeue();
          }).delay(600).queue(function() {
            if (mainAudio != '') {
              setEndPlay();
            }
          });
        } else {
          // console.log("是文字")
          $('.left').css({
            'animation': 'run3 3s forwards 2s ease-in',
            'z-index': '101'
          })
          $('.optionsList').eq(index).css({
            'animation': 'run4 1.5s forwards ease-in 2s',
          }).delay(3800).queue(function() {
            if (mainAudio != '') {
              setEndPlay();
            }
          });
        }
      } else {
        $('.left').delay(1500).queue(function() {
          $('.left').css({
            'animation': 'run3 2s forwards ease-in',
            'z-index': '10'
          })
          $(this).dequeue();
        }).delay(2000).queue(function() {
          if (mainAudio != '') {
            setEndPlay()
          }
        });
      }
      //合并之后 显示正确答案
      $(".left").on('animationend  webkitAnimationEnd', function() {
        setTimeout(function() {
          $(".answerImg").css({
            'opacity': '1',
            'transition': 'all 0.5s',
            'z-index': '100'
          })
        }, 200)
      });
      //隐藏选项
      $(".answerImg").delay(2000).queue(function() {
        for (let i = 0; i < $('.optionsList').length; i++) {
          if (result == true) {
            if (i != index) {
              $('.optionsList').eq(i).css({ 'opacity': 0, 'transition': "1s" })
            }
          } else {
            $('.optionsList').eq(i).css({ 'opacity': 0, 'transition': "1s" })
          }
        }
      })
      startAnsw = false;
      SDK.setEventLock();
    }

    function scrollEnd(result) {
      if (result == true) {
        let $audio = $('.audioRight').get(0)
        if ($(window.frameElement).attr('id') === 'h5_course_self_frame' || !isSync) {
          $audio ? $audio.play() : ''
        }
        $(".optionsList").eq(indexOpt).find(".answerIcon").addClass("ansRight");
        $(".optionsList").eq(indexOpt).find(".optionsText").css({ 'visibility': 'hidden' });
      } else {
        let $audio = $('.audioWrong').get(0)
        if ($(window.frameElement).attr('id') === 'h5_course_self_frame' || !isSync) {
          $audio ? $audio.play() : ''
        }
        $(".optionsList").eq(indexOpt).find(".answerIcon").addClass("ansWrong"); //答错时动效时间0.4s
        $(".optionsList").eq(indexOpt).find(".optionsText").css({ 'visibility': 'hidden' });
        $(".optionsList").eq(indexOpt).css('animation', 'shakeUp3 0.4s both ease-in', '-webkit-animation', 'shakeUp3 0.4s both ease-in');
        $(".optionsList").eq(indexOpt).on('animationend  webkitAnimationEnd', function() {
          $(".optionsList").eq(indexOpt).css('animation', 'none', '-webkit-animation', 'none');
        });
      }
    }
  })

  //触发声音按钮
  let startAudio = true;
  $(".audioClick").on('click touchstart', function(e) {
    e.stopPropagation();
    if (e.type == "touchstart") {
      e.preventDefault()
    }
    if (startAudio) {
      startAudio = false;
      if (!isSync) {
        $(this).trigger("audioSync");
        return;
      }
      if (window.frameElement.getAttribute('user_type') == 'tea') {
        SDK.bindSyncEvt({
          sendUser: '',
          receiveUser: '',
          index: $(e.currentTarget).data('syncactions'),
          eventType: 'click',
          method: 'event',
          funcType: 'audio',
          syncName: 'audioSync'
        });
      } else {
        $(this).trigger("audioSync");
      }
    }
  });
  $(".audioClick").on('audioSync', function(e, message) {
    let index;
    index = $(this).parent().index();
    // console.log(index,'点击音频了')
    let audios = $(".audioBox").find('audio');
    for (let i = 0; i < audios.length; i++) {
      audios.eq(i).attr('src', '')
      $(".audioBox").eq(i).find('img').attr("src", $(this).find("img").attr("src").replace(".gif", ".png"));
    }

    $(this).find('audio').attr('src', options[index].audio)
    let $audio = null;
    $audio = $(this).find("audio")[0];
    let $img = $(this).find("img");

    if (message == undefined || message.operate == 1) {
      if ($(window.frameElement).attr('id') === 'h5_course_self_frame' || !isSync) {
        $audio.currentTime = 0;
        $audio.play()
      }
      if ($img.length != 0) {
        $img.attr("src", $(this).find("img").attr("src").replace(".png", ".gif"));
        //播放完毕img状态
        $audio.onended = function() {
          $img.attr("src", $(this).find("img").attr("src").replace(".gif", ".png"));
        }.bind(this);
      }
    }
    SDK.setEventLock();
    startAudio = true;
  });
  let answerAudioBtn = true;
  $(".audioClicks").on('click touchstart', function(e) {
    e.stopPropagation();
    if (e.type == "touchstart") {
      e.preventDefault()
    }
    if (answerAudioBtn) {
      answerAudioBtn = false;
      if (!isSync) {
        $(this).trigger("AnswerAudioSync");
        return;
      }
      if (window.frameElement.getAttribute('user_type') == 'tea') {
        SDK.bindSyncEvt({
          sendUser: '',
          receiveUser: '',
          index: $(e.currentTarget).data('syncactions'),
          eventType: 'click',
          method: 'event',
          funcType: 'audio',
          syncName: 'AnswerAudioSync'
        });
      } else {
        $(this).trigger("AnswerAudioSync");
      }

    }
  })

  $(".audioClicks").on('AnswerAudioSync', function(e, message) {
    setEndPlay();
    answerAudioBtn = true;
  });

  function setEndPlay() {
    let $audioNow = null;
    let $imgs;
    let imgObj;
    $audioNow = $('.answerAudio').find("audio")[0];
    $imgs = $('.answerAudio').find(".audioBack");
    imgObj = $('.answerAudio');
    // if( $(window.frameElement).attr('id') === 'h5_course_self_frame'||!isSync){
    $audioNow ? $audioNow.play() : ''
    if ($imgs.length != 0) {
      $imgs.attr("src", imgObj.find(".audioBack").attr("src").replace(".png", ".gif"));
      //播放完毕img状态
      $audioNow.onended = function() {
        $imgs.attr("src", imgObj.find(".audioBack").attr("src").replace(".gif", ".png"));
      };
    }
    // }
  }

  function reBack(indexOpt) {
    for (let i = 0; i < options.length; i++) {
      $('.optionsList').eq(i).css({
        'opacity': 0
      })
    }
    $(".left").css({
      'display': 'block',
      'transform': 'translate(50%,0rem) scale(1,1)',
      'z-index': 10
    }).find(".answerImg").css({
      'opacity': 1,
      'z-index': 101
    })
  }
})
