'use strict';

const nameReplicant = nodecg.Replicant('name');
const socialReplicant = nodecg.Replicant('social');
const socialIconsReplicant = nodecg.Replicant('socialIcons');
var socialIcons = {};
socialIconsReplicant.on('change', (newValue, oldValue) => {
	socialIcons = newValue;
})
var iconsLoaded = false;

function LoadJSON(file, callback) {
	var request = new XMLHttpRequest();
	request.overrideMimeType("application/json");
	request.open("GET", file, true);
	request.onreadystatechange = () => {
		if (request.readyState === 4 && request.status == "200") {
			callback(request.responseText);
		}
	}
	request.send(null);
}

LoadJSON("./social-icons.json", (text) => {
	socialIconsReplicant.value = JSON.parse(text);
	socialIcons = JSON.parse(text)
	iconsLoaded = true
})

//function loadTypes() {
/*var sIcons = JSON.parse(text);
//populate dropdowns
var dropdowns = document.getElementsByClassName("social-options");
for (var x = 0; x < dropdowns.length; x++) {
	dropdowns[x].innerHTML = "";
	var opt = document.createElement("option");
	opt.value = "none";
	opt.innerHTML = "none";
	dropdowns[x].appendChild(opt);
	for (var y = 0; y < Object.keys(sIcons).length; y++) {
		opt = document.createElement("option");
		opt.value = Object.keys(sIcons)[y];
		opt.innerHTML = Object.keys(sIcons)[y];
		dropdowns[x].appendChild(opt);
	}
} */
//	});
//};

//loadTypes();

document.querySelector('#webcam').onclick = () => {
	nodecg.sendMessage('webcamOnly');
};

document.querySelector('#pair').onclick = () => {
	nodecg.sendMessage('pair');
};

document.querySelector('#hangouts').onclick = () => {
	nodecg.sendMessage('hangouts');
};

function addSocial(name, type) {
	if (!iconsLoaded) {
		console.log("You gotta wait");
		return;
	}
	var div = document.createElement("div");
	var input = document.createElement("input");
	input.className = "input-text social-text";
	if (name) { input.value = name; };
	div.appendChild(input);
	var select = document.createElement("select");
	select.className = "social-options";
	var opt = document.createElement("option");
	opt.value = "none";
	opt.innerHTML = "none";
	select.appendChild(opt);
	for (var y = 0; y < Object.keys(socialIcons).length; y++) {
		opt = document.createElement("option");
		opt.value = Object.keys(socialIcons)[y];
		opt.innerHTML = Object.keys(socialIcons)[y];
		select.appendChild(opt);
	}
	select.value = type;
	div.appendChild(select);
	document.getElementById('social-container').appendChild(div);
}

document.querySelector('#add').onclick = () => {
	if (iconsLoaded) { addSocial("", "none"); };
};

document.querySelector('#subtract').onclick = () => {
	var div = document.getElementById('social-container');
	if (div.children.length > 1) {
		div.removeChild(div.children[div.children.length - 1]);
	} else {
		console.log("Gotta leave one");
	}
};

document.querySelector('#submit').onclick = () => {
	nameReplicant.value = document.getElementById('name').value;
	var transArray = [{}];
	var names = document.getElementsByClassName('social-text');
	var i = 0;
	for (var x = 0; x < names.length; x++) {
		if (names[x].value) {
			transArray[i] = {};
			transArray[i].name = names[x].value;
			transArray[i].type = names[x].parentElement.children[1].value;
			i++;
		}
	}
	NodeCG.waitForReplicants(socialReplicant).then(() => {
		socialReplicant.value = JSON.parse(JSON.stringify(transArray));
	});
};

document.querySelector('#clear').onclick = () => {
	document.getElementById('name').value = "";
	document.getElementById('social-container').innerHTML = "";
	addSocial();
};

nameReplicant.on('change', (newValue, oldValue) => {
	document.getElementById('name').value = newValue;
})

socialReplicant.on('change', (newValue, oldValue) => {
	var wait = setInterval(() => {
		if (iconsLoaded) {
			document.getElementById('social-container').innerHTML = "";
			for (var x = 0; x < newValue.length; x++) {
				addSocial(newValue[x].name, newValue[x].type);
			}
			clearInterval(wait);
		}
	}, 100)
})

document.querySelector('#l3-in').onclick = () => {
	nodecg.sendMessage('l3In');
};

document.querySelector('#l3-out').onclick = () => {
	nodecg.sendMessage('l3Out');
};

/* document.querySelector('#test').onclick = () => {
	//nodecg.sendMessage('test');
}; */