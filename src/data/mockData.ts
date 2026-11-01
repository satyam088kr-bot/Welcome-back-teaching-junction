import { Announcement, ClassCategory, ContactInfo, Course, LiveClass, PaymentRecord, StudyMaterial, SubjectCategory, User } from '../types';

export const ALL_CLASSES: ClassCategory[] = [
  'Class 6th',
  'Class 7th',
  'Class 8th',
  'Class 9th',
  'Class 10th',
  'Class 11th',
  'Class 12th',
  'Competitive Exams',
];

export const ALL_SUBJECTS: SubjectCategory[] = [
  'Science',
  'Mathematics',
  'Social Science',
  'History',
  'Geography',
  'Civics',
  'Economics',
  'Hindi',
  'English',
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin-1',
    name: 'Satyam Kumar (Director)',
    email: 'satyam088kr@gmail.com',
    phone: '+91 9876543210',
    role: 'admin',
    status: 'approved',
    assignedClass: 'Class 10th',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-10T10:00:00Z',
    approvedAt: '2026-01-10T10:00:00Z',
    enrolledCourseIds: ['course-1', 'course-2', 'course-3', 'course-4'],
  },
  {
    id: 'user-student-approved',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 9811223344',
    role: 'student',
    status: 'approved',
    assignedClass: 'Class 10th',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-15T08:30:00Z',
    approvedAt: '2026-02-15T12:00:00Z',
    enrolledCourseIds: ['course-1', 'course-3'],
  },
  {
    id: 'user-student-pending',
    name: 'Pooja Verma',
    email: 'pooja.verma@example.com',
    phone: '+91 9922334455',
    role: 'student',
    status: 'pending',
    assignedClass: 'Class 12th',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-10-31T14:20:00Z',
    enrolledCourseIds: [],
  },
  {
    id: 'user-student-rejected',
    name: 'Rohan Gupta',
    email: 'rohan.gupta@example.com',
    phone: '+91 9733445566',
    role: 'student',
    status: 'rejected',
    assignedClass: 'Class 9th',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-10-25T11:15:00Z',
    rejectionReason: 'Invalid student roll number and unverified phone contact. Please contact coaching office.',
    enrolledCourseIds: [],
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    title: '[DEMO] Class 10th Science Complete Foundation Batch (NCERT)',
    slug: 'class-10-science-complete-batch',
    classCategory: 'Class 10th',
    subject: 'Science',
    type: 'free',
    price: 0,
    originalPrice: 1999,
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    description: 'Comprehensive NCERT Class 10 Science course covering Chemical Reactions, Electricity, Light, and Life Processes with animated lectures and chapter-wise PDF notes.',
    instructor: 'Er. Satyam Kumar (B.Tech, 8+ Yrs Exp)',
    language: 'Hindi & English (Hinglish)',
    rating: 4.9,
    enrolledCount: 1420,
    duration: '65 Hours | 42 Lectures',
    isFeatured: true,
    createdAt: '2026-01-15T00:00:00Z',
    chapters: [
      {
        id: 'ch-1',
        title: 'Chapter 1: Chemical Reactions and Equations',
        order: 1,
        lessons: [
          {
            id: 'les-1',
            title: '1.1 Introduction to Chemical Changes & Characteristics',
            duration: '24 mins',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            pdfNoteUrl: '/notes/science_ch1.pdf',
            pdfTitle: 'Chapter 1 Handwritten Class Notes (PDF)',
            isFreePreview: true,
            summary: 'Understand reactants, products, chemical evolution of gas, change in state and temperature.',
          },
          {
            id: 'les-2',
            title: '1.2 Balancing Chemical Equations (Step-by-Step Method)',
            duration: '32 mins',
            pdfNoteUrl: '/notes/balancing_formulas.pdf',
            pdfTitle: 'Balancing Formula Sheet & 20 Practice Questions',
            isFreePreview: true,
            summary: 'Hit-and-trial method explained with law of conservation of mass examples.',
          },
          {
            id: 'les-3',
            title: '1.3 Types of Reactions: Combination, Decomposition, Displacement',
            duration: '40 mins',
            pdfNoteUrl: '/notes/reaction_types.pdf',
            pdfTitle: 'Reaction Types & Board Exam PYQs',
            isFreePreview: false,
            summary: 'Detailed experimental observations with thermal, electrolytic, and photolytic decomposition.',
          },
        ],
      },
      {
        id: 'ch-2',
        title: 'Chapter 10: Light - Reflection and Refraction',
        order: 2,
        lessons: [
          {
            id: 'les-4',
            title: '2.1 Laws of Reflection and Spherical Mirrors',
            duration: '28 mins',
            pdfNoteUrl: '/notes/light_ray_diagrams.pdf',
            pdfTitle: 'Ray Diagrams Master Sheet',
            isFreePreview: true,
            summary: 'Concave and convex mirror ray diagrams and real vs virtual images.',
          },
          {
            id: 'les-5',
            title: '2.2 Mirror Formula and Magnification Numericals',
            duration: '35 mins',
            pdfNoteUrl: '/notes/mirror_numericals.pdf',
            pdfTitle: 'Top 15 Solved Board Numericals',
            isFreePreview: false,
            summary: 'Sign conventions (Cartesian) and step-by-step problem-solving tips.',
          },
        ],
      },
    ],
  },
  {
    id: 'course-2',
    title: '[DEMO] Class 10th Mathematics 100/100 Target Batch',
    slug: 'class-10-maths-target-batch',
    classCategory: 'Class 10th',
    subject: 'Mathematics',
    type: 'paid',
    price: 999,
    originalPrice: 2499,
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    description: 'Master Class 10 Mathematics for CBSE & State Boards. Complete RD Sharma & NCERT exemplar solutions, Trigonometry shortcuts, Quadratic equations, and test series.',
    instructor: 'Prof. R.K. Mishra (Senior Faculty)',
    language: 'Hindi & English (Hinglish)',
    rating: 4.95,
    enrolledCount: 890,
    duration: '80 Hours | 55 Lectures',
    isFeatured: true,
    createdAt: '2026-02-01T00:00:00Z',
    chapters: [
      {
        id: 'ch-math-1',
        title: 'Chapter 8: Introduction to Trigonometry',
        order: 1,
        lessons: [
          {
            id: 'les-m1',
            title: '1.1 Trigonometric Ratios & Right Triangle Basics',
            duration: '26 mins',
            pdfNoteUrl: '/notes/trigo_ratios.pdf',
            pdfTitle: 'Trigonometric Identities Cheat Sheet (PDF)',
            isFreePreview: true,
            summary: 'Understanding sin, cos, tan, cosec, sec, cot with easy mnemonic tricks.',
          },
          {
            id: 'les-m2',
            title: '1.2 Trigonometric Table 0° to 90° Finger Trick',
            duration: '20 mins',
            pdfNoteUrl: '/notes/trigo_table.pdf',
            pdfTitle: 'Value Table & Shortcuts',
            isFreePreview: true,
            summary: 'How to memorize and reconstruct the table in 30 seconds inside the exam hall.',
          },
          {
            id: 'les-m3',
            title: '1.3 Proving Trigonometric Identities (High Scoring Questions)',
            duration: '45 mins',
            pdfNoteUrl: '/notes/trigo_proofs.pdf',
            pdfTitle: 'Top 25 Repeated Board Proof Questions',
            isFreePreview: false,
            summary: 'Mastering identities: sin²θ + cos²θ = 1 and algebraic manipulations.',
          },
        ],
      },
      {
        id: 'ch-math-2',
        title: 'Chapter 4: Quadratic Equations & Word Problems',
        order: 2,
        lessons: [
          {
            id: 'les-m4',
            title: '2.1 Factorisation & Quadratic Formula (Sridharacharya)',
            duration: '35 mins',
            pdfNoteUrl: '/notes/quadratic_formulas.pdf',
            pdfTitle: 'Quadratic Formulas & Discriminant Rules',
            isFreePreview: false,
            summary: 'Nature of roots using D = b² - 4ac and solving real-world speed/distance problems.',
          },
        ],
      },
    ],
  },
  {
    id: 'course-3',
    title: '[DEMO] Class 12th Physics Board Exam Crash Course 2026',
    slug: 'class-12-physics-crash-course',
    classCategory: 'Class 12th',
    subject: 'Science',
    type: 'paid',
    price: 1499,
    originalPrice: 3999,
    thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=80',
    description: 'High-yield derivation booster, formula handbook, numerical solving techniques, and last 10 years previous exam papers with model solutions.',
    instructor: 'Er. Satyam Kumar (Director)',
    language: 'Hindi & English (Hinglish)',
    rating: 4.88,
    enrolledCount: 650,
    duration: '50 Hours | 38 Lectures',
    isFeatured: true,
    createdAt: '2026-03-01T00:00:00Z',
    chapters: [
      {
        id: 'ch-phy-1',
        title: 'Unit 1: Electrostatics & Electric Potential',
        order: 1,
        lessons: [
          {
            id: 'les-p1',
            title: "1.1 Coulomb's Law, Electric Field & Gauss Theorem Derivation",
            duration: '40 mins',
            pdfNoteUrl: '/notes/gauss_derivation.pdf',
            pdfTitle: "Gauss's Theorem Complete 5-Mark Derivation",
            isFreePreview: true,
            summary: 'Step-by-step derivation for infinitely long wire, cylinder and charged plane sheet.',
          },
          {
            id: 'les-p2',
            title: '1.2 Capacitance & Dielectric Breakdown Numericals',
            duration: '38 mins',
            pdfNoteUrl: '/notes/capacitors_solved.pdf',
            pdfTitle: 'Capacitors Formula Sheet & NCERT Solved Numericals',
            isFreePreview: false,
            summary: 'Series and parallel combination with dielectric insertion analysis.',
          },
        ],
      },
    ],
  },
  {
    id: 'course-4',
    title: '[DEMO] Class 9th & 10th Social Science All-In-One (History, Civics, Geo)',
    slug: 'class-9-10-social-science-all-in-one',
    classCategory: 'Class 9th',
    subject: 'Social Science',
    type: 'free',
    price: 0,
    originalPrice: 1299,
    thumbnail: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80',
    description: 'Complete animated story-based breakdown of Nationalism in Europe, Federalism, Resources and Development, with mind maps and timeline charts.',
    instructor: 'Sunita Sharma (M.A. History, B.Ed)',
    language: 'Hindi & English',
    rating: 4.85,
    enrolledCount: 1100,
    duration: '40 Hours | 30 Lectures',
    isFeatured: false,
    createdAt: '2026-03-10T00:00:00Z',
    chapters: [
      {
        id: 'ch-sst-1',
        title: 'History: The Rise of Nationalism in Europe',
        order: 1,
        lessons: [
          {
            id: 'les-s1',
            title: '1.1 Frederic Sorrieu Vision & French Revolution Impact',
            duration: '30 mins',
            pdfNoteUrl: '/notes/nationalism_europe_mindmap.pdf',
            pdfTitle: 'Nationalism in Europe Timeline & Mind Map',
            isFreePreview: true,
            summary: 'Napoleonic code of 1804 and spread of liberal nationalist ideas.',
          },
          {
            id: 'les-s2',
            title: '1.2 Unification of Germany and Italy',
            duration: '32 mins',
            pdfNoteUrl: '/notes/unification_notes.pdf',
            pdfTitle: 'Germany & Italy Unification Comparative Table',
            isFreePreview: true,
            summary: 'Role of Otto von Bismarck, Mazzini, Garibaldi, and Cavour.',
          },
        ],
      },
    ],
  },
  {
    id: 'course-5',
    title: '[DEMO] Competitive Exams: General Science & Quantitative Aptitude Foundation',
    slug: 'competitive-exams-general-science-aptitude',
    classCategory: 'Competitive Exams',
    subject: 'Science',
    type: 'paid',
    price: 799,
    originalPrice: 2199,
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
    description: 'Special foundational course for SSC, Railways, State Police, and Defence entrance exams. Rapid calculation tricks and high-frequency science concepts.',
    instructor: 'Vikram Singh (Ex-Govt Officer)',
    language: 'Hindi',
    rating: 4.92,
    enrolledCount: 780,
    duration: '55 Hours | 45 Lectures',
    isFeatured: false,
    createdAt: '2026-03-15T00:00:00Z',
    chapters: [
      {
        id: 'ch-comp-1',
        title: 'Speed Mathematics: Vedic Multiplication & Square Roots',
        order: 1,
        lessons: [
          {
            id: 'les-c1',
            title: '1.1 Multiply Any 2-Digit & 3-Digit Number in 3 Seconds',
            duration: '22 mins',
            pdfNoteUrl: '/notes/vedic_maths.pdf',
            pdfTitle: 'Vedic Maths 50 Practice Drills',
            isFreePreview: true,
            summary: 'Cross-multiplication and base method techniques.',
          },
        ],
      },
    ],
  },
];

