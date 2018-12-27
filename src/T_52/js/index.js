"use strict"
import '../../common/js/common_1v1.js'
$(function () {
  window.h5Template = {
    hasPractice: '0'
  }
  let h5SyncActions = parent.window.h5SyncActions;
  let options = configData.source.options;
  const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
  let source = configData.source

  const page = {
    showOption: function () {
      let html = ''
      for (let i = 0; i < 50; i++) {
        html += `<li class="list" data-syncactions="list${i}">
 
        </li>`
      }
      $(".mainArea").append('<ul>' + html + '</ul>')
    },
    showAudioArea: function () {
      for (let i = 0; i < options.length; i++) {
        let html = `<div class="audioList" data_id="${i}">
                      <img src="image/btn-audio.png" />
                      <audio class="audioSrc" webkit-playsinline controls src="${options[i].audio}"></audio>
                    </div>`
        $(".list").eq(options[i].pos-1).append(html)
      }
    },
    init: function () {
      this.showOption()
      this.showAudioArea()
    }
  }
  page.init()

  //点击播放音频
  let openAudio = true;
  $(".list").on("click touchend", function (e) {
    //  e.stopPropagation();
    if (e.type == "touchend") {
      e.preventDefault()
    }
    // console.log("ok")
    let audios = $(this).find('audio');

    if(audios.length==0){
      return
    }
    if (openAudio) {
      openAudio = false;
      if (!isSync) {
        $(this).trigger("syncAudioClick");
        return;
      }
      SDK.bindSyncEvt({
        sendUser: '',
        receiveUser: '',
        index: $(e.currentTarget).data('syncactions'),
        eventType: 'click',
        method: 'event',
        syncName: 'syncAudioClick',
        funcType: 'audio'
      })
    }
  });

  $(".list").on('syncAudioClick', function (e, message) {
    let index = $(this).find(".audioList").attr("data_id");
    let audios = $(this).find('audio');
    for (let i = 0; i < audios.length; i++) {
      audios.eq(i).attr('src', '')
      $(".list").eq(i).find('img').attr("src", $(this).find("img").attr("src").replace(".gif", ".png"));
    }

    $(this).find('audio').attr('src', options[index].audio)
    var $audio = null;
    $audio = $(this).find("audio")[0];
    var $img = $(this).find("img");
    if (!isSync) {
      // $audio.currentTime=0;
      $audio.play()

      if ($img.length != 0) {
        $img.attr("src", $(this).find("img").attr("src").replace(".png", ".gif"));
        //播放完毕img状态
        $audio.onended = function () {
          $img.attr("src", $(this).find("img").attr("src").replace(".gif", ".png"));
        }.bind(this);
      }
    } else {
      if ($(window.frameElement).attr('id') === 'h5_course_self_frame' && message.operate != 5) {
        // $audio.currentTime=0;
        $audio.play()

        if ($img.length != 0) {
          $img.attr("src", $(this).find("img").attr("src").replace(".png", ".gif"));
          //播放完毕img状态
          $audio.onended = function () {
            $img.attr("src", $(this).find("img").attr("src").replace(".gif", ".png"));
          }.bind(this);
        }
      }
    }
    SDK.setEventLock();
    openAudio = true;
  })
})



