"use strict"
import '../../common/js/common_1v1.js'
// import { url } from 'inspector';

$(function () {
  window.h5Template = {
    hasPractice: '0'
  }
  let h5SyncActions = parent.window.h5SyncActions;
  let options = configData.source.options;
  let colorIndex= configData.source.colorNum
  const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
  let selectArr = [] //存储已选过的句子


  const page = {
    showOption: function () {
      let html = '';
      for (let i = 0; i < options.length; i++) {
        html += `<li class="optList optList${i} optionSele" data-syncactions="options${i}">${options[i].words}</li>`
      }
      $(".option").append('<ul>' + html + '</ul>')
    },
    setPos:function(num){
      for(let i=0;i<options.length-1;i++){
        $(".optList").eq(i).css({
          'margin-right':num+'rem'
        })
      }
    },
    init: function () {
      
      for (let i = 0; i < options.length; i++) {
        selectArr.push({
          index: -1,
          num: 0
        })
      }
      this.showOption()
      if(options.length==4){
        this.setPos(0.32)
      }else if(options.length==3){
        $(".option").find('ul').css({padding:'0 1.26rem'})
        this.setPos(1.15)
      }else{
        $(".option").find('ul').css({padding:'0 3.22rem'})
        this.setPos(2.32)
      }
      if(configData.source.imgBg!=''){
        $(".optList").css({
          background: 'url('+configData.source.imgBg+') center center no-repeat',
          'background-size': 'contain'
        })
      }
    }
   
  }
  page.init()

  //触发点击句子事件
  let startSelect = true
  let $audioF=$(".audio1").get(0);
  let $audioT=$(".audio2").get(0);
  $(".optList").on('click touchstart', function (e) {
   
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
  $(".optList").on('selectOptionsSync', function (e, message) {
    
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
      $(".optList").eq(index).addClass('optListOne')
      $audioF.currentTime=0
      $audioF ? $audioF.play() : "";
    } else {
      $(".optList").eq(index).removeClass('optListOne').addClass('optList_selectwo').css({
        background:'url('+options[index].image+')',
        'background-size':'contain'
      })
      $audioT.currentTime=0
      $audioT ? $audioT.play() : "";
    }
    if($(".optList_selectwo").length==options.length){
      setLight()
    }
  })

  function recovery(obj) {
    let arr = obj.selectArr
    // console.log(obj, 'obj+++++++++++++')
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].num == 1) {
        $(".optList").eq(arr[i].index).addClass("optListOne")
      } else if (arr[i].num == 2) {
        $(".optList").eq(arr[i].index).removeClass("optListOne optionSele").addClass('optList_selectwo').css({
          background:'url('+options[index].image+')',
          'background-size':'contain'
        })
      }
    }
    if($(".optList_selectwo").length==options.length){
      setLight()
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
