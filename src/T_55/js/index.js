"use strict"
import '../../common/js/common_1v1.js'


function countDown(callback) {
  let num = 3;
  $(".shade img").attr("src", `image/num${num}.png`);

  function numAnimate() {
    if (num === 0) {
      $("#soundone")[0].play();
    } else {
      $("#soundtwo")[0].play();
    }
    $(".shade img").css({ "height": "2rem", opacity: 1 });
    $(".shade img").animate({ "height": "0rem", opacity: 0 }, 900, function() {
      num--;
      if (num > -1) {
        $(".shade img").attr("src", `image/num${num}.png`);
      }
      if (num === -1) {
        callback && callback();
      } else {
        setTimeout(function() {
          numAnimate();
        }, 100);
      }
    });
  }
  numAnimate();
}

$(function() {
  window.h5Template = {
    hasPractice: '0'
  }
  let h5SyncActions = parent.window.h5SyncActions;
  const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;

  //业务逻辑
  let source = configData.source;
  let words = source.words;
  let allWord = []; //显示word的队列
  for (let i = 0; i < source.repeats; i++) {
    allWord = allWord.concat(words);
  }

  //填充内容
  const page = {
    showWords: function() {
      let html = '';
      for (let i = 0; i < 9; i++) {
        html += `<div class="word word-${i} hide" data-syncactions="word-${i}"></div>`;
      }
      $(".word-container").append(html);
    },
    drawBg: function(){
      if(source.basepic.big){
        $(".word-1").css({"background":`url(${source.basepic.big}) no-repeat`,"background-size": "auto 100%"});
        $(".word-8").css({"background":`url(${source.basepic.big}) no-repeat`,"background-size": "auto 100%"});
      }
      if(source.basepic.middle){
        $(".word-4").css({"background":`url(${source.basepic.middle}) no-repeat`,"background-size": "auto 100%"});
        $(".word-5").css({"background":`url(${source.basepic.middle}) no-repeat`,"background-size": "auto 100%"});
        $(".word-6").css({"background":`url(${source.basepic.middle}) no-repeat`,"background-size": "auto 100%"});
        $(".word-0").css({"background":`url(${source.basepic.middle}) no-repeat`,"background-size": "auto 100%"});
      }
      if(source.basepic.small){
        $(".word-2").css({"background":`url(${source.basepic.small}) no-repeat`,"background-size": "auto 100%"});
        $(".word-3").css({"background":`url(${source.basepic.small}) no-repeat`,"background-size": "auto 100%"});
        $(".word-7").css({"background":`url(${source.basepic.small}) no-repeat`,"background-size": "auto 100%"}); 
        $("#countimg").attr("src",source.basepic.small);
        $("#totalimg").attr("src",source.basepic.small);
      }
    },
    showBegin: function() {
      if (!isSync || window.frameElement.getAttribute('user_type') == 'tea') {
        $(".start-page").show();
      }
    },
    init: function() {
      this.showWords(); //渲染卡片
      this.drawBg();  //渲染单词背景图片
      this.showBegin(); //老师端显示开始界面
    }
  }
  page.init();
  
  SDK.recover = function(data){
    if(data.start&&!data.gameOver){  //游戏进行中
      $(".start-page").hide();
      $("#total").text(data.clickWord);
      for(let key in data.showWords){
        if(data.showWords[key]){
          $("[data-syncactions=" + key + "]").text(data.showWords[key]).show();
        }
      }
      if (window.frameElement.getAttribute('user_type') == 'tea') {
        randomWords();
      }
    }else if(data.gameOver===true){
      $("#total").text(data.clickWord);
      $(".start-page .text").hide();
      $("#btnstart").hide();
      $(".shade").hide();
      $("#score").text(allWord.length);
      $(".start-page").fadeIn();
      $(".score-container").show().animate({opacity:1});
    }
 
    SDK.setEventLock();
  }

  function getRandomPos() {
    let empWords = $('.word:hidden');
    if (empWords && empWords.length > 0) {
      let random = Math.floor(Math.random() * empWords.length);
      return empWords.eq(random);
    } else {
      return null;
    }
  }

  function randomWords() {
    let addWord = function(){
      if (allWord&&allWord[SDK.syncData.wordIndex]) {
        let dom = getRandomPos();
        if (dom) { 
          let index = dom.data("syncactions");
          SDK.syncData.showWords[index] = allWord[SDK.syncData.wordIndex];
          SDK.syncData.wordIndex++;
          if(!isSync){
            dom.trigger("appendText");
            return;
          }
          SDK.bindSyncEvt({
            index: index,
            eventType: "sendmessage",
            method: 'event',
            syncName: "appendText"
          }); 
        }
      } else {
        //单词都显示完了
        clearInterval(itv);
      }
    }
    addWord();
    let itv = setInterval(addWord, 3000);
  }

  $(".word").on("appendText",function(){
    $(this).text(allWord[SDK.syncData.wordIndex-1]); 
    $(this).fadeIn();
    SDK.setEventLock();
  });

  //判断单词是否都点完了
  function gameOver() {
    //说明单词都显示完了并且页面上就剩一个可点击的萝卜
    if (allWord.length === SDK.syncData.wordIndex && $('.word:hidden').length === 8) {
      return true;
    } else {
      return false;
    }
  }

  let wordClick = false;
  $(".word").syncbind('click touchstart', function(dom, next) {
    if (wordClick) {
      return;
    }
    wordClick = true;
    //修改切面信息
    let index = dom.data("syncactions");
    SDK.syncData.showWords[index] = "";
    SDK.syncData.clickWord ++ ;
    let end = gameOver();
    if (end) {
      SDK.syncData.gameOver = end;
    }  

    if (!isSync) {
      next(false);
      return
    }
    if (window.frameElement.getAttribute('user_type') == 'tea') {
      next();
    }
  }, function() {
    $("#dong")[0].currentTime = 0;
    $("#dong")[0].play();
    $(this).text("").hide();
    $("#total").text(SDK.syncData.clickWord); 
    wordClick = false;
    //游戏结束
    if(SDK.syncData.gameOver){
      $(".start-page .text").hide();
      $("#btnstart").hide();
      $(".shade").hide();
      $("#score").text(allWord.length);
      $(".start-page").fadeIn();
      $(".score-container").show().animate({opacity:1});
    }
    SDK.setEventLock();
  });


  let startBtnClick = false;
  $("#btnstart").syncbind("click touchstart", function(dom, next) {
    if (startBtnClick) {
      return;
    }
    startBtnClick = true;
    //存储切面信息
    SDK.syncData.start = true; //记录切面，游戏已经开始
    SDK.syncData.wordIndex = 0; //记录显示到第几个单词了
    SDK.syncData.clickWord = 0; //记录点击了几个单词
    SDK.syncData.showWords = {}; //记录萝卜坑对应的单词

    if (!isSync) {
      next(false);
      return
    }
    if (window.frameElement.getAttribute('user_type') == 'tea') {
      next();
    }
  }, function() {
    $(this).hide();
    $(".shade").css("display","flex");
    $(".start-page .text").hide();
    $(".score-container").hide();
    $(".start-page").show();
    countDown(function() {
      $(".start-page").hide();
      if (!isSync || window.frameElement.getAttribute('user_type') == 'tea') {
        randomWords();
      }
      startBtnClick = false;
      SDK.setEventLock();
    });
  });


})