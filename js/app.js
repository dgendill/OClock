$(function(){
    $.settings={
        themes:[
            {
                id:"light",
                color1:"#EEE",
                color2:"#666",
                alias:"Bright Light"
            },
            {
                id:"dark",
                color1:"#444",
                color2:"#CCC",
                alias:"Dark Soul"
            },
            {
                id:"dynamic",
                color1:"#000",
                color2:"#FFF",
                alias:"Dynamic"
            },
            {
                id:"sexy",
                color1:"#222",
                color2:"#F00",
                alias:"Sexy Red"
            },
            {
                id:"matrix",
                color1:"#000",
                color2:"#0F0",
                alias:"Green Matrix"
            }
        ],
        defaultTheme:"light",
        sounds:[
            {
                alias:"Default",
                filename:"sounds/default.ogg"
            }
        ],
        tick:false
    }

    $body = $('body');

    $.dat={
        time:{
            hours:0,
            minutes:0
        },
        sound:false,
        interv:false,
        status:false
    }

    function padhex(n) {
        if(n<16)
        return "0" + n.toString(16)
    else
        return n.toString(16)
    }

    $.select_theme = function(alias){
        $body.attr("class",alias)

        if(alias=="dynamic")
        {
            $body.attr("class","dark");
            $.settings.tick=function(h,m,s){
                c1=padhex(Math.round(10.62 * h))
                c2=padhex(Math.round(4.25 * m))
                c3=padhex(Math.round(4.25 * s))
                $body.css("background","#"+c1+c2+c3)
                console.log("#"+c1+"."+c2+"."+c3);
            }
        } else {
            $.settings.tick = false;
            $body.removeAttr('style');
        }
    }
    $.load_themes = function(){
        $.each($.settings.themes,function(index,theme){
            $(".btn-theme")
                .next()
                .append(""+
                    "<li>"+
                    "   <a href='#' data-id='"+theme.id+"'>"+
                    "       <span class='fa-stack'>"+
                    "           <i class='fa fa-circle fa-stack-2x' style='color:"+theme.color1+"'></i>"+
                    "           <i class='fa fa-circle fa-stack-1x' style='color:"+theme.color2+"'></i>"+
                    "       </span>"+
                    "       "+theme.alias+""+
                    "   </a>"+
                    "</li>")

        })
        $(".btn-theme").next().find("a").on("click",function(e){
            e.preventDefault()
            $.select_theme($(this).data("id"))
        })
        $.select_theme($.settings.defaultTheme)
    }
    $.load_sounds = function(){
        $.each($.settings.sounds,function(index,sound){
            $("#alarm-sound")
                .append("<option value='"+sound.filename+"'>"+sound.alias+"</option>")
        })


        $(".btn-play").on("click",function(e){
            var _this=$(this),
                _alarm=$("#alarm-file").get(0)
            _this.toggleClass("active")
            if(_this.hasClass("active"))
            {
                _alarm.src=$("#alarm-sound").val()
                _alarm.play()
                _this.html("<i class='fa fa-pause'></i>")
            }
            else
            {
                _alarm.pause()
                _this.html("<i class='fa fa-play'></i>")
            }
        })
    }

    $.load_times = function(){
        for (var i = 0; i < 23; i++) {
            $("<option/>",{
                value:i,
                text:i
            }).appendTo($("#alarm-hour"))
            $("#alarm-hour option[value="+moment().format('H')+"]").attr("selected",true)
        }
        for (var i = 0; i < 59; i+=1) {
            $("<option/>",{
                value:i,
                text:i
            }).appendTo($("#alarm-minutes"))
        }
    }

    $.enable_alarm=function(){
        $.dat.time.hours=$("#alarm-hour").val()
        $.dat.time.minutes=$("#alarm-minutes").val()
        $.dat.sound=$("#alarm-sound").val()
        
        $(".alarm-bar .progress-bar").css("width","0px")
        $(".alarm-bar").show()

        $(".btn-alarm")
            .removeClass("btn-default")
            .addClass("btn-danger")
            .on("click",function(e){
                e.stopPropagation()
                $.stop_alarm()
            })
        $(".btn-alarm span").text("Stop")

        var tot = moment()
                    .diff(
                        moment()
                            .hour($.dat.time.hours)
                            .minute($.dat.time.minutes)
                            .second(0), 'seconds'
                    )

        $.dat.status=true;

        $.dat.interv=setInterval(function(){

            var rem = moment()
                        .diff(
                            moment()
                                .hour($.dat.time.hours)
                                .minute($.dat.time.minutes)
                                .second(0), 'seconds'
                        )
            var lbl = 100-(rem*-100/tot*-1)

            $(".alarm-bar .progress-bar").css("width",lbl+"%")

            if(rem>0)
            {
                clearInterval($.dat.interv)
                $.start_alarm()
                $.dat.interv.alarm=false
            }
        },999)

        $(".modal").modal("hide")

    }

    $.start_alarm = function()
    {
        $(".alarm-bar").hide()
        $(".alarm-bar .progress-bar").css("width","0px")
        $(".clock").addClass("active")

        var _alarm=$("#alarm-file").get(0)
        
        _alarm.src=$.dat.sound
        _alarm.play()

        $.dat.interv=setInterval(function(){
            if(!$.dat.status)
            {
                $.stop_alarm()
            }
        },100)
    }

    $.stop_alarm = function()
    {
        $.dat.status=false

        $(".btn-alarm")
            .removeClass("btn-danger")
            .addClass("btn-default")
            .off();
        $(".btn-alarm span").text("Alarm")
        $(".alarm-bar").hide()
        $(".alarm-bar .progress-bar").css("width","0px")
        $(".clock").removeClass("active")

        var _alarm=$("#alarm-file").get(0)
        
        _alarm.pause()

        clearInterval($.dat.interv)
    }

    $.init=function(){
        setInterval(function(){
            var h = moment().format('HH')
            var m = moment().format('mm')
            var s = moment().format('ss')
            $("#time").text(h+":"+m)
            $('#secs').text(":"+s)

            if($.settings.tick)
            {
                $.settings.tick(h,m,s)
            }
        },999)
        $.load_themes()
        $.load_times()
        $.load_sounds()

        $(".btn-save-alarm").on("click",function(){
            $.enable_alarm()
        })
    }

    $.init()
})
