

function loadProfileInformation(studentsId) {
    var studentsRef = dataRef.child(studentsId)
    var emailOnButton = document.getElementById("email-on-button")
    emailOnButton.setAttribute("onClick", "updateEmail('true','"+studentsId+"')")
  
    var emailOffButton = document.getElementById("email-on-button")
    emailOffButton.setAttribute("onClick", "updateEmail('false','"+studentsId+"')")
  
    var smsOnButton = document.getElementById("email-off-button")
    smsOnButton.setAttribute("onClick", "updateSms('true','"+studentsId+"')")

    var smsOffButton = document.getElementById("sms-off-button")
    smsOnButton.setAttribute("onClick", "updateSms('false','"+studentsId+"')")
    
    var studentsRef.on("value", function(snapshot) {
        var studentsName = snapshot.child("/name/").val()
        var studentsEmail = snapshot.child("/email/").val()
        var studentsImage = snapshot.child("/profileURL/").val()
        var emailNotifications = snapshot.child("/emailNotifications/").val()
        var smsNotifications = snapshot.child("/smsNotifications/").val()
        document.getElementById("profile-name").innerHTML = studentsName
        document.getElementById("profile-email-address").innerHTML = studentsEmail
        document.getElementById("profile-image-student").src = studentsImage
        
        if(emailNotifications) {
              emailOnButton.style.backgroundColor = "#ADDCCB"
              emailOnButton.style.color = "white"
        } else {
              emailOffButton.style.backgroundColor = "#EC7764"
              emailOffButton.style.color = "white"
        }
      
        if(smsNotifications) {
              smsOnButton.style.backgroundColor = "#ADDCCB"
              smsOnButton.style.color = "white"
              
        } else {
              smsOffButton.style.backgroundColor = "#EC7764"
              smsOffButton.style.color = "white"
        }      
    }
}

function updateEmail(value, ID) {
      console.log(ID)
      console.log(value)
      console.log(dataRef.child(ID+"/emailNotifications/").val())   
}
function updateSms(value, ID) {
      console.log(ID)
      console.log(value)
      console.log(dataRef.child(ID+"/smsNotifications/").val())   
}
                       
                   
