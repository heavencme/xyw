(function($){
/* start */

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
  if( ! textLenValidate('modal-bug-text', 200) ) {
    return;
  }

  var now = new Date();

  $.ajax({
    url: "/data/write",
    method: "POST",
    data: { 
        timeStamp: now.getTime(),
        time: now.toLocaleString().replace(/GMT\+8/g, ''),
        msg: $('#modal-bug-text').val(),
        passCode: "wb@19910309"
    },
    success: function(data) {
        genPage(data, false);
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
        success: function(data){
            //console.log(data);
            genPage(data, false);
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

function genPage(data, isInit) {
    var dairyArr = data.data;
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
            <div class="card-action"> \
              <a class="right" href="#"><i class="icon-pin lh-icon-btn"></i></a> \
            </div> \
          </div> \
        </div> \ 
    ';

    for (var i in dairyArr) {
        htmlStr = templateStr.replace(/dairy-time/g, dairyArr[i]['time']);
        htmlStr = htmlStr.replace(/dairy-msg/g, dairyArr[i]['msg']);
        htmlStr = htmlStr.replace(/dairy-id/g, dairyArr[i]['_id']); 

        $("#lh-main").prepend(htmlStr);   
    }
}

/** end **/
})(jQuery);

