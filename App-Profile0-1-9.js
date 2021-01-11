//Global Variables__________________________________________________________________
var userDB = firebase.firestore()

//Core properties all users have
var globalUserId,
    coreBio,
    coreBalance,
    coreEmail,
    coreIsEmailOn,
    coreIsSMSOn,
    coreIsTutor,
    coreMaxHours,
    coreName,
    corePhone,
    coreProfileImage,
    corePricePHH,
    coreSchool,
    coreSubject

//Initialize elements on page load
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		var ID = user.uid
		 
        loadCoreProperties(ID)
		
	//If user is not logged in return them to login screen
	} else {
		location.href = "https://parent-tutortree.webflow.io/login"
	}
})

function loadCoreProperties(ID) {
    globalUserId = ID
	console.log(globalUserId)
    userDB.collection('userTest').doc(globalUserId).onSnapshot(function(doc) {
        var data = doc.data()

        coreBio = data.bio
	coreBalance = data.currentBalance
        coreEmail = data.email
        coreIsEmailOn = data.isEmailOn 
        coreIsSMSOn = data.isSMSOn
        coreIsTutor = data.isTutor
        coreName = data.name 
        corePhone = data.phoneNumber 
        coreProfileImage = data.profileImage 
        coreSchool = data.school 
        coreSubject = data.major 
	
        loadHeader()
        loadProfile()
	    loadNotifications()
	    loadFinancials()
	    
        if (coreIsTutor) {
	    coreMaxHours = data.maxHPW
	    corePricePHH = data.pricePHH
            loadTutorProfile()
        }
    })
}


function loadHeader() {

    var profileTab = document.getElementById('profile')

    while( profileTab.firstChild) {
        profileTab.removeChild(profileTab.lastChild)
    }

    var usersPhoto = document.createElement('img')
    usersPhoto.setAttribute('class', 'header-image')
    usersPhoto.src = coreProfileImage
    profileTab.appendChild(usersPhoto)

    var profileText = document.createElement('div')
    profileText.setAttribute('class', 'header-text')
    profileText.innerHTML = 'Profile'
    profileTab.appendChild(profileText)
}


async function loadProfile() {

    var usersImageBlock = document.getElementById('users-image-block')
    var usersName = document.getElementById('users-name')
    var usersSchool = document.getElementById('users-school')
    var usersMajor = document.getElementById('users-major')
    var usersBio = document.getElementById('users-bio')
    
    while ( usersImageBlock.firstChild ) {
        usersImageBlock.removeChild(usersImageBlock.firstChild)
    }

    var usersProfileImage = document.createElement('img')
    usersProfileImage.setAttribute('class', 'user-profile-image')
    usersProfileImage.src = coreProfileImage
    usersImageBlock.appendChild(usersProfileImage)

    var cameraIcon = document.createElement('div')
    cameraIcon.setAttribute('class', 'users-photo-icon')
    cameraIcon.innerHTML = ''
    usersImageBlock.appendChild(cameraIcon)

    usersName.innerHTML = coreName
    usersBio.innerHTML = coreBio
    usersSchool.innerHTML = await getSchoolName(coreSchool)
    usersMajor.innerHTML = coreSubject
    
}

async function loadTutorProfile() {
    var usersSessions = document.getElementById('users-sessions')
    var usersAverage = document.getElementById('users-average')

    usersSessions.innerHTML = await getCountOfSessions(globalUserId)
    usersAverage.innerHTML = await getRatingForUser(globalUserId)
}

