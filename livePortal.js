var activeFeedsRef = database.ref("updateDatabase/liveFeeds/activeFeeds/")
function loadTutorsInfo(viewerID) {
		activeFeedsRef.once("value", function(snapshot) {
    		for (feedID in snapshot.val()) {
        
        		if (snapshot.child(feedID+"/viewers/"+viewerID).val() == 1) {
            		var tutorsImage = document.createElement("img")
                tutorsImage.setAttribute("class", "live-chat-tutor-image")
                tutorsImage.src = snapshot.child(feedID+"/tutorsImage/").val()
                document.getElementById("tutors-image-area").appendChild(tutorsImage)
                
                var tutorsName = document.getElementById("live-chat-tutor-header")
                tutorsName.innerHTML = snapshot.child(feedID+"/tutorsName/").val()
                var tutorsChatHeader = document.getElementById("live-chat-header")
                tutorsChatHeader.innerHTML = snapshot.child(feedID+"/tutorsName/").val() + "'s Chat"
                
                loadMessages(feedID)
                
                //load send message button with feedID and viewerID
                var sendChatButton = document.getElementById("send-message")
                sendChatButton.setAttribute("onClick", "sendChatMessage('"+feedID+"','"+viewerID+"')")
                
            } else {
            		location.href = "https://www.jointutortree.com/login"
            }
        } 
    })
}

function loadMessages(feedID) {
		var messagesArea = document.getElementById("live-chat-area")
    var messagesRef = database.ref("updateDatabase/liveFeeds/activeFeeds/"+feedID+"/messages/")
    
    
    messagesRef.on("value", function(snapshot) {
    		//if there's a change, delete all and then proceed
        while(messagesArea.firstChild) {
        		messagesArea.removeChild(messagesArea.firstChild);
        }
        
    		//Sort and append messages
        var messageArray = []
    		for (message in snapshot.val()) {
            //create array information to append to second array
            messageInfoArray = []
            messageInfoArray.push(snapshot.child(message+"/metaData/timeSent/").val())
            messageInfoArray.push(snapshot.child(message+"/metaData/viewer/").val())
            messageInfoArray.push(snapshot.child(message+"/message/").val())
            messageInfoArray.push(snapshot.child(message+"/metaData/profileURL/").val())
						messageArray.push(messageInfoArray)
        } 
        
        //sort first array by first index
        messageArray.sort(function(a,b){return a[0]-b[0]})
        for ( i = 0; i < messageArray.length; i++) {
            //build the block
            var liveChatMessageBlock = document.createElement("div")
            liveChatMessageBlock.setAttribute("class", "live-chat-message-block")
            messagesArea.appendChild(liveChatMessageBlock)
                        
        		var liveChatImage = document.createElement("img")
            liveChatImage.setAttribute("class", "live-chat-image")
            console.log(messageArray[i])
            liveChatImage.src = messageArray[i][3]
            liveChatMessageBlock.appendChild(liveChatImage)
                        
        		var liveChatMessage = document.createElement("div")
            liveChatMessage.setAttribute("class", "live-chat-message")
            liveChatMessage.innerHTML = messageArray[i][2]
            liveChatMessageBlock.appendChild(liveChatMessage)   
        } 
        
        messagesArea.scrollTop = messagesArea.scrollHeight;
    })
}


async function sendChatMessage(feedID, userID) {
			var messageField = document.getElementById("live-chat-message-field")
      var newDate = new Date()
      var currentTime = newDate.getTime()
      var messageDict = {}
      var newMessageID = create8CharID()
      var usersProfileRef = database.ref("updateDatabase/users/"+userID+"/profileURL/")
      
      await usersProfileRef.once("value", function(snapshot) {

              messageDict[newMessageID] = {
              		"message" : messageField.value,
              		"metaData" : {
                  		"profileURL" : snapshot.val(),
                  		"timeSent" : currentTime,
                  		"viewer" : userID
              		} 
          		}
      })
			console.log(messageDict)
      console.log(feedID)
      database.ref("updateDatabase/liveFeeds/activeFeeds/"+feedID+"/messages/").update(messageDict)
      messageField.value = ""
}

//HELPER FUNCITON TO CREATE SPENDING ID
function create8CharID() {
		var result = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var charactersLength = characters.length
    
    for (i = 0; i < 8; i++) {
    		result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}


/*
		const viewerVideoElem = document.getElementById("remote");
		const startElem = document.getElementById("start-screen-recording");
		const stopElem = document.getElementById("stop-screen-recording");

		// Options for getDisplayMedia()
		var displayMediaOptions = {
  		video: {
    		cursor: "always"
  		},
  		audio: {
    		echoCancellation: true,
    		noiseSuppression: true,
    		sampleRate: 44100
  		}
		};

		// Set event listeners for the start and stop buttons
		startElem.addEventListener("click", function(evt) {
  			startCapture();
		}, false);
		stopElem.addEventListener("click", function(evt) {
  		stopCapture();
		}, false);

		const viewer = new RTCPeerConnection()
		const streamer = new RTCPeerConnection()

		viewer.onicecandidate = e => {
				if( e.candidate) {
    				streamer.addIceCandidate(e.candidate)
    		}
		}

    streamer.onicecandidate = e => {
        if( e.candidate ) {
            viewer.addIceCandidate(e.candidate)
        }
    }
    
		async function startCapture() {

  			try {
   				await navigator.mediaDevices.getDisplayMedia(displayMediaOptions).then(stream => {
          		document.getElementById("local").srcObject = stream
          		viewer.addTrack(stream)
              return viewer.createOffer()
          })
          .then(offer => viewer.setLocalDescription(new RTCSessionDescription(offer)))
          .then(() => streamer.setRemoteDescription(viewer.localDescription))
          .then(() => streamer.createAnswer())
          .then(answer => streamer.setLocalDescription(new RTCSessionDescription(answer)))
          .then(() => viewer.setRemoteDescription(streamer.localDescription))
					
          //viewer.ontrack = ({streams: [stream]} => viewerVideoElem.srcObject = stream);
          
          } catch(err) {
          console.log("something wong")
          //console.error("Error: " + err);
  			}
  			
		}

function stopCapture(evt) {
  let tracks = viewerVideo.srcObject.getTracks();
  tracks.forEach(track => track.stop());
  viewerVideo.srcObject = null;
} */


//INSIDE ONAUTH:
/*
const domain = 'meet.jit.si';
			const options = {
    			roomName: userId,
    			width: 1000,
    			height: 600,
    			parentNode: document.querySelector('.live-feed-area'),
          interfaceConfigOverwrite: { SHOW_JITSI_WATERMARK: false,
          														JITSI_WATERMARK_LINK: 'https://www.jointutortree.com',
          														SHOW_WATERMARK_FOR_GUESTS: false,
                                      SHOW_BRAND_WATERMARK: false,},
       
			};
			
			const api = new JitsiMeetExternalAPI(domain, options);
			
	*/
