$(document).ready(function(){
    var maxNum=4;
    
    $(document).scroll(function(){
        for (var i=0;i<maxNum;i++) {
            if ($(this).scrollTop()>=($("#link"+i).offset().top-$(document).height()/15)) {
               
               $("#ank"+i).css({
                    "background":"#0088cc"
                });
               $(".anklist").children().not("#ank"+i).css({
                    "background":"#fff"
               })
               
            }    
        }
        
    });

    for (var i=0;i<maxNum;i++) {
        /* i作用域 */
        $("#ank"+i).bind('click',(function(num){
            return function(){
                event.preventDefault();
                $('body,html').animate(
                    {scrollTop:($("#link"+num).offset().top)},
                    500
                );
            }
            })(i)
        );         
    }
});


