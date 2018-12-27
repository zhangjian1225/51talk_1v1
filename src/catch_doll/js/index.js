"use strict"
import '../../common/js/common-2.js'
import './sync.js'

$(function(){
    var h5SyncActions = parent.window.h5SyncActions;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    /**
     * 创建dom
    */
    let animateHtml = ''
    let animeteSource = configData.source.animateList;
    for (let i = 0; i<animeteSource.length; i++) {
        animateHtml += `<img src="${animeteSource[i].img}" class="e_${i+1}">`
    }
   $('.animate').html(animateHtml)
    /**
     * 点击按钮
     */
    let itemClick = true;
    $('.button').on('click touchstart', function (e) {
        if(e.type=="touchstart"){
            e.preventDefault()
        }
        e.stopPropagation();
        if(itemClick){
            itemClick = false;
            if(!isSync){
                $(this).trigger('BUttonClick')
                return;
            }
            if(window.frameElement.getAttribute('user_type') == 'tea') {
                SDK.bindSyncEvt({
                    index: $(e.currentTarget).data('syncactions'),
                    eventType: 'click',
                    method: 'event',
                    funcType: 'audio',
                    syncName: 'BUttonClick'
                });
            } else {
                $(this).trigger('BUttonClick');
                return;
            }
        }
    })
})
