// Comprehensive DTU & GGSIPU B.Tech Curriculum Dataset and University Timetable Engine

export const UNIVERSITIES = [
  {
    id: 'GGSIPU',
    name: 'Guru Gobind Singh Indraprastha University (GGSIPU)',
    shortName: 'GGSIPU',
    location: 'Dwarka / FC-26 Shastri Park, New Delhi',
    tagline: 'State Technical University Network',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: 'DTU',
    name: 'Delhi Technological University (DTU - Formerly DCE)',
    shortName: 'DTU',
    location: 'Bawana Road, Shahbad Daulatpur, Delhi-110042',
    tagline: 'Premier Technological University',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  }
];

// DTU B.Tech Course Catalog
export const DTU_CURRICULUM = {
  'Computer Science & Engineering (CSE)': {
    '1st Semester': [
      { code: 'BS101', name: 'Mathematics - I (Calculus & Linear Algebra)', credits: '4 (3-1-0)', units: ['Calculus & Mean Value', 'Linear Algebra & Matrices', 'Multivariable Functions', 'Vector Calculus'] },
      { code: 'AP102', name: 'Applied Physics', credits: '4 (3-0-2)', units: ['Relativity & Optics', 'Quantum Mechanics Foundations', 'Semiconductor Physics', 'Laser & Fiber Optics'] },
      { code: 'EE103', name: 'Basic Electrical Engineering', credits: '4 (3-0-2)', units: ['DC Circuits & Theorems', 'AC Single & Polyphase', 'Transformers & Machines', 'Electrical Installations'] },
      { code: 'CO104', name: 'Programming Fundamentals in C/C++', credits: '4 (3-0-2)', units: ['Control Flow & Functions', 'Arrays & Pointers', 'Structures & Unions', 'File I/O & Dynamic Memory'] }
    ],
    '2nd Semester': [
      { code: 'BS105', name: 'Mathematics - II (Differential Equations & Complex Analysis)', credits: '4 (3-1-0)', units: ['Ordinary Diff Equations', 'Partial Diff Equations', 'Complex Variables', 'Laplace & Fourier Transforms'] },
      { code: 'AC106', name: 'Applied Chemistry', credits: '4 (3-0-2)', units: ['Thermodynamics & Kinetics', 'Polymers & Composites', 'Corrosion Science', 'Spectroscopy & Instrumental Analysis'] },
      { code: 'CO107', name: 'Data Structures', credits: '4 (3-0-2)', units: ['Stacks, Queues, Linked Lists', 'Trees & Binary Search Trees', 'Graphs & Traversals', 'Sorting, Searching & Hashing'] },
      { code: 'ME108', name: 'Engineering Graphics & Design', credits: '3 (1-0-4)', units: ['Orthographic Projections', 'Isometric Views', 'Section of Solids', 'AutoCAD 2D/3D Modeling'] }
    ],
    '3rd Semester': [
      { code: 'TH-CS207', name: 'Operating System Design (OS)', credits: '4 (3-1-0)', units: ['Process Management & Threads', 'CPU Scheduling & Synchronization', 'Deadlocks & Prevention', 'Virtual Memory & Page Replacement'] },
      { code: 'TH-CS203', name: 'Object Oriented Design (OOPS)', credits: '4 (3-1-0)', units: ['Core OOP & UML Diagrams', 'Inheritance & Polymorphism', 'Design Patterns (GoF)', 'Exception Handling & Modern C++/Java'] },
      { code: 'TH-CS205', name: 'Design & Analysis of Algorithm (DAA)', credits: '4 (3-1-0)', units: ['Asymptotic Analysis & Recurrences', 'Divide & Conquer, Greedy Strategies', 'Dynamic Programming Paradigms', 'Graph Algorithms & NP-Completeness'] },
      { code: 'TH-CS207-SE', name: 'Software Engineering (SE)', credits: '4 (3-1-0)', units: ['Agile, Scrum & SDLC Models', 'Requirements Engineering & SRS', 'Software Architectural Patterns', 'Testing Strategies & CI/CD Pipelines'] },
      { code: 'TH-EC201', name: 'Digital Logic Design', credits: '4 (3-0-2)', units: ['Boolean Algebra & Karnaugh Maps', 'Combinational Circuit Design', 'Sequential Circuits & Flip-Flops', 'Registers, Counters & FSM Design'] }
    ],
    '4th Semester': [
      { code: 'CO202', name: 'Database Management Systems (DBMS)', credits: '4 (3-0-2)', units: ['ER Modeling & Relational Algebra', 'SQL, Joins & Normalization (1NF-BCNF)', 'Transaction Management & ACID', 'Indexing, B-Trees & Concurrency Control'] },
      { code: 'CO204', name: 'Computer System Architecture (CSA)', credits: '4 (3-1-0)', units: ['Instruction Set Architectures (RISC/CISC)', 'Pipelining & Hazard Resolution', 'Memory Hierarchy & Cache Coherence', 'I/O Interfacing & Multiprocessors'] },
      { code: 'CO206', name: 'Theory of Computation', credits: '4 (3-1-0)', units: ['Finite Automata & Regular Expressions', 'Context-Free Grammars & Pushdown Automata', 'Turing Machines & Decidability', 'Computational Complexity Classes'] },
      { code: 'CO208', name: 'Microprocessors and Interfacing', credits: '4 (3-0-2)', units: ['8086 Architecture & Pinouts', 'Assembly Language Programming', 'Interrupt Controller 8259', 'Peripheral Interface 8255 & DMA 8237'] }
    ],
    '5th Semester': [
      { code: 'CO301', name: 'Computer Networks', credits: '4 (3-0-2)', units: ['OSI & TCP/IP Protocol Stacks', 'Data Link Protocols & Ethernet', 'IP Addressing, Subnetting & Routing', 'TCP Congestion Control & Sockets'] },
      { code: 'CO303', name: 'Compiler Design', credits: '4 (3-0-2)', units: ['Lexical Analysis & Lex Tools', 'Syntax Analysis (LL/LR Parsers)', 'Intermediate Code Generation', 'Code Optimization & Register Allocation'] },
      { code: 'CO305', name: 'Artificial Intelligence', credits: '4 (3-1-0)', units: ['State Space Search & A* Search', 'Knowledge Representation & Logic', 'Game Playing & Minimax Alpha-Beta', 'Machine Learning Foundations'] },
      { code: 'CO307', name: 'Cloud Computing & Distributed Systems', credits: '4 (3-0-2)', units: ['Virtualization & Hypervisors', 'IaaS, PaaS, SaaS Architectures', 'Docker Containers & Kubernetes', 'AWS / Azure Serverless Computing'] }
    ],
    '6th Semester': [
      { code: 'CO302', name: 'Machine Learning', credits: '4 (3-0-2)', units: ['Supervised Learning & Regression', 'SVMs, Decision Trees & Ensembles', 'Unsupervised Clustering & PCA', 'Neural Networks & Gradient Descent'] },
      { code: 'CO304', name: 'Information & Network Security', credits: '4 (3-1-0)', units: ['Classical & Modern Cryptography', 'RSA, AES, SHA-256 Algorithms', 'Authentication Protocols & PKI', 'Firewalls, IDS & Zero-Trust Architecture'] },
      { code: 'CO306', name: 'Big Data Analytics', credits: '4 (3-0-2)', units: ['Hadoop Ecosystem & HDFS', 'MapReduce Programming Paradigm', 'Apache Spark RDDs & DataFrames', 'NoSQL Databases (MongoDB/Cassandra)'] }
    ],
    '7th Semester': [
      { code: 'CO401', name: 'Deep Learning & Neural Architectures', credits: '4 (3-0-2)', units: ['CNNs & Computer Vision', 'RNNs, LSTMs & Sequence Models', 'Transformers & Attention Mechanisms', 'Generative Adversarial Networks (GANs)'] },
      { code: 'CO403', name: 'Distributed Systems & Blockchain', credits: '4 (3-0-2)', units: ['Consensus Algorithms (Raft/Paxos)', 'Distributed Hash Tables & P2P', 'Ethereum, Smart Contracts & Solidity', 'DeFi & Web3 Architectures'] }
    ],
    '8th Semester': [
      { code: 'CO402', name: 'Natural Language Processing & LLMs', credits: '4 (3-0-2)', units: ['Tokenization & Embeddings (Word2Vec)', 'BERT, GPT & Large Language Models', 'Retrieval-Augmented Generation (RAG)', 'Fine-Tuning & Alignment (RLHF)'] },
      { code: 'CO404', name: 'Major Capstone Project Phase-II', credits: '8 (0-0-16)', units: ['Full System Implementation', 'Benchmarking & Performance Evaluation', 'Research Paper Publishing', 'Final Viva Voce'] }
    ]
  },
  'Software Engineering (SE)': {
    '3rd Semester': [
      { code: 'SE201', name: 'Data Structures & Algorithms', credits: '4 (3-0-2)', units: ['Linear Data Structures', 'Trees & Balanced BSTs', 'Graph Algorithms', 'Hashing Techniques'] },
      { code: 'SE203', name: 'Object Oriented Programming', credits: '4 (3-1-0)', units: ['OOP Paradigms', 'Classes & Object Lifetime', 'Templates & Generics', 'Design Patterns'] },
      { code: 'SE205', name: 'Software Engineering Principles', credits: '4 (3-1-0)', units: ['SDLC Methodologies', 'SRS Documentation', 'Software Design', 'Verification & Validation'] },
      { code: 'SE207', name: 'Discrete Mathematical Structures', credits: '4 (3-1-0)', units: ['Set Theory & Relations', 'Propositional Logic', 'Combinatorics', 'Graph Theory'] }
    ]
  }
};

