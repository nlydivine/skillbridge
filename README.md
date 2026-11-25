# SkillBridge

A web app that helps unemployed youth in Kigali find jobs that match their skills. It shows the skills a job needs that a user does not have yet, and links to free courses to learn them.

## Live app

- Frontend: https://skillbridge-sv08.onrender.com
- Backend API: https://skillbridge-api-3212.onrender.com

The app runs on a free server, so the first load can take up to one minute while it wakes up.

## Demo accounts

Password for both accounts: `demo1234`

| Role | Email |
| --- | --- |
| Job seeker | seeker@demo.com |
| Employer | employer@demo.com |

You can also sign up with a new account and choose a role.

## Features

**Job seekers:** sign up and log in, choose skills, see jobs ranked by match percentage, see which skills they have and which are missing, get free learning resources for each missing skill, apply for jobs, track applications.

**Employers:** sign up and log in, post jobs, edit jobs, see candidates ranked by match percentage.

## Tech stack

- Frontend: React with Vite
- Backend: Node.js and Express
- Authentication: JWT and bcrypt
- Data: JSON file (`server/db.json`). MongoDB is planned as the next step.

## Run it on your computer

You need Node.js 18 or newer and Git.

1. Clone the repository and open it:

```
git clone https://github.com/nlydivine/skillbridge.git
cd skillbridge
```

2. Install and start the backend:

```
cd server
npm install
node index.js
```

You should see `API running on port 4000`. Leave this terminal open.

3. Open a second terminal. Install and start the frontend:

```
cd skillbridge/client
npm install
npm run dev
```

Use the path to the folder where you cloned the project.

4. Open http://localhost:5173 in your browser.

5. Log in with a demo account from the table above.

## Deployment

Backend (Render Web Service):

- Root directory: `server`
- Build command: `npm install`
- Start command: `node index.js`
- Environment variable: `JWT_SECRET` (any long secret text)

Frontend (Render Static Site):

- Root directory: `client`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_URL` set to the backend link followed by `/api`

## Project structure

```
skillbridge/
├── client/    React frontend
└── server/    Express API and sample data

