/// <reference types="cypress" />

// Marcels_Cypress_API_Demo.js

/*
This is a super simple API demo showing the retrieval and modification of data.
The website used for testing is https://restful-booker.herokuapp.com/apidoc/index.html

The token is first grabbed for future PUT and DELETE(which I did not show) methods.
Data is then checked, and modified using the token.

Test details:

* Test 1: Shows all bookings, and an individual booking.
Description: Proper retrieval of booking data, group and individual, is tested.
Steps to reproduce:
- Get full booking logs.
- Get individual booking information from full booking logs.
Expected results:
Data is populated correctly. Individual information can be retrieved from API using ID.

* Test 2: Checking that we can modify the last name of individual booking.
Description: Proper modification of booking data.
Steps to reproduce:
- Get individual booking information.
- Modify last name of booking information, and change via PUT method.
- Check individual booking information to show change was made.
Expected results:
Individual information details can be properly changed via API.

*/

describe('Marcel Mushik Cypress API Demo', function() {

    let tokenUrl = "https://restful-booker.herokuapp.com/auth/";
    let BookingUrl = "https://restful-booker.herokuapp.com/booking/";
    let bookingID = '10';
    let newLastName = 'HolyOne';


    beforeEach(function() {
        // Getting token for future PUT and DELETE requests.
        // Token gets stuffed into tokenResponse.
        cy.request('POST', tokenUrl, {'username': 'admin', 'password': 'password123'}).as('tokenResponse');
    });


    it('Test1: Shows all bookings, and an indivisual booking.', function() {

        // Showing all bookings in JSON format
        cy.request('GET', BookingUrl)
        .then((response) => {
            cy.log(JSON.stringify(response.body));
        });

        // Showing an individual booking with ID:10
        cy.request('GET', BookingUrl + bookingID)
        .then((response) => {
            cy.log(JSON.stringify(response.body));
        });
    });


    it('Test2: Checking that we can modify the last name of individual booking.', function() {

        // Showing the last name of booking with ID:10
        cy.request('GET', BookingUrl + bookingID)
        .then((response) => {
            cy.log(JSON.stringify('Last name before change: ' + response.body.lastname));

            // Changing the last name in the JSON object.
            let newBody = response.body;
            newBody.lastname = newLastName;

            // Changing the last name via API with token
            cy.request({
                method: 'PUT',
                url: BookingUrl + bookingID,
                headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Cookie': 'token='+this.tokenResponse.body.token},
                body: JSON.stringify(newBody)
            });
        });

        // Checking that the last name was changed properly
        cy.request('GET', BookingUrl + bookingID)
        .then((response) => {
            cy.log(JSON.stringify('Last name after change: ' + response.body.lastname));
            assert(JSON.stringify(response.body).includes(newLastName));
        });

    });
});