// GGSIPU B.Tech Course Catalog (Matches Shastri Park CSE Syllabus)
export const GGSIPU_CURRICULUM = {
  'Computer Science & Engineering (CSE)': {
    '1st Semester': [
      { code: 'BS-101', name: 'Applied Mathematics - I', credits: '4 (3-1-0)', units: ['Successive Differentiation & Leibniz', 'Partial Differentiation', 'Curvature & Curve Tracing', 'Infinite Series & Convergence'] },
      { code: 'BS-103', name: 'Applied Physics - I', credits: '3 (2-1-0)', units: ['Interference of Light', 'Diffraction & Polarization', 'Special Theory of Relativity', 'Fiber Optics & Ultrasonics'] },
      { code: 'ES-105', name: 'Electrical Science & Circuits', credits: '3 (3-0-0)', units: ['DC Network Theorems', 'AC Circuits & Resonance', 'Magnetic Circuits', 'Transformers & Motors'] },
      { code: 'ES-107', name: 'Fundamentals of Computing (C Lang)', credits: '3 (3-0-0)', units: ['Flowcharts & Algorithms', 'C Basics & Control Flow', 'Arrays & Pointer Arithmetic', 'Structures & File Handling'] }
    ],
    '2nd Semester': [
      { code: 'BS-102', name: 'Applied Mathematics - II', credits: '4 (3-1-0)', units: ['Linear Algebra & Matrices', 'Ordinary Differential Equations', 'Integral Calculus & Beta-Gamma', 'Vector Differentiation & Integration'] },
      { code: 'BS-104', name: 'Applied Physics - II', credits: '3 (2-1-0)', units: ['Quantum Mechanics Wave Mechanics', 'Statistical Physics', 'Solid State Physics & Band Theory', 'Superconductivity & Nanomaterials'] },
      { code: 'ES-106', name: 'Data Structures in C++', credits: '3 (3-0-0)', units: ['Abstract Data Types & Arrays', 'Stacks & Queues Applications', 'Linked Lists & Doubly Linked Lists', 'Non-linear Trees & Graphs'] },
      { code: 'HS-108', name: 'Communication Skills & Ethics', credits: '2 (2-0-0)', units: ['Verbal & Non-Verbal Skills', 'Technical Writing & Proposals', 'Presentation Dynamics', 'Professional Ethics'] }
    ],
    '3rd Semester': [
      { code: 'CSE-201', name: 'Data Structure (DS)', credits: '4 (3-1-0)', units: ['Linear Structures, Stacks & Queues', 'Trees, AVL, B-Trees & Heaps', 'Graph Traversals (BFS/DFS/Dijkstra)', 'Sorting & Dynamic Hashing'] },
      { code: 'CSE-203', name: 'Object Oriented Programming Systems (OOPS)', credits: '4 (3-1-0)', units: ['OOP Concepts & Classes/Objects', 'Operator Overloading & Inheritance', 'Virtual Functions & Polymorphism', 'Templates & Exception Handling in C++'] },
      { code: 'CSE-205', name: 'Digital Logic & Circuit Design (DLCD)', credits: '4 (3-1-0)', units: ['Number Systems & Boolean Algebra', 'K-Maps & Logic Minimization', 'Combinational Arithmetic Circuits', 'Sequential Counters & State Machines'] },
      { code: 'CSE-207', name: 'Discrete Mathematics (DM)', credits: '4 (3-1-0)', units: ['Sets, Relations & Functions', 'Propositional & Predicate Calculus', 'Recurrence Relations & Generating Functions', 'Group Theory, Lattices & Graph Theory'] },
      { code: 'CSE-209', name: 'Computational Methods (CM)', credits: '4 (3-1-0)', units: ['Roots of Equations (Newton-Raphson)', 'System of Linear Equations (Gauss-Seidel)', 'Interpolation (Newton/Lagrange)', 'Numerical Integration & Diff Equations (RK4)'] }
    ],
    '4th Semester': [
      { code: 'CSE-202', name: 'Applied Mathematics - IV', credits: '4 (3-1-0)', units: ['Probability & Probability Distributions', 'Sampling Theory & Hypothesis Testing', 'Markov Chains & Queuing Models', 'Fuzzy Logic & Transforms'] },
      { code: 'CSE-204', name: 'Computer Organization & Architecture', credits: '4 (3-1-0)', units: ['Register Transfer & Micro-operations', 'CPU Control Unit (Hardwired/Microprogrammed)', 'Computer Arithmetic & Floating Point', 'Memory Organization & DMA I/O'] },
      { code: 'CSE-206', name: 'Database Management Systems', credits: '4 (3-0-2)', units: ['Database Concepts & ER Modeling', 'Relational Model & Tuple Calculus', 'SQL & Normal Forms (1NF-5NF)', 'Concurrency, Recovery & ACID'] },
      { code: 'CSE-208', name: 'Theory of Computation', credits: '4 (3-1-0)', units: ['DFA/NFA & Regular Languages', 'Context-Free Grammars & Normal Forms', 'Pushdown Automata (PDA)', 'Turing Machines & Chomsky Hierarchy'] }
    ],
    '5th Semester': [
      { code: 'CSE-301', name: 'Algorithms Design and Analysis (DAA)', credits: '4 (3-1-0)', units: ['Growth of Functions & Master Theorem', 'Divide and Conquer & Greedy Paradigms', 'Dynamic Programming (0/1 Knapsack, LCS)', 'String Matching & NP-Complete Proofs'] },
      { code: 'CSE-303', name: 'Software Engineering', credits: '4 (3-1-0)', units: ['Software Process Models & Agile', 'Software Requirements Engineering', 'Software Architecture & Modular Design', 'Software Testing & Metrics (COCOMO)'] },
      { code: 'CSE-305', name: 'Java Programming', credits: '4 (3-0-2)', units: ['Java Core, Packages & Interfaces', 'Multithreading & Concurrency', 'Java Collections Framework', 'JDBC, Servlets & GUI Event Handling'] },
      { code: 'CSE-307', name: 'Microprocessors and Microcontrollers', credits: '4 (3-0-2)', units: ['8085/8086 Internal Architecture', 'Assembly Instructions & Addressing', '8255 PPI & Interfacing ADC/DAC', '8051 Microcontroller Programming'] }
    ],
    '6th Semester': [
      { code: 'CSE-302', name: 'Operating Systems & Linux Systems', credits: '4 (3-1-0)', units: ['OS Architecture & Dual-Mode Operations', 'Process Scheduling Algorithms', 'Memory Management & Paging', 'File Systems & Linux Shell Scripting'] },
      { code: 'CSE-304', name: 'Computer Networks', credits: '4 (3-1-0)', units: ['Physical & Data Link Layers', 'Medium Access Control (CSMA/CD)', 'Network Layer & Distance Vector/OSPF', 'Transport Layer (TCP/UDP) & Application Protocols'] },
      { code: 'CSE-306', name: 'Cloud Computing Architecture', credits: '4 (3-0-2)', units: ['Cloud Service Models (IaaS/PaaS/SaaS)', 'Virtualization & Hypervisor Types', 'Cloud Storage & Distributed DBs', 'Cloud Security & Docker Containers'] },
      { code: 'CSE-308', name: 'Artificial Intelligence & Machine Learning', credits: '4 (3-1-0)', units: ['Problem Solving by Search (DFS/BFS/A*)', 'Knowledge Representation & First-Order Logic', 'Probabilistic Reasoning & Bayesian Nets', 'Decision Tree & Neural Network Basics'] }
    ],
    '7th Semester': [
      { code: 'CSE-401', name: 'Information Security & Cryptography', credits: '4 (3-1-0)', units: ['Symmetric Key (DES/AES)', 'Public Key Cryptosystems (RSA/ECC)', 'Hash Functions & Digital Signatures', 'Network Security & Firewalls'] },
      { code: 'CSE-403', name: 'Compiler Design', credits: '4 (3-1-0)', units: ['Phases of Compiler & Lexing', 'Top-Down & Bottom-Up Parsing', 'Syntax Directed Translation', 'Code Generation & Peep-Hole Optimization'] }
    ],
    '8th Semester': [
      { code: 'CSE-402', name: 'Deep Learning & Neural Networks', credits: '4 (3-0-2)', units: ['Feedforward Networks & Backprop', 'CNN Architectures (ResNet/VGG)', 'Recurrent Networks (RNN/LSTM)', 'Autoencoders & Generative Models'] },
      { code: 'CSE-404', name: 'Major Capstone Industry Project', credits: '8 (0-0-16)', units: ['System Implementation', 'Deployment & Validation', 'Project Dissertation & Defense'] }
    ]
  },
  'Information Technology (IT)': {
    '3rd Semester': [
      { code: 'IT-201', name: 'Data Structures in Python', credits: '4 (3-0-2)', units: ['Arrays & Linked Lists', 'Stacks, Queues & Recursion', 'Trees & BSTs', 'Graph Algorithms'] },
      { code: 'IT-203', name: 'Digital Systems & Logic Design', credits: '4 (3-1-0)', units: ['Logic Gates & Boolean Algebra', 'Combinational Design', 'Flip-Flops & Counters', 'Memory & Programmable Logic'] },
      { code: 'IT-205', name: 'Object Oriented Programming in C++', credits: '4 (3-1-0)', units: ['C++ Classes & Constructors', 'Inheritance & Encapsulation', 'Polymorphism & Templates', 'File Handling'] }
    ]
  }
};

