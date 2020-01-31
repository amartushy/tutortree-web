//Onclick to update course registrations
function userDidRegisterForCourse(tutorsUniversity, subject, course, userId) {
    var currentButton = document.getElementById(subject+'-'+course)
    var registered = currentButton.getAttribute('registered')
    var tutorsCourseRef = dataRef.child('/'+userId+'/courses/')
    var schoolTutorsRef = dataRef.parent.child('/'+tutorsUniversity+'/'+
                                            '/'+subject+'/'+course+'/tutors/')
    var keyString = subject+':'+course

    if(registered === "true"){
        currentButton.setAttribute('registered', false)
        currentButton.style.backgroundColor = '#ADDCCB'
        tutorsCourseRef.child(subject+":"+course).remove()
        schoolTutorsRef.child(userId).remove()
    
    } else if(registered === "false") {
        currentButton.setAttribute('registered', true)
        currentButton.style.backgroundColor = '#295A53'
        var addCourseDict = {}
        var addTutorDict = {}
        addCourseDict[subject+":"+course] = keyString
        addTutorDict[userId] = userId
        tutorsCourseRef.update(addCourseDict)
    
        schoolTutorsRef.once('value', function(snapshot) {
            var schoolAndSubject = snapshot.val()
            console.log(schoolAndSubject)
            if (schoolAndSubject === null) {
                schoolTutorsRef.update(addTutorDict)
            } else {
                schoolTutorsRef.update(addTutorDict)
            }
        })
    
    } else {
        console.log("ERROR: no registration value")
    }
}

//Update database with new basic profile information
function userDidUpdateProfile(userId) {
    var newName = tutorsNameField.value
    var newMaxHours = tutorsMaxHoursField.value
    var newRate = Math.round(tutorsRateField.value)
    var newBio = tutorsBioField.value
    
    console.log("tutors new name: " + newName)
    console.log("tutors new hours: " + newMaxHours)
    console.log("tutors new rate: " + newRate)
    console.log("tutors new bio: " + newBio)
    var tutorsRef = dataRef.child(userId).update(
    		{'name':newName,
        'MAX':newMaxHours,
        'PPH':newRate,
        'bio':newBio,
        })
}

//Update Email and SMS notifications
$(document).ready(function()
{
  $('#email-checkbox').change(function() 
  {
    if(this.checked == true)
    {
    	console.log("email notifications are on")
    } else {
    	console.log("email notifications off")
    }
  })
})
$(document).ready(function()
{
  $('#sms-checkbox').change(function() 
  {
    if(this.checked == true)
    {
    	console.log("sms notifications are on")
    } else {
    	console.log("sms notifications off")
    }
	})
})