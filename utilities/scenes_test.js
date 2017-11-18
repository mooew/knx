// This module listens for specific group addresses then when one is matched it
//  executes a series of further commands that sets a lighting scene 



//////////////////////////////////////////////////////////////////
//Load in required modules and log starting

var WriteToBus  = require('knx_eibd').WriteToBus;
var knx = require('knx_eibd').knx_event

//set local variables


// console log alert that module is running
console.log('starting scenes');

///////////////////////////////////


///////////////////////////////////////////////////////////////////
//create helper functions


function checkForSceneGroupAddrs(data){
	console.log(data)
	
	
	
 	if (data.destination in scenes){
		
		if(data.value == 0){
			console.log('led aan');
			WriteToBus('0/0/7','DPT1',1);
			//turnOnSceneComponents(destination);
			}
			else {
				console.log('led uit');
				WriteToBus('0/0/7','DPT1',0);
			}
			};
 	};
/*
function turnOnSceneComponents(destination){
	//maak lijst van scenes
	sceneComponents = scenes[destination];
	var scenequeue = sceneComponents.slice(0);
//	
	function sendNextDstgad(){
		var dst = scenequeue.shift()
		if (dst){
		console.log(dst);		
		WriteToBus (dst[0],dst[1],dst[2])
		setTimeout(sendNextDstgad, 50)
		};
	};
	sendNextDstgad();	
};

//WriteToBus('0/1/1')

*/


//////////////////////////////////////////////////////////////////
// Create scenes here.....

var scenes = {};

//Low level evening scene
scenes['0/0/1'] = [
['0/0/7','DPT1',1],	//Kitchen Ceiling Spots

]

// For eating scene
scenes['0/0/1'] = [
['0/2/29','DPT1',0], 	//Kitchen Ceiling Spots
['0/2/70','DPT1',0], 	//Kitchen Island Spot
['0/2/50','DPT1',1],	//Kitchen LED strip
['0/7/10','DPT1',1], 	//Hall Lamps
['0/7/20','DPT1',0],	//Hall Spots
['0/2/42','DPT5',25],	//Snug Ceiling Spots
['0/2/10','DPT1',0],	//Snug Lamp
['1/0/10','DPT1',0],	//Landing Ceiling pendants
['1/0/30','DPT1',1]		//Dining Table Pendant
]



/////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////
	// Now that you've defined all the functions and scenes, start the process:

knx.on('bus_event', function(data){
	checkForSceneGroupAddrs(data);
	});
