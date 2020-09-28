

//Global Variables__________________________________________________________
var checkoutTotal,
    prepPackTitle,
    subtotal,
    fees, 
    check


//Elements__________________________________________________________________
var miniBuyNow = document.getElementById('mini-buy-now')
var basicBuyNow = document.getElementById('basic-buy-now')
var valueBuyNow = document.getElementById('value-buy-now')
var premiumBuyNow = document.getElementById('premium-buy-now')

var parentCheckout = document.getElementById('parent-checkout')
var closeParentCheckout = document.getElementById('close-parent-checkout')
var studentName = document.getElementById('student-name')
var studentUniversity = document.getElementById('student-university')
var studentEmail = document.getElementById('student-email')
var billingName = document.getElementById('billing-name')
var billingAddress1 = document.getElementById('billing-address-1')
var billingAddress2 = document.getElementById('billing-address-2')
var billingCity = document.getElementById('billing-city')
var billingState = document.getElementById('billing-state')
var billingZip = document.getElementById('billing-zip')
var billingCountry =  document.getElementById('billing-country')
var billingEmail = document.getElementById('billing-email')
var billingCardNumber = document.getElementById('billing-card-number')
var billingExpiration = document.getElementById('billing-expiration')
var billingCVC = document.getElementById('billing-cvc')

var summaryPackTitle = document.getElementById('summary-pack-title')
var summarySubtotal = document.getElementById('summary-subtotal')
var summaryFees = document.getElementById('summary-fees')
var summaryTotal = document.getElementById('summary-total')
var checkoutButton = document.getElementById('checkout-button')
var miniBadge = document.getElementById('mini-badge')
var basicBadge = document.getElementById('basic-badge')
var valueBadge = document.getElementById('value-badge')
var premiumBadge = document.getElementById('premium-badge')
var summaryError = document.getElementById('summary-error')


//Event Listeners_____________________________________________________________
miniBuyNow.addEventListener('click', function() {
    parentCheckout.style.display = 'flex'
    
    prepPackTitle = 'Mini Prep Pack'
    subtotal = 50
    fees = 3.95
    checkoutTotal = 53.95
    displayBadges('mini')
    loadParentCheckout()
})

basicBuyNow.addEventListener('click', function() {
    parentCheckout.style.display = 'flex'
    
    prepPackTitle = 'Basic Prep Pack'
    subtotal = 150
    fees = 3.95
    checkoutTotal = 153.95
    displayBadges('basic')
    loadParentCheckout()
})

valueBuyNow.addEventListener('click', function() {
    parentCheckout.style.display = 'flex'
    
    prepPackTitle = 'Value Prep Pack'
    subtotal = 300
    fees = 3.95
    checkoutTotal = 303.95
    displayBadges('value')
    loadParentCheckout()
})

premiumBuyNow.addEventListener('click', function() {
    parentCheckout.style.display = 'flex'
    
    prepPackTitle = 'Premium Prep Pack'
    subtotal = 550
    fees = 3.95
    checkoutTotal = 553.95
    displayBadges('premium')
    loadParentCheckout()
})

checkoutButton.addEventListener('click', function() {
	console.log('testing')			
})




//Functions_____________________________________________________________________

function displayBadges(badge) {

    var badgeTitles = ['mini', 'basic', 'value', 'premium']
    var badgeElements = [miniBadge, basicBadge, valueBadge, premiumBadge]

    for (i = 0; i < badgeTitles.length; i++) {
        if (badgeTitles[i] == badge) {
            badgeElements[i].style.display = 'block'
        } else {
            badgeElements[i].style.display = 'none'
        }
    }
}


function loadParentCheckout() {
    summaryPackTitle.innerHTML = prepPackTitle
    summarySubtotal.innerHTML = '$' + subtotal
    summaryFees.innerHTML = '$' + fees
    summaryTotal.innerHTML = '$' + checkoutTotal
} 

function checkErrors(paymentDict) {
    for (var key in paymentDict) {
        if (paymentDict.hasOwnProperty(key)) {           
            if( paymentDict[key] == '') {
                console.log('error at : ' + key)
                displayError(key)
                
                if (key == 'billingAddress2') {
                    continue
                } else {
                    break
                }
            }
        }
    }
}
function displayError(errorType) {

    switch(errorType) {
        case 'studentName':
            summaryError.innerHTML = "Please enter the student's name"
            summaryError.style.display = 'block'
            break;
        case 'studentUniversity':
            summaryError.innerHTML = "Please enter the student's University"
            summaryError.style.display = 'block'
            break;
        case 'studentEmail':
            summaryError.innerHTML = "Please enter the student's email"
            summaryError.style.display = 'block'
            break;
        case 'billingName':
            summaryError.innerHTML = "Please enter your name"
            summaryError.style.display = 'block'
            break;
        case 'billingAddress1':
            summaryError.innerHTML = "Please enter the billing address"
            summaryError.style.display = 'block'
            break;
        case 'billingCity':
            summaryError.innerHTML = "Please enter the billing city"
            summaryError.style.display = 'block'
            break;
        case 'billingState':
            summaryError.innerHTML = "Please enter the billing state/province"
            summaryError.style.display = 'block'
            break;
        case 'billingZip':
            summaryError.innerHTML = "Please enter the billing zip"
            summaryError.style.display = 'block'
            break;
        case 'billingCountry':
            summaryError.innerHTML = "Please enter the billing country"
            summaryError.style.display = 'block'
            break;
        case 'billingEmail':
            summaryError.innerHTML = "Please enter the receipt email"
            summaryError.style.display = 'block'
            break;
        case 'billingCardNumber':
            summaryError.innerHTML = "Please enter the card number"
            summaryError.style.display = 'block'
            break;
        case 'billingExpiration':
            summaryError.innerHTML = "Please enter expiration date"
            summaryError.style.display = 'block'
            break;
        case 'billingCVC':
            summaryError.innerHTML = "Please enter cvc"
            summaryError.style.display = 'block'
            break;
        default:
            summaryError.style.display = 'none'
      } 
}

