~ function () {
	var recordevents={
		timer:null,
		reStart:true, //表示录音状态
		recordIndex:0,//标记录音目标
		startBtn:null,   
		recordBtn:null,
		startIcon:null,
		courseStatus:0,
		recordText:'',  //录音文案
		recordTime:null, //录音时长
		recordAction:'0',  //录音状态 默认为0  0是停止录音  1是开始录音 2是人为中断
		isSync: parent.window.h5SyncActions && parent.window.h5SyncActions.isSync,
		createRcordBtn:function(arr){
			let btn=`
				<div class="recordBtn" id="h5_record_btn">
		            <div class="startBtn"></div>
		            <div class="statusIcon statusOff">10</div>
		        </div>
			`
			if($(".recordBtn").length>=1){
				
			}else{
				if(recordevents.isSync&&$(window.frameElement).attr('id')=="h5_course_self_frame"){
					// console.log("ok+++++++",SDK.getClassConf().h5Course.classStatus,recordevents.courseStatus)
					 $('body').append(btn);
					recordevents.courseStatus=SDK.getClassConf().h5Course.classStatus
					if(recordevents.courseStatus!=0&&window.frameElement.getAttribute('user_type') == 'stu'){
						$(".recordBtn").css({
							'display':'none'
						})
					}
				}
			}
			recordevents.startBtn=$("#h5_record_btn .startBtn");
			recordevents.recordBtn=$("#h5_record_btn");
			recordevents.startIcon=$(".statusIcon");
			this.bindRecordEvt(arr);
		},
		bindRecordEvt:function (options) {
			let that=this

			recordevents.recordBtn.drag();

			recordevents.startBtn.bind('mousedown', function(e){e.stopPropagation() })
			recordevents.startBtn.bind('mousemove', function(e){e.stopPropagation() })
			recordevents.startBtn.bind('mouseout', function(e){e.stopPropagation() })

			recordevents.startBtn.unbind().bind('click',function(e){
				recordevents.recordText=options[recordevents.recordIndex].words;
				recordevents.recordTime=options[recordevents.recordIndex].timeLong;
				recordevents.startIcon.text(recordevents.recordTime)//初始化倒计时
				if(recordevents.reStart){ 	//"开始倒计时"
					recordevents.reStart=false;
					recordevents.recordAction='1';
					recordevents.startBtn.addClass("stopBtn");
					that.timeCountdown(recordevents.recordTime);
					
					that.syncStartRecordEvent(); //同步开始录音
				}else{ 
					recordevents.reStart=true;
					recordevents.recordAction='0';  //老师中断录音
					recordevents.startIcon.addClass("statusOff")
					recordevents.startBtn.removeClass("stopBtn")
					clearInterval(recordevents.timer);
					
					that.syncStartRecordEvent(); //同步停止录音
				}
			});
		},
		timeCountdown:function (time) {
			let that=this;//根据设置时间自动停止录音
			recordevents.startIcon.removeClass("statusOff")

			recordevents.timer=setInterval(function(){
				recordevents.recordTime--;
				recordevents.startIcon.text(recordevents.recordTime)
				if(recordevents.recordTime<=0){
					clearInterval(recordevents.timer);
					recordevents.startIcon.addClass("statusOff")
					recordevents.reStart=true;
					recordevents.recordAction='0';
					recordevents.startBtn.removeClass("stopBtn")
					//that.syncStartRecordEvent()     //同步停止录音
				}
			},1000)
		},
		isShowRecord:function (style) {
			//if(SDK.getUserType() == 'tea') {
				if(style){
					recordevents.recordBtn.removeClass('hide')
				}else{
					recordevents.recordBtn.addClass('hide')
				}
			//}
		},
		stopClick:function () {
			recordevents.recordBtn.addClass('shake_tip')
			recordevents.recordBtn.on('animationend  webkitAnimationEnd', function() {
				recordevents.recordBtn.removeClass('shake_tip')
			});
		},
		getRecordIndex:function (index) {
			recordevents.recordIndex=index;  //更新对应录音的序列
		},
		syncStartRecordEvent:function () {
			SDK.bindSyncRecord({
				questionType: '',
                tplate: '',
				recoveryMode:'',
				otherInfor:{
					text:recordevents.recordText,
					maxTime:recordevents.recordTime,
					action:recordevents.recordAction
				}
			})
		},
	}
	window.recordEvents=recordevents
}()

