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
    coreName,
    corePhone,
    coreProfileImage,
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

