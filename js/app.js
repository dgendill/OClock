$(function(){
	$.settings={
		themes:[
			{
				id:"light",
				alias:"Light Theme"
			},
			{
				id:"dark",
				alias:"Dark Theme"
			},
			{
				id:"sexy",
				alias:"Sexy Theme"
			},
			{
				id:"matrix",
				alias:"Matrix Theme"
			}
		],
		defaultTheme:"light",
		sounds:[
			{
				alias:"Default",
				filename:"sounds/default.ogg"
			}
		]
	}

	$.dat={
		time:{
			hours:0,
			minutes:0
		},
		sound:false,
		interv:false,
		status:false
	}

	$.select_theme = function(alias){
		$("body").attr("class",alias)
	}
	$.load_themes = function(){
		$.each($.settings.themes,function(index,theme){
			$(".btn-theme")
				.next()
				.append("<li><a href='#' data-id='"+theme.id+"'>"+theme.alias+"</a></li>")
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
			$("#time").text(moment().format('HH:mm'))
	    	$('#secs').text(moment().format(':ss'))
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