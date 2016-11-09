// This function ONLY works for iFrames of the same origin as their parent
function iFrameReady(iFrame, fn) {
    var timer;
    var fired = false;

    function ready() {
        if (!fired) {
            fired = true;
            clearTimeout(timer);
            fn.call(this);
        }
    }

    function readyState() {
        if (this.readyState === "complete") {
            ready.call(this);
        }
    }

    // cross platform event handler for compatibility with older IE versions
    function addEvent(elem, event, fn) {
        if (elem.addEventListener) {
            return elem.addEventListener(event, fn);
        } else {
            return elem.attachEvent("on" + event, function () {
                return fn.call(elem, window.event);
            });
        }
    }

    // use iFrame load as a backup - though the other events should occur first
    addEvent(iFrame, "load", function () {
        ready.call(iFrame.contentDocument || iFrame.contentWindow.document);
    });

    function checkLoaded() {
        var doc = iFrame.contentDocument || iFrame.contentWindow.document;
        // We can tell if there is a dummy document installed because the dummy document
        // will have an URL that starts with "about:".  The real document will not have that URL
        if (doc.URL.indexOf("about:") !== 0) {
            if (doc.readyState === "complete") {
                ready.call(doc);
            } else {
                // set event listener for DOMContentLoaded on the new document
                addEvent(doc, "DOMContentLoaded", ready);
                addEvent(doc, "readystatechange", readyState);
            }
        } else {
            // still same old original document, so keep looking for content or new document
            timer = setTimeout(checkLoaded, 1);
        }
    }
    checkLoaded();
}

function tumblrFixes(){
	var divs = document.getElementsByTagName("div");
	for (var i = 0; i < divs.length; i++){
		var div = divs[i];
		if (div.classList.contains("media-button") && div.classList.contains("media-killer") && div.classList.contains("icon_close")){
			div.parentElement.parentElement.removeChild(div.parentElement.nextSibling);
			div.parentElement.removeChild(div);
		}
		if (div.className.toLowerCase() === "html_photoset"){
			var iframe = div.getElementsByTagName("iframe")[0];
			iframe.style.height = "100%";
			var fn = function(){
				div.style.height = (iframe.contentDocument || iframe.contentWindow.document).getElementsByTagName("html")[0].scrollHeight + "px";
			};
			$(iframe).on('ready', fn);
			$(iframe).on('load', fn);
			fn();
		}
	}
}


$(document).on('ready', tumblrFixes);
