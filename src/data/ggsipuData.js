import { ALL_DELHI_COLLEGES } from './collegesData';

export const UNIVERSAL_COLLEGES = ALL_DELHI_COLLEGES;
export { ALL_DELHI_COLLEGES };
export const GGSIPU_COLLEGES = ALL_DELHI_COLLEGES;

export const ACADEMIC_DISCIPLINES = [
  'Computer Science & Engineering (CSE)',
  'Information Technology (IT)',
  'Artificial Intelligence & Machine Learning (AIML)',
  'AI & Data Science (AIDS)',
  'Electronics & Communication (ECE)',
  'Electrical & Electronics (EEE)',
  'Mechanical & Automation (MAE/ME)',
  'Civil Engineering (CE)',
  'Management & Computer Applications (BBA/BCA/MCA)'
];

export const DEPARTMENTS = ACADEMIC_DISCIPLINES;

export const BLOOD_GROUPS = [
  'O+ positive',
  'O- negative',
  'A+ positive',
  'A- negative',
  'B+ positive',
  'B- negative',
  'AB+ positive',
  'AB- negative'
];

export const SEMESTERS = [
  '1st Semester (Year 1)',
  '2nd Semester (Year 1)',
  '3rd Semester (Year 2)',
  '4th Semester (Year 2)',
  '5th Semester (Year 3)',
  '6th Semester (Year 3)',
  '7th Semester (Year 4)',
  '8th Semester (Year 4)'
];

export const SECTIONS = [
  'CSE-A',
  'CSE-B',
  'CSE-C',
  'IT-1',
  'IT-2',
  'AIML-A',
  'AIML-B',
  'AIDS-1',
  'ECE-1',
  'ECE-2',
  'EEE-1',
  'MAE-1',
  'CE-1',
  'Section-1',
  'Section-2',
  'Morning Shift',
  'Evening Shift'
];

export const DESIGNATIONS = [
  'Head of Department & Professor',
  'Professor',
  'Associate Professor',
  'Assistant Professor (Senior Grade)',
  'Assistant Professor',
  'Visiting Faculty / Lecturer',
  'Lab In-Charge & Research Associate'
];

export const STAFF_UNITS = [
  'Campus Infrastructure & Maintenance',
  'Electrical & Power Systems',
  'Sanitation & Cleanliness Wing',
  'Emergency Medical Response Desk',
  'IT & Network Infrastructure',
  'Anti-Bullying & Campus Security Cell',
  'Student Welfare & Admission Desk'
];

export const SUPERVISOR_LEVELS = [
  'Lead Operations Supervisor',
  'Senior Technical Officer',
  'Field Operations Manager',
  'Shift Supervisor',
  'First Responder Lead',
  'Maintenance Officer'
];

export const TARGET_BRANCH_OPTIONS = [
  'All Campus Departments (Global)',
  'Computer Science & Engineering (CSE)',
  'Information Technology (IT)',
  'AI & Machine Learning (AIML)',
  'AI & Data Science (AIDS)',
  'Electronics & Communication (ECE)',
  'Electrical & Electronics (EEE)',
  'Mechanical & Civil Engineering',
  'First-Year Engineering (All Branches)',
  'Management & Computer Applications (BBA/BCA/MCA)'
];

