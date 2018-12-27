"use strict"
import '../../common/js/common_1v1.js'

$(function() {
  window.h5Template = {
    hasPractice: '0'
  }
  let h5SyncActions = parent.window.h5SyncActions;
  const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;

  let words = configData.source.words;
  let imgBg = configData.source.imgBg;
  let colorIndex = configData.source.colorNum;


  // 填充内容
  const page = {
    showWords: function() {
      let html = '';
      for (let i = 0; i < words.length; i++) {
        html += `<div class="word bg-hui word-grey" knock='0' data-syncactions="btn-${i}"><p>${words[i].word}</p></div>`;
      }
      $(".words").html(html);
    },
    renderPosition: function() {
      if (words.length === 2 || words.length === 4 ) {
        $(".word").css("margin-left", "0.5rem").css("margin-right", "0.5rem");
      }
    },
    initWordBack: function() {
      if (imgBg) {
        $(".word").each(function() {
          $(this).css({
            "background": `url(${imgBg}) no-repeat`,
            "background-size": "100% 100%"
          });
        });
      }
    },
    init: function() {
      this.showWords(); //渲染卡片 
      this.renderPosition(); //重新渲染位置
      this.initWordBack(); //初始化背景图片
    }
  }
  page.init();

  //断线重连恢复结果切面信息 
  SDK.recover = function(data) { 
    for (let key in data) {
      if(key==="totalClick"){
        continue;
      }
      let val = data[key];
      let dom = $("[data-syncactions=" + key + "]");
      if (val == 0) {
        //第一次点击，字体变化
        dom.removeClass("word-grey").addClass("word-white");
        dom.attr('knock', "1");
      } else {
        //第二次点击，替换背景
        let index = parseInt(key.replace("btn-", "")); 
        dom.removeClass("bg-hui").removeClass("word-grey").removeClass("word-white").css({
          "background": `url(${words[index].pic}) no-repeat`,
          "background-size": "100% 100%"
        });
        dom.attr('knock', "2");
        // let index = key.replace("btn-", "");
        // index = parseInt(index);
        // if (words.length === 4) {
        //   if (index === 0 || index === 3) {
        //     dom.addClass("bg-huang");
        //   } else {
        //     dom.addClass("bg-lv");
        //   }
        // } else {
        //   if (index % 2 === 0) {
        //     dom.addClass("bg-huang");
        //   } else {
        //     dom.addClass("bg-lv");
        //   }
        // }
      }
    }
    if (data.totalClick === words.length) {
      setLight();
    }
    SDK.setEventLock();
  }


  let wordsClick = true;
  $(".word").on("click touchstart", function(e) {
    if (e.type == "touchstart") {
      e.preventDefault()
    }

    let knock = $(this).attr('knock');
    if (knock == 2) {
      //点击两次后不再触发点击效果
      return;
    }

    if (wordsClick) {
      wordsClick = false;
      let index = $(e.currentTarget).data('syncactions');
      //存储结果切面信息
      if (SDK.syncData[index] !== undefined) {
        SDK.syncData[index]++;
        if(SDK.syncData.totalClick){
          SDK.syncData.totalClick++;
        }else{
          SDK.syncData.totalClick = 1;
        } 
      } else {
        SDK.syncData[index] = 0;
      }
      if (!isSync) {
        $(this).trigger('wordClickSync')
        return
      }
      if (window.frameElement.getAttribute('user_type') == 'tea') {
        SDK.bindSyncEvt({
          sendUser: '',
          receiveUser: '',
          index: index,
          eventType: 'click',
          method: 'event',
          syncName: 'wordClickSync'
        });
      }
    }
  })

  let $audioF = $(".audio1").get(0);
  let $audioT = $(".audio2").get(0);

  $('.word').on('wordClickSync', function(e) {
    let _this = $(this);
    let knock = _this.attr('knock');
    if (knock == 0) { 
      $audioF.currentTime=0
      $audioF.play();
      //第一次点击，字体变化
      _this.removeClass("word-grey").addClass("word-white");
      _this.attr('knock', "1");
    } else { 
      $audioT.currentTime=0
      $audioT.play();
      //第二次点击，替换背景
      let index = _this.data('syncactions').replace("btn-", "");
      index = parseInt(index);
      _this.removeClass("bg-hui").removeClass("word-white").css({
        "background": `url(${words[index].pic}) no-repeat`,
        "background-size": "100% 100%"
      });;
      _this.attr('knock', "2");

      // if (words.length === 4) {
      //   if (index === 0 || index === 3) {
      //     _this.addClass("bg-huang");
      //   } else {
      //     _this.addClass("bg-lv");
      //   }
      // } else {
      //   if (index % 2 === 0) {
      //     _this.addClass("bg-huang");
      //   } else {
      //     _this.addClass("bg-lv");
      //   }
      // }
    }
    wordsClick = true;
    
    // console.log("0000000000liu0000000000000000000000000000000"+SDK.syncData.totalClick);
    // console.log("00000000000liu000000000000000000000000000000"+words.length);
    if (SDK.syncData.totalClick === words.length) { 
      setLight();
    }
    SDK.setEventLock();  
  });


  function setLight() {
    for (let i = 0; i < $(".starList").length; i++) {
      if (i % 2 == 0) {
        $(".starList").eq(i).css({
          animation: 'starAnima .5s  infinite',
          ' -webkit-animation': 'starAnima .5s  infinite',
          opacity: 1
        })
        $(".pointList").eq(i).css({
          animation: 'pointAnima 1.5s  infinite',
          ' -webkit-animation': 'pointAnima 1.5s  infinite'
        })
      } else {
        $(".starList").eq(i).css({
          animation: 'starAnima .5s infinite .2s ',
          ' -webkit-animation': 'starAnima .5s .2s infinite .2s',
          opacity: 1
        })
        $(".pointList").eq(i).css({
          animation: 'pointAnima 1.5s  infinite 0.3s',
          ' -webkit-animation': 'pointAnima 1.5s  infinite 0.3s'
        })
      }
    }
    $(".lightBox").addClass("light" + colorIndex).css({ opacity: 1, transition: '1s' })
  }

})