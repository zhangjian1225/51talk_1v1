"use strict"
import '../../common/js/common_1v1.js'
import  './animation.js'
import  './drag.js'
$(function () {
  window.h5Template = {
    hasPractice: '0'
  }
  let h5SyncActions = parent.window.h5SyncActions;
  let options = configData.source.options;
  const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
  let source = configData.source
  let index = 0;//第几个目标的下标

  const page = {
    showOption: function () {
      let html = ''
      for (let i = 0; i < options.length; i++) {
        html += `<li class="pic pic${i}" data-syncactions="pic${i}"></li>`
      }
      $(".mainArea").append('<ul>' + html + '</ul>')
    },
    showAudioArea: function () {
      let html = ''
      for(let i=0;i<options.length;i++){
        if (options[i].audio == '') {
          html += `<li class="listPos">
                      <img class="img" src="${options[i].image}" alt="" data-syncactions="image${i}">
                    </li>`
        } else {
          html += `<li class="listPos">
                      <img class="img" src="${options[i].image}" alt="" data-syncactions="image${i}">
                      <audio class="audioOpt" src="${options[i].audio}"></audio>
                    </li>`
        }
      }
      $(".showStartPos").append('<ul>' + html + '</ul>')
      let images=[]
      for(let i=0;i<options.length;i++){
        images.push(options[i].image)
      }

      function firstIndex(arr, text) {
        // 若元素不存在在数组中返回-1
        let firstVal = -1;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] !== text) {
            firstVal = i;
            return firstVal;
            break;
          }
        }
        return firstVal;
      }
       let firstI= firstIndex(images, "");//console.log("获取某个元素第一次出现在数组的索引",images, firstIndex(images, ''));
      index=firstI
      $(".ans").text("Key: "+options[index].text)
      for(let i=0;i<options.length;i++){
        if(i==firstI){
          $(".listPos").eq(i).css({
            opacity: 1
          })
        }else{
          $(".listPos").eq(i).css({
            opacity: 0
          })
        }
      }
    },
    init: function () {

      $('.hands').css({
        animation:'hand 1s steps(4) infinite',
       ' -webkit-animation':'hand 1s steps(4) infinite'
      })
      this.showOption()
      this.showAudioArea()
      if(isSync){
        if (window.frameElement.getAttribute('user_type') == 'stu') {
          $(".ans").css({
            width:0,
            height:0,
            opacity:0
          })
          $(".hands").css({
            width:0,
            height:0,
            opacity:0
          })
        }
      }
      $(".ans").drag()
      // $(".ans").text("Key: "+options[0].text)
      if(source.handImg!=''){
        $(".handShake").css({
          background: 'url('+source.handImg+')',
         'background-size': '7.6rem 3.2rem'
        })
      }
    }
  }
  page.init()


  //触发魔术事件
  let start =true;

  let chooseObj= document.getElementsByClassName('img');
  let targetObj = document.getElementsByClassName('pic');
  let arrPoint=[0.25,1,0.3,0.2,0.2] ; //抛物线弧度
  let posArr=[] ;     //存储已经抛出去的目标的位置
  let $audioSrc=document.getElementsByClassName("audio")[0];
  $(".btnArea").on('click touchstart', function (e) {
    if (e.type == 'touchstart') {
      e.preventDefault()
    }
    if(index>=options.length){
      return
    }
    if (start) {
      index++
      start = false;
      if (!isSync) {
        $(this).trigger('changePosSync')
        return
      }
      if (window.frameElement.getAttribute('user_type') == 'tea') {
        SDK.bindSyncEvt({
          sendUser: '',
          receiveUser: '',
          index: $(e.currentTarget).data("syncactions"),
          eventType: 'click',
          method: 'event',
          syncName: 'changePosSync',
          otherInfor: {
            index:index
          },
          recoveryMode: '1'
        });
      }
    }
  });

  $(".btnArea").on('changePosSync', function(e,message) {
    if (!isSync) {
      index=index
    } else {
      let obj = message.data[0].value.syncAction.otherInfor;
      index=obj.index
      if (message == undefined || message.operate == 1) {

      } else {
        recover(index)
        SDK.setEventLock()
        return
      }
    }
    if(index==options.length){
      $(".hands").addClass('hide')
    }
    $(".handShake").css({
      animation:'handShakes .6s steps(2) 1',
      ' -webkit-animation':'handShakes .6s steps(2) 1 '
    })
    $(".handShake").on('animationend  webkitAnimationEnd', function() {
      $(this).css({
        animation:'none',
      ' -webkit-animation':'none '      
      })
    })
    if (index <= options.length){
         $(".ans").addClass('hide')
         if(index < options.length){
           let textIndex = index
           for (let i = textIndex; i < options.length; i++) {
             if (options[i].image == '') {
               textIndex++
             } else {
               break
             }
           }
           if(textIndex<options.length){
              $(".ans").text("Key: "+options[textIndex].text) 
           }
         }
    }
    $(".hands").addClass("hide")
    new Promise((resolve, reject) => {
      setTimeout(() => {
        $(".listPos").eq(index-1).find(".img").css({top:'.78rem'})
        // resolve()
        if (index <= options.length) {
          $audioSrc.currentTime = 0;
          $audioSrc ? $audioSrc.play() : "";
          resolve()
        }
      }, 1000)
    }).then(() => {
      new Promise((resolve, reject) => {
        setTimeout(()=>{
          let $audioIndex=$(".listPos").eq(index-1).find(".audioOpt").get(0)
          if (index <= options.length&&$audioIndex) {
            $audioIndex.currentTime = 0;
            $audioIndex ? $audioIndex.play() : "";
            resolve()
          }
          $(".listPos").eq(index-1).css({padding:'0',overflow:'visible'})
          let parabola = funParabola(chooseObj[index-1], targetObj[index-1], {}, {
            chooseImg: chooseObj[index-1],
            index: index-1,
            speed: 0.05,
            curvature: arrPoint[index-1]
          }).mark();
          parabola.init();
          for (let i = index; i < options.length; i++) {
            if (options[i].image == '') {
              index++
            } else {
              break
            }
          }
        },1200)
        // resolve()
      })
    }).then(() => {
      new Promise((resolve, reject) => {
        if (index <= options.length) {
          setTimeout(() => {
            $(".listPos").eq(index).css({
              opacity: 1,
              transition: '0.5s'
            })
            start = true
            SDK.setEventLock()
             if (index <= options.length-1) {
                $(".ans").removeClass('hide')  
                $(".hands").removeClass("hide")
             }
            // resolve()
          }, 2500)
        }   
      })
    })
  });

  //恢复机制
  function recover(index){
    for(let i=0;i<index;i++){
      let parabola = funParabola(chooseObj[i], targetObj[i], {}, {
        chooseImg: chooseObj[i],
        index: i,
        speed: 10,
        curvature: arrPoint[i]
      }).mark();
      parabola.init();
      if(options[i].image!=''){
        $(".listPos").eq(i).css({padding:'0',overflow:'visible',opacity:1})
      }
    }
    $(".listPos").eq(index).css({
      opacity: 1
    })
  }
})



