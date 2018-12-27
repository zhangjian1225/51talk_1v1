"use strict"
import '../../common/js/common_1v1.js'

$(function() {
  window.h5Template = {
    hasPractice: '0'
  }
  let h5SyncActions = parent.window.h5SyncActions;
  const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;

  // 填充内容
  const page = {
    options: configData.source.options,
    setThemePic: function () {
      let img = '';
      $(this.options).each(function (i, arr) {
        img += `<div class="picbox"><img class="showImg" src=""/></div>`
      })

      $(".pic").append(img);
    },
    showInfor: function () {
      let infor = '';
      let that = this
      $(this.options).each(function (i, arr) {
        infor += `<div class="infor">
                          <div class="source-audio" data-syncactions="audioBtn-${i}">
                              <img src="image/btn-audio.png" alt="">
                              <audio class="showAudio" webkit-playsinline controls preload="preload" src="${arr.audio}"></audio>
                          </div>
              ${arr.text}                    
                      </div>`
      })
      $(".source").append(infor)

    },
    showBtn: function () {
      let btn = '';
      for (let i = 0; i < this.options.length; i++) {
        btn += `<span class="changeBtn" data-syncactions="btn-${i}">${i + 1}</span>`;
      }
      $(".pic-btn").append(btn);
    },
    judgeSource: function () {
      $(".changeBtn").eq(0).addClass('active');
      $(this.options).each(function (i, arr) {
        if (arr.audio != '') {
          $(".infor").eq(i).find(".source-audio").css({
            display: 'block'
          })
          $(".infor").eq(i).css({
            'padding-left': '0.8rem',
            'padding-right': '0.5rem'
          })
        } else {
          $(".infor").eq(i).css({
            'padding-left': '0.5rem',
            'padding-right': '0.5rem'
          })
          $(".infor").eq(i).find(".source-audio").css({
            display: 'none'
          })
        }
        if (arr.text == '') {
          $(".infor").eq(i).css({
            'padding-left': '0rem',
            'padding-right': '0rem'
          })

        }
        if (i == 0) {
          if (arr.themePic != '') {
            $('.picbox').eq(0).find('img').attr('src', arr.themePic)
          } else {
            $('.picbox').eq(0).find('img').attr('src', "image/img.jpg")
          }
          $(".infor").eq(i).css({
            display: 'inline-block'
          })
          $('.picbox').eq(i).css({
            opacity: 1
          })
        } else {
          $(".infor").eq(i).css({
            display: 'none'
          })
          $('.picbox').eq(i).css({
            opacity: 0
          })
        }
      })
    },
    init: function () {
      this.setThemePic()
      this.showInfor()
      this.showBtn()
      this.judgeSource()
    }
  }
  page.init();

  // 音频播放
	let audioEle;
	let play = false
	let audioPlay = function(message,currentPage){
		audioEle =$('.showAudio').eq(currentPage).get(0)
		if(!isSync){
			audioEle.play()	
			$('.source-audio img').attr('src','./image/btn-audio.gif')
		}else{
			if($(window.frameElement).attr('id') === 'h5_course_self_frame'){
				if(message==undefined||message.operate==1){
					audioEle.play()	
					$('.source-audio img').attr('src','./image/btn-audio.gif')
				}
			}
		}
	}
	let audioPause = function(message,currentPage){
		if(!isSync){
			audioEle.pause()			
		}else {
			if(message==undefined||message.operate==1){
				audioEle.pause()		
			}
		}
		$('.source-audio img').attr('src','./image/btn-audio.png')
	}
	let currentPage=0;
	let audioClick = true;
	$('.source-audio').on('click',function(e){
		if(audioClick){
			audioClick = false
			if(!isSync){
				$(this).trigger('syncAudioClick')
				return
			}
			if(window.frameElement.getAttribute('user_type') == 'tea'){
				SDK.bindSyncEvt({
					index: $(e.currentTarget).data('syncactions'),
					eventType: 'click',
					method: 'event',
					syncName: 'syncAudioClick',
					funcType:'audio'
				})
			}else{
				$(this).trigger('syncAudioClick')
			}
		}
		
	})

	$('.source-audio').on('syncAudioClick',function(e,message){
		if(play){
			audioPause(message,currentPage)
		}else{
			audioPlay(message,currentPage)
			audioEle.onended = function(){
				rightClick=true
				leftClick=true
				pageBtn=true
				 // play = true
				$('.source-audio img').attr('src','./image/btn-audio.png')
			}
		}
		SDK.setEventLock()
		audioClick = true
  })



  //点击右切换按钮
  let options=configData.source.options;
  let rightClick=true;
  $(".rightBtnBg").on('click touchstart',function(e){
		$('.source-audio img').attr('src','./image/btn-audio.png')
		if (e.type == "touchstart") {
			e.preventDefault()
		}

		if(currentPage<options.length-1){
			currentPage++;
		}else{
			currentPage=options.length-1;
			return
		}

		if(rightClick){
			rightClick=false;
			//判断是否要显示录音按钮

			if(!isSync){
				$(this).trigger('syncRightClick');
				return
			}

			SDK.bindSyncEvt({
				index: $(e.currentTarget).data('syncactions'),
				eventType: 'click',
				method: 'event',
				syncName: 'syncRightClick',
				questionType: 'TB',
                tplate: 'T009',
				recoveryMode:'1',
				otherInfor:{
					currentPage:currentPage
				}
			});
		}
	})

	$(".rightBtnBg").on('syncRightClick',function(e,message){
		if(isSync){
			let obj=message.data[0].value.syncAction.otherInfor;
			currentPage=obj.currentPage;
			if(message.operate==5){
				resetAc(currentPage)
			}
		}else{
			currentPage=currentPage;
		}
		// console.log(currentPage,'currentPage111++++++++++')
		isShow(currentPage);
		SDK.setEventLock();
		rightClick=true;
	})

  //点击左切换按钮
	let leftClick=true;
	$(".leftBtnBg").on('click touchstart',function(e){
		$('.source-audio img').attr('src','./image/btn-audio.png')
		if (e.type == "touchstart") {
			e.preventDefault()
		}

		// console.log(reStart,'+++++++---------')
		if(currentPage>0){
			currentPage--;

		}else{
			currentPage=0;
			return
		}
		if(leftClick){
			leftClick=false;
			if(!isSync){
				$(this).trigger('syncLeftClick');
				return
			}

			SDK.bindSyncEvt({
				index: $(e.currentTarget).data('syncactions'),
				eventType: 'click',
				method: 'event',
				syncName: 'syncLeftClick',
				questionType: 'TB',
                tplate: 'T009',
				recoveryMode:'1',
				otherInfor:{
					currentPage:currentPage
				}
			});
		}
	})

	$(".leftBtnBg").on('syncLeftClick',function(e,message){
		if(isSync){
			let obj=message.data[0].value.syncAction.otherInfor;
			currentPage=obj.currentPage;
			if(message.operate==5){
				resetAc(currentPage)
			}
		}else{
			currentPage=currentPage;
		}

		isShow(currentPage);
		SDK.setEventLock();
		leftClick=true;
	})


  //点击标识页码按钮
	let pageBtn=true;
	$('.changeBtn').on('click touchstart',function(e){
		$('.source-audio img').attr('src','./image/btn-audio.png')
		if (e.type == "touchstart") {
			e.preventDefault()
		}
		currentPage=$(this).text()-1;
		if(pageBtn){
			pageBtn=false;
			if(!isSync){
				$(this).trigger('syncPagebtnClick');
				return
			}

			SDK.bindSyncEvt({
				index: $(e.currentTarget).data('syncactions'),
				eventType: 'click',
				method: 'event',
				syncName: 'syncPagebtnClick',
				questionType: 'TB',
                tplate: 'T009',
				recoveryMode:'1',
				otherInfor:{
					currentPage:currentPage
				}
			});
		}
	})

	$('.changeBtn').on('syncPagebtnClick',function(e,message){
		if(isSync){
			let obj=message.data[0].value.syncAction.otherInfor;
			currentPage=obj.currentPage;
			if(message.operate==5){
				resetAc(currentPage)
			}
		}else{
			currentPage=currentPage;
		}
		isShow(currentPage);
		SDK.setEventLock();
		pageBtn=true;

	})
  //页面展示内容
	function isShow(currentPage){
		if(options[currentPage].themePic!=''){
			$('.picbox').eq(currentPage).find('img').attr('src',options[currentPage].themePic)
		}else{
			$('.picbox').eq(currentPage).find('img').attr('src',"image/img.jpg")
		}
		$(options).each(function(i,arr){
			if(i==currentPage){
				$(".infor").eq(i).css({
					display:'inline-block'
				})
				$('.picbox').eq(i).css({
					opacity:1,
					transition:'all 1s'
				})
			}else{
				$(".infor").eq(i).css({
					display:'none'
				})
				$('.picbox').eq(i).css({
					opacity:0,
					transition:'all 0.6s'
				})
			}
		})

		let btns=$(".changeBtn ");
		for(let i=0;i<btns.length;i++){
			if(i==currentPage){
				btns.eq(i).addClass('active')
			}else{
				btns.eq(i).removeClass('active')
			}
		}

		if(currentPage==options.length-1){
			setBtnStyle(0.5,1)
		}else if(currentPage==0){
			setBtnStyle(1,0.5)
		}else{
			setBtnStyle(1,1)
		}
	}
	function setBtnStyle(num1,num2){
		let rightBtn=$(".rightBtnBg")
		let leftBtn=$(".leftBtnBg")
		rightBtn.css({
			'opacity':num1
		})
		leftBtn.css({
			'opacity':num2
		})
	}

	function resetAc(currentPage){
		$('.picbox').eq(currentPage).css({opacity:1})
		$(".showImg").attr('src',options[currentPage].themePic);
		if(options[currentPage].audio!=''){
			$(".source-audio").css({
				display:"block"
			})
			$(".showAudio").attr('src',options[currentPage].audio);
		}
	}

  
})