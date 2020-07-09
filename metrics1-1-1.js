var metricsRef = database.ref("updateDatabase/invoices/")

metricsRef.once("value", function(snapshot) {
		var sessionsBookedToday = 0
    var sessionsSinceYesterday = 0
    var sessionsSinceLastWeek = 0
    var totalSessions = 0
    
    var todayDate = new Date()
    var todayMidnight = todayDate.setHours(0,0,0,0)/1000
    var yesterdayMidnight = todayMidnight - 86400
    var lastWeekMidnight = todayMidnight - 604800
    
    console.log(todayMidnight)
    
    var sessionsTextField = document.getElementById("sessionsToday")

    for(session in snapshot.val()) {
    		var isWebTransaction = snapshot.child(session+"/metadata/type").val()
        
        if (isWebTransaction != "Web") {
        		var sessionTime = snapshot.child(session+"/metadata/numberDate/").val()
        		if (sessionTime > todayMidnight) {
        				console.log(snapshot.child(session).val())
        				sessionsBookedToday += 1
        		} else if (sessionTime > yesterdayMidnight) {
        				sessionsSinceYesterday += 1
        		} else if (sessionTime > lastWeekMidnight) {
        				sessionsSinceLastWeek += 1
        		}
        }
      	totalSessions++
    }
    var todayButton = document.getElementById("sessions-today")
    var yesterdayButton = document.getElementById("sessions-yesterday")
    var lastWeekButton = document.getElementById("sessions-week")
    var totalButton = document.getElementById("sessions-total")
    
    todayButton.onclick = function(){
    		sessionsTextField.innerHTML = sessionsBookedToday
        setButtonState(0)
    }
    yesterdayButton.onclick = function(){
    		sessionsTextField.innerHTML = sessionsSinceYesterday
        setButtonState(1)
    }
    lastWeekButton.onclick = function(){
    		sessionsTextField.innerHTML = sessionsSinceLastWeek
        setButtonState(2)
    }
    totalButton.onclick = function(){
    		sessionsTextField.innerHTML = totalSessions
        setButtonState(3)
    }
})

function setButtonState(index) {
		var todayButton = document.getElementById("sessions-today")
    var yesterdayButton = document.getElementById("sessions-yesterday")
    var lastWeekButton = document.getElementById("sessions-week")
    var totalButton = document.getElementById("sessions-total")
    
    var buttonArray = [todayButton, yesterdayButton, lastWeekButton, totalButton]
    
    for (i=0; i<4; i++) {
    		if (i == index) {
        		buttonArray[index].style.backgroundColor = "#addccb"
            buttonArray[index].style.color = "#FFFFFF"
        }
        else {
        		buttonArray[i].style.backgroundColor = "#f8f8f4"
            buttonArray[i].style.color = "#333"
        }
    }		
}

