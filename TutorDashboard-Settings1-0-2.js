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
        currentBalance.innerHTML = '$' + userInfo.currentBalance
        
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
    withdrawModal.style.display = 'flex'
    document.getElementById('withdraw-balance').innerHTML = '$' + amount
    
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
                var message = tutorsName + " has submitted a withdrawal request for $" + amount +". Their venmo username is: " + venmoWithdrawField.value + ", account ID is: " + globalTutorID
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
                var message = tutorsName + " has submitted a withdrawal request for $" + amount +". Their email is: " + emailWithdrawField.value + ", account ID is: " + globalTutorID
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
