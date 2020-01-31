tutorsNameField = document.getElementById("tutors-name")
tutorsEmailField = document.getElementById("tutors-email")
tutorsPhotoField = document.getElementById("tutors-photo")
tutorsPhotoUrlField = document.getElementById("tutors-photo-url")
emailCheckBox = document.getElementById("email-checkbox")
smsCheckBox = document.getElementById("sms-checkbox")
tutorsBioField = document.getElementById("tutors-bio")
tutorsRateField = document.getElementById("tutors-rate")
tutorsMaxHoursField = document.getElementById("tutors-max-hours")
tutorsBalanceField = document.getElementById("tutors-balance")
upcomingSessions = document.getElementById("upcomingdiv")

var dataRef = database.ref("updateDatabase/users/")
var schoolref = dataRef.parent

function testFunc() {
    console.log("I tested a function")
}

function loadAvailableCourses(userId) {
    //LOAD UNIVERSITIES AVAILABLE COURSES
    courseLayoutArea = document.getElementById("course-layout-area")
    schoolref.once("value", function(snapshot) {
    console.log(snapshot.val())
    	//set which university
        var tutorsEmail = snapshot.child("users/" + userId + "/email").val()
        var tutorsUniversity = ""
        var universityDict = {
      	    uoregon : "uoregon.edu",
            ucla : "ucla.edu",
            oregonstate : "oregonstate.edu",
            usc : "usc.edu",
            berkeley : "berkeley.edu"
        }
        for (school in universityDict) {
      		if (tutorsEmail.includes(universityDict[school])) {
                tutorsUniversity = school
                console.log("current users university: " + tutorsUniversity)
			}}
      
        //create new blocks for each course
        for(subject in snapshot.child(tutorsUniversity).val()) {
      		var subjectBlock = document.createElement('div')
            var subjectHeader = document.createElement("h2")
            subjectBlock.setAttribute('class', 'course-container')
            subjectBlock.setAttribute('id', subject)
            subjectHeader.setAttribute('class', 'subject-heading')
            subjectHeader.innerText = subject
            courseLayoutArea.appendChild(subjectBlock)
            subjectBlock.appendChild(subjectHeader)
          
            for(course in snapshot.child(tutorsUniversity+"/"+subject).val()) {
          		var subjectBlock = document.getElementById(subject)
                var courseButton = document.createElement('button')
                courseButton.setAttribute('id', subject+'-'+course)
                courseButton.setAttribute('onClick', 'userDidRegisterForCourse("'+tutorsUniversity+'","'+subject+'","'+course+'","'+userId+'")')
                courseButton.setAttribute('class', 'course-button w-button')
                courseButton.innerHTML = course
              
                var tutorCount = 0
                courseButton.setAttribute('registered',false)
                for(tutor in snapshot.child(tutorsUniversity+"/"+subject+"/"+course+"/tutors").val()) {
              		if(userId == tutor){
                  		courseButton.setAttribute('registered', true)
                    	courseButton.style.backgroundColor = "#295A53"
                    }
              		tutorCount++
                }

                var tutorLabel = document.createElement('p')
                tutorLabel.innerText =tutorCount + " tutors"
                tutorLabel.setAttribute('class', 'tutor-label')
                courseButton.appendChild(tutorLabel)
                subjectBlock.appendChild(courseButton)
                tutorCount = 0
          }
   
      }
    })

}