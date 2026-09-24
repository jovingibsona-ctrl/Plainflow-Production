# Plainflow Production Blueprint

This package is the production-ready application foundation generated from the original Plainflow prototype.

## What is included
- Next.js + TypeScript web app
- Secure-by-design architecture notes
- Authentication/database API contracts
- Workflow model and risk policy
- OAuth integration contracts
- Worker/execution model
- Environment variable template
- Deployment and ownership checklist
- Original prototype preserved

## Critical limitation
This package does NOT contain real OAuth client secrets, database credentials, a production domain, or cloud-account ownership because those belong to the project owner and cannot be safely fabricated.

Real-time integrations become active only after the owner creates and connects their own provider accounts and supplies secrets through the deployment platform.

## Local development

1. Install Node.js 20+.
2. Copy `.env.example` to `.env.local`.
3. Install dependencies.
4. Run the development server.

The UI itself can run without external credentials; real integrations require provider setup.

## Ownership
Keep the Git repository, cloud account, database, domain, OAuth applications, and secret store under the owner's accounts. Never commit `.env.local`.
