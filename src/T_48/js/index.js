"use strict"
import '../../common/js/common_1v1.js'
import '../../common/js/drag.js'

$(function() {
  window.h5Template = {
    hasPractice: '0'
  }
  let h5SyncActions = parent.window.h5SyncActions;
  const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;

  //业务逻辑

  //业务逻辑
  let source = configData.source;
  let pics = source.pics;
  pics = pics.concat(pics); //需求上要重复两遍
  //填充内容
  const page = {
    showPics: function() { 
      let html = '<img id="pic-start" data-syncactions="pic-start" src="image/source_question.png" />';
      for (let i = 0; i < pics.length; i++) {
        html += `<img class="pic-${i} hide" data-syncactions="pic-${i}" src="${pics[i].pic}" />`;
      }  
      html += `<img id="pic-end" class="hide" data-syncactions="pic-end" src="image/source_goodjob.png" />`;
      $(".pic").html(html);
      $(".text").html("1/" + pics.length);
    },
    init: function() {
      this.showPics(); //渲染卡片
    }
  }
  page.init();

  //老师操作的拖拽条
  $(".alertBox").drag();

  //倒计时动画
  function countDown(callback) {
    let num = 3;
    $(".shade img").attr("src", `image/num${num}.png`);
    function numAnimate() { 
      if(num===0){ 
        $("#soundone")[0].play();
      }else{
        $("#soundtwo")[0].play(); 
      } 
      $(".shade img").css({"height":"2rem",opacity: 1});  
      $(".shade img").animate({ "height": "0rem", opacity: 0 }, 900, function() {
        num--; 
        if (num > -1) {
          $(".shade img").attr("src", `image/num${num}.png`);
        } 
        if(num===-1){  
          callback&&callback();
        }else{
          setTimeout(function(){
            numAnimate();
          },100); 
        }
      }); 
    }
    numAnimate();
  } 

  //老师勾选时的动画
  function rightAnimate(state,callback){
    $("#soundthree")[0].play();
    let obj = { width: ".66rem", height:".494rem", left: "-3.4rem",top:"2rem",opacity:0 };
    if(state==="right"){
      obj = { width: ".66rem", height:".494rem", left: "10rem",top:"2rem",opacity:0 };
    }
    $(".pic-"+cardNum).animate(obj, 600, function() {
      callback&&callback();
    }); 
  } 

  //断线重连恢复结果切面信息 
  SDK.recover = function(data) {
    $(".teacher span").html(data.teaScore);
    $(".student span").html(data.stuScore);
    cardNum = data.cardNum;
    teaScore = data.teaScore;
    stuScore = data.stuScore;
    if(teaScore){
      $(".teacher-folder").removeClass("teacher-replace-2").addClass("teacher-replace-1");
    }
    if(stuScore){
      $(".student-folder").removeClass("student-replace-2").addClass("student-replace-1");
    }
    $(".text").html((cardNum+1)+"/" + pics.length);
    //表示正在进行
    if(data.isRun){
      $("#pic-start").hide();
      $(".start-btn").hide();
      $(".pic-"+cardNum).show();
      if (!isSync||window.frameElement.getAttribute('user_type') == 'tea') { 
        $(".alertBox").show();
      }
    }else{
      //最终状态（都答完了）
      if(cardNum===pics.length-1){
        $("#pic-start").hide();
        $(".start-btn").hide(); 
        $("#pic-end").show(); 
      }
    } 

    SDK.setEventLock();

  }

  //初始化切面信息
  SDK.syncData = {
    teaScore:0,  //老师得分
    stuScore:0,  //学生得分
    cardNum:-1,  //进行到卡片第几页
    isRun:false //是否在进行中
  };


  let startBtnClick = false;
  let cardNum = -1; //进行到卡片第几页
  $(".start-btn").syncbind("click touchstart",function(dom,next){
    if(startBtnClick){
      return;
    }
    startBtnClick = true;
    cardNum++;
    if (!isSync) {
      next(false);
      return
    }
    if (window.frameElement.getAttribute('user_type') == 'tea') { 
      //存储结果切面信息
      SDK.syncData.cardNum = cardNum;
      SDK.syncData.isRun = true;
      next();
    }
  },function(){
    if(isSync){
      cardNum = SDK.syncData.cardNum;
    }
    // $("#pic-start").hide();
    $(".start-btn").hide();
    $(".shade").show();
    countDown(function(){
      $(".shade").hide(); 
      $(".pic-"+cardNum).show();
      if (!isSync||window.frameElement.getAttribute('user_type') == 'tea') { 
        $(".alertBox").fadeIn();
      } 
      $(".text").html((cardNum+1)+"/" + pics.length);
      startBtnClick = false;
      SDK.setEventLock();
    });
  }); 

  let teaChose = false; 
  let teaScore = 0;
  $("#teacher_chose").syncbind("click touchstart",function(dom,next){
    if(teaChose){
      return;
    }
    teaChose = true; 
    teaScore++;
    if (!isSync) {
      next(false);
      return
    }
    if (window.frameElement.getAttribute('user_type') == 'tea') { 
      //存储结果切面信息 
      SDK.syncData.isRun = false;
      SDK.syncData.teaScore = teaScore;
      next();
    }
  },function(){
    if(isSync){
      teaScore = SDK.syncData.teaScore;
    }
    let _this = $(this);
    _this.find("img").attr("src","image/chose.png");
    rightAnimate("left",function(){
      $(".alertBox").fadeOut(function(){
        _this.find("img").attr("src","image/unchose.png");
      });
      $(".teacher span").html(teaScore);
      $(".teacher-folder").removeClass("teacher-replace-2").addClass("teacher-replace-1");
      if(cardNum<pics.length-1){
        $("#pic-start").fadeIn();
        $(".start-btn").fadeIn();
      }else{
        //所有图片都答完了
        $("#pic-end").fadeIn();
      } 
      SDK.setEventLock();
      teaChose = false;
    });
  });
 
  let stuScore = 0;
  $("#student_chose").syncbind("click touchstart",function(dom,next){
    if(teaChose){
      return;
    }
    teaChose = true; 
    stuScore++;
    if (!isSync) {
      next(false);
      return
    }
    if (window.frameElement.getAttribute('user_type') == 'tea') { 
      //存储结果切面信息 
      SDK.syncData.isRun = false;
      SDK.syncData.stuScore = stuScore;
      next();
    }
  },function(){
    if(isSync){
      stuScore = SDK.syncData.stuScore;
    } 
    let _this = $(this);
    _this.find("img").attr("src","image/chose.png");
    rightAnimate("right",function(){
      $(".alertBox").fadeOut(function(){
        _this.find("img").attr("src","image/unchose.png");
      });
      $(".student span").html(stuScore);
      $(".student-folder").removeClass("student-replace-2").addClass("student-replace-1");
      if(cardNum<pics.length-1){
        $("#pic-start").fadeIn();
        $(".start-btn").fadeIn();
      }else{
        //所有图片都答完了
        $("#pic-end").fadeIn();
      } 
      SDK.setEventLock();
      teaChose = false;
    });
  });

})