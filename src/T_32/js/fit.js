(function (doc, win) {
    window.base = document.documentElement.clientWidth / 1920;
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            window.clientWidth = docEl.clientWidth;
            window.clientHeight = docEl.clientHeight;
            var aspectRatio = window.clientWidth/window.clientHeight;
            if(aspectRatio > 1920 / 1080){
                docEl.style.fontSize = 100 * (window.clientHeight / 1080) + 'px';
                window.base = 100 * (window.clientHeight / 1080); 
            }else{
                docEl.style.fontSize = 100 * (window.clientWidth / 1920) + 'px';
                window.base = 100 * (window.clientWidth / 1920);  
            }
        };
    recalc();
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);