async function braintreeCheckout(nonce, amount, checkoutDict) {
    var xhttp = new XMLHttpRequest();
    var herokuURL = "https://tutortree2.herokuapp.com/checkoutWithNonceAndAmount/"+nonce+"/"+amount
            
    xhttp.onreadystatechange = function() {
            if (xhttp.readyState == XMLHttpRequest.DONE) {
                    var response = xhttp.responseText
                    updateParentDatabase( response , checkoutDict)
            }
    }
    await xhttp.open("GET", herokuURL, true);
    await xhttp.send();

    return(xhttp.response)
}

function updateParentDatabase(checkoutID, checkoutDict) {
	console.log('updating Database')
    var updateDict = {
                'studentName' : checkoutDict.studentName,
                'studentEmail' : checkoutDict.studentEmail,
                'studentAccountID' : '',
                'studentUniversity' : checkoutDict.studentUniversity,
                'packTitle' : checkoutDict.packTitle,
                'purchaserEmail' : checkoutDict.parentEmail,
            }
    userDB.collection('prepPacks').doc(checkoutID).set(updateDict, { merge: true }).then(function() {

        sendParentCheckoutEmail(checkoutDict.packTitle,
                                checkoutDict.studentName,
                                checkoutDict.studentUniversity,
                                checkoutDict.studentEmail,
                                checkoutDict.billingName,
                                checkoutDict.billingAddress1,
                                checkoutDict.billingAddress2,
                                checkoutDict.billingCity,
                                checkoutDict.billingState,
                                checkoutDict.billingZip,
                                checkoutDict.billingCountry,
                                checkoutDict.parentEmail,
                                checkoutDict.checkoutTotal)

        sendTutorTreeSMS(checkoutID,
                        checkoutDict.parentEmail,
                        checkoutDict.studentEmail)

        sendParentReceipt(checkoutID,
                        checkoutDict.packTitle,
                        checkoutDict.checkoutTotal)

    })
}

function sendParentCheckoutEmail(packTitle, name, university, email, bName, address1, address2, city, state, zip, country, pEmail, cTotal) {
	var xhttp = new XMLHttpRequest();
        var herokuURL = "https://tutortree2.herokuapp.com/sendParentCheckoutEmail/"+packTitle+"/"+name+"/"+university+"/"+email+"/"+bName+"/"+address1+"/"+address2+"/"+city+"/"+state+"/"+zip+"/"+country+"/"+pEmail+"/"+cTotal
   	console.log(herokuURL)
	xhttp.open("GET", herokuURL, true);
	xhttp.send();
}

function sendTutorTreeSMS(checkoutID, parentEmail, email) {
    var xhttp = new XMLHttpRequest();
    var message = "New Parent Purchase: " + checkoutID + ", purchasers email: " + parentEmail + ", recipients email: " + email
	var herokuURL = "https://tutortree-development.herokuapp.com/sendSMSTo/+14582108156/"+message
	xhttp.open("GET", herokuURL, true);
	xhttp.send();
}

function sendParentReceipt(checkoutID, packTitle, checkoutTotal) {
    var xhttp = new XMLHttpRequest();
        var herokuURL = "https://tutortree2.herokuapp.com/sendParentCheckoutEmail/"+checkoutID+"/"+packTitle+"/"+checkoutTotal
   	console.log(herokuURL)
	xhttp.open("GET", herokuURL, true);
	xhttp.send();
}


//Braintree______________________________________________________________________________________

<!-- Load additional components when required. -->

<!-- Use the components. We'll see usage instructions next. -->

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
        selector: '#billing-card-number',
        placeholder: '4111 1111 1111 1111'
      },
      cvv: {
        selector: '#billing-cvv',
        placeholder: '123'
      },
      expirationDate: {
        selector: '#billing-expiration',
        placeholder: '10/2022'
      }
    }
  }, function (hostedFieldsErr, hostedFieldsInstance) {
    if (hostedFieldsErr) {
      console.error(hostedFieldsErr);
      return;
    }

    checkoutButton.addEventListener('click', async  function (event) {
	console.log('clicked')
      	event.preventDefault();
    	summaryError.style.display = 'none'

	var paymentDict = {
		'packTitle' : prepPackTitle,
		'studentName' : studentName.value,
		'studentUniversity' : studentUniversity.value,
		'studentEmail' : studentEmail.value,
		'billingName': billingName.value,
		'billingAddress1' : billingAddress1.value,
		'billingAddress2' : billingAddress2.value,
		'billingCity' : billingCity.value,
		'billingState' : billingState.value,
		'billingZip' : billingZip.value,
		'billingCountry' : billingCountry.value,
		'billingEmail' : billingEmail.value,
		'checkoutTotal' : checkoutTotal
	}
    	await( checkErrors(paymentDict) )
	
	if (summaryError.style.display == 'none') {
		console.log('processing')
		
		updateParentDatabase('test1', paymentDict)
		hostedFieldsInstance.tokenize(function (tokenizeErr, payload) {
		if (tokenizeErr) {
			console.error(tokenizeErr);
			return;
		}

		// If this was a real integration, this is where you would
		// send the nonce to your server.
		console.log('Got a nonce: ' + payload.nonce);
		})
	} else { 
		console.log('error found')
	}
			
      });
    }, false);
  });
