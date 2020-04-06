var dataRef = database.ref("updateDatabase/users/")
    
function getTutorsInfo(ID) {
   var infoArray = []
   dataRef.once("value", async function(snapshot) {
      var tutorsName = await snapshot.child(ID+"/name/").val()
      infoArray.push(tutorsName)
      var tutorsImage = awaitsnapshot.child(ID+"/profileURL/").val()
      infoArray.push(tutorsImage)

   })
   return(infoArray)              
}

//Associated sort upcoming functions
function sortNumberStudent(a,b) {
	return(a-b)
}

var upcomingArrayStudent = []
function updateUpcomingArrayStudent(timestamp) {
		upcomingArrayStudent.push(timestamp)
    upcomingArrayStudent.sort(sortNumberStudent)
}
var pendingArrayStudent = []
function updatependingArrayStudent(timeStamp) {
	pendingArrayStudent.push(timeStamp)
	pendingArrayStudent.sort(sortNumberStudent)
}

function appendToUpcomingStudent() {
    var items = upcomingArrayStudent.length
    var upcomingSectionStudent = document.getElementById('upcoming-section-student')
    
    for( i=0 ; i < items ; i++ ) {
    	var timestampID = upcomingArrayStudent[i]
    	var upcomingBlockStudent = document.getElementById(timestampID)
        upcomingSectionStudent.appendChild(upcomingBlockStudent)
    }
}
function appendToPendingStudent() {
    var items = pendingArrayStudent.length
    var pendingSectionStudent = document.getElementById('pending-section-student')
    
    for( i=0 ; i < items ; i++ ) {
    	var timestampID = pendingArrayStudent[i]
    	var upcomingBlockStudent = document.getElementById(timestampID)
        pendingSectionStudent.appendChild(upcomingBlockStudent)
    }
}

