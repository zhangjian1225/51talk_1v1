"use strict"
import '../../common/js/common_1v1.js'
import './drag.js'
import '../record/js/record.js'

$(function() {
  window.h5Template = {
    hasPractice: '0'
  }
  let h5SyncActions = parent.window.h5SyncActions;
  const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;

  let options = configData.source.options;
  let staticData = configData.source;
  let title = staticData.title;
  let currentPage = 1; //当前页码
  //获取卡片的个数
  function getCardNum(index) {
    let num = 0;
    for (let i = 0; i < options[index].wordsList.letter.length; i++) {
      options[index].wordsList.letter[i].w != '' ? num++ : num;
    }
    return num
  }
  //判断红色标记的位置和对应的单词
  function wordData(str) {
    var wordCard = [];
    for (let i = 0; i < options.length; i++) {
      wordCard.push(options[i].wordsList[str])
    }
    return wordCard
  }

  function isRed(index) {
    var html = '';
    for (let i = 0; i < wordData('letter')[index].length; i++) {
      if (wordData('color')[index][i].isRed == true) {
        html += `<li class="card isRed">${wordData('letter')[index][i].w}</li>`
      } else {
        html += `<li class="card">${wordData('letter')[index][i].w}</li>`
      }
    }
    return `<ul class="index${index}">` + html + `</ul>`
  }
  //当前显示第几页内容
  function showCurrentPage(currentPage) {
    for (let i = 0; i < options.length; i++) {
      if (i == currentPage - 1) {
        $('.cardPos ul').eq(i).css({
          'display': 'block'
        })
      } else {
        $('.cardPos ul').eq(i).css({
          'display': 'none'
        })
      }
    }
  }
  //单词翻页效果
  let timer = null;

  function scrollWords(index, operate) {
    let lis = $(".cardPos ul").eq(index - 1).find('li')
    let standard = 0.3
    let timeStatus = 0.05
    let standardTime = 800
    if (isSync && operate == 5) {
      standard = 0 //掉线
      standardTime = 100
    }
    let num = 0;
    for (let i = 0; i < lis.length; i++) {
      let time = 0.8 + standard * i
      if (isSync && operate == 5) {
        time = 0
      }
      num++
      $(lis[i]).css({
        'animation': 'goTop ' + timeStatus + 's ease-out ' + time + 's forwards',
        '-webkit-animation': 'goTop ' + timeStatus + 's s ease-out ' + time + 's forwards'
      })
    }
    timer = setTimeout(function() {
      lastLock = true
      nextLock = true;
      $('.nextBtn').addClass('btns')
      $('.lastBtn').addClass('btns')
      $(".lampUp").addClass('upActive')
      $(".lampDown").addClass('downActive')
      $(".fontColor").text(options[currentPage - 1].words)
      clearTimeout(timer)
    }, standardTime + standard * num * 1000)
  }

  function scrollGif() {
    let i = 0
    let lis = $(".cardTransform ul").find('li')
    $(lis).addClass('gif')
    $(".cardTransform ul").delay(500).queue(function() {
      $(lis).eq(i).removeClass('gif')
      i++
      $(this).dequeue();
    }).delay(300).queue(function() {
      $(lis).eq(i).removeClass('gif')
      i++
      $(this).dequeue();
    }).delay(300).queue(function() {
      $(lis).eq(i).removeClass('gif')
      i++
      $(this).dequeue();
    }).delay(300).queue(function() {
      $(lis).eq(i).removeClass('gif')
      i++
      $(this).dequeue();
    })
  }

  // 填充内容
  const page = { 
    addCard: function() {
      for (let i = 0; i < options.length; i++) {
        $(".cardPos").append(isRed(i))
      }
      showCurrentPage(currentPage) //默认显示第一页
        //是否添加录音组件
      recordEvents.createRcordBtn(options)

      let lis = $(".cardPos ul").eq(0).find('li')
      let standard = 0
      let timeStatus = 0
      for (let i = 0; i < lis.length; i++) {
        let time = standard * i
        $(lis[i]).css({
          'animation': 'goTop 0.3s ease-in-out forwards',
          '-webkit-animation': 'goTop 0.1s ease-in forwards'
        })
      }
      $(".fontColor").text(options[currentPage - 1].words)
    },
    btnInit: function(){
      if (!isSync) { 
        return
      }
      if (window.frameElement.getAttribute('user_type') == 'tea') {
        $(".fontColor").addClass("hide");
        $(".nextBtn").removeClass("hide");
        $(".lastBtn").removeClass("hide");
      }else{
        $(".fontColor").removeClass("hide");
        $(".nextBtn").addClass("hide");
        $(".lastBtn").addClass("hide");
      }
    },
    init: function() { 
      this.addCard();
      this.btnInit();
    }
  }
  page.init()
    //点击上一个按钮
  let lastLock = false;
  $(".lastBtn").on('click touchstart', function(e) {
    if (e.type == "touchstart") {
      e.preventDefault()
    }
    //录音状态不可点击
    if (recordEvents.reStart == false) {
      recordEvents.stopClick()
      return
    }
    if (lastLock) {
      lastLock = false;
      if (!isSync) {
        $(this).trigger('lastClickSync')
        return
      }
      if (window.frameElement.getAttribute('user_type') == 'tea') {
        SDK.bindSyncEvt({
          index: $(e.currentTarget).data('syncactions'),
          eventType: 'click',
          method: 'event',
          syncName: 'lastClickSync',
          recoveryMode: 1,
          otherInfor: {
            currentPage: currentPage - 1
          }
        });
      }
    }
  })

  $(".lastBtn").on('lastClickSync', function(e, message) {
    if (currentPage <= 1) {
      return
    }
    $(".fontColor").text("")
    $(".lampUp").removeClass('upActive')
    $(".lampDown").removeClass('downActive')
    $(".nextBtn").removeClass('btns')
    $(".nextBtn img").removeClass("hide")
    $(this).removeClass('btns')
    if (currentPage == 2) {
      $(this).find("img").addClass("hide")
    }

    nextLock = false
    currentPage--
    options[currentPage - 1].recordStatus == true ? recordEvents.isShowRecord(true) : recordEvents.isShowRecord(false);
    recordEvents.getRecordIndex(currentPage)
    if (!isSync) {
      currentPage = currentPage
      scrollGif()
      scrollWords(currentPage - 1)

    } else {
      let obj = message.data[0].value.syncAction.otherInfor;
      if (message == undefined || message.operate == 1) {
        currentPage = obj.currentPage
        scrollWords(currentPage - 1)
        scrollGif()
      } else {
        //直接恢复页面
        rebackPage(obj, message.operate)
      }
    }
    showCurrentPage(currentPage)
    SDK.setEventLock()
  })

  //点击下一个按钮
  let nextLock = true;
  $(".nextBtn").on('click touchstart', function(e) {
    if (e.type == "touchstart") {
      e.preventDefault()
    }
    //录音状态不可点击
    if (recordEvents.reStart == false) {
      recordEvents.stopClick()
      return
    }
    if (nextLock) {
      nextLock = false;
      if (!isSync) {
        $(this).trigger('nextClickSync')
        return
      }
      if (window.frameElement.getAttribute('user_type') == 'tea') {
        SDK.bindSyncEvt({
          index: $(e.currentTarget).data('syncactions'),
          eventType: 'click',
          method: 'event',
          syncName: 'nextClickSync',
          recoveryMode: 1,
          otherInfor: {
            currentPage: currentPage + 1
          }
        });
      }
    }
  })

  $(".nextBtn").on('nextClickSync', function(e, message) {
    if (currentPage > options.length - 1) {
      return
    }
    $(".fontColor").text("")
    $(".lampUp").removeClass('upActive')
    $(".lampDown").removeClass('downActive')
    if (currentPage == 1) {
      scrollWords(1)
    }
    $(".lastBtn").removeClass('btns')
    $(".lastBtn img").removeClass("hide")
    $(this).removeClass('btns')
    if (currentPage == options.length - 1) {
      $(this).find("img").addClass("hide")
    }

    lastLock = false
    currentPage++
    options[currentPage - 1].recordStatus == true ? recordEvents.isShowRecord(true) : recordEvents.isShowRecord(false);
    recordEvents.getRecordIndex(currentPage)
    if (!isSync) {
      currentPage = currentPage
      scrollGif()
      scrollWords(currentPage) //字母动效

    } else {
      let obj = message.data[0].value.syncAction.otherInfor;
      currentPage = obj.currentPage
      if (message == undefined || message.operate == 1) {
        scrollWords(currentPage) //字母动效
        scrollGif()
      } else {
        //直接恢复页面
        rebackPage(obj, message.operate)
      }
    }
    showCurrentPage(currentPage)
    SDK.setEventLock()
  })

  //恢复页面
  function rebackPage(page, operate) {
    let pageIndex = page.currentPage
    showCurrentPage(pageIndex)
    scrollWords(pageIndex, operate)
  }
});