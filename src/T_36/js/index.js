"use strict"
import '../../common/js/common_1v1.js'
import './drag.js'
import '../record/js/record.js'

$(function() {
  window.h5Template = {
    hasPractice: '1'
  }
  let h5SyncActions = parent.window.h5SyncActions;
  const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;


  let courseStatus
  let options = configData.source.options;
  let staticData = configData.source;
  let answePos = []; //答案区的盒子位置
  let answeCenterPos = [] //答案区盒子的中心位置
  let currentPage = 1; //当前内容页码
  let answerArr = [] //存储交互中关键的数据
  let chooseArr = [] //提交后已选中的答案
  let noChooseArr = [] //提交后未选中的答案
  let targetCardPos = []
  let dragPos = [] //记录哪个盒子有卡片

  //数据筛选 正确卡片
  function filterData(index, obj, name) {
    let wordsArr = [];
    for (let i = 0; i < options[index][obj].length; i++) {
      wordsArr.push(options[index][obj][i][name])
    }
    return wordsArr
  }
  //数据筛选 合并干扰卡片
  function spellWords(index) {
    let totalWords = filterData(index, 'letter', 'words')
    for (let i = 0; i < filterData(index, 'wrongLetter', 'interfere').length; i++) {
      if (filterData(index, 'wrongLetter', 'interfere')[i] != '') {
        totalWords.push(filterData(index, 'wrongLetter', 'interfere')[i])
      }
    }
    //打乱顺序
    totalWords = reSort(totalWords, parseInt(options[index].random * totalWords.length))
    totalWords.splice(1, 0, totalWords.shift());
    totalWords.splice(1, 0, totalWords.pop());
    return totalWords
  }

  //渲染第一组卡片
  function showPage(index) {
    $(".section").html('') //每次添加先得置空前面的单词
    let words,
      interfere,
      html1 = '',
      html2 = '',
      html3 = '',
      html4 = '';
    answerArr = []
    words = spellWords(index);
    for (let j = 0; j < words.length; j++) {
      html1 += `<li class="${'index'+j} card cardOptions" data-syncactions="card${j}">${words[j]}<div class="bling"></div></li>`
    }
    html1 = html1
    for (let k = 0; k < options[index].letter.length; k++) {
      html2 += `<div class="${'list'+k} list listOptions" data-syncactions="list${k}"></div>`
      answerArr.push('')
    }
    html2 = html2
    html3 = `<div class="showAns hide">${options[index].words}</div>`
    if (options[index].audio) {
      html4 = `<div class="audioList" data-syncactions="audioBtn">
						<img src="image/btn-audio.png" />
						<audio class="audioSrc" webkit-playsinline controls src="${options[index].audio}"></audio>
					</div>`
    }
    let html = `<div class="page page${index}">` + '<ul class="wordsArea">' + html1 + '</ul>' + '<div class="answer">' + html2 + html4 + `<span class="submit submit${index}" data_index="${index}" data-syncactions="submit">dsdd</span></div>` + html3 + `</div>`
    $('.section').append(html)

    //老师端屏蔽提交按钮
    if (isSync&&window.frameElement.getAttribute('user_type') == 'tea') {
      $(".submit ").css({ opacity: 0 });
    }
    dragFun() //存储事件   相当于事件代理机制
      //添加录音
    recordEvents.createRcordBtn(options)
    recordEvents.isShowRecord(options[currentPage - 1].recordStatus)
  }

  function setPageData(index) {
    //answerArr.push("") //切换题目初始化答案数据
    //所有的卡片总宽度
    let totalLength = spellWords(index).length * (2.52 + 0.4) - 0.4
    let paddingDistance = (19.2 - totalLength) / 2 //卡片盒子边缘的宽度
      //初始化卡片的位置
    let parents = $(".page" + index)
    for (let k = 0; k < spellWords(index).length; k++) {
      parents.find(".card").eq(k).css({
        'left': paddingDistance + 2.92 * k + 'rem',
        'top': '2.48rem'
      })
      parents.find(".card").eq(k).attr('data_left', paddingDistance + 2.92 * k)
      parents.find(".card").eq(k).attr('data_top', 2.48)
    }
    for (let n = 0; n < options[index].letter.length - 1; n++) {
      parents.find('.list').eq(n).css({
        'margin-right': '0.28rem'
      })
    }
  }

  function getAnsBoxPos() {
    answePos = []
    answeCenterPos = []

    $(".list").each(function(i, arr) {
        let L = $(arr).offset().left - $('.container').offset().left
        let T = $(arr).offset().top - $('.container').offset().top
        answePos.push({
          left: L / window.base,
          top: T / window.base
        })
        answeCenterPos.push({
          centerL: L / window.base + 1.4,
          centerT: T / window.base + 1.4
        })
      })
      //console.log(answePos, answeCenterPos, 'llllll')
  }
  //存储初始化位置
  function getStartPos() {
    targetCardPos = []
    let lis = $(".wordsArea .card")
    for (let i = 0; i < lis.length; i++) {
      targetCardPos.push({
        left: ($(".card").eq(i).offset().left - $(".container").offset().left) / window.base,
        top: ($(".card").eq(i).offset().top - $(".container").offset().top) / window.base
      })
    }
  }


  // 填充内容
  const page = { 
    showWords: function() {
      showPage(currentPage - 1)
    },
    getPos: function() {
      setPageData(currentPage - 1)
      getStartPos()
      if (options.length < 2) {
        $(".btn").css({ 'display': 'none' })
      }
    },
    init: function() {
      this.showWords() //渲染卡片和答案去
      this.getPos() //存储答案区格子的位置
      getAnsBoxPos()
    }
  }
  page.init()

  //拖拽卡片
  let that //拖拽中的卡片
  let disX = 0;
  let disY = 0;
  let allowDrag = true //是否允许拖拽

  function dragFun() {
    if (!isSync||window.frameElement.getAttribute('user_type') == 'stu') {
      $('.cardOptions').drag({
        before: function() {
          $(this).css({
            "z-index": '200',
            width: '2.52rem',
            height: '2.46rem',
            'line-height': '2.7rem'
          })
        },
        process: function() {
          $(this).css({
            "z-index": '200',
            width: '2.1rem',
            height: '2.05rem',
            'line-height': '2.3rem'
          })
        },
        end: function() {
          let that = $(this),
            runIntoNum = 0,
            whichBox;

          let t1 = that.offset().top / window.base,
            l1 = that.offset().left / window.base,
            r1 = (that.offset().left + that.width()) / window.base,
            b1 = (that.offset().top + that.height()) / window.base;
          for (let i = 0; i < $(".list").length; i++) {
            let t2 = $(".list").eq(i).offset().top / window.base,
              l2 = $(".list").eq(i).offset().left / window.base,
              r2 = ($(".list").eq(i).offset().left + $(".list").eq(i).width()) / window.base,
              b2 = ($(".list").eq(i).offset().top + $(".list").eq(i).height()) / window.base;
            if (b1 < t2 || l1 > r2 || t1 > b2 || r1 < l2) { // 表示没碰上  

            } else {
              runIntoNum++
              if (runIntoNum < 2) {
                whichBox = i;
              }
            }
          }
          if (!isSync) {
            $(this).trigger('syncDragEnd', {
              runIntoNum: runIntoNum,
              whichBox: whichBox
            })
            return
          }
          if (window.frameElement.getAttribute('user_type') == 'stu') {
            SDK.bindSyncEvt({
              index: $(this).data('syncactions'),
              eventType: 'dragEnd',
              method: 'drag',
              left: $(this).data('startPos').left,
              top: $(this).data('startPos').top,
              pageX: '',
              pageY: '',
              syncName: 'syncDragEnd',
              otherInfor: {
                currentPage: currentPage,
                chooseArr: chooseArr,
                answerArr: answerArr,
                noChooseArr: noChooseArr,
                runIntoNum: runIntoNum,
                whichBox: whichBox
              }
            }) 
          }
        }
      })
    }
  }

  $('.section').on('syncDragEnd', '.cardOptions', function(e, message) {
    //console.log(answerArr, 'youlaile')
    let runIntoNum
    let whichBox
    let that = $(this)
    if (!isSync) {
      runIntoNum = message.runIntoNum
      whichBox = message.whichBox
    } else {
      //线上拖拽不做拖拽状态恢复，只做当前页面恢复
      let obj = message.otherInfor;
      runIntoNum = obj.runIntoNum
      whichBox = obj.whichBox
      if (message == undefined || message.operate == 1) {

      } else {
        //直接恢复页面
        showPage(obj.currentPage - 1)
        setPageData(obj.currentPage - 1)
          //恢复拖拽状态
        rebackPage(obj, 'drag')
        answerArr = obj.answerArr
        chooseArr = obj.chooseArr
        return
      }
    }
    //console.log(runIntoNum, '碰撞次数', whichBox, '那个盒子')
    if (runIntoNum >= 2 || runIntoNum == 0) {
      //判定为不在盒子内
      goBackPos(that)
    } else {
      if ($(".list").eq(whichBox).hasClass('noDrag')) {
        //置空原有答案数组对应的内容
        goBackPos(that) // 盒子中已有卡片
      } else {
        //放入目标盒子
        if (that.hasClass('draged')) {
          toNewPos(that, whichBox, 1) //$(this)目标卡片  wihichBox目标盒子下标 1 表示状态  初始位置
        } else {
          toNewPos(that, whichBox, 2) //$(this)目标卡片  wihichBox目标盒子下标 2 表示状态  格子中间
        }
      }
    }
  })

  function goBackPos(obj) {
    let ansBoxIndex = $(".card").eq(obj.index()).attr('data_index');
    // console.log("aa++",ansBoxIndex)
    if (!!ansBoxIndex) {
      $(".list").eq(ansBoxIndex - 1).removeClass('noDrag')
    }

    $(".card").eq(obj.index()).css({
      left: targetCardPos[obj.index()].left + "rem",
      top: targetCardPos[obj.index()].top + "rem",
      'z-index': 100,
      'line-height': '2.85rem',
      width: '2.52rem',
      height: '2.46rem'
    }).removeClass("draged").attr("data_index", '')

    breakAns(obj, '')
  }
  //放入目标盒子
  function toNewPos(obj, ansIndex, status) {
    //console.log("放入目标盒子了", status)
    //获取目标盒子当前的位置
    let t = ($(".list").eq(ansIndex).offset().top - $(".container").offset().top) / window.base;
    let l = ($(".list").eq(ansIndex).offset().left - $(".container").offset().left) / window.base;
    let card = $('.card').eq(obj.index())
    let ansBoxIndex = $(".card").eq(obj.index()).attr('data_index');

    if (!!ansBoxIndex) {
      $(".list").eq(ansBoxIndex - 1).removeClass('noDrag')
    }

    $(".card").eq(obj.index()).css({
      width: '2.8rem',
      height: '2.74rem',
      left: l + "rem",
      top: t + "rem",
      'z-index': 100,
      'line-height': '3.15rem'
    }).addClass("draged").attr("data_index", ansIndex + 1)

    $(".list").eq(ansIndex).addClass('noDrag')
    breakAns(obj, status)
  }
  //存储答案
  function breakAns(obj, status) {
    if (status == 1 || status == 2) {
      answerArr[$(obj).attr('data_index') - 1] = $(obj).text()
      chooseArr[$(obj).attr('data_index') - 1] = $(obj).index()
    }
    //刷新答案
    $('.list').each(function(i, arr) {
        if (!$(arr).hasClass("noDrag")) {
          answerArr[i] = ''
          chooseArr[i] = -1
        }
      })
      // console.log(answerArr, chooseArr, 'arr')
  }

  //提交
  let submitBtn = true;
  $(".section").on("click touchstart", '.submit', function(e) {
    //console.log(currentPage,submitBtn, '提交答案了')
    if (e.type == "touchstart") {
      e.preventDefault()
    }
    if (!$(".card").hasClass('draged')) {
      $(".submit").css({
        animation: 'shake 0.5s ease 1 forwards',
        '-webkit-animation': 'shake 0.5s ease-out 1 forwards'
      })
      $(".submit").on('animationend  webkitAnimationEnd', function() {
        $(this).css({
          'animation': 'none',
          '-webkit-animation': 'none'
        });
      })
      return
    }
    if (submitBtn) {
      submitBtn = false;
      if (!isSync) {
        $(this).trigger('submitClickSync')
        return
      }
      if (window.frameElement.getAttribute('user_type') == 'stu') {
        SDK.bindSyncEvt({
          index: $(e.currentTarget).data('syncactions'),
          eventType: 'click',
          method: 'event',
          syncName: 'submitClickSync', 
          recoveryMode: 1,
          otherInfor: {
            currentPage: currentPage,
            chooseArr: chooseArr,
            answerArr: answerArr,
            noChooseArr: noChooseArr
          }
        });
      }
    }
  })
  $(".section").on("submitClickSync", '.submit', function(e, message) {
      if (!isSync) {
        currentPage = currentPage
        submitAns(currentPage)
      } else {
        let obj = message.data[0].value.syncAction.otherInfor;
        if (message == undefined || message.operate == 1) {
          currentPage = obj.currentPage
          submitAns(currentPage, message)
        } else {
          //直接恢复页面 提交答案后出现掉线
          rebackPage(obj, 'submit')
        }
      }
    })
    //提交结果
  function submitAns(page, message) {
    $(".submit ").css({
      opacity: 0
    })
    let index = page - 1; //第几组卡片的下标
    let parent = $('.page' + index)
    let ansRightNum = 0; //记录答对的个数
    //console.log(index, parent, message, "是第几组卡片")
    //显示正确答案
    parent.find('.showAns').removeClass('hide')
      //卡片处理
    let card = parent.find(".card")
    for (let i = 0; i < card.length; i++) {
      if ($(card[i]).hasClass('draged')) {} else {
        $(card[i]).addClass("hide") //隐藏未被选中的卡片
        noChooseArr.push(i)
      }
    }
    //判断正确
    //console.log(filterData(index, 'letter', 'words'), '正确顺序')
    let rightAns = filterData(index, 'letter', 'words')
    for (let j = 0; j < rightAns.length; j++) {
      if (answerArr[j] == rightAns[j]) {
        ansRightNum++
        $(".card").eq(chooseArr[j]).find('.bling').css({
            animation: 'bling 0.5s ease-in 1 forwards',
            '-webkit-animation': 'bling 0.5s ease-in 1 forwards',
            'z-index': 200
          })
          //console.log("第" + j + '个盒子是正确的')
      } else if (chooseArr[j] != -1) {
        //console.log(chooseArr[j],chooseArr,"第" + j + '个盒子是错误的')
        $(".card").eq(chooseArr[j]).css({
          color: 'red',
          animation: 'shakeUp 0.5s ease 1 forwards',
          '-webkit-animation': 'shakeUp 0.5s ease-out 1 forwards'
        })
        $(".card").eq(chooseArr[j]).on('animationend  webkitAnimationEnd', function() {
          $(this).css({
            'animation': 'none',
            '-webkit-animation': 'none',
            'transform': 'rotate(10deg) translateY(16px)'
          });
        });
      }
    }
    for (let i = 0; i < chooseArr.length; i++) {
      $(".card").eq(chooseArr[i]).removeClass('cardOptions')
    }
    // console.log(chooseArr, '已选中的下标')
    // console.log(noChooseArr, '未选中的下标')
    // console.log(answerArr, '所在答案区位置的内容')

    if (isSync) {
      if (ansRightNum == rightAns.length) {
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
          operate: message.operate
        });
      } else {
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
          operate: message.operate
        });
      }
    }
  }

  //掉线页面恢复
  function rebackPage(data, style) {
    /**++++++++++++++++++++++++++
    data{
    	currentPage: currentPage,  当前第几道题
    	chooseArr:chooseArr,    [3, 2, 4, ""]选择的卡片下标
    	answerArr:answerArr    ["ea", "d", "g", ""]所在答案区位置的内容
    }*/
    //先恢复到当前页面
    showPage(data.currentPage - 1)
    setPageData(data.currentPage - 1)
      //渲染答案区结果和对应的卡片状态
    let ansIndex = data.chooseArr
    for (let i = 0; i < ansIndex.length; i++) {
      if (ansIndex[i] != -1) {
        //获取目标盒子当前的位置
        $(".list").eq(i).addClass('noDrag')
        let t = ($(".list").eq(i).offset().top - $(".container").offset().top) / window.base;
        let l = ($(".list").eq(i).offset().left - $(".container").offset().left) / window.base;
        //恢复卡片对应的位置
        $(".card").eq(ansIndex[i]).css({
          width: '2.8rem',
          height: '2.74rem',
          left: l + "rem",
          top: t + "rem",
          'z-index': 100,
          'line-height': '3.1rem'
        }).addClass("draged").attr("data_index", i + 1)
        if (style == 'submit') {
          $(".card").eq(ansIndex[i]).removeClass('cardOptions') //撤销已选卡片的cardOptions类名
        }
      }
    }
    if (style == 'submit') {
      $(".submit").css({
          opacity: 0
        })
        //恢复错误单词的颜色
      for (let j = 0; j < filterData(data.currentPage - 1, 'letter', 'words').length; j++) {
        if (data.answerArr[j] == filterData(data.currentPage - 1, 'letter', 'words')[j]) {} else {
          $(".card").eq(data.chooseArr[j]).css({
            color: 'red',
            'transform': 'rotate(10deg) translateY(16px)'
          })
        }
      }
      //隐藏未选中的卡片
      for (let i = 0; i < data.noChooseArr.length; i++) {
        $(".card").eq(data.noChooseArr[i]).addClass('hide')
      }

      $('.page').find('.showAns').removeClass('hide') //显示正确单词
      SDK.setEventLock()
      submitBtn = false; //不可再点击	
    }
  }
  if (isSync) {
    courseStatus = SDK.getClassConf().h5Course.classStatus
  }
  //上一个
  let leftBtn = false;
  $(".left").on("click touchstart", function(e) {
    if (e.type == "touchstart") {
      e.preventDefault()
    }
    if (leftBtn) {
      leftBtn = false;
      if (recordEvents.reStart == false) {
        recordEvents.stopClick()
        return
      }
      $(".right").css({
        'opacity': '1'
      })
      if (currentPage <= 2) {
        $(this).css({
          'opacity': '0.5'
        })
      }
      if (currentPage == 1) {
        rightBtn = true;
        return
      }
      if (!isSync) {
        $(this).trigger('leftClickSync')
        rightBtn = true
        return
      }

      if (window.frameElement.getAttribute('user_type') == 'tea' && courseStatus != 0 || courseStatus == 0) { 
        SDK.bindSyncEvt({
          index: $(e.currentTarget).data('syncactions'),
          eventType: 'click',
          method: 'event',
          syncName: 'leftClickSync', 
          recoveryMode: 1,
          otherInfor: {
            currentPage: currentPage
          }
        });
      }
    }
  })
  $(".left").on("leftClickSync", function(e, message) {
    chooseArr = []
    noChooseArr = []
    rightBtn = true
    submitBtn = true
    if (!isSync) {
      currentPage = currentPage
    } else {
      let obj = message.data[0].value.syncAction.otherInfor;
      currentPage = obj.currentPage
    }
    currentPage--;
    //console.log(currentPage, '----------btn')
    showPage(currentPage - 1)
    setPageData(currentPage - 1)
    getStartPos()
    SDK.setEventLock()
    leftBtn = true
  })

  //下一个
  let rightBtn = true;
  $(".right").on("click touchstart", function(e) {
    if (e.type == "touchstart") {
      e.preventDefault()
    }

    if (rightBtn) {
      rightBtn = false;
      if (recordEvents.reStart == false) {
        recordEvents.stopClick()
        return
      }
      $(".left").css({
        'opacity': '1'
      })
      if (currentPage == options.length - 1) {
        $(this).css({
          'opacity': '0.5'
        })
      }
      if (currentPage >= options.length) {
        leftBtn = true;
        return
      }
      if (!isSync) {
        $(this).trigger('rightClickSync')
        return
      }
      if (window.frameElement.getAttribute('user_type') == 'tea' && courseStatus != 0 || courseStatus == 0) { 
        SDK.bindSyncEvt({
          index: $(e.currentTarget).data('syncactions'),
          eventType: 'click',
          method: 'event',
          syncName: 'rightClickSync', 
          recoveryMode: 1,
          otherInfor: {
            currentPage: currentPage
          }
        });
      }
    }
  })
  $(".right").on("rightClickSync", function(e, message) {
    chooseArr = []
    noChooseArr = []
    leftBtn = true
    submitBtn = true
    if (!isSync) {
      currentPage = currentPage
    } else {
      let obj = message.data[0].value.syncAction.otherInfor;
      currentPage = obj.currentPage
    }
    currentPage++
    showPage(currentPage - 1)
    setPageData(currentPage - 1)
    getStartPos()
      //console.log(currentPage,submitBtn, '++++++btn')
    SDK.setEventLock()
    rightBtn = true
  })



  //点击播放音频事件
  let isStartBtn = true;
  $('section').on('click touchend', '.audioList', function(e) {
    if (e.type == "touchend") {
      e.preventDefault()
    }
    if (isStartBtn) {
      isStartBtn = false;
      if (!isSync) {
        $(this).trigger("audioSync");
        return
      }
      if (window.frameElement.getAttribute('user_type') == 'tea') {
        SDK.bindSyncEvt({
          sendUser: '',
          receiveUser: '',
          index: $(e.currentTarget).data('syncactions'),
          eventType: 'click',
          method: 'event',
          funcType: 'audio',
          syncName: 'audioSync', 
          otherInfor: {
            currentPage: currentPage
          }
        });
      } else {
        $(this).trigger("audioSync");
      }
    }
  });
  //老师端声音播放同步到学生端
  $('.section').on("audioSync", '.audioList', function(e, message) {
    var $audio = null;
    $audio = document.getElementsByClassName("audioSrc")[0];
    var $img = $(this).find("img");
    if (!isSync) {
      $audio ? $audio.play() : "";
      if ($img.length != 0) {
        $img.attr("src", $(this).find("img").attr("src").replace(".png", ".gif"));
        //播放完毕img状态
        $audio.onended = function() {
          $img.attr("src", $(this).find("img").attr("src").replace(".gif", ".png"));
          //flag = true;//恢复点击
        }.bind(this);
      }
    } else {
      if ($(window.frameElement).attr('id') === 'h5_course_self_frame' && (message == undefined || message.operate == 1)) {
        $audio ? $audio.play() : "";
        if ($img.length != 0) {
          $img.attr("src", $(this).find("img").attr("src").replace(".png", ".gif"));
          //播放完毕img状态
          $audio.onended = function() {
            $img.attr("src", $(this).find("img").attr("src").replace(".gif", ".png"));
            //flag = true;//恢复点击
          }.bind(this);
        }
      }
      if (window.frameElement.getAttribute('user_type') == 'tea' && message.operate == 5) {
        let obj = message.data[0].value.syncAction.otherInfor;
        currentPage = obj.currentPage
        showPage(currentPage - 1)
        setPageData(currentPage - 1)
        getStartPos()
      }
    }
    SDK.setEventLock();
    isStartBtn = true;
  });
})