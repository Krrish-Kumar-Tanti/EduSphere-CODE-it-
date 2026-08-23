// Universal Higher Education Technical Curriculum & Department Timetable Engine

export const ACADEMIC_DEPARTMENTS = [
  'Computer Science & Engineering (CSE)',
  'Information Technology (IT)',
  'Artificial Intelligence & Data Science (AI & DS)',
  'Software Engineering (SE)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical Engineering (EE)',
  'Mechanical & Automation Engineering (MAE)',
  'Civil & Environmental Engineering (CEE)'
];

export const SEMESTER_LIST = [
  '1st Semester (Year 1)',
  '2nd Semester (Year 1)',
  '3rd Semester (Year 2)',
  '4th Semester (Year 2)',
  '5th Semester (Year 3)',
  '6th Semester (Year 3)',
  '7th Semester (Year 4)',
  '8th Semester (Year 4)'
];

export const DEPARTMENT_CURRICULUM = {
  'Computer Science & Engineering (CSE)': {
    '1st Semester': [
      { code: 'MATH-101', name: 'Applied Mathematics - I (Calculus & Linear Algebra)', credits: '4 (3-1-0)', units: ['Calculus & Mean Value', 'Linear Algebra & Matrices', 'Multivariable Functions', 'Vector Calculus'] },
      { code: 'PHYS-102', name: 'Applied Physics & Quantum Mechanics', credits: '4 (3-0-2)', units: ['Relativity & Optics', 'Quantum Mechanics Foundations', 'Semiconductor Physics', 'Laser & Fiber Optics'] },
      { code: 'ELEC-103', name: 'Basic Electrical & Electronics Engineering', credits: '4 (3-0-2)', units: ['DC Circuits & Theorems', 'AC Single & Polyphase', 'Diodes & BJT Basics', 'Digital Logic Foundations'] },
      { code: 'PROG-104', name: 'Programming Fundamentals in C/C++', credits: '4 (3-0-2)', units: ['Control Flow & Functions', 'Arrays & Pointers', 'Structures & Unions', 'File I/O & Dynamic Memory'] }
    ],
    '2nd Semester': [
      { code: 'MATH-105', name: 'Applied Mathematics - II (Differential Equations)', credits: '4 (3-1-0)', units: ['Ordinary Diff Equations', 'Partial Diff Equations', 'Complex Variables', 'Laplace & Fourier Transforms'] },
      { code: 'CHEM-106', name: 'Applied Chemistry & Materials Science', credits: '4 (3-0-2)', units: ['Thermodynamics & Kinetics', 'Polymers & Nanomaterials', 'Corrosion Science', 'Spectroscopy & Instrumental Analysis'] },
      { code: 'DS-107', name: 'Data Structures & Algorithms', credits: '4 (3-0-2)', units: ['Stacks, Queues, Linked Lists', 'Trees & Binary Search Trees', 'Graphs & Traversals', 'Sorting, Searching & Hashing'] },
      { code: 'ENGG-108', name: 'Engineering Graphics & CAD Modeling', credits: '3 (1-0-4)', units: ['Orthographic Projections', 'Isometric Views', 'Section of Solids', 'AutoCAD 2D/3D Modeling'] }
    ],
    '3rd Semester': [
      { code: 'CSE-301', name: 'Operating System Design (OS)', credits: '4 (3-1-0)', units: ['Process Management & Threads', 'CPU Scheduling & Synchronization', 'Deadlocks & Prevention', 'Virtual Memory & Page Replacement'] },
      { code: 'CSE-303', name: 'Object Oriented Software Design (OOPS)', credits: '4 (3-1-0)', units: ['Core OOP & UML Diagrams', 'Inheritance & Polymorphism', 'Design Patterns (GoF)', 'Exception Handling & Modern C++/Java'] },
      { code: 'CSE-305', name: 'Design & Analysis of Algorithms (DAA)', credits: '4 (3-1-0)', units: ['Asymptotic Analysis & Recurrences', 'Divide & Conquer, Greedy Strategies', 'Dynamic Programming Paradigms', 'Graph Algorithms & NP-Completeness'] },
      { code: 'CSE-307', name: 'Software Engineering & Agile Methodologies', credits: '4 (3-1-0)', units: ['Agile, Scrum & SDLC Models', 'Requirements Engineering & SRS', 'Software Architectural Patterns', 'Testing Strategies & CI/CD Pipelines'] },
      { code: 'ECE-309', name: 'Digital Logic & Circuit Design (DLCD)', credits: '4 (3-0-2)', units: ['Boolean Algebra & Karnaugh Maps', 'Combinational Circuit Design', 'Sequential Circuits & Flip-Flops', 'Registers, Counters & FSM Design'] },
      { code: 'MATH-311', name: 'Discrete Mathematics (DM)', credits: '4 (3-1-0)', units: ['Set Theory & Relations', 'Propositional & Predicate Logic', 'Combinatorics & Recurrences', 'Graph Theory & Trees'] }
    ],
    '4th Semester': [
      { code: 'CSE-401', name: 'Database Management Systems (DBMS)', credits: '4 (3-0-2)', units: ['ER Modeling & Relational Algebra', 'SQL, Joins & Normalization (1NF-BCNF)', 'Transaction Management & ACID', 'Indexing, B-Trees & Concurrency Control'] },
      { code: 'CSE-403', name: 'Computer System Architecture (CSA)', credits: '4 (3-1-0)', units: ['Instruction Set Architectures (RISC/CISC)', 'Pipelining & Hazard Resolution', 'Memory Hierarchy & Cache Coherence', 'I/O Interfacing & Multiprocessors'] },
      { code: 'CSE-405', name: 'Theory of Computation & Automata', credits: '4 (3-1-0)', units: ['Finite Automata & Regular Expressions', 'Context-Free Grammars & Pushdown Automata', 'Turing Machines & Decidability', 'Computational Complexity Classes'] },
      { code: 'CSE-407', name: 'Microprocessors & Embedded Systems', credits: '4 (3-0-2)', units: ['8086/ARM Architecture & Pinouts', 'Assembly Language Programming', 'Interrupt Controllers', 'Peripheral Interfacing & Timers'] }
    ],
    '5th Semester': [
      { code: 'CSE-501', name: 'Computer Networks & Internet Protocols', credits: '4 (3-0-2)', units: ['OSI & TCP/IP Protocol Stacks', 'Data Link Protocols & Ethernet', 'IP Addressing, Subnetting & Routing', 'TCP Congestion Control & Sockets'] },
      { code: 'CSE-503', name: 'Compiler Design & Construction', credits: '4 (3-0-2)', units: ['Lexical Analysis & Lex Tools', 'Syntax Analysis (LL/LR Parsers)', 'Intermediate Code Generation', 'Code Optimization & Register Allocation'] },
      { code: 'CSE-505', name: 'Artificial Intelligence & Expert Systems', credits: '4 (3-1-0)', units: ['State Space Search & A* Search', 'Knowledge Representation & Logic', 'Game Playing & Minimax Alpha-Beta', 'Machine Learning Foundations'] },
      { code: 'CSE-507', name: 'Cloud Computing & Distributed Systems', credits: '4 (3-0-2)', units: ['Virtualization & Hypervisors', 'IaaS, PaaS, SaaS Architectures', 'Docker Containers & Kubernetes', 'AWS / Azure Serverless Computing'] }
    ],
    '6th Semester': [
      { code: 'CSE-601', name: 'Machine Learning & Statistical Pattern Recognition', credits: '4 (3-0-2)', units: ['Supervised Learning & Regression', 'SVMs, Decision Trees & Ensembles', 'Unsupervised Clustering & PCA', 'Neural Networks & Gradient Descent'] },
      { code: 'CSE-603', name: 'Information & Network Security Cryptography', credits: '4 (3-1-0)', units: ['Classical & Modern Cryptography', 'RSA, AES, SHA-256 Algorithms', 'Authentication Protocols & PKI', 'Firewalls, IDS & Zero-Trust Architecture'] },
      { code: 'CSE-605', name: 'Big Data Analytics & Distributed Compute', credits: '4 (3-0-2)', units: ['Hadoop Ecosystem & HDFS', 'MapReduce Programming Paradigm', 'Apache Spark RDDs & DataFrames', 'NoSQL Databases (MongoDB/Cassandra)'] }
    ],
    '7th Semester': [
      { code: 'CSE-701', name: 'Deep Learning & Neural Architectures', credits: '4 (3-0-2)', units: ['CNNs & Computer Vision', 'RNNs, LSTMs & Sequence Models', 'Transformers & Attention Mechanisms', 'Generative Adversarial Networks (GANs)'] },
      { code: 'CSE-703', name: 'Distributed Ledger & Blockchain Engineering', credits: '4 (3-0-2)', units: ['Consensus Algorithms (Raft/Paxos)', 'Distributed Hash Tables & P2P', 'Smart Contracts & Solidity', 'DeFi & Web3 Architectures'] }
    ],
    '8th Semester': [
      { code: 'CSE-801', name: 'Natural Language Processing & Large Language Models', credits: '4 (3-0-2)', units: ['Tokenization & Embeddings (Word2Vec)', 'BERT, GPT & LLM Architectures', 'Retrieval-Augmented Generation (RAG)', 'Fine-Tuning & Alignment (RLHF)'] },
      { code: 'CSE-803', name: 'Major Engineering Capstone Project Phase-II', credits: '8 (0-0-16)', units: ['Full System Implementation', 'Benchmarking & Performance Evaluation', 'Research Paper Publishing', 'Final Viva Voce'] }
    ]
  },
  'Information Technology (IT)': {
    '3rd Semester': [
      { code: 'IT-301', name: 'Data Structures & Algorithms', credits: '4 (3-0-2)', units: ['Linear Structures', 'Non-linear Trees', 'Graph Algorithms', 'Hashing Techniques'] },
      { code: 'IT-303', name: 'Object Oriented Programming with Java', credits: '4 (3-0-2)', units: ['Java Core Concepts', 'Multithreading & Concurrency', 'Collections Framework', 'GUI & Event Handling'] },
      { code: 'IT-305', name: 'Digital Electronics & Microprocessors', credits: '4 (3-0-2)', units: ['Combinational Logic', 'Sequential Circuits', 'Microprocessor Architecture', 'Memory Interfacing'] },
      { code: 'IT-307', name: 'Principles of Communication Systems', credits: '4 (3-1-0)', units: ['Analog Modulation', 'Digital Modulation', 'Information Theory', 'Wireless Channels'] }
    ]
  },
  'Artificial Intelligence & Data Science (AI & DS)': {
    '3rd Semester': [
      { code: 'AI-301', name: 'Foundations of Data Science & Python', credits: '4 (3-0-2)', units: ['NumPy & Pandas Processing', 'Statistical Distributions', 'Data Visualization', 'Exploratory Data Analysis'] },
      { code: 'AI-303', name: 'Data Structures with Python & C++', credits: '4 (3-0-2)', units: ['Abstract Data Types', 'Trees & Balanced BSTs', 'Graph Algorithms', 'Spatial Indexing'] },
      { code: 'AI-305', name: 'Linear Algebra & Optimization for ML', credits: '4 (3-1-0)', units: ['Matrix Decompositions (SVD)', 'Eigenvalues & Eigenvectors', 'Convex Optimization', 'Gradient Descent Methods'] }
    ]
  }
};

