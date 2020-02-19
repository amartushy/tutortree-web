var allConnectionsRef = schoolRef.child("/connections/")



function loadAllConnections(userId) {
		allConnectionsRef.once("value", function(snapshot) {
    
    for ( connection in snapshot.val() ) {
    		if (snapshot.child(connection+"/tutor/").val() == userId) {
        		createMessagingBlock(connection)
    		}
    }
    })
}
function createMessagingBlock(connectionId) {
	schoolRef.once("value", function(snapshot) {
    	var studentId = snapshot.child("/connections/" + connectionId + "/student/").val()
        var studentsName = snapshot.child("/users/"+studentId+"/name/").val()
        var studentsPhotoURL = snapshot.child("/users/"+studentId+"/profileURL/").val()
	var unreadBubbleCount = 0
        
        var messagingBlock = document.createElement("div")
    	var messagingImage = document.createElement("img")
    	var messagingContainer = document.createElement("div")
        var headerAndBubbleContainer = document.createElement("div")
    	var messagingHeader = document.createElement("h5")
        var unreadBubble = document.createElement("div")
    	var messagingPreview = document.createElement("div")
    	var blockId = connectionId+"-block"
        var bubbleId = connectionId+"-bubble"
	
    	messagingBlock.setAttribute('class', 'messages-block')
    	messagingImage.setAttribute('class', 'messages-image')
    	messagingContainer.setAttribute('class', 'messages-container')
        headerAndBubbleContainer.setAttribute('class', 'header-and-bubble')
    	messagingHeader.setAttribute('class', 'messages-header')
        unreadBubble.setAttribute('class', 'unread-bubble')
	unreadBubble.setAttribute('id', bubbleId)
    	messagingPreview.setAttribute('class', 'messages-preview')
        messagingPreview.setAttribute('id', connectionId)
        messagingBlock.setAttribute('id', blockId)
        
        try{ 
        	if( studentsPhotoURL.length > 50 ) {
			messagingImage.src = studentsPhotoURL
		} else {	
			messagingImage.src = snapshot.child("/users/XwbsnUHFYOZabc8IwGybfELFqKC2/profileURL/").val()
						}	
        } catch {
        	messagingImage.src = snapshot.child("/users/XwbsnUHFYOZabc8IwGybfELFqKC2/profileURL/").val()
        }
        
    	messagingHeader.innerHTML = studentsName
        unreadBubble.innerHTML = 0
	unreadBubble.style.display = 'none'
    	messagingContainer.appendChild(headerAndBubbleContainer)
        headerAndBubbleContainer.appendChild(messagingHeader)
        headerAndBubbleContainer.appendChild(unreadBubble)
    	messagingContainer.appendChild(messagingPreview)
    	messagingBlock.appendChild(messagingImage)
    	messagingBlock.appendChild(messagingContainer)
    		
    	document.getElementById("messages-students").appendChild(messagingBlock)
        messagingBlock.setAttribute("onClick", "initializeMessageArea('" 
    				+ connectionId +"','" 
        			+ blockId + "','"
                                + studentId +"')")
        loadLastMessage(connectionId)
    })
}

function loadLastMessage(connectionId) {
		var messageRef = schoolRef.child("/connections/"+connectionId+"/messages/")
		messageRef.once("value", function(snapshot) {
    var messagePreview = document.getElementById(connectionId)
    var countMessage = 0
    var latestMessage = ""
    
    for (message in snapshot.val()) {
    
    		var dataCount = snapshot.child(message+'/metadata/date/').val()
    		if( dataCount > countMessage) {
        		latestMessage = snapshot.child(message+'/message/').val()
            countMessage = dataCount
        }
    }
    
    if ( countMessage > 0 ) {
    		messagePreview.innerHTML = latestMessage
    } else {
    		messagePreview.innerHTML = "No messages yet"
    }
 
  })
}

function initializeMessagingHeader(studentId) {

		var studentRef = schoolRef.child('/users/'+studentId)
		studentRef.once("value", function(snapshot) {
    		var studentsName = snapshot.child('/name/').val()
        var studentsEmail = snapshot.child('/email/').val()
        var studentsPhone = snapshot.child('/phone/').val()
        
        document.getElementById("students-name-header").innerHTML = studentsName
        
        var studentsContactNumber = document.getElementById("students-number")
        var studentsContactEmail = document.getElementById("students-email")
        if (snapshot.child('/smsNotifications/').val() == true) {
        		studentsContactNumber.innerHTML = studentsPhone
        } else {
        		studentsContactNumber.innerHTML = "This student has not agreed to sms contact"
        }
        
        if (snapshot.child('/emailNotifications/').val() == true) {
        		studentsContactEmail.innerHTML = studentsPhone
        } else {
        		studentsContactEmail.innerHTML = "This student has not agreed to email contact"
        }
    })
}










/*
function listenForIncomingMessages(connection, student) {
		var currentMessagesArea = document.getElementById("messages-area")
		var connectionListener = dataRef.child('/connections/'+connection)
    //create array to hold subarrays
    var connectionArrays = []
    //create array for date identifiers
    var dateIdentifiers = []
    //create array message id's on DOM
    
    var currentMessageIDs = Object.values(currentMessagesArea)
    console.log("current ids: " + currentMessageIDs)
    
    connectionListener.on("value", function(snapshot) {
    		//check if messages exist
        //try {
        //check if the update trigger was a new message - use keys.length
        		var allMessages = snapshot.child('/messages/').val()
        
        		console.log(allMessages)
        		console.log(Object.keys(allMessages).length)
        		if(Object.keys(allMessages).length > currentMessageIDs.length) {
            		//match children id's to database
                for(messageIdentifier in allMessages) {
                    //if db id is not found on DOM:
                		if(!currentMessageIDs.includes(messageIdentifier)) {
                    		var newMessageSubArray = []
                    		//init sub array
                    		var newMessageArray = new Array(3)
                        var message = snapshot.child('/messages/message/').val()
                        var isStudent = snapshot.child('/messages/sender/').val()
                        var dateObject = snapshot.child('/messages/date/').val()
                        
                        //check individual and push to subarray
                        if( isStudent == student ) {
                        		newMessageArray.push('student', message, messageIdentifier)
                            newMessageSubArray.push( dateObject, newMessageSubArray )
                        } else { 
                        		newMessageArray.push('tutor', message, messageIdentifier)
                            newMessageSubArray.push( dateObject, newMessageSubArray )
                        }
                        connectionArrays.push(newMessageSubArray)
                        dateIdentifiers.push(dateObject)
                   }
            		}
                  
            }
            //sort unupdated messages in ascending order
						//formatMessage for every value in main array
            sortAndFormatMessages(dateIdentifiers, connectionArrays)
        
        //} catch {
        		console.log("Update was not for a new message")
        //}
      
    })

}*/
