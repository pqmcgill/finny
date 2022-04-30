import faker from "@faker-js/faker";
import type { Spend } from "@prisma/client";

describe("smoke tests", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow you to register and login", () => {
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
      password: faker.internet.password(),
    };
    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.visit("/");
    cy.findByRole("link", { name: /sign up/i }).click();

    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole("button", { name: /create account/i }).click();

    cy.findByRole("link", { name: /spends/i }).click();
    cy.findByRole("button", { name: /logout/i }).click();
    cy.findByRole("link", { name: /log in/i });
  });

  it("should allow you to make a spend", () => {
    const testSpend: Pick<Spend, "amount" | "memo"> = {
      memo: faker.lorem.words(1),
      amount: 10.0,
    };
    cy.login();
    cy.visit("/");

    cy.findByRole("link", { name: /spends/i }).click();
    cy.findByText("No spends yet");

    cy.findByRole("link", { name: /\+ new spend/i }).click();

    cy.findByRole("textbox", { name: /memo/i }).type(testSpend.memo);
    cy.findByLabelText("Amount:").type(testSpend.amount + "");

    cy.findByRole("button", { name: /save/i }).click();

    cy.findByRole("button", { name: /delete/i }).click();

    cy.findByText("No spends yet");
  });
});
