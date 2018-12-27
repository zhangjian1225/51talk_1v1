var teacher = function(option) {

  let stepDelay = 1000; //执行步骤间歇 默认1秒

  if (option && option.stepDelay) {
    stepDelay = option.stepDelay;
  }

  //初始化教学环境
  let init = function() {
    //遮罩层
    let shade = `<div id="teachshade" 
      style="position: absolute;top:0px;left:0px;bottom:0px;right:0px;
       z-index:8000; background: #000000; opacity:0.8;display:none;">
       </div>`;
    $(".main").append(shade);

    //禁用层
    let disable =  `<div id="teachdisable" 
    style="position: absolute;top:0px;left:0px;bottom:0px;right:0px;
     z-index:9000; background: #000000; opacity:0;display:none;">
     </div>`;
     $(".main").append(disable);

    //手型图
    let hand = `<img id="teachhand" src="image/hand.png" style="position:absolute;width:1rem;height:1rem;z-index:8002;display:none;" />`;
    $(".main").append(hand);

    //提示语
    let message = `<div id="teachdesc" 
    style="position:absolute;color:#fff;font-size:.3rem;z-index:8002;
    width:4rem;text-align:center;vertical-align:middle;
    border:solid 2px #fff;padding:.3rem; 
    display:none;"></div>`;
    $(".main").append(message);
  }
  init();

  /**
   * 显示手型
   * @param {*} type 类型，现在有click,drag
   * @param {*} count 动画次数 
   * @param {*} option 其他参数
   */
  let showHand = function(type, count, option) {
    let dom = $("#teachhand");
    //点击操作的手型示意，option需要提供x,y两个属性，代表显示的位置,都需要带rem
    if (type === 'click') {
      let x = option.x,
        y = option.y,
        downx = (parseFloat(option.x.replace("rem", "")) - 0.1) + "rem",
        downy = (parseFloat(option.y.replace("rem", "")) - 0.1) + "rem";
      dom.css({ left: x, top: y }).show();
      let clickHand = function(callback) {
          dom.animate({ left: downx, top: downy }, 500, function() {
            dom.animate({ left: x, top: y }, 500, function() {
              if (count > 0) {
                count--;
                clickHand(callback);
              } else {
                callback();
              }
            })
          });
        }
        //抖动count次
      if (count > 0) {
        count--;
        clickHand(function() {
          option.callback && option.callback();
        });
      }
    } else if (type === "drag") {
      //拖拽操作的手型示意，option需要提供x1,y1,x2,y2两个属性，代表起始位置与结束位置,都需要带rem
      let x1 = option.x1,
        y1 = option.y1,
        x2 = option.x2,
        y2 = option.y2;
      dom.css({ left: x1, top: y1 }).show();
      let moveHand = function(callback) {
          dom.animate({ left: x2, top: y2 }, 1000, function() {
            dom.css({ left: x1, top: y1 });
            if (count > 0) {
              count--;
              moveHand(callback);
            } else {
              callback();
            }
          });
        }
        //移动count次
      if (count > 0) {
        count--;
        moveHand(function() {
          option.callback && option.callback();
        });
      }
    } else {
      //其他效果
    }
  }

  let hideHand = function() {
    $("#teachhand").hide();
  }

  let showDesc = function(index, obj) {
    let teachDom = $("#teachdesc");
    let desc = obj.desc;
    teachDom.html((index + 1) + "、" + desc);
    let dom = getDom(obj);
    let pos_x = dom.offset().left / window.base;
    let pos_y = dom.offset().top / window.base;
    let dom_w = dom.width() / window.base;
    let dom_h = dom.height() / window.base;
    let cssObj = {
      top: (pos_y + dom_h) + "rem",
      left: (pos_x + dom_w) + "rem",
      bottom: "auto",
      right: "auto"
    }
    if (pos_x > 9.60) {
      cssObj.right = (19.2 - pos_x) + "rem";
      cssObj.left = "auto";
    }
    if (pos_y > 5.4) {
      cssObj.bottom = (10.8 - pos_y) + "rem";
      cssObj.top = "auto";
    }
    teachDom.css(cssObj).fadeIn();
  }

  let hideDesc = function() {
    $("#teachdesc").fadeOut();
  }

  let endModel = function(text){
    $("#teachshade").css({"z-index":8002,opacity:0.8}).fadeIn(); 
    $("#teachdesc").css({top:"4.5rem",hieght:"1.8rem",left:"8rem",width:"3.2rem"}).html(
      `<p>${text}<p><p><a href="javascript:window.location.reload()">再试一次</a></p>`
    ); 
    $("#teachdesc").fadeIn();
  }

  /**
   * 同步执行 (会产生阻塞，但是按顺序遍历)
   * @param items 要遍历的数组
   * @param func 有回调的业务逻辑函数，此函数会传入三个参数
   *         i:当前位置，item: items[i] , next:执行下一条
   * @param callback  遍历完数组之后执行的函数逻辑
   */
  let syncEach = function(items, func, callback) {
    var i, next;
    i = -1;
    next = function() {
      if (++i >= items.length) {
        callback && callback(items);
      } else {
        var item = items[i];
        func(i, item, next);
      }
    };
    next();
  };

  /**
   * 异步执行 （不会产生阻塞，但是会产生不按顺序遍历执行回调产生的逻辑混乱）
   * @param items 要遍历的数组
   * @param func 有回调的业务逻辑函数，此函数会传入三个参数
   *         i:当前位置，item: items[i] , flag:回调判断函数，当所有item的回调都执行完则调用callback
   * @param callback 遍历完数组之后执行的函数逻辑
   */
  let asynEach = function(items, func, callback) {
    var x, flag;
    x = 0;
    flag = function() {
      x++;
      if (x == items.length) {
        callback && callback(items);
      }
    };
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      func(i, item, flag);
    }
    if (items.length == 0) {
      callback && callback(items);
    }
  };

  /**
   * 根据坐标获取对象,JS原生对象
   * @param {*} x left
   * @param {*} y top
   */
  let getDom = function(obj) {
    let dom = null;
    if (obj.id) {
      dom = $("#" + obj.id);
    } else {
      let _x = parseFloat(obj.winX.replace("rem", ""));
      let _y = parseFloat(obj.winY.replace("rem", ""));
      if($("#teachshade").is(":hidden")){
        let _dom = document.elementFromPoint(_x * window.base, _y * window.base);
        dom = $(_dom);
      }else{
        $("#teachshade").hide(); 
        let _dom = document.elementFromPoint(_x * window.base, _y * window.base);
        dom = $(_dom);
        $("#teachshade").show();
      } 
    }
    return dom;
  }

  //播放步骤
  let playStep = function(index, obj, callback) {
    let dom = getDom(obj);
    let eventType = obj.eventType;
    $("#teachshade").animate({ "opacity": 0.8 }, 500, function() {
      dom.css("z-index", 8001);
      showDesc(index, obj);
      // $("#desc").text((index+1)+"、" + obj.desc).animate({ "opacity": 1 }, 100);
      setTimeout(function() {
        hideDesc();
        $("#teachshade").animate({ "opacity": 0 }, 500, function() {
          if (eventType === 'click') {
            showHand('click', 2, {
              x: obj.winX,
              y: obj.winY,
              callback: function() {
                dom.click();
                hideHand();
              }
            });
          }else if(eventType === 'drag'){
            showHand('drag', 2, {
              x1: obj.winX,
              y1: obj.winY,
              x2: obj.dragEnd.winX,
              y2: obj.dragEnd.winY,
              callback: function() {
                // dom.click();
                //鼠标模拟拖拽 todoList
                hideHand();
              }
            });
          }else{
            //其他效果
          }
          setTimeout(function() {
            callback && callback();
          }, stepDelay);
        });
      }, obj.intervalTime || 3000);
    });
  }

  //禁止页面所有操作
  let disableAllOperate = function(){
    $("#teachdisable").show();
  }
  //解除禁止
  let clearDisable = function(){
    $("#teachdisable").hide();
  }


  //每一步操作的正确/错误标识
  let stepFlag = true;
  //半引导播放
  let teachStep = function(index, obj, callback) {
    if(!stepFlag){
      obj.desc = obj.errDesc||"错误！请按提示操作";;
    }
    //禁止操作
    disableAllOperate();
    let dom = getDom(obj);
    let eventType = obj.eventType;
    $("#teachshade").animate({ "opacity": 0.8 }, 300, function() {
      dom.css("z-index", 8001);
      showDesc(index, obj);
      if(eventType === 'click'){
        showHand('click', 3, { x: obj.winX, y: obj.winY });
      }else if(eventType === 'drag'){
        if(stepFlag){
          showHand('drag', 3, { x1: obj.winX, y1: obj.winY ,x2:obj.dragEnd.winX,y2:obj.dragEnd.winY});
        }else{
          showHand('click', 3, { x: obj.dragEnd.winX, y: obj.dragEnd.winY });
        }
        
      }else{
        //其他的效果
      }
      
      // $("#desc").text((index+1)+"、" + obj.desc).animate({ "opacity": 1 }, 100);
      setTimeout(function() {
        hideDesc();
        hideHand();
        $("#teachshade").animate({ "opacity": 0 }, 500, function() {
          if (eventType === 'click') {
            dom.bind('click', function(e) {
              e.stopPropagation(); //阻止冒泡
              $("#teachshade").unbind('click');
              setTimeout(function() {
                callback && callback(true);
              }, stepDelay);
            });
            $("#teachshade").bind('click', function() {
              $("#teachshade").unbind('click');
              callback && callback(false);
            });
          }else if(eventType === 'drag'){
            $("#teachshade").mouseup(function() {
              $("#teachshade").off('mouseup');
              callback && callback(isInArea(dom,obj));
            });
          }else{
            //其他的行为
          }
          clearDisable();
        });
      }, obj.intervalTime || 3000);
    });
  }

  //判断是否在终点区域
  let isInArea = function(dom,obj){
    let top = dom.offset().top / window.base;
    let left = dom.offset().left / window.base;
    let area = obj.dragEnd.examineArea;
    if (area) { //有拖拽考核区域
      if (left > area[0] && left < area[2] && top > area[1] && top < area[3]) {
        return true; 
      } else {
        return false; 
      }
    } else { //无拖拽考核区域
      let docX = parseFloat(obj.dragEnd.docX.replace("rem", ""));
      let docY = parseFloat(obj.dragEnd.docY.replace("rem", "")); 
      //留1rem的误差
      if (left > (docX - 1) && left < (docX + 1) && top > (docY - 1) && top < (docY + 1)) {
        return true; 
      } else {
        return false; 
      }
    }
  }

  let examineDatas = [],//设置考试的对象
    examineSeq = false, //顺序标识
    inspect = true; //全局判断对错

  //装饰DOM
  let decorateDom = function(obj, index) {
    let eventType = obj.eventType;
    let dom = getDom(obj);
    //不按照顺序考核
    if (examineSeq === false) {
      if (eventType === 'click') {
        dom = getDom(obj);
        dom.attr("examine-num", index);
        dom.bind('click', function() {
          examineDatas[index] = true;
        });
      } else if (eventType === 'drag') {
        dom.mouseup(function() {
          examineDatas[index] = isInArea(dom,obj); 
        }); 
      }
    } else {
      //按顺序考核
      if (eventType === 'click') { 
        dom.attr("examine-num", index);
        dom.bind('click', function() {
          let flag = true;
          for(let i=0;i<index;i++){
            if(examineDatas[i]!==true){
              inspect=false;
              return;
            }
          }
          examineDatas[index] = true;
        });
      } else if (eventType === 'drag') {
        dom.mouseup(function() {
          let flag = true;
          for(let i=0;i<index;i++){
            if(examineDatas[i]!==true){
              inspect=false;
              return;
            }
          }
          examineDatas[index] = isInArea(dom,obj);  
        }); 
      }
    }
  }


  let inspectExamine = function() { 
    for (let i = 0; i < examineDatas.length; i++) {
      let data = examineDatas[i];
      if (data !== true) {
        return false;
      }
    }
    return true;
  }

  let resObj = {
    autoPlay: function(datas, callback) {
      //自动播放环节，不允许用户点击
      $("#teachshade").css("opacity", 0).show();
      syncEach(datas, function(i, data, next) {
        playStep(i, data, next);
      }, function() {
        callback && callback();
      });
    },
    guidePlay: function(datas, callback) {
      //引导播放环节
      $("#teachshade").css("opacity", 0).show();
      syncEach(datas, function(i, data, next) {
        let step = function(index, item, callback) {
          teachStep(index, item, function(flag) {
            if (flag) {
              stepFlag = true;  //步骤正确
              callback();
            } else {
              stepFlag = false;  //步骤错误 
              step(index, item, callback);
            }
          });
        }
        step(i, data, function() {
          next();
        });
      }, function() { 
        callback&&callback();
      });
    },

    //选取一块区域，用于录制拖拽行为的终点设置工具
    selectArea: function(callback){
      $(document).mousedown(function(e){
        var posx = e.pageX;
        var posy = e.pageY;
        var div = `<div style="position:absolute;left:${posx}px;top:${posy}px;z-index:8000";
        border: 1px dashed blue;background: #5a72f8;opacity: 0.1;width: 0;height: 0;></div>`;
        var dom = $(div);
        $(this).append(dom);
        $(this).mouseover(function(ev){
          dom.css({
            left: Math.min(ev.pageX, posx) + "px",
            top: Math.min(ev.pageY, posy) + "px",
            width: Math.abs(posx - ev.pageX) + "px",
            height: Math.abs(posy - ev.pageY) + "px"
          }); 
        });
        $(this).mouseup(function(eu){
          dom.remove(); 
          $(this).off(); 
          callback&&callback([posx/window.base,posy/window.base,eu.pageX/window.base,eu.pageY/window.base]);
        });
      }); 
    },

    //暴露一个功能窗口
    endModel: endModel,

    examine: function(datas, seq, time, callback) {
      //考试环节
      examineSeq = seq;
      //存储考点
      for (let i = 0; i < datas.length; i++) {
        let data = datas[i];
        if (data.examine) {
          examineDatas.push(data);
        }
        decorateDom(data,i);
      } 

      //考试总时长
      let tmout = setTimeout(function() {
        //如果全局直接判断为错，则不需要验证各项
        if(!inspect){
          clearInterval(intval);
          clearTimeout(tmout);
          callback && callback(false);
          return;
        }
        let flag = inspectExamine(); //最后查验结果
        clearInterval(intval);
        clearTimeout(tmout);
        callback && callback(flag);
      }, time);

      let intval = setInterval(function() {
        //如果全局直接判断为错，则不需要验证各项
        if(!inspect){
          clearInterval(intval);
          clearTimeout(tmout);
          callback && callback(false);
          return;
        }
        let flag = inspectExamine(); //五秒一查验结果
        if (flag) {
          clearInterval(intval);
          clearTimeout(tmout);
          callback && callback(true);
        }
      }, 5000);

    }

  };

  return resObj;
}