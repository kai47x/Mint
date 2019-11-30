(function(){

	"use strict";

	// addEventListener polyfill 1.0 / Eirik Backer / MIT Licence
	(function(win, doc){
		if(win.addEventListener)return;		//No need to polyfill

		function docHijack(p){var old = doc[p];doc[p] = function(v){return addListen(old(v))}}
		function addEvent(on, fn, self){
			return (self = this).attachEvent('on' + on, function(e){
				var e = e || win.event;
				e.preventDefault  = e.preventDefault  || function(){e.returnValue = false}
				e.stopPropagation = e.stopPropagation || function(){e.cancelBubble = true}
				fn.call(self, e);
			});
		}
		function addListen(obj, i){
			if(i = obj.length)while(i--)obj[i].addEventListener = addEvent;
			else obj.addEventListener = addEvent;
			return obj;
		}

		addListen([doc, win]);
		if('Element' in win)win.Element.prototype.addEventListener = addEvent;			//IE8
		else{																			//IE < 8
			doc.attachEvent('onreadystatechange', function(){addListen(doc.all)});		//Make sure we also init at domReady
			docHijack('getElementsByTagName');
			docHijack('getElementById');
			docHijack('createElement');
			addListen(doc.all);
		}
	})(window, document);

	// Detecting IE

	// IE9
	var div_IE9 = document.createElement("div");
	div_IE9.innerHTML = "<!--[if IE 9]><i></i><![endif]-->";
	var isIE9 = (div_IE9.getElementsByTagName("i").length == 1);

	// 	LESS THAN IE9
	var div_lessThanIE9 = document.createElement("div");
	div_lessThanIE9.innerHTML = "<!--[if lt IE 9]><i></i><![endif]-->";
	var isIeLessThan9 = (div_lessThanIE9.getElementsByTagName("i").length == 1);


	window.onload = function() {
		Banner.init();
	};

	// ------------------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------------------
	// BANNER -----------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------------------

	var Banner = {

		loops: 0,
		spritesheets : [],
		mainTL : new TimelineMax({paused:true}),
		spritesheetProps: { top: 0, left: 0, width: 728, height: 90 }, // spritesheet props
		elements : {},
		imgCache : {},
		images : ['spritesheet.png'],

		init: function(){

		this.elements.stage = this.utils.getElement('#stage');
        this.elements.copy01 = this.utils.getElement("#copy1");
        this.elements.copy02 = this.utils.getElement("#copy2");
        this.elements.copy03 = this.utils.getElement("#copy3");
        this.elements.cta = this.utils.getElement("#cta");

        // hide elements
        TweenLite.set([this.elements.copy01,this.elements.copy02,this.elements.copy03,this.elements.cta],{alpha:0});

        // spritesheet containers
        this.elements.sprite01Holder = this.utils.getElement("#spritesheet01-holder");
        this.elements.sprite01Canvas = this.utils.getElement("#spritesheet01-holder .canvas");

			// preload images
			this.utils.preloadImages(this.images,function(){


				// ----------------------------------------------------------
				// Spritesheets ---------------------------------------------
				// ----------------------------------------------------------

				this.spritesheet01 = new Spritesheet({
					holder: this.elements.sprite01Holder,
					canvas: this.elements.sprite01Canvas,
					frameWidth: this.spritesheetProps.width,
					frameHeight: this.spritesheetProps.height,
					loops: 0,
					maxLoops: 0,
					imgSrc: 'spritesheet.png',
					frameRate : 30,
					immediateRender: true,
					IE9: isIE9,
					ready: false,
					onComplete: function(){
					}
				});

				this.spritesheets.push(this.spritesheet01);

				for (var i = 0; i < this.spritesheets.length; i++) {

					this.spritesheets[i].init(function(spritesheet){

						spritesheet.ready = true;

						TweenLite.set(spritesheet.holder,this.spritesheetProps);
						TweenLite.set(this.elements.stage,{alpha:1});

						this.spritesheet01.play();

						TweenLite.ticker.addEventListener('tick',function(){
							this.timeline(this.spritesheet01.getCurrFrame());
						}.bind(this));


					}.bind(this));
				}

			}.bind(this));

		},

		timeline: function(frame){

			switch (frame) {

				case 1:
				TweenLite.to(this.elements.copy01,0.5,{alpha:1});
				break;

				case 106:
				TweenLite.to(this.elements.copy01,0.15,{alpha:0,x:60,y:60,scale:1.25});
				break;

				case 120:
                TweenLite.to(this.elements.copy02,0.15,{alpha:1});
				break;

				case 158:
                TweenLite.to(this.elements.copy02,0.3,{alpha:0,y:600,ease: Power1.easeIn});
				break;

				case 180:
                TweenLite.to(this.elements.copy03,0.25,{alpha:1});
				TweenLite.to(this.elements.cta,1.0,{alpha:1,delay:1.0})
				break;

			}


		},

		utils : {

			getElement : function(selector, context) {
	    		return (context || document).querySelector(selector);
			},

			preloadImages : function(images,callback) {

				var numImages = images.length;
				var loadedImages = 0;
				var img = null;

				for(var i = 0; i < numImages; ++i) {

					img = document.createElement("img");
					img.src = img.shortSrc = images[i];

					img.onload = function() {

						loadedImages++;
						Banner.imgCache[this.shortSrc] = this;

						if(loadedImages === numImages) {
							callback();
						}

					}

				}

			},

			setImage : function(el,img,retina) {
				var settings = {};
				settings.width =  Math.round(retina ? img.width  / 2 : img.width);
				settings.height = Math.round(retina ? img.height / 2 : img.height);
				settings.backgroundImage = "url(" + img.src + ")";
				settings.backgroundSize = "contain";
				TweenLite.set(el,settings);
			}


		}


	}

}());
