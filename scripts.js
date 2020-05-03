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

function onWindowResize() {
	let [vw, vh] = getViewport();
	var packhere = document.getElementById('jsimages');
	packhere.innerHTML = '';
	document.getElementById('debug').innerHTML = "WAIT";
	if (vw > vh) { //landscape
		document.body.classList.add('landscape');
		document.body.classList.remove('portrait');
		var imgnum = 0;
		var cols = [];
		for (var i=0; i<vw-320; i+=300) {
			var col = document.createElement('div');
				col.classList.add('imgcolumn');
			packhere.appendChild(col);
			cols.push(col);
		}
		let IMAGECOUNT = 10; //TODO COUNT IMAGES
		for (var i=0; i<IMAGECOUNT; i++) {
			var img = document.createElement('img');
				img.src = "./images/"+(imgnum++)+".jpg";
			cols[i%cols.length].appendChild(img);
		}
		document.getElementById('debug').innerHTML = i/300 +" "+vw;
	} else { //portrait
		document.body.classList.add('portrait');
		document.body.classList.remove('landscape');
	}
}
window.addEventListener('resize', onWindowResize);
onWindowResize();