export const INITIAL_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat-1',
    title: '[DEMO] Class 10 Science Chapter 1 Handwritten Golden Notes',
    description: 'Complete NCERT summary, chemical reaction definitions, balanced equations and board exam expected questions with solutions.',
    classCategory: 'Class 10th',
    subject: 'Science',
    chapterName: 'Chemical Reactions & Equations',
    fileUrl: '/mock/chemical_reactions_notes.pdf',
    fileSize: '4.2 MB',
    pageCount: 18,
    downloadCount: 3840,
    type: 'handwritten_notes',
    isProtected: true,
    createdAt: '2026-01-20T00:00:00Z',
    contentPreview: `TEACHING JUNCTION COACHING - STUDY MATERIAL
SUBJECT: SCIENCE | CLASS: 10TH
CHAPTER 1: CHEMICAL REACTIONS AND EQUATIONS

1. Chemical Reaction:
A process in which one or more substances (reactants) are converted to one or more different substances (products).
Signs of chemical reaction:
a) Change in state
b) Change in color
c) Evolution of a gas
d) Change in temperature

2. Balanced Chemical Equation:
According to the Law of Conservation of Mass: Mass can neither be created nor destroyed in a chemical reaction.
Total mass of elements present in products = Total mass in reactants.
Example: 3Fe(s) + 4H2O(g) -> Fe3O4(s) + 4H2(g)

3. Types of Reactions:
- Combination Reaction: CaO + H2O -> Ca(OH)2 + Heat (Slaked lime)
- Decomposition Reaction: 2FeSO4 -(heat)-> Fe2O3 + SO2 + SO3
- Displacement Reaction: Fe + CuSO4 -> FeSO4 + Cu
- Double Displacement: Na2SO4 + BaCl2 -> BaSO4(ppt) + 2NaCl
- Redox: Oxidation is gain of oxygen/loss of hydrogen; Reduction is loss of oxygen/gain of hydrogen.

Exam Tip: Always mention physical states (s, l, g, aq) for 100% marks in Board exams!`,
  },
  {
    id: 'mat-2',
    title: '[DEMO] Class 10 Mathematics All Formulas & Theorems Handbook',
    description: 'Quick revision handbook covering Real Numbers, Polynomials, Linear Equations, Quadratic, AP, Triangles, and Trigonometry.',
    classCategory: 'Class 10th',
    subject: 'Mathematics',
    chapterName: 'Full Syllabus Formula Sheet',
    fileUrl: '/mock/maths_formula_sheet.pdf',
    fileSize: '6.5 MB',
    pageCount: 24,
    downloadCount: 5210,
    type: 'formula_sheet',
    isProtected: true,
    createdAt: '2026-02-05T00:00:00Z',
    contentPreview: `TEACHING JUNCTION COACHING - FORMULA HANDBOOK
MATHEMATICS CLASS 10TH | HIGH-SCORING BOOSTER

1. REAL NUMBERS:
- Fundamental Theorem of Arithmetic: Every composite number can be uniquely expressed as product of primes.
- HCF(a, b) × LCM(a, b) = a × b

2. POLYNOMIALS:
- Quadratic Polynomial: P(x) = ax² + bx + c
- Sum of zeroes (α + β) = -b/a
- Product of zeroes (αβ) = c/a

3. QUADRATIC EQUATIONS:
- Roots: x = [-b ± √(b² - 4ac)] / 2a
- Discriminant D = b² - 4ac
  - If D > 0: Two distinct real roots
  - If D = 0: Two equal real roots
  - If D < 0: No real roots

4. TRIGONOMETRY IDENTITIES:
- sin²θ + cos²θ = 1
- 1 + tan²θ = sec²θ
- 1 + cot²θ = cosec²θ`,
  },
  {
    id: 'mat-3',
    title: '[DEMO] Class 12 Physics 10-Year Chapterwise Solved PYQs',
    description: 'Past 10 years CBSE and State Board previous year questions with step-by-step marking scheme answers and derivations.',
    classCategory: 'Class 12th',
    subject: 'Science',
    chapterName: 'Electrostatics & Current Electricity',
    fileUrl: '/mock/physics_12_pyq.pdf',
    fileSize: '8.1 MB',
    pageCount: 36,
    downloadCount: 2980,
    type: 'pyq_paper',
    isProtected: true,
    createdAt: '2026-02-18T00:00:00Z',
    contentPreview: `TEACHING JUNCTION COACHING - PREVIOUS YEARS PAPERS
CLASS 12TH PHYSICS - SOLVED BOARD QUESTIONS

Q1 (CBSE 2024 - 3 Marks):
State Gauss's law in electrostatics. Using this law derive an expression for the electric field due to a uniformly charged thin spherical shell of radius R at a point outside the shell.

Solution:
Gauss's Law Statement: The total electric flux through any closed surface is equal to 1/ε₀ times the total charge enclosed by the surface:
∮ E · dA = q_enclosed / ε₀

Derivation:
Consider a spherical Gaussian surface of radius r (where r > R) concentric with the charged shell.
By spherical symmetry, E is radial and has the same magnitude at all points on this surface.
∮ E · dA = E ∮ dA = E (4πr²)
Applying Gauss's law:
E (4πr²) = q / ε₀
=> E = 1 / (4πε₀) · q / r²

Thus, for points outside the shell, the electric field behaves as if all the charge were concentrated at the center. [3/3 Marks]`,
  },
  {
    id: 'mat-4',
    title: '[DEMO] Class 9th Social Science Complete Map Work & NCERT Summary',
    description: 'High-yield map items for India Size and Location, Physical Features, Drainage, and Climate with marking guidelines.',
    classCategory: 'Class 9th',
    subject: 'Geography',
    chapterName: 'Map Skills & Key Concepts',
    fileUrl: '/mock/geography_maps.pdf',
    fileSize: '3.8 MB',
    pageCount: 14,
    downloadCount: 1650,
    type: 'ncert_solution',
    isProtected: true,
    createdAt: '2026-03-02T00:00:00Z',
    contentPreview: `TEACHING JUNCTION COACHING - MAP WORK GUIDE
CLASS 9 SOCIAL SCIENCE - GEOGRAPHY

Essential Map Items:
1. Mountain Peaks: K2, Kanchenjunga, Anai Mudi
2. Plateaus: Deccan Plateau, Chota Nagpur Plateau, Malwa Plateau
3. Rivers: Indus, Ganga, Brahmaputra, Narmada, Tapi, Godavari, Krishna, Kaveri
4. Lakes: Wular, Pulicat, Sambhar, Chilika

Remember: Map questions carry 4 compulsory marks in exams. Practice labeling neatly with a pencil!`,
  },
  {
    id: 'mat-5',
    title: '[DEMO] Class 8th Mathematics Rational Numbers & Linear Equations Notes',
    description: 'Concepts made simple with visual diagrams, solved exercise problems, and chapter-end self-assessment test.',
    classCategory: 'Class 8th',
    subject: 'Mathematics',
    chapterName: 'Rational Numbers & Linear Equations',
    fileUrl: '/mock/class8_maths.pdf',
    fileSize: '2.9 MB',
    pageCount: 12,
    downloadCount: 1120,
    type: 'handwritten_notes',
    isProtected: true,
    createdAt: '2026-03-08T00:00:00Z',
    contentPreview: `TEACHING JUNCTION COACHING
CLASS 8 MATHEMATICS - CHAPTER 1: RATIONAL NUMBERS

Definition:
A number that can be expressed in the form p/q, where p and q are integers and q ≠ 0.

Properties:
1. Closure Property: Rational numbers are closed under addition, subtraction, and multiplication.
2. Commutative Property: a + b = b + a; a × b = b × a
3. Associative Property: (a + b) + c = a + (b + c)
4. Distributive Property: a × (b + c) = (a × b) + (a × c)

Additive Identity is 0.
Multiplicative Identity is 1.`,
  },
  {
    id: 'mat-6',
    title: '[DEMO] Competitive Exams: History & Polity Rapid Revision Chart',
    description: 'Chronological timeline of Indian National Movement (1857-1947), Constitutional Articles, Fundamental Rights, and Amendments.',
    classCategory: 'Competitive Exams',
    subject: 'History',
    chapterName: 'Indian Freedom Struggle & Constitution',
    fileUrl: '/mock/competitive_history.pdf',
    fileSize: '5.4 MB',
    pageCount: 20,
    downloadCount: 3410,
    type: 'sample_paper',
    isProtected: true,
    createdAt: '2026-03-12T00:00:00Z',
    contentPreview: `TEACHING JUNCTION COACHING - COMPETITIVE EXAMS WING
RAPID REVISION: INDIAN NATIONAL MOVEMENT & POLITY

Timeline:
- 1857: First War of Indian Independence
- 1885: Formation of Indian National Congress (A.O. Hume)
- 1905: Partition of Bengal (Lord Curzon) & Swadeshi Movement
- 1915: Gandhiji returns to India from South Africa
- 1919: Jallianwala Bagh Massacre & Rowlatt Act
- 1920: Non-Cooperation & Khilafat Movement
- 1930: Dandi March & Civil Disobedience Movement
- 1942: Quit India Movement ("Do or Die")
- 1947: Independence of India

Indian Constitution Key Articles:
- Art 14: Equality before law
- Art 19: Protection of freedom of speech and expression
- Art 21: Protection of life and personal liberty
- Art 32: Right to Constitutional Remedies (Heart & Soul - Dr. B.R. Ambedkar)`,
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: '📢 Admission Open for Class 10th & 12th Board Target Batches 2026-27',
    content: 'Special doubt-clearing sessions, weekly offline/online mock tests, and handwritten notes provided to all enrolled students. Limited seats per batch.',
    category: 'batch',
    urgent: true,
    date: '2026-10-28',
    author: 'Director Office',
  },
  {
    id: 'ann-2',
    title: '📝 Notice: Sunday Mega Mock Test for Class 10th Science & Maths',
    content: 'All approved students are required to participate in the online practice test scheduled this Sunday from 10:00 AM to 1:00 PM. Results and rankings will be published in the student portal.',
    category: 'exam',
    urgent: false,
    date: '2026-10-30',
    author: 'Examination Cell',
  },
  {
    id: 'ann-3',
    title: '🎉 Diwali & Chhath Puja Holiday Schedule',
    content: 'Offline coaching classes will remain closed from November 10th to 15th. Online recorded lectures and study materials will remain accessible 24x7 in the app.',
    category: 'holiday',
    urgent: false,
    date: '2026-11-01',
    author: 'Administration',
  },
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-1',
    studentId: 'user-student-approved',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@example.com',
    studentPhone: '+91 9811223344',
    courseId: 'course-2',
    courseTitle: '[DEMO] Class 10th Mathematics 100/100 Target Batch',
    amount: 999,
    paymentMethod: 'upi',
    transactionId: '430129482910',
    status: 'pending_verification',
    submittedAt: '2026-10-31T16:45:00Z',
    notes: 'Paid via PhonePe. Reference number: 430129482910.',
  },
  {
    id: 'pay-2',
    studentId: 'user-student-approved',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@example.com',
    studentPhone: '+91 9811223344',
    courseId: 'course-3',
    courseTitle: '[DEMO] Class 12th Physics Board Exam Crash Course 2026',
    amount: 1499,
    paymentMethod: 'upi',
    transactionId: '429188471902',
    status: 'verified',
    submittedAt: '2026-10-28T10:15:00Z',
    verifiedAt: '2026-10-28T11:00:00Z',
    notes: 'Verified by Admin Satyam Kumar.',
  },
];

