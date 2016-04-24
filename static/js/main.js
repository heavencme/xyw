(function($){
/* start */

var container = $('#home');
var g_ripples = [];
var g_rainbow = ["#F00", "#F60", "#FF0", "#0C0", "#699", "#06C", "#909"];
var g_pageLinkArr = [];
var g_pageLinkIndex = g_pageLinkArr.length;

initDairy();


/* modal options */
$('.modal-trigger').leanModal({
    dismissible: true, 
    opacity: .5, 
    in_duration: 50, 
    out_duration: 100, 
    ready: function() { 

    }, 
    complete: function() { 
        
    } 
});

/*modal content submit */
$('#modal-bug-submit').click(function(e){
  if( ! textLenValidate('modal-bug-text', 500) ) {
    return;
  }

  var now = new Date();

  $.ajax({
    url: "/data/write",
    method: "POST",
    data: { 
        timeStamp: now.getTime(),
        time: now.Format("yyyy-MM-dd hh:mm:ss"),
        msg: $('#modal-bug-text').val(),
        passCode: $('#password').val()
    },
    success: function(ret) {
        if(ret.status == 'ok') {
            genPage(ret.data.ops);
        }

        $('#modal-bug').closeModal();
    },
    error: function(e){
        alert('呃……服务器被我关了');
    }
  });
});

/*get dairy data*/
function initDairy() {
    $.ajax({
        url: "/data/read",
        method: "POST",
        data: { 
            queryCode: 'init' 
        },
        success: function(ret){
            //console.log(data);
            if (ret.data && ret.data.length > 0) {
                //console.log(ret.data);
                genPage(ret.data);
            }

            //register ripple effects
            var bodyTouch=new Touch($("#home")[0]);
            bodyTouch.setTouchEvent();

            //register page link
            regPageLink(".dairy-pad", "#page-link");
            genPageLink("#page-link");
        },
        error: function(e){
            alert('呃……服务器被我关了');
        }
    });
}

/* ripple effect */
$(".ripple-btn").click(addRippleEffect);
function addRippleEffect(e) {
    var target = e.target;
    if (target.tagName.toLowerCase() !== 'div') {
        return ;
    }
    var rect = target.getBoundingClientRect();
    var ripple = target.querySelector('.ripple');
    if (!ripple) {
        ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
        target.appendChild(ripple);
    }
    ripple.classList.remove('show');
    var top = e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop;
    var left = e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft;
    ripple.style.top = top + 'px';
    ripple.style.left = left + 'px';
    ripple.classList.add('show');
    return false;
}

function createRipple(x, y) {
    var ripple = $('<div class="ripple-outer"></div><div class="ripple-inner"></div>');
    ripple.css({
        left: x -25,
        top: y - 25
    });

    var max = 26;
    var i = 0;
    var arrLen = g_ripples.length;
    var tmpRipple;
    
    if ( arrLen > max) {
        for (i = 1; i < arrLen; i += 2 ) {

            /* array splice cause obj die, and remove will be undefined*/
            g_ripples[i].remove();

            tmpRipple = g_ripples.splice(i, 1);
            arrLen --;
        }
    }

    
    ripple.appendTo(container);
    
    setTimeout(function () {
        ripple.remove();
    }, 1500);

    g_ripples.push(ripple);
   
};

/* Common functions */

/* validate text length */
function textLenValidate(tarId, len) {
    var tarStr = $('#'+tarId).val();
    if (tarStr.length <= len) {
        return true;
    }
    else {
        return false;
    }
}

/* input len count */
function inputLenCount(ipnutId, maxLen) {
    var outObj = $('#'+ipnutId+'-warning');
    var inObj = $('#'+ipnutId);

    

    inObj.keyup(function(){
        var inLen = inObj.val().length;
        
        if (inLen > maxLen) {
            outObj.css( "color", "red" );
            g_input[isValid] = false;
        }
        else {
            g_input[ ipnutId.replace(/-/g,"_") ] = inObj.val();
        }
        outObj.text("已输入" + inLen + "/" + maxLen);
    });
}

/* set cookie and its expiredays*/
function setCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";    
}

/* get cookie */
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}

