export interface LegalSection {
  id: string;
  title: string;
  content: string[];
  subsections?: { subtitle: string; details: string[] }[];
}

export const TERMS_OF_USE_SECTIONS: LegalSection[] = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: [
      'Welcome to StudyPal ("Service", "we", "our", or "us"). By accessing, browsing, registering for, or using StudyPal via our web application or mobile interface, you ("User", "Student", or "You") agree to be bound by these Terms of Use and our accompanying Privacy Policy.',
      'If you are under 18 years of age (or the legal age of majority in your jurisdiction), you represent that you have received permission from your parent or legal guardian to access and use the Service. If you do not agree to all terms and conditions set forth herein, you must immediately discontinue use of StudyPal.'
    ]
  },
  {
    id: 'service-description',
    title: '2. Description of the Service',
    content: [
      'StudyPal is an AI-powered interactive study coach and educational companion designed to assist learners in understanding academic concepts, step-by-step problem solving, homework comprehension, and subject mastery.',
      'Features include image-based homework scanning, OCR recognition, interactive mathematical and scientific breakdowns, practice quiz generation, flashcard synthesis, and cloud session history synchronization powered by Google AI (Gemini) and Google Firebase.'
    ]
  },
  {
    id: 'academic-integrity',
    title: '3. Educational Purpose & Academic Integrity',
    content: [
      'StudyPal is engineered strictly as a pedagogical comprehension tool to explain the next step, verify your work, and foster self-directed learning. We are dedicated to supporting authentic educational achievement.',
      'You explicitly agree NOT to use StudyPal to:',
      '• Engage in unauthorized assistance, academic dishonesty, plagiarism, or honor code violations.',
      '• Complete active proctored examinations, timed quizzes, or assessments where external computational or AI tools are prohibited by your educational institution.',
      '• Submit AI-generated explanations verbatim as your own original coursework when prohibited by classroom guidelines.',
      'Instructors and academic institutions reserve the right to establish their own policies regarding AI study aids; you bear full responsibility for complying with your school or university\'s academic integrity standards.'
    ]
  },
  {
    id: 'ai-disclaimer',
    title: '4. AI-Generated Output & Accuracy Disclaimer',
    content: [
      'StudyPal leverages advanced large language and vision models (including Google Gemini) to interpret user queries, analyze homework images, and generate solutions.',
      'While we strive for the highest degree of accuracy, artificial intelligence outputs may occasionally contain inaccuracies, incomplete derivations, or computational anomalies ("hallucinations").',
      'The Service is provided on an "as is" and "as available" basis without warranties of any kind. StudyPal should not be used as a replacement for certified academic instruction, official grading keys, or professional tutoring.'
    ]
  },
  {
    id: 'user-accounts',
    title: '5. Accounts, Authentication & Security',
    content: [
      'You may use StudyPal as an anonymous guest with local device storage, or register for an authenticated account via email or Google Single Sign-On (SSO) supported by Firebase Authentication.',
      'You are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized access or security breach.'
    ]
  },
  {
    id: 'payments-subscriptions',
    title: '6. Purchases, Subscriptions & Digital Access',
    content: [
      'StudyPal may offer premium access tiers, one-time purchases, or enhanced capabilities through authorized digital checkout links (including Stripe or merchant partner platforms).',
      'All purchases and transaction amounts are disclosed at the point of sale. Unless required by applicable law or specifically stated in promotional terms, all payments for digital services are non-refundable once activated.',
      'If you have inquiries regarding billing, receipts, or plan upgrades, please contact our support team.'
    ]
  },
  {
    id: 'intellectual-property',
    title: '7. Intellectual Property & User Content',
    content: [
      'You retain ownership of any homework photos, questions, or notes that you upload or submit to StudyPal ("User Content"). By uploading content, you grant StudyPal a non-exclusive, worldwide, royalty-free license to process, format, and display your content solely for the purpose of delivering the Service to you.',
      'All trademarks, logos, interfaces, code, designs, and proprietary assets belonging to StudyPal remain the exclusive property of StudyPal and its licensors.'
    ]
  },
  {
    id: 'acceptable-use',
    title: '8. Prohibited Conduct',
    content: [
      'You agree not to reverse engineer, decompile, scrape, overload, or compromise the infrastructure of StudyPal. You must not submit unlawful, harassing, obscene, infringing, or malicious content through the image scanner or text prompt inputs.'
    ]
  },
  {
    id: 'third-party',
    title: '9. Third-Party Services & Advertising',
    content: [
      'StudyPal integrates with third-party providers including Google Firebase (cloud storage and auth), Google Generative AI (Gemini model API), and Google AdSense for advertising display.',
      'Third-party links, advertisements, and payment portals are governed by their respective terms and privacy policies. We do not endorse or assume liability for third-party products, content, or services.'
    ]
  },
  {
    id: 'limitation-liability',
    title: '10. Limitation of Liability',
    content: [
      'To the fullest extent permitted by applicable law, StudyPal and its affiliates, directors, officers, and licensors shall not be liable for any indirect, incidental, consequential, punitive, or special damages, including loss of data, grade outcomes, or educational penalties arising from your use or inability to use the Service.'
    ]
  },
  {
    id: 'changes-terms',
    title: '11. Changes to Terms',
    content: [
      'We reserve the right to modify or replace these Terms of Use at any time. When material revisions occur, we will update the "Last Updated" date at the top of these terms. Continued use of the Service following posted modifications constitutes your acceptance of the updated terms.'
    ]
  }
];

