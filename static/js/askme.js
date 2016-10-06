(function($){
/* start */

g_questArr = {};

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
  $('#modal-bug').closeModal();   
});

/*get dairy data*/
function initDairy() {

    $.ajax({
        url: "/data/askme",
        method: "POST",
        data: { 
            queryCode: 'init' 
        },
        success: function(ret){
            //console.log(data);
            if(ret && ret.length > 0) {
                g_questArr = ret;
                
                console.log(g_questArr);

                genPage( g_questArr[0] );
                g_questArr.slice(0, 1);
            }
        },
        error: function(e){
            alert('呃……服务器出问题了');
        }
    });
}

$("#answear-submit").click(function(e){
    console.log(e);
});

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

function genPage(questObj) {
    var choicesStr = '';
    var choiceItem;
    var htmlStr;
    var templateStr = ' \
        <div class="col dairy-pad"> \
          <div class="card"> \
            <span class="card-title">Question #questId</span> \
            <div class="card-content"> \
              <p> \
                questMsg \
              </p> \
            </div> \
            <form action="#"> \
                allChoices \
            </form> \
            <a href="#!" id="answear-submit" class="btn-flat btn waves-effect waves-light blue lighten-2 "> \
                <i class="icon-ok"></i> \
            </a> \
          </div> \
        </div>';
    
    for ( var i in questObj['choices'] ) {
        choiceItem = '<p><input name="choices-group" type="radio" next="nextId" id="choice-choiceId" /><label for="choice-choiceId">choiceMsg</label></p>';
        choiceItem = choiceItem.replace(/choiceId/g, i);
        choiceItem = choiceItem.replace(/nextId/g, questObj['choices'][i]['next']);
        choiceItem = choiceItem.replace(/choiceMsg/g, questObj['choices'][i]['choiceMsg']);

        if(choiceItem) {
            choicesStr += choiceItem;
        }
        
    }

    htmlStr = templateStr.replace(/questId/g, questObj['questId']);
    htmlStr = htmlStr.replace(/questMsg/g, questObj['questMsg']);
    htmlStr = htmlStr.replace(/allChoices/g, choicesStr);

    $("#lh-main").html(htmlStr);   
}

function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

/** end **/
})(jQuery);

