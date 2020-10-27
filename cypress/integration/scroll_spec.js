context('Scroll', () => {
  beforeEach(() => {
    cy.server()
    cy.viewport(800, 600)
    cy.visit('/cypress/fixtures/scroll.html')
  })

  it('repositions popover above or below the button', () => {
    cy.findByTitle('See Footnote 1').click()

    cy.scrollTo('top')
    cy.get('.littlefoot').should('have.attr', 'data-footnote-position', 'top')

    cy.scrollTo('bottom')
    cy.get('.littlefoot').should(
      'have.attr',
      'data-footnote-position',
      'bottom'
    )
  })

  it('scrolls popover content', () => {
    cy.findByTitle('See Footnote 1').click()

    cy.get('.littlefoot')
      .should('have.class', 'is-scrollable')
      .and('not.have.class', 'is-fully-scrolled')

    cy.get('.littlefoot__content')
      .should('have.attr', 'tabindex', '0')
      .scrollTo('bottom')

    // FIXME: Content scroll events not triggering correctly.
    // cy.get('.littlefoot').should('have.class', 'is-fully-scrolled')

    cy.get('.littlefoot__content').scrollTo('top')

    cy.get('.littlefoot').should('not.have.class', 'is-fully-scrolled')
  })
})