// ==========================================
// PRESET REAL-WORLD UNIVERSITY TIMETABLES
// ==========================================

// Preset 1: GGSIPU Shastri Park CSE S2 Room 4202 (from Uploaded Image 1)
export const PRESET_GGSIPU_S2_TIMETABLE = {
  university: 'GGSIPU',
  department: 'Computer Science & Engineering (CSE)',
  semester: '3rd Semester',
  section: 'Section-S2',
  roomNo: 'Room no- 4202',
  effectiveDate: 'w.e.f. Aug 2026',
  campus: 'FC-26, Shastri Park, Shahdara, New Delhi-110053',
  hodName: 'Dr. Megha Gupta (HOD, CSE)',
  timeTableIncharge: 'Ms Pratibha Dabas',
  timeSlots: [
    '8:15-9:10',
    '9:10-10:05',
    '10:05-11:00',
    '11:00-11:30', // LUNCH
    '11:30-12:25',
    '12:25-1:20',
    '1:20-2:15',
    '2:15-3:10'
  ],
  days: ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri'],
  schedule: {
    'Mon': [
      { slot: '8:15-9:10', subject: 'DLCD', faculty: 'Ms. Shipra', room: 'Room 4202', type: 'lecture' },
      { slot: '9:10-10:05', subject: 'OOPs-grp(a) / CM-grp(b)', faculty: 'NF-2 / Mr. Yogesh', room: 'Lab 5 / Lab 3', type: 'lab' },
      { slot: '10:05-11:00', subject: 'OOPs-grp(a) / CM-grp(b)', faculty: 'NF-2 / Mr. Yogesh', room: 'Lab 5 / Lab 3', type: 'lab' },
      { slot: '11:00-11:30', subject: 'LUNCH BREAK', faculty: '', room: '', type: 'break' },
      { slot: '11:30-12:25', subject: 'CM', faculty: 'Mr. Yogesh', room: 'Room 4202', type: 'lecture' },
      { slot: '12:25-1:20', subject: 'OOPs', faculty: 'NF-2', room: 'Room 4202', type: 'lecture' },
      { slot: '1:20-2:15', subject: 'DM', faculty: 'Ms. Ruchita Sareen', room: 'Room 4202', type: 'lecture' },
      { slot: '2:15-3:10', subject: 'Library / Mentoring', faculty: 'Mentor', room: 'Room 4202', type: 'tutorial' }
    ],
    'Tues': [
      { slot: '8:15-9:10', subject: 'Free / Remedial', faculty: '', room: '', type: 'free' },
      { slot: '9:10-10:05', subject: 'CM', faculty: 'Mr. Yogesh', room: 'Room 4202', type: 'lecture' },
      { slot: '10:05-11:00', subject: 'OOPs', faculty: 'NF-2', room: 'Room 4202', type: 'lecture' },
      { slot: '11:00-11:30', subject: 'LUNCH BREAK', faculty: '', room: '', type: 'break' },
      { slot: '11:30-12:25', subject: 'CM', faculty: 'Mr. Yogesh', room: 'Room 4202', type: 'lecture' },
      { slot: '12:25-1:20', subject: 'DS', faculty: 'Ms. Poonam', room: 'Room 4202', type: 'lecture' },
      { slot: '1:20-2:15', subject: 'DLCD-grp(a) / DS-grp(b)', faculty: 'Dr. Swati Juneja / Ms. Poonam', room: 'Room 5202 / Lab 6', type: 'lab' },
      { slot: '2:15-3:10', subject: 'DLCD-grp(a) / DS-grp(b)', faculty: 'Dr. Swati Juneja / Ms. Poonam', room: 'Room 5202 / Lab 6', type: 'lab' }
    ],
    'Wed': [
      { slot: '8:15-9:10', subject: 'CM', faculty: 'Mr. Yogesh', room: 'Room 4202', type: 'lecture' },
      { slot: '9:10-10:05', subject: 'DS', faculty: 'Ms. Poonam', room: 'Room 4202', type: 'lecture' },
      { slot: '10:05-11:00', subject: 'DLCD', faculty: 'Ms. Shipra', room: 'Room 4202', type: 'lecture' },
      { slot: '11:00-11:30', subject: 'LUNCH BREAK', faculty: '', room: '', type: 'break' },
      { slot: '11:30-12:25', subject: 'OOPs-grp(b) / CM-grp(a)', faculty: 'NF-2 / Mr. Yogesh', room: 'Lab 2 / Lab 3', type: 'lab' },
      { slot: '12:25-1:20', subject: 'OOPs-grp(b) / CM-grp(a)', faculty: 'NF-2 / Mr. Yogesh', room: 'Lab 2 / Lab 3', type: 'lab' },
      { slot: '1:20-2:15', subject: 'DM', faculty: 'Ms. Ruchita Sareen', room: 'Room 4202', type: 'lecture' },
      { slot: '2:15-3:10', subject: 'Sports / Technical Club', faculty: 'Club Lead', room: 'Sports Complex', type: 'activity' }
    ],
    'Thurs': [
      { slot: '8:15-9:10', subject: 'DLCD', faculty: 'Ms. Shipra', room: 'Room 4202', type: 'lecture' },
      { slot: '9:10-10:05', subject: 'DLCD-grp(b) / DS-grp(a)', faculty: 'Dr. Swati Juneja / Ms. Poonam', room: 'Room 5202 / Lab 5', type: 'lab' },
      { slot: '10:05-11:00', subject: 'DLCD-grp(b) / DS-grp(a)', faculty: 'Dr. Swati Juneja / Ms. Poonam', room: 'Room 5202 / Lab 5', type: 'lab' },
      { slot: '11:00-11:30', subject: 'LUNCH BREAK', faculty: '', room: '', type: 'break' },
      { slot: '11:30-12:25', subject: 'DS', faculty: 'Ms. Poonam', room: 'Room 4202', type: 'lecture' },
      { slot: '12:25-1:20', subject: 'DM', faculty: 'Ms. Ruchita Sareen', room: 'Room 4202', type: 'lecture' },
      { slot: '1:20-2:15', subject: 'Self Study / Seminar', faculty: 'Ms. Pratibha Dabas', room: 'Room 4202', type: 'tutorial' },
      { slot: '2:15-3:10', subject: 'Mentoring Class', faculty: 'Mentor', room: 'Room 4202', type: 'tutorial' }
    ],
    'Fri': [
      { slot: '8:15-9:10', subject: 'Free Slot', faculty: '', room: '', type: 'free' },
      { slot: '9:10-10:05', subject: 'DLCD', faculty: 'Ms. Shipra', room: 'Room 4202', type: 'lecture' },
      { slot: '10:05-11:00', subject: 'DM', faculty: 'Ms. Ruchita Sareen', room: 'Room 4202', type: 'lecture' },
      { slot: '11:00-11:30', subject: 'LUNCH BREAK', faculty: '', room: '', type: 'break' },
      { slot: '11:30-12:25', subject: 'OOPs', faculty: 'NF-2', room: 'Room 4202', type: 'lecture' },
      { slot: '12:25-1:20', subject: 'DS', faculty: 'Ms. Poonam', room: 'Room 4202', type: 'lecture' },
      { slot: '1:20-2:15', subject: 'Special Doubt Clearing', faculty: 'Mr. Yogesh', room: 'Room 4202', type: 'tutorial' },
      { slot: '2:15-3:10', subject: 'Weekend Project Colloquium', faculty: 'Dr. Megha Gupta', room: 'Room 4202', type: 'activity' }
    ]
  }
};