function genPage(dairyArr) {
    // in case of single data
    if ( ! isArray(dairyArr) ) {
        dairyArr = [dairyArr];     
    }

    var htmlStr;
    var templateStr = ' \
        <div class="col dairy-pad" id="dairy-index" num="dairy-id"> \
          <div class="card"> \
            <span class="card-title">dairy-time</span> \
            <div class="card-content"> \
              <p> \
                dairy-msg \
                <i class="grey-text right">#dairy-index</i> \
              </p> \
            </div> \
          </div> \
        </div>';

    for (var i in dairyArr) {
        htmlStr = templateStr.replace(/dairy-time/g, dairyArr[i]['time']);
        htmlStr = htmlStr.replace(/dairy-msg/g, dairyArr[i]['msg']);
        htmlStr = htmlStr.replace(/dairy-id/g, dairyArr[i]['_id']); 
        htmlStr = htmlStr.replace( /dairy-index/g, i); 

        $("#lh-main").prepend(htmlStr);   
    }
}

function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

Date.prototype.Format = function(fmt) {
    var o = {   
        "M+" : this.getMonth()+1,                 //月份   
        "d+" : this.getDate(),                    //日   
        "h+" : this.getHours(),                   //小时   
        "m+" : this.getMinutes(),                 //分   
        "s+" : this.getSeconds(),                 //秒   
        "q+" : Math.floor((this.getMonth()+3)/3), //季度   
        "S"  : this.getMilliseconds()             //毫秒   
    }; 

    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
    }
    
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
        }   
    }
    return fmt;   
} 

//page link
function regPageLink(target, appendTar){
    $(target).click(function(){
        var clickTarId = $(this).attr("id");

        console.log('regPageLink: '+ clickTarId);
        //guard judge
        for (var i in g_pageLinkArr) {
            if ( g_pageLinkArr[i] == clickTarId ) {
                $( "#" + g_pageLinkArr[i] ).children()
                    .find(".grey-text")
                    .attr("style", "");

                console.log('i: '+i);
                console.log('g_pageLinkIndex: ' + g_pageLinkIndex);
                console.log('clickTarId: ' + clickTarId);
                console.log('g_pageLinkArr: ' + g_pageLinkArr);

                console.log('-- regPageLink guard');

                g_pageLinkArr.splice(i,1);
                flushPageLinkToCookie();

                $("#page-link").children()[i].remove();
                g_pageLinkIndex --;
                if( g_pageLinkIndex < 0){
                    g_pageLinkIndex = g_rainbow.length - 1;
                }

                

                return;
            }
        }

        var pageLinkNum = g_rainbow.length;

        var htmlStr = '\
            <a href="#dairy-index" class="btn-floating btn-small waves-effect waves-light z-depth-2" style="background:dairy-link-color"> \
                dairy-index \
            </a>';

        var curColor = g_rainbow[g_pageLinkIndex];    
        
        htmlStr = htmlStr.replace( /dairy-index/g, clickTarId); 
        htmlStr = htmlStr.replace( /dairy-link-color/g, curColor);

        $(appendTar).append(htmlStr);

        g_pageLinkArr.push(clickTarId);
        console.log('fine: push' + g_pageLinkArr);
        flushPageLinkToCookie();

        console.log('-- regPageLink fine');

        //marked color
        $(this).children().find(".grey-text").attr("style", "background:" + curColor + ";");

        //keep balance
        if (pageLinkNum <= g_pageLinkArr.length) {
            $("#page-link").children()[0].remove();

            //clear over-weight marked color
            $( "#" + g_pageLinkArr[0] ).children()
                .find(".grey-text")
                .attr("style", "");

            g_pageLinkArr.shift();
            flushPageLinkToCookie();

            console.log('i: '+i);
            console.log('g_pageLinkIndex: ' + g_pageLinkIndex);
            console.log('clickTarId: ' + clickTarId);
            console.log('g_pageLinkArr: ' + g_pageLinkArr);

            console.log('-- regPageLink balance');
        }
        
        g_pageLinkIndex ++;
        g_pageLinkIndex %= pageLinkNum;
    });
}

