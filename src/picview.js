;$$picview = (function(){

  var __options = {
    target              : "img",
    className           : "picview",
    mouseover_action    : true,
    window_limit_weight : 0.9
  };


  var LIB = function(){};

	LIB.prototype.event = function(target, mode, func){
		if (target.addEventListener){target.addEventListener(mode, func, false)}
		else{target.attachEvent('on' + mode, function(){func.call(target , window.event)})}
	};

	LIB.prototype.urlinfo = function(uri){
    uri = (uri) ? uri : location.href;
    var data={};
    var urls_hash  = uri.split("#");
    var urls_query = urls_hash[0].split("?");
		var sp   = urls_query[0].split("/");
		var data = {
      uri      : uri
		,	url      : sp.join("/")
    , dir      : sp.slice(0 , sp.length-1).join("/") +"/"
    , file     : sp.pop()
		,	domain   : sp[2] ? sp[2] : ""
    , protocol : sp[0] ? sp[0].replace(":","") : ""
    , hash     : (urls_hash[1]) ? urls_hash[1] : ""
		,	query    : (urls_query[1])?(function(urls_query){
				var data = {};
				var sp   = urls_query.split("#")[0].split("&");
				for(var i=0;i<sp .length;i++){
					var kv = sp[i].split("=");
					if(!kv[0]){continue}
					data[kv[0]]=kv[1];
				}
				return data;
			})(urls_query[1]):[]
		};
		return data;
  };

  LIB.prototype.upperSelector = function(elm , selectors) {
    selectors = (typeof selectors === "object") ? selectors : [selectors];
    if(!elm || !selectors){return;}
    var flg = null;
    for(var i=0; i<selectors.length; i++){
      for (var cur=elm; cur; cur=cur.parentElement) {
        if (cur.matches(selectors[i])) {
          flg = true;
          break;
        }
      }
      if(flg){
        break;
      }
    }
    return cur;
  }

  LIB.prototype.currentScriptTag = (function(){
    var scripts = document.getElementsByTagName("script");
    return this.currentScriptTag = scripts[scripts.length-1].src;
  })();


  var AJAX = function(options){
    if(!options){return}
		var httpoj = this.createHttpRequest();
		if(!httpoj){return;}
		// open メソッド;
		var option = this.setOption(options);

		// queryデータ
		var data = this.setQuery(option);
		if(!data.length){
			option.method = "get";
		}

		// 実行
		httpoj.open( option.method , option.url , option.async );
		// type
		if(option.type){
			httpoj.setRequestHeader('Content-Type', option.type);
		}
		
		// onload-check
		httpoj.onreadystatechange = function(){
			//readyState値は4で受信完了;
			if (this.readyState==4 && httpoj.status == 200){
				//コールバック
				option.onSuccess(this.responseText);
			}
		};

		// FormData 送信用
		if(typeof option.form === "object" && Object.keys(option.form).length){
			httpoj.send(option.form);
		}
		// query整形後 送信
		else{
			//send メソッド
			if(data.length){
				httpoj.send(data.join("&"));
			}
			else{
				httpoj.send();
			}
		}
		
  };
	AJAX.prototype.dataOption = {
		url:"",
		query:{},				// same-key Nothing
		querys:[],			// same-key OK
		data:{},				// ETC-data event受渡用
		form:{},
		async:"true",		// [trye:非同期 false:同期]
		method:"POST",	// [POST / GET]
		type:"application/x-www-form-urlencoded", // ["text/javascript" , "text/plane"]...
		onSuccess:function(res){},
		onError:function(res){}
	};
	AJAX.prototype.option = {};
	AJAX.prototype.createHttpRequest = function(){
		//Win ie用
		if(window.ActiveXObject){
			//MSXML2以降用;
			try{return new ActiveXObject("Msxml2.XMLHTTP")}
			catch(e){
				//旧MSXML用;
				try{return new ActiveXObject("Microsoft.XMLHTTP")}
				catch(e2){return null}
			}
		}
		//Win ie以外のXMLHttpRequestオブジェクト実装ブラウザ用;
		else if(window.XMLHttpRequest){return new XMLHttpRequest()}
		else{return null}
	};
	AJAX.prototype.setOption = function(options){
		var option = {};
		for(var i in this.dataOption){
			if(typeof options[i] != "undefined"){
				option[i] = options[i];
			}
			else{
				option[i] = this.dataOption[i];
			}
		}
		return option;
	};
	AJAX.prototype.setQuery = function(option){
		var data = [];
		if(typeof option.datas !== "undefined"){

			// data = option.data;
			for(var key of option.datas.keys()){
				data.push(key + "=" + option.datas.get(key));
			}
		}
		if(typeof option.query !== "undefined"){
			for(var i in option.query){
				data.push(i+"="+encodeURIComponent(option.query[i]));
			}
		}
		if(typeof option.querys !== "undefined"){
			for(var i=0;i<option.querys.length;i++){
				if(typeof option.querys[i] == "Array"){
					data.push(option.querys[i][0]+"="+encodeURIComponent(option.querys[i][1]));
				}
				else{
					var sp = option.querys[i].split("=");
					data.push(sp[0]+"="+encodeURIComponent(sp[1]));
				}
			}
		}
		return data;
	};


  var MAIN = function(options){
    this.options = this.setOptions(options);
    this.init();
    this.setCSS();
    this.setHTML();
    this.setTargets();
  };

  MAIN.prototype.init = function(){
    var target  = this.options.target;
    var clsName = this.options.className;
    if(!target){return;}
    var targets = document.querySelectorAll(target);
    if(!targets || !targets.length){return;}
    for(var i=0; i<targets.length; i++){
      if(targets[i].classList && targets[i].classList.contains(clsName)){continue;}
      targets[i].classList.add(clsName);
    }
  };

  MAIN.prototype.setOptions = function(options){
    options = options ? options : {};
    var res = JSON.parse( JSON.stringify(__options) );
    for (var i in options) {res[i] = options[i];}
    return res;
  };

  // set-css
  MAIN.prototype.setCSS = function(){
    if(document.querySelector("link[data-picview='1']")){return}
    var myScript = new LIB().currentScriptTag;
    var href = myScript.replace(".js",".css");
    var link = document.createElement("link");
    link.setAttribute("data-picview","1");
    link.rel = "stylesheet";
    link.href = href;
    var head = document.getElementsByTagName("head");
    head[0].appendChild(link);
  };

  // カレンダー表示elementの構築（読み込み）
  MAIN.prototype.setHTML = function(){
    var myScript = new LIB().currentScriptTag;
    var url = myScript.replace(".js",".html");
    new AJAX({
      url : url,
      method : "get",
      onSuccess : (function(res){
        if(!res){return;}
        this.options.template = res;
      }).bind(this)
    });
  };

  // Start
  MAIN.prototype.setTargets = function(){
    var targets = document.querySelectorAll("."+this.options.className);
    if(targets && targets.length){
      for(var i=0; i<targets.length; i++){
        if(targets[i].hasAttribute("data-picview-flg")){continue;}
        targets[i].setAttribute("data-picview-flg","1");
        if(this.options.mouseover_action === true){
          targets[i].setAttribute("data-mouseover-action","1");
        }
        new LIB().event(targets[i] , "click" , (function(e){this.setEvent(e.currentTarget)}).bind(this));
      }
    }
  };

  // set-event
  MAIN.prototype.setEvent = function(elm){
    if(!elm || !elm.src){return;}
    if(typeof this.options === "undefined"
    || typeof this.options.template === "undefined"
    || !this.options.template){return;}

    this.close_strict();

    document.body.insertAdjacentHTML("afterend" , this.options.template);
    
    var base = document.querySelector(".picview-base");
    new LIB().event(base , "click" , (function(e){this.close(e)}).bind(this));

    var elm_rect = elm.getBoundingClientRect();
    var area = base.querySelector(".picview-area");
    area.style.setProperty("transform" , "none" , "");
    area.style.setProperty("width"     , elm_rect.width  +"px" , "");
    area.style.setProperty("height"    , elm_rect.height +"px" , "");
    area.style.setProperty("top"       , elm_rect.y      +"px" , "");
    area.style.setProperty("left"      , elm_rect.x      +"px" , "");

    var img = base.querySelector(".picview-area img");
    img.onload = (function(e){this.img_loaded(e)}).bind(this);
    img.src = elm.src;

    this.img    = img;
    this.moved  = false;
    this.loaded = false;

    setTimeout((function(){this.picview_move()}).bind(this) , 300);
    // this.picview_move();
  };

  // close
  MAIN.prototype.close = function(e){
    var target = e.target;
    if(!target || target.getAttribute("class") !== "picview-base"){return;}
    target.parentNode.removeChild(target);
  };
  MAIN.prototype.close_strict = function(){
    var target = document.querySelector(".picview-base");
    if(!target){return;}
    target.parentNode.removeChild(target);
  };

  // img-loaded
  MAIN.prototype.img_loaded = function(e){
    var img = e.currentTarget;
    this.loaded = true;
    if(this.moved === true){
      // this.picview_expand(img);
      // setTimeout((function(){this.picview_move()}).bind(this) , 100);
      setTimeout((function(){this.picview_expand();}).bind(this) , 300);
    }
  };

  MAIN.prototype.picview_move = function(){
    var area = document.querySelector(".picview-area");
    area.setAttribute("data-picview-move","1");
    
    if(this.loaded === true){
      // var img = area.querySelector("img");
      // this.picview_img_visible(img);
      // this.picview_expand();
      setTimeout((function(){this.picview_expand();}).bind(this) , 300);
    }
  };
  MAIN.prototype.picview_expand = function(){
    var area = document.querySelector(".picview-area");
    var img = area.querySelector("img");
    var size = this.getAreaSize(img);
    area.style.setProperty("width"  , size.width  + "px" , "");
    area.style.setProperty("height" , size.height + "px" , "");

    this.moved = true;
    setTimeout((function(img){this.picview_img_visible(img)}).bind(this,img) , 300);
  };
  MAIN.prototype.picview_img_visible = function(img){
    // loading非表示
    var area = document.querySelector(".picview-area");
    area.setAttribute("data-loaded","1");

    setTimeout((function(img){img.setAttribute("data-loaded" , "1")}).bind(this,img) , 300);
    this.loaded = false;
    this.moved  = false;
    this.img    = null;
  };
  MAIN.prototype.getAreaSize = function(img){

    // 画面サイズの80%を最大値とする
    var win_w = window.innerWidth  * this.options.window_limit_weight;
    var win_h = window.innerHeight * this.options.window_limit_weight;

    // 画像の本来のサイズ
    var img_w = img.naturalWidth;
    var img_h = img.naturalHeight;

    // 縦横の比率
    var rate  = img_w / img_h;

    // 横長
    if(rate > 1){
      var w = img_w < win_w * this.options.window_limit_weight ? img_w : win_w * this.options.window_limit_weight;
      var h = img_h * (w / img_w);
      if(h > win_h){
        var rate2 = h / win_h;
        h = win_h;
        w = w / rate2;
      }
    }
    // 縦長
    else{
      var h = img_h < win_h * this.options.window_limit_weight ? img_h : win_h * this.options.window_limit_weight;
      var w = img_w * (h / img_h);
      if(w > win_w){
        var rate2 = w / win_w;
        w = win_w;
        h = h / rate2;
      }
    }

    return {
      width  : w,
      height : h
    };
  };


  return MAIN;
})();