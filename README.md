# Fintale demo

Play: https://simovicm26.github.io/fintale/

An interactive accounting lesson about assets, liabilities, equity and the accounting equation. Hosted on GitHub Pages from main / repository root; no build step.

## Final-page flow

The ending offers email signup for free access to the full app when it launches, with feedback without signup as the secondary action. Brevo validates and saves signup, sends the existing confirmation email, then returns to signup-thanks.html. That page forwards to optional feedback questions. A visitor may skip every question and finish; signup is already saved.

## Independent feedback

Four optional answers are submitted to the Supabase demo_feedback table, without an email address. Only pressing Send feedback sends answers. Drafts remain in session storage for reload/retry; failed requests never show success. A per-payload UUID prevents duplicate responses if an accepted request is retried after a lost connection. Responses are limited to 500 characters per question and empty submissions are not sent.

The browser uses a public publishable key. Row-level security is enabled; anonymous visitors have INSERT privileges for only the request ID and four answer columns. They have no SELECT, UPDATE, DELETE or TRUNCATE access, and cannot set timestamps. Read responses privately in the Supabase project Table Editor > demo_feedback. No secret or service-role key is used in this website.

## Email signup

Brevo stores email and explicit launch-update consent, separately from feedback. The existing Fintale signup form, list and confirmation template #5 remain active. The page only advances after Brevo's successful native form submission. The email address is never included in a page URL or sent to Supabase. Earlier feedback stored as Brevo contact attributes remains available there.

## Privacy and mobile

privacy.html identifies the project owner, contact address, providers, stored data and deletion choices. Signup fields appear above supporting artwork on phones. Textarea text is 16px and Next and Back actions are stacked. favicon.svg supplies the Fintale tab icon.

## Verification

Chapter progression, DOM preservation, image loading and mocked submission checks cover the main journey. Database grants and anonymous insertion were checked in a rolled-back SQL transaction. Final live submission verification is recorded in the owner setup guide.