function flushPageLinkToCookie() {
    setCookie('pageLinkArr', g_pageLinkArr.toString(), 180);
    getPageLinkFromCookie();
}

function getPageLinkFromCookie(){
    var cookieStr = getCookie('pageLinkArr');
    if (cookieStr) {
        console.log(cookieStr.split(','));
        return cookieStr.split(',');
    } else {
        return null;
    }
    
}

function genPageLink(appendTar) {
    var pageLinkArrFromCookie = getPageLinkFromCookie();
    if(pageLinkArrFromCookie && pageLinkArrFromCookie.length > 0){
        g_pageLinkArr = pageLinkArrFromCookie;
        g_pageLinkIndex = g_pageLinkArr.length;
        g_pageLinkIndex %= g_rainbow.length;

        for (var i in g_pageLinkArr) {
            initPageLink(g_pageLinkArr[i], appendTar);
        }
        
    }
}

function initPageLink(clickTarId, appendTar) {
    var pageLinkNum = g_rainbow.length;

    var htmlStr = '\
        <a href="#dairy-index" class="btn-floating btn-small waves-effect waves-light z-depth-2" style="background:dairy-link-color"> \
            dairy-index \
        </a>';

    var curColor = g_rainbow[g_pageLinkIndex];    
    
    htmlStr = htmlStr.replace( /dairy-index/g, clickTarId); 
    htmlStr = htmlStr.replace( /dairy-link-color/g, curColor);

    $(appendTar).append(htmlStr);

    //marked color
    $("#" + clickTarId).children().find(".grey-text").attr("style", "background:" + curColor + ";");
    
    g_pageLinkIndex ++;
    g_pageLinkIndex %= pageLinkNum;
}

//the Touch
function Touch(tar) {
    this.tar = tar;
    this.startSec = 0;
    this.startTar;
    this.clickTriggered = 0;
}
Touch.prototype={
    constructor:Touch,
    setTouchEvent:function() {
        var target=this.tar;
        // add touch start listener
        target.addEventListener("touchstart", this.touchStart, false);
        // add touch move listener
        target.addEventListener("touchmove", this.touchMove, false); 
        // add touch end listener
        target.addEventListener("touchend", this.touchEnd, false);
    },
    touchStart:function(){
        if (!event.changedTouches.length) {
            return true;
        }

        // prevent click, and trigger that with touchEnd in case of double triggered
        event.preventDefault();

        var touches = event.changedTouches;

        this.startSec = new Date().getTime();
        this.startTar = event.target;
        this.clickTriggered = 0;
        this.startTar.x = touches[0].clientX;
        this.startTar.y = touches[0].clientY;

        for (var i in touches) {
            createRipple( touches[i].clientX, touches[i].clientY ); 
        }

        return false;
          
    },
    touchMove:function () {
        if (!event.changedTouches.length) 
          return;

        // prevent click, and trigger that with touchEnd in case of double triggered
        event.preventDefault();

        var touch = event.changedTouches[0],
            x = touch.clientX,
            y = touch.clientY;
        
        createRipple(x,y);

        //moving not click
        var isMoving = Math.abs(x - this.startTar.x) > 3 || Math.abs(y - this.startTar.y) > 3;
        if (isMoving) {
            this.clickTriggered = 1;
        }

        return false;
    },
    touchEnd:function(){

        // prevent click, and trigger that with touchEnd in case of double triggered
        event.preventDefault();

        var nowSec = new Date().getTime();
        //console.log("-------------")
        //console.log("time:" + (nowSec - this.startSec));
        //console.log("this.clickTriggered == 0 : " + (this.clickTriggered == 0));
        //console.log("event.target == this.startTar : "+(event.target == this.startTar));

        if (this.clickTriggered == 0 && event.target == this.startTar && ( (nowSec - this.startSec) > 3 ) ) {
            console.log("trigger!!!");
            event.target.click();
            this.clickTriggered ++;
        }

        return true;
        
    }
}

 
/** end **/
})(jQuery);

