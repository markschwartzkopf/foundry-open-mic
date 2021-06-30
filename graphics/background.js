'use strict';

const pairFrameReplicant = nodecg.Replicant('pairFrame');

pairFrameReplicant.on('change', newVal => {
	document.getElementById('box1').style.opacity=newVal;
	document.getElementById('box2').style.opacity=newVal;
	console.log(newVal);
});