# Plainflow Security Architecture

## Trust boundary

The browser is untrusted. It may display workflows and request actions, but it must never be the final authority for permissions or secrets.

## Required production controls

1. Authentication with secure, HttpOnly sessions.
2. Authorization checks on every workflow and integration resource.
3. Server-side validation of every workflow action.
4. OAuth with least-privilege scopes.
5. Provider access tokens encrypted at rest.
6. No provider secrets in browser JavaScript.
7. Rate limiting on authentication, AI generation and execution endpoints.
8. Strict Content-Security-Policy and security headers.
9. Audit event for login, connection, workflow changes, approvals and executions.
10. Approval required for external communication, payments, deletion and other destructive actions.
11. Idempotency keys for actions that could be repeated.
12. Background workers with execution timeouts and retry limits.
13. Emergency global kill switch.
14. Database backups and recovery testing.
15. Dependency and secret scanning in CI.

## Security rule

AI output is data, not authority. The policy engine decides what can execute.
