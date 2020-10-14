//Profile Elements
var hiddenPhotoUploadButton = document.getElementById('hidden-photo-upload-button')
var profileImageBlock = document.getElementById('profile-image-block')
var tutorsProfilePhoto = document.getElementById('tutors-profile-photo')
var tutorsName = document.getElementById('tutors-name')
var sessionsText = document.getElementById('sessions-text')
var averageText = document.getElementById('average-text')
var hourlyText = document.getElementById('hourly-text')
var tutorsBio = document.getElementById('tutors-bio')
var updateProfileBlock = document.getElementById('update-profile-block')
var updateProfile = document.getElementById('update-profile')


//Settings Elements
var priceText = document.getElementById('price-text')
var priceMinus = document.getElementById('price-minus')
var pricePlus = document.getElementById('price-plus')
var maxText = document.getElementById('max-text')
var maxMinus = document.getElementById('max-minus')
var maxPlus = document.getElementById('max-plus')
var emailToggle = document.getElementById('email-toggle')
var emailField = document.getElementById('email-field')
var smsToggle = document.getElementById('sms-toggle')
var smsField = document.getElementById('sms-field')
var currentBalance = document.getElementById('current-balance')
var transactionsButton = document.getElementById('transactions-button')

//Buttons for Modals
var depositButton = document.getElementById('deposit-button')
var withdrawButton = document.getElementById('withdraw-button')
var signOutButton = document.getElementById('sign-out-button')
var tosButton = document.getElementById('tos-button')
var contactUsButton = document.getElementById('contact-us-button')

//Modals
var financialsModal = document.getElementById('financials-modal')
var withdrawModal = document.getElementById('withdraw-modal')
var contactModal = document.getElementById('contact-modal')


//Profile functions_____________________________________________________________________________
profile.addEventListener('click', function(){
    loadProfile()
    loadSettings()
})

function loadProfile() {
		
    userDB.collection('userTest').doc(globalTutorID).get().then(async function(doc) {
        var tutorData = doc.data()
        var tutorsRating = await getRatingForUser(globalTutorID)
        var sessionsCount = await getCountOfSessions(globalTutorID)

        //create Photo element because setting src doesn't work :/
		profileImageBlock.removeChild(profileImageBlock.firstChild)
        var tutorsProfilePhoto = document.createElement('img') 
        tutorsProfilePhoto.setAttribute('class', 'upload-image')
        tutorsProfilePhoto.src = tutorData.profileImage
        tutorsProfilePhoto.addEventListener('click', openPhotoUploadDialog)

        profileImageBlock.appendChild(tutorsProfilePhoto)

        tutorsName.value = tutorData.name
        sessionsText.innerHTML = sessionsCount
        averageText.innerHTML = tutorsRating
        tutorsBio.value = tutorData.bio

        tutorsBio.onfocus = function() {
            updateProfileBlock.style.display = 'flex'
        }

        tutorsName.onfocus = function() {
            updateProfileBlock.style.display = 'flex'
        }

    })

    updateProfile.addEventListener('click', function() {
        var newName = tutorsName.value
        var newBio = tutorsBio.value

        userDB.collection("userTest").doc(globalTutorID)
        .update( {"name" : newName,
                  "bio" : newBio }).then( function(){
                    document.getElementById('saved-alert').style.display = 'flex'
                    $("#saved-alert").fadeOut(2000)
                  })
           
    updateProfileBlock.style.display = 'none'
    })
}

//Photo Upload
storageRef = storageService.ref()

function openPhotoUploadDialog() {
	hiddenPhotoUploadButton.click();
}

hiddenPhotoUploadButton.addEventListener('change', uploadProfileImage);

var selectedPhotoFile;
function uploadProfileImage(e) {
    selectedPhotoFile = e.target.files[0];
    handlePhotoUpload()
}

async function handlePhotoUpload() {
	const uploadTask = await storageRef.child(`images/${selectedPhotoFile.name}`).put(selectedPhotoFile);
	uploadAndUpdateFirebasePhoto()
}

//final submit button and update firebase
async function uploadAndUpdateFirebasePhoto() {
	var phototFileURL = ""
	await storageRef.child('/images/'+selectedPhotoFile.name)
		.getDownloadURL()
		.then(function(url) { phototFileURL = url.toString() })
	userDB.collection("userTest")
		.doc(globalTutorID)
        .update( {"profileImage" : phototFileURL })
        .then(function() {
            userDB.collection('userTest').doc(globalTutorID).get().then(async function(doc) {
                profileImageBlock.removeChild(profileImageBlock.firstChild)
                
                var tutorsProfilePhoto = document.createElement('img') 
                tutorsProfilePhoto.setAttribute('class', 'upload-image')
                tutorsProfilePhoto.src = doc.data().profileImage
                tutorsProfilePhoto.addEventListener('click', function() {
                    uploadProfileImage()
                })
                profileImageBlock.appendChild(tutorsProfilePhoto)
            })
        })
}


