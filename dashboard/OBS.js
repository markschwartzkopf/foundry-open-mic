'use strict';

const websocketReplicant = nodecg.Replicant('obs:websocket');
const OBSerrorReplicant = nodecg.Replicant('OBSerror');
const OBSLocationsReplicant = nodecg.Replicant('OBSLocations');

document.querySelector('#connectButton').onclick = () => {
	OBSerrorReplicant.value = "";
	nodecg.sendMessage('obs:connect', {
		ip: 'localhost',
		port: 4444,
		password: 'pbmax'
	}).then(() => {
		console.log('successfully connected to obs');
		OBSerrorReplicant.value = "";
	}).catch(err => {
		console.error('failed to connect to obs:', err);
		OBSerrorReplicant.value = err;
	});
};

document.querySelector('#disconnectButton').onclick = () => {
	nodecg.sendMessage('obs:disconnect');
	OBSerrorReplicant.value = "";
};

OBSerrorReplicant.on('change', newVal => {
	document.getElementById('OBSerror').innerHTML = newVal;
})

websocketReplicant.on('change', newVal => {
	document.getElementById('status').innerHTML = newVal.status;
	console.log(newVal.status);
	if (newVal.status == 'connected') {
		document.getElementById('status').style.backgroundColor = '#00ff00';
		OBSerrorReplicant.value = "";
	} else {
		document.getElementById('status').style.backgroundColor = '#ffffff';
	}
});

document.querySelector('#reset').onclick = () => {
	OBSLocationsReplicant.value = {
		webcam:[
			{x:0, y:0, scale: 1}, //primary
			{x:642, y:181, scale: .4953}, //pair
			{x:915, y:506, scale: .2727} //pip
		],
		hangouts:[
			{x:0, y:0, scale: 1}, //primary
			{x:4, y:181, scale: .4953}, //pair
			{x:4, y:181, scale: .4953} //pip
		],
		duration: 700
	};
};

document.querySelector('#web-save').onclick = () => {
	nodecg.sendMessage('saveOBSLocations', {webcam: 0, hangouts: 2});
};

document.querySelector('#pair-save').onclick = () => {
	nodecg.sendMessage('saveOBSLocations', {webcam: 1, hangouts: 1});
};

document.querySelector('#hang-save').onclick = () => {
	nodecg.sendMessage('saveOBSLocations', {webcam: 2, hangouts: 0});
};