// Comprehensive Branch & Semester Subject Mapping (Semesters 1-8 across all disciplines)
export const BRANCH_SEMESTER_SUBJECTS = {
  'Common First Year': {
    '1st Semester (Year 1)': [
      'Applied Mathematics-I (BS-101)',
      'Applied Physics-I (BS-103)',
      'Manufacturing Processes & Workshop (ES-105)',
      'Electrical Science & Circuits (ES-107)',
      'Fundamentals of Computing & C (CS-109)',
      'Applied Chemistry (BS-111)'
    ],
    '2nd Semester (Year 1)': [
      'Applied Mathematics-II (BS-102)',
      'Applied Physics-II (BS-104)',
      'Engineering Mechanics & Graphics (ES-106)',
      'Communication Skills & Ethics (HS-108)',
      'Data Structures in C++ (CS-110)',
      'Environmental Studies (ES-112)'
    ]
  },
  'Computer Science & Engineering (CSE)': {
    '1st Semester (Year 1)': ['Applied Mathematics-I', 'Applied Physics-I', 'Fundamentals of Computing & C', 'Electrical Science'],
    '2nd Semester (Year 1)': ['Applied Mathematics-II', 'Applied Physics-II', 'Data Structures in C++', 'Engineering Mechanics'],
    '3rd Semester (Year 2)': [
      'Data Structures & Algorithms (CSE-201)',
      'Object Oriented Programming in Java (CSE-203)',
      'Digital Electronics & Logic Design (EC-205)',
      'Discrete Mathematics & Structures (CS-207)',
      'Principles of Design Engineering (ES-209)'
    ],
    '4th Semester (Year 2)': [
      'Computer Organization & Architecture (CSE-202)',
      'Database Management Systems (CSE-204)',
      'Operating Systems & Kernel Arch (CSE-206)',
      'Theory of Computation & Automata (CS-208)',
      'Software Engineering & Agile Methodologies (CS-210)'
    ],
    '5th Semester (Year 3)': [
      'Design & Analysis of Algorithms (CSE-301)',
      'Computer Networks & IP Protocols (CSE-303)',
      'Web Technologies & Full Stack Dev (CSE-305)',
      'Microprocessors & Microcontrollers (EC-307)',
      'Cyber Law, Ethics & Intellectual Property (HS-309)'
    ],
    '6th Semester (Year 3)': [
      'Operating Systems Lab & System Programming (CSE-302)',
      'Compiler Design & Syntax Analysis (CSE-304)',
      'Cloud Computing & DevOps Architecture (CSE-306)',
      'Artificial Intelligence & Expert Systems (CSE-308)',
      'Information & Network Security (CSE-310)'
    ],
    '7th Semester (Year 4)': [
      'Machine Learning & Neural Networks (CSE-401)',
      'Distributed Systems & Parallel Computing (CSE-403)',
      'Big Data Analytics & Spark (CSE-405)',
      'Blockchain Technologies & Smart Contracts (CSE-407)',
      'Capstone Project Phase-I (CSE-409)'
    ],
    '8th Semester (Year 4)': [
      'Deep Learning & Natural Language Processing (CSE-402)',
      'Quantum Computing Foundations (CSE-404)',
      'Software Testing & Quality Assurance (CSE-406)',
      'Major Industry Internship & Capstone Project Phase-II (CSE-408)'
    ]
  },
  'Information Technology (IT)': {
    '1st Semester (Year 1)': ['Applied Mathematics-I', 'Applied Physics-I', 'Programming in C', 'Electrical Engineering'],
    '2nd Semester (Year 1)': ['Applied Mathematics-II', 'Data Structures in C++', 'Physics of Semiconductors', 'Engineering Graphics'],
    '3rd Semester (Year 2)': ['Data Structures with Python', 'Object Oriented Programming', 'Digital Systems', 'Discrete Structures'],
    '4th Semester (Year 2)': ['Relational DBMS & SQL', 'Computer Networks', 'Operating Systems', 'Software Engineering Principles'],
    '5th Semester (Year 3)': ['Information Storage & Management', 'Web Application Frameworks', 'Network Security', 'Mobile App Development'],
    '6th Semester (Year 3)': ['Cloud Computing Solutions', 'Data Warehousing & Data Mining', 'DevOps CI/CD Automation', 'E-Commerce & Cyber Security'],
    '7th Semester (Year 4)': ['Enterprise Cloud Architecture', 'Predictive Modeling & Big Data', 'Internet of Things (IoT)', 'IT Capstone Phase-I'],
    '8th Semester (Year 4)': ['Full Stack Cloud Deployment', 'Information Retrieval & Search Engines', 'Major Project & Viva']
  },
  'Artificial Intelligence & Machine Learning (AIML)': {
    '1st Semester (Year 1)': ['Applied Mathematics-I (Calculus & Linear Algebra)', 'Applied Physics-I', 'Python for Scientific Computing'],
    '2nd Semester (Year 1)': ['Applied Mathematics-II (Probability & Statistics)', 'Data Structures in Python', 'Digital Logic Design'],
    '3rd Semester (Year 2)': ['Linear Algebra for AI', 'Data Structures & Algorithms', 'Statistical Foundations of ML', 'Database Systems'],
    '4th Semester (Year 2)': ['Supervised & Unsupervised Machine Learning', 'Computer Vision Foundations', 'Design & Analysis of Algorithms', 'Operating Systems'],
    '5th Semester (Year 3)': ['Deep Learning & PyTorch', 'Natural Language Processing', 'Big Data Engineering', 'Reinforcement Learning'],
    '6th Semester (Year 3)': ['Generative AI & LLM Engineering', 'Autonomous Robotics & AI', 'Cloud AI Operations (MLOps)', 'Ethics & Explainable AI (XAI)'],
    '7th Semester (Year 4)': ['Advanced Cognitive Robotics', 'AI in Healthcare & FinTech', 'Research Seminar', 'AI Capstone Project-I'],
    '8th Semester (Year 4)': ['Production ML Deployment & Edge AI', 'Major Research Dissertation & Project']
  },
  'AI & Data Science (AIDS)': {
    '1st Semester (Year 1)': ['Applied Mathematics-I', 'Applied Physics-I', 'Python Programming', 'Engineering Science'],
    '2nd Semester (Year 1)': ['Probability & Statistics for Data Science', 'Data Structures', 'Applied Chemistry', 'Technical Communication'],
    '3rd Semester (Year 2)': ['Mathematical Foundations of Data Science', 'Advanced Python & R Programming', 'Database Systems & NoSQL', 'Data Wrangling'],
    '4th Semester (Year 2)': ['Exploratory Data Analysis', 'Statistical Inference', 'Data Structures & Algorithms', 'Operating Systems'],
    '5th Semester (Year 3)': ['Machine Learning Pipelines', 'Big Data Technologies (Hadoop/Spark)', 'Data Visualization & Tableau', 'Web Analytics'],
    '6th Semester (Year 3)': ['Deep Learning for Analytics', 'Time Series Analysis & Forecasting', 'Business Intelligence & Cloud ETL', 'Data Governance'],
    '7th Semester (Year 4)': ['Scalable Machine Learning', 'Social Media & Graph Analytics', 'Data Science Capstone-I', 'Industry Elective'],
    '8th Semester (Year 4)': ['AI in Enterprise Automation', 'Data Product Management & Capstone Project-II']
  },
  'Electronics & Communication (ECE)': {
    '1st Semester (Year 1)': ['Applied Mathematics-I', 'Applied Physics-I', 'Basic Electrical Engineering', 'Engineering Drawing'],
    '2nd Semester (Year 1)': ['Applied Mathematics-II', 'Applied Chemistry', 'Programming in C', 'Electronic Devices & Components'],
    '3rd Semester (Year 2)': ['Analog Electronic Circuits', 'Digital Electronics', 'Network Analysis & Synthesis', 'Signals & Systems', 'Electromagnetic Field Theory'],
    '4th Semester (Year 2)': ['Analog Communications', 'Linear Integrated Circuits & Op-Amps', 'Microprocessors & 8086 Assembly', 'Control Systems Engineering'],
    '5th Semester (Year 3)': ['Digital Signal Processing (DSP)', 'Digital Communication Systems', 'VLSI Design & Verilog HDL', 'Antenna & Wave Propagation'],
    '6th Semester (Year 3)': ['Microwave & Radar Engineering', 'Embedded Systems & ARM Architecture', 'Wireless & Mobile Communications', 'Optical Fiber Communication'],
    '7th Semester (Year 4)': ['Cellular 5G/6G Networks', 'Satellite Communication & Navigation', 'IoT Sensor Networks', 'Major Project Phase-I'],
    '8th Semester (Year 4)': ['Radar & Sonar Systems', 'Biomedical Electronics', 'Major Project & Industry Internship']
  },
  'Electrical & Electronics (EEE)': {
    '1st Semester (Year 1)': ['Applied Mathematics-I', 'Applied Physics-I', 'Electrical Science', 'Engineering Mechanics'],
    '2nd Semester (Year 1)': ['Applied Mathematics-II', 'Electrical Circuits', 'Programming & Problem Solving', 'Applied Chemistry'],
    '3rd Semester (Year 2)': ['Electrical Machines-I (Transformers & DC)', 'Analog Electronics', 'Circuit Theory & Analysis', 'Electromagnetic Fields'],
    '4th Semester (Year 2)': ['Electrical Machines-II (Induction & Synchronous)', 'Power Systems-I (Generation & Transmission)', 'Digital Electronics', 'Control Engineering'],
    '5th Semester (Year 3)': ['Power Electronics & Drives', 'Power Systems-II (Analysis & Faults)', 'Microcontrollers & PLC Automation', 'Renewable Energy Systems'],
    '6th Semester (Year 3)': ['Electric Vehicle Powertrain & Battery Tech', 'Switchgear & Power Protection', 'High Voltage Engineering', 'Smart Grid Infrastructure'],
    '7th Semester (Year 4)': ['Industrial Automation & SCADA', 'Power Quality & Energy Auditing', 'Project Phase-I'],
    '8th Semester (Year 4)': ['Utilization of Electrical Energy', 'Major Capstone Project & Internship']
  },
  'Mechanical & Automation (MAE/ME)': {
    '1st Semester (Year 1)': ['Applied Mathematics-I', 'Applied Physics-I', 'Engineering Mechanics', 'Workshop Technology'],
    '2nd Semester (Year 1)': ['Applied Mathematics-II', 'Engineering Drawing & CAD', 'Thermodynamics Foundations', 'Materials Science'],
    '3rd Semester (Year 2)': ['Strength of Materials', 'Fluid Mechanics & Hydraulic Machinery', 'Kinematics of Machines', 'Manufacturing Technology-I'],
    '4th Semester (Year 2)': ['Dynamics of Machines & Vibrations', 'Applied Thermodynamics & IC Engines', 'Machining Science & Machine Tools', 'Metrology & Instrumentation'],
    '5th Semester (Year 3)': ['Heat & Mass Transfer', 'Design of Machine Elements', 'Automobile Engineering', 'Industrial Management'],
    '6th Semester (Year 3)': ['Robotics & Mechatronics Systems', 'CNC Machining & CAM', 'Refrigeration & Air Conditioning (HVAC)', 'Fluid Power Systems'],
    '7th Semester (Year 4)': ['CAD/CAM/CAE Simulation', 'Additive Manufacturing & 3D Printing', 'MAE Project Phase-I'],
    '8th Semester (Year 4)': ['Supply Chain & Quality Control (Six Sigma)', 'Major Capstone Project & Industry Training']
  },
  'Civil Engineering (CE)': {
    '1st Semester (Year 1)': ['Applied Mathematics-I', 'Applied Physics-I', 'Engineering Mechanics', 'Environmental Science'],
    '2nd Semester (Year 1)': ['Applied Mathematics-II', 'Engineering Chemistry', 'Civil Engineering Materials & Surveying', 'Engineering Graphics'],
    '3rd Semester (Year 2)': ['Solid Mechanics & Strength of Materials', 'Fluid Mechanics & Open Channel Flow', 'Advanced Surveying & Geomatics', 'Building Construction & Architecture'],
    '4th Semester (Year 2)': ['Structural Analysis-I', 'Soil Mechanics & Geotechnical Engineering', 'Hydrology & Water Resource Engineering', 'Concrete Technology'],
    '5th Semester (Year 3)': ['Design of Reinforced Concrete Structures (RCC)', 'Transportation Engineering (Highways/Airports)', 'Environmental Engineering (Water Treatment)', 'Geotechnical Foundation Engineering'],
    '6th Semester (Year 3)': ['Design of Steel Structures', 'Wastewater Treatment & Solid Waste Management', 'Irrigation Engineering', 'Estimation, Costing & Valuation'],
    '7th Semester (Year 4)': ['Earthquake Engineering & Disaster Resilience', 'Construction Planning & Project Management', 'Civil Capstone Project Phase-I'],
    '8th Semester (Year 4)': ['Bridge & Tunnel Engineering', 'GIS & Remote Sensing Applications', 'Major Project Phase-II']
  },
  'Management & Computer Applications (BBA/BCA/MCA)': {
    '1st Semester (Year 1)': ['Principles of Management & Organization', 'Business Mathematics & Statistics', 'Programming in C / Python', 'Financial Accounting'],
    '2nd Semester (Year 1)': ['Marketing Management', 'Database Systems & SQL', 'Data Structures & Object-Oriented Principles', 'Business Economics'],
    '3rd Semester (Year 2)': ['Human Resource Management', 'Web Development & Scripting', 'Software Engineering & Agile', 'Corporate Finance'],
    '4th Semester (Year 2)': ['Management Information Systems (MIS)', 'Operating Systems & Linux Admin', 'Business Law & Corporate Ethics', 'Quantitative Techniques'],
    '5th Semester (Year 3)': ['Strategic Management & Entrepreneurship', 'E-Commerce & Digital Marketing', 'Java Enterprise & Cloud Apps', 'Business Analytics'],
    '6th Semester (Year 3)': ['Big Data for Managers', 'Cyber Law & IT Security', 'Mobile Computing', 'Capstone Management Project'],
    '7th Semester (Year 4)': ['Enterprise Resource Planning (ERP)', 'Advanced AI for Business Applications', 'MCA Project Phase-I'],
    '8th Semester (Year 4)': ['FinTech & Blockchain Economics', 'Major Master Thesis & Project Defense']
  }
};

export const getSubjectsForBranchAndSemester = (branch, semester) => {
  if (!branch || !semester) return [];
  
  // First year common subjects check
  if (semester === '1st Semester (Year 1)' || semester === '2nd Semester (Year 1)') {
    if (BRANCH_SEMESTER_SUBJECTS['Common First Year']?.[semester]) {
      return BRANCH_SEMESTER_SUBJECTS['Common First Year'][semester];
    }
  }

  const branchKey = Object.keys(BRANCH_SEMESTER_SUBJECTS).find(b => 
    branch.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(branch.toLowerCase())
  );

  if (branchKey && BRANCH_SEMESTER_SUBJECTS[branchKey]?.[semester]) {
    return BRANCH_SEMESTER_SUBJECTS[branchKey][semester];
  }

  // Fallback to CSE semester list
  return BRANCH_SEMESTER_SUBJECTS['Computer Science & Engineering (CSE)'][semester] || [
    `${branch.split('(')[0].trim()} Core Lecture Module`,
    `${branch.split('(')[0].trim()} Advanced Practical Lab`,
    'Engineering Mathematics & Applied Analysis',
    'Research Seminar & Case Study'
  ];
};


