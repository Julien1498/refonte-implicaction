/// <reference types="cypress" />

context('Connection', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080')
  })
  it('cy.go() - Testing navbar', () => {
    cy.get('.navbar-expand-lg').contains('Se connecter').click()
    cy.get('.navbar-expand-lg').contains('S\'inscrire').click()
  })

  it('cy.reload() - reload the page', () => {
    // https://on.cypress.io/reload
    cy.reload()

    // reload the page without using the cache
    cy.reload(true)
  })

  it('cy.inscription() - go to inscription form', () => {
    cy.get('.navbar-expand-lg').contains('S\'inscrire').click()
    cy.get('#floatingUsername').type('test')
    cy.get('#floatingEmail').type('test@test.com')
    cy.get('.d-grid > .btn').click()
    cy.get('#floatingPassword').type('Azerty00')
    cy.get('#floatingConfirmPassword').type('Azerty00')
    cy.get('#floatingFirstname').type('testtt')
    cy.get('#floatingLastname').type('tesdfsdfttt')
    cy.get('.d-grid > .btn').click()
  })

  it('cy.connect() - test login and logout', () => {
    cy.get('.navbar-expand-lg').contains('Se connecter').click()
    cy.get('#floatingUsername').type('admin')
    cy.get('#floatingPassword').type('password')
    cy.get('.d-grid > .btn').click()
    cy.get('#dropdownUser2').click()
    cy.get(':nth-child(7) > .dropdown-item').click()
  })
})

context('Navigation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080')
    cy.get('.navbar-expand-lg').contains('Se connecter').click()
    cy.get('#floatingUsername').type('admin')
    cy.get('#floatingPassword').type('password')
    cy.get('.d-grid > .btn').click()
  })
  
  afterEach(()=> {
    cy.get('#dropdownUser2').click()
    cy.get(':nth-child(7) > .dropdown-item').click()
  })

  it('cy.entreprise() - testing Espace entreprise', () => {
    cy.get('.navbar-expand-lg').contains('Espace entreprise').click()
    cy.get(':nth-child(2) > :nth-child(1) > :nth-child(4)').contains('recrutement@implicaction.eu')

  })

  it('cy.navbar() - Testing navbar when connected', () => {
    cy.get('.navbar-expand-lg > .d-none').should(($p) => {
      // make sure the first contains some text content
      expect($p.first()).to.contain('Accueil')
      expect($p.first()).to.contain('Espace entreprise')
      expect($p.first()).to.contain('Communauté')
      expect($p.first()).to.contain('Offres d\'emploi')
      expect($p.first()).to.contain('Forum')
      expect($p.first()).to.contain('Admin')

    })
  })

  it('cy.community() - Testing Communauté', () => {
    cy.get('.navbar-expand-lg').contains('Communauté').click()
    cy.get(':nth-child(1) > .card > .card-body > .d-flex > .btn').click()
    cy.get(':nth-child(1) > .card > .card-body > .h5 > .link-profile > .text-decoration-none').click()
    cy.get('.sidebar-profile ')
    cy.get('app-experience-list > .card')
    cy.get('app-training-list > .card')
  })

  it('cy.offers() - Testing filters', () => {
    cy.get('.navbar-expand-lg').contains('Offres d\'emploi').click()
    cy.get('#CDIRadio').click()
    cy.get('#CDDRadio').click()
    cy.get('#INTERIMRadio').click()
    cy.get('#ALTERNRadio').click()
  })

  it('cy.admin() - Testing admin page Admin Users', () => {
    cy.get('.navbar-expand-lg').contains('Admin').click()
    cy.get('[ng-reflect-router-link="/admin/users"]').click()
  })

  it('cy.admin() - Testing admin page Jobs', () => {
    cy.get('.navbar-expand-lg').contains('Admin').click()
    cy.get('[ng-reflect-router-link="/admin/jobs"]').click()
  })

  it('cy.admin() - Testing admin page add Companies', () => {
    cy.get('.navbar-expand-lg').contains('Admin').click()
    cy.get('[ng-reflect-router-link="/admin/companies"]').click()
    cy.get('button.btn.btn-success.fw-bold').click()
    cy.get('form.ng-untouched > :nth-child(1) > #nameInput').type('Gologole')
    cy.get('#logoInput').type('Deh')
    cy.get('#urlInput').type('https://gologole.fr')
    cy.get('.ql-editor').type('Desc de l\'entreprise')
    cy.get('button.btn.btn-primary.w-50').click()
  })
  it('cy.admin() - Testing admin page search Companies', () => {
    cy.get('.navbar-expand-lg').contains('Admin').click()
    cy.get('[ng-reflect-router-link="/admin/companies"]').click()
    cy.get('#nameInput').type('Gologole{enter}')
  })
})
