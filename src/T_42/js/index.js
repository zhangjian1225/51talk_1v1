"use strict"
import '../../common/js/common_1v1.js'

$(function() {
  window.h5Template = {
    hasPractice: '1'
  }
  let h5SyncActions = parent.window.h5SyncActions;
  const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;

  let options = configData.source.options,
    texts = [];
  for (let i in options) {
    texts.push({ text: options[i].text, index: i })
  }

  //AC当前模版所在页码
  let page;
  if (isSync) {
    if (configData.source.random && configData.source.random != '') {
      page = parseInt(configData.source.random * 1000);
    } else {
      page = parent.window.h5SyncActions.currentPage;
    }
  } else {
    if(configData.source.random){
      page = configData.source.random-0;
    }else{
      page = parseInt(Math.random() * 1000);
    } 
  }

  // 答案文字乱序
  texts = window.reSort(texts, page)

  //spell 模版
  const spell = {
    picItem: function() {
      let list = '';
      for (let i = 0; i < options.length; i++) {
        list += `<li class="options" data-syncactions="pic-${i}" data-id="${i}">
                    		<img src="${options[i].pic}"/>
                	   </li>`
      }
      $(".pic").append(list);
    },
    textItem: function() {
      let text = '';
      for (let i = 0; i < options.length; i++) {

        text += `<li class="ansList" data-syncactions="item-${i}" data-id="${texts[i].index}">
							<span class="optionsText"></span>
							<div class="anslistBox">${texts[i].text}</div>
				       	</li>`
      }
      $(".answers").append(text);
    },
    setAudio: function() {
      let audio = '';
      let arr = [];
      let index = 0;
      for (let i = 0; i < options.length; i++) {

        if (options[texts[i].index].audio) {
          if (options[texts[i].index].audio != '') {
            audio += `<div class="ansListAudio" data-syncactions="audio-${index}" data-id="${texts[i].index}">
									<img src="image/btn-audios.png"/>
									<audio class="listAudio" preload="preload" audioSrc${index}" src='${options[texts[i].index].audio}'></audio>
								</div>`
            arr.push(i);
            index++;
          }
        }
      }
      // console.log(arr,'11111111')
      $(".answers").append(audio);
      let getAudio = $(".ansListAudio");

      function setAudioPos(h1, h2) {
        for (let j = 0; j < getAudio.length; j++) {
          getAudio.eq(j).css({
            top: arr[j] * h1 + h2 + "rem"
          })
        }
      }
      if (options.length == 4) {
        setAudioPos(2.1, 0.55)
      } else if (options.length == 3) {
        setAudioPos(2.8, 0.85)
      } else {
        setAudioPos(2.8, 2.4)
      }
    },
    setPosition: function() {
      //设置pic的margin
      let picBox = $(".pic"),
        pic = $(".options"),
        text = $(".ansList");
      if (options.length == 4) {
        $(".answers").css({
          "padding-top": ((pic.eq(0).height() - text.eq(0).height()) / 2 / window.base).toFixed(2) + "rem"
        });
        for (let i = 0; i < options.length - 1; i++) {
          pic.eq(i).css({
            "margin-bottom": "0.14rem"
          });
          text.eq(i).css({
            "margin-bottom": "0.6rem"
          });
        }
      }
      if (options.length < 4) {
        picBox.css({
          width: '4.6rem',
        }).find(".options").css({
          height: "2.6rem"
        });
        $(".answers").css({
          "padding-top": ((pic.eq(0).height() - text.eq(0).height()) / 2 / window.base).toFixed(2) + "rem"
        });
        for (let i = 0; i < options.length - 1; i++) {
          pic.eq(i).css({
            "margin-bottom": "0.2rem"
          });
          text.eq(i).css({
            "margin-bottom": "1.3rem",
          })
        }
      }
      if (options.length < 3) {
        picBox.css({
          width: '4.6rem',
        }).find(".options").css({
          height: "2.6rem"
        });
        $(".answers").css({
          "padding-top": ((pic.eq(0).height() - text.eq(0).height()) / 2 / window.base + 1.52).toFixed(2) + "rem"
        });
        $(".pic").css({
          "padding-top": "1.52rem"
        })
        for (let i = 0; i < options.length - 1; i++) {
          pic.eq(i).css({
            "margin-bottom": "0.2rem"
          });
          text.eq(i).css({
            "margin-bottom": "1.3rem",
          })
        }
      }
      $(".problem-area").css({
        "margin-top": "1.7rem"
      });
    },
    setLineBox: function() {
      let objPic = $(".pic");
      let objText = $(".answers");
      let left, right, top;
      if (objPic) {
        left = (parseInt(objPic.css("left")) + objPic.outerWidth()) / window.base;
        top = (($(".options").eq(0).offset().top - $(".pic").offset().top) / window.base).toFixed(1);
      }
      if (objText) {
        right = (parseInt(objText.css("right")) + objText.outerWidth()) / window.base;
      }
      $(".lineBox").css({
        top: top + "rem",
        left: left + "rem",
        bottom: "0rem",
        right: right + "rem"
      })
    },
    init: function() {
      this.picItem();
      this.textItem();
      this.setAudio();
      this.setPosition();
      this.setLineBox();
    }
  }
  spell.init();


  //点击播放音频
  let openAudio = true;
  $(".ansListAudio").on("click touchend", function(e) {
    //  e.stopPropagation();
    if (e.type == "touchend") {
      e.preventDefault()
    }
    // console.log("ok")
    if (openAudio) {
      openAudio = false;
      if (!isSync) {
        $(this).trigger("syncAudioClick");
        return;
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
      } else {
        $(this).trigger('syncAudioClick');
      }
    }
  });

  $(".ansListAudio").on('syncAudioClick', function(e, message) {
    let index = $(this).attr("data-id");
    let audios = $(".answers").find('audio');
    for (let i = 0; i < audios.length; i++) {
      audios.eq(i).attr('src', '')
      $(".ansListAudio").eq(i).find('img').attr("src", $(this).find("img").attr("src").replace(".gif", ".png"));
    }

    $(this).find('audio').attr('src', options[index].audio)
    var $audio = null;
    $audio = $(this).find("audio")[0];
    var $img = $(this).find("img");
    // $audio.currentTime=0;
    $audio.play()

    if ($img.length != 0) {
      $img.attr("src", $(this).find("img").attr("src").replace(".png", ".gif"));
      //播放完毕img状态
      $audio.onended = function() {
        $img.attr("src", $(this).find("img").attr("src").replace(".gif", ".png"));
      }.bind(this);
    }

    SDK.setEventLock();
    openAudio = true;
  })

  //存储结果切面信息
  SDK.syncData.resList = [];

  function setCurrentStateData(obj, index) {
    let resList = SDK.syncData.resList;
    let resObj;
    if (resList.length > 0) {
      let obj = resList[resList.length - 1];
      if (obj.pic > -1 && obj.text > -1) {
        resObj = { pic: -1, text: -1 };
        resList.push(resObj);
      } else {
        resObj = resList[resList.length - 1];
      }
    } else {
      resObj = { pic: -1, text: -1 };
      resList.push(resObj);
    }
    if ($(obj).hasClass("options")) {
      resObj.pic = index;
      resObj['picVal'] = $(obj).attr("data-id");
    }
    if ($(obj).hasClass("ansList")) {
      resObj.text = index;
      resObj['textVal'] = $(obj).attr("data-id");
    }
    if (resObj['pic'] !== -1 && resObj['text'] !== -1 && resObj['picVal'] != resObj['textVal']) {
      resList.pop();
    }
  }

  //断线重连恢复结果切面信息 
  SDK.recover = function(data) {
    let resList = data.resList;
    for (let i = 0; i < resList.length; i++) {
      let obj = resList[i];
      let picIndex = obj.pic;
      let textIndex = obj.text;
      if (picIndex != -1) {
        position1 = $(".pic li").eq(picIndex);
        position1.addClass("imgOption");
        clickImg = true;
        target['pic'] = position1.attr("data-id");
        targetObj['picTarget'] = position1;
      }
      if (textIndex != -1) {
        position2 = $(".answers li").eq(textIndex);
        position2.addClass("textOption");
        clickText = true;
        target['text'] = position2.attr("data-id");
        targetObj['textTarget'] = position2;
      }
      if (picIndex != -1 && textIndex != -1) {
        position1.addClass("ok");
        position2.addClass("ok");
        clickImg = false;
        clickText = false;
        setLine();
      }
    }
    if ($('.problem-area li').length == $(".ok").length) {
      $(".problem-area").addClass("no-click");
      picIsClick = false;
      textIsClick = false;
    }
    SDK.setEventLock();
  }



  //开始答题
  let clickImg = false; //判断点击对象
  let clickText = false;

  let position1; //确定画线位置
  let position2;
  let picIsClick = true;
  $(".pic").on("click touchstart", 'li', function(e) {
    if (e.type == "touchstart") {
      e.preventDefault()
    }
    e.stopPropagation();
    if (picIsClick) {
      picIsClick = false;
      let index = $(this).index();
      if (!isSync) {
        $(this).trigger("syncSelectClick");
        return
      }
      if (window.frameElement.getAttribute('user_type') == 'stu') {
        //存储切面状态信息
        setCurrentStateData(this, index);

        SDK.bindSyncEvt({
          index: $(e.currentTarget).data('syncactions'),
          eventType: 'click',
          method: 'event',
          syncName: 'syncSelectClick'
        });
      }
    }
  })
  $(".pic").on("syncSelectClick", 'li', function(e, message) {
      e.preventDefault();

      if ($(this).hasClass('ok')) {
        picIsClick = true;
        return
      }
      clickImg = true;
      let that = this;
      position1 = $(this);
      let index = $(this).index();
      $(".options").each(function(index, arr) {
        if (that == arr) {
          $(arr).addClass("imgOption");
        } else if (!$(arr).hasClass('ok')) {
          $(arr).removeClass("imgOption");
        }
      });
      judgeAnswer(index, that, message, e);
    })
    //点击答案选项
  let textIsClick = true;
  $(".answers").on("click touchstart", 'li', function(e) {
    e.preventDefault();
    if (e.type == "touchstart") {
      e.preventDefault()
    }
    e.stopPropagation();
    if (textIsClick) {
      textIsClick = false;
      let index = $(this).index();
      if (!isSync) {
        $(this).trigger("syncAnswerClick");
        return
      }
      if (window.frameElement.getAttribute('user_type') == 'stu') {
        //存储切面状态信息
        setCurrentStateData(this, index);

        SDK.bindSyncEvt({
          index: $(e.currentTarget).data('syncactions'),
          eventType: 'click',
          method: 'event',
          syncName: 'syncAnswerClick'
        });
      }
    }
  })
  $(".answers").on("syncAnswerClick", 'li', function(e, message) {

    //断线重连
    if (isSync && message && message.operate == '5') {
      var otherInfor = message.data[0].value.syncAction.otherInfor;
      reConnect(otherInfor);
      return;
    }

    if ($(this).hasClass('ok')) {
      textIsClick = true;
      return
    }
    clickText = true;
    let that = this;
    let index = $(this).index();
    position2 = $(this);
    $(".ansList").each(function(index, arr) {
      if (that == arr) {
        $(arr).addClass("textOption");
      } else if (!$(arr).hasClass('ok')) {
        $(arr).removeClass("textOption");
      }
    })
    judgeAnswer(index, that, message, e);

  });
  //开始画线
  function setLine() {
    let line = $('<div class="line"><div></div></div>');
    let y1 = (position1.offset().top + position1.outerHeight(true) / 2) / window.base;
    let y2 = (position2.offset().top + position2.outerHeight() / 2) / window.base;
    let x0 = $(".lineBox").width() / window.base;
    let index = position1.index();
    let deg;

    deg = Math.atan((y2 - y1) / x0) * 180 / Math.PI;
    deg = deg > 0 ? deg : 360 + deg;
    if (deg < 8 || deg > 352) {
      deg = 0;
    }

    $(".lineBox").append(line);
    line.css({
      top: (position1.outerHeight() / 2 + $(".options").eq(0).outerHeight(true) * index) / window.base + "rem",
      width: Math.sqrt((y1 - y2) * (y1 - y2) + x0 * x0) + 0.05 + "rem",
      transform: 'rotate(' + deg + 'deg)',
      '-webkit-transform': 'rotate(' + deg + 'deg)',
      'transform-origin': ' left center 0px',
      '-webkit-transform-origin': ' left center 0px',
    })
  }
  //判断对错
  var target = {};
  var targetObj = {};

  function judgeAnswer(index, obj, message, e) {
    let isTrue = false;
    let $audio = document.getElementsByClassName("audio")[0];
    if ($(obj).hasClass("options")) {
      target['pic'] = $(obj).attr("data-id");
      targetObj['picTarget'] = $(obj);
    }
    if ($(obj).hasClass("ansList")) {
      target['text'] = $(obj).attr("data-id");
      targetObj['textTarget'] = $(obj);
    }
    if (clickImg == true && clickText == true) {
      if (target['pic'] == target['text']) {
        isTrue = true;
      }
      if (isTrue) {
        $(targetObj['textTarget']).addClass('ok');
        $(targetObj['picTarget']).addClass('ok');
        setLine();
        if ($('.problem-area li').length == $(".ok").length) {
          $(".problem-area").addClass("no-click");
          SDK.setEventLock();
          picIsClick = false;
          textIsClick = false;
          return
        }
        SDK.setEventLock();
        picIsClick = true;
        textIsClick = true;
      } else {

        $audio ? $audio.play() : "";

        targetObj['textTarget'].css({
          'animation': 'shakeUp 0.3s both ease-in',
          '-webkit-animation': 'shakeUp 0.3s both ease-in'
        })
        targetObj['picTarget'].removeClass("imgOption");
        targetObj['picTarget'].css({
          'animation': 'shakeUp 0.3s both ease-in',
          '-webkit-animation': 'shakeUp 0.3s both ease-in'
        })
        targetObj['textTarget'].removeClass("textOption");
        targetObj['textTarget'].on('animationend  webkitAnimationEnd', function() {
          targetObj['textTarget'].css({
            'animation': 'none',
            '-webkit-animation': "none"
          });
          targetObj['textTarget'].off('animationend  webkitAnimationEnd');
        })
        targetObj['picTarget'].on('animationend  webkitAnimationEnd', function() {
          targetObj['picTarget'].css({
            'animation': 'none',
            '-webkit-animation': "none"
          });
          targetObj['picTarget'].off('animationend  webkitAnimationEnd');
        });
        SDK.setEventLock();
        picIsClick = true;
        textIsClick = true;
      }

      clickText = false
      clickImg = false
    } else {
      SDK.setEventLock();
      if ($(".problem-area").hasClass('no-click')) {
        picIsClick = false;
        textIsClick = false;
      } else {
        picIsClick = true;
        textIsClick = true;
      }
    }
  }


})