//Settings functions_______________________________________________________________________________________________________

var isEmailOn
var isSMSOn
var amount
var tutorsName


settings.addEventListener('click', function() {
    loadSettings()
})

function loadSettings() {
    userDB.collection('userTest').doc(globalTutorID).onSnapshot(function(doc) {
        var userInfo = doc.data()

        priceText.innerHTML = userInfo.pricePHH 
        maxText.innerHTML = userInfo.maxHPW
        emailField.placeholder = userInfo.email 
        smsField.placeholder = userInfo.phoneNumber
        hourlyText.innerHTML = '$' + parseFloat(userInfo.currentBalance).toFixed(2)
        
        isEmailOn = userInfo.isEmailOn
        isSMSOn = userInfo.isSMSOn
        amount = userInfo.currentBalance
        tutorsName = userInfo.name

        if (isEmailOn) {
            emailToggle.setAttribute('class', 'toggle-selected')
            emailField.style.display = 'block'
        } else {
            emailToggle.setAttribute('class', 'toggle')
            emailField.style.display = 'none'
        }

        if (isSMSOn) {
            smsToggle.setAttribute('class', 'toggle-selected')
            smsField.style.display = 'block'
        } else {
            smsToggle.setAttribute('class', 'toggle')
            smsField.style.display = 'none'
        }
    }) 
}

priceMinus.addEventListener('click', function() {
    //Get the Current Price Per Half Hour
    userDB.collection('userTest').doc(globalTutorID).get().then(function(doc) {
        var pricePHH = doc.data().pricePHH
        var newPricePHH = pricePHH - 1
        //Update
        userDB.collection('userTest').doc(globalTutorID).update({ 'pricePHH' : newPricePHH})
    })
})

pricePlus.addEventListener('click', function() {
    //Get the Current Price Per Half Hour
    userDB.collection('userTest').doc(globalTutorID).get().then(function(doc) {
        var pricePHH = doc.data().pricePHH
        var newPricePHH = pricePHH + 1
        //Update
        userDB.collection('userTest').doc(globalTutorID).update({ 'pricePHH' : newPricePHH})
    })
})

maxMinus.addEventListener('click', function() {
    //Get the Current Price Per Half Hour
    userDB.collection('userTest').doc(globalTutorID).get().then(function(doc) {
        var maxHPW = doc.data().maxHPW
        var newMaxHPW = maxHPW - 1
        //Update
        userDB.collection('userTest').doc(globalTutorID).update({ 'maxHPW' : newMaxHPW})
    })
})

maxPlus.addEventListener('click', function() {
    //Get the Current Price Per Half Hour
    userDB.collection('userTest').doc(globalTutorID).get().then(function(doc) {
        var maxHPW = doc.data().maxHPW
        var newMaxHPW = maxHPW + 1
        //Update
        userDB.collection('userTest').doc(globalTutorID).update({ 'maxHPW' : newMaxHPW})
    })
})

emailToggle.addEventListener('click', function() {
    userDB.collection('userTest').doc(globalTutorID).update({'isEmailOn' : !isEmailOn})
})

smsToggle.addEventListener('click', function() {
    userDB.collection('userTest').doc(globalTutorID).update({'isSMSOn' : !isSMSOn})
})

transactionsButton.addEventListener('click', function() {
    financialsModal.style.display = 'flex'
    
    var spendingArea = document.getElementById('spending-area')
    var incomeArea = document.getElementById('income-area')

    userDB.collection('userTest').doc(globalTutorID).collection('income').onSnapshot(function(income) {

        while(incomeArea.firstChild) {
            incomeArea.removeChild(incomeArea.firstChild)
        }

        income.forEach(function(doc) {
            var financialsData = doc.data()
            var start = financialsData.start
            var end = financialsData.end
            var amount = financialsData.checkoutTotal

            var financialsItemBlock = document.createElement('div')
            var financialsDate = document.createElement('div')
            var financialsAmount = document.createElement('div')

            financialsItemBlock.setAttribute('class', 'financials-item-block')
            financialsDate.setAttribute('class', 'financials-date')
            financialsAmount.setAttribute('class', 'financials-amount')

            incomeArea.appendChild(financialsItemBlock)
            financialsItemBlock.appendChild(financialsDate)
            financialsItemBlock.appendChild(financialsAmount)

            var dateObject = getFormattedDate(start)
            var timeObject = getFormattedTime(start, end)

            var dateString = dateObject[0] + ", " + dateObject[1] + " " + dateObject[2] + " from " + timeObject[0] + " to " + timeObject[1]

            financialsDate.innerHTML = dateString
            financialsAmount.innerHTML = '$' + amount
        })
    })

    userDB.collection('userTest').doc(globalTutorID).collection('spending').onSnapshot(function(spending) {

        while(spendingArea.firstChild) {
            spendingArea.removeChild(spendingArea.firstChild)
        }

        spending.forEach(function(doc) {
            var financialsData = doc.data()
            var start = financialsData.start
            var end = financialsData.end
            var amount = financialsData.checkoutTotal

            var financialsItemBlock = document.createElement('div')
            var financialsDate = document.createElement('div')
            var financialsAmount = document.createElement('div')

            financialsItemBlock.setAttribute('class', 'financials-item-block')
            financialsDate.setAttribute('class', 'financials-date')
            financialsAmount.setAttribute('class', 'financials-amount')

            spendingArea.appendChild(financialsItemBlock)
            financialsItemBlock.appendChild(financialsDate)
            financialsItemBlock.appendChild(financialsAmount)

            var dateObject = getFormattedDate(start)
            var timeObject = getFormattedTime(start, end)

            var dateString = dateObject[0] + ", " + dateObject[1] + " " + dateObject[2] + " from " + timeObject[0] + " to " + timeObject[1]

            financialsDate.innerHTML = dateString
            financialsAmount.innerHTML = '$' + amount
        })
    })
})