function loadNotifications() {
    const usersEmail = document.getElementById('email-field')
    const usersPhone = document.getElementById('sms-field')
    const emailToggle = document.getElementById('email-toggle')
    const smsToggle = document.getElementById('sms-toggle')
    const smsConfirmation = document.getElementById('sms-confirmation')

    usersEmail.placeholder = coreEmail 
    usersPhone.placeholder = corePhone 

    if (coreIsEmailOn) {
        usersEmail.style.display = 'block'
        emailToggle.setAttribute('class', 'toggle-selected')
    } else {
        usersEmail.style.display = 'none'
        emailToggle.setAttribute('class', 'toggle')
    }

    if (coreIsSMSOn) {
        usersPhone.style.display = 'block'
        smsToggle.setAttribute('class', 'toggle-selected')
    } else {
        usersPhone.style.display = 'none'
        smsToggle.setAttribute('class', 'toggle')
    }

    emailToggle.addEventListener('click', () => {
        userDB.collection('userTest').doc(globalUserId).get().then(function(doc) {
            const isEmailOn = doc.data().isEmailOn 
            userDB.collection('userTest').doc(globalUserId).update({"isEmailOn" : !isEmailOn})
        })
    })

    smsToggle.addEventListener('click', () => {
        userDB.collection('userTest').doc(globalUserId).get().then(function(doc) {
            const isSMSOn = doc.data().isSMSOn 
            userDB.collection('userTest').doc(globalUserId).update({"isSMSOn" : !isSMSOn})
        })
    })

    usersPhone.onblur = function() {
        const newNumber = usersPhone.value  
        userDB.collection('userTest').doc(globalUserId).update({'phoneNumber' : newNumber}).then( () => {
            smsConfirmation.style.display = 'flex'
            $('#sms-confirmation').delay(1500).fadeOut(2000)
        })
    }
}

//Billing__________________________________________________________________________________________________________________________________
function loadFinancials() {
    loadTransactions()

    const currentBalance = document.getElementById('current-balance')

    const depositButton = document.getElementById('deposit-button')
    const withdrawButton = document.getElementById('withdraw-button')
    const transactionsButton = document.getElementById('transactions-button')

    const transactionsTab = document.getElementById('transactions-tab')
    const subscriptionsTab = document.getElementById('subscriptions-tab')
    const paymentMethodsTab = document.getElementById('payment-methods-tab')
    
    const transactionsContent = document.getElementById('transactions-content')
    
    const billingPage = document.getElementById('billing')
    const billingBack = document.getElementById('billing-back')


    currentBalance.innerHTML = '$' + parseFloat(coreBalance).toFixed(2)

    depositButton.addEventListener('click', () => {
        loadDeposit()
    })
    transactionsButton.addEventListener('click', () => {
        billingPage.style.display = 'flex'
    })

    billingBack.addEventListener('click', () => {
        billingPage.style.display = 'none'
    })

    //Tabs
    transactionsTab.addEventListener('click', () => {
        transactionsTab.setAttribute('class', 'billing-tab-selected')
        subscriptionsTab.setAttribute('class', 'billing-tab-unselected')
        paymentMethodsTab.setAttribute('class', 'billing-tab-unselected')

        transactionsContent.style.display = 'block'
    })

    subscriptionsTab.addEventListener('click', () => {
        transactionsTab.setAttribute('class', 'billing-tab-unselected')
        subscriptionsTab.setAttribute('class', 'billing-tab-selected')
        paymentMethodsTab.setAttribute('class', 'billing-tab-unselected')
    })

    paymentMethodsTab.addEventListener('click', () => {
        transactionsTab.setAttribute('class', 'billing-tab-unselected')
        subscriptionsTab.setAttribute('class', 'billing-tab-unselected')
        paymentMethodsTab.setAttribute('class', 'billing-tab-selected')
    })
}


function loadTransactions() {
    userDB.collection('userTest').doc(globalUserId).collection('spending').onSnapshot(function(spending) {

        var promises = []
        var transactionsObject = []

        spending.forEach(function(doc) {
            const data = doc.data()
            const date = data.start
            const id = doc.id
            const transaction = [date, id, data]

            transactionsObject.push(transaction)
            promises.push(doc.data())
        })

        Promise.all(promises).then( () => {
            buildTransactions(transactionsObject)
        })
    })
}

