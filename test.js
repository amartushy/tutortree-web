function testFunc() {
    console.log("I tested a function")
}

function loadUpcomingSessions() {
    dataRef.once("value", function(snapshot) {
        var currentTime = Math.round((new Date()).getTime() / 1000);
      var hasUpcoming = false
      var upcomingSection = document.getElementById('upcoming-section')
    
      for (sessionId in snapshot.child(userId+"/sessions").val()) {
                if(snapshot.child(userId+"/sessions/"+sessionId+"/start").val() > currentTime){
            hasUpcoming = true
          var upcomingBlock = document.createElement("div");
          var upcomingStudent = document.createElement("h2")
          var upcomingCourse = document.createElement("button")
          var upcomingDate = document.createElement("h3")
          var studentId = snapshot.child(userId+"/sessions/"+sessionId+'/other').val()
          var startTime = snapshot.child(userId+'/sessions/'+sessionId+'/start').val()
          console.log(startTime)
          var endTime = snapshot.child(userId+'/sessions/'+sessionId+'/end').val()
          upcomingCourse.setAttribute('class', 'course-button w-button')
          upcomingBlock.setAttribute('class', 'upcoming-block')
          upcomingStudent.setAttribute('class', 'upcoming-header')
          upcomingDate.setAttribute('class', 'upcoming-date')
          
          upcomingStudent.innerHTML = snapshot.child(studentId+'/name/').val()
          upcomingCourse.innerHTML = snapshot.child(userId+'/sessions/'+sessionId+'/course').val()
          upcomingDate.innerHTML = startTime + endTime
          upcomingBlock.appendChild(upcomingStudent)
          upcomingBlock.appendChild(upcomingCourse)
          upcomingBlock.appendChild(upcomingDate)
          upcomingSection.appendChild(upcomingBlock)
         
        }
      }
      if (hasUpcoming == false) {
            upcomingSection.innerHTML = "No upcoming sessions"
        }
    })

}