withdrawButton.addEventListener('click', function() {
    withdrawModal.style.display = 'block'

    var venmoWithdrawField = document.getElementById('venmo-withdraw-field'),
        venmoWithdrawButton = document.getElementById('venmo-withdraw-button'),
        emailWithdrawField = document.getElementById('email-withdraw-field'),
        emailWithdrawButton = document.getElementById('email-withdraw-button')

    venmoWithdrawButton.addEventListener('click', function() {
        if (venmoWithdrawField.value != '') {

            var withdrawalDict = {
                'amount' : amount,
                'name' : tutorsName,
                'tutor' : globalTutorID,
                'type' : 'venmo',
                'venmoUsername' : venmoWithdrawField.value
            }

            userDB.collection("Withdrawals").add( withdrawalDict ).then(function(doc) {
                var title = "New Withdrawal Request: " + doc.id
                var message = tutorsName + " has submitted a withdrawal request for $" + amount +". Their venmo username is:" + venmoWithdrawField.value + ", account ID is: " + globalTutorID
                sendEmailTo('support@tutortree.com', title, message)

                withdrawModal.style.display = 'none'
                alert('Thank you for your withdrawal request! Please allow up to 24 hours for review and issuance.')
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
        }
    })

    emailWithdrawButton.addEventListener('click', function() {
        if (emailWithdrawField.value != '') {

            var withdrawalDict = {
                'amount' : amount,
                'name' : tutorsName,
                'tutor' : globalTutorID,
                'type' : 'other',
                'venmoUsername' : emailWithdrawField.value
            }

            userDB.collection("Withdrawals").add( withdrawalDict ).then(function(doc) {
                var title = "New Withdrawal Request: " + doc.id
                var message = tutorsName + " has submitted a withdrawal request for $" + amount +". Their email is:" + emailWithdrawField.value + ", account ID is: " + globalTutorID
                sendEmailTo('support@tutortree.com', title, message)

                withdrawModal.style.display = 'none'
                alert('Thank you for your withdrawal request! Please allow up to 24 hours for review and issuance.')
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
        }
    })
})

contactUsButton.addEventListener('click', function() {
    contactModal.style.display = 'flex'

    var happyOption = document.getElementById('happy-option'),
        unhappyOption = document.getElementById('unhappy-option'),
        contactEmail = document.getElementById('contact-email'),
        contactMessage = document.getElementById('contact-message'),
        contactButton = document.getElementById('contact-button')

    var supportType,
        email,
        message

    happyOption.addEventListener('click', function() {
        happyOption.setAttribute('class', 'happy-selected')
        unhappyOption.setAttribute('class', 'unhappy-unselected')

        supportType = 'Happy Support Ticket'
    })

    unhappyOption.addEventListener('click', function() {
        happyOption.setAttribute('class', 'happy-unselected')
        unhappyOption.setAttribute('class', 'unhappy-selected')

        supportType = 'Opposite of Happy Support Ticket'
    })

    contactButton.addEventListener('click', function() {
        email = contactEmail.value
        message = contactMessage.value
        sendSupportEmail(supportType, message, email)
    })
})

function sendSupportEmail(supportType, messageValue, preferredEmail) {
    console.log(supportType)
    console.log(messageValue)
    console.log(preferredEmail)
    if(supportType != undefined) {
        if (preferredEmail != "") {
            if(messageValue != "") {

                var title = supportType
                var message = "Name: " + tutorsName + "Email: " + preferredEmail + " DatabaseID: " + " Message: " + messageValue
                sendEmailTo('support@tutortree.com', title, message)
                alert("Thanks for reaching out to us! We'll be in touch shortly")
                
                contactModal.style.display = 'none'

            } else {
                alert("Please enter how we can help you")
            }
        } else {
            alert("Please enter your preferred email")
        }
    } else {
        alert("Please select the type of support ticket")
    }
}
