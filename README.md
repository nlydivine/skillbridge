
# SkillBridge

A web app that helps unemployed youth in Kigali find jobs that match their skills. It shows the skills a job needs that a user does not have yet, and links to free courses to learn them. The app works in English and Kinyarwanda.

## Live app

**https://skillbridge-sv08.onrender.com**

The app runs on a free server, so the first load can take up to one minute while it wakes up. Please wait and do not refresh.

## How to log in

Use one of the demo accounts below. The password for both is `demo1234`.

| Role | Email | Password |
| --- | --- | --- |
| Job seeker | seeker@demo.com | demo1234 |
| Employer | employer@demo.com | demo1234 |

You can also create your own account. Click **New here? Sign up**, choose **I am a job seeker** or **I am an employer**, fill in the form, and click **Sign up**.

Use the **EN** and **RW** buttons to switch between English and Kinyarwanda.

## Features

**Job seekers:** sign up and log in, choose skills, see jobs ranked by match percentage, see which skills they have and which are missing, get free learning resources for each missing skill, apply for jobs, track applications.

**Employers:** sign up and log in, post jobs, edit jobs, see candidates ranked by match percentage.

**Everyone:** switch the app between English and Kinyarwanda.

## Tech stack

- Frontend: React with Vite
- Backend: Node.js and Express
- Authentication: JWT and bcrypt
- Data: JSON file (`server/db.json`). MongoDB is planned as the next step.

## Run it on your computer, step by step

### Step 1. Install the tools

1. Install Node.js version 18 or newer from https://nodejs.org
2. Install Git from https://git-scm.com
3. Open a terminal and check both are installed:

```
node -v
git --version
```

Each command should print a version number.

### Step 2. Download the project

```
git clone https://github.com/nlydivine/skillbridge.git
cd skillbridge
```

### Step 3. Start the backend

```
cd server
npm install
node index.js
```

You should see `API running on port 4000`. Leave this terminal open. The backend must keep running.

### Step 4. Start the frontend

1. Open a **second** terminal.
2. Go to the project folder you downloaded in Step 2, then run:

```
cd client
npm install
npm run dev
```

You should see a link like `http://localhost:5173`.

### Step 5. Open the app

1. Open http://localhost:5173 in your browser.
2. Log in with a demo account from the table above, or sign up.
3. Use the EN and RW buttons to change the language.

### Step 6. Stop the app

Click each terminal and press `Ctrl+C`.

## Troubleshooting

- **"Network error" when logging in:** the backend is not running. Do Step 3 again and keep that terminal open.
- **"Port already in use":** another program is using port 4000 or 5173. Close it, or stop the old terminal with `Ctrl+C`, and start again.
- **`npm: command not found`:** Node.js is not installed. Do Step 1 again.
- **Live app loads slowly the first time:** the free server is waking up. Wait one minute.

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
```

