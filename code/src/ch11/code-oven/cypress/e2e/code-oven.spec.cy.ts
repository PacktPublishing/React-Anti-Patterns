describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000');
    cy.contains('The Code Oven');
  })
})