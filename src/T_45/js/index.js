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
  let source = configData.source;

  //填充内容
  const page = {
    showCards: function() {
      let cards = source.cards;
      let html = '';
      for (let i = 0; i < cards.length; i++) {
        html += `<div class="card-container">
        <div class="card" >
          <img src="${cards[i].pic}" />
          <span class="card-btn" answer="${cards[i].text}" data-syncactions="btn-${i}">Take away</span>
        </div>
				<div class="replace"><img src="image/tmp_cards_replace.png" /></div>
				</div>`;
      }
      $(".cards").html(html);
    },
    initThief: function() {
      let thiefs = source.thief;
      if (thiefs.length === 0) {
        thiefs = [{ pic: 'image/thief.png' }];
      }
      let html = `<img class="thief-go" src="${thiefs[0].pic}" />`;
      let effect = source.effect;
      if (!effect.pic) {
        effect.pic = 'image/effect.png';
      }
      html += `<img class="effect" src="${effect.pic}" />`;
      $(".thief").html(html);
    },
    renderPosition: function() {
      let cards = source.cards;
      if (cards.length === 2 || cards.length === 4) {
        $(".card-container").addClass("card-2");
      }
    },
    moveInOut: function(){
      if (!isSync||window.frameElement.getAttribute('user_type') == 'tea') {
        $(".card").hover(function(){
          if(!cardsClick&&!stole){
            $(this).find(".card-btn").show();
          } 
        },function(){
          $(this).find(".card-btn").hide();
        });
      }
    },
    init: function() {
      this.showCards(); //渲染卡片 
      this.renderPosition(); //重新渲染位置
      this.initThief(); //初始化盗贼DOM 
      this.moveInOut();  //初始化移入移出效果
    }
  }
  page.init();

  //老师操作的拖拽条
  $(".alertBox").drag();

  //断线重连恢复结果切面信息 
  SDK.recover = function(data) {
    let index = data.stole;
    //说明有被偷走的
    if (index !== -1) {
      let dom = $("[data-syncactions=" + index + "]").parent();
      //重置
      stole = true;
      dom.next().css("display", "flex");
      dom.css({ width: "0%", height: "0%" });
      $(".thief").css({ top: "0rem", left: "19.2rem" });
      //老师端弹出操作按钮
      if (window.frameElement.getAttribute('user_type') == 'tea') {
        $("#answer").html(dom.attr("answer"));
        $(".alertBox").fadeIn();
      }
    }
    SDK.setEventLock();
  }
 
  let cardsClick = false;
  let stole = false; //是否偷走

  $(".card-btn").on("click touchstart", function(e) {
    if (e.type == "touchstart") {
      e.preventDefault()
    }

    if (stole) {
      //偷走了的话，则不能继续点击
      return;
    }
    $(this).fadeOut();

    if (!cardsClick) {
      cardsClick = true;
      if (!isSync) {
        $(this).trigger('cardClickSync')
        return
      }
      if (window.frameElement.getAttribute('user_type') == 'tea') {
        let index = $(e.currentTarget).data('syncactions');
        //存储结果切面信息
        SDK.syncData.stole = index; //表示被偷走了 
        SDK.bindSyncEvt({
          sendUser: '',
          receiveUser: '',
          index: index,
          eventType: 'click',
          method: 'event',
          syncName: 'cardClickSync'
        });
      }
    }
  })


  var audio = $("#sound")[0];  
  //偷走的动画
  function stoleAnimation(dom, callback) {
    let dWidth = $(window).width() - $("#container").width();
    let dHeight = $(window).height() - $("#container").height();
    let x = dom.offset().left - dWidth / 2;
    let y = dom.offset().top - dHeight / 2;
    let width = dom.width();
    let height = dom.height();
    let thiefLeft = x + (width - $(".thief").width()) / 2;
    let thiefTop = y - $(".thief").height();
    $(".thief").animate({ top: thiefTop, left: thiefLeft }, 1000, function() {
      audio.play();
      $(".effect").fadeIn("fast", function() {
        dom.animate({ width: 0, height: 0 }, 1000, function() {
          dom.next().css({ display: "flex", opacity: 0 });
          dom.next().animate({ opacity: 1 }, 500);
          $(".effect").fadeOut("fast", function() {
            $(".thief").animate({ top: "0rem", left: "19.2rem" }, 1000, function() {
              callback && callback();
            });
            $(".thief-go").animate({ width: "0%" }, 1000);
          });
        });
      });
    });
    $(".thief-go").animate({ width: "100%" }, 1000);
  }

  //还回来的动画效果
  function backAnimation(callback) {
    let thiefs = source.thief;

    let thiefClsName = "thief-go";
    if (thiefs.length > 1) {
      $(".thief-go").attr("src", thiefs[1].pic);
    } else {
      thiefClsName = "thief-back";
      $(".thief-go").removeClass("thief-go").addClass("thief-back");
    }

    let dom;
    $(".replace").each(function() {
      if ($(this).is(":visible")) {
        dom = $(this);
      }
    });
    let dWidth = $(window).width() - $("#container").width();
    let dHeight = $(window).height() - $("#container").height();
    let x = dom.offset().left - dWidth / 2;
    let y = dom.offset().top - dHeight / 2;
    let width = dom.width();
    let height = dom.height();
    let thiefLeft = x + (width - $(".thief").width()) / 2;
    let thiefTop = y - $(".thief").height();
    //隐藏替换图片
    dom.animate({ opacity: 0 }, 500, function() {
      dom.css("display", "none");
    })
    //盗贼飞回来
    $(".thief").animate({ top: thiefTop, left: thiefLeft }, 1000, function() {
      //光效
      audio.play(); 
      $(".effect").fadeIn("fast", function() {
        //吐出卡片
        dom.parent().find(".card").eq(0).animate({ width: "100%", height: "100%" }, 1000, function() {
          $(".effect").fadeOut("fast", function() {
            //盗贼回到初始位置
            $(".thief").animate({ top: "0rem", left: "0rem" }, 1000, function() {
              callback && callback();
            });
            $("." + thiefClsName).animate({ width: "0%" }, 1000, function() {
              if (thiefs.length > 1) {
                $(".thief-go").attr("src", thiefs[0].pic);
              } else {
                $(".thief-back").removeClass("thief-back").addClass("thief-go");
              } 
            });
          });
        });
      });
    });
    $("." + thiefClsName).animate({ width: "100%" }, 1000);
  }

  $('.card-btn').on('cardClickSync', function(e) {
    let _this = $(this);
    let _parent = _this.parent();
    //卡片被偷走
    stole = true;
    //执行动画
    stoleAnimation(_parent, function() {
      //老师端弹出操作按钮
      if (!isSync || window.frameElement.getAttribute('user_type') == 'tea') {
        $("#answer").html(_this.attr("answer"));
        $(".alertBox").fadeIn();
      }
      cardsClick = false;
      SDK.setEventLock();
    });
  });

  //答对了
  $(".correct-btn").on("click touchstart", function(e) {
    if (e.type == "touchstart") {
      e.preventDefault()
    }
    $(".alertBox").fadeOut();
    if (!stole) {
      //没被偷走的话，则不能继续执行
      return;
    }
    if (!isSync) {
      $(this).trigger('correctBtnClickSync')
      return
    }
    if (window.frameElement.getAttribute('user_type') == 'tea') {
      let index = $(e.currentTarget).data('syncactions');
      //存储结果切面信息
      SDK.syncData.stole = -1; //表示没有被偷的
      SDK.bindSyncEvt({
        sendUser: '',
        receiveUser: '',
        index: index,
        eventType: 'click',
        method: 'event',
        syncName: 'correctBtnClickSync'
      });
    }
  })

  $('.correct-btn').on('correctBtnClickSync', function(e) {
    //执行动画
    backAnimation(function() { 
      //卡片被还回来
      stole = false;
      SDK.setEventLock();
    });
  });

  //重置
  $(".reset-btn").on("click touchstart", function(e) {
    if (e.type == "touchstart") {
      e.preventDefault()
    }
    $(".alertBox").hide();
    if (!stole) {
      //没被偷走的话，则不能继续执行
      return;
    }
    if (!isSync) {
      $(this).trigger('resetBtnClickSync')
      return
    }
    if (window.frameElement.getAttribute('user_type') == 'tea') {
      let index = $(e.currentTarget).data('syncactions');
      //存储结果切面信息
      SDK.syncData.stole = -1; //表示没有被偷的
      SDK.bindSyncEvt({
        sendUser: '',
        receiveUser: '',
        index: index,
        eventType: 'click',
        method: 'event',
        syncName: 'resetBtnClickSync'
      });
    }
  })

  $('.reset-btn').on('resetBtnClickSync', function(e) {
    //重置
    stole = false;
    let dom;
    $(".replace").each(function() {
      if ($(this).is(":visible")) {
        dom = $(this);
      }
    });
    dom.css("display", "none");
    dom.parent().find(".card").eq(0).css({ width: "100%", height: "100%" });
    $(".thief").css({ top: "0rem", left: "0rem" });
    SDK.setEventLock();
  });
})