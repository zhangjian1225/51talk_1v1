(function($) {  
    var old = $.fn.drag;  
  
    function Drag(element, options) {  
        this.ver = '1.0';  
        this.$element = $(element);  
        this.options = $.extend({}, $.fn.drag.defaults, options);//所有值被合并到这个空对象上，保护了插件里面的默认值。  
        this.init();  
    }  
  
    Drag.prototype = {  
        constructor: Drag,  
        init: function() {  
            var options = this.options;
            var startPosArr = [];//用于盛放初始位置坐标  
            console.log('drag.js:T13===========================dragStart111111')
            this.$element.on('touchstart.drag.founder mousedown.drag.founder', function(e) {  
                // if($('.stu').length > 0){
                //     return
                // }
                console.log('drag.js:T13===========================dragStart2222')
                var ev = e.type == 'touchstart' ? e.originalEvent.touches[0] : e,  
                    startPos = $(this).position(),  
                    disX = ev.pageX - startPos.left,  
                    disY = ev.pageY - startPos.top,  
                    that = $('.bomb');  
  
                //记录 【第一次】 初始位置,以便复位使用
                startPosArr.push(startPos);
                $(this).data('startPos', {
                    left: startPosArr[0].left/base + 'rem',
                    top: startPosArr[0].top/base + 'rem'
                });  
  
                if (options.before && $.isFunction(options.before)) {  
                    options.before.call(that, ev);  
                }  
  
                $(document).on('touchmove.drag.founder mousemove.drag.founder', function(e) {
                    var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e,  
                        $this = $(that),  
                        $parent = $this.offsetParent(),  
                        $parent=$parent.is(':root')?$(window):$parent,  
                        pPos = $parent.offset(),  
                        pPos=pPos?pPos:{left:0,top:0},  
                        left = ev.pageX - disX ,  
                        top = ev.pageY - disY,  
                        r = $parent.width() - $this.outerWidth(true),  
                        d = $parent.height() - $this.outerHeight(true);  
  
                    left = left < 0 ? 0 : left > r ? r : left;  
                    top = top < 0 ? 0 : top > d ? d : top;

                    
                    $(that).css({  
                        left: left/base + 'rem',  
                        top: top/base + 'rem'  
                    });
                    

                    $(that).attr("data-left", left/base + 'rem');
                    $(that).attr("data-top", top/base + 'rem');
  
                    if (options.process && $.isFunction(options.process)) {
                        options.process.call(that, ev);  
                    }  
  
                    e.preventDefault();  
                });  
  
                $(document).on('touchend.drag.founder mouseup.drag.founder', function(e) { 
                    var ev = e.type == 'touchend' ? e.originalEvent.changedTouches[0] : e;  
                    $(document).off('.drag.founder');
                    console.log("drag.js:T13=======================dragEnd");
                    if (options.end && $.isFunction(options.end)) {  
                        options.end.call(that, ev);  
                    }  
                });  
              
                e.preventDefault();  
            });  
        }  
    };  
  
    //jQ插件模式  
    $.fn.drag = function(options) {  
        return this.each(function() {  
            var $this = $(this),  
                instance = $this.data('drag');  
  
            if (!instance) {  
                instance = new Drag(this, options);  
                $this.data('drag', instance);  
            } else {  
                instance.init();  
            }  
  
            if (typeof options === 'string') {  
                //instance.options[options].call(this);  
            }  
  
        });  
    };  
  	//设置默认行为
    $.fn.drag.defaults = {  
        before: $.noop,  
        process: $.noop,  
        end: $.noop  
    };  
  	//释放drag使用权
    $.fn.drag.noConflict = function() {  
        $.fn.drag = old;  
        return this;  
    };  
})(jQuery); 