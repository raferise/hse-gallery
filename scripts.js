function getViewport() {

 var viewPortWidth;
 var viewPortHeight;

 // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
 if (typeof window.innerWidth != 'undefined') {
   viewPortWidth = window.innerWidth,
   viewPortHeight = window.innerHeight
 }

// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
 else if (typeof document.documentElement != 'undefined'
 && typeof document.documentElement.clientWidth !=
 'undefined' && document.documentElement.clientWidth != 0) {
    viewPortWidth = document.documentElement.clientWidth,
    viewPortHeight = document.documentElement.clientHeight
 }

 // older versions of IE
 else {
   viewPortWidth = document.getElementsByTagName('body')[0].clientWidth,
   viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
 }
 return [viewPortWidth, viewPortHeight];
}

function getSmallestImageColumn() {
	var jsimages = document.getElementById('jsimages');
	var minheight = jsimages.children[0].offsetHeight;
	var minheightindex = 0;
	for (var i=1; i<jsimages.childElementCount; i++) {
		if ((jsimages.children[i].offsetHeight < minheight)&&(jsimages.children[i].id != "loader")) {
			minheight = jsimages.children[i].offsetHeight;
			minheightindex = i;
		}
	}
	return jsimages.children[minheightindex];
}

function createImageElement(img) {
	var imge = document.createElement('img');
	imge.src = img.src;
	return imge;
}


function onWindowResize() {
	var [vw, vh] = getViewport();
	document.getElementById('debug').innerHTML = vw;
	var COLUMN_WIDTH;
	if (vw >= 1000) {
		 COLUMN_WIDTH = 300;
	} else if (vw >= 771) {
		COLUMN_WIDTH = 250;
	} else if (vw >= 622) {
		COLUMN_WIDTH = 200;
	} else {
		COLUMN_WIDTH = 150;
	}
	var jsimages = document.getElementById('jsimages');
	jsimages.innerHTML = '';
	var imgnum = 0;
	for (var i=0; i<vw-20-COLUMN_WIDTH; i+=COLUMN_WIDTH) {
		var col = document.createElement('div');
			col.classList.add('imgcolumn');
			col.setAttribute('style','width: '+COLUMN_WIDTH+"px");
		jsimages.appendChild(col);
	}
	for (var i=0; i<ImagesList.length; i++) {
		getSmallestImageColumn().appendChild(createImageElement(ImagesList[i]));
	}
	var loader = document.createElement('div');
		loader.id = "loader";
	jsimages.appendChild(loader);
	observer.observe(loader);
}
window.addEventListener('resize', onWindowResize);
window.addEventListener('load', onWindowResize);

var ImagesList = [];
var imagesloading = 0;

function loadImage(imgnum){
	var img = new Image();
	img.onload = function() {
		imagesloading--;
		getSmallestImageColumn().appendChild(createImageElement(img));
		if (imagesloading > 0) {
			loadImage(imgnum+1);
		}
	}
	ImagesList.push(img);
	img.src = "./images/"+imgnum+".jpg";
}
function loadNext() {
	if (imagesloading == 0) {
		imagesloading = 10
		loadImage(ImagesList.length);
	}
	
}
let obsopts = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
}
let observer = new IntersectionObserver(loadNext, obsopts);