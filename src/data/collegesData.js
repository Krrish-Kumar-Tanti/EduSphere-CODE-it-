// Comprehensive Universal Delhi NCR Colleges & Technical Higher Education Directory

export const ALL_DELHI_COLLEGES = [
  // --- Premier Autonomous, Central & State Technical Universities ---
  { id: '1', code: 'IITD', name: 'Indian Institute of Technology Delhi (IIT Delhi)', location: 'Hauz Khas, New Delhi', type: 'Institute of National Importance', grade: 'NIRF Top 2' },
  { id: '2', code: 'DTU', name: 'Delhi Technological University (DTU Main Campus)', location: 'Shahbad Daulatpur, Bawana Road, Delhi', type: 'State Technical University', grade: 'NAAC A++' },
  { id: '3', code: 'NSUT-MAIN', name: 'Netaji Subhas University of Technology (NSUT Main Campus)', location: 'Sector 3, Dwarka, New Delhi', type: 'State Technical University', grade: 'NAAC A+' },
  { id: '4', code: 'NSUT-EAST', name: 'NSUT East Campus (Formerly AIACTR)', location: 'Geeta Colony, East Delhi', type: 'State Technical University Campus', grade: 'NAAC A+' },
  { id: '5', code: 'NSUT-WEST', name: 'NSUT West Campus (Formerly CBPGEC)', location: 'Jaffarpur, West Delhi', type: 'State Technical University Campus', grade: 'NAAC A+' },
  { id: '6', code: 'IIITD', name: 'Indraprastha Institute of Information Technology Delhi (IIIT-Delhi)', location: 'Okhla Phase III, New Delhi', type: 'State Autonomous Institute', grade: 'NAAC A' },
  { id: '7', code: 'IGDTUW', name: 'Indira Gandhi Delhi Technical University for Women (IGDTUW)', location: 'Kashmere Gate, Old Delhi', type: 'State Technical University for Women', grade: 'NAAC A+' },
  { id: '8', code: 'JMI-FET', name: 'Jamia Millia Islamia (Faculty of Engineering & Technology)', location: 'Jamia Nagar, Okhla, New Delhi', type: 'Central University', grade: 'NAAC A++' },
  { id: '9', code: 'DSEU-OKHLA', name: 'Delhi Skill & Entrepreneurship University (DSEU Okhla Campus)', location: 'Okhla Industrial Area, New Delhi', type: 'State Skills University', grade: 'Govt. of NCT' },
  { id: '10', code: 'DSEU-SHAKARPUR', name: 'DSEU Shakarpur Campus (Formerly Ambedkar DSEU)', location: 'Shakarpur, East Delhi', type: 'State Skills University', grade: 'Govt. of NCT' },
  { id: '11', code: 'DSEU-PUSA', name: 'DSEU Pusa Campus', location: 'Pusa Institute Complex, New Delhi', type: 'State Skills University', grade: 'Govt. of NCT' },
  { id: '12', code: 'DU-CIC', name: 'Cluster Innovation Centre, University of Delhi (DU CIC)', location: 'University Enclave, North Campus, Delhi', type: 'Central University Autonomous Centre', grade: 'NAAC A++' },
  { id: '13', code: 'AUD', name: 'Dr. B. R. Ambedkar University Delhi (AUD)', location: 'Lothian Road, Kashmere Gate, Delhi', type: 'State University', grade: 'NAAC A' },
  
  // --- Premier Engineering & Technical Colleges (Delhi NCR Network) ---
  { id: '14', code: 'USICT', name: 'University School of Information, Communication & Technology (USICT)', location: 'GGSIPU Main Campus, Sector 16C, Dwarka', type: 'University Teaching Department', grade: 'NAAC A++' },
  { id: '15', code: 'MAIT', name: 'Maharaja Agrasen Institute of Technology (MAIT)', location: 'PSP Area, Sector 22, Rohini, New Delhi', type: 'Affiliated Technical Institution', grade: 'NAAC A++' },
  { id: '16', code: 'MSIT', name: 'Maharaja Surajmal Institute of Technology (MSIT)', location: 'C-4, Janakpuri, New Delhi', type: 'Affiliated Technical Institution', grade: 'NAAC A+' },
  { id: '17', code: 'BVCOE', name: "Bharati Vidyapeeth's College of Engineering (BVCOE)", location: 'A-4, Paschim Vihar, New Delhi', type: 'Affiliated Technical Institution', grade: 'NAAC A' },
  { id: '18', code: 'BPIT', name: 'Bhagwan Parshuram Institute of Technology (BPIT)', location: 'PSP-4, Sector 17, Rohini, New Delhi', type: 'Affiliated Technical Institution', grade: 'NAAC A+' },
  { id: '19', code: 'ADGITM', name: 'Dr. Akhilesh Das Gupta Institute of Technology & Management (ADGITM)', location: 'FC-26, Shastri Park, New Delhi', type: 'Affiliated Technical Institution', grade: 'NAAC A+' },
  { id: '20', code: 'VIPS-TC', name: 'Vivekananda Institute of Professional Studies - Technical Campus (VIPS-TC PIT)', location: 'AU Block, Outer Ring Road, Pitampura', type: 'Affiliated Technical Institution', grade: 'NAAC A++' },
  { id: '21', code: 'GTBIT', name: 'Guru Tegh Bahadur Institute of Technology (GTBIT)', location: 'G-8 Area, Rajouri Garden, New Delhi', type: 'Affiliated Technical Institution', grade: 'NAAC A' },
  { id: '22', code: 'AITM', name: 'Apex Institute of Technology & Management (AITM Main Campus)', location: 'Institutional Academic Zone, New Delhi', type: 'Premier Technical Campus', grade: 'NAAC A++' },
  { id: '23', code: 'JEMTEC', name: 'JIMS Engineering Management Technical Campus (JEMTEC)', location: 'Knowledge Park III, Greater Noida / Delhi NCR', type: 'Affiliated Technical Institution', grade: 'NAAC A' },
  { id: '24', code: 'HMRITM', name: 'HMR Institute of Technology & Management (HMRITM)', location: 'Hamidpur, Delhi', type: 'Affiliated Technical Institution', grade: 'AICTE Approved' },
  { id: '25', code: 'TRINITY', name: 'Trinity Institute of Higher Education', location: 'Sector 9, Dwarka, New Delhi', type: 'Affiliated Technical Institution', grade: 'NAAC A' },
  { id: '26', code: 'DITM', name: 'Delhi Institute of Technology & Management', location: 'NH-1, Delhi NCR Campus', type: 'Technical Institution', grade: 'AICTE Approved' },
  { id: '27', code: 'MERI', name: 'Management Education & Research Institute (MERI Technical Campus)', location: 'Janakpuri Institutional Area, New Delhi', type: 'Affiliated Technical Institution', grade: 'NAAC A' }
];

export const ALL_COLLEGE_NAMES = ALL_DELHI_COLLEGES.map(c => `${c.name} (${c.code})`);

export default ALL_DELHI_COLLEGES;
