'use strict';

// Packages
const { OBSUtility } = require('nodecg-utility-obs');
const nodecg = require('./nodecg-api-context').get();
const obs = new OBSUtility(nodecg);
const OBSLocationsReplicant = nodecg.Replicant('OBSLocations');
const pairFrameReplicant = nodecg.Replicant('pairFrame');
var moveNumber = 0;

nodecg.log.info('OBS IP:' + obs.replicants.websocket.value.ip);

obs.on('AuthenticationSuccess', () => {
	nodecg.log.info('Success! We\'re connected & authenticated.');
});

obs.on('error', err => {
	nodecg.log.error('socket error:', err);
});

nodecg.listenFor('saveOBSLocations', (params) => {
	if (nodecg.Replicant('obs:websocket').value.status == "connected") {
		obs.send('GetSceneItemProperties', {
			'scene-name': 'ClosedMic',
			'item': 'webcam'
		}).then((result) => {
			OBSLocationsReplicant.value.webcam[params.webcam].x = result.position.x;
			OBSLocationsReplicant.value.webcam[params.webcam].y = result.position.y;
			OBSLocationsReplicant.value.webcam[params.webcam].scale = result.scale.x;
			obs.send('GetSceneItemProperties', {
				'scene-name': 'ClosedMic',
				'item': 'hangouts'
			}).then((result) => {
				OBSLocationsReplicant.value.hangouts[params.hangouts].x = result.position.x;
				OBSLocationsReplicant.value.hangouts[params.hangouts].y = result.position.y;
				OBSLocationsReplicant.value.hangouts[params.hangouts].scale = result.scale.x;
			}).catch(err => { nodecg.log.error(err); })
		}).catch(err => { nodecg.log.error(err); })


	}
});

nodecg.listenFor('webcamOnly', () => {
	moveSources(0, 2);
});

nodecg.listenFor('pair', () => {
	moveSources(1, 1);
});

nodecg.listenFor('hangouts', () => {
	moveSources(2, 0);
});

function moveSources(webcamIndex, hangoutsIndex) {
	if (nodecg.Replicant('obs:websocket').value.status == "connected") {
		moveNumber++;
		var thisMove = moveNumber;
		var obsReady = true;
		var webcamInitial = {};
		var hangoutsInitial = {};
		var pairFrameInitialOpacity = pairFrameReplicant.value;
		var pairFrameFinalOpacity = 1;
		if (webcamIndex == 0) { pairFrameReplicant.value = 1; };
		if (webcamIndex == 2) { pairFrameFinalOpacity = -10; };

		obs.send('GetSceneItemProperties', {
			'scene-name': 'ClosedMic',
			'item': 'webcam'
		}).then((result) => {
			webcamInitial = JSON.parse(JSON.stringify(result));
			obs.send('GetSceneItemProperties', {
				'scene-name': 'ClosedMic',
				'item': 'hangouts'
			}).then((result) => {
				hangoutsInitial = JSON.parse(JSON.stringify(result));
				var startTime = new Date();
				var endTime = new Date;
				endTime.setTime(startTime.getTime() + OBSLocationsReplicant.value.duration);
				var deltaDate = new Date();

				var webcamScale = webcamInitial.scale.x;
				const webcamScaleDelta = OBSLocationsReplicant.value.webcam[webcamIndex].scale - webcamScale;
				var webcamX = webcamInitial.position.x;
				const webcamXDelta = OBSLocationsReplicant.value.webcam[webcamIndex].x - webcamX;
				var webcamY = webcamInitial.position.y;
				const webcamYDelta = OBSLocationsReplicant.value.webcam[webcamIndex].y - webcamY;

				var hangoutsScale = hangoutsInitial.scale.x;
				const hangoutsScaleDelta = OBSLocationsReplicant.value.hangouts[hangoutsIndex].scale - hangoutsScale;
				var hangoutsX = hangoutsInitial.position.x;
				const hangoutsXDelta = OBSLocationsReplicant.value.hangouts[hangoutsIndex].x - hangoutsX;
				var hangoutsY = hangoutsInitial.position.y;
				const hangoutsYDelta = OBSLocationsReplicant.value.hangouts[hangoutsIndex].y - hangoutsY;

				const pairFrameOpacityDelta = pairFrameFinalOpacity - pairFrameInitialOpacity;

				var i = 0;
				var j = 0;
				var prog = 0;
				var progp = 0;

				var sourceMove = setInterval(() => {
					i = i + 1;
					deltaDate = new Date();
					prog = ((deltaDate.getTime() - startTime.getTime()) / OBSLocationsReplicant.value.duration);
					progp = prog ** .5;
					webcamScale = webcamInitial.scale.x + (webcamScaleDelta * prog);
					webcamX = webcamInitial.position.x + (webcamXDelta * prog);
					webcamY = webcamInitial.position.y + (webcamYDelta * prog);

					hangoutsScale = hangoutsInitial.scale.x + (hangoutsScaleDelta * prog);
					hangoutsX = hangoutsInitial.position.x + (hangoutsXDelta * prog);
					hangoutsY = hangoutsInitial.position.y + (hangoutsYDelta * prog);

					pairFrameReplicant.value = pairFrameInitialOpacity + (pairFrameOpacityDelta * prog);
					
					if (obsReady) {
						obsReady = false;
						j = j + 1;
						obs.send('SetSceneItemProperties', {
							'scene-name': 'ClosedMic',
							'item': 'webcam',
							'position': {
								'x': webcamX,
								'y': webcamY
							},
							'scale': {
								'x': webcamScale,
								'y': webcamScale
							}
						}).then(() => {
							obs.send('SetSceneItemProperties', {
								'scene-name': 'ClosedMic',
								'item': 'hangouts',
								'position': {
									'x': hangoutsX,
									'y': hangoutsY
								},
								'scale': {
									'x': hangoutsScale,
									'y': hangoutsScale
								}
							}).then(() => {
								obsReady = true;
							}).catch(err => { nodecg.log.error(err); });
						}).catch(err => { nodecg.log.error(err); });
					}
					if (moveNumber > thisMove) { clearInterval(sourceMove); };
					if (deltaDate > endTime) {
						clearInterval(sourceMove);
						setTimeout(() => {
							obs.send('SetSceneItemProperties', {
								'scene-name': 'ClosedMic',
								'item': 'webcam',
								'position': {
									'x': OBSLocationsReplicant.value.webcam[webcamIndex].x,
									'y': OBSLocationsReplicant.value.webcam[webcamIndex].y
								},
								'scale': {
									'x': OBSLocationsReplicant.value.webcam[webcamIndex].scale,
									'y': OBSLocationsReplicant.value.webcam[webcamIndex].scale
								}
							}).then(() => {
								pairFrameReplicant.value = pairFrameFinalOpacity;
								obs.send('SetSceneItemProperties', {
									'scene-name': 'ClosedMic',
									'item': 'hangouts',
									'position': {
										'x': OBSLocationsReplicant.value.hangouts[hangoutsIndex].x,
										'y': OBSLocationsReplicant.value.hangouts[hangoutsIndex].y
									},
									'scale': {
										'x': OBSLocationsReplicant.value.hangouts[hangoutsIndex].scale,
										'y': OBSLocationsReplicant.value.hangouts[hangoutsIndex].scale
									}									
								}).catch(err => { nodecg.log.error("s " + err); });
							}).catch(err => { nodecg.log.error("s " + err); });
						}, 20);
					}
				}, 5);
			}).catch(err => { nodecg.log.error(err); });
		}).catch(err => { nodecg.log.error(err); });
	}
}