export const INITIAL_CONTACT: ContactInfo = {
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  email: 'satyam088kr@gmail.com',
  address: 'Teaching Junction Coaching Study Centre, Main Campus Road, Near Gandhi Chowk, Patna, Bihar - 800001',
  website: 'https://teachingjunction.in',
  officeHours: 'Monday - Saturday: 8:00 AM - 7:30 PM | Sunday: 9:00 AM - 1:00 PM',
  directorName: 'Er. Satyam Kumar (Director & Senior Faculty)',
  mapEmbedUrl: 'https://maps.google.com/?q=Teaching+Junction+Coaching',
  updatedAt: '2026-11-01T09:00:00Z',
};

export const INITIAL_LIVE_CLASSES: LiveClass[] = [
  {
    id: 'live-1',
    title: '[LIVE NOW] Class 10th Science Board Revision: Chemical Equations & Life Processes',
    classCategory: 'Class 10th',
    subject: 'Science',
    teacher: 'Er. Satyam Kumar (Director)',
    date: 'Today',
    startTime: '18:00 IST',
    duration: '60 mins',
    description: 'Interactive board exam doubt solving, balancing tricks, and high-frequency numericals with live student Q&A.',
    meetingUrl: 'https://meet.google.com/abc-defg-hij',
    platform: 'google_meet',
    status: 'live_now',
    isFreeForApprovedStudents: true,
    createdAt: '2026-11-01T08:00:00Z',
  },
  {
    id: 'live-2',
    title: '[UPCOMING] Class 12th Physics: Electrostatics Gauss Law & Solved Derivations',
    classCategory: 'Class 12th',
    subject: 'Science',
    teacher: 'Er. Satyam Kumar',
    date: 'Tomorrow',
    startTime: '17:30 IST',
    duration: '75 mins',
    description: 'Deep dive into spherical shells, electrostatic flux, and past 10 years repeated derivation questions.',
    meetingUrl: 'https://youtube.com/live/demo-stream',
    platform: 'youtube_live',
    status: 'upcoming',
    isFreeForApprovedStudents: true,
    createdAt: '2026-11-01T08:30:00Z',
  },
  {
    id: 'live-3',
    title: '[UPCOMING] Class 10th Mathematics: Trigonometry Value Table Finger Tricks',
    classCategory: 'Class 10th',
    subject: 'Mathematics',
    teacher: 'Prof. R.K. Mishra',
    date: 'Day After Tomorrow',
    startTime: '19:00 IST',
    duration: '60 mins',
    description: 'Master the table in 30 seconds inside the examination hall with mnemonics and zero cramming.',
    meetingUrl: 'https://meet.google.com/xyz-uvwx-rst',
    platform: 'google_meet',
    status: 'upcoming',
    isFreeForApprovedStudents: true,
    createdAt: '2026-11-01T08:45:00Z',
  },
  {
    id: 'live-4',
    title: '[COMPLETED] Class 9th & 10th Social Science: Nationalism in Europe Mega Marathon',
    classCategory: 'Class 10th',
    subject: 'Social Science',
    teacher: 'Sunita Sharma (Senior Faculty)',
    date: 'Yesterday',
    startTime: '16:00 IST',
    duration: '90 mins',
    description: 'Complete revision of French Revolution, unification maps, and high scoring 5-mark board answers.',
    meetingUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    platform: 'youtube_live',
    status: 'completed',
    isFreeForApprovedStudents: true,
    createdAt: '2026-10-31T08:00:00Z',
  },
];

