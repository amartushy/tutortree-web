schoolRef = dataRef.parent

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
    	var tutorId = snapshot.child("/connections/" + connectionId + "/tutor/").val()
        var tutorsName = snapshot.child("/users/"+tutorId+"/name/").val()
        var tutorsPhotoURL = snapshot.child("/users/"+tutorId+"/profileURL/").val()
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
        	if( tutorsPhotoURL.length > 50 ) {
			messagingImage.src = tutorsPhotoURL
		} else {	
			messagingImage.src = snapshot.child("/users/XwbsnUHFYOZabc8IwGybfELFqKC2/profileURL/").val()
		}	
        } catch {
        	messagingImage.src = snapshot.child("/users/XwbsnUHFYOZabc8IwGybfELFqKC2/profileURL/").val()
        }
        
    	messagingHeader.innerHTML = tutorsName
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
                                + tutorId +"')")
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

function initializeMessagingHeader(tutorId) {

	var studentRef = schoolRef.child('/users/'+tutorId)
	studentRef.once("value", function(snapshot) {
    		var tutorsName = snapshot.child('/name/').val()
        	var tutorsEmail = snapshot.child('/email/').val()
        	var tutorsPhone = snapshot.child('/phone/').val()
        
        	document.getElementById("students-name-header").innerHTML = tutorsName
        
        	var tutorsContactNumber = document.getElementById("tutors-number")
        	var tutorsContactEmail = document.getElementById("tutors-email")
        	if (snapshot.child('/smsNotifications/').val() == true) {
        		tutorsContactNumber.innerHTML = tutorsPhone
        	} else {
        		tutorsContactNumber.innerHTML = "This tutor has not agreed to sms contact"
        	}
        
        	if (snapshot.child('/emailNotifications/').val() == true) {
        		tutorsContactEmail.innerHTML = tutorsEmail
        	} else {
        		tutorsContactEmail.innerHTML = "This tutor has not agreed to email contact"
        	}
    	})
}
var sendButton = document.getElementById("send-message")
sendButton.setAttribute("onClick", "sendMessage()")


function listenForIncomingMessages(connection, tutor) {
	var messageArea = document.getElementById("messages-area")
	var messageRef = schoolRef.child("/connections/"+connection+"/messages/")
		messageRef.on("value", function(snapshot) {
		while (messageArea.firstChild) {
			messageArea.removeChild(messageArea.firstChild);
		}
		var messagesMainArray = []
		var dateIdentifiers = []
		for (message in snapshot.val()) {
			var sender = snapshot.child(message+"/sender/").val()
			var date = snapshot.child(message+'/metadata/date/').val()

			var messagesArray = []
			var messageSubArray = []

		if (sender == tutor) {
			messageSubArray.push( "tutor" )
		} else {
			messageSubArray.push( "student" )
		}
		messageSubArray.push( snapshot.child(message+'/message/').val(), message )
		dateIdentifiers.push(date)
		messagesArray.push(date, messageSubArray)
		messagesMainArray.push(messagesArray)
    	}
    sortAndFormatMessages( dateIdentifiers, messagesMainArray )
    messageArea.scrollTop = messageArea.scrollHeight;
    })   
}

function sortAndFormatMessages(array1, array2) {
	array1.sort(function(a, b){return a-b})
    
	for(i=0;i< array1.length;i++) {
    		for(j=0;j<array2.length;j++) {
      			if(array1[i] == array2[j][0]) {
            			formatMessage( array2[j][1][0], array2[j][1][1], array2[j][1][2] )
         			array2[j][0]=0
      			}
    		}
	}
}

function addListenerToField(connectionId) {
    var oldMessageField = document.getElementById("message-field")
	var newMessageField = oldMessageField.cloneNode(true)
	oldMessageField.parentNode.replaceChild(newMessageField, oldMessageField)
	newMessageField.addEventListener("keydown", function (e) {
    		if (e.keyCode === 13) {
    				sendMessage(connectionId)
    		}
    	})
}

function sendMessage(connectionId) {
	var connectionRef = schoolRef.child("/connections/"+connectionId)
	var messageValue = document.getElementById("message-field").value
    	var currentDate = new Date()
    	var currentTimeStamp = (currentDate.getTime() / 1000)
    	var identifier = createIdentifier()
    	var newDate = 0
    
	formatMessage("student", messageValue)
    	console.log( connectionId )
    
    	connectionRef.once("value", function(snapshot) {
    	var sender = snapshot.child("student").val()
        var recipient = snapshot.child("tutor").val()
       
	var messagesObject = snapshot.child("/messages/").val()
        try { 
        	var maxCount = Object.keys(messagesObject).length 
            	newDate = maxCount + 1
        } catch { 
        	console.log("No messages") 
        }
        
        var metadataDict = { 
        	"date" : newDate,
            	"timeStamp" : currentTimeStamp,
            	"identifier" : createIdentifier(),
        }
        
        var messagesObject = { 
            	"message" : messageValue,
            	"metadata" : metadataDict,
		"sender" : userId  
        }
       	
        var newIdentifier = createIdentifierMain()
        console.log(newIdentifier)
        var dictToUpdateFB = {}
        dictToUpdateFB[newIdentifier] = messagesObject
        console.log(dictToUpdateFB)
        connectionRef.child("/messages/").update(dictToUpdateFB)
        
        console.log("here")
        console.log(sender)
        console.log(recipient)
        sendMessageNotifications(sender, recipient, messageValue)
    })
    
    document.getElementById("message-field").value = ""  
}

