/**
 * 数据埋点逻辑处理
 */

~ function () {

    var h5SyncActions = parent.window.h5SyncActions;
    
    if (h5SyncActions && h5SyncActions.isSync) {
        
        var h5SyncActions = parent.window.h5SyncActions;
        var classConf = h5SyncActions.classConf;
        var iframeSrc = $(window.frameElement).attr('src');
        // var trackingUrl = 'https://mercury.51talk.com/c/t.gif';
        var trackingUrl = 'http://logservice.51talk.com/coursewareactionlog';
        var host = parent.window.h5SyncActions.classConf.course.H5HostUrl;
        var protocol = window.location.protocol;

        trackingUrl = protocol + '//' + host + '/coursewareactionlog';

        var tracking = {

            /**
             *  要发送的数据对象(顺序必须固定):
             *  文档：http://123.56.15.24:4567/mercury/mercury-architecture/course/deploy
             */
            //
            trackingInfo: {
                topic: 'jp.000001',
                lessonid: classConf.course.id,
                teaid: classConf.appointMemberList[0].uid,
                uid: '',
                ac: navigator.platform,
                tplate: '',
                model: 'page',
                pageid: escape(iframeSrc),
                ope: '',
                action: '',
                value: '',
                note: '',
                ver: '20171109',
                rand: ''
            },

            // 初始化/刚进入时候发送的数据
            init: function (data, tpl) {

                try {

                    // console.log('tracking init ----- 111');
                    // console.log(data);
                    // console.log('tracking init ----- 222');

                    var status = data.h5Course.classStatus;
                    
                    tracking.trackingInfo.tplate = tpl.tplate;
                    tracking.trackingInfo.ope = data.user.type;
                    tracking.trackingInfo.uid = classConf.user.type == 'stu' ? classConf.user.id : '';
                    tracking.trackingInfo.action = 'open';
                    tracking.trackingInfo.note = 'less_status=' + data.h5Course.classStatus;
                    tracking.trackingInfo.rand = Math.floor(Math.random()*1000000);
    
                    $.get(trackingUrl, tracking.trackingInfo, function (res) {
                        if ( res.code == '1' ) {
                            console.log('H5_template_init_tracking: 埋点请求调用成功！');
                        }
                    });

                } catch (e) {
                    console.log(e);
                }

            },

            // 发送埋点数据
            sendTrackingInfo: function (data, type) {
                
                // console.log('-----sendTrackingInfo  111 data------');
                // console.log(data);
                // console.log('-----sendTrackingInfo  222 data------');

                if ( data.sendUser != classConf.user.id ) {
                    return;
                }
                
                tracking.trackingInfo.uid = data.user.type == 'stu' ? data.user.id : '';
                // tracking.trackingInfo.tplate = data.tplate;
                // tracking.trackingInfo.ope = data.user.type;
                tracking.trackingInfo.action = data.questionType;
                tracking.trackingInfo.note = 'less_status=' + h5SyncActions.classConf.h5Course.classStatus;
                tracking.trackingInfo.rand = Math.floor(Math.random()*1000000);

                /**
                 * 结果未知的类型 value: ''
                 */
                var syncTypes = ['TMV', 'TSP', 'TCA', 'TRA', 'TUD', 'THP', 'TAP', 'TGR', 'TOV', 'THI', 'TCP', 'TSP'];
                
                /***
                  * 单次动作就会产生结果的类型  value: 0/1
                  */
                var cTypes = ['TCH', 'TUC', 'TUD', 'AHI']

                if ( type == 'sync' ) {

                    // tracking.trackingInfo.value = '3';

                    if( syncTypes.indexOf(tracking.trackingInfo.action) != -1 ) {
                        tracking.trackingInfo.value = '3';
                    }

                } else {

                    var isRight

                    if ( !data.syncAction.resultData) {
                        isRight = undefined
                    } else {
                        isRight = data.syncAction.resultData.isRight
                    }

                    /**
                     * 答对的情况下，TCH、TUC、TUD、AHI类型（AHI是语音打分模板）的模板 value=1；TDR类型的value=4（已答）
                     */
                    if ( isRight ) {

                        if ( cTypes.indexOf(tracking.trackingInfo.action) != -1 ) {
                            tracking.trackingInfo.value = '1'
                        }

                        if ( tracking.trackingInfo.action == 'TDR' ) {
                            tracking.trackingInfo.value = '4'
                        }

                    } else {
                        /**
                         * 答错的情况下，
                         */


                    }

                    /////////////////////////////////////////////////////////////////////////////

                    if ( isRight ) {
                        if ( qTypes.indexOf(tracking.trackingInfo.action) != -1 ) {
                            tracking.trackingInfo.value = '2';
                        } else {
                            tracking.trackingInfo.value = '1';
                        }

                    } else if ( isRight == undefined ) {
                        tracking.trackingInfo.value = 2;
                    } else {
                        tracking.trackingInfo.value = 0;
                    }
                }

                $.get(trackingUrl, tracking.trackingInfo, function (res) {
                    if ( res.code == '1' ) {
                        console.log('H5_template_action_tracking: 埋点请求调用成功！');
                    }
                });

            },

            // 发送控制器数据
            sendControllerTracking: function (type, obj) {

                if ( type == 'rank' ) {
                    tracking.trackingInfo.action = 'ranking';
                    tracking.trackingInfo.value = obj;
                    // tracking.trackingInfo.value = JSON.stringify(obj);
                } else if ( type == 'authorize' ) {
                    tracking.trackingInfo.action = 'authorize';
                    tracking.trackingInfo.value = 'true';
                } else if ( type == 'call' ) {
                    tracking.trackingInfo.action = 'call';
                    tracking.trackingInfo.value = '';
                } else if ( type == 'star' ) {
                    tracking.trackingInfo.action = 'star';
                    tracking.trackingInfo.value = '';
                }
                
                tracking.trackingInfo.ope = 'tea';
                tracking.trackingInfo.uid = '';
                tracking.trackingInfo.note = 'less_status=' + h5SyncActions.classConf.h5Course.classStatus;
                tracking.trackingInfo.status = h5SyncActions.classConf.h5Course.classStatus;
                tracking.trackingInfo.rand = Math.floor(Math.random()*1000000);

                $.get(trackingUrl, tracking.trackingInfo, function (res) {
                    if ( res.code == '1' ) {
                        console.log('H5_template_controller_tracking: 埋点请求调用成功！');
                    }
                });

            },
            
            // 同步答题
            sendTrackingEvt: function (data) {
                console.log('-----Tracking Evt------%s', JSON.stringify(data));
            },

        }

        window.Tracking = tracking;

    } else {

    }

}()