(function() {

  var h5SyncActions = parent.window.h5SyncActions;

  if (h5SyncActions && h5SyncActions.isSync) {

    // 只在当前iframe下初始化埋点数据
    // if ( $(window.frameElement).attr('id') === 'h5_course_self_frame' ) {

    //     console.log('-------tracking init start-------00000000000-');

    //     Tracking.init(h5SyncActions.classConf);
    // }

    var sdk = {

      /**
       * 获取配置信息
       */
      getClassConf: function() {
        return h5SyncActions.classConf;
      },

      getUserType: function() {
        return this.getClassConf().user.type;
      },

      /**
       * 构建发送数据
       */
      buildSvcMsgData: function(obj, type) {

        console.log('buildSvcMsgData-------------------------');
        console.log(obj);

        var classConf = this.getClassConf();
        var classStatus = classConf.h5Course.classStatus;
        var message = {};
        switch (type) {
          case 'recordAudio':
            var syncAction = {
              otherInfor: obj.otherInfor
            };
            var receiveUser = '';
            var sendUser = '';
            if (obj.sendUser != obj.receiveUser) {
              sendUser = obj.sendUser;
              receiveUser = obj.receiveUser;
            } else {
              sendUser = classConf.user.id;
              receiveUser = classConf.user.id;
            }
            message = {
              syncAction: syncAction,
              sendUser: sendUser,
              receiveUser: receiveUser,
              classStatus: classStatus,
              type: 'recordAudio',
              questionType: obj.questionType ? obj.questionType : '',
              recoveryMode: obj.recoveryMode == undefined ? '' : obj.recoveryMode,
              tplate: obj.tplate
            };
            break;
          case 'sync':
            var syncAction = {
              index: obj.index,
              syncName: obj.syncName,
              funcType: obj.funcType,
              otherInfor: obj.otherInfor == undefined ? '' : obj.otherInfor
            };
            var receiveUser = '';
            var sendUser = '';
            var sendUserInfo = '';
            var starSend = '';

            if (obj.method == 'drag') {
              syncAction = {
                index: obj.index,
                syncName: obj.syncName,
                left: obj.left,
                top: obj.top,
                pageX: obj.pageX,
                pageY: obj.pageY,
                otherInfor: obj.otherInfor == undefined ? '' : obj.otherInfor
              };
            }

            if (obj.sendUser != obj.receiveUser) {
              sendUser = obj.sendUser;
              receiveUser = obj.receiveUser;
              sendUserInfo = obj.sendUserInfo;
              starSend = obj.starSend;
            } else {
              sendUser = classConf.user.id;
              receiveUser = classConf.user.id;
              sendUserInfo = classConf.user;
              starSend = '0';
            }

            message = {
              method: obj.method ? obj.method : '',
              syncAction: syncAction,
              user: classConf.user,
              sendUser: sendUser,
              receiveUser: receiveUser,
              sendUserInfo: sendUserInfo,
              classStatus: classStatus,
              starSend: starSend,
              type: 'sync',
              questionType: obj.questionType ? obj.questionType : '',
              recoveryMode: obj.recoveryMode == undefined ? '' : obj.recoveryMode,
              tplate: obj.tplate
            };
            break;
          case 'resultSync':

            var receiveUser = obj.receiveUser;
            var sendUser = obj.sendUser;
            var sendUserInfo = obj.sendUserInfo;
            var starSend = obj.starSend;

            // if(obj.sendUser != obj.receiveUser) {
            //     receiveUser = obj.receiveUser;
            // } else {
            //     receiveUser = classConf.user.id;
            // }

            message = {
              syncAction: {
                index: obj.index,
                resultData: obj.resultData,
                syncName: obj.syncName
              },
              user: classConf.user,
              sendUser: sendUser,
              receiveUser: receiveUser,
              sendUserInfo: sendUserInfo,
              classStatus: classStatus,
              starSend: starSend,
              type: 'resultSync',
              questionType: obj.questionType ? obj.questionType : '',
              tplate: obj.tplate,
              operate: obj.operate
            };
            // console.log('resultSync 22222222222222222-----333333333333------------------------------>%s', JSON.stringify(message));

            break;
          default:
            message = {};
        }

        console.log('sdk sendTrackingInfo----------qTypes----------');
        var qTypes = ['TM', 'TS', 'TF', 'TX', 'T', 'TB', 'TD'];
        if (type == 'sync') {
          if (qTypes.indexOf(message.questionType) != -1 && h5SyncActions.classConf.h5Course.classStatus != '0') {
            Tracking.sendTrackingInfo(message, type);
          }
        } else if (type == 'resultSync') {
          if (h5SyncActions.classConf.h5Course.classStatus == '2') {
            Tracking.sendTrackingInfo(message, type);
          }
        }

        // console.log('buildSvcMsgData 22222222222222222-----333333333333------------------------------');
        // console.log(message);

        return h5SyncActions.buildSvcMsgData(message, type);
      },

      actEvent: function(message) {
        var method = message.data[0].value.method;
        var syncAction = message.data[0].value.syncAction;
        var index = syncAction.index;
        var syncName = syncAction.syncName;

        //现在这个状态做断线恢复用
        if (message.operate == '5') {
          if (this.recover) {
            this.syncData = syncAction.otherInfor;
            this.recover(this.syncData);
            return false;
          } else {
            console.warn("断线重连方法缺失，请实现断线重连方法");
          }
        }

        //事件触发目标元素target 
        var targetEle = $("[data-syncactions=" + index + "]");

        if (method == 'event') {
          targetEle.trigger(syncName, message);
          return false;
        }

        if (method == 'drag') {
          var pos = {
            left: syncAction.left,
            top: syncAction.top,
            pageX: syncAction.pageX,
            pageY: syncAction.pageY,
            otherInfor: syncAction.otherInfor,
            operate: message.operate
          };
          targetEle.trigger(syncName, pos);
          return false;
        }
      },

      bindSyncRecord: function(obj) {
        var message = this.buildSvcMsgData(obj, 'recordAudio');

        var classStatus = message.data[0].value.classStatus;
        if (classStatus == '1' || classStatus == '2') {
          h5SyncActions.addSendMessage(message);
          // h5SyncActions.addEventQueue(message); // trigger event click ---> bindSyncResultEvt

          // console.log('sdk bindSync sendTrackingInfo--------------------');
          // Tracking.sendTrackingInfo(message, type);

        } else {
          h5SyncActions.addEventQueue(message);
        }

      },

      //新添加结果时间触发
      actResultEvent: function(message) {
        // console.log('sdk-----actResultEvent------------>%s', JSON.stringify(message));
        var syncAction = message.data[0].value.syncAction;
        var index = syncAction.index;
        var syncName = syncAction.syncName;
        var syncResultData = syncAction.resultData;

        //事件触发目标元素target
        var targetEle = $("[data-syncresult=" + index + "]");
        //syncResultClick
        targetEle.trigger(syncName, message);
      },

      //页面当前状态数据
      syncData: {},

      //恢复页面状态的方法
      recover: null,

      setEventLock: function() {
        h5SyncActions.setEventUnlocked();
      },

      bindSyncEvt: function(obj) {
        if (this.syncData && Object.keys(this.syncData).length > 0) {
          obj.recoveryMode = 1;
          obj.otherInfor = this.syncData;
        }

        var message = this.buildSvcMsgData(obj, 'sync');

        var classStatus = message.data[0].value.classStatus;
        if (classStatus == '1' || classStatus == '2') {
          h5SyncActions.addSendMessage(message);
          h5SyncActions.addEventQueue(message); // trigger event click ---> bindSyncResultEvt

          // console.log('sdk bindSync sendTrackingInfo--------------------');
          // Tracking.sendTrackingInfo(message, type);

        } else {
          h5SyncActions.addEventQueue(message);
        }
      },

      //新添加结果同步数据封装
      bindSyncResultEvt: function(obj) {

        // console.log('sdk bindSyncResultEvt------------->%s', JSON.stringify(obj));
        //debugger;
        var message = this.buildSvcMsgData(obj, 'resultSync');

        var classStatus = message.data[0].value.classStatus;
        if (classStatus == '2') {
          // h5SyncActions.addSendMessage(message);
          h5SyncActions.addEventQueue(message);

          // console.log('sdk bindSyncResult sendTrackingInfo--------------------');
          // Tracking.sendTrackingInfo(message, type);

        }
      },

      // 发送榜单数据
      /*
          type: 数据类型
          obj: 发送的数据
      */
      sendControllerTracking: function(type, obj) {

        Tracking.sendControllerTracking(type, obj);

      }

    };
    window.SDK = sdk;
  } else {
    window.SDK = {
      getUserType: function() {
        return "tea";
      },
      //页面当前状态数据
      syncData: {},
      setEventLock: function() {},
      log: function() {
        console.log('---------sdk log------------');
      }
    };
  }
})();