export const PRIVACY_POLICY_SECTIONS: LegalSection[] = [
  {
    id: 'privacy-intro',
    title: '1. Introduction & Overview',
    content: [
      'At StudyPal, we respect your privacy and are committed to safeguarding the personal information and learning materials you entrust to us.',
      'This Privacy Policy describes how StudyPal ("we", "us", or "our") collects, uses, stores, shares, and protects information when you visit our website, use our AI homework assistant, or interact with our learning tools.'
    ]
  },
  {
    id: 'data-collected',
    title: '2. Information We Collect',
    content: [
      'We collect information in the following categories:',
      '• Account Information: When you register through email or Google SSO via Firebase Authentication, we collect your email address, display name, and avatar URL if provided.',
      '• Study & Homework Content: Photographs of homework assignments, textbook problems, OCR text extractions, prompt queries, step-by-step solutions, and generated quizzes.',
      '• Device & Diagnostic Information: Browser type, operating system, approximate geographic region (country/state level), timestamp logs, and error telemetry to maintain service reliability.',
      '• Guest Mode Data: If you use StudyPal without creating an account, your study history and scan logs are stored strictly inside your browser\'s local storage (localStorage) and are not linked to a user profile.'
    ]
  },
  {
    id: 'data-use',
    title: '3. How We Use Your Information',
    content: [
      'We use the information we collect to:',
      '• Deliver accurate AI-generated problem derivations, hints, and concept summaries.',
      '• Sync your study sessions, history, and bookmarks across multiple devices via Firebase Cloud Firestore.',
      '• Personalize learning modules, quizzes, and practice materials according to your study subjects.',
      '• Detect and prevent fraudulent activities, system abuse, and violation of our educational standards.',
      '• Provide customer support and respond to user feedback.'
    ]
  },
  {
    id: 'ai-processing',
    title: '4. AI Model Processing & Data Confidentiality',
    content: [
      'StudyPal utilizes Google\'s Gemini AI models to analyze images and solve user-submitted academic problems. Queries and uploaded homework images sent to the Gemini API are processed in accordance with Google Cloud and AI Studio enterprise privacy commitments.',
      'We do not sell your personal data or homework materials to data brokers. Your academic submissions are processed strictly to generate responses for your active session.'
    ]
  },
  {
    id: 'cookies-adsense',
    title: '5. Cookies, Advertising & Google AdSense',
    content: [
      'We use essential cookies and session tokens to keep you securely signed in and remember your workspace preferences.',
      'StudyPal may display advertisements supplied by Google AdSense to support free access to our study tools. Google and its advertising partners may use cookies (such as the DoubleClick cookie) to serve ads based on your prior visits to our website or other websites on the Internet.',
      'You can opt out of personalized advertising by visiting Google\'s Ads Settings (www.google.com/settings/ads) or through the Digital Advertising Alliance (optout.aboutads.info).'
    ]
  },
  {
    id: 'data-storage-retention',
    title: '6. Data Storage, Security & Retention',
    content: [
      'Your authenticated data is secured using Google Cloud Firestore in enterprise data centers equipped with encryption in transit (TLS/SSL) and encryption at rest (AES-256).',
      'You maintain full control over your study records. You can delete individual homework scans or use the "Clear All" function in the History view at any time to purge your stored history records.',
      'Guest users may clear their local history immediately by clearing their browser\'s site cache or clicking "Clear All" in the History dashboard.'
    ]
  },
  {
    id: 'children-privacy',
    title: '7. Student & Children\'s Privacy (COPPA / FERPA Compliance)',
    content: [
      'Protecting young learners is paramount. StudyPal does not knowingly collect personal contact details or engage in targeted behavioral profiling of children under the age of 13 without verifiable parental or school authorization.',
      'If you believe a child under 13 has provided personal information without proper consent, please contact us immediately, and we will promptly remove the account and associated records.'
    ]
  },
  {
    id: 'user-rights',
    title: '8. Your Rights & Choices',
    content: [
      'Depending on your jurisdiction (such as under GDPR, CCPA, or applicable regional privacy laws), you may have the following rights:',
      '• Access: Request a copy of the personal information we hold about you.',
      '• Rectification: Update or correct your profile information.',
      '• Deletion / Erasure: Request the deletion of your account and all associated cloud study records.',
      '• Opt-Out: Manage cookie and advertising preferences in your browser or device settings.'
    ]
  },
  {
    id: 'contact-us',
    title: '9. Contact Us',
    content: [
      'If you have questions, concerns, or requests regarding this Privacy Policy, your personal data, or our academic privacy practices, please contact us through our official support portal or email us at support@studypal.app.'
    ]
  }
];
