//NOTIFICATIONS PUSH FUNCTIONS
function sendSMSTo(number, message) {
		var xhttp = new XMLHttpRequest();
    var herokuURL = "https://tutortree2.herokuapp.com/sendSMSTo/+1"+number+"/"+message
		xhttp.open("GET", herokuURL, true);
		xhttp.send();
}
function sendPushTo(token, title, message) {
		var xhttp = new XMLHttpRequest();
    var herokuURL = "https://tutortree2.herokuapp.com/sendNotification/"+title+"/"+message+"/"+token+"/1"
    xhttp.open("GET", herokuURL, true);
		xhttp.send();
}
function sendEmailTo(email, title, message) {
		var xhttp = new XMLHttpRequest();
    var herokuURL = "https://tutortree2.herokuapp.com/sendEmailTo/"+email+"/"+title+"/"+message
    console.log(herokuURL)
		xhttp.open("GET", herokuURL, true);
		xhttp.send();
}