// Preset 2: DTU Department of Computer Science & Engineering Time Table Odd 2026-27 CO-III Semester Section A4 (from Uploaded Image 2)
export const PRESET_DTU_A4_TIMETABLE = {
  university: 'DTU',
  department: 'Computer Science & Engineering (CSE)',
  semester: '3rd Semester (CO-III)',
  section: 'Section-A4',
  roomNo: 'Room No. AB4-205',
  effectiveDate: 'w.e.f. 28/07/2026',
  campus: 'Department of Computer Science and Engineering, DTU Bawana Road',
  hodName: 'Prof. S. K. Naitik / Anurag (Time Table Incharge, CSE Deptt.)',
  timeTableIncharge: 'Anurag (Time Table Incharge, CSE Deptt.)',
  timeSlots: [
    '8--9',
    '9--10',
    '10--11',
    '11--12',
    '12--1',
    '1--2',
    '2--3',
    '3--4',
    '4--5',
    '5--6'
  ],
  days: ['MON', 'TUE', 'WED', 'THUR', 'FRI'],
  schedule: {
    'MON': [
      { slot: '8--9', subject: 'Free Slot', faculty: '', room: '', type: 'free' },
      { slot: '9--10', subject: 'Free Slot', faculty: '', room: '', type: 'free' },
      { slot: '10--11', subject: 'Lab-Digital Logic Design-G1 [ECE Dept] / Lab CS205 DAA-G2 [Dr N Anand][Comp Net Lab] / Lab CS203 OOD-G3 [Dr Aditi Zear][ML Lab]', faculty: 'Dr N Anand / Dr Aditi Zear', room: 'ML Lab / Comp Net Lab', type: 'lab' },
      { slot: '11--12', subject: 'Lab-Digital Logic Design-G1 / Lab CS205 DAA-G2 / Lab CS203 OOD-G3', faculty: 'Dr N Anand / Dr Aditi Zear', room: 'ML Lab / Comp Net Lab', type: 'lab' },
      { slot: '12--1', subject: 'TH-CS207 SE', faculty: 'Dr. Ravin Ahuja', room: 'AB4-303', type: 'lecture' },
      { slot: '1--2', subject: 'LUNCH BREAK', faculty: '', room: '', type: 'break' },
      { slot: '2--3', subject: 'TH-CS203 Oops', faculty: 'Dr. Aditi Zear', room: 'AB4-205', type: 'lecture' },
      { slot: '3--4', subject: 'TH-CS207 OS', faculty: 'Dr. Nipun Bansal', room: 'AB4-205', type: 'lecture' },
      { slot: '4--5', subject: 'Free Slot', faculty: '', room: '', type: 'free' },
      { slot: '5--6', subject: 'Free Slot', faculty: '', room: '', type: 'free' }
    ],
    'TUE': [
      { slot: '8--9', subject: 'Reserved Slot', faculty: '', room: '', type: 'reserved' },
      { slot: '9--10', subject: 'Reserved Slot', faculty: '', room: '', type: 'reserved' },
      { slot: '10--11', subject: 'Lab CS205 Design & Analysis of Algorithm-G1 [Dr. N Anand]', faculty: 'Dr. N Anand', room: 'Computer Network Lab', type: 'lab' },
      { slot: '11--12', subject: 'Lab CS205 Design & Analysis of Algorithm-G1 [Dr. N Anand]', faculty: 'Dr. N Anand', room: 'Computer Network Lab', type: 'lab' },
      { slot: '12--1', subject: 'Free Slot', faculty: '', room: '', type: 'free' },
      { slot: '1--2', subject: 'TH-Digital Logic Design', faculty: 'ECE Department', room: 'AB4-205', type: 'lecture' },
      { slot: '2--3', subject: 'Lab-OS Design CS207-A4/G1 [Dr Nipun Bansal][Data Mining Lab] / Lab DLD-G2 [ECE] / Lab DAA-G3 [Ms. Monika][CA Lab]', faculty: 'Dr Nipun Bansal / Ms. Monika', room: 'Data Mining Lab / CA Lab', type: 'lab' },
      { slot: '3--4', subject: 'Lab-OS Design CS207-A4/G1 / Lab DLD-G2 / Lab DAA-G3', faculty: 'Dr Nipun Bansal / Ms. Monika', room: 'Data Mining Lab / CA Lab', type: 'lab' },
      { slot: '4--5', subject: 'Free Slot', faculty: '', room: '', type: 'free' },
      { slot: '5--6', subject: 'Free Slot', faculty: '', room: '', type: 'free' }
    ],
    'WED': [
      { slot: '8--9', subject: 'Free Slot', faculty: '', room: '', type: 'free' },
      { slot: '9--10', subject: 'TH-CS207 SE', faculty: 'Dr. Ravin Ahuja', room: 'AB4-205', type: 'lecture' },
      { slot: '10--11', subject: 'Tutorial-CS209 Software Engineering G3', faculty: 'Ms. Kiran Bala', room: 'AB4-205', type: 'tutorial' },
      { slot: '11--12', subject: 'TH-CS207 OS', faculty: 'Dr. Nipun Bansal', room: 'AB4-205', type: 'lecture' },
      { slot: '12--1', subject: 'Free Slot', faculty: '', room: '', type: 'free' },
      { slot: '1--2', subject: 'TH-Digital Logic Design', faculty: 'ECE Department', room: 'AB4-205', type: 'lecture' },
      { slot: '2--3', subject: 'TH-CS203 Oops', faculty: 'Dr. Aditi Zear', room: 'AB4-205', type: 'lecture' },
      { slot: '3--4', subject: 'TH-CS205 DAA', faculty: 'Dr N Anand', room: 'AB4-205', type: 'lecture' },
      { slot: '4--5', subject: 'Free Slot', faculty: '', room: '', type: 'free' },
      { slot: '5--6', subject: 'Free Slot', faculty: '', room: '', type: 'free' }
    ],
    'THUR': [
      { slot: '8--9', subject: 'Reserved Slot', faculty: '', room: '', type: 'reserved' },
      { slot: '9--10', subject: 'Reserved Slot', faculty: '', room: '', type: 'reserved' },
      { slot: '10--11', subject: 'TH-CS207 OS', faculty: 'Dr. Nipun Bansal', room: 'AB4-205', type: 'lecture' },
      { slot: '11--12', subject: 'TH-CS205 DAA', faculty: 'Dr N Anand', room: 'AB4-205', type: 'lecture' },
      { slot: '12--1', subject: 'TH-Digital Logic Design', faculty: 'ECE Department', room: 'AB4-205', type: 'lecture' },
      { slot: '1--2', subject: 'LUNCH BREAK', faculty: '', room: '', type: 'break' },
      { slot: '2--3', subject: 'Lab-OS Design CS207-A4/G2 [Dr Nipun Bansal][Data Mining Lab] / Lab CS203 OOD G1 [Dr Aditi Zear][DBMS Lab] / Lab DLD G3 [ECE]', faculty: 'Dr Nipun Bansal / Dr Aditi Zear', room: 'Data Mining Lab / DBMS Lab', type: 'lab' },
      { slot: '3--4', subject: 'Lab-OS Design CS207-A4/G2 / Lab CS203 OOD G1 / Lab DLD G3', faculty: 'Dr Nipun Bansal / Dr Aditi Zear', room: 'Data Mining Lab / DBMS Lab', type: 'lab' },
      { slot: '4--5', subject: 'Free Slot', faculty: '', room: '', type: 'free' },
      { slot: '5--6', subject: 'Free Slot', faculty: '', room: '', type: 'free' }
    ],
    'FRI': [
      { slot: '8--9', subject: 'Free Slot', faculty: '', room: '', type: 'free' },
      { slot: '9--10', subject: 'Tutorial-CS209 Software Engineering G2', faculty: 'Ms. Kiran Bala', room: 'AB4-203', type: 'tutorial' },
      { slot: '10--11', subject: 'TH-CS205 DAA', faculty: 'Dr N Anand', room: 'AB4-203', type: 'lecture' },
      { slot: '11--12', subject: 'TH-CS207 SE', faculty: 'Dr. Ravin Ahuja', room: 'AB4-203', type: 'lecture' },
      { slot: '12--1', subject: 'TH-CS203 Oops', faculty: 'Dr. Aditi Zear', room: 'AB4-203', type: 'lecture' },
      { slot: '1--2', subject: 'Tutorial-CS209 Software Engineering G1', faculty: 'Ms. Kiran Bala', room: 'AB4-205', type: 'tutorial' },
      { slot: '2--3', subject: 'Lab-OS Design CS207-A4/G3 [Dr Nipun Bansal][IPM Lab] / Lab CS203 OOD G2 [Dr Aditi Zear][DBMS Lab]', faculty: 'Dr Nipun Bansal / Dr Aditi Zear', room: 'IPM Lab / DBMS Lab', type: 'lab' },
      { slot: '3--4', subject: 'Lab-OS Design CS207-A4/G3 / Lab CS203 OOD G2', faculty: 'Dr Nipun Bansal / Dr Aditi Zear', room: 'IPM Lab / DBMS Lab', type: 'lab' },
      { slot: '4--5', subject: 'Free Slot', faculty: '', room: '', type: 'free' },
      { slot: '5--6', subject: 'Free Slot', faculty: '', room: '', type: 'free' }
    ]
  }
};

export const DEFAULT_TIMETABLES = [
  PRESET_GGSIPU_S2_TIMETABLE,
  PRESET_DTU_A4_TIMETABLE
];

export const getCurriculumForUniversity = (uni = 'GGSIPU') => {
  if (uni === 'DTU') return DTU_CURRICULUM;
  return GGSIPU_CURRICULUM;
};

export const getSubjectsList = (uni = 'GGSIPU', branch = 'Computer Science & Engineering (CSE)', semester = '3rd Semester') => {
  const catalog = getCurriculumForUniversity(uni);
  const branchData = catalog[branch] || Object.values(catalog)[0] || {};
  
  // Fuzzy match semester
  const semKey = Object.keys(branchData).find(s => 
    s.toLowerCase().includes(semester.toLowerCase()) || semester.toLowerCase().includes(s.toLowerCase())
  );

  return branchData[semKey] || branchData['3rd Semester'] || branchData['6th Semester'] || [];
};
