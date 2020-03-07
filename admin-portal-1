var sessionsRef = database.ref("/updateDatabase/invoices/")
var customerRef = database.ref("updateDatabase/users/")

var uniqueAccounts = 0
var totalReturning = 0
var totalRevenue = 0
var allUsersDict = {}
sessionsRef.once("value", function(snapshot) {
    
		for (invoice in snapshot.val()) {
    		var usersName = snapshot.child(invoice + "/fromName/").val()
        if( usersName in allUsersDict) {
        			allUsersDict[usersName][0] += 1
              allUsersDict[usersName][1] = parseFloat(allUsersDict[usersName][1]) + parseFloat(snapshot.child(invoice + "/metadata/amount/").val())
              if(allUsersDict[usersName][2] > snapshot.child(invoice + "/metadata/numberDate/").val()) {
              		allUsersDict[usersName][2] = snapshot.child(invoice + "/metadata/numberDate/").val()   
              } else if(allUsersDict[usersName][3] < snapshot.child(invoice + "/metadata/numberDate/").val()) {
              		allUsersDict[usersName][3] = snapshot.child(invoice + "/metadata/numberDate/").val() 
              }
              
        } else {
    				var userArray = [
          			1,
        				parseFloat(snapshot.child(invoice + "/metadata/amount/").val()),
        				snapshot.child(invoice + "/metadata/numberDate/").val(),
        				snapshot.child(invoice + "/metadata/numberDate/").val()
            		]
            allUsersDict[usersName] = userArray
        }
    		
    }
		console.log(allUsersDict)
    
    //update number of unique users
    uniqueAccounts = Object.keys(allUsersDict).length
    document.getElementById("unique-users").innerHTML = uniqueAccounts
    
    buildTheBlock()
})	

    
async function buildTheBlock() {
    for (var key in allUsersDict) {
    		var userBlock = document.createElement("div")
        userBlock.setAttribute("class", "user-block")
        
        //Name and Image
        var userTitle = document.createElement("div")
        userTitle.setAttribute("class", "user-container")
        var userName = document.createElement("h4")
        userName.setAttribute("id",key)
        var userImage = document.createElement("img")
        userImage.setAttribute("id", key+"-image")
        userImage.setAttribute("class", "users-image")
        //get name and stuff
        var nameAndPhoto = await getNameAndPhotoFromKey(key);
       
        userTitle.appendChild(userName)
        userTitle.appendChild(userImage)
        userBlock.appendChild(userTitle)
        
        //Total Sessions
        var userTotalContainer = document.createElement("div")
        userTotalContainer.setAttribute("class", "user-container")
        var userTotalHeader = document.createElement("h4")
        userTotalHeader.setAttribute("class","total-sessions")
        userTotalHeader.innerHTML = "Total Sessions"
        var userTotalLabel = document.createElement("div")
        userTotalLabel.setAttribute("class", "total-sessions-block")
        userTotalLabel.innerHTML = allUsersDict[key][0]
        userTotalContainer.appendChild(userTotalHeader)
        userTotalContainer.appendChild(userTotalLabel)
        userBlock.appendChild(userTotalContainer)
        if(allUsersDict[key][0] > 2) {
        		totalReturning += 1
        }
        
        //First Session
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        var userFirstContainer = document.createElement("div")
        userFirstContainer.setAttribute("class", "user-container")
        var userFirstHeader = document.createElement("h4")
        userFirstHeader.setAttribute("class","first-session")
        userFirstHeader.innerHTML = "First Session"
        var userFirstLabel = document.createElement("div")
        userFirstLabel.setAttribute("class", "first-session-block")
        var firstSessionUTC = new Date(allUsersDict[key][2]*1000)
        userFirstLabel.innerHTML = firstSessionUTC.toLocaleDateString("en-US", options)
        userFirstContainer.appendChild(userFirstHeader)
        userFirstContainer.appendChild(userFirstLabel)
        userBlock.appendChild(userFirstContainer)
        
        //Latest Session
        var userLatestContainer = document.createElement("div")
        userLatestContainer.setAttribute("class", "user-container")
        var userLatestHeader = document.createElement("h4")
        userLatestHeader.setAttribute("class","latest-session")
        userLatestHeader.innerHTML = "Latest Session"
        var userLatestLabel = document.createElement("div")
        userLatestLabel.setAttribute("class", "latest-session-block")
        var latestSessionUTC = new Date(allUsersDict[key][3]*1000)
        userLatestLabel.innerHTML = latestSessionUTC.toLocaleDateString("en-us", options)
        userLatestContainer.appendChild(userLatestHeader)
        userLatestContainer.appendChild(userLatestLabel)
        userBlock.appendChild(userLatestContainer)
        
        //Total Spent To Date
        var userSpentContainer = document.createElement("div")
        userSpentContainer.setAttribute("class", "user-container")
        var userSpentHeader = document.createElement("h4")
        userSpentHeader.setAttribute("class","spent-to-date")
        userSpentHeader.innerHTML = "Spent To Date"
        var userSpentLabel = document.createElement("div")
        userSpentLabel.setAttribute("class", "total-spent")
        userSpentLabel.innerHTML = parseFloat(allUsersDict[key][1]).toFixed(2)
       	userSpentContainer.appendChild(userSpentHeader)
        userSpentContainer.appendChild(userSpentLabel)
        userBlock.appendChild(userSpentContainer)
        totalRevenue = parseFloat(totalRevenue)+parseFloat(allUsersDict[key][1])
        
        document.getElementById("all-user-info").appendChild(userBlock)
        
        document.getElementById("percent-returning").innerHTML = ((totalReturning/uniqueAccounts)*100).toFixed(2)
        document.getElementById("total-revenue").innerHTML = (totalRevenue).toFixed(2)
        document.getElementById("revenue-per-user").innerHTML = (totalRevenue/uniqueAccounts).toFixed(2)
        updateTotalandConverting()
       
    }
}