function buildTransactions(transactions) {
    document.getElementById('number-results').innerHTML = transactions.length + ' Results'

    const summaryArea = document.getElementById('transaction-summary-area')

    while(summaryArea.firstChild) {
        summaryArea.removeChild(summaryArea.firstChild)
    }

    var sortedTransactions = transactions.sort(function(a,b) {
        return b[0] - a[0]
    })
    console.log(sortedTransactions)

    for( var i = 0; i < sortedTransactions.length; i++) {
        const date = sortedTransactions[i][0]
        const orderNumber = sortedTransactions[i][1]
        const amount = sortedTransactions[i][2].checkoutTotal
    
        const transactionSummary = document.createElement('div')
        transactionSummary.setAttribute('class', 'transaction-summary')
        summaryArea.appendChild(transactionSummary)

        const checkBox = document.createElement('div')
        checkBox.setAttribute('class', 'check-unselected')
        checkBox.innerHTML = ''
        transactionSummary.appendChild(checkBox)
        
        const orderNumberDiv = document.createElement('div')
        orderNumberDiv.setAttribute('class', 'transaction-order-number')
        orderNumberDiv.innerHTML = orderNumber
        transactionSummary.appendChild(orderNumberDiv)
 
        const billingDateDiv = document.createElement('div')
        billingDateDiv.setAttribute('class', 'transaction-billing-date')
        billingDateDiv.innerHTML = formatTransactionDate(date)
        transactionSummary.appendChild(billingDateDiv)

        const amountDiv = document.createElement('div')
        amountDiv.setAttribute('class', 'transaction-amount')
        amountDiv.innerHTML = '$' + amount
        transactionSummary.appendChild(amountDiv)
    }
}

function formatTransactionDate(date) {
    const dateObject = new Date(date * 1000)
    const month = dateObject.getMonth()
    const day = dateObject.getDate() + 1
    const year = dateObject.getFullYear()

    const yearString = month + '/' + day + '/' + year
    return yearString
}


//Deposit Functions____________________________________________________________________________________

var depositTotal
function loadDeposit() {
    depositNavigation()
    setInitialDepositState()

    depositTotal = 0
    var depositAmountField = document.getElementById('deposit-amount-field')
    var depositTotalText = document.getElementById('deposit-total-text') 
    var accountEmailField = document.getElementById('account-email')

    depositAmountField.placeholder = '$0.00'
    depositTotalText.innerHTML = '$' + depositTotal
    accountEmailField.innerHTML = coreEmail
    
    depositAmountField.onblur = () => {
        depositTotal = depositAmountField.value 
        depositTotalText.innerHTML = '$' + depositTotal
    }
    depositAmountField.addEventListener("keydown", function (e) {
        if (e.keyCode === 13) {
            $('#deposit-amount-field').blur()
            depositTotal = depositAmountField.value 
            depositTotalText.innerHTML = '$' + depositTotal
            depositAmountField.placeholder = '$' + depositTotal
            depositAmountField.value = ''
        }
    })
}

Webflow.push(function() {
    // Disable webflows submission onkeydown 13 (enter)
    $('#amount-form').submit(function() {
      return false
    })
})

function depositNavigation() {
    const profileBackButton = document.getElementById('profile-back-button')
    const checkoutWithCard = document.getElementById('checkout-with-card')
    const checkoutComplete = document.getElementById('checkout-complete')

    profileBackButton.addEventListener('click', () => {
        $('#deposit-page').fadeOut()
    })

    checkoutWithCard.addEventListener('click', () => {
        setProcessingInitialState()
    })

    checkoutComplete.addEventListener('click', () => {
        $('#deposit-page').fadeOut()
    })
}

function setInitialDepositState() {
    $("#processing-screen").hide()
    $("#processing-text").show()
    $("#confirmation-text").hide()
    $("#confirmation-check").hide()
    const depositPage = document.getElementById('deposit-page')
    depositPage.style.display = 'flex'

    $('#checkout-screen').fadeIn(400)
}

