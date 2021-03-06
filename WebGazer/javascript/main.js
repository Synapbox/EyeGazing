var dots = [];
var ixFrame = 0;
var videoType = 0;
/*
0 - initial face localization
1 - callibration
2 - content display
*/
window.onload = function() {
    $("#content_video").hide();
    //start the webgazer tracker
    webgazer.setRegression('weightedRidge') /* currently must set regression and tracker */
        .setTracker('clmtrackr')
        .setGazeListener(function(data, clock) {
            getDots(data, clock);
        })
        .begin()
        .showPredictionPoints(true); /* shows a square every 100 milliseconds where current prediction is */


    //Set up the webgazer video feedback.
    var setup = function() {

        //Set up the main canvas. The main canvas is used to calibrate the webgazer.
        var canvas = document.getElementById("plotting_canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
        
        
        var content_video = document.getElementById("content_video");
		content_video.width = window.innerWidth;
        content_video.height = window.innerHeight - 60;
        content_video.style.position = 'fixed';

    };

    function checkIfReady() {
        if (webgazer.isReady()) {
            setup();
        } else {
            setTimeout(checkIfReady, 1000);
        }
    }
    setTimeout(checkIfReady,100);

};

function getDots(data, clock){
    if (videoType==2){
        
        var xx = 0; 
        var yy = 0;

        if(data!=null){
            if(data.x > 0)
                xx = data.x;
            if(data.y > 0)
                yy = data.y;    
        }

        dots.push({
            //video: videoType
            //,second: Math.round(clock/1000)
            frame: ixFrame
            ,x: xx
            ,y: yy
            ,value: Math.floor((Math.random() * 10) + 1)
        });
        
        ixFrame++;
    }
}

function SaveDots(fileName){

    $.ajax({
        type: 'POST',
        url: "saveDots.php",
        data: {
            something: JSON.stringify(dots)
        },
        success: function(result) {
            $("#content_video").hide();
            console.log('the data was successfully sent to the server');
        }
    });

}

window.onbeforeunload = function() {
    //webgazer.end(); //Uncomment if you want to save the data even if you reload the page.
    window.localStorage.clear(); //Comment out if you want to save data across different sessions
}

/**
 * Restart the calibration process by clearing the local storage and reseting the calibration point
 */
function Restart(){
    document.getElementById("Accuracy").innerHTML = "<a>Not yet Calibrated</a>";
    ClearCalibration();
    PopUpInstruction();
}


function PlayPause(){
    var vid = document.getElementById("content_video"); 
    if(vid.paused){
        $("#content_video").show();
        vid.play();
    }
    else
        vid.pause();
}