function getNameAndPhotoFromKey(key) {

    if (key.length == 28) {
        customerRef.child(key).once("value", function(snapshot) {
        	document.getElementById(key).innerHTML = snapshot.child("/name/").val()

        	document.getElementById(key+"-image").src = photoURL = snapshot.child("/profileURL/").val()
       	})
    } else {
          customerRef.child("/XwbsnUHFYOZabc8IwGybfELFqKC2/").once("value", function(snapshot) {
          document.getElementById(key).innerHTML = key
          document.getElementById(key+"-image").src = snapshot.child("/profileURL/").val()
          })
    }
}

function updateTotalandConverting() {
		//update total accounts
    customerRef.once("value", function(snapshot) {
    		var numberOfAccounts = Object.keys(snapshot.val()).length
        totalAccounts = numberOfAccounts
        document.getElementById("total-accounts").innerHTML = numberOfAccounts
        document.getElementById("percent-converting").innerHTML = ((uniqueAccounts/numberOfAccounts)*100).toFixed(2)
    })
		
}









var idField = document.getElementById("id-field")

//var titleValue = document.getElementById("title-field").value
//var messageValue = document.getElementById("message-field").value

var titleValue = "Important Tutortree Updates"
var messageValue = "The Tutortree Web dashboard is now live with new features for tutors. Check your email for more information." 

var sendPushButton = document.getElementById("send-push-notification")


sendPushButton.setAttribute("onclick", "sendSMS('"+titleValue+"','"+messageValue+"')")

function sendSMS(titleValue, messageValue) {
		var idValue = document.getElementById("id-field").value
		console.log(idValue)
		var userRef = database.ref("updateDatabase/users/")
    userRef.once("value", function(snapshot) {
    		console.log(idValue)
    		var usersToken = snapshot.child(idValue+"/token/").val()
        console.log(usersToken)
        sendPushTo(usersToken, titleValue, messageValue)
    
    })

}


function sendPushTo(token, title, message) {
		var xhttp = new XMLHttpRequest();
    var herokuURL = "https://tutortree-development.herokuapp.com/sendNotification/"+title+"/"+message+"/"+token+"/1"
    xhttp.open("GET", herokuURL, true);
		xhttp.send();
}