function sendMessageNotifications(sender, recipient, messageValue) {
    	//Get Students Name
    	var studentsName = ""
    	var studentsRef = dataRef.child(sender+'/name/')
    	studentsRef.once('value', function(snapshot) {
    		studentsName = snapshot.val()
    	})
    
    	//Send Notifications
    	var tutorsRef = dataRef.child(recipient)
    	tutorsRef.once("value", function(snapshot) {

          	if (snapshot.child("/smsNotifications/").val() == true) {
          		var tutorsPhone = snapshot.child("phone").val()
              		var smsMessage = "New Message%0A" + studentsName +": " + messageValue
              		sendSMSTo(tutorsPhone, smsMessage)
          	}
          	if (snapshot.child("/emailNotifications/").val() == true) {
          		var tutorsEmail = snapshot.child("email").val()
              		var titleEmail = "New Message"
              		var emailMessage = studentsName + ": " + messageValue
              		sendEmailTo(tutorsEmail, titleEmail, emailMessage)
          	}
          	if (snapshot.child("/pushNotifications/").val() == true) {
          		var tutorsToken = snapshot.child("token").val()
              		var titlePush = "New Message"
              		var pushMessage = studentsName + ": " + messageValue
              		sendPushTo(tutorsToken, titlePush, pushMessage)
          	}
    	})
}

function initializeMessageArea(connectionId, blockId, tutorId) {
	var messageArea = document.getElementById("messages-area")
    	while (messageArea.firstChild) {
    		messageArea.removeChild(messageArea.firstChild);
  	}
    
    	var allTutors = document.querySelectorAll(".messages-block")
    	allTutors.forEach(function(tutorItem) {
    		tutorItem.style.backgroundColor = 'transparent'
    	})
    	document.getElementById(blockId).style.backgroundColor = "rgba(51, 51, 51, 0.14)"

    	initializeMessagingHeader(tutorId)
    	var messageRef = schoolRef.child("/connections/"+connectionId+"/messages/")
    	messageRef.once("value", function(snapshot) {
    
   		var messagesMainArray = []
    		var dateIdentifiers = []
    		for (message in snapshot.val()) {
       			var sender = snapshot.child(message+"/sender/").val()
       			var date = snapshot.child(message+'/metadata/date/').val()
       
       			var messagesArray = []
       			var messageSubArray = []
       
       			if (sender == tutorId) {
           			messageSubArray.push( "tutor" )
       			} else {
           			messageSubArray.push( "student" )
       			}
       			messageSubArray.push( snapshot.child(message+'/message/').val(), message )
     	 		dateIdentifiers.push(date)
       			messagesArray.push(date, messageSubArray)
       			messagesMainArray.push(messagesArray)
    		}
    
    		sortAndFormatMessages( dateIdentifiers, messagesMainArray )
    		addListenerToField(connectionId)
    		listenForIncomingMessages(connectionId, tutorId)
	})
}

//Hide contact info when clicked outside of it
var hideMe = document.getElementById("tutors-contact-info")
	document.onclick = function(e){
	if(e.target.id !== 'hideMe'){
  		hideMe.style.display = 'none';
  	}
}

function formatMessage(individual, message, messageId) {
	var messageArea = document.getElementById("messages-area")
	var messageContainer = document.createElement("div")
    	var messageBubble = document.createElement("div")
    
    	if ( individual == "tutor" ) {
    		messageContainer.setAttribute('class', 'SP-tutor-message-container')
    		messageBubble.setAttribute('class', 'SP-tutor-message')
        
    	} else if ( individual == "student" ){
    		messageContainer.setAttribute('class', 'SP-student-message-container')
    		messageBubble.setAttribute('class', 'SP-student-message')
    	}
    
    	messageBubble.innerHTML = message
    	messageContainer.setAttribute('id', messageId)
    	messageContainer.appendChild(messageBubble)
    	messageArea.appendChild(messageContainer)
}

function createIdentifierMain() {
	var result = "-"
	var collection = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
    	var collectionLength = collection.length
    
    	for (i = 0; i < 18; i++) {
    		result += collection.charAt(Math.floor(Math.random() * collectionLength))
    	}
	return (result)
}

function createIdentifier() {
	var result = ""
	var characters = 'abcdefghijklmnopqrstuvwxyz'
    	var charactersLength = characters.length
    
    	for (i = 0; i < 8; i++) {
    		result += characters.charAt(Math.floor(Math.random() * charactersLength))
    	}
    	return result
}

//NOTIFICATIONS PUSH FUNCTIONS
function sendSMSTo(number, message) {
		var xhttp = new XMLHttpRequest();
    var herokuURL = "https://tutortree-development.herokuapp.com/sendSMSTo/+1"+number+"/"+message
		xhttp.open("GET", herokuURL, true);
		xhttp.send();
}
function sendPushTo(token, title, message) {
		var xhttp = new XMLHttpRequest();
    var herokuURL = "https://tutortree-development.herokuapp.com/sendNotification/"+title+"/"+message+"/"+token+"/1"
    xhttp.open("GET", herokuURL, true);
		xhttp.send();
}
function sendEmailTo(email, title, message) {
		var xhttp = new XMLHttpRequest();
    var herokuURL = "https://tutortree-development.herokuapp.com/sendEmailTo/"+email+"/"+title+"/"+message
    console.log(herokuURL)
		xhttp.open("GET", herokuURL, true);
		xhttp.send();
}

