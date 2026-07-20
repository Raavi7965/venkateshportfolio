// Central data store — admin panel reads/writes this via localStorage and API fallback
export const DEFAULT_DATA = {
  hero: {
    name: "Venkatesh Raavi",
    role: "Developer",
    tagline: "Building scalable, user-friendly software",
    desc: "Hi, I'm Venkatesh Raavi — a passionate developer with a strong foundation in React Native and Java. I build scalable, user-friendly applications and solve real-world problems through code.",
    photo: "/placeholder-profile.svg",
    github: "https://github.com/Raavi7965",
    linkedin: "https://www.linkedin.com/in/raavivenkatesh/",
    email: "venkiravi796@gmail.com",
    s1n: "5+", s1l: "Certifications",
    s2n: "2+", s2l: "Projects Built",
    s3n: "9+", s3l: "Technologies",
    avail: "Available for Opportunities",
    availsub: "Full-Time · Fresher · Available Now",
  },
  skills: [
    { ico: "🌐", name: "HTML5", pct: 90 },
    { ico: "⚡", name: "JavaScript", pct: 80 },
    { ico: "⚛️", name: "React.js", pct: 82 },
    { ico: "🐍", name: "Python", pct: 70 },
    { ico: "☕", name: "Java", pct: 78 },
    { ico: "🗄️", name: "MySQL", pct: 72 },
    { ico: "🍃", name: "MongoDB", pct: 68 },
    { ico: "🔧", name: "Git", pct: 80 },
    { ico: "☁️", name: "AWS", pct: 62 },
  ],
  exp: [{
    logoText: "FI",
    company: "Futur Interns · IT Services",
    role: "Java Full Stack Intern",
    period: "July 2025 – August 2025",
    type: "Remote",
    bullets: [
      "Built scalable web applications using Java Full Stack technologies.",
      "Developed frontend interfaces with React.js and backend services in Java.",
      "Presented project results to leadership and received positive feedback.",
    ],
  }],
  projects: [
    {
      num: "01",
      title: "TripTrek",
      desc: "A responsive TripTrek Home Page replica featuring post feeds, AllTours, MyBookings, Contribute, and Group Adventure Planning.",
      img: "/placeholder-project.svg",
      tags: "React.js, Responsive Design, UI/UX",
    },
    {
      num: "02",
      title: "AllTours Forum",
      desc: "A fully responsive and interactive Forum UI screen. Browse, search, post questions, add answers, and like/dislike answers.",
      img: "/placeholder-project.svg",
      tags: "React.js, Real-time Search, Forum UI",
    },
  ],
  certs: [
    { name: "AWS Cloud Practitioner", issuer: "Amazon Web Services", img: "/placeholder-certificate.svg" },
    { name: "Full Stack Web Development", issuer: "Certified Program", img: "/placeholder-certificate.svg" },
    { name: "Data Science Professional", issuer: "IBM", img: "/placeholder-certificate.svg" },
    { name: "Programming in Java", issuer: "NPTEL", img: "/placeholder-certificate.svg" },
    { name: "Certified Software Programmer", issuer: "Infosys", img: "/placeholder-certificate.svg" },
  ],
  edu: [
    { year: "2026", degree: "B.Tech in Data Science", school: "Malla Reddy University", desc: "Focused on programming, data analysis, and software development." },
    { year: "2022", degree: "Class 12 — MPC", school: "Sri Chaitanya", desc: "Built strong interest in computing through Mathematics, Physics, and Chemistry." },
    { year: "2020", degree: "Class 10", school: "Universal High School", desc: "Developed problem-solving mindset and core academic foundation." },
  ],
  about: {
    bio1: "I am Venkatesh Raavi, a 22-year-old Full Stack Developer from Ongole, Andhra Pradesh, India.",
    bio2: "My expertise spans React.js for frontend, Java for backend services, and cloud deployment on AWS.",
    bio3: "Currently open to full-time opportunities. I bring a fresher's energy with a professional commitment to quality.",
    city: "Ongole, AP",
    age: "22 Years",
    gender: "Male",
    nationality: "Indian",
    langs: "Telugu, English, Hindi",
    explevel: "Fresher",
    availability: "Full-Time ✓",
    phone: "+91 9110353818",
  },
  contact: {
    phone: "+91 9110353818",
    email: "venkiravi796@gmail.com",
    address: "Inkollu, Bapatala, Andhra Pradesh",
    status: "Available for Work",
  },
};

const STORAGE_KEY = "vr_portfolio_data";
const API_URL = import.meta.env.VITE_API_URL || "";

function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function mergeWithDefaults(saved) {
  if (!isObject(saved)) return JSON.parse(JSON.stringify(DEFAULT_DATA));
  return {
    ...JSON.parse(JSON.stringify(DEFAULT_DATA)),
    ...saved,
    hero: { ...JSON.parse(JSON.stringify(DEFAULT_DATA.hero)), ...(saved.hero || {}) },
    about: { ...JSON.parse(JSON.stringify(DEFAULT_DATA.about)), ...(saved.about || {}) },
    contact: { ...JSON.parse(JSON.stringify(DEFAULT_DATA.contact)), ...(saved.contact || {}) },
  };
}

export async function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return mergeWithDefaults(JSON.parse(saved));
  } catch (_) {}

  const endpoint = API_URL ? `${API_URL}/api/portfolio` : "/api/portfolio";
  try {
    const response = await fetch(endpoint);
    if (response.ok) {
      const payload = await response.json();
      if (payload && payload.ok === false) {
        return JSON.parse(JSON.stringify(DEFAULT_DATA));
      }
      if (payload && payload.data) {
        return mergeWithDefaults(payload.data);
      }
      if (payload && !payload.ok) {
        return mergeWithDefaults(payload);
      }
    }
  } catch (_) {}

  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

export async function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  const endpoint = API_URL ? `${API_URL}/api/portfolio` : "/api/portfolio";
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to save portfolio data to server", error);
    return null;
  }
}

export function resetData() {
  localStorage.removeItem(STORAGE_KEY);
}