# Fintale demo

Play: https://simovicm26.github.io/fintale/

Learn finance through an interactive workshop story, starting with assets, liabilities, equity and the accounting equation.

## Hosting

GitHub Pages serves the main branch from the repository root. No build step or server is required. Keep the HTML, JavaScript, CSS and responsive WebP artwork together.

## Feedback and launch list

The four optional questions lead to a real Brevo signup form. Submitting an email and launch-update consent sends that email and any answers together to the private list **Fintale demo and launch updates**. Questions are limited to 500 characters to match Brevo. Skipping email does not submit the answers. Feedback no longer opens public GitHub issues.

Brevo stores the answers as FINTALE_LIKED, FINTALE_IMPROVE, FINTALE_FINANCE and FINTALE_ACCOUNTING contact attributes. An address has one contact record; a later submission can update its answers. See CRM → Contacts → Lists in Brevo, open the Fintale list, then open a contact to read its answers.

Submissions use Brevo’s public form endpoint, not a secret API key. The browser posts directly to Brevo for validation and saving, then returns to signup-thanks.html after success. The app does not display a fake success message before the provider responds. A temporary draft is kept in session storage during submission so a failed request can be retried using the browser Back button; it is removed on the success page. No email address is added to URLs or lesson progress storage.

## Confirmation emails

Automatic simple confirmation emails are enabled. The form uses the active template **Fintale — Signup confirmation** (#5), with sender name **Fintale** and subject **You’re on the Fintale list!**. The message confirms signup, explains that more courses are in development, links back to the demo, and includes an unsubscribe link. The thank-you redirect remains signup-thanks.html. Brevo’s delivery log confirmed a test email was delivered to the owner. The sender currently uses Brevo’s sending domain because a custom sending domain is not authenticated.

## Verification

The chapter event harness, DOM preservation and artwork loader checks pass. Payload checks cover all four feedback fields, required consent, safe escaping and 500-character limits. Clearly marked setup submissions using the owner’s address were accepted through both Brevo’s hosted form and the live Fintale app, returned to the thank-you page, and all four values—including punctuation and angle brackets—were verified in the contact record. No learner email was used for testing.