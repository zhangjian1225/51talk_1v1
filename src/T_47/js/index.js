"use strict"
import '../../common/js/common_1v1.js'

$(function () {
  window.h5Template = {
    hasPractice: '0'
  }
  let h5SyncActions = parent.window.h5SyncActions;
  let options = configData.source.options;
  const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
  let source=configData.source

  const page = {
    showOption: function () {
      let html=''
      source.optionsBg==''?source.optionsBg='image/optionBg.png':source.optionsBg=source.optionsBg
      for(let i=0;i<options.length;i++){
        if(i>0){
           html += `<li class="list list${i}" >
                      <div class="back"><img src="${source.optionsBg}" alt=""><span class="btn hide" data-syncactions="list${i}" data_index='${i}'></span></div>
                      <div class="showWu hide"></div>
                      <div class="before"> <img src="${options[i].image}" alt=""></div>
                  </li>`       
        }else{
          html += `<li class="list list${i}" >
                      <div class="back"><img src="${source.optionsBg}" alt=""><span class="btn" data_index='${i}' data-syncactions="list${i}"></span></div>
                      <div class="showWu hide"></div>
                      <div class="before"> <img src="${options[i].image}" alt=""></div>
                  </li>`  
        }

      }
      $(".mainArea").append('<ul class="listBox">'+html+'</ul>')
      source.answerBg==''?source.answerBg='image/boxClose.png':source.answerBg=source.answerBg
      let html1=`<div class="answeBox" >
                    <div class="openBefor"><img src="${source.answerBg}" alt=""><span class="answerBtn hide" data-syncactions="ansBtn"></div>
                    <div class="showLight hide"></div>
                    <div class="openAfter"><img src="${source.answerImg}" alt=""></div>
                </div>`;
      $(".mainArea").append(html1)
    },
    init: function () {
      this.showOption()
    }
  }
  page.init()

  //一次触发线索事件
  let index
  $(".btn").on('click touchstart',function(e){
      if(e.type=='touchstart'){
        e.preventDefault()
      }
      index=$(this).attr("data_index")
      if(!isSync){
        $(this).trigger("openListSyns")
        return
      }
    if (window.frameElement.getAttribute('user_type') == 'tea') {
      SDK.bindSyncEvt({
        sendUser: '',
        receiveUser: '',
        index: $(e.currentTarget).data("syncactions"),
        eventType: 'click',
        method: 'event',
        syncName: 'openListSyns',
        otherInfor: {
          index:index
        },
        recoveryMode: '1'
      });
    }
  })
  let $audioSrc=document.getElementsByClassName("audio")[0];
  $(".btn").on('openListSyns', function (e, message) {
    console.log(index,message,'47------------')
    $audioSrc.currentTime=0;
    $audioSrc ? $audioSrc.play() : "";
    if (!isSync) {
      index=index
    } else {
      let obj=message.data[0].value.syncAction.otherInfor;
      index=obj.index
      if (message == undefined || message.operate == 1) {

      } else {
        recovery(index,'option')
        return
      }
    }
    if(index==options.length-1){
      $(".answerBtn").removeClass('hide')
    }
    $('.showWu').eq(index).removeClass('hide').css({
      animation: 'showOptions 0.4s steps(4) 1',
      '-webkit-animation': 'showOptions 0.4s steps(4) 1'
    })
    $('.showWu').eq(index).removeClass('hide').on('animationend  webkitAnimationEnd', function() {
      $(this).css({
        animation: 'none',
        '-webkit-animation': 'none',
        opacity:0
      })
      $('.before').eq(index).css({
        opacity: 1
      })
      $('.back').eq(index).css({
        opacity: 0
      })
      $(".list").eq(index-0+1).find('.btn').removeClass('hide')
    })
    if(index==1){
      $(".line").eq(index).css({
        height:'4.01rem',
        transition:'0.6s'
      })
    }else{
      $(".line").eq(index).css({
        height:'6.5rem',
        transition:'1s'
      })
    }

    $(".list").eq(index-0).find('.btn').addClass('hide')
 
  })

  //显示答案
  $(".answerBtn").on('click touchstart', function (e) {
    if (e.type == 'touchstart') {
      e.preventDefault()
    }
    if (!isSync) {
      $(this).trigger("showAnsSyns")
      return
    }
    if (window.frameElement.getAttribute('user_type') == 'tea') {
      SDK.bindSyncEvt({
        sendUser: '',
        receiveUser: '',
        index: $(e.currentTarget).data("syncactions"),
        eventType: 'click',
        method: 'event',
        syncName: 'showAnsSyns',
        otherInfor: {
          index:index
        },
        recoveryMode: '1'
      });
    }
  })
  
  $(".answerBtn").on('showAnsSyns', function (e, message) {
    $audioSrc.currentTime=0;
    $audioSrc ? $audioSrc.play() : "";
    if (!isSync) {
      index=index
    } else {
      let obj=message.data[0].value.syncAction.otherInfor;
      index=obj.index
      if (message == undefined || message.operate == 1) {

      } else {
        recovery(index,'answer')
        return
      }
    }
    $(".showLight").removeClass('hide').css({
          animation: 'showAns 0.4s ease-in 1',
					'-webkit-animation': 'showAns 0.4s ease-in 1'
    })
    $(".showLight").on('animationend  webkitAnimationEnd', function() {
      $(this).removeClass('hide').css({
        animation: 'none',
        '-webkit-animation': 'none',
        opacity:0
      })
      $(".openAfter").css({
        opacity: 1
      })
      $(".openBefor").css({
        opacity: 0
      })
    })

    $(this).addClass('hide')
  })

  //恢复机制
 
  function recovery(index,type){
    console.log(index,'aa')
      for(let i=0;i<=index;i++){
        $(".btn").eq(i).addClass("hide")
        $(".back").eq(i).css({opacity:0})
        $(".before").eq(i).css({opacity:1})
        if(i==1){
          $(".line").eq(i).css({
            height:'4.01rem'
          })
        }else{
          $(".line").eq(i).css({
            height:'6.5rem'          
          })
        }
      }
      if(type=='option'){
        if(index-0+1<=options.length){
          console.log(index, $(".btn").eq(index-0+1),'bb')
          $(".btn").eq(index-0+1).removeClass("hide")
        }
        if(index==options.length-1){
          $(".answerBtn").removeClass("hide")
        }
      }else{
        $(".answerBtn").addClass("hide")
        $(".openBefor").css({opacity:0})
        $(".openAfter").css({opacity:1})
      }

  }

})
