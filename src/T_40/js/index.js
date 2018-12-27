"use strict"
import '../../common/js/common_1v1.js'

$(function() {
  window.h5Template = {
    hasPractice: '0'
  }
  let h5SyncActions = parent.window.h5SyncActions;
  let options = configData.source.options;
  let colorIndex= configData.source.colorNum
  const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
  let selectArr = [] //存储已选过的句子
  let arrColor1=['red',]
  let arrColor2=[]
  const page = {
    showOption: function() {
      let html = '';
      for (let i = 0; i < options.length; i++) {
        html += `<li class="optList optionSele" data-syncactions="options${i}">
          <div class="showFontBg" style = "background:url(${options[i].imgBk}) no-repeat;background-size: 100% 100%;"></div>
          <div class="fontBox">${options[i].text}</div>
          <audio src="./audio/once.mp3" class="onceMp3"></audio>
          <audio src="./audio/twice.mp3" class="twiceMp3"></audio>
        </li>`
      }
      $(".option").append('<ul>' + html + '</ul>')
      if (options.length == 2) {
        $(".optList").css({
          'margin-bottom': '0.5rem'
        })
        $('.option').css('bottom','2rem')
      }
    },
    init: function() {
      for (let i = 0; i < options.length; i++) {
        selectArr.push({
          index: -1,
          num: 0
        })
      }
      this.showOption();
      if (configData.source.initFontBg) {
        $('.optList').css({
          'background':`url(${configData.source.initFontBg}) no-repeat`,
          'background-size':'100% 100%'
        })
      }
    }
  }
  page.init()

  //触发点击句子事件
  let startSelect = true
  $(".optList").on('click touchstart', function(e) {
    if (e.type == 'touchstart') {
      e.prevetDefault()
    }
    let index = $(this).index()
    if (selectArr[index].num > 2) {
      startSelect = false;
    } else {
      startSelect = true;
    }
    if ($(this).hasClass('optionSele')) {
      selectArr[index].index = index;
      selectArr[index].num = selectArr[index].num + 1;
    } else {
      return
    }
    if (selectArr[index].num >= 2) {
      $(".optList").eq(index).removeClass('optionSele')
    }

    if (startSelect) {
      if (!isSync) {
        $(this).trigger('selectOptionsSync')
        return
      }
      if (window.frameElement.getAttribute('user_type') == 'tea') {
        SDK.bindSyncEvt({
          index: $(e.currentTarget).data('syncactions'),
          eventType: 'click',
          method: 'event',
          syncName: 'selectOptionsSync',
          recoveryMode: 1,
          otherInfor: {
            selectArr: selectArr,
            index: index,
            num: selectArr[index].num
          }
        });
      }
    }
  })
  $(".optList").on('selectOptionsSync', function(e, message) {
    let index
    if (!isSync) {
      index = $(this).index()
      selectArr[index].num == selectArr[index].num
    } else {
      let obj = message.data[0].value.syncAction.otherInfor;
      // console.log(obj, 'obj------------')
      index = obj.index
      selectArr[index].num = obj.num
      if (message == undefined || message.operate == 1) {
        
      } else {
        selectArr = obj.selectArr
        recovery(obj)
        return
      }
    }
    if (selectArr[index].num == 1) {
      $(".optList").eq(index).find('.fontBox').addClass('optListOne');
      $('.optList').eq(index).find('.onceMp3').get(0).play();
    } else {
      $(".optList").eq(index).find('.fontBox').addClass('optList_selectwo');
      $(this).css({background:'transparent'})
      $('.optList').eq(index).find('.showFontBg').show();
      $('.optList').eq(index).find('.twiceMp3').get(0).play();
      $(this).css({background:'transparent'})
    }
    if ($('.optList_selectwo').length >= $('.optList').length) {
      setLight();
    }
  })

  function recovery(obj) {
    let arr = obj.selectArr
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].num == 1) {
        $(".optList").eq(arr[i].index).find('.fontBox').addClass('optListOne');
      } else if (arr[i].num == 2) {
        $(".optList").eq(arr[i].index).find('.fontBox').addClass('optList_selectwo');
        $('.optList').eq(arr[i].index).find('.showFontBg').show();
      }
    }
    if ($('.optList_selectwo').length >= $('.optList').length) {
      setLight();
    }
  }
  function setLight(){
    for (let i = 0; i < $(".starList").length; i++) {
      if (i % 2 == 0) {
        $(".starList").eq(i).css({
          animation: 'starAnima .5s  infinite',
          ' -webkit-animation': 'starAnima .5s  infinite',
          opacity:1
        })
        $(".pointList").eq(i).css({
          animation: 'pointAnima 1.5s  infinite',
          ' -webkit-animation': 'pointAnima 1.5s  infinite'
        })
      } else {
        $(".starList").eq(i).css({
          animation: 'starAnima .5s infinite .2s ',
          ' -webkit-animation': 'starAnima .5s .2s infinite .2s',
          opacity:1
        })
        $(".pointList").eq(i).css({
          animation: 'pointAnima 1.5s  infinite 0.3s',
          ' -webkit-animation': 'pointAnima 1.5s  infinite 0.3s'
        })
      }
    } 
    $(".lightBox").addClass("light"+colorIndex).css({opacity:1,transition:'1s'}) 
  }

})