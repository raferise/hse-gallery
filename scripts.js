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
	var hn = window.location.hash;
	if (hn.length > 1) {
		showFullsize(parseInt(hn.substr(1)));
	}
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
	window.location.hash = '#'+imgnum;
	var backdrop = document.createElement('div');
		backdrop.classList.add('backdrop');
		backdrop.innerHTML = "Loading...";
		backdrop.setAttribute('onClick','window.location.hash = ""; this.remove(); document.body.children[0].focus();');
		var img = new Image();
			img.onload = function() {
				backdrop.appendChild(img);
			}
			img.setAttribute('onClick','event.stopPropagation();');
			img.src = "./images/"+(imgnum)+".jpg";
			img.id = "fullscreenimage";
		var buttonsarray = document.createElement('div');
			buttonsarray.classList.add('buttonsarray');
			
			var closebutton = document.createElement('button');
				closebutton.classList.add('close');
				closebutton.innerHTML = "close";
			buttonsarray.appendChild(closebutton);
			
			var sharebutton = document.createElement('button');
				sharebutton.classList.add('share');
				sharebutton.id = "imgshare";
				sharebutton.innerHTML = "share";
				sharebutton.setAttribute('onClick','event.stopPropagation(); copyUrl()');
			buttonsarray.appendChild(sharebutton);
			
			var leftbutton = document.createElement('button');
				leftbutton.classList.add('left');
				leftbutton.id = "imgleft";
				leftbutton.innerHTML = "chevron_left";
				leftbutton.setAttribute('onClick','event.stopPropagation(); jumpImage(-1);');
			buttonsarray.appendChild(leftbutton);
			
			var rightbutton = document.createElement('button');
				rightbutton.classList.add('right');
				rightbutton.id = "imgright";
				rightbutton.innerHTML = "chevron_right";
				rightbutton.setAttribute('onClick','event.stopPropagation(); jumpImage(1);');
			buttonsarray.appendChild(rightbutton);
			
		backdrop.appendChild(buttonsarray);
	document.body.appendChild(backdrop);
	updateImageArrows(imgnum);
}

function jumpImage(step) {
	var imgnum = parseInt(window.location.hash.substr(1))+step;
	window.location.hash = '#'+imgnum;
	var img = document.getElementById('fullscreenimage');
	img.remove();
	updateImageArrows(imgnum);
	img.src = "./images/"+(imgnum)+".jpg";
}

function updateImageArrows(imgnum) {
	if (imgnum > 0) {
		document.getElementById('imgleft').classList.add('visible');
	} else {
		document.getElementById('imgleft').classList.remove('visible');
	}
	if (imgnum < ImagesCount-1) {
		document.getElementById('imgright').classList.add('visible');
	} else {
		document.getElementById('imgright').classList.remove('visible');
	}
}

function copyUrl() {
	if (navigator.share) {
		navigator.share({
			title: document.title,
			text: 'Check out this picture!',
			url: window.location.href
		})
		.then(() => debug('Successful share!',0))
		.catch(err => debug(err),0);
	} else { 
		var dummy = document.createElement('input'),
		text = window.location.href;
		document.body.appendChild(dummy);
		dummy.value = text;
		dummy.select();
		document.execCommand('copy');
		document.body.removeChild(dummy);
		var sharebtn = document.getElementById('imgshare')
		sharebtn.classList.add('copied');
		setTimeout(function() {sharebtn.classList.remove('copied');},2500);
	}
}

function showCredits() {
	document.getElementById('credits').classList.add('visible');
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