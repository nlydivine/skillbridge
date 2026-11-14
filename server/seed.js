const skills = [
  ["html-css", "HTML/CSS"], ["javascript", "JavaScript"], ["react", "React"], ["git", "Git"],
  ["excel", "Microsoft Excel"], ["data-entry", "Data entry"], ["customer-service", "Customer service"],
  ["communication", "Communication"], ["teamwork", "Teamwork"], ["sales", "Sales"],
  ["english", "English speaking"], ["time-management", "Time management"],
].map(([id, name]) => ({ id, name }));

const resources = [
  ["html-css", "Responsive Web Design", "freeCodeCamp", "https://www.freecodecamp.org/"],
  ["javascript", "JavaScript Algorithms and Data Structures", "freeCodeCamp", "https://www.freecodecamp.org/"],
  ["react", "Front End Development Libraries", "freeCodeCamp", "https://www.freecodecamp.org/"],
  ["git", "Introduction to Git and GitHub", "Coursera", "https://www.coursera.org/"],
  ["excel", "Excel basics", "Microsoft Learn", "https://learn.microsoft.com/training/"],
  ["data-entry", "Data entry skills", "Alison", "https://alison.com/"],
  ["customer-service", "Customer service basics", "HubSpot Academy", "https://academy.hubspot.com/"],
  ["communication", "Effective communication", "Alison", "https://alison.com/"],
  ["teamwork", "Working in teams", "Coursera", "https://www.coursera.org/"],
  ["sales", "Sales fundamentals", "HubSpot Academy", "https://academy.hubspot.com/"],
  ["english", "English for the workplace", "Alison", "https://alison.com/"],
  ["time-management", "Time management", "Google Digital Garage", "https://learndigital.withgoogle.com/digitalgarage"],
].map(([skillId, title, provider, link], i) => ({ id: "r" + (i + 1), skillId, title, provider, link }));

const people = [
  ["u1", "Demo Job Seeker", "seeker@demo.com", "jobseeker", ["html-css", "javascript", "communication", "teamwork"]],
  ["u2", "Aline Demo", "aline@demo.com", "jobseeker", ["html-css", "javascript", "react", "git", "communication"]],
  ["u3", "Eric Demo", "eric@demo.com", "jobseeker", ["customer-service", "communication", "english"]],
  ["e1", "Demo Employer", "employer@demo.com", "employer", "Sample Company"],
];

const jobs = [
  ["j1", "Junior web developer", "Kigali", "e1", ["html-css", "javascript", "react", "git"]],
  ["j2", "Customer service agent", "Kigali", "e1", ["customer-service", "communication", "english", "teamwork"]],
  ["j3", "Data entry clerk", "Kigali", "e1", ["data-entry", "excel", "time-management"]],
  ["j4", "Sales associate", "Kigali", "e1", ["sales", "customer-service", "communication", "teamwork"]],
];

module.exports = { skills, resources, people, jobs };

