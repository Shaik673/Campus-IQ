import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const additionalFaqs = [
  {
    question: "What is the fee refund policy if an admission is withdrawn?",
    answer: `The fee refund policy adheres to national higher education regulatory guidelines:

1. **15 days or more before the formal start of classes**: 100% refund of tuition fee minus a processing charge (maximum ₹1,000).
2. **Less than 15 days before class commencement**: 90% refund of the tuition fee.
3. **Up to 15 days after class commencement**: 80% refund of the tuition fee.
4. **Between 16 to 30 days after class commencement**: 50% refund.
5. **Beyond 30 days after class commencement**: Caution deposit and security deposits are refunded; tuition fee is non-refundable.

Hostel caution deposit and unutilized mess balance are refunded in full upon clearance from the hostel office.`,
    category: "fees",
    keywords: "fee refund withdrawal cancellation policy deposit money back reimbursement",
  },
  {
    question: "How are hostel rooms allocated for first-year students?",
    answer: `Hostel room allocation for incoming first-year students is conducted through a transparent online portal during admissions:

- **Room Options**: Double-sharing and triple-sharing rooms with attached or common washroom facilities.
- **Priority**: Allotment is done on a first-come, first-served basis upon confirmation of admission and receipt of hostel advance fee.
- **Room Amenities**: Each student receives an ergonomic study table, chair, steel wardrobe with lock, and bed with mattress.
- **Roommate Preference**: Students can request mutual roommates during the orientation registration week.
- **Separate Campuses**: First-year undergraduate students are housed in dedicated fresher blocks with 24/7 dedicated wardens and zero ragging tolerance.`,
    category: "hostel",
    keywords: "hostel room allocation first year fresher triple double sharing allotment",
  },
  {
    question: "Is high-speed Wi-Fi available in hostel rooms and campus?",
    answer: `Yes, the entire campus and all hostel blocks are covered by campus-wide high-speed optical fiber Wi-Fi:

- **Speed**: Dedicated 1 Gbps symmetrical leased line connectivity across campus.
- **Authentication**: Each registered student receives institutional single sign-on (SSO) credentials to connect up to two personal devices (laptop and mobile).
- **Security**: Enterprise firewall filtering malicious websites and unauthorized peer-to-peer sharing.
- **Timing**: 24/7 uninterrupted connectivity in student hostels, with periodic maintenance windows communicated in advance via student email.`,
    category: "hostel",
    keywords: "wifi internet speed hostel connectivity connection network sso",
  },
  {
    question: "What are the rules regarding student vehicles and campus parking?",
    answer: `Students commuting to campus may bring vehicles subject to campus traffic guidelines:

- **Two-Wheelers**: Permitted for day-scholars and resident students with valid helmets and driving licenses. Must be registered at the security desk for a parking permit sticker.
- **Four-Wheelers**: Due to campus pedestrian safety protocols, student four-wheelers are only permitted in designated outer peripheral parking lots near Gate 1 and Gate 3.
- **Speed Limit**: Strict 20 km/h speed limit throughout inner campus avenues. Reckless driving leads to parking permit revocation.
- **Electric Vehicle Charging**: Solar-powered EV charging stations are available near the Central Administrative Building and Block C.`,
    category: "transportation",
    keywords: "vehicle parking bike car two wheeler permit rules gate traffic speed limit",
  },
  {
    question: "Can day-scholar students use the college dining hall or mess?",
    answer: `Yes, day scholars have multiple dining options:

- **Pay-Per-Meal Mess Access**: Day scholars can purchase single-meal breakfast, lunch, or evening snack coupons directly from the central mess counter.
- **Semester Lunch Plan**: A discounted semester-long lunch subscription is available at the student accounts office.
- **Cafeterias & Food Courts**: Three multi-cuisine cafeterias operate on campus from 8:00 AM to 8:30 PM offering vegetarian, non-vegetarian, fresh juices, and snack counters.
- **Hygiene Standards**: All kitchens undergo bi-weekly food safety audits by the institutional health committee.`,
    category: "campus",
    keywords: "day scholar mess lunch food cafeteria dining canteen meals coupon",
  },
  {
    question: "What medical and emergency health services are available on campus?",
    answer: `The campus maintains a fully equipped 24/7 Health and Wellness Center:

- **Resident Doctors**: Full-time resident medical officer and certified nurses on duty at all hours.
- **Emergency Ambulance**: Dedicated BLS (Basic Life Support) ambulance stationed on campus for immediate hospital transfer.
- **Partner Hospitals**: Tie-ups with nearby multi-specialty hospitals for tertiary medical care and admissions.
- **Student Health Insurance**: Every enrolled student is covered under a group medical insurance policy covering hospitalization up to ₹1,00,000 per year.
- **Pharmacy**: Essential first-aid medications and prescription drugs available free or at subsidized institutional rates.`,
    category: "campus",
    keywords: "medical health center doctor emergency ambulance hospital clinic nurse insurance",
  },
  {
    question: "What sports tournaments and athletic facilities are available?",
    answer: `CampusIQ University takes pride in comprehensive indoor and outdoor athletic infrastructure:

- **Outdoor Grounds**: Standard 400m athletic running track, floodlit cricket oval, FIFA-standard football pitch, and 3 volleyball courts.
- **Indoor Arena**: 4 wooden badminton courts, table tennis hall with 8 tables, and a dedicated martial arts dojo.
- **Basketball Complex**: Two synthetic acrylic floodlit basketball courts.
- **Tournaments**: Annual Inter-Departmental Sports Meet (Olympus Cup) in November and National Inter-Collegiate Invitational Tournaments in February.
- **Coaching**: Professional sports coaches available in the morning (6:00 AM - 8:00 AM) and evening (4:30 PM - 7:00 PM).`,
    category: "campus",
    keywords: "sports athletic cricket football badminton gym tournaments stadium ground fitness",
  },
  {
    question: "How does the faculty mentor-mentee system work?",
    answer: `Every student is assigned a dedicated Faculty Mentor upon joining:

- **Ratio**: Approximately 15-20 students per faculty mentor.
- **Role**: Guides students on course registration, career aspirations, academic difficulties, attendance monitoring, and personal well-being.
- **Meetings**: Scheduled formal mentorship meetings happen once a month, with open door hours during faculty free slots.
- **Parent Interaction**: Mentors provide periodic academic updates to parents and serve as the direct point of contact for any pastoral concerns.`,
    category: "faculty",
    keywords: "mentor mentee counseling guidance advisor faculty teacher parent student support",
  },
  {
    question: "What support is provided for competitive exams like GATE, GRE, CAT, and Civil Services?",
    answer: `The Career Development Center provides structured guidance for competitive examinations:

- **GATE Coaching**: Weekend specialized classes by senior professors and external subject matter experts for 3rd and 4th-year engineering students.
- **Digital Question Banks**: Free access to mock test series, previous 15 years' solved papers, and online practice portals in the central digital library.
- **CAT & MBA Prep Club**: Student-led peer study groups covering quantitative aptitude, data interpretation, and verbal reasoning.
- **Higher Studies Cell**: GRE/IELTS/TOEFL guidance seminars, SOP writing workshops, and letter of recommendation (LOR) processing assistance.`,
    category: "placements",
    keywords: "gate gre cat civil services higher studies competitive exam coaching preparation",
  },
  {
    question: "Are undergraduate students encouraged to publish research and file patents?",
    answer: `Yes, our institution actively funds and encourages undergraduate research through the Innovation & Patent Cell:

- **Research Grants**: Seed funding of up to ₹50,000 per approved student research project under faculty guidance.
- **Patent Support**: Full financial sponsorship for provisional and permanent patent filing fees for student inventions.
- **Conference Travel Sponsorship**: Up to 70% reimbursement of registration and travel costs for students presenting papers at Scopus/IEEE indexed conferences.
- **Incentives**: Academic credit awards in the final year project evaluation for published journal papers.`,
    category: "courses",
    keywords: "research patent publication paper conference journal innovation grant funding",
  },
  {
    question: "What are the timings and rules of the Central Library during examinations?",
    answer: `During mid-semester and end-semester examination periods, the Central Library operates on extended 24-hour hours:

- **Regular Timings**: Monday to Saturday, 8:00 AM to 10:00 PM.
- **Exam Period Timings**: Open 24/7 with round-the-clock reading halls and air-conditioned discussion rooms.
- **Borrowing Privileges**: Undergraduate students can borrow up to 5 books for 14 days, with online renewal options.
- **Digital Library**: Over 100 high-configuration workstations with access to e-books, past university question papers, and plagiarism detection tools (Turnitin).`,
    category: "library",
    keywords: "library timing hours 24 hours open books exam night study borrowing",
  },
  {
    question: "How can students access digital IEEE, ACM, and Springer journals off-campus?",
    answer: `Students can access the university's multimillion-dollar subscription of digital databases remotely:

1. Visit the library portal and select "Remote Access (EZproxy / OpenAthens)".
2. Enter your institutional email address and password.
3. Access full-text PDFs of IEEE Xplore, ACM Digital Library, Springer Nature, ScienceDirect, and Harvard Business Publishing without requiring an on-campus IP address.
4. For technical assistance with proxy credentials, contact library@campusiq.edu.`,
    category: "library",
    keywords: "ieee acm springer research paper access off campus ezproxy journal digital database",
  },
  {
    question: "What is the institution's anti-ragging policy and how do I report an incident?",
    answer: `CampusIQ University enforces a STRICT ZERO-TOLERANCE ANTI-RAGGING POLICY in accordance with Supreme Court and UGC directives:

- **Definition**: Any conduct by spoken or written words, or physical act that has the effect of teasing, handling with rudeness, or causing psychological or physical harm to a fresher or junior student constitutes ragging.
- **Consequences**: Immediate suspension, expulsion from the institution, cancellation of admission, and lodging of an official police FIR.
- **Reporting Channels**:
  - 24/7 Anti-Ragging Helpline: 1800-180-5522 (National) / 011-2345-6789 (Campus)
  - Confidential Email: antiragging@campusiq.edu
  - Anonymous drop boxes placed at all hostel entrances and academic blocks.
- **Anti-Ragging Squads**: Surprise patrols conduct rounds in hostels and surrounding areas daily.`,
    category: "general",
    keywords: "ragging anti ragging zero tolerance complaint helpline emergency safety security",
  },
  {
    question: "What is the procedure to apply for an official transcript or bonafide certificate?",
    answer: `Students and alumni can request official academic certificates through the student ERP:

1. **Bonafide Certificate**: Log in to the Student Portal -> Services -> Request Certificate. Available for download with digital verification QR code within 24 working hours.
2. **Official Transcripts**:
   - Apply online with semester mark card copies and passport copy (for overseas universities).
   - Standard processing fee: ₹500 for first copy, ₹200 for subsequent copies.
   - Dispatch options: Sealed physical envelopes or direct digital WES / university transfer within 5 to 7 working days.
3. **Contact**: Academic Records Section, Block A, Room 104, transcripts@campusiq.edu.`,
    category: "examinations",
    keywords: "transcript bonafide certificate academic records marksheet duplicate wes verification",
  },
  {
    question: "Are internships mandatory for graduation and does the college help secure them?",
    answer: `Yes, industry internships are mandatory as part of the degree curriculum:

- **Curriculum Requirement**: Minimum 6 to 8 weeks internship after 6th semester for B.Tech, and 8 weeks for MBA/MCA students.
- **Academic Credits**: Students earn 2 to 4 academic credits upon successful completion and viva voce presentation.
- **College Support**:
  - Over 120 partner companies hire student interns through our dedicated summer internship drive.
  - Average monthly stipend for paid internships: ₹15,000 to ₹45,000.
  - College provides official No Objection Certificates (NOC) and recommendation letters.
- **Self-Arranged Internships**: Permitted subject to prior verification and approval by the department internship committee.`,
    category: "placements",
    keywords: "internship mandatory summer training industry noc stipend credits placement",
  },
  {
    question: "What startup incubation and entrepreneurial support is offered on campus?",
    answer: `The Campus Innovation & Entrepreneurship Center (CIEC) nurtures student startups:

- **Co-Working Space**: 10,000 sq.ft. modern co-working incubator with high-speed internet, conference rooms, and 3D printing maker labs.
- **Seed Funding**: Grants up to ₹5,00,000 for viable prototypes under the Student Startup & Innovation Policy (SSIP).
- **Mentorship**: Access to 40+ seasoned alumni entrepreneurs, venture capitalists, and intellectual property attorneys.
- **Company Registration**: Assistance with legal company incorporation, GST registration, and trademark filing.
- **Deferred Placement Policy**: Student founders can pause campus placements to work on their startup and return to participate in campus recruitment up to 2 years after graduation if needed.`,
    category: "courses",
    keywords: "startup incubation entrepreneurship funding maker lab prototype business incubator",
  },
  {
    question: "What student technical clubs and professional chapters exist on campus?",
    answer: `There are over 30 vibrant student-run clubs and international society chapters:

- **Technical Chapters**: IEEE Student Branch, ACM Chapter, Google Developer Student Club (GDSC), SAE (Formula Student Team), Robotics & AI Club, Web Development Club.
- **Cultural & Creative**: Music Society (Symphony), Dramatics Club (Abhinaya), Fine Arts & Photography (Shutterbugs), Literary and Debating Society.
- **Social Service**: National Service Scheme (NSS), Youth Red Cross, Rotaract Club, and Green Campus Eco-Club.
- **Annual Fest**: TechFest 'Innovate' in March and Cultural Fest 'Pulse' in October, drawing thousands of participants nationwide.`,
    category: "campus",
    keywords: "clubs technical societies gdsc ieee acm formula student cultural fest nss rotaract",
  },
  {
    question: "What is the criteria for semester exam fee payment and hall ticket issuance?",
    answer: `To be eligible for end-semester examinations and receive a hall ticket:

1. **Fee Dues**: All semester tuition, hostel, and library dues must be cleared.
2. **Attendance Requirement**: Minimum 75% attendance in each registered theory and laboratory subject.
3. **Exam Fee**: Exam registration fee (approx ₹1,500 per semester) must be paid online before the specified deadline.
4. **Hall Ticket Download**: Available 3 days before exam commencement on the student ERP portal after mentor clearance.
5. **Exam Day**: Students must carry both their physical Student ID card and printed Hall Ticket to the examination hall.`,
    category: "examinations",
    keywords: "hall ticket exam fee admit card semester exam attendance clearance eligibility",
  },
  {
    question: "How are internal assessments and final semester end examinations weighted?",
    answer: `Assessment weightage follows standard university credit guidelines:

- **Theory Courses**:
  - Continuous Internal Evaluation (CIE): 40% (2 Mid-term tests: 25%, Quizzes & assignments: 10%, Class attendance & participation: 5%).
  - Semester End Examination (SEE): 60% (Comprehensive 3-hour written examination covering entire syllabus).
- **Laboratory Courses**:
  - Continuous Lab Evaluation: 50% (Weekly experiments, lab manual, viva voce).
  - Semester End Lab Exam: 50% (Experiment demonstration, result accuracy, external viva).
- **Passing Minimum**: Minimum 40% in internal evaluation and 40% in semester-end exams, with overall aggregate not less than 40%.`,
    category: "examinations",
    keywords: "internal assessment weightage mid term exam marks cie see marks distribution",
  },
  {
    question: "What is the grading scale and how is CGPA calculated?",
    answer: `The institution follows the 10-point Letter Grading System:

- **Grade Points**:
  - O (Outstanding): 10 points (90-100%)
  - A+ (Excellent): 9 points (80-89%)
  - A (Very Good): 8 points (70-79%)
  - B+ (Good): 7 points (60-69%)
  - B (Above Average): 6 points (55-59%)
  - C (Average): 5 points (50-54%)
  - P (Pass): 4 points (40-49%)
  - F (Fail): 0 points (<40%)
- **SGPA Calculation**: Total Grade Points Earned / Total Credits Registered in that semester.
- **CGPA Calculation**: Cumulative Grade Points Earned across all completed semesters / Cumulative Total Credits.`,
    category: "examinations",
    keywords: "grading scale cgpa sgpa grade points calculation formula percentage pass marks",
  },
  {
    question: "What is the attendance detention rule and condonation policy?",
    answer: `Attendance requirements are strictly monitored through biometric / RFID classroom attendance:

- **Mandatory Attendance**: 75% attendance across all lectures, tutorials, and practical sessions.
- **Medical Condonation**: Between 65% and 74% attendance may be condoned by the Dean of Academics solely on valid medical grounds (hospitalization certificate) or representing the university in national sports/competitions.
- **Detention**: Students with less than 65% attendance (or less than 75% without approved medical condonation) are strictly DETAINED from appearing in the semester-end examination for that course.
- **Detained Courses**: Must be re-registered as a backlog course in the subsequent academic year or summer term.`,
    category: "examinations",
    keywords: "attendance detention 75 percent medical condonation backlog attendance shortage",
  },
  {
    question: "Can undergraduate students change their engineering branch after the first year?",
    answer: `Branch transfer after the 1st year (completion of 2nd semester) is permitted against available vacancy:

- **Eligibility**:
  - Must have cleared all 1st and 2nd semester courses in the FIRST ATTEMPT with NO active backlogs.
  - Minimum CGPA cutoff: Typically 8.5 CGPA for CSE and 8.0 CGPA for other popular branches.
- **Allotment**: Strictly based on merit rank calculated from cumulative 1st year CGPA.
- **Application Window**: Announcement made within one week of 2nd semester results declaration in July.
- **Seats Available**: Capped at 10% of approved intake in the receiving branch.`,
    category: "courses",
    keywords: "branch change branch transfer slide stream change eligibility 1st year cgpa",
  },
  {
    question: "What semester exchange or study abroad opportunities are offered?",
    answer: `The International Relations Office maintains partnerships with leading universities worldwide:

- **Partner Universities**: Student exchange agreements with accredited universities in the USA, Germany, France, South Korea, and Australia.
- **Semester Abroad Program (SAP)**: 5th or 6th semester undergraduate students spend a full academic semester abroad, with earned credits directly transferred to their degree.
- **Dual Degree Programs**: Selected programs offer 3+2 B.Tech + MS opportunities with partner institutions.
- **Scholarships**: Partial travel grants and tuition waivers available for high-achieving applicants (CGPA >= 8.5).
- **Inquiries**: international@campusiq.edu.`,
    category: "courses",
    keywords: "study abroad semester exchange foreign universities dual degree international sap",
  },
  {
    question: "Is there an active alumni mentorship network for career development?",
    answer: `Yes, our global alumni network comprises over 25,000 alumni across 40 countries:

- **Alumni Mentorship Platform**: Connects final-year and pre-final-year students with alumni mentors working in Fortune 500 companies, startups, and top research institutions.
- **Resume Reviews & Mock Interviews**: Regular weekend virtual sessions where alumni critique student resumes and conduct technical mock interviews.
- **Alumni Endowment Fund**: Provides emergency financial aid and scholarships for students facing unforeseen economic hardships.
- **Annual Alumni Reunion**: Held on campus every December during Foundation Day celebrations.`,
    category: "placements",
    keywords: "alumni network mentorship career mock interview graduates advice connections",
  },
  {
    question: "What top recruiters visit for core mechanical and civil engineering placements?",
    answer: `While technology hiring is robust, our core engineering placement record is exceptional:

- **Mechanical Recruiters**: Tata Motors, Larsen & Toubro (L&T), Maruti Suzuki, Cummins India, Mahindra & Mahindra, Bosch, Ashok Leyland, Schlumberger, Thermax.
- **Civil Recruiters**: L&T Construction, Shapoorji Pallonji, Afcons Infrastructure, Tata Projects, Gammon, Sobha Developers, AECOM.
- **Average Package**: Core engineering average CTC ranges between ₹6.5 LPA to ₹10.5 LPA, with highest offers exceeding ₹18 LPA in PSU and multinational design roles.
- **Technical Certifications**: College subsidizes AutoCAD, SolidWorks, ANSYS, and Revit certifications to boost core placement readiness.`,
    category: "placements",
    keywords: "core mechanical civil engineering companies recruiters packages l&t tata motors",
  },
  {
    question: "What programming and technical interview training is provided?",
    answer: `Our dedicated Competitive Coding and Technical Training Cell begins preparation from the 2nd year:

- **Training Curriculum**: Comprehensive data structures & algorithms (DSA), system design, DBMS, operating systems, and computer networks.
- **Coding Practice**: Weekly mandatory contests on institutional LeetCode/HackerRank portals with faculty solution walkthroughs.
- **Company-Specific Bootcamps**: 4-week intensive bootcamps focused on FAANG / Tier-1 hiring patterns (Amazon, Microsoft, Google, Adobe).
- **Soft Skills**: Professional trainers conduct group discussions (GD), verbal ability, personality grooming, and HR behavioral interview drills.`,
    category: "placements",
    keywords: "coding training dsa leetcode interview preparation bootcamps soft skills gd",
  },
  {
    question: "How can parents communicate with faculty advisors and track academic progress?",
    answer: `We prioritize transparent parent-institution communication:

- **Parent ERP Portal**: Parents receive unique login credentials to check daily attendance, internal marks, semester results, and fee payment receipts.
- **SMS & Email Alerts**: Automated notifications for student absence, exam schedules, and holiday announcements.
- **Parent-Teacher Meetings (PTM)**: Organized once each semester after the first mid-term examination (both in-person and hybrid video conference options).
- **Direct Advisor Contact**: Faculty mentor phone numbers and official email addresses are shared with parents during initial orientation.`,
    category: "faculty",
    keywords: "parents tracking attendance ptm portal updates faculty communication advisor",
  },
  {
    question: "What are the contact details and working hours of the Accounts Section?",
    answer: `The Student Accounts and Finance Section is located in the Central Administrative Complex:

- **Location**: Administrative Building, Ground Floor, Counters 4 to 8.
- **Working Hours**: Monday to Friday: 9:30 AM to 4:30 PM (Lunch break: 1:00 PM - 2:00 PM); Saturday: 9:30 AM to 1:00 PM.
- **Phone**: +91 (080) 4123-4567 / 4568
- **Email**: accounts@campusiq.edu
- **Services Handled**: Tuition fee receipts, scholarship disbursements, education loan bank authorization letters, caution deposit refunds, and no-dues clearance.`,
    category: "contact",
    keywords: "accounts finance fee counter timing working hours email phone contact location",
  },
  {
    question: "Where is the student grievance redressal cell located and how do I file a concern?",
    answer: `The Student Grievance Redressal Cell provides an impartial forum to resolve grievances:

- **Scope**: Academic evaluations, unfair treatment, hostel complaints, cafeteria concerns, or administrative delays.
- **How to File**:
  1. Online: Submit through the Student Portal under "Grievances" with supporting details.
  2. Physical: Submit a signed written complaint to the Ombudsman Office (Block B, Room 201).
- **Investigation**: The committee, headed by a senior retired judge and senior faculty members, conducts a confidential inquiry within 7 business days.
- **Email**: ombudsman@campusiq.edu.`,
    category: "general",
    keywords: "grievance complaint problem issue ombudsman redressal dispute resolution unfair",
  },
  {
    question: "What campus environmental sustainability and green initiatives exist?",
    answer: `CampusIQ University is proud to be a certified Net-Zero Green Campus:

- **Solar Energy**: 1.2 MW rooftop solar photovoltaic panels generate over 40% of the institution's total electrical power.
- **Rainwater Harvesting**: Comprehensive recharge pits and a 500,000-liter storage reservoir conserving surface runoff.
- **Sewage Treatment Plant (STP)**: 100% of campus wastewater is recycled for landscaping and toilet flushing.
- **Plastic-Free Zone**: Single-use plastics are banned across all shops, dining halls, and events.
- **Biodiversity**: Over 3,000 native shade trees and a botanical herb garden maintained by student eco-volunteers.`,
    category: "campus",
    keywords: "green campus solar energy rainwater sustainability environment eco friendly stp",
  },
  {
    question: "Are there on-campus banking, ATM, and postal facilities?",
    answer: `Yes, comprehensive banking and utility services are present right on campus:

- **Full-Service Bank**: State Bank of India (SBI) / Canara Bank on-campus branch operating Monday through Saturday with student account opening and student loan counters.
- **24/7 ATMs**: Three 24/7 ATM kiosks located near Gate 1, the Student Activity Center, and Hostel Block 3.
- **Postal & Courier Center**: Campus post office and registered courier dispatch center (DTDC / Blue Dart) for sending and receiving parcel mail.`,
    category: "campus",
    keywords: "bank atm money post office courier parcel sbi mail banking service",
  },
  {
    question: "What are the gymnasium and fitness center facilities and timings?",
    answer: `The University Fitness Center features modern cardiovascular and strength-training equipment:

- **Equipment**: Treadmills, elliptical trainers, rowing machines, Olympic power racks, and free weights.
- **Certified Trainers**: Full-time fitness instructors and nutritionists available for guidance and injury prevention.
- **Timings**:
  - Morning Session: 6:00 AM - 9:00 AM
  - Evening Session: 4:30 PM - 9:00 PM
- **Dedicated Women's Hours**: 5:00 PM - 6:30 PM at the West Wing Fitness Facility.
- **Membership**: Included in the campus amenities fee for all enrolled students with no additional charge.`,
    category: "campus",
    keywords: "gym fitness center workout exercise weights timings trainer sports gym hours",
  },
  {
    question: "How can students apply for special dietary requirements in the hostel mess?",
    answer: `Students with medical dietary needs or food allergies can request customized meal support:

- **Dietary Options**: Dedicated Pure Vegetarian, Jain (no onion/garlic), and Halal-certified non-vegetarian dining sections.
- **Medical Diets**: Students with chronic conditions (diabetic, lactose intolerant, celiac/gluten-free) can submit a prescription to the Chief Mess Warden.
- **Sick Food**: Boiled porridge, light soups, fresh fruit, and electrolyte beverages are delivered to hostel rooms upon recommendation by the campus doctor.
- **Mess Committee**: Student-elected food committee reviews and revises the 4-week rotating mess menu monthly.`,
    category: "hostel",
    keywords: "mess food dietary jain vegan gluten free allergy sick diet menu food committee",
  },
  {
    question: "What is the policy on laptops in classrooms and available charging stations?",
    answer: `Digital learning is an integral part of the academic curriculum:

- **Laptop Mandate**: All students are required to possess a personal laptop (recommended configuration: Intel Core i5/AMD Ryzen 5 or higher, 16GB RAM, 512GB SSD).
- **Classroom Charging**: Modern tiered lecture theaters are equipped with dual power sockets at every student seat.
- **Software Licenses**: Free institutional access to MATLAB, Microsoft Office 365, AutoCAD, GitHub Student Developer Pack, and JetBrains IDEs.
- **Laptop Repair Desk**: Subsidized hardware diagnostics and basic repair support at the Campus IT Helpdesk in the Computer Center.`,
    category: "general",
    keywords: "laptop charging classroom computer software licenses matlab office 365 hardware",
  },
  {
    question: "How does the institution support students with disabilities or special physical needs?",
    answer: `The Equal Opportunities Cell ensures an accessible and inclusive learning environment:

- **Physical Accessibility**: 100% barrier-free campus with wheelchair ramps, dedicated elevators in all multi-story buildings, and accessible restrooms.
- **Exam Accommodations**: Extra time (20 minutes per hour), ground-floor exam seating, and authorized scribes/readers for visually or physically challenged students.
- **Assistive Technology**: Screen reading software (JAWS, NVDA), braille keyboards, and digital magnifiers available in the Central Library Assistive Learning Lab.
- **Special Shuttle**: Battery-operated golf cart shuttle service for intra-campus mobility upon request.
- **Coordinator**: Accessible Services Office, accessible@campusiq.edu.`,
    category: "general",
    keywords: "disability accessible wheelchair special needs scribe assistive technology equal opportunity",
  },
  {
    question: "What is the procedure for third-party verification of educational credentials for employers?",
    answer: `Employers, background verification agencies (BGV), and universities can verify alumni credentials:

1. **Digital Verification Portal**: Visit the official verification portal at verification.campusiq.edu.
2. **Required Documents**: Upload scanned copy of Degree Certificate or Final Grade Card along with candidate authorization consent.
3. **Turnaround Time**: Automated digital verifications are returned within 24 to 48 hours; manual archival verifications take up to 4 business days.
4. **Verification Fee**: Institutional verification fee of ₹1,000 per candidate payable via online payment gateway.
5. **Contact**: Controller of Examinations - Verification Cell, verifications@campusiq.edu.`,
    category: "general",
    keywords: "verification bgv background check employer degree verification transcript authentic",
  },
];

async function main() {
  console.log(`Seeding ${additionalFaqs.length} additional FAQs...`);
  for (const faq of additionalFaqs) {
    await prisma.fAQ.create({
      data: {
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        keywords: faq.keywords,
        isActive: true,
      },
    });
  }
  const total = await prisma.fAQ.count();
  console.log(`✅ Successfully seeded! Total FAQs in knowledge base: ${total}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
