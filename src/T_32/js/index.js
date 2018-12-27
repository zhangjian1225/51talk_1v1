"use strict"
import '../../common/js/common_1v1.js'
import '../../common/js/commonFunctions.js'
const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;

$(function() {

  // 埋点：进入页面
  var h5SyncActions = parent.window.h5SyncActions;
  var tracking_item = JSON.stringify({
    id: 'LLLLL0001',
    content: configData.source.text
  })
  console.log("tracking_item: ", tracking_item)

  if ($(window.frameElement).attr('id') === 'h5_course_self_frame') {
    // Tracking.init(h5SyncActions.classConf, {
    // 	tplate: 'TC008'
    // });
    parent.window.dataReport.tracking && parent.window.dataReport.tracking.init({
      tplate: 'TCH0001',
      item: tracking_item
    });
  }
  /**
   * 控制器调用的变量
   */
  window.h5Template = {
    hasPractice: '1' // 是否有授权按钮 1：是 0：否
  }
  let items = configData.source.items,
    rightItem = configData.source.rightItem, // 正确选项
    exampleImg = configData.source.example,
    text = configData.source.text,
    audio = configData.source.audio;

  // DOM 初始化
  ~ function() {
    // 渲染选项
    $('.content .pic').each((i, n) => {
      $(n).attr('src', items[i].img);
    })
    $('.example .example-pic').attr('src', exampleImg);
    $('.example-text').html(text);
    $('.example audio').attr('src', audio);

    if (exampleImg) {
      $('.example').css('background', '#fff');
    }
    if (!audio) {
      $('.example-audio').hide();
    }
    if (text) {
      $('.example').addClass('text');
      $('.example .example-pic').hide();
      $('.example .example-text').css('display', 'flex');
      $('.example').css('background', '');

      if (text.length <= 15) {
        $('.example .example-text').css('justify-content', 'center');
      }

      // if( text.length <= 6 ) {
      // 	$('.example-text').css('fontSize', '.72rem');
      // }else if( 6 < text.length && text.length <= 10 ) {
      // 	$('.example-text').css('fontSize', '.52rem');
      // }else if( 10 < text.length ) {
      // 	$('.example-text').css('fontSize', '.36rem');
      // }
    } else {
      $('.example .example-text').hide();
    }
    if (audio && !exampleImg && !text) {
      $('.example').addClass('hide');
      $('.example-pic').hide();
      $('.example-text').hide();
      $('.example-audio img').removeClass('small');
      $('.example-audio').css({
        width: '2.1rem',
        height: '1.98rem',
        position: 'absolute',
        top: '0',
        left: '.55rem'
      });
    }
  }()

  let soundClick = true,
    isPlaySound = true;
  $('.sound').on('click touchstart', function(e) {
    if (e.type == "touchstart") {
      e.preventDefault()
    }
    e.stopPropagation();

    if (soundClick) {
      soundClick = false;
      if (!isSync) {
        $(this).trigger('syncSoundClick');
        return;
      }
      if (window.frameElement.getAttribute('user_type') == 'tea') {
        SDK.bindSyncEvt({
          sendUser: '',
          receiveUser: '',
          index: $(e.currentTarget).data('syncactions'),
          eventType: 'click',
          method: 'event',
          syncName: 'syncSoundClick',
          funcType: 'audio'
        });
      } else {
        $(this).trigger('syncSoundClick');
        return;
      }
    }
  })

  $('.sound').on('syncSoundClick', function() {

    let gif = $(this).find('.gif');
    let png = $(this).find('.png');
    let audio = $(this).find('audio')[0];

    if ($(window.frameElement).attr('id') === 'h5_course_self_frame' || !isSync) {

      if (isPlaySound) {
        audio.play();
        gif.show();
        png.hide();
      } else {
        audio.pause();
        gif.hide();
        png.show();
      }
      audio.onended = function() {
        gif.hide();
        png.show();
        isPlaySound = true;
      }.bind(this);

      isPlaySound = !isPlaySound;

    }

    SDK.setEventLock();
    soundClick = true;

  });

  let itemClick = true;
  $('.item').on('click touchstart', function(e) {
    if (e.type == "touchstart") {
      e.preventDefault()
    }
    e.stopPropagation();

    if (itemClick) {
      itemClick = false;

      if (!isSync) {
        $(this).trigger('syncItemClick');
        return
      }
      if (window.frameElement.getAttribute('user_type') == 'stu') {
        SDK.bindSyncEvt({
          sendUser: '',
          receiveUser: '',
          index: $(e.currentTarget).data('syncactions'),
          eventType: 'click',
          method: 'event',
          syncName: 'syncItemClick',
          questionType: 'TCH',
          tplate: 'TCH0001',
          item: tracking_item
        });
      }
    }
  })

  $('.item').on('syncItemClick', function(e, message) {
    // 答对后不可再选择
    if ($(this).hasClass('isRight')) {
      SDK.setEventLock();
      itemClick = false;
      return;
    }

    if ($(this).index() === rightItem) {
      console.log('c-page:----------------%s: 答对了！');
      $('.item').addClass('isRight');
      let mask = $('.shade').eq($(this).index());
      mask.addClass('flex');

      if (isSync) {
        SDK.bindSyncResultEvt({
          sendUser: message.data[0].value.sendUser,
          receiveUser: message.data[0].value.receiveUser,
          sendUserInfo: message.data[0].value.sendUserInfo,
          index: $('#container').data('syncresult'),
          resultData: { isRight: true },
          syncName: 'teaShowResult',
          starSend: message.data[0].value.starSend,
          questionType: 'TCH',
          tplate: 'TCH0001',
          item: tracking_item,
          operate: message.operate
        });
      }
      SDK.setEventLock();
      itemClick = false;
    } else {
      console.log('c-page:----------------%s: 答错了！');
      if ($(window.frameElement).attr('id') === 'h5_course_self_frame' || !isSync) {
        $('.wrong')[0].play();
      }
      $(this).addClass('shake');
      $(this).on('animationend webkitAnimationEnd', function() {
        $(this).removeClass('shake');
        SDK.setEventLock();
        itemClick = true;
      })
      if (isSync) {
        SDK.bindSyncResultEvt({
          sendUser: message.data[0].value.sendUser,
          receiveUser: message.data[0].value.receiveUser,
          sendUserInfo: message.data[0].value.sendUserInfo,
          index: $('#container').data('syncresult'),
          resultData: { isRight: false },
          syncName: 'teaShowResult',
          questionType: 'TCH',
          tplate: 'TCH0001',
          item: tracking_item,
          operate: message.operate
        });
      }
    }

  });
})