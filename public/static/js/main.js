(function($){
/* start */

var g_input = {
  isValid: false,
  answear_a_ok: false,
  answear_b_ok: false,

  modal_bug_text: '',
  hongbao_code: '',
  question_code: '',
  answear_a: '',
  answear_b: '',
  description_name: '',
  description_right: '',
  description_wrong: ''
}; 

var g_initHash = (window.location.hash).replace(/#/g, '');

/* input length count */
inputLenCount('modal-bug-text', 200);
inputLenCount('hongbao-code', 10);
inputLenCount('question-code', 150);
inputLenCount('answear-a', 20);
inputLenCount('answear-b', 20);
inputLenCount('description-name', 20);
inputLenCount('description-right', 20);
inputLenCount('description-wrong', 20);



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

  $.ajax({
    url: "/hongbao/report",
    method: "POST",
    data: { 
        data: $('#modal-bug-text').val()
    },
    success: function(){
        $('#modal-bug').closeModal();
    },
    error: function(e){
        alert('呃……服务器被我关了');
    }
  });
});

/* validate and send hongbao */
$('#send-hongbao').click(function(){
    var newHash = sendInfoValidate();
    if (newHash != '#home') {
        window.location.hash = newHash;

        /* notify users to fullfill */
        var $toastContent = $('<span class=\'green\'>' 
            + '先填写完整再发送哦' + '</span>');
        Materialize.toast($toastContent, 5000);

        /* if don't return false, jq will reset  window hash to '#' */
        return false;
    }
    g_input['time'] = new Date().getTime();

    $.ajax({
        url: "/hongbao/set",
        method: "POST",
        data: g_input,
        success: function(ret){
            
            window.location = '/bao/' + ret.location + '.html#' + ret.hash;
        },
        error: function(e){
            alert('呃……服务器被我关了');
        }
    });
});

/* trigger hongbao test*/
$('#show-me-ur-money-btn').click(function(){
    /*redirect hash*/
    window.location.hash = '#' + g_initHash;

    /* gardian judge*/
    var isLocked = $('#show-me-ur-money-btn').hasClass('locked') || 
        ( getCookie('miss') == (window.location.hash).replace(/#/g, '') ); 
    
    if (isLocked) {

        $('#show-me-ur-money-btn').html("<i class=\"icon-lock yellow darken-3\"></i>");
        return;
    }
    else {
        $('#money-trick').openModal();;
    }
});

/* check and show hongbao code */
$('#hongbao-check-btn').click(function(e){

    clientData = {
        clientHash: g_initHash
    };

    var userChoice = $('input[type="radio"][name="answear"]:checked').val();
    
    if (userChoice) {
        clientData['clientRet'] = userChoice;
    }
    else {
        alert("请先点击，选择其中一个答案");
        return;
    }

    $.ajax({
        url: "/hongbao/check",
        method: "POST",
        data: clientData,
        success: function(ret){
            
            if (ret.result == 'ok' && ret.key == userChoice) {
                var $toastContent = $('<span class=\'green\'>' 
                    + ret.description_right + '</span>');
                Materialize.toast($toastContent, 5000);

                /* open box for first time*/
                if( 0 >= $('#boxOpen').length ) {
                  $('#hongbao-card-content').prepend('<br><p id="boxOpen">红包口令: <strong>' + ret.box + '</strong></p>');
                  $('#show-me-ur-money-btn').html("<i class=\"icon-lock-open yellow darken-3\"></i>");
                }
                
            }
            else if (ret.result == 'ok' && ret.key != userChoice){
                var $toastContent = $('<span class=\'green\'>' 
                    + ret.description_wrong + '</span>');
                Materialize.toast($toastContent, 5000);
                
                setCookie('miss', clientData.clientHash, 3);

                $('#show-me-ur-money-btn').addClass('locked');
                $('#show-me-ur-money-btn').html("<i class=\"icon-lock yellow darken-3\"></i>");
            }
            else {
                var $toastContent = $('<span class=\'green\'>' 
                    + '呃……红包不是发你的？' + '</span>');
                Materialize.toast($toastContent, 5000);
            }

            /* add shake effect ot send also icon */
            sendAlsoIconShake();
        },
        error: function(e){
            alert('呃……服务器被我关了');
        }
    });

    $('#money-trick').closeModal();
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

/* send-hongbao validate: #home --> valid */
function sendInfoValidate() {
    
    /* chose valid answear */
    g_input['answear_a_ok'] = ( true == $('#answear-a-right').prop("checked") ) ? true : false;
    g_input['answear_b_ok'] = ( true == $('#answear-b-right').prop("checked") ) ? true : false;

    if ( g_input['answear_a_ok'] || g_input['answear_b_ok'] ) {
       
    }
    else {
        g_input['answear_a_ok'] = ( Math.random() > 0.5 );
        g_input['answear_b_ok'] = !g_input['answear_a_ok'];
    }

    /* test not empty */
    for (var idx in g_input) {
        if ( 'isValid' != idx && 'modal_bug_text' != idx && g_input[idx].length == 0 ) {
            var newHash = '#' + idx.replace(/_/g, '-');
            return newHash;
        }
    }

    return '#home';

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

/* send also icon shake */
function sendAlsoIconShake() {
    if ( 0 < $("#send-alson").length ) {
        $("#send-alson").addClass("shake");
        return;
    }
    else {
        return;
    }
}


/** end **/
})(jQuery);

