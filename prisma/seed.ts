import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const faqs = [
  // ADMISSIONS
  {
    question: "What is the admission process for B.Tech programs?",
    answer: `The B.Tech admission process involves the following steps:

1. **Online Application**: Register on our official portal and fill the application form
2. **Entrance Exam**: Valid JEE Main score is required (cutoff varies by branch)
3. **Document Verification**: Submit required documents including 10th and 12th marksheets
4. **Merit List**: Admission based on JEE Main rank and state merit list
5. **Counselling**: Attend counselling session for seat allotment
6. **Fee Payment**: Pay the admission fee within the stipulated time
7. **Enrollment**: Complete enrollment formalities and receive student ID

**Important Dates (Illustrative):**
- Application Open: June 1
- Last Date to Apply: July 15
- Counselling: July 20-30
- Classes Begin: August 1

Note: These are illustrative dates. Please check the official college website for current admission schedule.`,
    category: "admissions",
    keywords: "btech admission process application jee counselling enrollment steps",
  },
  {
    question: "What documents are required for college admission?",
    answer: `The following documents are required for admission:

**Academic Documents:**
- 10th Standard Mark Sheet and Certificate
- 12th Standard Mark Sheet and Certificate
- Transfer Certificate (TC) from previous institution
- Migration Certificate (if applicable)
- JEE Main / Entrance Exam Scorecard

**Identity Documents:**
- Aadhar Card (mandatory)
- Passport-size photographs (6-8 recent)
- Birth Certificate

**Category Documents (if applicable):**
- Caste/Community Certificate (SC/ST/OBC)
- Income Certificate for scholarship/fee waiver
- Physically Handicapped Certificate

**Other Documents:**
- Gap Year Certificate (if applicable)
- Character Certificate from previous institution

All documents must be self-attested. Original documents will be verified during admission.`,
    category: "admissions",
    keywords: "documents required admission marksheet certificate aadhar tc migration",
  },
  {
    question: "Is there a lateral entry option for B.Tech programs?",
    answer: `Yes, lateral entry admissions are available for eligible candidates.

**Eligibility for Lateral Entry:**
- Diploma holders in relevant engineering branch (minimum 60% marks)
- B.Sc. graduates with Mathematics as a subject (minimum 60%)
- Admission to 2nd year (3rd semester) of B.Tech

**Process:**
1. Apply through DASA/State Lateral Entry scheme
2. Valid JELET/POLYCET score required
3. Document verification and counselling
4. Seat allotment based on merit

**Available Branches:** All major B.Tech branches accept lateral entry students, subject to seat availability.

Contact the admissions office for specific requirements and current year cutoffs.`,
    category: "admissions",
    keywords: "lateral entry btech diploma admission 2nd year eligibility",
  },
  {
    question: "What is the last date for admission application?",
    answer: `Admission application deadlines vary each academic year. 

**Typical Timeline (Illustrative):**
- First round applications: Usually closes in mid-July
- Second round (if seats available): Early August
- Spot admissions: August-end

**Important:** The exact dates change annually based on JEE Main results and state counselling schedules. Always check:
- Official college website for current deadlines
- State education board announcements
- JoSAA/CSAB counselling schedule for centrally allocated seats

We strongly recommend applying early to avoid missing deadlines. Late applications may not be considered.`,
    category: "admissions",
    keywords: "last date deadline application admission timeline schedule",
  },
  {
    question: "How can I check my admission status?",
    answer: `You can check your admission status through multiple channels:

**Online Methods:**
1. Visit the Student Portal at the official college website
2. Login with your application number and date of birth
3. Navigate to "Admission Status" section

**Check List Display:**
- Shortlisted candidates list on the notice board
- Merit list published on the official website
- Allocation letters sent via registered email

**SMS/Email Notifications:**
- Registered mobile number receives status updates
- Email notifications sent at each stage

**In-Person:**
- Visit Admissions Office (Room 101, Admin Block)
- Timing: 9:00 AM to 5:00 PM (Monday to Saturday)
- Helpline: Contact the admissions helpdesk

Keep your application number and registration ID handy when checking status.`,
    category: "admissions",
    keywords: "admission status check application portal merit list shortlist",
  },

  // COURSES
  {
    question: "What B.Tech programs are offered?",
    answer: `We offer the following B.Tech (4-year) programs:

**Core Engineering:**
- Computer Science Engineering (CSE) - 120 seats
- Electronics & Communication Engineering (ECE) - 60 seats
- Electrical Engineering (EE) - 60 seats
- Mechanical Engineering (ME) - 60 seats
- Civil Engineering (CE) - 60 seats

**Specialized Programs:**
- CSE (Artificial Intelligence & ML) - 60 seats
- CSE (Data Science) - 60 seats
- CSE (Cybersecurity) - 30 seats
- ECE (VLSI Design) - 30 seats
- Mechatronics - 30 seats

**Emerging Programs:**
- Aerospace Engineering - 30 seats
- Biomedical Engineering - 30 seats

Total intake: ~630 seats across all programs. 

Each program is NBA accredited and follows the university curriculum with industry-aligned electives.`,
    category: "courses",
    keywords: "btech programs courses cse ece ee me ce seats branches",
  },
  {
    question: "What postgraduate (M.Tech) programs are available?",
    answer: `We offer the following M.Tech (2-year) programs:

**Computer Science:**
- M.Tech Computer Science & Engineering
- M.Tech Artificial Intelligence
- M.Tech Data Science & Analytics

**Electronics:**
- M.Tech VLSI Design
- M.Tech Embedded Systems
- M.Tech Signal Processing

**Other Branches:**
- M.Tech Structural Engineering
- M.Tech Power Systems
- M.Tech Thermal Engineering
- M.Tech Manufacturing Engineering

**Admission:** Through GATE score or university entrance test. Seats also available under sponsored/part-time category.

**Scholarship:** GATE-qualified students are eligible for AICTE stipend of ₹12,400/month.`,
    category: "courses",
    keywords: "mtech programs masters postgraduate gate vlsi ai data science",
  },
  {
    question: "Does the college offer MBA program?",
    answer: `Yes, we offer an MBA program through our School of Management.

**MBA Program:**
- Duration: 2 years (4 semesters)
- Intake: 60 seats
- Specializations: Marketing, Finance, HR, Operations, Business Analytics

**Admission:**
- Valid CAT/MAT/XAT/CMAT score
- Group Discussion and Personal Interview
- Work experience preferred but not mandatory for fresh graduates

**Curriculum Highlights:**
- Industry mentorship program
- Live projects with partner companies
- 2-month industry internship
- International business module

**Placement:** MBA graduates placed in companies like Deloitte, TCS, Wipro, HDFC Bank, Amazon, and more.`,
    category: "courses",
    keywords: "mba management program cat mat admission marketing finance hr",
  },
  {
    question: "What is the duration of diploma programs?",
    answer: `Diploma programs are offered in collaboration with the State Board of Technical Education.

**Available Diploma Programs:**
- Diploma in Computer Engineering - 3 years
- Diploma in Electronics Engineering - 3 years
- Diploma in Mechanical Engineering - 3 years
- Diploma in Civil Engineering - 3 years
- Diploma in Electrical Engineering - 3 years

**Admission:** Through POLYCET (Polytechnic Common Entrance Test) state rank.

**Note:** Diploma holders can seek lateral entry into B.Tech 2nd year after completing their diploma with minimum 60% aggregate.

Contact the Admissions Office or visit the official website for current seat availability.`,
    category: "courses",
    keywords: "diploma programs duration 3 years polycet polytechnic",
  },
  {
    question: "Are there any certificate or short-term courses?",
    answer: `Yes, we offer various certificate and short-term programs:

**Technical Certificates:**
- Python Programming (6 weeks)
- Web Development (8 weeks)
- Data Analytics with Excel & Python (6 weeks)
- AutoCAD & Civil 3D (8 weeks)
- MATLAB for Engineers (4 weeks)

**Professional Development:**
- Communication Skills & Personality Development (4 weeks)
- Project Management Fundamentals (6 weeks)
- Digital Marketing (6 weeks)

**Online Courses:**
- SWAYAM/NPTEL courses available for credit transfer
- Coursera & edX certificates accepted for certain electives

**Enrollment:** Open to current students, alumni, and external candidates. Registration through the Academic Affairs Office.

Fee: ₹1,500 – ₹5,000 depending on the course.`,
    category: "courses",
    keywords: "certificate short courses python web development autocad matlab online",
  },

  // ELIGIBILITY
  {
    question: "What is the minimum eligibility for B.Tech admission?",
    answer: `**Minimum Eligibility Requirements for B.Tech:**

**Academic:**
- Passed 10+2 (or equivalent) with Physics, Chemistry, and Mathematics
- Minimum 60% aggregate in PCM (50% for SC/ST candidates)
- Should have passed English as a subject

**Entrance Exam:**
- Valid JEE Main score (Paper 1)
- State-level entrance exam score (for state quota seats)

**Age Limit:**
- Minimum 17 years as of December 31 of the admission year
- No upper age limit for general category

**For Specific Branches:**
- CSE/ECE/EE: Strong foundation in Mathematics preferred
- Biotechnology/Biomedical: Biology in 12th preferred

**Relaxation:** SC/ST/PH categories get 5% relaxation in minimum percentage as per government norms.`,
    category: "eligibility",
    keywords: "eligibility btech 10+2 pcm jee main minimum percentage criteria",
  },
  {
    question: "Is NEET required for any engineering programs?",
    answer: `NEET is typically required for medical programs, not engineering. However:

**NEET Required:**
- B.Pharm (in some universities)
- Agricultural Engineering (for some state universities)
- NOT required for regular engineering programs

**For Engineering:**
- JEE Main for B.Tech admission
- GATE for M.Tech admission
- University-specific entrance tests for some programs

**Biomedical Engineering:** Does not require NEET but having Biology background is beneficial.

For specific program requirements, please refer to the official admission notification or contact the Admissions Office.`,
    category: "eligibility",
    keywords: "neet engineering admission requirement jee biomedical",
  },
  {
    question: "What is the JEE cutoff for different branches?",
    answer: `JEE Main cutoffs vary each year based on the number of candidates and seat availability.

**Approximate JEE Main Cutoff Ranges (Illustrative - Previous Year):**

| Branch | General | OBC | SC | ST |
|--------|---------|-----|----|----|
| CSE | 95-98 percentile | 88-92 | 75-80 | 65-72 |
| ECE | 88-93 percentile | 80-85 | 68-74 | 55-62 |
| EE | 82-88 percentile | 74-80 | 62-68 | 50-57 |
| ME | 75-82 percentile | 65-72 | 52-60 | 42-50 |
| CE | 70-78 percentile | 60-68 | 48-55 | 38-46 |

**Important:** These are illustrative figures. Actual cutoffs change every year. Check the official admission notification for current year cutoffs.

The college also accepts state board merit list for 50% state quota seats.`,
    category: "eligibility",
    keywords: "jee cutoff percentile branch cse ece ee me civil category general obc sc st",
  },
  {
    question: "Are there reserved seats for different categories?",
    answer: `Yes, seat reservation follows government norms:

**Central/State Quota Reservation:**
- SC (Scheduled Caste): 15%
- ST (Scheduled Tribe): 7.5%
- OBC-NCL (Non-Creamy Layer): 27%
- EWS (Economically Weaker Section): 10%
- General (Open Merit): 40.5%

**Horizontal Reservations:**
- Physically Handicapped (PH): 5% of each category
- Defence Personnel Wards: 2% of each category
- NRI/Foreign National: Separate quota

**Required Documents for Reserved Category:**
- Caste certificate issued by competent authority
- Income certificate for EWS/OBC-NCL
- Certificate validity must cover current admission year

All reservations are as per university/state government guidelines and may vary year to year.`,
    category: "eligibility",
    keywords: "reservation quota sc st obc ews ph defence category seats percentage",
  },

  // FEES
  {
    question: "What is the annual fee structure for B.Tech?",
    answer: `**B.Tech Annual Fee Structure (Illustrative - for reference only):**

**Tuition Fee:**
- CSE, ECE, CSE-AI/ML: ₹1,20,000/year
- EE, ME, CE: ₹1,00,000/year
- Specialized branches: ₹1,30,000/year

**Other Fees (per year):**
- Development Fee: ₹15,000
- Library Fee: ₹5,000
- Lab Fee: ₹10,000
- Exam Fee: ₹5,000
- Sports & Cultural: ₹3,000
- Student Welfare Fund: ₹2,000

**Approximate Total:**
- Core branches: ₹1,40,000/year
- CS branches: ₹1,60,000/year

**Note:** This is illustrative data. Actual fees are set by the university/government and are updated annually. Always verify with the Accounts Department for current fee structure.

GST and government levies, if applicable, are additional.`,
    category: "fees",
    keywords: "fee structure btech annual tuition development library lab exam total cost",
  },
  {
    question: "What are the hostel fees?",
    answer: `**Hostel Fee Structure (Illustrative):**

**Boys Hostel:**
- 3-sharing room: ₹45,000/year (includes mess)
- 2-sharing room: ₹55,000/year (includes mess)
- Single room: ₹75,000/year (includes mess)

**Girls Hostel:**
- 3-sharing room: ₹48,000/year (includes mess)
- 2-sharing room: ₹58,000/year (includes mess)
- Single room: ₹78,000/year (includes mess)

**What's Included:**
- Room rent
- Mess charges (3 meals + evening snack)
- Wi-Fi (basic plan)
- Electricity (up to 100 units/month)
- Water charges

**Additional:**
- Security deposit: ₹5,000 (refundable)
- Wi-Fi upgrade: ₹1,500/semester

Fees are collected semester-wise. Contact the Hostel Warden or Accounts Office for current fees.`,
    category: "fees",
    keywords: "hostel fee structure boys girls room sharing mess charges annual",
  },
  {
    question: "Are there any fee concessions or waivers available?",
    answer: `Yes, fee concessions are available for eligible students:

**Government Schemes:**
- SC/ST students: Full tuition fee waiver (subject to government approval)
- OBC students: Partial fee concession per state government norms
- EWS students: Fee reimbursement as per government scheme

**Institutional Schemes:**
- Merit scholarship: Top 5 rankers per branch get 50% tuition fee waiver
- Sports quota: Students representing state/national level get fee concession
- Staff ward: Children of college employees get 25% fee concession

**Need-Based:**
- Financial hardship cases reviewed by the Financial Aid Committee
- Application to the Principal/Director with income proof

**How to Apply:**
1. Fill the Fee Concession Application form
2. Submit to the Accounts Department with supporting documents
3. Decisions communicated within 30 working days

Contact the Accounts Department for current year scheme details.`,
    category: "fees",
    keywords: "fee concession waiver sc st obc merit scholarship sports staff ward",
  },
  {
    question: "What are the payment modes accepted for fee payment?",
    answer: `We accept various payment modes for fee submission:

**Online Payments:**
- Net Banking (all major banks)
- UPI (Google Pay, PhonePe, BHIM, Paytm)
- Credit Card / Debit Card (Visa, Mastercard, RuPay)
- NEFT/RTGS transfer

**Offline Payments:**
- Demand Draft in favour of "Principal, [College Name]" payable at [City]
- Cash payment at the Accounts Office (for amounts up to ₹50,000)

**Payment Portal:**
- Login to the Student Portal
- Go to Fee Payment section
- Select semester and proceed

**Important:**
- Keep payment receipt/transaction ID safe
- Online payments take 1-2 working days to reflect
- Contact accounts office if payment status not updated within 48 hours
- Fee once paid is generally non-refundable except as per cancellation policy`,
    category: "fees",
    keywords: "fee payment modes online upi net banking dd cash credit debit card",
  },
  {
    question: "What is the fee refund policy?",
    answer: `**Fee Refund Policy (as per UGC/AICTE guidelines):**

**If withdrawal before classes commence:**
- Before 30 days of start: 100% refund (after deducting ₹1,000 processing fee)
- 15-29 days before: 80% refund
- 7-14 days before: 50% refund
- Within 7 days: 25% refund

**After classes commence:**
- Within 30 days of start: 50% refund
- After 30 days: No refund

**Hostel Fee Refund:**
- Proportional refund for unused months
- Security deposit refunded after checkout inspection

**Process:**
1. Submit written application to Principal
2. Attach original fee receipt
3. Bank account details for refund transfer
4. Processing takes 30-45 working days

Note: Refund policies may be updated by the university. Confirm current policy at the time of admission.`,
    category: "fees",
    keywords: "fee refund policy withdrawal cancellation ugc aicte percentage days",
  },

  // SCHOLARSHIPS
  {
    question: "What scholarships are available for students?",
    answer: `Various scholarships are available for eligible students:

**Government Scholarships:**
- National Scholarship Portal (NSP) - for SC/ST/OBC/Minority students
- PM Scholarship Scheme
- State government merit and means-based scholarships
- Post-Matric Scholarship for SC/ST students

**Central Government:**
- AICTE scholarship for students with annual family income below ₹8 lakhs
- Central Sector Scholarship (top 20 percentile in 12th board)

**Institutional Scholarships:**
- Director's Merit Scholarship - Top 3 students per branch per year
- Sports Excellence Award - State/National-level achievers
- Innovation Award - Patent holders / project winners

**Private/Corporate:**
- HDFC Badhte Kadam Scholarship
- Reliance Foundation Scholarship
- L&T Build India Scholarship (for Civil/Mechanical students)

**How to Apply:**
- Most applications through National Scholarship Portal (scholarships.gov.in)
- College-specific applications through the Student Affairs Office

Contact the Scholarship Cell for eligibility verification and application guidance.`,
    category: "scholarships",
    keywords: "scholarship government nsp aicte merit sc st obc minority financial aid",
  },
  {
    question: "How do I apply for government scholarships?",
    answer: `**Steps to Apply for Government Scholarships:**

**Via National Scholarship Portal (NSP):**
1. Visit scholarships.gov.in
2. Register with Aadhar and mobile number
3. Select appropriate scholarship scheme
4. Fill application with academic and family details
5. Upload required documents
6. Submit and note application ID

**Required Documents:**
- Aadhar card
- Caste/community certificate (fresh/renewed)
- Income certificate (current year)
- 10th and 12th marksheets
- Bank account passbook copy
- Bonafide certificate from college (get from office)
- Passport photo

**Timeline:**
- Applications usually open: October-November
- Last date: December-January
- Scholarship disbursement: March-April

**Important Notes:**
- Apply fresh each year; previous year approval does not carry forward
- College verification is mandatory for final processing
- Ensure bank account is Aadhar-seeded

Contact the Scholarship Cell (Room 108, Admin Block) for assistance.`,
    category: "scholarships",
    keywords: "apply scholarship nsp portal government aadhar documents steps process",
  },
  {
    question: "Is there a scholarship for merit students?",
    answer: `Yes, merit scholarships are awarded to academically excellent students:

**College Merit Scholarships:**

**Rank-Based:**
- JEE Main top 100 rank in college: 100% tuition waiver for Year 1
- Top 3 in each branch (12th board): 50% tuition fee scholarship

**Performance-Based (Each Semester):**
- CGPA 9.5+: 30% tuition waiver for next semester
- CGPA 9.0-9.49: 20% tuition waiver
- CGPA 8.5-8.99: 10% tuition waiver

**Conditions:**
- No pending arrears or backlogs
- Minimum 75% attendance maintained
- Academic integrity (no disciplinary action)
- Minimum marks in all subjects (no fails)

**Application:**
- Automatic for entry-level merit awards (based on admission rank)
- Semester scholarships based on result card
- No separate application needed for academic performance scholarships

Contact the Academic Affairs Office or Scholarship Cell for details.`,
    category: "scholarships",
    keywords: "merit scholarship cgpa rank performance tuition waiver eligibility",
  },

  // HOSTEL
  {
    question: "What hostel facilities are available?",
    answer: `Our campus has separate hostel facilities for boys and girls:

**Boys Hostels (3 blocks):**
- Total capacity: ~1,200 students
- Separate blocks for 1st year and senior students
- 24-hour security with CCTV surveillance
- Warden + Resident Tutors available

**Girls Hostels (2 blocks):**
- Total capacity: ~600 students
- Lady warden and female security staff
- Strict entry-exit protocols

**Room Facilities:**
- Furnished rooms (bed, wardrobe, study table, chair)
- Wi-Fi connectivity
- Attached/common bathrooms
- Room-cleaning service (weekdays)

**Common Facilities:**
- Mess (multi-cuisine, hygienic)
- Common room with TV
- Indoor games room (TT, carom)
- Gym/fitness center
- Reading room
- Laundry service (charged separately)
- Medical room with nurse
- Generator backup

**Visitor Policy:**
- Designated visitor hours
- Prior permission required for overnight stays`,
    category: "hostel",
    keywords: "hostel facilities boys girls rooms amenities mess wifi gym security",
  },
  {
    question: "How do I apply for hostel accommodation?",
    answer: `**Hostel Application Process:**

**Step 1: Online Application**
- Login to Student Portal after getting admission
- Go to 'Hostel Allotment' section
- Fill hostel application form
- Select preference: single/sharing, block preference

**Step 2: Document Submission**
- Medical fitness certificate
- Anti-ragging undertaking (mandatory)
- Emergency contact details
- ID proof

**Step 3: Allotment**
- Allotment based on availability and preference
- 1st year students given priority
- Allotment letter issued via email

**Step 4: Reporting**
- Report to the hostel on assigned date
- Pay hostel fee at accounts office
- Receive room key from hostel warden

**Important Notes:**
- Apply early as rooms fill up quickly
- First-year students strongly recommended to stay in hostel
- Day scholars can apply for hostel mid-semester if rooms available

Contact the Chief Warden (Hostel Office) for queries.`,
    category: "hostel",
    keywords: "hostel apply application process allotment steps portal day scholar",
  },
  {
    question: "What are the hostel rules and regulations?",
    answer: `**Key Hostel Rules:**

**Entry/Exit:**
- Gate closes at 9:30 PM (Boys), 8:30 PM (Girls)
- Late entry requires prior permission from warden
- Must register when going out for more than 24 hours
- Guests allowed in visitor room only (4-6 PM daily)

**General Conduct:**
- No ragging in any form (zero tolerance policy)
- No alcohol, drugs, or tobacco on campus
- No gambling or loud music after 10 PM
- No opposite-gender entry in rooms

**Academic:**
- Study hour: 9 PM - 11 PM (silence maintained)
- Absence must be informed to warden
- Must maintain minimum 75% attendance

**Room Maintenance:**
- Keep room clean and tidy
- No posters/painting on walls
- Report maintenance issues to hostel office
- Responsibility for room inventory

**Penalties:**
- Minor violations: Warning/fine
- Major violations: Hostel expulsion
- Ragging: Rustication from college

Anti-ragging helpline: 1800-180-5522`,
    category: "hostel",
    keywords: "hostel rules regulations curfew entry exit ragging study hours conduct",
  },

  // TRANSPORTATION
  {
    question: "Does the college provide bus transportation?",
    answer: `Yes, the college operates a fleet of buses covering major routes:

**Bus Routes Available (Illustrative):**
- Route 1: City Center → College (via Main Road)
- Route 2: Railway Station → College (via Industrial Area)
- Route 3: North City → College (via Bypass)
- Route 4: South City → College (via Highway)
- Route 5: Suburbs → College

**Timings:**
- Morning pickup: 7:00 AM - 8:15 AM (from various stops)
- Return: 4:30 PM (regular) and 6:30 PM (late batch)

**Bus Pass:**
- Annual bus pass: ₹15,000 - ₹20,000 (depending on distance)
- Semester pass available
- Monthly passes not available

**How to Get Bus Pass:**
1. Register online in the Student Portal
2. Select route and nearest pickup point
3. Pay fees at the transport office
4. Collect pass from Transport Office (Block B, Ground Floor)

Note: Routes and timings may change. Check the Transport Office notice board or portal for updates.`,
    category: "transportation",
    keywords: "bus transportation routes college timing bus pass fee transport",
  },
  {
    question: "Is parking available on campus?",
    answer: `Yes, parking facilities are available on campus:

**For Students:**
- Two-wheeler parking: Designated student parking zones near hostels and academic blocks
- Parking sticker mandatory (issued by Transport Office)
- Cost: ₹500/year for two-wheelers

**For Staff:**
- Dedicated staff parking near Admin Block
- Four-wheeler and two-wheeler zones

**For Visitors:**
- Visitor parking near main gate
- Free for up to 3 hours

**Rules:**
- No parking on access roads or emergency lanes
- Unauthorized vehicles may be towed
- Helmet mandatory on two-wheelers within campus
- Speed limit: 20 km/h on campus roads

**Parking Sticker:**
- Get form from Security Office (Gate No. 1)
- Submit RC book copy, ID proof, vehicle photo
- Sticker issued within 3 working days

Campus has CCTV surveillance in parking areas. College is not responsible for theft or damage to vehicles.`,
    category: "transportation",
    keywords: "parking campus two-wheeler four-wheeler sticker rules student staff visitor",
  },

  // LIBRARY
  {
    question: "What are the library timings and facilities?",
    answer: `**Central Library - Overview:**

**Timings:**
- Monday to Friday: 8:00 AM to 10:00 PM
- Saturday: 8:00 AM to 6:00 PM
- Sunday: 10:00 AM to 4:00 PM
- During exams: Extended hours (8 AM to midnight)

**Collection:**
- Books: ~80,000 volumes
- Journals: 200+ national and international
- E-Resources: Subscribed to IEEE Xplore, Springer, Elsevier, NPTEL
- Previous year question papers: Available for all programs

**Facilities:**
- Reading hall (500 seating capacity)
- Digital library section with 100+ computers
- Wi-Fi throughout library
- Reprography/scanning services
- Discussion rooms (bookable online)
- Newspaper and magazine section

**Borrowing Policy:**
- B.Tech students: 3 books, 14 days
- M.Tech students: 5 books, 21 days
- Staff: 10 books, 30 days

**Fine:** ₹2 per day per book for overdue returns`,
    category: "library",
    keywords: "library timings facilities books journals digital e-resources borrowing",
  },

  // CAMPUS FACILITIES
  {
    question: "What sports and recreation facilities are available?",
    answer: `Our campus has excellent sports and recreation infrastructure:

**Outdoor Sports:**
- Cricket ground (with practice nets)
- Football ground
- Basketball courts (2)
- Volleyball courts (2)
- Tennis courts (2)
- Athletic track (400m)
- Kabaddi and Kho-Kho grounds

**Indoor Sports:**
- Badminton courts (4)
- Table Tennis (8 tables)
- Chess and Carrom
- Billiards/Snooker table

**Gym & Fitness:**
- Well-equipped fitness center in hostel block
- Open gym in sports complex

**Swimming Pool:**
- Olympic-size pool (for staff/senior students)
- Coaching available for beginners

**Clubs & Activities:**
- Sports club membership
- Annual Sports Day events
- Inter-college tournaments
- Yoga and meditation sessions

**Booking:** Sports equipment and grounds can be booked through the Sports Office or Student Portal.`,
    category: "campus",
    keywords: "sports recreation facilities cricket football basketball tennis gym swimming",
  },
  {
    question: "What food options are available on campus?",
    answer: `The campus has multiple food outlets:

**Main Mess (Hostel students):**
- Breakfast: 7:00 - 9:00 AM
- Lunch: 12:00 - 2:00 PM
- Evening Snack: 4:30 - 5:30 PM
- Dinner: 7:00 - 9:00 PM
- Menu rotated weekly, includes vegetarian and non-vegetarian options

**Canteens (for all students):**
- Central Canteen (near Main Block): 8 AM - 9 PM
- Branch Canteen near Labs: 9 AM - 6 PM
- Fast food stall near Sports Block

**Cafeteria (Food Court):**
- Multiple food stalls
- South Indian, North Indian, Chinese options
- Snacks, juices, beverages
- Open: 8 AM to 8 PM

**Prices:** Affordable student-friendly pricing. Monthly mess coupon available for day scholars.

**Special Diets:** Mess provides diabetic/low-salt meals on doctor's prescription.`,
    category: "campus",
    keywords: "food mess canteen cafeteria options timings vegetarian breakfast lunch dinner",
  },
  {
    question: "Is there a medical facility on campus?",
    answer: `Yes, the campus has a dedicated Health Centre:

**Health Centre Services:**
- OPD (Monday to Saturday: 9 AM to 5 PM)
- Full-time nurse available 24x7 in hostel medical room
- Doctor available Monday-Saturday (9 AM - 1 PM)
- Basic first aid and emergency response

**Facilities:**
- Consultation room
- Minor treatment facility
- Pharmacy (common medicines stocked)
- Ambulance service on campus

**Tie-up Hospitals:**
- [City General Hospital] - 2 km from campus (emergency referral)
- [Medical College Hospital] - 5 km from campus (major cases)

**Medical Insurance:**
- All students covered under Group Student Insurance
- Covers hospitalization up to ₹50,000/year
- Accident coverage included

**Emergency:** Health Centre Emergency: [Contact Number] (available 24x7)

Medical certificates for fee concessions, exam postponement, etc., must be obtained from registered doctors and submitted to the office.`,
    category: "campus",
    keywords: "medical health centre doctor nurse ambulance hospital insurance pharmacy",
  },

  // EXAMINATIONS
  {
    question: "What is the examination pattern for B.Tech?",
    answer: `**B.Tech Examination Pattern:**

**Continuous Assessment (40 marks per subject):**
- Mid-term exam 1: 15 marks
- Mid-term exam 2: 15 marks
- Assignments/Quiz/Seminars: 10 marks

**End-Semester Exam (60 marks per subject):**
- Written exam: 3 hours duration
- 5 questions, attempt any 4 (or similar pattern per university)
- Minimum pass: 24/60 in ESE, 40% aggregate

**Lab Exams:**
- Internal: 60 marks (viva + record + continuous)
- External: 40 marks (practical exam by external examiner)

**Grading System (as per university):**
| Grade | Points | Range |
|-------|--------|-------|
| O | 10 | 90-100% |
| A+ | 9 | 80-89% |
| A | 8 | 70-79% |
| B+ | 7 | 60-69% |
| B | 6 | 50-59% |
| C | 5 | 40-49% |
| F | 0 | <40% |

**CGPA calculated** at the end of each semester based on credit-weighted GPA.`,
    category: "examinations",
    keywords: "exam pattern btech midterm end semester assessment grading cgpa marks",
  },
  {
    question: "What is the attendance requirement?",
    answer: `**Attendance Policy:**

**Minimum Requirement:**
- 75% attendance mandatory in each subject
- Calculated separately for theory and practical

**Consequences of Low Attendance:**
- Below 75% in any subject: Not allowed to appear in end-semester exam
- Condonation possible in very rare cases with medical/valid reasons

**Medical Condonation:**
- Students with 65-75% attendance due to medical reasons may apply for condonation
- Medical certificate from registered doctor required
- Application to HoD within 7 days of recovery
- Approved by Academic Committee

**Duty Leave:**
- NCC/NSS duty, sports events, official college activities counted as present
- Prior permission required from respective department head

**Tracking:**
- Biometric attendance in labs (some departments)
- Manual register for most classes
- Attendance updated weekly on Student Portal
- SMS/email alerts when attendance drops below 80%

Maintain good attendance to avoid academic disruptions.`,
    category: "examinations",
    keywords: "attendance requirement 75 percent condonation medical leave shortage",
  },
  {
    question: "How do I apply for exam re-evaluation or rechecking?",
    answer: `**Exam Re-evaluation / Rechecking Process:**

**Rechecking (marks totaling check):**
- Available for end-semester exam
- Application within 10 days of result publication
- Fee: ₹300 per subject
- Marks re-totaled; corrections if any, applied

**Re-evaluation (detailed answer re-checking):**
- Allowed for specific courses (check university norms)
- Application within 15 days of result
- Fee: ₹500-800 per subject
- Evaluated by a different examiner

**How to Apply:**
1. Download form from Student Portal or Exam Section
2. Fill subject details and answer book number
3. Pay fee at Accounts Office / online
4. Submit to Examination Section (Room 201)

**Result:**
- Rechecking: 10-15 working days
- Re-evaluation: 20-30 working days
- Higher of original and re-evaluated marks applicable (university policy)

Note: Application after deadline will not be accepted. Contact the Examination Section for current guidelines.`,
    category: "examinations",
    keywords: "re-evaluation rechecking exam marks application fee process deadline",
  },

  // PLACEMENTS
  {
    question: "What is the placement record of the college?",
    answer: `**Placement Statistics (Illustrative - for demonstration purposes):**

**Overall Placement (Last Academic Year):**
- Placement rate: ~85% of eligible students placed
- Highest package: ₹28 LPA (CSE - Product company)
- Average package: ₹6.2 LPA
- Median package: ₹5.0 LPA

**Branch-wise Average Packages (Illustrative):**
| Branch | Avg Package |
|--------|-------------|
| CSE/AI/DS | ₹8.5 LPA |
| ECE | ₹6.0 LPA |
| EE | ₹5.5 LPA |
| ME | ₹4.8 LPA |
| CE | ₹4.2 LPA |

**Top Recruiters (Illustrative):**
TCS, Infosys, Wipro, Cognizant, Accenture, IBM, Amazon, Microsoft, Google, Deloitte, L&T, Bosch, and 200+ more companies.

**Note:** This is illustrative data for demonstration purposes. Visit the official Placements page for verified, current statistics.`,
    category: "placements",
    keywords: "placement record package lpa companies recruiters average highest statistics",
  },
  {
    question: "What placement training and support is provided?",
    answer: `The Training & Placement Cell provides comprehensive support:

**Placement Training Programs:**
- Aptitude training (Quantitative, Logical, Verbal)
- Communication skills & soft skills workshops
- Technical interview preparation
- Group Discussion sessions
- Mock interviews with industry professionals
- Resume and LinkedIn profile building
- Coding practice (HackerRank, LeetCode sessions)

**Timeline:**
- Year 3 (Semester 5-6): Aptitude and core skills training begins
- Year 4 (Semester 7): Company-specific prep, mock drives
- Year 4 (Semester 7-8): Campus recruitment drives

**Resources:**
- Online practice platform access
- Placement preparation material
- Previous placement papers archive
- Video resources for interview prep

**Internships:**
- Companies offer pre-placement offers (PPO) through internships
- 6-month/8-week internship placement assistance
- Project opportunities with industry partners

Contact T&P Cell for current training schedules and company visit dates.`,
    category: "placements",
    keywords: "placement training support aptitude communication interview mock resume coding",
  },
  {
    question: "How do I register for campus placements?",
    answer: `**Campus Placement Registration Process:**

**Eligibility Criteria:**
- B.Tech final year students with minimum 60% aggregate (some companies require 65% or 7.0 CGPA)
- No active backlogs at time of registration
- Valid student ID and enrollment number

**Registration Steps:**
1. Login to the Placement Portal (placement.college.edu)
2. Complete your profile (academics, skills, projects, certifications)
3. Upload updated resume (PDF format)
4. Register for specific company drives as they are announced

**Profile Requirements:**
- Academic records (all semesters)
- Skills and certifications
- Internship details
- Projects and achievements
- Resume (keep updated)

**Important:**
- Register early - some companies shortlist based on portal profile
- Keep academic records up to date
- Read company criteria carefully before applying
- Maintain register email for placement notifications

Contact the T&P Cell for queries: placement@college.edu or Room 102, Placement Block.`,
    category: "placements",
    keywords: "placement registration process portal profile eligibility resume criteria",
  },

  // FACULTY
  {
    question: "What is the faculty-to-student ratio?",
    answer: `**Faculty-to-Student Ratio:**

- Overall ratio: 1:15 (faculty to students)
- Target ratio: 1:12 for theory courses
- Lab: 1 faculty per 20 students typically

**Faculty Strength (Approximate):**
- Total faculty: 200+ (full-time)
- PhD holders: 60%+
- Industry experienced: 30%+
- Visiting faculty from industry: 20+ per year

**Qualification Profile:**
- Professors: 25
- Associate Professors: 45
- Assistant Professors: 130+
- PhD students (teaching assistants): Additional support

**Notable:**
- Faculty with patents: 40+
- Publications in indexed journals: 300+ per year
- Funded research projects: Active projects worth ₹15+ crore (illustrative)

For department-specific faculty information and profiles, visit the respective department pages on the official website.`,
    category: "faculty",
    keywords: "faculty ratio student professor qualification phd ratio department",
  },

  // CONTACT
  {
    question: "What are the contact details for the college?",
    answer: `**CampusIQ College - Contact Information (Illustrative):**

**Main Office:**
- Address: College Road, Knowledge Park, [City] - 500001
- Phone: +91-40-XXXX-XXXX
- Email: info@campusiq-college.edu
- Website: www.campusiq-college.edu

**Department Contacts:**
| Department | Email | Extension |
|-----------|-------|-----------|
| Admissions | admissions@campusiq.edu | 101 |
| Accounts/Fees | accounts@campusiq.edu | 102 |
| Hostel | hostel@campusiq.edu | 103 |
| Library | library@campusiq.edu | 104 |
| Placements | placement@campusiq.edu | 105 |
| Exam Section | exams@campusiq.edu | 106 |
| Transport | transport@campusiq.edu | 107 |

**Office Hours:**
- Monday to Friday: 9:00 AM to 5:30 PM
- Saturday: 9:00 AM to 1:00 PM
- Sunday and Holidays: Closed

**Emergency Contact:** Security Office - +91-40-XXXX-YYYY (24x7)

Note: All contact details above are illustrative for demonstration purposes.`,
    category: "contact",
    keywords: "contact phone email address admissions accounts hostel library placement exam",
  },

  // GENERAL
  {
    question: "When was the college established?",
    answer: `**About CampusIQ College (Illustrative):**

CampusIQ College of Engineering and Technology was established in 1995 under the state university affiliation system.

**Key Milestones:**
- 1995: Founded with 4 engineering programs
- 2001: Autonomous status granted by the university
- 2005: NAAC 'A' grade accreditation
- 2010: NBA accreditation for core programs
- 2015: 'A+' NAAC grade
- 2018: Established innovation & incubation center
- 2022: Added AI/ML and Data Science specializations

**Accreditation:**
- NAAC Grade: A+ (illustrative)
- NBA accredited programs: 8
- ISO 9001:2015 certified

**Affiliation:**
- Affiliated to [State Technical University]
- Recognized by AICTE, Ministry of Education

**Campus:**
- Total area: 50 acres
- Built-up area: 2 lakh sq.ft.
- Located in the Knowledge Park area

Note: All information above is illustrative for demonstration purposes.`,
    category: "general",
    keywords: "college established history naac nba accreditation autonomy founded year",
  },
  {
    question: "What is the college's NIRF ranking?",
    answer: `**Rankings and Recognitions (Illustrative Data):**

**NIRF (National Institutional Ranking Framework):**
- Engineering category: Ranked within top 200 (illustrative)
- Overall category: Listed in top 300

**Other Rankings (Illustrative):**
- India Today Engineering Rankings: B+ category
- Outlook India Rankings: Top 150 engineering colleges

**Accreditations:**
- NAAC: A+ Grade
- NBA: 8 programs accredited
- AICTE approved

**International:**
- QS India Rankings: Listed

**Note:** Rankings change annually. The above figures are illustrative for demonstration purposes. For verified and current ranking information, please check:
- NIRF official website (nirfindia.org)
- University official website
- NAAC official portal

Rankings should be one factor among many when choosing a college. Consider program quality, placement record, faculty, and infrastructure.`,
    category: "general",
    keywords: "nirf ranking naac nba accreditation india today outlook recognized",
  },
  {
    question: "Does the college have an anti-ragging policy?",
    answer: `**Anti-Ragging Policy:**

Our college has a strict zero-tolerance policy against ragging.

**What constitutes ragging:**
- Any act of physical abuse, mental torture, or humiliation
- Forcing freshers to perform demeaning acts
- Obstruction to academic activities
- Sexual harassment

**Measures in place:**
- Anti-Ragging Committee at college level
- Anti-Ragging Squad with faculty and students
- CCTV coverage in key areas
- Compulsory anti-ragging undertaking by all students and parents

**Reporting:**
- UGC Anti-Ragging Helpline: 1800-180-5522 (24x7, toll-free)
- Email: antiragging@campusiq.edu
- Anonymous complaints portal on college website
- Complaint box in hostel blocks

**Penalty for Ragging:**
- Suspension / Rustication from college
- FIR filing with police
- Cancellation of admission

**New Student Orientation:**
- Anti-ragging awareness session on Day 1
- Mentorship by senior students (formal buddy system)

Report any incident immediately. Confidentiality is maintained.`,
    category: "general",
    keywords: "anti-ragging policy zero tolerance helpline report ugc punishment committee",
  },
  {
    question: "What is the process for obtaining a bonafide certificate?",
    answer: `**Bonafide Certificate - How to Obtain:**

A bonafide certificate confirms your enrollment at the institution.

**When you need it:**
- Bank loans, scholarships, passport applications
- Exam centers, sports events
- Internship applications
- Government documents

**How to Apply:**
1. Visit the Administrative Office (Room 105)
2. Fill the Bonafide Certificate Request Form
3. Mention purpose (important for wording)
4. Submit with student ID copy

**Online Option:**
- Login to Student Portal
- Services → Certificate Request → Bonafide
- Select purpose, submit request
- Collect certificate in 2-3 working days

**Processing Time:**
- Regular: 3 working days
- Urgent (with extra fee): 1 working day

**Fees:**
- Standard: Free (first 3 per year)
- Additional copies: ₹50 each
- Urgent processing: ₹100 extra

**Important:** Certificate is valid for 3 months from date of issue. Request closer to your need date.`,
    category: "general",
    keywords: "bonafide certificate apply process portal administrative office fee urgent",
  },
  {
    question: "What extracurricular activities are available?",
    answer: `**Extracurricular Activities at CampusIQ:**

**Technical Clubs:**
- Coding Club (competitive programming, hackathons)
- Robotics Club
- Electronics & Circuits Club
- 3D Printing & Maker Club
- Cybersecurity Club

**Cultural Clubs:**
- Music Club (classical and western)
- Dance Club (classical, folk, western)
- Drama & Theatre Club
- Photography & Filmmaking Club
- Fine Arts Club

**Literary Clubs:**
- Debate Club
- MUN (Model United Nations)
- Creative Writing Club
- Newsletter team

**Professional Bodies:**
- IEEE Student Chapter
- CSI (Computer Society of India)
- SAE (Society of Automotive Engineers)
- IEI (Institution of Engineers India)

**Social Service:**
- NSS (National Service Scheme)
- NCC (National Cadet Corps)
- Environmental Club

**Annual Events:**
- TechFest (national level technical festival)
- Cultural Fest (3-day event)
- Sports Day
- Entrepreneurship Summit

All students are encouraged to participate. Many clubs offer credits under activity points.`,
    category: "general",
    keywords: "extracurricular clubs cultural technical sports nss ncc fest activities",
  },
  {
    question: "Is Wi-Fi available on campus?",
    answer: `Yes, the campus has comprehensive Wi-Fi coverage:

**Coverage:**
- All academic blocks
- Library (high-speed, unlimited)
- Hostel common areas
- Cafeteria and canteens
- Auditorium and seminar halls
- Sports complex

**Speed & Access:**
- Academic blocks: Up to 100 Mbps shared
- Library: 1 Gbps fiber connection
- Hostels: 20 Mbps per room (basic plan)

**Student Wi-Fi:**
- Login with student ID and password
- Data limit: 5 GB/day in academic blocks
- Hostel: Based on plan selected

**Premium Plan (Hostel):**
- ₹1,500/semester for unlimited plan
- ₹800/semester for 10 GB/day plan

**Restrictions:**
- Gaming servers restricted during peak hours
- Torrent/P2P blocked
- Social media allowed but throttled during exam days

**Support:**
- IT Help Desk: Room 301, IT Block
- Email: ithelpdesk@campusiq.edu
- Working hours: 8 AM - 8 PM

Report connectivity issues to the IT department.`,
    category: "campus",
    keywords: "wifi internet campus speed hostel academic library plan login",
  },
  {
    question: "What is the process to take a transfer certificate (TC)?",
    answer: `**Transfer Certificate (TC) Application Process:**

**When to apply for TC:**
- When changing colleges
- After completing the program (for job applications)
- When migrating to another university

**Required Steps:**
1. **Clear all dues:** Pay all pending fees, library fines, hostel dues
2. **Return library books:** Clear all library dues
3. **Get clearance from departments:** Lab materials, equipment returned
4. **Hostel clearance:** If applicable, get clearance from warden
5. **Submit TC application:** Administrative Office (Form TC-01)
6. **Principal approval:** TC signed by Principal

**Documents to Submit:**
- TC application form
- All clearance certificates
- Original admission receipt
- ID card (returned at issuance of TC)

**Timeline:** 7-10 working days after clearance from all departments.

**Fee:** First TC is free. Duplicate TC: ₹500.

**Note:** TC is typically not issued during odd semesters without valid reasons. Original documents held by college are returned with TC.`,
    category: "general",
    keywords: "transfer certificate tc apply process clearance dues library hostel documents",
  },
  {
    question: "Are there internship opportunities for students?",
    answer: `**Internship Opportunities:**

**Duration Options:**
- 4-week internship (Semester break)
- 8-week summer internship
- 6-month internship (final year students)

**Company-Facilitated Internships:**
- T&P Cell coordinates with 50+ partner companies
- On-campus company visits for intern selection
- JD (Job Description) posted on Placement Portal

**Self-Arranged Internships:**
- Students can arrange their own internships
- Approval from HoD required
- College provides internship completion letter

**Credit System:**
- 6-month internship: 4-6 credits (final year)
- Shorter internships: Activity points

**Popular Internship Companies (Illustrative):**
TCS, Infosys, Wipro, Bosch, ISRO, DRDO, Start-ups, PSUs (BHEL, NTPC, etc.)

**Stipend Range:** ₹5,000 - ₹50,000/month depending on company

**CGPA Requirement:** Most companies require minimum 6.5 CGPA; some require 7.5+.

Register on the Placement Portal and attend T&P briefing sessions for internship updates.`,
    category: "placements",
    keywords: "internship opportunities duration company portal stipend credit cgpa",
  },
  {
    question: "What are the higher education opportunities after B.Tech?",
    answer: `**Higher Education After B.Tech:**

**Postgraduate Options in India:**
- M.Tech (GATE-based admission): Funded education with ₹12,400/month stipend
- MBA (CAT/MAT/XAT based): Management specialization
- M.Sc. in Computer Science/Data Science
- MCA (if interested in computing without branch restriction)

**Research:**
- Ph.D. programs at IITs, NITs, IISc
- Junior Research Fellowship (CSIR-UGC NET exam)

**Foreign Education:**
- MS in USA: GRE + TOEFL/IELTS required
- MS in Germany: Mostly free tuition (public universities)
- MS in Canada/Australia: Moderate cost
- GRE coaching available through college

**Professional Certifications:**
- Cloud certifications (AWS, Azure, GCP)
- Project Management (PMP, CAPM)
- Data Science certifications

**Government Jobs:**
- UPSC Engineering Services Examination
- PSU recruitment through GATE
- State government engineering services

**Entrepreneurship:**
- College Incubation Centre supports student startups
- Seed funding available through Startup India programs

Career counselling sessions available through the Placement Cell.`,
    category: "placements",
    keywords: "higher education mtech gate mba research phd foreign ms gre upsc psu",
  },
  {
    question: "What is the process to get a duplicate ID card?",
    answer: `**Duplicate ID Card Process:**

**Steps:**
1. Lodge a complaint at the nearest police station for lost ID
2. Get an FIR copy (First Information Report)
3. Visit Administrative Office with:
   - FIR copy (original)
   - Affidavit stating loss of ID card
   - 2 passport-size photos
   - Fee payment receipt
4. Fill the Duplicate ID Card Application Form
5. Submit all documents

**Fee:** ₹200 for duplicate ID card

**Processing Time:** 3-5 working days

**For Damaged ID:**
- Submit damaged card at Admin Office
- Pay ₹100 replacement fee
- New card issued in 2-3 working days

**Important:**
- Carry alternate ID (Aadhar, etc.) until new card is issued
- ID card is mandatory for entering campus, library, exams
- Report damage/loss immediately to avoid misuse

**Contact:** Administrative Office, Ground Floor, Main Block. Working hours: 9 AM - 5 PM.`,
    category: "general",
    keywords: "duplicate id card lost fir affidavit fee process admin office replacement",
  },
  {
    question: "Does the college have an entrepreneurship and startup support?",
    answer: `Yes, we have an active Innovation & Entrepreneurship ecosystem:

**Innovation Centre:**
- Dedicated co-working and prototyping space
- 3D printers, electronics lab, workshop tools
- High-speed internet and computing resources

**Startup Incubation:**
- Up to 10 startups incubated per year
- Office space, mentorship, legal and financial guidance
- Network with angel investors and VCs

**Programs:**
- E-Cell (Entrepreneurship Cell): Student-run
- Annual E-Summit with industry leaders
- Startup weekend hackathons
- Design Thinking workshops

**Funding Support:**
- Startup India registration assistance
- Help applying for government grants (NIDHI, AIM)
- Introduction to seed investors

**Success Stories (Illustrative):**
- Alumni startups in Fintech, EduTech, AgriTech sectors
- 5+ funded startups from college incubator (illustrative)

**Eligibility:**
- Current students and recent alumni (within 2 years)
- Submit idea pitch to E-Cell

**Contact:** Innovation Centre, Block E or ecell@campusiq.edu`,
    category: "general",
    keywords: "startup entrepreneurship innovation incubation ecell funding mentorship",
  },

  // More FAQs to reach 100+
  {
    question: "What is the NSS program and how to enroll?",
    answer: `**National Service Scheme (NSS) at CampusIQ:**

NSS is a Government of India program that develops personality through community service.

**Benefits of NSS:**
- 2 CGPA activity points per year
- Certificate from Government of India
- NCC/NSS bonus in UPSC examinations
- Leadership and personality development

**Activities:**
- Blood donation camps
- Tree plantation drives
- Village adoption and rural development
- Literacy programs
- Disaster management awareness
- Cleanliness drives (Swachh Bharat)
- COVID/health awareness camps

**Annual Special Camp:**
- 7-day residential camp
- Certificate by NSS Programme Officer

**Enrollment:**
- Registration during 1st year orientation week
- Limited seats (usually 100 per batch)
- First-come-first-served

**Commitment:**
- 120 hours of service per year (mandatory for certificate)
- Attend special camp at least once in 2 years

**Contact:** NSS Programme Officer, Room 209, Student Welfare Block`,
    category: "campus",
    keywords: "nss national service scheme enroll activities camp certificate community",
  },
  {
    question: "How does the mentor-mentee system work?",
    answer: `**Mentor-Mentee Program:**

Every student is assigned a faculty mentor for personal and academic guidance.

**Assignment:**
- 1 faculty mentor for every 20 students
- Assigned at the beginning of Year 1
- Same mentor retained for 4 years (unless faculty change)

**Mentor Responsibilities:**
- Academic guidance and subject selection advice
- Career counselling
- Personal issue resolution
- Connect with parents when needed
- Scholarship and opportunity guidance

**Meeting Schedule:**
- Formal meeting: Once per month
- Informal: As needed by student
- Parent-Mentor meeting: Twice a year

**What to Discuss:**
- Academic performance, backlogs, attendance
- Career plans, higher studies, placements
- Personal challenges affecting studies
- Extra-curricular involvement

**How it Helps:**
- Early identification of struggling students
- Personalized attention in large batch
- Better student well-being

Know your mentor: Check Student Portal → Profile → My Mentor`,
    category: "general",
    keywords: "mentor mentee system faculty guidance academic career counselling meeting",
  },
  {
    question: "Are there any international exchange programs?",
    answer: `Yes, we have international collaboration programs:

**Student Exchange Programs:**
- Semester exchange with partner universities in USA, Germany, Japan, Australia
- Duration: 1 semester (5-6 months)
- Credits transferred back to home degree

**Partner Universities (Illustrative):**
- USA: University of Cincinnati, SUNY
- Germany: TU Munich, FH Aachen
- Japan: Osaka University
- Australia: RMIT University

**Eligibility:**
- Minimum CGPA: 8.0
- IELTS/TOEFL score required
- No pending backlogs
- Dean's recommendation

**Funding:**
- Most programs are self-funded
- Some scholarships available (ICCR, DAAD)
- College provides partial financial support for exchange students

**Process:**
1. Express Interest: International Relations Office
2. Apply to partner university
3. Acceptance + Visa
4. Attend orientation at partner institution

**Inbound Exchange:**
- Foreign students also come to our campus
- Cultural exchange enriches campus life

Contact: International Relations Office, Room 301, Admin Block`,
    category: "general",
    keywords: "international exchange programs study abroad semester partner university cgpa",
  },
  {
    question: "What is the grievance redressal mechanism?",
    answer: `**Grievance Redressal System:**

Students can raise grievances through multiple channels:

**Types of Grievances Handled:**
- Academic (grades, attendance, exam disputes)
- Administrative (fee issues, documentation)
- Infrastructure (facilities, maintenance)
- Misconduct (by students or staff)
- Discrimination and harassment

**Hierarchy of Redressal:**

1. **Class Representative → HoD:** First point for academic issues
2. **Student Welfare Officer:** General student concerns
3. **Dean of Student Affairs:** Escalation after HoD level
4. **Principal/Director:** Major issues
5. **College Grievance Committee:** Formal committee review

**Online Grievance Portal:**
- Login to Student Portal
- Grievance Section → Submit New Grievance
- Track status with ticket number
- Response within 15 working days

**ICC (Internal Complaints Committee):**
- For gender-based issues
- Confidential handling
- As per POSH Act requirements

**Ombudsperson:**
- Independent hearing for serious unresolved cases
- University-level escalation

All grievances are addressed fairly and in confidence.`,
    category: "general",
    keywords: "grievance redressal complaint mechanism portal committee student welfare",
  },
  {
    question: "What is the project work requirement for B.Tech?",
    answer: `**B.Tech Project Requirements:**

**Mini Projects:**
- Year 2 / Semester 4: Mini Project 1 (individual or pair)
- Year 3 / Semester 6: Mini Project 2 (team of 2-3)
- Evaluated internally by faculty supervisor

**Main Project (Final Year):**
- Year 4 / Semesters 7 & 8
- Team size: 3-4 students
- Duration: 2 semesters (Phase 1 + Phase 2)

**Evaluation:**
- Phase 1 (Sem 7): Problem definition, literature review, methodology (50 marks)
- Phase 2 (Sem 8): Implementation, results, final presentation (100 marks)
- Evaluated by internal + external examiner committee

**Project Types:**
- Hardware (Electronics, Circuits, Embedded)
- Software (Web, App, ML, AI)
- Research-based
- Industry-sponsored projects

**Industry Projects:**
- Companies sponsor projects with real-world problems
- Selected students may receive stipend
- Preferred for placement advantage

**Submission:**
- Project report (IEEE format)
- Working prototype/code
- Research paper submission encouraged

Talk to your HoD for department-specific project guidelines.`,
    category: "examinations",
    keywords: "project btech final year mini team evaluation phase submission industry",
  },
  {
    question: "How is the CGPA calculated?",
    answer: `**CGPA Calculation Method:**

**Grade Points:**
| Grade | Points |
|-------|--------|
| O (Outstanding) | 10 |
| A+ (Excellent) | 9 |
| A (Very Good) | 8 |
| B+ (Good) | 7 |
| B (Above Average) | 6 |
| C (Average) | 5 |
| F (Fail) | 0 |

**SGPA (Semester GPA):**
SGPA = Σ(Grade Points × Credits) / Σ(Credits for that semester)

**CGPA (Cumulative):**
CGPA = Σ(SGPA × Semester Credits) / Σ(Total Credits)

**Example:**
If Semester 1: SGPA 8.5 with 22 credits, Semester 2: SGPA 9.0 with 24 credits:
CGPA = (8.5×22 + 9.0×24) / (22+24) = (187 + 216) / 46 = 8.76

**Equivalent Percentage:**
Percentage = CGPA × 10 (by most companies)
OR per university conversion table

**Credit Structure:**
- Theory course: 3-4 credits
- Lab course: 1.5-2 credits
- Project: 4-6 credits

Check your Student Portal for semester-wise and cumulative CGPA.`,
    category: "examinations",
    keywords: "cgpa calculate sgpa grade points credits percentage formula semester",
  },
  {
    question: "What is the process for semester registration?",
    answer: `**Semester Registration Process:**

Each student must register for courses at the beginning of every semester.

**When:**
- 1 week before commencement of classes
- Exact dates published in Academic Calendar

**Steps:**
1. Login to Student Portal
2. Go to Semester Registration
3. Check and confirm course list (based on curriculum and cleared subjects)
4. If electives: Select from available options
5. Pay semester fee (if applicable) before registration
6. Submit registration

**Important Notes:**
- Students with backlogs must re-register for failed subjects
- Elective selection is on first-come-first-served basis
- Seats limited in popular electives
- Registration not complete without fee payment

**Late Registration:**
- Allowed up to 2 weeks with late fee of ₹1,000
- Not allowed after 2-week deadline
- May affect eligibility for exam

**Course Load:**
- Standard: 20-24 credits per semester
- Cannot exceed 26 credits
- Cannot drop below 12 credits without special approval

Contact the Academic Section or your faculty advisor for registration issues.`,
    category: "examinations",
    keywords: "semester registration course portal elective backlog fee late deadline academic",
  },
  {
    question: "How can I get my degree certificate after completion?",
    answer: `**Degree Certificate Process:**

**Eligibility:**
- Completed all course requirements
- No pending backlogs
- Cleared all dues (library, hostel, accounts)
- Minimum required CGPA (if applicable per program)

**Provisional Certificate:**
- Issued at time of convocation/graduation
- Used for immediate job requirements
- Valid document until original degree

**Original Degree Certificate:**
- Issued by the affiliating university
- Received through college (after convocation)
- Timeline: Usually 6-12 months after final exam results

**How to Obtain:**
1. Clear all dues and complete NoC process
2. Submit photos (passport size) for degree
3. Attend convocation (mandatory or send representative)
4. Collect from Academic Section after university dispatch

**Transcripts (separate):**
- Apply to Academic Section with fee (₹500 per copy)
- Official university transcripts for foreign university applications
- Processing time: 10-15 working days

**Duplicate Degree:**
- Apply directly to university with affidavit
- Fee: As per university rules
- Processing: 30-60 days

Contact: Academic Section, Room 102, Admin Block`,
    category: "general",
    keywords: "degree certificate provisional original convocation transcript university due",
  },
  {
    question: "Is there a student counseling and mental health support?",
    answer: `Yes, we prioritize student mental health:

**Counseling Services:**
- Full-time professional counselor (M.Phil in Psychology)
- Sessions: Monday to Friday, 9 AM to 5 PM
- Drop-in and appointment-based

**What's Offered:**
- Personal and emotional support
- Academic stress management
- Career decision-making help
- Relationship and family issues
- Anxiety, depression, and adjustment issues
- Crisis intervention

**Confidentiality:**
- All sessions strictly confidential
- Not shared with faculty or parents without consent
- Exceptions: If student is at risk to self or others

**Group Sessions:**
- Stress management workshops
- Exam anxiety sessions before exams
- Mindfulness and meditation
- Resilience-building programs

**Online Support:**
- iCall counseling (TISS): 9152987821
- Vandrevala Foundation: 1860-2662-345
- NIMHANS: 080-46110007

**How to Book:**
- Walk-in to Room 207, Student Welfare Block
- Email: counselor@campusiq.edu
- Anonymous online form (Student Portal → Help → Counseling)

You are not alone. Seeking help is a sign of strength.`,
    category: "campus",
    keywords: "counseling mental health support student stress anxiety depression confidential",
  },
  {
    question: "What is the procedure for applying for medical leave?",
    answer: `**Medical Leave Application Process:**

**For Short Leave (1-3 days):**
1. Inform class teacher/tutor via portal or directly
2. Submit medical certificate from registered doctor within 3 days of rejoining
3. HoD approves leave

**For Extended Leave (more than 3 days):**
1. Inform HoD and Student Welfare Officer
2. Submit Leave Application Form (available at office/portal)
3. Attach medical certificate, hospital records if applicable
4. Emergency contact updated

**Documents Required:**
- Medical certificate from a registered medical practitioner
- Hospital discharge summary (if hospitalized)
- Prescription copies

**Important:**
- Medical leave is considered for attendance condonation
- Does not automatically mean attendance is granted
- Apply within 3 days of rejoining
- Annual medical leave: Generally up to 15 days with proper documentation

**Exam Postponement:**
- Separate application for postponement of exams
- Requires medical certificate and Principal approval
- Submit before the exam if possible

**For Serious Medical Conditions:**
- Register with the Health Centre at the beginning of the year
- Special consideration given for chronic conditions

Medical emergencies: Contact Health Centre (24x7) or campus security.`,
    category: "examinations",
    keywords: "medical leave application certificate attendance condonation sick leave procedure",
  },
  {
    question: "How can alumni of the college connect with current students?",
    answer: `**Alumni Network & Engagement:**

**Alumni Association:**
- Registered alumni association: CampusIQ Alumni Network
- Active on LinkedIn, WhatsApp groups, and official website
- Annual Alumni Meet: Usually in January

**Benefits for Alumni:**
- Free lifelong email ID (alumni.campusiq.edu)
- Access to library resources for 1 year after graduation
- Job postings on alumni portal
- Mentorship opportunities

**Alumni-Student Connect:**
- Guest lectures by alumni professionals
- Industry mentorship program: 1 alumni mentor per 5 students
- Mock interview panels
- Alumni startup internship opportunities

**How to Connect:**
- Register on Alumni Portal: alumni.campusiq.edu
- LinkedIn: Search "CampusIQ College Alumni"
- Alumni WhatsApp community (via T&P Cell)

**Alumni Giving Back:**
- Scholarship funded by senior alumni
- Equipment donations to labs
- Research collaborations

**For Current Students:**
- Reach out to alumni mentors through T&P Cell
- LinkedIn outreach with college connection
- Alumni talks and webinars (regular schedule)

Stay connected—your alumni network is your professional family.`,
    category: "general",
    keywords: "alumni network association connect mentor linkedin meet portal current students",
  },
  {
    question: "What is the procedure to change branch after first year?",
    answer: `**Branch Change Process (After 1st Year):**

**Eligibility:**
- Completed all first-year subjects in first attempt (no backlogs)
- CGPA must be above the cutoff for desired branch (varies each year)
- Seat must be available in target branch

**General Cutoff (Illustrative):**
- Moving to CSE/AI: Typically requires CGPA 9.0+
- ECE: CGPA 8.5+
- Other branches: CGPA 8.0+

**Process:**
1. Applications open: After 2nd semester results
2. Fill Branch Change Application Form (Academic Section)
3. Submit with semester marksheets
4. Academic Committee reviews and decides
5. Result communicated before 3rd semester registration

**Important Notes:**
- Branch change is NOT guaranteed even if eligible
- Based on seat availability in target branch
- No seat opens if target branch is full
- Typically only 5% seats available for branch change
- Applicable only for UG programs (not PG)

**Alternative:**
- Pursue electives from desired branch
- Minor/specialization in preferred area
- Dual degree option (if available)

Consult the Academic Section or your mentor for guidance.`,
    category: "admissions",
    keywords: "branch change process cgpa eligibility first year backlog seat availability",
  },
  {
    question: "What are the rules for using the computer labs?",
    answer: `**Computer Lab Rules and Guidelines:**

**Access:**
- Lab access with valid student ID card
- Available during academic hours
- Extended hours during project season (check notice board)

**Booking:**
- Booking through Student Portal for project work after hours
- Priority given to final-year students during project submission

**Usage Rules:**
- Use only for academic and learning purposes
- Personal data storage on college systems not permitted
- Bring your own USB (scanned before use)
- No food or drinks in lab
- Maintain silence; phone on silent mode

**Software Available:**
- Development tools: VS Code, Eclipse, Android Studio
- Engineering software: MATLAB, AutoCAD, Ansys, CATIA
- Data science: Anaconda, Jupyter, R Studio
- Office suite: Microsoft Office

**Internet:**
- Academic use only
- Social media restricted in labs during class hours
- Torrent/unauthorized downloads: strictly prohibited

**Violations:**
- Minor: Warning and logging
- Major: Lab access suspended for semester

**Support:**
- Lab assistant available during working hours
- Report technical issues: ithelpdesk@campusiq.edu or extension 301`,
    category: "campus",
    keywords: "computer lab rules usage booking software matlab autocad internet id card",
  },
  {
    question: "How is the internal assessment marks distributed?",
    answer: `**Internal Assessment Mark Distribution:**

**For Theory Subjects (40 marks internal):**

| Component | Marks |
|-----------|-------|
| Mid-Term Exam 1 | 15 |
| Mid-Term Exam 2 | 15 |
| Assignments (2 assignments) | 5 |
| Quiz / Class Test | 5 |
| **Total Internal** | **40** |

**For Lab Subjects (typically 60 marks internal):**

| Component | Marks |
|-----------|-------|
| Continuous Assessment | 20 |
| Observation/Record Book | 15 |
| Viva Voce | 10 |
| Lab Internal Exam | 15 |
| **Total Internal** | **60** |

**Attendance Impact:**
- Below 75%: Barred from final exam
- 75-85%: Eligible but scholarship/condonation affected

**Mid-Term Exam Schedule:**
- MTE 1: Around weeks 6-7
- MTE 2: Around weeks 12-13
- Exact dates in Academic Calendar

**Note:** Some departments may vary this distribution. Check your department's guidelines.`,
    category: "examinations",
    keywords: "internal assessment marks distribution midterm assignment quiz lab record viva",
  },
  {
    question: "What support is available for differently-abled students?",
    answer: `**Support for Differently-Abled (Divyangjan) Students:**

**Infrastructure:**
- Ramps and accessible paths in academic blocks
- Accessible restrooms in major blocks
- Lift access in multi-floor buildings
- Reserved parking near main entrance

**Examination Support:**
- Scribe facility (upon application with certificate)
- Extra time (30 minutes per hour)
- Separate exam room if needed
- Reader facility for visually impaired

**Academic Support:**
- Mentor assigned with special care
- Lecture notes shared digitally
- Accessible e-learning resources
- Lab work alternatives where physical work is difficult

**Financial:**
- Scholarship for PH students (government schemes)
- Priority in need-based financial aid

**Certification Required:**
- Disability certificate from government hospital
- Percentage of disability noted (40%+ for most benefits)

**How to Register:**
1. Submit disability certificate to Academic Section at admission
2. Document needs in cooperation with Student Welfare Office
3. Benefits activated from registration

**Contact:** Student Welfare Office, Room 210, Admin Block

Equal opportunity and inclusive education are our commitments.`,
    category: "general",
    keywords: "differently abled disability support scribe extra time accessible scholarship",
  },
  {
    question: "What is the academic calendar for the year?",
    answer: `**Academic Calendar (Illustrative - Generic Pattern):**

**Odd Semester (July – November):**
- Orientation / Registration: Last week of July
- Classes begin: First week of August
- Mid-Term Exam 1: Late September
- Mid-Term Exam 2: Late October
- Last day of classes: Mid-November
- End-Semester Exams: November – December
- Results: January

**Even Semester (January – May):**
- Registration: First week of January
- Classes begin: Second week of January
- Mid-Term Exam 1: Late February
- Mid-Term Exam 2: Late March / early April
- Last day of classes: Late April
- End-Semester Exams: May
- Results: June

**Breaks:**
- Diwali Break: ~5 days
- Republic Day: Jan 26
- Holi / Ugadi: 2-3 days
- Summer Vacation: June – July
- Winter Vacation: Late December

**Note:** This is a general pattern. Actual academic calendar is published on the official college website at the beginning of each academic year. Always follow the official calendar.`,
    category: "examinations",
    keywords: "academic calendar semester schedule mid-term exam dates registration classes",
  },
  {
    question: "Can day scholars use hostel facilities?",
    answer: `**Hostel Facilities for Day Scholars:**

**Regular Access:**
- Canteen and mess (paid separately per meal)
- Sports facilities (same as hostel students)
- Gym (with annual membership)
- Library (same access as all students)
- Medical room during working hours

**Day Scholar Mess Pass:**
- Monthly mess coupon available: ₹3,000-3,500/month (illustrative)
- Access breakfast, lunch, dinner with coupon
- Available at Hostel Office

**Wi-Fi:**
- Same access in academic areas
- Hostel Wi-Fi not accessible for day scholars

**Temporary Hostel Stay:**
- Available during exams or projects (limited availability)
- Apply to Hostel Office 7 days in advance
- Daily rate: ₹250-350 (illustrative)

**Guest Room:**
- Parents/guardians can stay in guest room
- Booking: 48-hour advance notice
- Rate: ₹500-800/night (illustrative)

**What's NOT Available:**
- Regular room allotment without hostel registration
- Overnight access without temporary stay approval

Day scholars are valued members of the community with equal access to all academic facilities.`,
    category: "hostel",
    keywords: "day scholar hostel facilities mess canteen sports gym temporary stay wi-fi",
  },
  {
    question: "What is the NCC program at the college?",
    answer: `**National Cadet Corps (NCC) at CampusIQ:**

**Available Wings:**
- Army Wing (Boys and Girls)
- Air Wing (subject to availability)

**Benefits:**
- Character development, discipline, and leadership
- 2 CGPA activity points per year
- Bonus marks in UPSC Civil Services
- Priority in defence services recruitment
- NCC 'C' certificate holders: Direct NDA/OTA entry benefits

**Activities:**
- Weekly parade (2 days per week, 2 hours each)
- Annual Training Camp (ATC): 10 days
- Republic Day/Independence Day march
- Social service and community events
- Trekking, adventure activities
- Shooting and drill training

**Enrollment:**
- Registration during 1st year orientation
- Physical fitness test and medical check
- Selection based on merit and fitness
- Seats: ~80 per batch

**Certificates:**
- 'B' Certificate: After 2 years
- 'C' Certificate: After 3 years (requires attending RDC/National level camp)

**Contact:** NCC Officer, Room 212, Student Welfare Block

NCC shapes you into a leader, a citizen, and a person of strong character.`,
    category: "campus",
    keywords: "ncc national cadet corps army air wing benefit certificate parade camp",
  },
  {
    question: "What are the rules regarding personal laptops on campus?",
    answer: `**Personal Laptop Policy:**

**Allowed:**
- Personal laptops encouraged in academic blocks
- Use for academic work, coding, project work
- Connect to campus Wi-Fi with student credentials

**Lab Policy:**
- Personal laptops may be used in labs (check with individual faculty)
- Installation of specialized software may require admin rights not available
- College computers available if personal laptop is insufficient

**Hostel:**
- Personal laptops allowed in hostel rooms
- Connect to hostel Wi-Fi plan

**Security:**
- Students responsible for safety of personal devices
- Register laptop serial number with Security Office (optional but recommended)
- Not covered under college insurance

**Software Compliance:**
- Use licensed software
- Free academic licenses available: Microsoft Office 365, MATLAB student version, GitHub Student Pack
- Claim free software through college email ID (.edu)

**Bringing Laptop to Campus:**
- No specific entry restriction
- Laptop bag check at security gate (random checks)

**Repairs:**
- IT Help Desk can assist with software issues
- Hardware repairs: Student's own responsibility

Get your free software licenses from the IT Department with your college email.`,
    category: "campus",
    keywords: "laptop personal policy campus hostel software license wifi security rules",
  },
  {
    question: "How does the college support student startups?",
    answer: `**Student Startup Support:**

**E-Cell (Entrepreneurship Cell):**
- Student-run cell under faculty guidance
- Organizes startup bootcamps, ideation workshops
- Connects students with mentors and investors

**Innovation & Incubation Centre (IIC):**
- As per AICTE/Ministry of Education mandate
- Designated workspace for student innovators
- Access to equipment, printers, tools

**Support Provided:**
1. **Mentorship:** Experienced entrepreneurs and faculty mentors
2. **Legal support:** Company registration, IP filing guidance
3. **Financial:** Help applying for government grants (NIDHI-EIR, AIM-iCREST)
4. **Networking:** Industry connections, investor meets
5. **Infrastructure:** Lab access, internet, office space (limited seats)

**Startup Stage Support:**
- Ideation: Workshops, canvas sessions
- Validation: Customer discovery, MVP building
- Growth: Funding, hiring, scaling guidance

**Recognition:**
- Annual Innovation Award
- Selected startups represent college at national events

**How to Apply:**
- Submit Startup Application to IIC
- Pitch to Selection Committee (twice a year: September, February)
- 5-10 startups selected per cohort

ecell@campusiq.edu or Innovation Centre, Block E`,
    category: "general",
    keywords: "startup student support ecell innovation incubation funding mentorship pitch",
  },
];

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@campusiq.edu" },
    update: {},
    create: {
      email: "admin@campusiq.edu",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create demo user
  const userPassword = await bcrypt.hash("demo123", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@campusiq.edu" },
    update: {},
    create: {
      email: "demo@campusiq.edu",
      name: "Demo Student",
      password: userPassword,
      role: "USER",
    },
  });
  console.log("✅ Demo user created:", demoUser.email);

  // Create user preferences
  await prisma.userPreference.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      theme: "dark",
    },
  });

  // Seed FAQs
  console.log(`🌱 Seeding ${faqs.length} FAQs...`);
  for (const faq of faqs) {
    await prisma.fAQ.create({
      data: {
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        keywords: faq.keywords,
        isActive: true,
        viewCount: Math.floor(Math.random() * 200),
        helpfulCount: Math.floor(Math.random() * 50),
        unhelpfulCount: Math.floor(Math.random() * 5),
      },
    });
  }
  console.log(`✅ ${faqs.length} FAQs seeded`);

  // Create sample conversations for demo user
  const conv1 = await prisma.conversation.create({
    data: {
      userId: demoUser.id,
      title: "B.Tech Admission Query",
      category: "admissions",
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv1.id,
        role: "USER",
        content: "What is the admission process for B.Tech?",
        createdAt: new Date(Date.now() - 86400000),
      },
      {
        conversationId: conv1.id,
        role: "ASSISTANT",
        content:
          "The B.Tech admission process involves online application, JEE Main score submission, document verification, merit list, counselling, and fee payment. Would you like details on any specific step?",
        answerMode: "VERIFIED_FAQ",
        confidence: 0.95,
        createdAt: new Date(Date.now() - 86400000 + 5000),
      },
      {
        conversationId: conv1.id,
        role: "USER",
        content: "What documents do I need?",
        createdAt: new Date(Date.now() - 86400000 + 10000),
      },
      {
        conversationId: conv1.id,
        role: "ASSISTANT",
        content:
          "For admission you need: 10th and 12th marksheets, JEE Main scorecard, Aadhar card, category certificate (if applicable), passport photos, and transfer certificate from your previous school.",
        answerMode: "VERIFIED_FAQ",
        confidence: 0.92,
        createdAt: new Date(Date.now() - 86400000 + 15000),
      },
    ],
  });

  const conv2 = await prisma.conversation.create({
    data: {
      userId: demoUser.id,
      title: "Fee Structure Inquiry",
      category: "fees",
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv2.id,
        role: "USER",
        content: "What is the annual fee for CSE branch?",
        createdAt: new Date(Date.now() - 172800000),
      },
      {
        conversationId: conv2.id,
        role: "ASSISTANT",
        content:
          "The annual fee for CSE is approximately ₹1,60,000 including tuition (₹1,20,000), development fee, library, lab, and exam fees. This is illustrative - please confirm with the Accounts Department.",
        answerMode: "VERIFIED_FAQ",
        confidence: 0.88,
        createdAt: new Date(Date.now() - 172800000 + 5000),
      },
    ],
  });

  // Create sample activities
  await prisma.activity.createMany({
    data: [
      {
        userId: demoUser.id,
        type: "ENQUIRY",
        description: "Asked about B.Tech admission process",
        createdAt: new Date(Date.now() - 86400000),
      },
      {
        userId: demoUser.id,
        type: "CATEGORY_VIEWED",
        description: "Viewed Fees & Payments category",
        createdAt: new Date(Date.now() - 172800000),
      },
      {
        userId: demoUser.id,
        type: "ENQUIRY",
        description: "Asked about scholarship eligibility",
        createdAt: new Date(Date.now() - 259200000),
      },
      {
        userId: demoUser.id,
        type: "FAQ_SAVED",
        description: "Saved answer about hostel facilities",
        createdAt: new Date(Date.now() - 345600000),
      },
    ],
  });

  console.log("✅ Sample data seeded successfully");
  console.log("\n📋 Login credentials:");
  console.log("  Admin: admin@campusiq.edu / admin123");
  console.log("  Demo User: demo@campusiq.edu / demo123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
