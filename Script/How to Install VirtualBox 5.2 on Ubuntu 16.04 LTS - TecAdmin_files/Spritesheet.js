Spritesheet = function(settings){

	this.settings = settings;
	this.frameIndex = 0;
	this.tickCount = 0;
	this.currentRow = 0;
	this.currentCol = 0;
	this.ticksPerFrame = 60 / settings.frameRate;
	this.offsetX = settings.offsetX || 0;
	this.offsetY = settings.offsetY || 0;
	this.holder = settings.holder;
	this.immediateRender = settings.immediateRender || false;
	this.canvas = settings.canvas;
	this.context = this.canvas.getContext('2d'),
	this.frameWidth = settings.frameWidth;
	this.frameHeight = settings.frameHeight;
	this.imgSrc = settings.imgSrc;
	this.onComplete = settings.onComplete; // callback
	this.maxLoops = settings.maxLoops;
	this.loops = settings.loops;
	this.paused = settings.paused || false;
	this.ready = settings.ready;
	this.scope = settings.scope || this; // used to pass scope to callback

};

Spritesheet.prototype.init = function(callback) {

    this.loadImage(this.imgSrc,function(img) {

        this.image = img;
		this.numberOfCols = this.image.width / this.frameWidth;
		this.numberOfRows = this.image.height / this.frameHeight;
		this.numberOfFrames = (this.numberOfCols * this.numberOfRows) - 1;
		this.canvas.width = this.frameWidth;
		this.canvas.height = this.frameHeight;

		if(this.immediateRender) this.render(); // render first frame

		callback(this);

    }.bind(this));

};

Spritesheet.prototype.play = function() {

	// this.ontick();
	TweenLite.ticker.addEventListener('tick',this.ontick.bind(this));

};

Spritesheet.prototype.clearCanvas = function() {

  	this.context.clearRect(0,0,this.frameWidth,this.frameHeight);
  	this.frameIndex = 0;
	this.tickCount = 0;
	this.currentRow = 0;
	this.currentCol = 0;

};

Spritesheet.prototype.ontick = function(argument) {

	if(!this.paused) {
		this.update();
		this.render();
	}

};

Spritesheet.prototype.update = function () {

	if(this.frameIndex >= this.numberOfFrames) return;

	this.tickCount++;

	// Don't update on each frame

	if (this.tickCount > this.ticksPerFrame) {

		this.frameIndex++;
		this.tickCount = 0;
		this.currentRow = Math.floor(this.frameIndex / this.numberOfCols); // Calculate new row
		this.currentCol++; // Calculate col

		if (this.currentCol == this.numberOfCols) this.currentCol = 0;

	}

};

Spritesheet.prototype.render = function () {

	this.context.clearRect(0,0,this.frameWidth,this.frameHeight);

	this.context.drawImage(
		this.image,
		this.currentCol * this.image.width / this.numberOfCols,
		this.currentRow * this.image.height / this.numberOfRows,
		this.image.width / this.numberOfCols,
		this.image.height / this.numberOfRows,
		this.offsetX,
		this.offsetY,
		this.image.width / this.numberOfCols,
		this.image.height / this.numberOfRows
	);

};


Spritesheet.prototype.getCurrFrame = function () {
	return this.frameIndex;

};



Spritesheet.prototype.loadImage  = function (url, callback){

    if(this.settings.IE9) {

        var img = document.createElement('img');

        img.crossOrigin = 'anonymous';

        img.onload = function () {
            callback(img);
        };

        img.src = url;

    } else {

        var xhr = new XMLHttpRequest();

        xhr.onload = function () {

            var url = URL.createObjectURL(this.response), img = new Image();

            img.onload = function () {
                callback(img);
                URL.revokeObjectURL(url);
            };

            img.src = url;

        };

        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.send();

    }

}