braintree.client.create({
    authorization: 'production_yks4fjkg_j3thkst7k9j6mkvc'
    }, function (clientErr, clientInstance) {
    if (clientErr) {
        console.error(clientErr);
        return;
    }

    // This example shows Hosted Fields, but you can also use this
    // client instance to create additional components here, such as
    // PayPal or Data Collector.

    braintree.hostedFields.create({
        client: clientInstance,
        styles: {
            'input': {
                'font-size': '14px'
            },
            'input.invalid': {
                'color': 'red'
            },
            'input.valid': {
                'color': 'green'
            }
        },
        fields: {
            number: {
                selector: '#card-number',
                placeholder: '4111 1111 1111 1111'
            },
            cvv: {
                selector: '#cvv',
                placeholder: '123'
            },
            expirationDate: {
                selector: '#expiration-date',
                placeholder: '10/2022'
            }
        }
    }, function (hostedFieldsErr, hostedFieldsInstance) {
        if (hostedFieldsErr) {
            console.error(hostedFieldsErr);
            return;
        }

        var checkoutWithCard = document.getElementById('checkout-with-card')

        checkoutWithCard.addEventListener('click', function (event) {
            event.preventDefault();
            setProcessingInitialState()

            hostedFieldsInstance.tokenize(function (tokenizeErr, payload) {
                if (tokenizeErr) {
                    console.error(tokenizeErr);
                    processingErrorResetScreens()
                    showErrorMessage("Something went wrong. Please try again")
                return;
                }
                var nonce = payload.nonce
                var amount = depositTotal
                setProcessingInitialState()
                checkoutWithNonceAndAmount(nonce, amount, "Credit Card")
            });
        }, false);
    })
})

async function checkoutWithNonceAndAmount(nonce, amount, howPaid) {
    var xhttp = new XMLHttpRequest();
    var herokuURL = "https://tutortree2.herokuapp.com/checkoutWithNonceAndAmount/"+nonce+"/"+amount
            
    xhttp.onreadystatechange = function() {
            if (xhttp.readyState == XMLHttpRequest.DONE) {
                    var response = xhttp.responseText
                    console.log(response)
                    if(response == 'Declined') {
                        processingErrorResetScreens()
                        showErrorMessage('Your payment method was declined.')
                    } else {
                        createDeposit(howPaid, response)
                    }
            }
    }
    xhttp.open("GET", herokuURL, true);
    xhttp.send();

    return(xhttp.response)
}

function createDeposit(howPaid, transactionID) {
    var currentDateTime = new Date() / 1000
    var dateObject = getFormattedDate(currentDateTime)
    const dateCreated = dateObject[0] + ', ' + dateObject[1] + ' ' + dateObject[2]

    var depositDict = {
        'user' : globalUserId,
        'accountEmail' : coreEmail,
        'amount' : depositTotal,
        'date' : dateCreated,
        'dateEpoch' : currentDateTime,
        'howPaid' : howPaid
    }
    console.log(depositDict)

    var promises = []
    var depositPromise = userDB.collection('deposits').doc(transactionID).set(depositDict).then(function(){
        console.log("Global deposits written")
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });

    var userPromise = userDB.collection('userTest').doc(globalUserId).collection('deposits').doc(transactionID).set(depositDict).then(function(){
        console.log("User deposits written")
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });
    
    var balancePromise = userDB.collection('userTest').doc(globalUserId).update({
        'currentBalance' : coreBalance + parseFloat(depositTotal)
    }).then(function() {
        console.log('Balance updated')
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });

    promises.push(depositPromise, userPromise, balancePromise)

    Promise.all(promises).then( () => {
        console.log("All documents written successfully")
        sendReceiptTo(transactionID, depositTotal, coreEmail)
        $("#processing-text").hide(() => {
            $('#confirmation-text').fadeIn()
            $('#confirmation-check').fadeIn()
        })
    })
}

