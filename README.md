\# Profit-Loss Distribution System



A hierarchical profit \& loss distribution system where users are organized as \*\*Admin → Manager → Agent → Client\*\*.  

Each user can have a defined \*\*share percentage\*\* that determines how profits or losses are distributed when a transaction occurs.



---



\## Features



\### Backend

\- Record transactions (profit/loss) for clients.

\- Compute and store derived shares for Admin, Manager, and Agent.

\- Fetch current balance and share percentage for all users.

\- API endpoints:

&nbsp; - `GET /api/users` → List all users.

&nbsp; - `GET /api/users/:id/balance` → Get user balance.

&nbsp; - `PUT /api/users/:id/share` → Update share percentage for a user.

&nbsp; - `POST /api/transactions` → Record a profit/loss transaction.

&nbsp; - `GET /api/transactions/:id` → Fetch transactions by user.



\### Frontend

\- Display \*\*User Balances\*\* with roles and share percentages.

\- \*\*Transaction Form\*\* for recording profit or loss for a client.

\- \*\*User Hierarchy View\*\* to select a parent user.

\- \*\*Share Setting Form\*\* to update share percentages of downline users (Admin / Manager / Agent only).

\- Real-time updates on share changes and transactions.



---



\## Database (Supabase / Postgres)



\### Users Table

| Column        | Type       | Description                      |

|---------------|-----------|----------------------------------|

| id            | serial    | Primary key                       |

| name          | varchar   | User name                          |

| role          | varchar   | admin / manager / agent / client |

| parent\_id     | int       | User's parent in hierarchy        |

| balance       | numeric   | Current balance                   |

| share\_percent | numeric   | Share percentage for profit/loss |



\### Transactions Table

| Column       | Type       | Description                        |

|--------------|-----------|------------------------------------|

| id           | serial    | Primary key                         |

| client\_id    | int       | Client participating in transaction |

| stake\_amount | numeric   | Amount staked                       |

| profit\_loss  | numeric   | Calculated profit or loss           |

| result\_type  | varchar   | "profit" or "loss"                  |

| created\_at   | timestamp | Transaction timestamp               |



---



\## Environment Variables



Create a `.env` file in the project root:



```env

DATABASE\_URL=postgresql://postgres:I69J6bZyfQewWjoh@db.qcabywzrxfmbjhrzzqqj.supabase.co:5432/postgres

PORT=5000



\# Optional for frontend Supabase usage

NEXT\_PUBLIC\_SUPABASE\_URL=https://<your-supabase-project-id>.supabase.co

NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=<your-supabase-anon-key>



