'use strict';

const nameReplicant = nodecg.Replicant('name');
const socialReplicant = nodecg.Replicant('social');
const socialIconsReplicant = nodecg.Replicant('socialIcons');
const socialAssetsReplicant = nodecg.Replicant('assets:social-icons');

var socialIcons = {}
NodeCG.waitForReplicants(socialIconsReplicant).then(() => {
	socialIcons = socialIconsReplicant.value;
})
socialIconsReplicant.on('change', (newValue, oldValue) => {
	socialIcons = newValue;
})
var socialAssets = {}
NodeCG.waitForReplicants(socialAssetsReplicant).then(() => {
	socialAssets = socialAssetsReplicant.value;
})
socialAssetsReplicant.on('change', (newValue, oldValue) => {
	socialAssets = newValue;
})

var logoRect = document.getElementById('logo').getBoundingClientRect();
var nameInDuration = 2500;
var spinnyDelay = 3000;
var spinnyDuration = 500;
var logoOutDelay = 0;
var l3OutDuration = 500;
var scrollDuration = 1500;
var scrollDelay = 20000;

var l3Status = "out"
var l3ScrollStatus = false;
var l3ScrollCount = 0;
var textInDelay = (60 / (logoRect.right + 10)) * nameInDuration;
var textInDuration = nameInDuration - (textInDelay * 1.5);
var socialInDelay = ((22.5 / (logoRect.right + 2.5)) * nameInDuration);
var socialDuration = nameInDuration - (socialInDelay * (82.5 / 22.5));
socialInDelay = socialInDelay + logoOutDelay;
var l3Width = document.getElementById('l3textcontainer').getBoundingClientRect().width;
var nameIn = document.getElementById("name-container").animate([{ width: '0%' }, { width: '100%' }], { delay: textInDelay, duration: textInDuration, easing: 'cubic-bezier(0, 0, .5, 1)', fill: 'forwards' });
nameIn.cancel();
var logoIn = document.getElementById("logo").animate([{ transform: 'translate(' + (-logoRect.right - 10) + 'px, 0px) scale(1)' }, { transform: 'translate(0px, 0px)' }], { duration: nameInDuration, easing: 'cubic-bezier(0, 0, .5, 1)', fill: 'forwards' });
logoIn.cancel();
var spinny = document.getElementById("logo").animate([{ transform: 'translate(0px,0px) rotate(0deg) scale(1)' }, { transform: 'translate(-7.5px, 52.5px) rotate(180deg) scale(.75)' }], { delay: spinnyDelay, duration: spinnyDuration, fill: "forwards" });
spinny.cancel();
var logoOut = document.getElementById("logo").animate([{ transform: 'translate(-7.5px, 52.5px) scale(.75)' }, { transform: 'translate(' + (-logoRect.right - 10) + 'px, 52.5px) scale(.75)' }], { delay: logoOutDelay, duration: nameInDuration, fill: "forwards" });
logoOut.cancel();
var socialIn = document.getElementById("social-container").animate([{ width: '0%' }, { width: '100%' }], { delay: socialInDelay, duration: socialDuration, fill: "forwards" });
socialIn.cancel();
var l3Out = document.getElementById("l3container").animate([{ transform: 'translate(0px, 0px) scale(1)' }, { transform: 'translate(' + (-logoRect.right) + 'px, 0px)' }], { duration: l3OutDuration, fill: "forwards" });
l3Out.cancel();
var socialScroller1 = document.getElementById("s-span1").animate([{ transform: 'translateX(0px)' }, { transform: 'translateX(-' + l3Width + 'px)' }], { duration: scrollDuration, fill: "forwards", easing: "ease-in-out" });
socialScroller1.cancel();
var socialScroller2 = document.getElementById("s-span1").animate([{ transform: 'translateX(' + l3Width + 'px)' }, { transform: 'translateX(0px)' }], { duration: scrollDuration, fill: "forwards", easing: "ease-in-out" });
socialScroller2.cancel();

function socialSpan(type) {
	var spn = document.createElement("span");
	spn.style.width = "45px";
	spn.style.height = "45px";
	spn.style.display = "inline-block";
	spn.style.overflow = "hidden";
	var img = document.createElement("img");
	if (socialIcons[type]) {
		var imageSource = "";
		for (var x = 0; x < socialAssets.length; x++) {
			if (socialAssets[x].base == socialIcons[type].src) {
				imageSource = socialAssets[x].url;
				img.style.position = "relative";
				Object.assign(img.style, socialIcons[type].style)
				img.src = imageSource;
			};
		}
		if (img.src) {
			spn.appendChild(img);
			return spn
		} else {
			console.log("Can't fetch asset source url")
			return null
		}
	} else {
		return null;
	}
	console.log ("how did you get here?")
	return null;
};

