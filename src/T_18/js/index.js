"use strict"
import '../../common/js/common_1v1.js'

$(function () {
    // ac 内是否显示授权按钮的开关
    window.h5Template = {
        hasPractice: '0'
    }
    const h5SyncActions = parent.window.h5SyncActions;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    /**
     * 创建dom元素
     */
    let source = configData.source
    let styles = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6']
    let [boxs, part, door, person] = [source.boxList, source.part, source.door, source.person]
    let dom = ''

    if (isSync) {
        if (window.frameElement.getAttribute('user_type') == 'tea') {
            $('.hand').css('opacity','1');
        } else {
            $('.hand').css('opacity','0');
        }
    } else {
        $('.hand').css('opacity','1');
    }

    boxs.forEach((item, index) => {
        dom += `<li class="scene scene-${index+1}">
            <img class="scene-img" src="${item.img}">
        </li>`
    })

    $('.person').attr('src', person)
    $('.stage ul').html(dom)
    $('#family').css('display', 'block').addClass(styles[part-1])
    $('#posi').addClass(styles[part])
    if ( door ) {
        $('.door').append('<img src="'+door+'"/>')
    }
    // setTimeout(() => {
    //     $('#family').css('transition', '1.6s').addClass(styles[part])
    // }, 300)
    let curvatures = ['.5', '.3', '.5', '.1', '.2', '.5']
    let [ele, target] = [$('#family')[0], $('#posi')[0]]

    let options = {
        
        speed: 0.01,
        curvature: curvatures[part-1],

        complete: function() {
            console.log('动画完成!')

            $('.hand').off('click touchstart')
            $('.hand').hide()
            $('#family .person').show()

            setTimeout(() => {
                $('#family .person').removeClass('ani')
            })
            $('#family .light').hide()
        }
    }

    let docClick = true
    $('.hand').on('click touchstart', function(e) {
        if( e.type == 'touchstart' ) {
            e.preventDefault()
        }

        if (docClick) {
            docClick = false;
            if (!isSync) {
                $(this).trigger('docClick')
                return
            }
            SDK.bindSyncEvt({
                index: $(e.currentTarget).data('syncactions'),
                eventType: 'click',
                method: 'event',
                funcType: 'audio',
                syncName: 'docClick'
            });
        }
    })

    $(document).on('docClick', function() {

        let parabola = funParabola(ele, target, options).mark();
        $('#family .person').addClass('ani')

        setTimeout(() => {
            $('#family .person').hide();
            $('#family .light').show();
            $('audio').get(0).play();
            parabola.init()
        }, 1000)

    })

})