//Main load function
function loadStudentsUpcomingAndPending(userId) {
    var sessionsRef = dataRef.child(userId+"/sessions/")
    var upcomingSectionStudent = document.getElementById('upcoming-section-student')
    var pendingSectionStudent = document.getElementById('pending-section-student')
    
    sessionsRef.on("value", function(snapshot) {
    //remove all elements
    while(upcomingSectionStudent.firstChild) {
          upcomingSectionStudent.removeChild(upcomingSectionStudent.firstChild)
    }
    while(pendingSectionStudent.firstChild) {
          pendingSectionStudent.removeChild(pendingSectionStudent.firstChild)
    }	   
    //var currentTime = Math.round((new Date()).getTime() / 1000);
    var todaysEpoch = new Date()
    var currentTime = todaysEpoch.setHours(0,0,0,0)/1000
    var hasUpcoming = false
    var hasPending = false

    
    for (sessionId in snapshot.val()) {
	  
    	if(snapshot.child(sessionId+"/start/").val() > currentTime){
	console.log(sessionId)
      	hasUpcoming = true
        //session info
        var startTimeEpoch = snapshot.child(sessionId+'/start').val()
        var endTimeEpoch = snapshot.child(sessionId+'/end').val()
        var isPending = snapshot.child(sessionId+'/status/').val()
        
        //tutor info
        var tutorId = snapshot.child(sessionId+'/other/').val()
        var tutorInfoArray = getTutorsInfo(tutorId)
        var tutortreeLogo = "https://firebasestorage.googleapis.com/v0/b/tutor-faa48.appspot.com/o/images%2Fzqrvuzfvgdkxnpew.jpg?alt=media&token=e898937e-8cdc-4180-8a6a-6e5aeb3ed676"
        
        var upcomingBlockStudent = document.createElement("div")
        upcomingBlockStudent.setAttribute("class", "upcoming-block-student")
        upcomingBlockStudent.setAttribute('id', startTimeEpoch)  
          
        //Create session info block
	      var tutorContainer = document.createElement("div")
        tutorContainer.setAttribute("class", "tutor-container")
        upcomingBlockStudent.appendChild(tutorContainer)
          
	      var tutorsImage = document.createElement("img")
        tutorsImage.setAttribute("class", "tutors-image")
        tutorContainer.appendChild(tutorsImage)
        if (tutorInfoArray[1] > 100) {
		        tutorsImage.src =  tutorInfoArray[1]
	      } else {	
		        tutorsImage.src = tutortreeLogo
	      }
          
	      var headerAndDateTutor = document.createElement("div")
        headerAndDateTutor.setAttribute("class", "header-and-date-tutor")
        tutorContainer.appendChild(headerAndDateTutor)
          
        var upcomingHeaderTutor = document.createElement("h3")
        upcomingHeaderTutor.setAttribute("class", "upcoming-header-tutor")
        headerAndDateTutor.appendChild(upcomingHeaderTutor)
        upcomingHeaderTutor.innerHTML = tutorInfoArray[0]
          
        var dateAndTimeStudent = document.createElement("h4")
        dateAndTimeStudent.setAttribute("class", "date-and-time-student")
        headerAndDateTutor.appendChild(dateAndTimeStudent)
        //TIME FORMATTING
        var startTime = new Date(startTimeEpoch*1000)
        var endTime = new Date(endTimeEpoch*1000)
        var startDayandHour = startTime.toLocaleDateString("en-US", {weekday:'long',
        		hour: 'numeric', minute:'numeric'})
	      var getEndMinutes = endTime.getMinutes()
	      var endMinutes = "00"
	      if (getEndMinutes > 0) {
		        endMinutes = getEndMinutes
	      }
        var endHour = ((endTime.getHours() + 24) % 12 || 12) +":"+ endMinutes  
        dateAndTimeStudent.innerHTML = startDayandHour + " until " + endHour
        
        var pendingAndCourseStudent = document.createElement("div")
        pendingAndCourseStudent.setAttribute("class", "pending-and-course-student")
        headerAndDateTutor.appendChild(pendingAndCourseStudent)
          
        var courseLabelStudent = document.createElement("div") 
        courseLabelStudent.setAttribute("class", "course-label-student")
        pendingAndCourseStudent.appendChild(courseLabelStudent)
        courseLabelStudent.innerHTML = snapshot.child(sessionId+"/course/").val()  
          
        var pendingLabelStudent = document.createElement("div")
        pendingLabelStudent.setAttribute("class", "pending-label-student")
        pendingAndCourseStudent.appendChild(pendingLabelStudent)
        pendingLabelStudent.innerHTML = "PENDING"
          
        var confirmedLabelStudent = document.createElement("div")
        confirmedLabelStudent.setAttribute("class", "confirmed-label-student")
        pendingAndCourseStudent.appendChild(confirmedLabelStudent)
        confirmedLabelStudent.innerHTML = "CONFIRMED"  
          
        //Create Zoom Block
        var zoomContainerStudent = document.createElement("div")
        zoomContainerStudent.setAttribute("class", "zoom-container-student")
        upcomingBlockStudent.appendChild(zoomContainerStudent)
          
        var logoAndJoinStudent = document.createElement("div")
        logoAndJoinStudent.setAttribute("class", "logo-and-join-student")
        zoomContainerStudent.appendChild(logoAndJoinStudent)
          
        var zoomLogoStudent = document.createElement("img")
        zoomLogoStudent.setAttribute("class", "zoom-logo-student")
        logoAndJoinStudent.appendChild(zoomLogoStudent)
        zoomLogoStudent.src = "https://firebasestorage.googleapis.com/v0/b/tutor-faa48.appspot.com/o/images%2Ffhfhhvdmovdlmico.jpg?alt=media&token=9d500de0-5016-4d0c-ae59-e69c926ae7db"
          
        var joinSessionStudent = document.createElement("div")
        joinSessionStudent.setAttribute("class", "join-session-student")
        logoAndJoinStudent.appendChild(joinSessionStudent)
        joinSessionStudent.innerHTML = "Join Session"
          
        var zoomIdBlockStudent = document.createElement("div")
        zoomIdBlockStudent.setAttribute("class", "zoom-id-block-student")
        zoomContainerStudent.appendChild(zoomIdBlockStudent)
        
        var meetingIdBlockStudent = document.createElement("div")
        meetingIdBlockStudent.setAttribute("class", "meeting-id-block-student")
        zoomIdBlockStudent.appendChild(meetingIdBlockStudent)
          
        var meetingIdHeaderStudent = document.createElement("h5")
        meetingIdHeaderStudent.setAttribute("class", "meeting-id-header-student")
        meetingIdBlockStudent.appendChild(meetingIdHeaderStudent)
        meetingIdHeaderStudent.innerHTML = "Meeting ID:"
          
        var meetingIdStudent = document.createElement("div")
        meetingIdStudent.setAttribute("class", "meeting-id-student")
        meetingIdBlockStudent.appendChild(meetingIdStudent)
        var meetingId = snapshot.child("/onlineSession/meetingId/").val()
        if ( meetingId == null ) {
            meetingIdStudent.innerHTML = "Not updated yet"
        } else {
            meetingIdStudent.innerHTML = meetingId
        }
          
        var passwordIdBlockStudent = document.createElement("div")
        passwordIdBlockStudent.setAttribute("class", "password-id-block-student")
        zoomIdBlockStudent.appendChild(passwordIdBlockStudent)
          
        var meetingPasswordHeaderStudent = document.createElement("h5")
        meetingPasswordHeaderStudent.setAttribute("class", "meeting-password-header-student")
        passwordIdBlockStudent.appendChild(meetingPasswordHeaderStudent)
        meetingPasswordHeaderStudent.innerHTML = "Meeting Password:"
          
        var meetingPasswordIdStudent = document.createElement("div")
        meetingPasswordIdStudent.setAttribute("class", "meeting-password-id-student")
        passwordIdBlockStudent.appendChild(meetingPasswordIdStudent)
        var meetingPasswordId = snapshot.child("/onlineSession/passwordId/").val()
        if ( meetingPasswordId == null ) {
            meetingPasswordIdStudent.innerHTML = "Not updated yet"
        } else {
            meetingPasswordIdStudent.innerHTML = meetingPasswordId
        }  
        
          
        //Logic to append
        if (isPending == 1) {
            upcomingSectionStudent.appendChild(upcomingBlockStudent)
            upcomingArrayStudent.push(startTimeEpoch)
              
        } else {
            pendingSectionStudent.appendChild(upcomingBlockStudent)
	    pendingArrayStudent.push(startTimeEpoch)
        }
          
        
        }
    }
    appendToUpcomingStudent()
    appendToPendingStudent()
})

}		   
