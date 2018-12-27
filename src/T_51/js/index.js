"use strict"
import '../../common/js/common_1v1.js'
import '../../common/js/drag.js'

$(function() {
  window.h5Template = {
    hasPractice: '0'
  }
  let h5SyncActions = parent.window.h5SyncActions;
  const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;

  //图片大小尺寸判断
  function contrImgSize(dom) {
    var thisImg = dom,
      imgWidth = thisImg.get(0).naturalWidth / 100,
      imgHeight = thisImg.get(0).naturalHeight / 100,
      containerScale = imgWidth / imgHeight; //容器的宽高比
    if (containerScale < 1) { //瘦高型
      let _width = 2.9*imgWidth/imgHeight;
      thisImg.css({
        height: '2.9rem',
        width: _width+'rem'
      });
      thisImg.data("size", { width: _width+'rem', height: "2.9rem" });
      thisImg.parent().attr("data-initw", imgWidth); //记录图片本身尺寸，用于拖动后父容器重新调整大小
      thisImg.parent().attr("data-inith", imgHeight);
    } else { //胖矮型
      let _height = 2.9*imgHeight/imgWidth;
      thisImg.css({
        width: '2.9rem',
        height: _height+'rem'
      });
      thisImg.data("size", { width: '2.9rem', height: _height+'rem' });
      thisImg.parent().attr("data-initw", imgWidth); //记录图片本身尺寸，用于拖动后父容器重新调整大小
      thisImg.parent().attr("data-inith", imgHeight);
    }
  }


  //判断是否收入近图片选择框里
  function inPicBox(dom) { 
    let res = false;
    if (SDK.syncData.picStatus === "open") {
      let lt = $('.img-background').position().left,
        rt = lt + $('.img-background').width(),
        tl = $('.img-background').position().top,
        bl = tl + $('.img-background').height();
      let mashLeft = parseFloat(dom.attr('data-left')) * window.base,
        mashTop = parseFloat(dom.attr('data-top')) * window.base, 
        mashW = dom.width(),
        mashH = dom.height(),
        center = [mashLeft + mashW / 2, mashTop + mashH / 2]; //拖拽对象的中心点  
        // $("#test").css({left:center[0],top:center[1]});
      if (center[0] > lt && center[0] < rt && center[1] > tl && center[1] < bl) { 
        res = true;
      }
    } 
    return res;
  }

  //业务逻辑 
  let source = configData.source;
  let pics = source.pics;
  //填充内容
  const page = {
    showPics: function() {
      let html = '';
      for (let i = 0; i < pics.length; i++) {
        html += `<div class="pic-${i} drag" isrole="0" data-syncactions="pic-${i}"><img src="${pics[i].pic}" /></div>`;
      }
      $(".img-container").append(html);
      //图片布局，根据宽高进行适配
      $(".drag img").on("load", function() {
        contrImgSize($(this));
      });
    },
    init: function() {
      this.showPics(); //渲染卡片
    }
  }
  page.init();

  //老师操作的拖拽条
  $(".alertBox").drag();

  //断线重连方法
  SDK.recover = function(data) {
    let num = 0;
    for(let key in data){
      if(key!=='picStatus'){
        num++;
        let val = data[key];
        let dom = $(`[data-syncactions="${key}"]`);
        let initW = parseFloat(dom.data("initw"));
        let initH = parseFloat(dom.data("inith"));  
        let top = parseFloat(val.top);
        let left = parseFloat(val.left); 
        if(top+initH>10.8){ //超过了窗口下边界
          top = 10.8-initH;
        }
        if(left+initW>19.2){ //超过了窗口右边界
          left = 19.2-initW;
        } 
        dom.css({
          'width': initW + 'rem',
          'height': initH + 'rem',
          'left':left + 'rem',
          'top': top + 'rem',
          'z-index': 199
        }).attr("isrole", "1");
        dom.find('img').css({ 'width': '100%', 'height': '100%' });
      }
    } 
    if (data.picStatus === "close") {
      $("[isrole='0']").hide();
      $(".img-background").css({ left: "-6rem" })
      $(".ring img").css({ transform: "rotate(180deg)", "-webkit-transform": "rotate(180deg)" });
    }
    if (!isSync || window.frameElement.getAttribute('user_type') == 'tea') { 
      if (num === 2) {
        $(".alertBox").fadeIn();
      } else {
        $(".alertBox").fadeOut();
      }
    }

    SDK.setEventLock();
  }

  let runBtnClick = false;
  SDK.syncData.picStatus = "open"; //图片选择框默认是打开的
  $(".ring").syncbind("click touchstart", function(dom, next) {
    if (runBtnClick) {
      return;
    }
    runBtnClick = true;

    //存储结果切面信息
    SDK.syncData.picStatus = SDK.syncData.picStatus === "open" ? "close" : "open";

    if (!isSync) {
      next(false);
      return
    }
    if (window.frameElement.getAttribute('user_type') == 'tea') {
      next();
    }else{
      next(false);
    }
  }, function() {
    //打开面板
    if (SDK.syncData.picStatus === "open") {
      $(".img-background").animate({ left: "0rem" }, 200, function() {
        $("[isrole='0']").fadeIn();
        $(".ring img").css({ transform: "rotate(0deg)", "-webkit-transform": "rotate(0deg)" });
        runBtnClick = false;
        SDK.setEventLock();
      });
    } else { //关闭面板
      $("[isrole='0']").fadeOut(200);
      setTimeout(function() {
        $(".img-background").animate({ left: "-6rem" }, 500, function() {
          $(".ring img").css({ transform: "rotate(180deg)", "-webkit-transform": "rotate(180deg)" });
          runBtnClick = false;
          SDK.setEventLock();
        });
      }, 200);
    }
  });

  //添加拖拽
  $('.drag').drag({
    before: function(e) {
      $(this).css({ "z-index": 202 });
      // $(this).css({ 
      //   "z-index": 202,
      //   'width': '2.9rem',
      //   'height': '2.9rem' 
      // });
      // var _img = $(this).find('img');
      // var _originSize = _img.data('size');
      // _img.css({
      //   'width': _originSize.width,
      //   'height': _originSize.height
      // })
    },
    process: function(e) {},
    end: function(e) {
      let _this = $(this);
      if(!_this.attr('data-left')){
        //没有这个属性说明没有被拖拽
        return;
      }
      let roles = $("[isrole='1']");
      if (roles.length == 2 && _this.attr("isrole") !== '1') {
        //页面最多允许两个角色
        _this.resetStart();
        return;
      }

      //存储切面状态
      let index = _this.data('syncactions');
      if (inPicBox(_this)) {
        SDK.syncData[index] = null;
        delete SDK.syncData[index];
      } else {
        SDK.syncData[index] = {
          left: _this.attr('data-left'),
          top: _this.attr('data-top')
        };
      }

      if (!isSync) {
        _this.trigger('syncDragEnd', {
          left: _this.attr('data-left'),
          top: _this.attr('data-top'),
          pageX: '',
          pageY: '',
        })
        return
      }
      if (window.frameElement.getAttribute('user_type') == 'tea') {
        SDK.bindSyncEvt({
          index: index,
          eventType: 'dragEnd',
          method: 'drag',
          left: _this.attr('data-left'),
          top: _this.attr('data-top'),
          pageX: '',
          pageY: '',
          syncName: 'syncDragEnd',
        })
      }else{
        _this.trigger('syncDragEnd', {
          left: _this.attr('data-left'),
          top: _this.attr('data-top'),
          pageX: '',
          pageY: '',
        })
      }
    }
  })


  $('.drag').on("syncDragEnd", function(e, pos) {
    let index = $(this).data('syncactions');
    if (SDK.syncData[index]) {
      let initW = parseFloat($(this).data("initw"));
      let initH = parseFloat($(this).data("inith"));  
      let top = parseFloat(pos.top);
      let left = parseFloat(pos.left); 
      if(top+initH>10.8){ //超过了窗口下边界
        top = 10.8-initH;
      }
      if(left+initW>19.2){ //超过了窗口右边界
        left = 19.2-initW;
      } 
      $(this).css({
        'width': initW + 'rem',
        'height': initH + 'rem',
        'left': left + 'rem',
        'top': top + 'rem',
        'z-index': 199
      }).attr("isrole", "1");
      $(this).find('img').css({ 'width': '100%', 'height': '100%' });
    } else {
      $(this).resetStart();
    }

    if (!isSync || window.frameElement.getAttribute('user_type') == 'tea') {
      let roles = $("[isrole='1']");
      if (roles.length === 2) {
        $(".alertBox").fadeIn();
      } else {
        $(".alertBox").fadeOut();
      }
    }

    SDK.setEventLock();
  });

  let switchBtnClick = false;
  $(".correct-btn").syncbind('click touchstart', function(dom, next) {
    if (switchBtnClick) {
      return;
    }
    switchBtnClick = true;

    //存储结果切面信息(交换两个角色位置)  
    let change = null;
    let changeKey = null;
    for (let key in SDK.syncData) {
      if (key !== 'picStatus') {
        let val = SDK.syncData[key];
        if (change !== null) {
          SDK.syncData[changeKey] = val;
          SDK.syncData[key] = change;
        } else {
          change = { top: val.top, left: val.left };
          changeKey = key;
        }
      }
    }
    if (!isSync) {
      next(false);
      return
    }
    if (window.frameElement.getAttribute('user_type') == 'tea') {
      next();
    }
  }, function() {
    let i=0;
    for (let key in SDK.syncData) {
      if (key !== 'picStatus') { 
        let val = SDK.syncData[key];
        let dom = $(`[data-syncactions='${key}']`);
        let initW = parseFloat(dom.data("initw"));
        let initH = parseFloat(dom.data("inith"));  
        let top = parseFloat(val.top);
        let left = parseFloat(val.left); 
        if(top+initH>10.8){ //超过了窗口下边界
          top = 10.8-initH;
        }
        if(left+initW>19.2){ //超过了窗口右边界
          left = 19.2-initW;
        } 
        dom.animate({
          'left': left + 'rem',
          'top': top + 'rem'
        }, 300,function(){
          i++;
          if(i===2){
            switchBtnClick = false;
          }
        });
      }
    } 
    SDK.setEventLock();
  });


})


jQuery.fn.extend({
  resetStart: function(size) {
    var thisObj = this;
    //sync
    var startPos = $(this).data('startPos');
    var $left = startPos.left;
    var $top = startPos.top;
    thisObj.css({
      'position': 'absolute',
      'left': $left,
      'top': $top,
      'width': '2.9rem',
      'height': '2.9rem',
      'z-index': 202
    }).attr("isrole", "0");
    var _img = thisObj.find('img');
    var _originSize = _img.data('size');
    _img.css({
      'width': _originSize.width,
      'height': _originSize.height
    })
  }
});