function showErrorMessage(message) {
    var errorMessageDiv = document.getElementById('error-message')
    errorMessageDiv.innerHTML = message

    $('#error-message').fadeIn().delay(5000).fadeOut("slow")
}

function setProcessingInitialState() {
    $("#checkout-screen").hide( () => {
        $("#processing-screen").show()
        $("#processing-text").show()
        $("#confirmation-text").hide()
        $("#confirmation-check").hide()
    })
}

function processingErrorResetScreens() {
    $("#processing-screen").show( () => {
        $("#checkout-screen").hide()
        $("#processing-text").show()
        $("#confirmation-text").hide()
        $("#confirmation-check").hide()
    })
}

//Withdrawal Functions_____________________________________________________________________________________________________________________________
const withdrawalButton = document.getElementById('withdrawal-button')

const withdrawalPage = document.getElementById('withdrawal-page')
const withdrawalBackButton = document.getElementById('withdrawal-back-button')
const payoutOptions = document.getElementById('payout-options')
const payoutSelectionScreen = document.getElementById('payout-selection-screen')
const payoutFields = document.getElementById('payout-fields')

const paypalButton = document.getElementById('paypal-button')
const zelleButton = document.getElementById('zelle-button')
const venmoButton = document.getElementById('venmo-button')

var withdrawalBalance = document.getElementById('withdrawal-balance')
const paypalWithdrawalDiv = document.getElementById('paypal-withdrawal-div')
const zelleWithdrawalDiv = document.getElementById('zelle-withdrawal-div')
const venmoWithdrawalDiv = document.getElementById('venmo-withdrawal-div')

const paypalField = document.getElementById('paypal-field')
const zelleField = document.getElementById('zelle-field')
const venmoField = document.getElementById('venmo-field')

const confirmPaypal = document.getElementById('confirm-paypal')
const confirmZelle = document.getElementById('confirm-zelle')
const confirmVenmo = document.getElementById('confirm-venmo')

const withdrawalProcessingScreen = document.getElementById('withdrawal-processing-screen')
const withdrawalConfirmationText = document.getElementById('w-confirmation-text')
const withdrawalConfirmationCheck = document.getElementById('w-confirmation-check')
const withdrawalProcessingText = document.getElementById('w-processing-text')
const withdrawalCompleteButton = document.getElementById('withdrawal-complete')

withdrawalButton.addEventListener('click', () => {
    loadWithdrawalInitialState()
})

withdrawalBackButton.addEventListener('click', () => {
    withdrawalPage.style.display = 'none'
})

paypalButton.addEventListener('click', () => {
    paypalButton.setAttribute('class', 'payout-option-div-selected')
    zelleButton.setAttribute('class', 'payout-option-div')
    venmoButton.setAttribute('class', 'payout-option-div')

    $('#payout-fields').fadeIn()
    paypalWithdrawalDiv.style.display = 'block'
    zelleWithdrawalDiv.style.display = 'none'
    venmoWithdrawalDiv.style.display = 'none'
})

zelleButton.addEventListener('click', () => {
    paypalButton.setAttribute('class', 'payout-option-div')
    zelleButton.setAttribute('class', 'payout-option-div-selected')
    venmoButton.setAttribute('class', 'payout-option-div')

    $('#payout-fields').fadeIn()
    paypalWithdrawalDiv.style.display = 'none'
    zelleWithdrawalDiv.style.display = 'block'
    venmoWithdrawalDiv.style.display = 'none'
})

venmoButton.addEventListener('click', () => {
    paypalButton.setAttribute('class', 'payout-option-div')
    zelleButton.setAttribute('class', 'payout-option-div')
    venmoButton.setAttribute('class', 'payout-option-div-selected')

    $('#payout-fields').fadeIn()
    paypalWithdrawalDiv.style.display = 'none'
    zelleWithdrawalDiv.style.display = 'none'
    venmoWithdrawalDiv.style.display = 'block'
})

