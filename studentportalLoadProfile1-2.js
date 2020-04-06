

function loadProfileInformation(studentsId) {
    var studentsRef = dataRef.child(studentsId)
    var emailOnButton = document.getElementById("email-on-button")
    emailOnButton.setAttribute("onClick", "updateEmail(true,'"+studentsId+"')")
  
    var emailOffButton = document.getElementById("email-off-button")
    emailOffButton.setAttribute("onClick", "updateEmail(false,'"+studentsId+"')")
  
    var smsOnButton = document.getElementById("sms-on-button")
    smsOnButton.setAttribute("onClick", "updateSms(true,'"+studentsId+"')")

    var smsOffButton = document.getElementById("sms-off-button")
    smsOffButton.setAttribute("onClick", "updateSms(false,'"+studentsId+"')")
    
    studentsRef.on("value", function(snapshot) {
        var studentsName = snapshot.child("/name/").val()
        var studentsEmail = snapshot.child("/email/").val()
        var studentsImageArea = document.getElementById("profile-image-area")
        while(studentsImageArea.firstChild) {
                studentsImageArea.removeChild(studentsImageArea.firstChild)
        }
        var studentsImage = document.createElement("img")
        studentsImage.setAttribute("class", "profile-image-student")
        studentsImageArea.appendChild(studentsImage)
        studentsImage.src = snapshot.child("/profileURL/").val()
        
        var emailNotifications = snapshot.child("/emailNotifications/").val()
        var smsNotifications = snapshot.child("/smsNotifications/").val()
        document.getElementById("profile-name").placeholder = studentsName
        document.getElementById("profile-email-address").placeholder = studentsEmail

        
        if(emailNotifications) {
              emailOnButton.style.backgroundColor = "#ADDCCB"
              emailOnButton.style.color = "white"
            
              emailOffButton.style.backgroundColor = "transparent"
              emailOffButton.style.color = "#EC7764"
              emailOffButton.style.borderColor = "#EC7764"
        } else {
              emailOffButton.style.backgroundColor = "#EC7764"
              emailOffButton.style.color = "white"
            
              emailOnButton.style.backgroundColor = "transparent"
              emailOnButton.style.color = "#ADDCCB"
              emailOnButton.style.borderColor = "#ADDCCB"
        }
      
        if(smsNotifications) {
              smsOnButton.style.backgroundColor = "#ADDCCB"
              smsOnButton.style.color = "white"
            
              smsOffButton.style.backgroundColor = "transparent"
              smsOffButton.style.color = "#EC7764"
              smsOffButton.style.borderColor = "#EC7764"
              
        } else {
              smsOffButton.style.backgroundColor = "#EC7764"
              smsOffButton.style.color = "white"
            
              smsOnButton.style.backgroundColor = "transparent"
              smsOnButton.style.color = "#ADDCCB"
              smsOnButton.style.borderColor = "#ADDCCB"
        }      
    })
}

function updateEmail(value, ID) {
      var updateDict = {}
      updateDict['emailNotifications'] = value
      dataRef.child(ID).update(updateDict)
}
function updateSms(value, ID) {
      var updateDict = {}
      updateDict['smsNotifications'] = value
      dataRef.child(ID).update(updateDict)  
}
                       
                   
