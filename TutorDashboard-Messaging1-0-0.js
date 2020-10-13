var connectionsArea = document.getElementById('connections-area')
var messagesHeader = document.getElementById('messages-header')
var messagesArea = document.getElementById('messages-area')
var messageField = document.getElementById('message-field')
var sendMessage = document.getElementById('send-message')
var messagesModal = document.getElementById('messages-modal')

messages.addEventListener('click', function() {
    loadConnections()
    messagesModal.style.display = 'flex'
})


function loadConnections() {

    userDB.collection("messages").onSnapshot(function(connection) {
        while(connectionsArea.firstChild) {
            connectionsArea.removeChild(connectionsArea.firstChild)
        }
        connection.forEach(function(doc) {
            if (doc.data().tutor == globalTutorID) {
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

    connectionsArea.appendChild(connectionBlock)
    connectionBlock.appendChild(connectionImageMessaging)
    connectionBlock.appendChild(connectionInfo)
    connectionInfo.appendChild(connectionName)
    connectionInfo.appendChild(connectionMessage)

    connectionBlock.addEventListener('click', function() {
        showHeader(studentID)
        showMessages(connectionID, studentID)
        replaceMessageFieldListener(connectionID, tutorID)
        sendMessage.setAttribute('onClick', 'sendConnectionMessage("'+ connectionID + '","' + tutorID + '")')
    })
}

function showHeader(studentID) {
    while(messagesHeader.firstChild) {
        messagesHeader.removeChild(messagesHeader.firstChild)
    }

    var connectionImageMessagingHeader = document.createElement('img')
    var connectionName = document.createElement('div')

    connectionImageMessagingHeader.setAttribute('class', 'connection-image-messaging-header')
    connectionName.setAttribute('class', 'connection-name')

    messagesHeader.appendChild(connectionImageMessagingHeader) 
    messagesHeader.appendChild(connectionName)

    userDB.collection('userTest').doc(studentID).get().then(function(student) {
        connectionImageMessagingHeader.src = student.data().profileImage
        connectionName.innerHTML = student.data().name
    })
}

function showMessages(connectionID, studentID) {
    userDB.collection('messages').doc(connectionID).collection('messages').onSnapshot(function(messages) {
        while(messagesArea.firstChild) {
            messagesArea.removeChild(messagesArea.firstChild)
        }
        messages.forEach(function(message) {
            var messageData = message.data()
            var content = messageData.message
            var senderType = messageData.senderType

            var messageConnectionBlock = document.createElement('div')
            var messageBlock = document.createElement('div')
            
            messageBlock.innerHTML = content
    
            if (senderType == 'student') {
                messageConnectionBlock.setAttribute('class', 'message-connection-block')
                messageBlock.setAttribute('class', 'message-connection')
            } else {
                messageConnectionBlock.setAttribute('class', 'message-sender-block')
                messageBlock.setAttribute('class', 'message-sender')
            }

            messagesArea.appendChild(messageConnectionBlock)
            messageConnectionBlock.appendChild(messageBlock)
        })
    })
}

function sendConnectionMessage(connectionID, tutorID) {
    var today = new Date()
    var timeStamp = (today.getTime() / 1000).toString()
    var updateDict = {
        'message' : document.getElementById('message-field').value,
        'sender' : tutorID,
        'senderType' : 'tutor'
    }
    userDB.collection('messages').doc(connectionID).collection('messages').doc(timeStamp).set(updateDict)
    document.getElementById('message-field').value = ""
}

function replaceMessageFieldListener(connectionId, tutorID) {
    var oldMessageField = document.getElementById("message-field")
	var newMessageField = oldMessageField.cloneNode(true)
	oldMessageField.parentNode.replaceChild(newMessageField, oldMessageField)
	newMessageField.addEventListener("keydown", function (e) {
    		if (e.keyCode === 13) {
                sendConnectionMessage(connectionId, tutorID)
    		}
    	})
}