confirmPaypal.addEventListener('click', () => {
    $('#payout-selection-screen').fadeOut(400, () => {
        $('#withdrawal-processing-screen').fadeIn()

        withdrawalConfirmationText.style.display = 'none'
        withdrawalConfirmationCheck.style.display = 'none'
        withdrawalProcessingText.style.display = 'flex'
        withdrawFunds('paypal')
    })
})

confirmZelle.addEventListener('click', () => {
    $('#payout-selection-screen').fadeOut(400, () => {
        $('#withdrawal-processing-screen').fadeIn()
        
        withdrawalConfirmationText.style.display = 'none'
        withdrawalConfirmationCheck.style.display = 'none'
        withdrawalProcessingText.style.display = 'flex'
        withdrawFunds('zelle')
    })
})

confirmVenmo.addEventListener('click', () => {
    $('#payout-selection-screen').fadeOut(400, () => {
        $('#withdrawal-processing-screen').fadeIn()
        
        withdrawalConfirmationText.style.display = 'none'
        withdrawalConfirmationCheck.style.display = 'none'
        withdrawalProcessingText.style.display = 'flex'
        withdrawFunds('venmo')
    })
})

withdrawalCompleteButton.addEventListener('click', () => {
    withdrawalPage.style.display = 'none'
})

function loadWithdrawalInitialState() {
    paypalButton.setAttribute('class', 'payout-option-div')
    zelleButton.setAttribute('class', 'payout-option-div')
    venmoButton.setAttribute('class', 'payout-option-div')

    withdrawalPage.style.display = 'flex'
    payoutSelectionScreen.style.display = 'flex'
    payoutOptions.style.display = 'block'
    payoutFields.style.display = 'none'

    withdrawalBalance.innerHTML = parseFloat(coreBalance).toFixed(2)

    withdrawalProcessingScreen.style.display = 'none'
    withdrawalConfirmationText.style.display = 'none'
    withdrawalConfirmationCheck.style.display = 'none'
    withdrawalProcessingText.style.display = 'flex'

}

function withdrawFunds( howWithdraw) {
    var withdrawAmount = coreBalance
    var withdrawUsername

    if(howWithdraw == 'paypal') {
        withdrawUsername = paypalField.value 

    } else if(howWithdraw == 'zelle') {
        withdrawUsername = zelleField.value 

    } else if(howWithdraw == 'venmo') {

        withdrawUsername = venmoField.value 
    }

    var title = 'New Withdrawal Request'
    var smsMessage = coreName + ' has submitted a withdrawal request for $' + withdrawAmount + ' via ' + howWithdraw
    var message = coreName +' has submitted a new withdrawal request for: $' + withdrawAmount 
                + '\n Withdrawal Method: ' + howWithdraw
                + '\n Withdrawal Username: ' + withdrawUsername 
                + '\n Email: ' + coreEmail
                + '\n Name: ' + coreName
                + '\n UserID: ' + globalUserId
                + '\n Phone Number: ' + corePhone

    sendEmailTo('support@tutortree.com', title, message)
    sendSMSTo('4582108156', smsMessage)

    userDB.collection('userTest').doc(globalUserId).update( {'currentBalance' : 0 }).then( () => {
        loadCompletedState()
    })
}

function loadCompletedState() {
    payoutSelectionScreen.style.display = 'none'

    withdrawalProcessingScreen.style.display = 'flex'
    $("#w-processing-text").hide(() => {

        $('#w-confirmation-text').fadeIn()
        $('#w-confirmation-check').fadeIn()
    })
}


//Edit Profile____________________________________________________________________________________________________________________
var editProfileButton = document.getElementById('edit-profile-button')
var editProfilePage = document.getElementById('edit-profile-page')
var editProfileBack = document.getElementById('edit-profile-back')

