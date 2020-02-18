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
        
    		messagingBlock.setAttribute('class', 'messages-block')
    		messagingImage.setAttribute('class', 'messages-image')
    		messagingContainer.setAttribute('class', 'messages-container')
        headerAndBubbleContainer.setAttribute('class', 'header-and-bubble')
    		messagingHeader.setAttribute('class', 'messages-header')
        unreadBubble.setAttribute('class', 'unread-bubble')
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
    		messagingContainer.appendChild(headerAndBubbleContainer)
        headerAndBubbleContainer.appendChild(messagingHeader)
        headerAndBubbleContainer.appendChile(unreadBubble)
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
