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
		if (jsimages.children[i].offsetHeight < minheight) {
			minheight = jsimages.children[i].offsetHeight;
			minheightindex = i;
		}
	}
	return jsimages.children[minheightindex];

}

function createImageElement(imgnum) {
	var img = document.createElement('img');
	img.src = "./images/"+(imgnum++)+".jpg";
	return img;
}

var IMAGE_COUNT = 10;
var COLUMN_WIDTH_LANDSCAPE = 300;
var COLUMN_WIDTH_PORTRAIT = 200;
function onWindowResize() {
	let [vw, vh] = getViewport();
	var jsimages = document.getElementById('jsimages');
	jsimages.innerHTML = '';
	if (vw > vh) { //landscape
		document.body.classList.add('landscape');
		document.body.classList.remove('portrait');
		var imgnum = 0;
		for (var i=0; i<vw-20-COLUMN_WIDTH_LANDSCAPE; i+=COLUMN_WIDTH_LANDSCAPE) {
			var col = document.createElement('div');
				col.classList.add('imgcolumn');
				col.setAttribute('style','width: '+COLUMN_WIDTH_LANDSCAPE+"px");
			jsimages.appendChild(col);
		}
		for (var i=0; i<IMAGE_COUNT; i++) {
			getSmallestImageColumn().appendChild(createImageElement(i));
		}
	} else { //portrait
		document.body.classList.add('portrait');
		document.body.classList.remove('landscape');
		var imgnum = 0;
		for (var i=0; i<vw-20-COLUMN_WIDTH_PORTRAIT; i+=COLUMN_WIDTH_PORTRAIT) {
			var col = document.createElement('div');
				col.classList.add('imgcolumn');
				col.setAttribute('style','width: '+COLUMN_WIDTH_PORTRAIT+"px");
			jsimages.appendChild(col);
		}
		for (var i=0; i<IMAGE_COUNT; i++) {
			getSmallestImageColumn().appendChild(createImageElement(i));
		}
	}
}
window.addEventListener('resize', onWindowResize);
onWindowResize();