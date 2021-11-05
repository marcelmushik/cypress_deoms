/// <reference types="cypress" />

// Marcels_Cypress_Web_Form_Demo.js

/*
This is a super simple demo showing the validation of the online web form https://demoqa.com/webtables
The general idea is the web form is tested to properly take user input and create a table entry. 
It is also tested for validation of missing information and incomlete information.

Note: For the third sub-test I did use xpath for fun, though standard cypress seems to be very similar.
This required the installation of the cypress-xpath plugin.

Test details:

* Test 1: Use of proper form information. Looking for proper functionality.
Description: Proper user information is input and a valid table entry is checked.
Steps to reproduce:
- Check title to ensure correct page.
- Click "Add" button to add person and information.
- Add all info First Name, Last Name, Email, Age, Salary, Department.
- Click "Submit".
- Check person was added correctly, with correct information.
Expected results:
Person’s information is added correctly and shown correctly. No errors.

* Test 2: Improper use of form: Missing information.
Description: Checking the validation of user input.
Steps to reproduce:
- Check title to ensure correct page.
- Click "Add" button to add person and information.
- Leave all input fields blank.
- Click "Submit".
- Check that the form is still present and validation errors are present.
Expected results:
Every input field should have an validation error.


* Test 3: Improper use of form: Incomplete email address.
Description:  Checking the validation of user input.
Steps to reproduce:
- Check title to ensure correct page.
- Click "Add" button to add person and information.
- Add all info First Name, Last Name, Age, Salary, Department, and bad email address.
- Click "Submit".
- Check that the form is still present and validation errors are present.
Expected results: 
The input field for the email address should show a validation error.

*/

describe('Marcel Mushik Cypress Web Form Demo', function() {
    beforeEach(function() {
        cy.visit('https://demoqa.com/webtables');
        cy.title().should('contain', 'ToolsQA');
    });

    const personalInfo = {
        firstName:"Sam", 
        lastName:"Iam",
        goodEmail:"sam.iam@fakeemail.com",
        badEmail:"sam.iam@",
        age:"33",
        salary:"500000",
        department:"illuminati",
        department2:"President"
    }

    it('Test 1: Use of proper form information. Looking for proper functionality.', function() {

        // Using this method to get current number of table entries
        cy.get('[class="action-buttons"]').find('[title="Delete"]').should('have.length', 3);

        // Adding new record to table
        cy.get('button[id="addNewRecordButton"]').contains("Add").click();
        cy.get('input[id="firstName"]').type(personalInfo.firstName);
        cy.get('input[id="lastName"]').type(personalInfo.lastName);
        cy.get('input[id="userEmail"]').type(personalInfo.goodEmail);
        cy.get('input[id="age"]').type(personalInfo.age);
        cy.get('input[id="salary"]').type(personalInfo.salary);
        cy.get('input[id="department"]').type(personalInfo.department);

        // Checking that the form is currently shown
        cy.get('[id="userForm"]').should('have.class', '');
        cy.get('[id="submit"]').click();

        // Checking that the form has gone away, successfully
        cy.get('[id="userForm"]').should('not.exist');

        // Checking that the new information has been added to the table
        cy.contains(personalInfo.firstName).parent('[role="row"]')
        .should('contain', personalInfo.firstName)
            .should('contain', personalInfo.lastName)
            .should('contain', personalInfo.goodEmail)
            .should('contain', personalInfo.age)
            .should('contain', personalInfo.salary)
            .should('contain', personalInfo.department);

        // Using this method to show that there is a new entry to the table
        cy.get('[class="action-buttons"]').find('[title="Delete"]').should('have.length', 4);

        // Editing record department
        cy.get('[id="edit-record-4"]').click();
        cy.get('input[id="department"]').clear().type(personalInfo.department2);
        cy.get('[id="submit"]').click();
        cy.get('[role="gridcell"]').should('contain', personalInfo.department2);

        // Deleting our new person from table
        cy.get('[id="delete-record-4"]').click();

        // Again using this method to show the new person has been properly deleted
        cy.get('[class="action-buttons"]').find('[title="Delete"]').should('have.length', 3);
      })



      it('Test 2: Improper use of form: Missing information.', function() {
        // Opening form to add new person's information
        cy.get('button[id="addNewRecordButton"]').contains("Add").click();

        // Checking form is present
        cy.get('[id="userForm"]').should('exist');

        // Checking that the validate event has not yet been triggered
        cy.get('[id="userForm"]').should('not.have.class', 'was-validated');

        cy.get('[id="submit"]').click();

        // Checking that the validation event has been triggered and form is still present
        cy.get('[id="userForm"]').should('have.class', 'was-validated');
        cy.get('[id="userForm"]').should('exist');
 
        // Closing the form
        cy.get('[aria-hidden="true"]').contains('×').click();

      })



      it('Test 3: Improper use of form: Malformatted email address.', function() {
        // Opening form to add person's information
        cy.xpath('//button[text()="Add"]').click();

        // Adding person's information with incomplete email address
        cy.xpath('//*[@id="firstName"]').type(personalInfo.firstName);
        cy.xpath('//*[@id="lastName"]').type(personalInfo.lastName);
        cy.xpath('//*[@id="userEmail"]').type(personalInfo.badEmail);
        cy.xpath('//*[@id="age"]').type(personalInfo.age);
        cy.xpath('//*[@id="salary"]').type(personalInfo.salary);
        cy.xpath('//*[@id="department"]').type(personalInfo.department);

        // Checking that the validate event has not yet been triggered
        cy.xpath('//*[@id="userForm"]').should('not.have.class', 'was-validated');

        cy.xpath('//*[@id="submit"]').click();

        // Checking that the validation event has been triggered and form is still present
        cy.xpath('//*[@id="userForm"]').should('have.class', 'was-validated');
        cy.xpath('//*[@id="userForm"]').should('exist');

        // Closing the form
        cy.xpath('//*[@aria-hidden="true"]').contains('×').click();
      })
  });
  
