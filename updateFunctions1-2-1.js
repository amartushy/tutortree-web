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
//WITHDRAW PARTIAL BALANCE FUNCTION
function venmoWithdrawal(userId, balance) {
		var amountToWithdraw = document.getElementById('amount-to-withdraw')
  	var venmoUsername = document.getElementById('venmo-username')
    var spendingId = create8CharID()
    var currentTime = Date.now()/1000
    var pending = 0
    var withdrawDict = {
    		'amount' : amountToWithdraw.value,
        'numberDate' : currentTime,
        'status' : pending,
        'type' : 'Withdrawal',
        'uid' : userId,
        'venmo' : venmoUsername.value
    		}
    var spendingDict = { }
    spendingDict[spendingId] = withdrawDict
    var spendingRef = dataRef.child('/'+userId+'/spending/')
  	var withdrawRef = database.ref('updateDatabase/withdrawals/')
    
    if((parseFloat(withdrawDict['amount']) > 0) && (parseFloat(withdrawDict['amount']) < balance) ) {
    		amountToWithdraw.value = ''
    		venmoUsername.value = ''
        console.log(spendingId)
        spendingRef.update(spendingDict)
        withdrawRef.update(spendingDict)
        alert("Thank you for your withdrawal! Please allow 24 hours for processing.")
    } else {
    		alert("Sorry, there was an error. There are either insufficent funds or the amount type is invalid.")
    }
    
    console.log(withdrawDict)
}
//HELPER FUNCITON TO CREATE SPENDING ID
function create8CharID() {
		var result =''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var charactersLength = characters.length
    
    for (i = 0; i < 8; i++) {
    		result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

