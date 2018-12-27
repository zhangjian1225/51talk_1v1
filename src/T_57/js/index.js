"use strict"
import '../../common/js/common_1v1.js'
import { resultWin, resultLose ,resultHide} from '../../common/template/resultPage/index.js';

function countDown(callback) {
  $(".shade").show();
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
        $(".shade").hide();
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

  let classStatus = "0"; //未开始上课 0未上课 1开始上课 2开始练习
  if (isSync) {
    classStatus = parent.window.h5SyncActions.classConf.h5Course.classStatus;
  }


  //业务逻辑 
  let source = configData.source;
  let pics = source.pics;

  let gameLimit = 30; //游戏限定时长,单位是秒
  let roleStepLimit = 5; //点击次数，五次走完
  let biteLen = 1.6; //咬到的判定距离，单位rem
  let endX = 16.4; //终点x坐标，单位是rem
  let fishLen = endX - 3.81; //3.81是css里面鱼的位置+宽度
  let fishUnitLin = fishLen / gameLimit; //鱼的单位移动
  let roleLen = endX - 7.84; //7.84是css里面人物的位置+宽度
  let roleUnitLine = roleLen / roleStepLimit; //角色的单位移动
  let gameInterval; //游戏执行的线程

  //填充内容
  const page = {
    showPics: function() {
      let html = '';
      for (let i = 0; i < pics.length; i++) {
        let cls = "hide";
        if (i === 0) {
          cls = "";
        }
        html += `<img id="pic-${i}" class="${cls}" src="${pics[i].pic}" />`;
      }
      $(".pic").append(html);

      //配置的替换图片
      if (source.role) {
        $(".role").css({
          "background": `url(${source.role}) no-repeat`,
          "background-size": "11.52rem 100%",
          "background-position-x": "0rem"
        })
      }
    },
    initPage: function() {
      $("#picpage").html("1/" + pics.length);
      if (!isSync || window.frameElement.getAttribute('user_type') == 'tea') {
        $("#btnstart").show();
        $(".lrbtn-bg").css("display", "flex");
      }
    },
    initCurrent: function() {
      SDK.syncData.currentPicIndex = 0; //当前页 
      SDK.syncData.rolestep = 0; //角色前进步数
    },
    //重置游戏界面
    resetGame: function() {
      $("#soundwater")[0].pause();
      //角色和鲨鱼归位
      $(".fish").css({ "left": "0.4rem" }).removeClass("fish-move");
      $(".role").css({ "left": "3.8rem" }).removeClass("role-move");
      //隐藏遮罩
      $(".start-page").hide();
      //隐藏输赢的画面
      $("#result-role").hide();
      $(".win-animation").hide();
      $(".lose-animation").hide();

      //显示左右切换按钮
      if (!isSync || window.frameElement.getAttribute('user_type') == 'tea') {
        //显示开始按钮
        $("#btnstart").show();
        $(".lrbtn-bg").css("display", "flex");
      }
      //重置缓存信息
      window.localStorage.removeItem('fishPosition');
      //重置必要的切面信息
      SDK.syncData.rolestep = 0; //角色前进步数
      SDK.syncData.gameStart = null; //游戏是否开始
      SDK.syncData.gameOver = null; //游戏判定结果 

    },
    //设置左右图片切换按钮状态样式
    setLRBtn: function() {
      let currentPic = SDK.syncData.currentPicIndex;
      if (currentPic === pics.length - 1) {
        $(".right").addClass("disable");
      } else {
        $(".right").removeClass("disable");
      }
      if (currentPic === 0) {
        $(".left").addClass("disable");
      } else {
        $(".left").removeClass("disable");
      }
    },
    gamePause: function() {
      $("#soundwater")[0].pause();
      $(".fish").removeClass("fish-move");
      $(".role").removeClass("role-move");
    },
    //玩游戏
    playGame: function() {
      let that = this;
      $(".fish").addClass("fish-move");
      $(".role").addClass("role-move");
      $("#soundwater")[0].play();
      gameInterval = setInterval(function() {
        //游戏暂停
        if (gamePauseFlag) {
          that.gamePause();
          return;
        } else {
          $(".fish").addClass("fish-move");
          $(".role").addClass("role-move");
        }

        let left = $(".fish").position().left / window.base + fishUnitLin;
        //老师控制判定结果
        if (!isSync || window.frameElement.getAttribute('user_type') == 'tea') {
          $(".fish").animate({ "left": left + 'rem' }, 1000, "linear");
          let isOver = that.isGameOver();
          if (isOver !== "doing") {
            SDK.syncData.gameOver = isOver;
            if (!isSync) {
              $("#btngogo").trigger("gameOver");
            } else {
              SDK.bindSyncEvt({
                index: "btn-gogo",
                eventType: "mygameevent",
                method: 'event',
                syncName: "gameOver"
              });
            }
          }
          window.localStorage.setItem('fishPosition', left);
        } else {
          let isOver = that.isGameOver();
          if (isOver === "lose" && (SDK.syncData.gameOver !== "win" && SDK.syncData.gameOver !== "lose")) {
            //说明老师端没有判定游戏结束,或者结束事件延迟,不再移动
            window.localStorage.setItem('fishPosition', $(".fish").position().left / window.base);
          } else {
            $(".fish").animate({ "left": left + 'rem' }, 1000, "linear");
            window.localStorage.setItem('fishPosition', left);
          }
        }
      }, 1000);
    },
    //判断游戏是否执行完毕
    isGameOver: function() {
      let res = "doing";
      //说明角色到达终点，游戏结束
      if (SDK.syncData.rolestep === roleStepLimit) {
        res = "win";
      }
      if ($(".role").position().left - $(".fish").position().left < biteLen * window.base) {
        res = "lose";
      }
      return res;
    },
    gameOver: function() {
      $(".fish").removeClass("fish-move");
      $(".role").removeClass("role-move");
      clearInterval(gameInterval);
      $("#btngogo").hide(); 
      $("#soundwater")[0].pause();
      if (SDK.syncData.gameOver === "win") { 
        resultWin({
          'WinIsLoop': false, // 答对声音是否重复播放 true/false
          'Mask_Z_Index': "500" // 遮罩层z_index
        });
      } else {
        resultLose({
          'src':'./image/resultSnow.png',  // 雪图片
          'loseIsLoop': false, // 答错声音是否重复播放 true/false
          'Mask_Z_Index':'500', // 遮罩层z_index
          'Snow_Z_Index':'1'// 雪z_index
        });  
      }
      setTimeout(function(){  
        if (!isSync || window.frameElement.getAttribute('user_type') == 'tea') {
          let currentPic = SDK.syncData.currentPicIndex;
          if (currentPic < pics.length - 1) {
            $("#pagenext").fadeIn();
          } else {
            $("#pageclose").fadeIn();
          }
          SDK.setEventLock();
        }
      },1000); 
    },
    init: function() {
      this.showPics(); //渲染卡片  
      this.initPage(); //初始化页面其他数据
      this.initCurrent(); //初始化切面状态信息

    }
  }
  page.init();
  
  //断线重连页面恢复
  SDK.recover = function(data) {
    //恢复页签
    let currentPicIndex = data.currentPicIndex;
    $("#pic-0").hide();
    $("#pic-" + currentPicIndex).show();
    $("#picpage").html((currentPicIndex + 1) + "/" + pics.length);
    page.setLRBtn();

    //恢复游戏
    $(".shade").hide(); //倒计时不恢复
    $("#btnstart").hide();
    if (!data.gameStart) { //游戏未开始
      $("#btnstart").show();
    } else {
      //游戏开始，禁止切换卡片
      $(".left").hide();
      $(".right").hide();
      //恢复角色位置
      let rolestep = data.rolestep;
      let left = $(".role").position().left / window.base + rolestep * roleUnitLine;
      $(".role").css({ "left": left + 'rem' });
      //恢复鲨鱼位置
      let fishPosition = window.localStorage.getItem('fishPosition');
      $(".fish").css({ "left": fishPosition + 'rem' });
      if (data.gameOver !== "win" && data.gameOver !== "lose") { //游戏未结束
        if (!isSync || window.frameElement.getAttribute('user_type') == 'tea') {
          $("#btngogo").show();
        }
        page.playGame();
      } else {
        page.gameOver();
      }
    }
    SDK.setEventLock();
  }

  let stuStatus, teaStatus; //检测老师或学生在教室的状态 
  let gamePauseFlag = false; //游戏进程是否暂停标识
  SDK.memberChange = function(message) {
    if (message.role === "stu") {
      stuStatus = message.state;
    }
    if (message.role === "tea") {
      teaStatus = message.state;
    }
    //只要老师没在教室，游戏暂停
    if (teaStatus == "out") { 
      gamePauseFlag = true;
    }
    //上课状态中，学生退出了，游戏暂停
    else if (classStatus == "1" && stuStatus == "out") { 
      gamePauseFlag = true;
    } else { 
      gamePauseFlag = false;
    }  
  }

  $("#btngogo").on("gameOver", function() {
    page.gameOver();
  });

  let leftBtnClick = false;
  $(".left").syncbind("click touchstart", function(dom, next) {
    if (leftBtnClick) {
      return;
    }
    if (dom.is(".disable")) {
      return;
    }
    leftBtnClick = true;
    //修改切面信息 
    SDK.syncData.currentPicIndex--;
    if (!isSync) {
      next(false);
      return
    }
    if (window.frameElement.getAttribute('user_type') == 'tea') {
      next();
    }
  }, function() {
    let currentPic = SDK.syncData.currentPicIndex;
    page.setLRBtn(); //设置左右翻页按钮
    $(`#pic-${currentPic+1}`).hide();
    $(`#pic-${currentPic}`).show();
    $("#picpage").html((currentPic + 1) + "/" + pics.length);
    page.resetGame();

    leftBtnClick = false;
    SDK.setEventLock();
  });


  let rightBtnClick = false;
  $(".right").syncbind("click touchstart", function(dom, next) {
    if (rightBtnClick) {
      return;
    }
    if (dom.is(".disable")) {
      return;
    }
    rightBtnClick = true;
    //修改切面信息 
    SDK.syncData.currentPicIndex++;
    if (!isSync) {
      next(false);
      return
    }
    if (window.frameElement.getAttribute('user_type') == 'tea') {
      next();
    }
  }, function() {
    let currentPic = SDK.syncData.currentPicIndex;
    page.setLRBtn(); //设置左右翻页按钮
    $(`#pic-${currentPic-1}`).hide();
    $(`#pic-${currentPic}`).show();
    $("#picpage").html((currentPic + 1) + "/" + pics.length);
    page.resetGame();

    rightBtnClick = false;
    SDK.setEventLock();
  });

  let gameStartBtn = false;
  $("#btnstart").syncbind("click touchstart", function(dom, next) {
    if (gameStartBtn) {
      return;
    }
    if (gamePauseFlag) {
      page.gamePause();
      //游戏暂停状态（学生端掉线了）
      return;
    }
    gameStartBtn = true;
    //游戏开始，禁止切换卡片
    $(".left").hide();
    $(".right").hide();
    //存储切面信息，游戏开始
    SDK.syncData.gameStart = true;
    if (!isSync) {
      next(false);
      return
    }
    if (window.frameElement.getAttribute('user_type') == 'tea') {
      next();
    }
  }, function() {
    $(this).hide();
    $(".start-page").show();
    countDown(function() {
      $(".start-page").hide();
      if (!isSync || window.frameElement.getAttribute('user_type') == 'tea') {
        $("#btngogo").show();
      }
      page.playGame();
    });
    gameStartBtn = false;
    SDK.setEventLock();
  });

  let gogoBtn = false;
  let clickGogo = 0;
  $("#btngogo").syncbind("click touchstart", function(dom, next) {
    if (gogoBtn) {
      return;
    }
    if (gamePauseFlag) {
      page.gamePause();
      //游戏暂停状态（学生端掉线了）
      return;
    }
    gogoBtn = true;
    //存储切面信息，角色前进步数
    SDK.syncData.rolestep++;
    //存储切面信息，游戏是否结束
    SDK.syncData.gameOver = page.isGameOver();
    if (!isSync) {
      next(false);
      return
    }
    if (window.frameElement.getAttribute('user_type') == 'tea') {
      next();
    }
  }, function() {
    clickGogo++; 
    let left = $(".role").position().left / window.base + roleUnitLine;
    $(".role").animate({ "left": left + 'rem' }, 200, "linear", function() {
      if (SDK.syncData.gameOver === "win" || SDK.syncData.gameOver === "lose") {
        page.gameOver();
      }
      gogoBtn = false;
      SDK.setEventLock();
    });
  });

  let nextBtnClick = false;
  $("#pagenext").syncbind("click touchstart", function(dom, next) {
    if (nextBtnClick) {
      return;
    }
    nextBtnClick = true;
    //存储切面信息，卡片索引
    SDK.syncData.currentPicIndex++;
    if (!isSync) {
      next(false);
      return
    }
    if (window.frameElement.getAttribute('user_type') == 'tea') {
      next();
    }
  }, function() {
    $(this).hide();
    resultHide();
    let currentPic = SDK.syncData.currentPicIndex;
    page.setLRBtn(); //设置左右翻页按钮
    $(`#pic-${currentPic-1}`).hide();
    $(`#pic-${currentPic}`).show();
    $("#picpage").html((currentPic + 1) + "/" + pics.length);
    page.resetGame();

    nextBtnClick = false;
    SDK.setEventLock();
  });

  let closeBtnClick = false;
  $("#pageclose").syncbind("click touchstart", function(dom, next) {
    if (closeBtnClick) {
      return;
    }
    closeBtnClick = true;
    if (!isSync) {
      next(false);
      return
    }
    if (window.frameElement.getAttribute('user_type') == 'tea') {
      next();
    }
  }, function() {
    $(this).hide();
    resultHide();
    page.resetGame();

    closeBtnClick = false;
    SDK.setEventLock();
  });

})