"use strict"
import '../../common/js/common_1v1.js'
import './drag.js'

$(function() { 

  /**
   * 控制器调用的变量
   */
  window.h5Template = {
    hasPractice: '0'
  }

  let lock = true;
  const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;

  
  var currentWindowId = $(window.frameElement).attr('id');
  var cacheFrameId = "h5_course_cache_frame";
  let appointUserList = {
    stuID: ['111'],
    'stu_111': {
      name: "stu1",
      smallimage: "image/stu1.png"
    }
  }
  if (isSync) {
    const appointMemberList = SDK.getClassConf().appointMemberList
    appointUserList = {
      stuID: []
    }
    appointMemberList.forEach(function(item, i) {
        if (item.role === 'stu') {
          appointUserList.stuID.push(item.uid)
          appointUserList['stu_' + item.uid] = { name: item.name, smallimage: 'image/stu' + i % 4 + '.png' }
        }
      })
      // console.log(appointUserList,'aaaaaaaaa')
  }
  let userList = {
    stuID: ['111'],
    'stu_111': {
      name: "stu1",
      smallimage: "image/stu1.png"
    }
  }
  if (isSync) {

    const appointMemberList = SDK.getClassConf().appointMemberList
    userList = {
      stuID: []
    }
    appointMemberList.forEach(function(item, i) {
        if (item.role === 'stu') {
          userList.stuID.push(item.uid)
          userList['stu_' + item.uid] = {
            name: item.name,
            smallimage: 'image/stu' + i % 4 + '.png'
          }
        }
      })
      // console.log(userList,'isSyncStu=======s%',userList)
  }

  // 填充内容
  const page = { 
    options: configData.source.options,
    time: parseInt(configData.source.time),
    bomb: configData.source.bomb, 
    setThemePic: function() {
      let img = '';
      if (this.options[0].themePic) {
        img = `<img class="showImg" src="${this.options[0].themePic}"/>`
      } else {
        img = `<img class="showImg" src="image/img.jpg"/>`
      }
      $(".pic").append(img);
    },
    setAudio: function() {
      let audio = '';
      audio = `<audio class="showAudio" webkit-playsinline controls preload="preload" src=""></audio>`
      $(".source-audio").append(audio);
    },
    setBombAudio: function() {
      $('#bombAudio').attr('src', this.bomb)
    },
    setTime: function() {
      $('.count-down').text(this.time + 's')
    },
    showBtn: function() {
      let btn = '';
      for (let i = 0; i < this.options.length; i++) {
        btn += `<span class="changeBtn" data-syncactions="btn-${i}">${i+1}</span>`;
      }
      $(".pic-btn").append(btn);
    },
    drawStu: function() {
      let list = '';
      let stu = '';
      if (appointUserList.stuID[0]) {
        let stuId = 'stu_' + appointUserList.stuID[0];
        stu += `<div class="stuInfor" data-user-id=${stuId}><img src="${appointUserList[stuId].smallimage}"/><span class="name">${appointUserList[stuId].name}</span></div>`;
      }
      list += `<li class="smallStu">${stu}</li>`; 
      $(".avatars ul").append(list);
    },
    judgeSource: function() {
      $(".changeBtn").eq(0).addClass('active');
      if (this.options[0].themePic != '') {
        $(".showImg").attr('src', this.options[0].themePic);
      }
      if (this.options[0].audio != '') {
        $(".showAudio").attr('src', this.options[0].audio);
      } else {
        $(".source-audio").css({
          display: "none"
        })
      }
    },
    showStu: function() {
      // let stu=$(".stuInfor");
      $(".name").each(function(arr, i) {
        // console.log($(this).text())
        if ($(this).text().length > 7) {
          $(this).css({
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            '-webkit-text-overflow': 'ellipsis'
          })
        }
      })
      let updatedUserList;

      if (isSync) {
        updatedUserList = SDK.getClassConf().userList
      } else {
        updatedUserList = userList
      }

      // console.log($('.stuInfor'),'0000000000000')
      if (updatedUserList != null) {
        $('.stuInfor').each(function(item) {
          let dataUserId = $(this).attr('data-user-id')
            // console.log( $(this),'11111')
          if (updatedUserList[dataUserId] != null) {
            // in
            $(this).removeClass('hide')
          } else {
            // out
            $(this).addClass('hide')
          }
        })
      }
    },
    init: function() { 
      this.setThemePic()
      this.setAudio()
      this.setTime()
      this.setBombAudio()
      this.showBtn()
      this.drawStu()
      this.judgeSource()
      this.showStu()
    }
  }
  page.init();



  // 中途人员变更
  const updateUserConnect = function() {
    let updatedUserList = SDK.getClassConf().userList
      // console.log($('.stuInfor'),'0000000000000')
    if (updatedUserList != null) {
      $('.stuInfor').each(function(item) {
        let dataUserId = $(this).attr('data-user-id')
          // console.log( $(this),'11111')
        if (updatedUserList[dataUserId] != null) {
          // out
          $(this).removeClass('hide')
        } else {
          // in
          $(this).addClass('hide')
        }
      })
    }
    setTimeout(updateUserConnect, 1000);
  }
  if (isSync) {
    if (currentWindowId != cacheFrameId) {
      updateUserConnect();
    }
  }


  // 同步拖拽
  // 倒计时

  let start = false
  let time = page.time
  let timer = null
  $('.bomb').drag({
    before: function(e) {
      $audioStart ? $audioStart.pause() : '';
      if (!isSync) {
        $('.bomb').trigger('syncDragBefore', {
          left: $('.bomb').data('startPos').left,
          top: $('.bomb').data('startPos').top,
          pageX: '',
          pageY: '',
        })
        return
      }
      if (window.frameElement.getAttribute('user_type') == 'tea') {
        SDK.bindSyncEvt({
          index: $(e.currentTarget).data('syncactions'),
          eventType: 'dragBefore',
          method: 'drag',
          left: $('.bomb').data('startPos').left,
          top: $('.bomb').data('startPos').top,
          pageX: '',
          pageY: '',
          syncName: 'syncDragBefore'
        })
      }
    },
    process: function(e) {
      $audioStart ? $audioStart.pause() : '';
      if (!isSync) {
        $('.bomb').trigger('syncDragProcess', {
          left: $('.bomb').attr('data-left'),
          top: $('.bomb').attr('data-top'),
          pageX: '',
          pageY: '',
        })
        return
      }
      if (lock && window.frameElement.getAttribute('user_type') == 'tea') {
        lock = false
        setTimeout(function() {
          SDK.bindSyncEvt({
            index: $('.bomb').data('syncactions'),
            eventType: 'dragProcess',
            method: 'drag',
            left: $('.bomb').attr('data-left'),
            top: $('.bomb').attr('data-top'),
            pageX: '',
            pageY: '',
            syncName: 'syncDragProcess'
          })
          lock = true
        }.bind(this), 300)
      }
    },
    end: function() {
      if (!isSync) {
        $('.bomb').trigger('syncDragEnd', {
          left: $('.bomb').attr('data-left'),
          top: $('.bomb').attr('data-top'),
          pageX: '',
          pageY: '',
        })
        return
      }
      if (window.frameElement.getAttribute('user_type') == 'tea') {
        setTimeout(function() {
          SDK.bindSyncEvt({
            index: $('.bomb').data('syncactions'),
            eventType: 'dragEnd',
            method: 'drag',
            left: $('.bomb').attr('data-left'),
            top: $('.bomb').attr('data-top'),
            pageX: '',
            pageY: '',
            syncName: 'syncDragEnd',
          })
        }, 300)
      }
    }
  })

  $('.bomb').on("syncDragBefore", function(e, pos) {
    $(this).data('startPos', {
      left: pos.left,
      top: pos.top
    })
    SDK.setEventLock()
  })

  $('.bomb').on("syncDragProcess", function(e, pos) {
    $(this).css({
      'left': pos.left,
      'top': pos.top
    })
    SDK.setEventLock()
  })

  $('.bomb').on('syncDragEnd', function(e, pos) {
    $(this).css({
      'left': pos.left,
      'top': pos.top
    })
    $(this).addClass('drop-down')
    SDK.setEventLock()
  })
  let startTime = true;
  $(".btn").on('click', function(e) {
    // console.log(start)

    //console.log(start)
    if (startTime == true) {
      startTime = false;
      if (!isSync) {
        $(this).trigger('syncCountDown')
        return
      }
      if (window.frameElement.getAttribute('user_type') == 'tea') {
        SDK.bindSyncEvt({
          index: $(e.currentTarget).data('syncactions'),
          eventType: 'click',
          method: 'event',
          syncName: 'syncCountDown'
        })
      }
    }
  })
  let size = 0;
  let times = parseInt(configData.source.time) * 2;
  let $audioStart = document.getElementById('start');
  let $audioEnd = document.getElementById('end');
  $('.btn').on('syncCountDown', function(e) {
    if (start == true) {
      start = false
    } else {
      start = true
    }
    // if ($(window.frameElement).attr('id') == 'h5_course_self_frame') {
      if (start == true) {
        $('.btn').addClass('stop')
        $('.btn').removeClass('start')
      } else {
        $('.btn').addClass('start')
        $('.btn').removeClass('stop')
      }
    // }

    if (start) {
      start = true
        //========= reset time
      time = page.time
      $('.count-down').text(time + 's')
        //========= reset time
      if (timer) {
        clearInterval(timer)
      }
      // if ($(window.frameElement).attr('id') == 'h5_course_self_frame') {
        timer = setInterval(function() {
          size += parseFloat(1 / times);

          $('.bomb-img').css({
            transition: '0.5s cubic-bezier(0.2, 1.84, 0.2, -0.32)',
            'transform': 'scale(' + (1 + size) + ')',
            'transform-origin': 'bottom'
          })
          time--
          isBom(time)
          $('.count-down').text(time + 's')

        }, 1000);
      // }


      setTimeout(function() {
        if (!isSync || $(window.frameElement).attr('user_id') == SDK.getClassConf().user.id) {
          // if ($(window.frameElement).attr('id') == 'h5_course_self_frame') {
            //$("#changing").attr("src","audio/changing.mp3");
            $audioStart.currentTime = 0;
            $audioStart ? $audioStart.play() : '';
          } else {
            $audioStart.currentTime = 0;
            $audioStart ? $audioStart.play() : '';
          }
        // }
      }, 1000)
    } else {
      // console.log("结束")

      if (timer) {
        clearInterval(timer)
        $audioStart ? $audioStart.pause() : '';
        // console.log('111111111111')
      }
      time = page.time
      $('.count-down').text(time + 's')
      start = false
      $('.bomb').removeClass('drop-down')
        // $('.bomb img').removeClass('beat')
      size = 0;
      $('.bomb-img').css({
        'transition': 'none',
        'transform': 'scale(1)',
        'width': '0.85rem',
        'height': "1.03rem"
      })
      $(".bomb-img img").css({
        'display': 'block'
      })
      $(".bomb .count-down").css({
        'display': 'block'
      })
    }
    SDK.setEventLock()
    startTime = true;
  })

  function isBom(time) {
    if (time < 0) {

      $('.bomb-img').css({
        'transition': 'none'
      })
      $('.bomb-img img').css({
        'transition': 'none',
        'display': 'none'
      })
      $audioStart ? $audioStart.pause() : '';

      if (!isSync || $(window.frameElement).attr('user_id') == SDK.getClassConf().user.id) {
        $audioEnd.currentTime = 0;
        $audioEnd ? $audioEnd.play() : '';
      }

      // let img='<img src="image/ball.gif" alt="" class="bomb-gif">'
      // $(".bomb").append(img)
      time = 0
      clearInterval(timer)
      start = false
      $('.bomb-gif').attr('src', 'image/ball.gif').removeClass('hide')
        // $('.bomb').removeClass('drop-down')
        // $('.bomb-img img').removeClass('beat')


      $(".bomb .count-down").css({
        'display': 'none'
      })
      $('.bomb-img').css({
        'width': (size * 1.8) + 'rem',
        'height': (size * 1.8) * 1.03 / 0.85 + 'rem'
      })
      $(".bomb .bomb-gif").css({
        'width': (size * 2) + 'rem',
        'height': (size * 2) * 1.03 / 0.85 + 'rem'
      })
      size = 0;


      setTimeout(function() {
          $('.bomb-gif').attr('src', '').addClass('hide')
            // $('.bomb-gif').remove()
          $('.count-down').text(page.time + 's')
          $('.bomb').css({
            'left': '13.8rem',
            'top': '6.2rem',
            'transition': 'none',
            'transform': 'scale(1)',
            'width': '0.85rem',
            'height': "1.03rem"
          })
          $('.bomb-img').css({
            'width': '0.85rem',
            'height': "1.03rem",
            'transform': 'scale(1)'
          })
          $(".bomb-img img").css({
            'display': 'block',
            'width': '100%',
            'height': '100%'
          })
          $(".bomb .count-down").css({
            'display': 'block'
          })
          $('.btn').addClass('start')
          $('.btn').removeClass('stop')

        }, 1000)
        // if(page.bomb){
        // 	document.querySelector('#bombAudio').play()
        // }
    }


  }


  // 音频播放
  const audioEle = document.querySelector('.showAudio')
  let play = false
  let audioPlay = function(message) {
    if (!isSync) {
      audioEle.play()
      $('.source-audio img').attr('src', './image/btn-audio.gif')
    } else {
      // if ($(window.frameElement).attr('id') === 'h5_course_self_frame') {
        if (message == undefined || message.operate == 1) {
          audioEle.play()
          $('.source-audio img').attr('src', './image/btn-audio.gif')
        }
      // }
    }
  }
  let audioPause = function(message) {
    if (!isSync) {
      audioEle.pause()
    } else {
      if (message == undefined || message.operate == 1) {
        audioEle.pause()
      }
    }
    $('.source-audio img').attr('src', './image/btn-audio.png')
  }

  let audioClick = true
  $('.source-audio').on('click touchend', function(e) {
    if (e.type == "touchend") {
      e.preventDefault()
    }
    if (audioClick) {
      audioClick = false
      if (!isSync) {
        $(this).trigger('syncAudioClick')
        return
      }
      if (window.frameElement.getAttribute('user_type') == 'tea') {
        SDK.bindSyncEvt({
          index: $(e.currentTarget).data('syncactions'),
          eventType: 'click',
          method: 'event',
          syncName: 'syncAudioClick',
          funcType: 'audio'
        })
      } else {
        $(this).trigger('syncAudioClick')
      }
    }

  })

  $('.source-audio').on('syncAudioClick', function(e, message) {
    if (play) {
      audioPause(message)
    } else {
      audioPlay(message)
      audioEle.onended = function() {
        rightClick = true
        leftClick = true
        pageBtn = true
          // play = true
        $('.source-audio img').attr('src', './image/btn-audio.png')
      }
    }
    SDK.setEventLock()
    audioClick = true
  })

  //点击右切换按钮
  let options = configData.source.options;
  let rightClick = true;
  let currentPage = 0;
  $(".rightBtnBg").on('click touchstart', function(e) {
    $('.source-audio img').attr('src', './image/btn-audio.png')
    if (e.type == "touchstart") {
      e.preventDefault()
    }
    if (currentPage < options.length - 1) {
      currentPage++;
    } else {
      currentPage = options.length - 1;
      return
    }


    if (rightClick) {
      rightClick = false;
      if (!isSync) {
        $(this).trigger('syncRightClick');
        return
      }

      SDK.bindSyncEvt({
        index: $(e.currentTarget).data('syncactions'),
        eventType: 'click',
        method: 'event',
        syncName: 'syncRightClick',
        recoveryMode: '1',
        otherInfor: {
          currentPage: currentPage
        }
      });
    }
  })

  $(".rightBtnBg").on('syncRightClick', function(e, message) {

    if (isSync) {
      let obj = message.data[0].value.syncAction.otherInfor;
      currentPage = obj.currentPage;
      if (message.operate == 5) {
        resetAc(currentPage)
      }
    } else {
      currentPage = currentPage;
    }
    // console.log(currentPage,'currentPage111++++++++++')
    isShow(currentPage);
    SDK.setEventLock();
    rightClick = true;
  })

  //点击左切换按钮
  let leftClick = true;
  $(".leftBtnBg").on('click touchstart', function(e) {
    $('.source-audio img').attr('src', './image/btn-audio.png')
    if (e.type == "touchstart") {
      e.preventDefault()
    }
    if (currentPage > 0) {
      currentPage--;

    } else {
      currentPage = 0;
      return
    }

    if (leftClick) {
      leftClick = false;
      if (!isSync) {
        $(this).trigger('syncLeftClick');
        return
      }

      SDK.bindSyncEvt({
        index: $(e.currentTarget).data('syncactions'),
        eventType: 'click',
        method: 'event',
        syncName: 'syncLeftClick',
        recoveryMode: '1',
        otherInfor: {
          currentPage: currentPage
        }
      });
    }
  })

  $(".leftBtnBg").on('syncLeftClick', function(e, message) {
    if (isSync) {
      let obj = message.data[0].value.syncAction.otherInfor;
      currentPage = obj.currentPage;
      if (message.operate == 5) {
        resetAc(currentPage)
      }
    } else {
      currentPage = currentPage;
    }

    isShow(currentPage);
    SDK.setEventLock();
    leftClick = true;
  })

  //点击标识页码按钮
  let pageBtn = true;
  $('.changeBtn').on('click touchstart', function(e) {
    $('.source-audio img').attr('src', './image/btn-audio.png')
    if (e.type == "touchstart") {
      e.preventDefault()
    }
    currentPage = $(this).text() - 1;
    if (pageBtn) {
      pageBtn = false;
      if (!isSync) {
        $(this).trigger('syncPagebtnClick');
        return
      }

      SDK.bindSyncEvt({
        index: $(e.currentTarget).data('syncactions'),
        eventType: 'click',
        method: 'event',
        syncName: 'syncPagebtnClick',
        recoveryMode: '1',
        otherInfor: {
          currentPage: currentPage
        }
      });
    }
  })

  $('.changeBtn').on('syncPagebtnClick', function(e, message) {
      if (isSync) {
        let obj = message.data[0].value.syncAction.otherInfor;
        currentPage = obj.currentPage;
        if (message.operate == 5) {
          resetAc(currentPage)
        }
      } else {
        currentPage = currentPage;
      }

      isShow(currentPage);
      SDK.setEventLock();
      pageBtn = true;

    })
    //页面展示内容
  function isShow(currentPage) {
    if (options[currentPage].themePic != '') {
      $(".pic img").css({
        display: "block"
      })
      $(".showImg").attr('src', options[currentPage].themePic);
    } else {
      $(".showImg").attr('src', 'image/img.jpg');
    }
    if (options[currentPage].audio != '') {
      $(".source-audio").css({
        display: "block"
      })
      $(".showAudio").attr('src', options[currentPage].audio);
    } else {
      $(".source-audio").css({
        display: "none"
      })
    }


    let btns = $(".changeBtn ");
    for (let i = 0; i < btns.length; i++) {
      if (i == currentPage) {
        btns.eq(i).addClass('active')
      } else {
        btns.eq(i).removeClass('active')
      }
    }

    if (currentPage == options.length - 1) {
      setBtnStyle(0.5, 1)
    } else if (currentPage == 0) {
      setBtnStyle(1, 0.5)
    } else {
      setBtnStyle(1, 1)
    }
  }

  function setBtnStyle(num1, num2) {
    let rightBtn = $(".rightBtnBg")
    let leftBtn = $(".leftBtnBg")
    rightBtn.css({
      'opacity': num1
    })
    leftBtn.css({
      'opacity': num2
    })
  }



  function resetAc(currentPage) {
    $(".showImg").attr('src', options[currentPage].themePic);
    if (options[currentPage].audio != '') {
      $(".source-audio").css({
        display: "block"
      })
      $(".showAudio").attr('src', options[currentPage].audio);
    }
  }
})