var aboutScreen = document.getElementById('about-screen')
var editImageBlock = document.getElementById('edit-image-block')
var editNameField = document.getElementById('edit-name-field')
var editBioField = document.getElementById('edit-bio-field')
var saveNameButton = document.getElementById('save-name-button')
var saveBioButton = document.getElementById('save-bio-button')

var coursesScreen = document.getElementById('courses-screen')
var schoolHeader = document.getElementById('school-header')
var changeSchoolButton = document.getElementById('change-school-button')
var coursesSchoolContainer = document.getElementById('courses-school-container')
var coursesContainer = document.getElementById('courses-container')


editProfileButton.addEventListener('click', () => {
    editProfilePage.style.display = 'flex'

    loadUserElements()
    if(coreIsTutor) {
        loadTutorElements()
    }
})

editProfileBack.addEventListener('click', () => {
    editProfilePage.style.display = 'none'
})

editNameField.onfocus = function() {
    $('#save-name-button').fadeIn()
}

editBioField.onfocus = function() {
    $('#save-bio-button').fadeIn()
}

saveNameButton.addEventListener('click', () => {
    userDB.collection('userTest').doc(globalUserId).update({
        'name' : editNameField.value
    }).then(() => {
        $('#save-name-button').fadeOut()
    })
})

saveBioButton.addEventListener('click', () => {
    userDB.collection('userTest').doc(globalUserId).update({
        'bio' : editBioField.value
    }).then(() => {
        $('#save-bio-button').fadeOut()
    })
})

function loadUserElements() {
    aboutScreen.style.display = 'flex'
    saveNameButton.style.display = 'none'
    saveBioButton.style.display = 'none'
    experienceScreen.style.display = 'none'
    saveMajorButton.style.display = 'none'
    availabilityScreen.style.display = 'none'
    coursesScreen.style.display = 'none'

    editNameField.value = coreName
    editBioField.value = coreBio
    editMajorField.value = coreSubject

    //Create Photo 
    editImageBlock.removeChild(editImageBlock.firstChild)
    editImageBlock.removeChild(editImageBlock.firstChild)

    var newImage = document.createElement('img')
    newImage.setAttribute('class', 'edit-profile-image')
    newImage.src = coreProfileImage
    editImageBlock.appendChild(newImage)
    newImage.addEventListener('click', function() {
        openPhotoUploadDialog()
    })

    var newIcon = document.createElement('div')
    newIcon.setAttribute('class', 'edit-photo-icon')
    newIcon.innerHTML = ''
    editImageBlock.appendChild(newIcon)
}

function loadTutorElements() {
    aboutScreen.style.display = 'flex'
    experienceScreen.style.display = 'flex'
    availabilityScreen.style.display = 'flex'
    coursesScreen.style.display = 'flex'

    loadExperience()
}

//Photo Upload
var storageRef = firebase.storage().ref();
var hiddenPhotoUploadButton = document.getElementById('hidden-photo-upload-button')

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
		.doc(globalUserId)
        .update( {"profileImage" : phototFileURL })
        .then(function() {
            userDB.collection('userTest').doc(globalUserId).get().then(async function(doc) {
                //Create Photo 
                editImageBlock.removeChild(editImageBlock.firstChild)
                editImageBlock.removeChild(editImageBlock.firstChild)

                var newImage = document.createElement('img')
                newImage.setAttribute('class', 'edit-profile-image')
                newImage.src = doc.data().profileImage
                editImageBlock.appendChild(newImage)
                newImage.addEventListener('click', function() {
                    openPhotoUploadDialog()
                })

                var newIcon = document.createElement('div')
                newIcon.setAttribute('class', 'edit-photo-icon')
                newIcon.innerHTML = ''
                editImageBlock.appendChild(newIcon)
            })
        })
}