function scrollSocial(newValue) {
	l3ScrollStatus = true;
	l3ScrollCount++;
	var i = 0;
	var check = l3ScrollCount;
	//console.log("in:" + check);
	var scrollLoop = setInterval(() => {
		if (check != l3ScrollCount) {
			l3ScrollStatus = false;
			clearInterval(scrollLoop);
			//console.log("out:" + check);
			return;
		};
		i++;
		if (i >= newValue.length) { i = 0; };
		var sclspn = document.createElement("span");
		sclspn.id = "s-span2"
		sclspn.style.transform = "translateX(" + l3Width + "px)"
		var spn = socialSpan(newValue[i].type);
		if (spn) {
			sclspn.appendChild(spn);
		};
		var spn = document.createElement("span");
		spn.innerHTML = newValue[i].name;
		sclspn.appendChild(spn);
		document.getElementById('social').appendChild(sclspn);
		socialScroller1 = document.getElementById("s-span1").animate([{ transform: 'translateX(0px)' }, { transform: 'translateX(-' + l3Width + 'px)' }], { duration: scrollDuration, fill: "forwards", easing: "cubic-bezier(.5,-0.07,.5,1.07)" });
		socialScroller2 = document.getElementById("s-span2").animate([{ transform: 'translateX(' + l3Width + 'px)' }, { transform: 'translateX(0px)' }], { duration: scrollDuration, fill: "forwards", easing : "cubic-bezier(.5,-0.07,.5,1.07)" });
		socialScroller2.onfinish = () => {
			var sSpan1 = document.getElementById('s-span1');
			sSpan1.parentNode.removeChild(sSpan1);
			document.getElementById('s-span2').id = "s-span1"
		}
	}, (scrollDelay + scrollDuration));
};

function resizeL3(socRepCopy) {
	var nameSize = document.getElementById('name').getBoundingClientRect();
	//document.getElementById('social').style.width = "auto";
	var socialSize = document.getElementById('s-span1').getBoundingClientRect();
	if (nameSize.width > (socialSize.width + 10)) {
		l3Width = nameSize.width;
	} else {
		l3Width = socialSize.width + 10;
	}
	if (socRepCopy.length > 1) {
		for (var x = 1; x < socRepCopy.length; x++) {
			var sclspn = document.createElement("span");
			sclspn.id = "deleteme"
			sclspn.style.transform = "translateX(" + l3Width + "px)"
			var spn = socialSpan(socRepCopy[x].type);
			if (spn) {
				sclspn.appendChild(spn);
			};
			var spn = document.createElement("span");
			spn.innerHTML = socRepCopy[x].name;
			sclspn.appendChild(spn);
			document.getElementById('social').appendChild(sclspn);
			socialSize = document.getElementById('deleteme').getBoundingClientRect();
			if ((socialSize.width + 10) > l3Width) { l3Width = socialSize.width + 10; };
			var sSpan1 = document.getElementById('deleteme');
			sSpan1.parentNode.removeChild(sSpan1);
		}
	}
	document.getElementById('name-container').style.width = l3Width + "px";
	document.getElementById('social').style.width = (l3Width - 9) + "px";
	document.getElementById('s-c-c').style.width = l3Width + "px";
	document.getElementById('l3textcontainer').style.width = l3Width + "px";
	//logoIn.cancel();
	//spinny.cancel();
	//logoOut.cancel();
};

nameReplicant.on('change', (newValue, oldValue) => {
	document.getElementById('name').innerHTML = newValue;
	NodeCG.waitForReplicants(socialReplicant).then(() => {
		resizeL3(socialReplicant.value);
	})
});

socialReplicant.on('change', (newValue, oldValue) => {
	var delayTime = 0;
	if (l3ScrollStatus == true) {
		l3ScrollCount++; //stop scrollSocial
		if (l3Status == "in") {
			delayTime = scrollDelay + scrollDuration + 100;
		}
	}
	setTimeout(() => {
		var w = document.getElementById('social-container').clientWidth;
		document.getElementById('s-span1').innerHTML = "";
		var spn = socialSpan(newValue[0].type);
		if (spn) {
			document.getElementById('s-span1').appendChild(spn);
		};
		if (newValue[0].name != "") {
			var spn = document.createElement("span");
			spn.innerHTML = newValue[0].name;
			document.getElementById('s-span1').appendChild(spn);
		}
		resizeL3(newValue);
		if ((l3Status == "in") && (newValue[0].name != "") && (w == 0)) {
			l3Status = "between";
			spinny = document.getElementById("logo").animate([{ transform: 'translate(0px,0px) rotate(0deg) scale(1)' }, { transform: 'translate(-7.5px, 52.5px) rotate(180deg) scale(.75)' }], { duration: spinnyDuration, fill: "forwards" });
			spinny.onfinish = () => {
				logoOut.play();
				socialIn.play();
			}
			spinny.cancel();
			logoRect = document.getElementById('logo').getBoundingClientRect();
			textInDelay = (60 / (logoRect.right + 10)) * nameInDuration;
			textInDuration = nameInDuration - (textInDelay * 1.5);
			socialInDelay = ((22.5 / (logoRect.right + 2.5)) * nameInDuration);
			socialInDelay = socialInDelay + logoOutDelay;
			logoOut = document.getElementById("logo").animate([{ transform: 'translate(-7.5px, 52.5px) scale(.75)' }, { transform: 'translate(' + (-logoRect.right - 10) + 'px, 52.5px) scale(.75)' }], { delay: logoOutDelay, duration: nameInDuration, fill: "forwards" });
			logoOut.cancel();
			logoOut.onfinish = () => {
				document.getElementById('logo').style.opacity = 0;
				l3Status = "in";
				NodeCG.waitForReplicants(socialReplicant).then(() => {
					if (socialReplicant.value.length > 1) {
						var socRepCopy = JSON.parse(JSON.stringify(socialReplicant.value));
						scrollSocial(socRepCopy);
					}
				});
			}
			socialIn = document.getElementById("social-container").animate([{ width: '0%' }, { width: '100%' }], { delay: socialInDelay, duration: socialDuration, fill: "forwards" });
			socialIn.cancel();

			spinny.play();
		} else {
			if (l3Status == "in") {
				if (newValue.length > 1) {
					var socRepCopy = JSON.parse(JSON.stringify(newValue));
					scrollSocial(socRepCopy);
				}
			}
		}
	}, delayTime);
});

