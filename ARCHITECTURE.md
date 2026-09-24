# Plainflow Production Architecture

Browser / Next.js
        |
        v
Authenticated API
        |
        +---- PostgreSQL
        |
        +---- Policy / Permission Engine
        |
        +---- AI Workflow Parser
        |
        +---- Job Queue
                 |
                 v
              Workers
                 |
       +---------+---------+
       |         |         |
     Gmail     Slack     Google APIs

Every action:
request -> validate -> authorize -> approval (if required) -> execute -> audit

The browser never receives provider client secrets or long-lived access tokens.
