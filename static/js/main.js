(function($){
/* start */

var container = $('body');

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
            if(ret.data && ret.data.length > 0) {
                //console.log(ret.data);
                genPage(ret.data);
            }

            //register ripple effects
            container.mousemove(function (e) {
                
                createRipple(e, this);
            });
            
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

function createRipple(e) {
    var x = e.pageX || e.left;
    var y = e.pageY || e.top;
    var ripple = $('<div class="ripple-outer"></div><div class="ripple-inner"></div>');
    
    ripple.appendTo(container).css({
        left: x - 25,
        top: y - 25
    });

    setTimeout(function () {
        ripple.remove();
    }, 2300);
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
        <div class="col dairy-pad" id="dairy-id"> \
          <div class="card"> \
            <span class="card-title">dairy-time</span> \
            <div class="card-content"> \
              <p> \
                dairy-msg \
              </p> \
            </div> \
          </div> \
        </div>';

    for (var i in dairyArr) {
        htmlStr = templateStr.replace(/dairy-time/g, dairyArr[i]['time']);
        htmlStr = htmlStr.replace(/dairy-msg/g, dairyArr[i]['msg']);
        htmlStr = htmlStr.replace(/dairy-id/g, dairyArr[i]['_id']); 

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

var bodyTouch=new Touch();
bodyTouch.setTouchEvent();

//the Touch
function Touch() {
}
Touch.prototype={
    constructor:Touch,
    setTouchEvent:function() {
        var target=document;
        // add touch start listener
        target.addEventListener("touchstart", this.touchStart, false);
        // add touch move listener
        target.addEventListener("touchmove", this.touchMove, false); 
        // add touch end listener
        target.addEventListener("touchend", this.touchEnd, false);
    },
    touchStart:function(){
        if (this.spirit || !event.changedTouches.length) 
           return;
        //"this" points to spirit target( document)
        var touch = event.changedTouches[0];
        startX = touch.pageX; //defined in the object window
        startY = touch.pageY;
        this.spirit = document.createElement("div");
        this.spirit.className = "touch-pad";
        document.body.appendChild(this.spirit);    
    },
    touchMove:function () {
        if (!this.spirit || !event.changedTouches.length) 
          return;
        var touch = event.changedTouches[0],x = touch.pageX,  y = touch.pageY;
        this.spirit.style.cssText = 'left:' + x + 'px; top:' + y + 'px;';  
        if (Math.abs(y-startY)>100) {
            document.body.removeChild(this.spirit);
            this.spirit = null;
            return true;//allow default events to happen
        }
        else if(Math.abs(x-startX)>8){
            event.preventDefault();
            return false;//prevent default events,however it sometimes doesn't work well
        }
        else{
            document.body.removeChild(this.spirit);
            this.spirit = null;
            return true;
        }
    },
    touchEnd:function(){
        if (!this.spirit) 
            return;
        document.body.removeChild(this.spirit);
        this.spirit = null;
        var touch = event.changedTouches[0],x = touch.pageX,  y = touch.pageY;
        //move left
        if( x<startX-8){//prevent mis-operation
            console.log(x);
        }
        //move right
        else if(x>startX+8){
            console.log(y);
        }
    }
}

/**functions to be called**/

//register a event listener on the target
function addEvent(target,type,handler) {
    if (target.addEventListener)
        target.addEventListener(type,handler,false);
    else
        target.attachEvent("on"+type,function(event){
            return handler.call(target,event);
        });
}

 
/** end **/
})(jQuery);