function setAnimParams() {
	logoRect = document.getElementById('logo').getBoundingClientRect();
	textInDelay = (60 / (logoRect.right + 10)) * nameInDuration;
	textInDuration = nameInDuration - (textInDelay * 1.5);
	socialInDelay = ((22.5 / (logoRect.right + 2.5)) * nameInDuration);
	socialDuration = nameInDuration - (socialInDelay * (82.5 / 22.5));
	socialInDelay = socialInDelay + logoOutDelay;

	nameIn = document.getElementById("name-container").animate([{ width: '0%' }, { width: '100%' }], { delay: textInDelay, duration: textInDuration, fill: "forwards", easing: 'cubic-bezier(0, 0, .5, 1)' });
	nameIn.cancel();
	logoIn = document.getElementById("logo").animate([{ transform: 'translate(' + (-logoRect.right - 10) + 'px, 0px) scale(1)' }, { transform: 'translate(0px, 0px)' }], { duration: nameInDuration, fill: "forwards", easing: 'cubic-bezier(0, 0, .5, 1)' });
	logoIn.cancel();
	logoIn.onfinish = () => {
		if (document.getElementById('s-span1').innerHTML != "") {
			spinny.play();
		} else {
			l3Status = "in";
		}
	};

	spinny = document.getElementById("logo").animate([{ transform: 'translate(0px,0px) rotate(0deg) scale(1)' }, { transform: 'translate(-7.5px, 52.5px) rotate(180deg) scale(.75)' }], { delay: spinnyDelay, duration: spinnyDuration, fill: "forwards" });
	spinny.cancel();
	spinny.onfinish = () => {
		logoOut.play();
		socialIn.play();
	}
	logoOut = document.getElementById("logo").animate([{ transform: 'translate(-7.5px, 52.5px) scale(.75)' }, { transform: 'translate(' + (-logoRect.right - 10) + 'px, 52.5px) scale(.75)' }], { delay: logoOutDelay, duration: nameInDuration, fill: "forwards" });
	logoOut.cancel();
	logoOut.onfinish = () => {
		document.getElementById('logo').style.opacity = 0;
		l3Status = "in";
		NodeCG.waitForReplicants(socialReplicant).then(() => {
			if (socialReplicant.value.length > 1) {
				var socRepCopy = JSON.parse(JSON.stringify(socialReplicant.value));
				scrollSocial(socRepCopy);
			}
		});
	}

	socialIn = document.getElementById("social-container").animate([{ width: '0%' }, { width: '100%' }], { delay: socialInDelay, duration: socialDuration, fill: "forwards" });
	socialIn.cancel();
};

nodecg.listenFor('l3In', () => {
	if (l3Status != "out") {
		console.log("Can only animate L3 in if L3 is out")
		return
	}
	l3Status = "between";
	document.getElementById('name-container').style.width = "0%";
	document.getElementById('social-container').style.width = "0%";
	l3Out.cancel();
	document.getElementById('l3container').style.transform = "none";
	setAnimParams();
	logoIn.play();
	nameIn.play();
	document.getElementById('logo').style.opacity = 1;
	document.getElementById('l3container').style.opacity = 1;
});

nodecg.listenFor('l3Out', () => {
	if (l3Status != "in") {
		console.log("Can only animate L3 out if L3 is in")
		return
	}
	if (l3ScrollStatus == true) {
		l3ScrollCount++; //stop scrollSocial
	}
	l3Out = document.getElementById("l3container").animate([{ transform: 'translateX(0px)' }, { transform: 'translateX(' + (-logoRect.right) + 'px)' }], { duration: l3OutDuration, fill: "forwards" });
	l3Out.cancel();
	l3Out.onfinish = () => {
		// these cause wonkyness
		//socialScroller1.cancel();
		//socialScroller2.cancel();
		nameIn.cancel();
		logoIn.cancel();
		spinny.cancel();
		logoOut.cancel();
		socialIn.cancel();
		document.getElementById('name-container').style.width = "0%";
		document.getElementById('social-container').style.width = "0%";
		document.getElementById('l3container').style.opacity = 0;
		l3Out.cancel();
		l3Status = "out";
	};
	l3Out.play();
});