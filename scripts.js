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

function debug(txt,index) {
	var dbg = document.getElementById('debug');
	while (index > dbg.childElementCount-1) {
		dbg.appendChild(document.createElement('text'));
	}
	dbg.children[index].innerHTML = txt;
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
	var COLUMN_WIDTH;
	if (vw >= 950) {
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
		ImagesList[i].classList.remove('new');
		getSmallestImageColumn().appendChild(ImagesList[i]);
	}
	var loader = document.createElement('div');
		loader.id = "loader";
	jsimages.appendChild(loader);
	observer.observe(loader);
}
var ImagesCount;
window.addEventListener('resize', onWindowResize);
window.addEventListener('load', function() {
	document.body.children[0].focus();
	onWindowResize();
	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", "./images.txt", false);
	rawFile.onreadystatechange = function ()
	{
		if(rawFile.readyState === 4)
		{
			if(rawFile.status === 200 || rawFile.status == 0)
			{
				ImagesCount = parseInt(rawFile.responseText);
				loadNext();
			}
		}
	}
	rawFile.send(null);
});

var ImagesList = [];
var imagesloading = 0;

function loadImage(){
	if (ImagesList.length < ImagesCount) {
		var img = new Image();
		img.onload = function() {
			getSmallestImageColumn().appendChild(img);
			if (imagesloading > 0) {
				imagesloading--;
				loadImage();
			} else if (isLoaderVisible()) {
				loadNext();
			}
		}
		ImagesList.push(img);
		img.src = "./thumbs/"+(ImagesList.length-1)+".jpg";
		img.setAttribute("onClick","showFullsize("+(ImagesList.length-1)+")")
		img.classList.add('new');
	}
}
function loadNext() {
	if (imagesloading == 0) {
		imagesloading = 10;
		loadImage();
	}
}

function showFullsize(imgnum) {
	var backdrop = document.createElement('div');
		backdrop.classList.add('backdrop');
		backdrop.innerHTML = "Loading...";
		backdrop.setAttribute('onClick','this.remove();');
		var img = new Image();
			img.onload = function() {
				backdrop.appendChild(img);
			}
			img.setAttribute('onClick','event.stopPropagation();');
			img.src = "./images/"+(imgnum)+".jpg";
		var closebutton = document.createElement('button');
			closebutton.innerHTML = " &times; ";
		backdrop.appendChild(closebutton);
	document.body.appendChild(backdrop);
}

let obsopts = {
  root: null,
  rootMargin: '0px',
  threshold: 0
}
let observer = new IntersectionObserver(loadNext, obsopts);
function isLoaderVisible() {
    var rect = document.getElementById('loader').getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight)
    );
}