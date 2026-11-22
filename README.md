# SkillBridge

A web app that matches unemployed youth in Kigali to jobs based on their skills. It shows the skills each job needs that a user doesn't have yet, and links to free courses to learn them.

## Features

**Job seekers**
- Sign up and log in
- Pick their skills
- See jobs ranked by match percentage
- See which skills they have and which they are missing, with free learning resources
- Apply for jobs and track applications

**Employers**
- Sign up and log in
- Post and edit jobs
- See candidates ranked by how well they match each job

## Tech stack

- Frontend: React (Vite)
- Backend: Node.js and Express
- Authentication: JWT and bcrypt
- Data: JSON file (`server/db.json`). MongoDB is planned next.

## How to run

Backend:

```
cd server
npm install
node index.js
```

Frontend (in a second terminal):

```
cd client
npm install
npm run dev
```

Open http://localhost:5173

## Demo accounts

Password for all accounts: `demo1234`

| Role | Email |
| --- | --- |
| Job seeker | seeker@demo.com |
| Employer | employer@demo.com |

## Project structure

```
skillbridge/
├── client/    React frontend
└── server/    Express API and sample data
```