// Universal Subject Getter
export function getSubjectsList(department = 'Computer Science & Engineering (CSE)', semester = '3rd Semester (Year 2)') {
  const normDept = department.includes('CSE') || department.includes('Computer Science')
    ? 'Computer Science & Engineering (CSE)'
    : department.includes('Information') || department.includes('IT')
    ? 'Information Technology (IT)'
    : department.includes('AI') || department.includes('Data')
    ? 'Artificial Intelligence & Data Science (AI & DS)'
    : 'Computer Science & Engineering (CSE)';

  const cleanSem = semester.includes('1st') ? '1st Semester' :
                   semester.includes('2nd') ? '2nd Semester' :
                   semester.includes('3rd') ? '3rd Semester' :
                   semester.includes('4th') ? '4th Semester' :
                   semester.includes('5th') ? '5th Semester' :
                   semester.includes('6th') ? '6th Semester' :
                   semester.includes('7th') ? '7th Semester' :
                   semester.includes('8th') ? '8th Semester' : '3rd Semester';

  const deptData = DEPARTMENT_CURRICULUM[normDept] || DEPARTMENT_CURRICULUM['Computer Science & Engineering (CSE)'];
  return deptData[cleanSem] || deptData['3rd Semester'] || [];
}

// Preset Timetable Blueprints
export const PRESET_SECTION_S2_TIMETABLE = {
  id: 'TT-SEC-S2',
  college: 'Apex Institute of Technology & Management (AITM)',
  department: 'Computer Science & Engineering (CSE)',
  semester: '3rd Semester (Year 2)',
  section: 'Section-S2',
  roomNo: 'Room 4202, Academic Block 4',
  campus: 'Main Academic Campus',
  effectiveDate: 'w.e.f. August 2026',
  timeTableIncharge: 'Ms. Pratibha Dabas',
  hodName: 'Prof. S. K. Naitik (HOD CSE)',
  timeSlots: [
    '09:00 - 10:00 AM',
    '10:00 - 11:00 AM',
    '11:00 - 12:00 PM',
    '12:00 - 01:00 PM',
    '01:00 - 02:00 PM',
    '02:00 - 03:00 PM',
    '03:00 - 04:00 PM',
    '04:00 - 05:00 PM'
  ],
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  schedule: {
    'Monday': [
      { slot: '09:00 - 10:00 AM', subject: 'Data Structure (DS)', faculty: 'Ms. Poonam', room: 'Room 4202', type: 'lecture' },
      { slot: '10:00 - 11:00 AM', subject: 'Computational Methods (CM)', faculty: 'Mr. Yogesh', room: 'Room 4202', type: 'lecture' },
      { slot: '11:00 - 12:00 PM', subject: 'Discrete Mathematics (DM)', faculty: 'Ms. Ruchita Sareen', room: 'Room 4202', type: 'lecture' },
      { slot: '12:00 - 01:00 PM', subject: 'Digital Logic Circuits (DLCD)', faculty: 'Ms. Shipra', room: 'Room 4202', type: 'lecture' },
      { slot: '01:00 - 02:00 PM', subject: 'Lunch Break', faculty: '', room: 'Campus Cafeteria', type: 'break' },
      { slot: '02:00 - 03:00 PM', subject: 'DS Lab (Group G1)', faculty: 'Ms. Poonam', room: 'Lab 5', type: 'lab' },
      { slot: '03:00 - 04:00 PM', subject: 'DS Lab (Group G1)', faculty: 'Ms. Poonam', room: 'Lab 5', type: 'lab' },
      { slot: '04:00 - 05:00 PM', subject: 'Mentoring & Library Hour', faculty: 'Ms. Pratibha Dabas', room: 'Room 4202', type: 'lecture' }
    ],
    'Tuesday': [
      { slot: '09:00 - 10:00 AM', subject: 'Object Oriented Programming (OOPS)', faculty: 'Dr. Aditi Zear', room: 'Room 4202', type: 'lecture' },
      { slot: '10:00 - 11:00 AM', subject: 'Digital Logic Circuits (DLCD)', faculty: 'Ms. Shipra', room: 'Room 4202', type: 'lecture' },
      { slot: '11:00 - 12:00 PM', subject: 'Data Structure (DS)', faculty: 'Ms. Poonam', room: 'Room 4202', type: 'lecture' },
      { slot: '12:00 - 01:00 PM', subject: 'Computational Methods (CM)', faculty: 'Mr. Yogesh', room: 'Room 4202', type: 'lecture' },
      { slot: '01:00 - 02:00 PM', subject: 'Lunch Break', faculty: '', room: 'Campus Cafeteria', type: 'break' },
      { slot: '02:00 - 03:00 PM', subject: 'DLCD Lab (Room 5202)', faculty: 'Dr. Swati Juneja', room: 'Lab 5202', type: 'lab' },
      { slot: '03:00 - 04:00 PM', subject: 'DLCD Lab (Room 5202)', faculty: 'Dr. Swati Juneja', room: 'Lab 5202', type: 'lab' },
      { slot: '04:00 - 05:00 PM', subject: 'Technical Seminar Session', faculty: 'Dr. Swati Juneja', room: 'Room 4202', type: 'lecture' }
    ],
    'Wednesday': [
      { slot: '09:00 - 10:00 AM', subject: 'Discrete Mathematics (DM)', faculty: 'Ms. Ruchita Sareen', room: 'Room 4202', type: 'lecture' },
      { slot: '10:00 - 11:00 AM', subject: 'Data Structure (DS)', faculty: 'Ms. Poonam', room: 'Room 4202', type: 'lecture' },
      { slot: '11:00 - 12:00 PM', subject: 'Object Oriented Programming (OOPS)', faculty: 'Dr. Aditi Zear', room: 'Room 4202', type: 'lecture' },
      { slot: '12:00 - 01:00 PM', subject: 'Computational Methods (CM)', faculty: 'Mr. Yogesh', room: 'Room 4202', type: 'lecture' },
      { slot: '01:00 - 02:00 PM', subject: 'Lunch Break', faculty: '', room: 'Campus Cafeteria', type: 'break' },
      { slot: '02:00 - 03:00 PM', subject: 'OOPS Practical Lab', faculty: 'Dr. Aditi Zear', room: 'Lab 6', type: 'lab' },
      { slot: '03:00 - 04:00 PM', subject: 'OOPS Practical Lab', faculty: 'Dr. Aditi Zear', room: 'Lab 6', type: 'lab' },
      { slot: '04:00 - 05:00 PM', subject: 'Remedial Doubt Solving', faculty: 'Ms. Poonam', room: 'Room 4202', type: 'lecture' }
    ],
    'Thursday': [
      { slot: '09:00 - 10:00 AM', subject: 'Digital Logic Circuits (DLCD)', faculty: 'Ms. Shipra', room: 'Room 4202', type: 'lecture' },
      { slot: '10:00 - 11:00 AM', subject: 'Discrete Mathematics (DM)', faculty: 'Ms. Ruchita Sareen', room: 'Room 4202', type: 'lecture' },
      { slot: '11:00 - 12:00 PM', subject: 'Data Structure (DS)', faculty: 'Ms. Poonam', room: 'Room 4202', type: 'lecture' },
      { slot: '12:00 - 01:00 PM', subject: 'Object Oriented Programming (OOPS)', faculty: 'Dr. Aditi Zear', room: 'Room 4202', type: 'lecture' },
      { slot: '01:00 - 02:00 PM', subject: 'Lunch Break', faculty: '', room: 'Campus Cafeteria', type: 'break' },
      { slot: '02:00 - 03:00 PM', subject: 'CM Practical Lab (Lab 3)', faculty: 'Mr. Yogesh', room: 'Lab 3', type: 'lab' },
      { slot: '03:00 - 04:00 PM', subject: 'CM Practical Lab (Lab 3)', faculty: 'Mr. Yogesh', room: 'Lab 3', type: 'lab' },
      { slot: '04:00 - 05:00 PM', subject: 'Aptitude & Reasoning', faculty: 'Mr. Yogesh', room: 'Room 4202', type: 'lecture' }
    ],
    'Friday': [
      { slot: '09:00 - 10:00 AM', subject: 'Computational Methods (CM)', faculty: 'Mr. Yogesh', room: 'Room 4202', type: 'lecture' },
      { slot: '10:00 - 11:00 AM', subject: 'Object Oriented Programming (OOPS)', faculty: 'Dr. Aditi Zear', room: 'Room 4202', type: 'lecture' },
      { slot: '11:00 - 12:00 PM', subject: 'Digital Logic Circuits (DLCD)', faculty: 'Ms. Shipra', room: 'Room 4202', type: 'lecture' },
      { slot: '12:00 - 01:00 PM', subject: 'Discrete Mathematics (DM)', faculty: 'Ms. Ruchita Sareen', room: 'Room 4202', type: 'lecture' },
      { slot: '01:00 - 02:00 PM', subject: 'Lunch Break', faculty: '', room: 'Campus Cafeteria', type: 'break' },
      { slot: '02:00 - 03:00 PM', subject: 'IoT Project Studio', faculty: 'Dr. Manish Verma', room: 'Lab 204', type: 'lab' },
      { slot: '03:00 - 04:00 PM', subject: 'IoT Project Studio', faculty: 'Dr. Manish Verma', room: 'Lab 204', type: 'lab' },
      { slot: '04:00 - 05:00 PM', subject: 'Weekly Department Review', faculty: 'Prof. S. K. Naitik', room: 'Seminar Hall 1', type: 'lecture' }
    ]
  }
};

