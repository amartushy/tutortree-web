//Global Variables________________________________________________________________________________________
var globalUserId,
    coreName,
    corePinnedTutors,
    coreLikedTutors


var userDB = firebase.firestore()

var connectionsArea = document.getElementById('connections-area')
var messagesHeader = document.getElementById('messages-header')
var messagesArea = document.getElementById('messages-area')
var messageField = document.getElementById('message-field')
var sendMessage = document.getElementById('send-message')
var messagesModal = document.getElementById('messages-modal')
var messagesRight = document.getElementById('messages-right')

//Initialize elements on page load
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
        globalUserId = user.uid
        
		userDB.collection('userTest').doc(globalUserId).onSnapshot(function(doc) {
            var data = doc.data()
    
            coreName = data.name,
            coreLikedTutors = data.likedTutors,
            corePinnedTutors = data.pinnedTutors  
    
        })

        loadConnections()
		
	//If user is not logged in return them to login screen
	} else {
		location.href = "https://parent-tutortree.webflow.io/login"
	}
})

function loadConnections() {

    userDB.collection("messages").onSnapshot(function(connection) {
        while(connectionsArea.firstChild) {
            connectionsArea.removeChild(connectionsArea.firstChild)
        }

        connection.forEach(function(doc) {
            if (doc.data().tutor == globalUserId) {
                const connectionData = doc.data()
                const connectionID = doc.id
                const studentID = connectionData.student
                const tutorID = connectionData.tutor
                
                buildConnection(connectionID, studentID, tutorID)
            }
        })
    })
}

async function buildConnection(connectionID, studentID, tutorID) {

    var connectionBlock = document.createElement('div')
    var connectionInfo = document.createElement('div')
    var connectionImageMessaging = document.createElement('img')
    var connectionName = document.createElement('div')
    var connectionMessage = document.createElement('div')

    connectionBlock.setAttribute('class', 'connection-block')
    connectionInfo.setAttribute('class', 'connection-info')
    connectionImageMessaging.setAttribute('class', 'connection-image-messaging')
    connectionName.setAttribute('class', 'connection-name')
    connectionMessage.setAttribute('class', 'connection-message')


     //Get students info
     await userDB.collection('userTest').doc(studentID).get().then(function(doc) {
        studentData = doc.data()

        connectionName.innerHTML = studentData.name
        connectionImageMessaging.src = studentData.profileImage
    })

    await userDB.collection('messages').doc(connectionID).collection('messages').onSnapshot(function(messages) {
        var lastMessage = "No messages yet"
        connectionMessage.innerHTML = lastMessage

        messages.forEach(function(doc) {
            var timeStamp = 0
            if (doc.id > timeStamp) {
                timeStamp = doc.id
                lastMessage = doc.data().message

                connectionMessage.innerHTML = lastMessage
            }
        })
    })

    //Get Sender Type
    var senderType = 'student'
    await userDB.collection('messages').doc(connectionID).get().then(function(connection) {
        if(connection.data().tutor == globalUserId) {
            senderType = 'tutor'
        }
    })

    connectionsArea.appendChild(connectionBlock)
    connectionBlock.appendChild(connectionImageMessaging)
    connectionBlock.appendChild(connectionInfo)
    connectionInfo.appendChild(connectionName)
    connectionInfo.appendChild(connectionMessage)

    connectionBlock.addEventListener('click', function() {
        var connectionsAreaChildren = connectionsArea.children
        for (var i = 0; i < connectionsAreaChildren.length; i ++ ) {
            connectionsAreaChildren[i].setAttribute('class', 'connection-block')
        }
        connectionBlock.setAttribute('class', 'connection-block-selected')

        userDB.collection('userTest').doc(studentID).get().then(function(student) {
            let studentData = student.data()
            showHeader(studentID, studentData)
            buildMessagesProfile(studentID, studentData)
        })

        showMessages(connectionID, studentID, senderType)
        replaceMessageFieldListener(studentID, connectionID, senderType)
        sendMessage.setAttribute('onClick', 'sendConnectionMessage("' + studentID + "','" + connectionID + '","' + senderType + '")')
    })
}

function showHeader(studentID, studentData) {
    while(messagesHeader.firstChild) {
        messagesHeader.removeChild(messagesHeader.firstChild)
    }

    var connectionImageMessagingHeader = document.createElement('img')
    var connectionName = document.createElement('div')

    connectionImageMessagingHeader.setAttribute('class', 'connection-image-messaging-header')
    connectionName.setAttribute('class', 'connection-name')

    messagesHeader.appendChild(connectionImageMessagingHeader) 
    messagesHeader.appendChild(connectionName)


    connectionImageMessagingHeader.src = studentData.profileImage
    connectionName.innerHTML = studentData.name
}

function showMessages(connectionID) {
    messagesRight.style.display = 'flex'

    userDB.collection('messages').doc(connectionID).collection('messages').onSnapshot(function(messages) {
        while(messagesArea.firstChild) {
            messagesArea.removeChild(messagesArea.firstChild)
        }

        messages.forEach(function(message) {
            var messageData = message.data()
            var content = messageData.message

            var messageConnectionBlock = document.createElement('div')
            var messageBlock = document.createElement('div')
            
            messageBlock.innerHTML = content
    
            if (messageData.sender == globalUserId) {
                messageConnectionBlock.setAttribute('class', 'message-sender-block')
                messageBlock.setAttribute('class', 'message-sender')
            } else {
                messageConnectionBlock.setAttribute('class', 'message-connection-block')
                messageBlock.setAttribute('class', 'message-connection')
            }

            messagesArea.appendChild(messageConnectionBlock)
            messageConnectionBlock.appendChild(messageBlock)
        })
    })
}


function replaceMessageFieldListener(otherID, connectionId, senderType) {
    var oldMessageField = document.getElementById("message-field")
	var newMessageField = oldMessageField.cloneNode(true)
	oldMessageField.parentNode.replaceChild(newMessageField, oldMessageField)
	newMessageField.addEventListener("keydown", function (e) {
    		if (e.keyCode === 13) {
                sendConnectionMessage(otherID, connectionId, senderType)
    		}
    	})
}

function sendConnectionMessage(otherID, connectionID, senderType) {
    var today = new Date()
    var timeStamp = (today.getTime() / 1000).toString()
    var updateDict = {
        'message' : document.getElementById('message-field').value,
        'sender' : globalUserId,
        'senderType' : senderType
    }
    userDB.collection('messages').doc(connectionID).collection('messages').doc(timeStamp).set(updateDict)
    sendMessagingNotifications(otherID, coreName, document.getElementById('message-field').value)
    document.getElementById('message-field').value = ""
}


function sendMessagingNotifications(otherID, currentName, message) {

    userDB.collection('userTest').doc(otherID).get().then(function(doc) {
        var userData = doc.data()

        var isSMSOn = userData.isSMSOn
        var isPushOn = userData.isPushOn

        if(isSMSOn) {
            var phoneNumber = userData.phoneNumber
            var smsMessage = "New Message From " + currentName + ": " + message
            sendSMSTo(phoneNumber, smsMessage)
        }

        if(isPushOn) {
            var token = userData.pushToken
            var title = "New Message From " + currentName
            sendPushTo(token, title, message)
        }
    })
}