//Experience Screen__________________________________________________________________________
var experienceScreen = document.getElementById('experience-screen')
var editMajorField = document.getElementById('edit-major-field')
var saveMajorButton = document.getElementById('save-major-button')
var experienceContainer = document.getElementById('experience-container')
var addExperienceButton = document.getElementById('add-experience-button')
var addExperienceContainer = document.getElementById('add-experience-container')
var addExperienceTitle = document.getElementById('add-experience-title')
var addExperienceDescription = document.getElementById('add-experience-description')
var cancelExperienceButton = document.getElementById('cancel-experience-button')
var confirmExperienceButton = document.getElementById('confirm-experience-button')

editMajorField.onfocus = function() {
    $('#save-major-button').fadeIn()
}

saveMajorButton.addEventListener('click', () => {
    userDB.collection('userTest').doc(globalUserId).update({
        'major' : editMajorField.value
    }).then(() => {
        $('#save-major-button').fadeOut()
    })
})

function loadExperience() {
    while(experienceContainer.firstChild) {
        experienceContainer.removeChild(experienceContainer.firstChild)
    }
    addExperienceContainer.style.display = 'none'

    userDB.collection('userTest').doc(globalUserId).get().then(function(doc) {
        var experienceData = doc.data().experience 

        for(var experience in experienceData) {
            if ( experienceData.hasOwnProperty(experience) ){
                var title = experienceData[experience].title
                var description = experienceData[experience].description
                buildExperienceBlock(experience, title, description)
            }
        }
    })
}

function buildExperienceBlock(ID, title, description) {
    var experienceDiv = document.createElement('div')
    experienceDiv.setAttribute('class', 'experience-div')
    experienceContainer.appendChild(experienceDiv)
    
    var experienceHeaderDiv = document.createElement('div')
    experienceHeaderDiv.setAttribute('class', 'experience-header-div')
    experienceDiv.appendChild(experienceHeaderDiv)

    var experienceTitle = document.createElement('div')
    experienceTitle.setAttribute('class', 'experience-title')
    experienceTitle.innerHTML = title
    experienceHeaderDiv.appendChild(experienceTitle)

    var experienceMinus = document.createElement('div')
    experienceMinus.setAttribute('class', 'experience-minus')
    experienceMinus.innerHTML = ''
    experienceHeaderDiv.appendChild(experienceMinus)
    experienceMinus.addEventListener('click', () => {
        var experiencePath = 'experience.' + ID
        var deletedExperience = {}
        deletedExperience[experiencePath] = firebase.firestore.FieldValue.delete()

        userDB.collection('userTest').doc(globalUserId).update( deletedExperience ).then(function() {
            loadExperience()
        })
    })

    var experienceText = document.createElement('div')
    experienceText.setAttribute('class', 'experience-text')
    experienceText.innerHTML = description
    experienceDiv.appendChild(experienceText)
    
}

addExperienceButton.addEventListener('click', () => {
    $('#add-experience-container').fadeIn()
})

confirmExperienceButton.addEventListener('click', () => {
    addNewExperience()
})

cancelExperienceButton.addEventListener('click', () => {
    addExperienceTitle.value = ''
    addExperienceTitle.placeholder = 'Title'
    addExperienceDescription.value = ''
    addExperienceDescription.placeholder = 'Description'
    $('#add-experience-container').fadeOut()
})

function addNewExperience() {
    var title = addExperienceTitle.value
    var description = addExperienceDescription.value 
    var randomID = createTransactionID()
    var experiencePath = 'experience.' + randomID
    var newExperience = {}
    newExperience[experiencePath] = {'title' : title, 'description' : description}

    userDB.collection('userTest').doc(globalUserId).update(newExperience).then( () => {
        addExperienceTitle.value = ''
        addExperienceTitle.placeholder = 'Title'
        addExperienceDescription.value = ''
        addExperienceDescription.placeholder = 'Description'

        $('#add-experience-container').fadeOut()
    })
}