export const PRESET_SECTION_A4_TIMETABLE = {
  id: 'TT-SEC-A4',
  college: 'Apex Institute of Technology & Management (AITM)',
  department: 'Computer Science & Engineering (CSE)',
  semester: '3rd Semester (Year 2)',
  section: 'Section-A4',
  roomNo: 'Room AB4-205, Academic Block 4',
  campus: 'Main Academic Campus',
  effectiveDate: 'Odd Semester 2026-27',
  timeTableIncharge: 'Prof. Anurag',
  hodName: 'Prof. S. K. Naitik (HOD CSE)',
  timeSlots: [
    '08:00 - 09:00 AM',
    '09:00 - 10:00 AM',
    '10:00 - 11:00 AM',
    '11:00 - 12:00 PM',
    '12:00 - 01:00 PM',
    '01:00 - 02:00 PM',
    '02:00 - 03:00 PM',
    '03:00 - 04:00 PM',
    '04:00 - 05:00 PM',
    '05:00 - 06:00 PM'
  ],
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  schedule: {
    'Monday': [
      { slot: '08:00 - 09:00 AM', subject: 'TH-CS207 SE', faculty: 'Dr. Ravin Ahuja', room: 'Room AB4-205', type: 'lecture' },
      { slot: '09:00 - 10:00 AM', subject: 'TH-CS203 Oops', faculty: 'Dr. Aditi Zear', room: 'Room AB4-205', type: 'lecture' },
      { slot: '10:00 - 11:00 AM', subject: 'TH-CS207 OS', faculty: 'Dr. Nipun Bansal', room: 'Room AB4-205', type: 'lecture' },
      { slot: '11:00 - 12:00 PM', subject: 'TH-CS205 DAA', faculty: 'Dr N Anand', room: 'Room AB4-205', type: 'lecture' },
      { slot: '12:00 - 01:00 PM', subject: 'Lunch Break', faculty: '', room: 'Campus Cafeteria', type: 'break' },
      { slot: '01:00 - 02:00 PM', subject: 'Lab CS207 OS (G1)', faculty: 'Dr. Nipun Bansal', room: 'Lab 2', type: 'lab' },
      { slot: '02:00 - 03:00 PM', subject: 'Lab CS207 OS (G1)', faculty: 'Dr. Nipun Bansal', room: 'Lab 2', type: 'lab' },
      { slot: '03:00 - 04:00 PM', subject: 'Digital Logic Circuits', faculty: 'ECE Dept', room: 'Room AB4-205', type: 'lecture' },
      { slot: '04:00 - 05:00 PM', subject: 'Tutorial DAA (G1)', faculty: 'Ms. Kiran Bala', room: 'Room AB4-205', type: 'lecture' },
      { slot: '05:00 - 06:00 PM', subject: 'Self-Study & Revision', faculty: '', room: 'Library', type: 'lecture' }
    ],
    'Tuesday': [
      { slot: '08:00 - 09:00 AM', subject: 'TH-CS203 Oops', faculty: 'Dr. Aditi Zear', room: 'Room AB4-205', type: 'lecture' },
      { slot: '09:00 - 10:00 AM', subject: 'TH-CS207 SE', faculty: 'Dr. Ravin Ahuja', room: 'Room AB4-205', type: 'lecture' },
      { slot: '10:00 - 11:00 AM', subject: 'TH-CS205 DAA', faculty: 'Dr N Anand', room: 'Room AB4-205', type: 'lecture' },
      { slot: '11:00 - 12:00 PM', subject: 'TH-CS207 OS', faculty: 'Dr. Nipun Bansal', room: 'Room AB4-205', type: 'lecture' },
      { slot: '12:00 - 01:00 PM', subject: 'Lunch Break', faculty: '', room: 'Campus Cafeteria', type: 'break' },
      { slot: '01:00 - 02:00 PM', subject: 'Lab CS203 OOD (G2)', faculty: 'Dr. Aditi Zear', room: 'Lab 4', type: 'lab' },
      { slot: '02:00 - 03:00 PM', subject: 'Lab CS203 OOD (G2)', faculty: 'Dr. Aditi Zear', room: 'Lab 4', type: 'lab' },
      { slot: '03:00 - 04:00 PM', subject: 'Digital Logic Circuits', faculty: 'ECE Dept', room: 'Room AB4-205', type: 'lecture' },
      { slot: '04:00 - 05:00 PM', subject: 'Tutorial OS (G1)', faculty: 'Dr. Nipun Bansal', room: 'Room AB4-205', type: 'lecture' },
      { slot: '05:00 - 06:00 PM', subject: 'Mentoring Session', faculty: 'Prof. Anurag', room: 'Room AB4-205', type: 'lecture' }
    ],
    'Wednesday': [
      { slot: '08:00 - 09:00 AM', subject: 'TH-CS205 DAA', faculty: 'Dr N Anand', room: 'Room AB4-205', type: 'lecture' },
      { slot: '09:00 - 10:00 AM', subject: 'TH-CS207 OS', faculty: 'Dr. Nipun Bansal', room: 'Room AB4-205', type: 'lecture' },
      { slot: '10:00 - 11:00 AM', subject: 'TH-CS203 Oops', faculty: 'Dr. Aditi Zear', room: 'Room AB4-205', type: 'lecture' },
      { slot: '11:00 - 12:00 PM', subject: 'TH-CS207 SE', faculty: 'Dr. Ravin Ahuja', room: 'Room AB4-205', type: 'lecture' },
      { slot: '12:00 - 01:00 PM', subject: 'Lunch Break', faculty: '', room: 'Campus Cafeteria', type: 'break' },
      { slot: '01:00 - 02:00 PM', subject: 'Lab CS205 DAA (G1)', faculty: 'Dr N Anand', room: 'Lab 1', type: 'lab' },
      { slot: '02:00 - 03:00 PM', subject: 'Lab CS205 DAA (G1)', faculty: 'Dr N Anand', room: 'Lab 1', type: 'lab' },
      { slot: '03:00 - 04:00 PM', subject: 'Digital Logic Circuits', faculty: 'ECE Dept', room: 'Room AB4-205', type: 'lecture' },
      { slot: '04:00 - 05:00 PM', subject: 'Tutorial OOPS (G2)', faculty: 'Dr. Aditi Zear', room: 'Room AB4-205', type: 'lecture' },
      { slot: '05:00 - 06:00 PM', subject: 'Coding Club Practical', faculty: 'Student Council', room: 'Lab 204', type: 'lab' }
    ],
    'Thursday': [
      { slot: '08:00 - 09:00 AM', subject: 'TH-CS207 OS', faculty: 'Dr. Nipun Bansal', room: 'Room AB4-205', type: 'lecture' },
      { slot: '09:00 - 10:00 AM', subject: 'TH-CS203 Oops', faculty: 'Dr. Aditi Zear', room: 'Room AB4-205', type: 'lecture' },
      { slot: '10:00 - 11:00 AM', subject: 'TH-CS207 SE', faculty: 'Dr. Ravin Ahuja', room: 'Room AB4-205', type: 'lecture' },
      { slot: '11:00 - 12:00 PM', subject: 'TH-CS205 DAA', faculty: 'Dr N Anand', room: 'Room AB4-205', type: 'lecture' },
      { slot: '12:00 - 01:00 PM', subject: 'Lunch Break', faculty: '', room: 'Campus Cafeteria', type: 'break' },
      { slot: '01:00 - 02:00 PM', subject: 'Digital Electronics Lab', faculty: 'ECE Dept', room: 'EC Lab 3', type: 'lab' },
      { slot: '02:00 - 03:00 PM', subject: 'Digital Electronics Lab', faculty: 'ECE Dept', room: 'EC Lab 3', type: 'lab' },
      { slot: '03:00 - 04:00 PM', subject: 'Software Project Sprint', faculty: 'Dr. Ravin Ahuja', room: 'Room AB4-205', type: 'lecture' },
      { slot: '04:00 - 05:00 PM', subject: 'Tutorial SE (G1)', faculty: 'Dr. Ravin Ahuja', room: 'Room AB4-205', type: 'lecture' },
      { slot: '05:00 - 06:00 PM', subject: 'Library Hour', faculty: '', room: 'Central Library', type: 'lecture' }
    ],
    'Friday': [
      { slot: '08:00 - 09:00 AM', subject: 'TH-CS207 SE', faculty: 'Dr. Ravin Ahuja', room: 'Room AB4-205', type: 'lecture' },
      { slot: '09:00 - 10:00 AM', subject: 'TH-CS205 DAA', faculty: 'Dr N Anand', room: 'Room AB4-205', type: 'lecture' },
      { slot: '10:00 - 11:00 AM', subject: 'TH-CS207 OS', faculty: 'Dr. Nipun Bansal', room: 'Room AB4-205', type: 'lecture' },
      { slot: '11:00 - 12:00 PM', subject: 'TH-CS203 Oops', faculty: 'Dr. Aditi Zear', room: 'Room AB4-205', type: 'lecture' },
      { slot: '12:00 - 01:00 PM', subject: 'Lunch Break', faculty: '', room: 'Campus Cafeteria', type: 'break' },
      { slot: '01:00 - 02:00 PM', subject: 'Cloud Architecture Workshop', faculty: 'Dr. Manish Verma', room: 'Lab 204', type: 'lab' },
      { slot: '02:00 - 03:00 PM', subject: 'Cloud Architecture Workshop', faculty: 'Dr. Manish Verma', room: 'Lab 204', type: 'lab' },
      { slot: '03:00 - 04:00 PM', subject: 'Industrial Expert Lecture', faculty: 'Guest Faculty', room: 'Auditorium 1', type: 'lecture' },
      { slot: '04:00 - 05:00 PM', subject: 'Weekly Department Colloquium', faculty: 'Prof. S. K. Naitik', room: 'Seminar Hall', type: 'lecture' },
      { slot: '05:00 - 06:00 PM', subject: 'Weekend Sports & Extra-Curricular', faculty: 'Sports Council', room: 'Sports Arena', type: 'lecture' }
    ]
  }
};

export const PRESET_GGSIPU_S2_TIMETABLE = PRESET_SECTION_S2_TIMETABLE;
export const PRESET_DTU_A4_TIMETABLE = PRESET_SECTION_A4_TIMETABLE;

export const DEFAULT_TIMETABLES = [
  PRESET_SECTION_S2_TIMETABLE,
  PRESET_SECTION_A4_TIMETABLE
];
