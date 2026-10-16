/**
 * Healthcare Assistance Chatbot — Intent Engine
 *
 * This is a simple rule-based chatbot.
 * It is NOT an AI/LLM. It does NOT:
 *   - diagnose diseases
 *   - prescribe medication
 *   - replace a doctor
 *
 * It answers application-level questions:
 *   how to book, cancel, find a doctor, view prescription, etc.
 *
 * How it works:
 *   1. The user message is lowercased and matched against keyword patterns.
 *   2. The first matching intent returns a predefined response.
 *   3. If no intent matches, a fallback response is given.
 */

const intents = [
  {
    id: 'greeting',
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy'],
    response: "Hello! I'm MediConnect's health assistant. I can help you with booking appointments, finding doctors, viewing prescriptions, and more. What can I help you with today?",
  },
  {
    id: 'book_appointment',
    patterns: ['book', 'schedule', 'appointment', 'book appointment', 'how do i book', 'make an appointment'],
    response: "To book an appointment:\n1. Go to **Find Doctor** from your dashboard.\n2. Browse or search for a doctor by name or specialization.\n3. Click on a doctor's profile.\n4. Select an available date and time slot.\n5. Confirm your booking.\n\nYou'll receive a confirmation once the doctor accepts your request.",
  },
  {
    id: 'cancel_appointment',
    patterns: ['cancel', 'cancel appointment', 'how to cancel', 'remove appointment'],
    response: "To cancel an appointment:\n1. Go to **My Appointments** in your dashboard.\n2. Find the appointment you want to cancel.\n3. Click on it to open the details.\n4. Click the **Cancel appointment** button.\n\nNote: Please cancel as early as possible so the doctor's slot becomes available for other patients.",
  },
  {
    id: 'reschedule',
    patterns: ['reschedule', 'change appointment', 'change date', 'different time', 'postpone'],
    response: "To reschedule an appointment:\n1. Go to **My Appointments**.\n2. Open the appointment you want to reschedule.\n3. Click **Reschedule**.\n4. Select a new date and time slot.\n5. Confirm the new time.\n\nThe doctor will be notified of the change.",
  },
  {
    id: 'find_doctor',
    patterns: ['find doctor', 'search doctor', 'look for doctor', 'specialist', 'which doctor', 'how do i find'],
    response: "To find a doctor:\n1. Click **Find Doctor** from your dashboard or the navigation.\n2. Use the search bar to search by doctor name or specialization.\n3. Use the specialization filter to narrow results.\n4. Click any doctor card to view their full profile, qualifications, and available slots.",
  },
  {
    id: 'prescription',
    patterns: ['prescription', 'medicine', 'medication', 'my prescription', 'view prescription', 'where prescription'],
    response: "To view your prescriptions:\n1. Go to **Prescriptions** in your dashboard menu.\n2. All your prescriptions are listed with the issuing doctor and date.\n3. Click any prescription to see the full medicine list and instructions.\n\nPrescriptions are created by your doctor after a consultation.",
  },
  {
    id: 'medical_records',
    patterns: ['medical record', 'medical history', 'health history', 'consultation history', 'past visits'],
    response: "To view your medical records:\n1. Go to **Medical Records** in your dashboard.\n2. You'll see a timeline of all your past consultations.\n3. Each entry shows the date, doctor, diagnosis, and notes.\n\nYour records are private and can only be accessed by you and your treating doctors.",
  },
  {
    id: 'reports',
    patterns: ['report', 'upload report', 'lab report', 'test result', 'scan', 'upload file'],
    response: "To upload a medical report:\n1. Go to **Reports** in your dashboard.\n2. Click **Upload Report**.\n3. Enter a title, select the report type (lab, radiology, etc.).\n4. Select the file from your device (PDF, image, or Word — max 10MB).\n5. Click **Upload**.\n\nYour uploaded reports can be shared with your doctor during a consultation.",
  },
  {
    id: 'profile',
    patterns: ['profile', 'update profile', 'change name', 'change phone', 'edit profile', 'personal information'],
    response: "To update your profile:\n1. Click your name or avatar in the top navigation.\n2. Go to **Profile Settings**.\n3. Update your name, phone, date of birth, blood group, or address.\n4. Click **Save changes**.",
  },
  {
    id: 'notifications',
    patterns: ['notification', 'alert', 'reminder', 'where notification', 'bell'],
    response: "Notifications appear in the bell icon (🔔) at the top of your dashboard. You'll be notified for:\n• Appointment confirmations\n• Appointment cancellations\n• New prescriptions\n• Follow-up reminders\n\nClick the bell to see all your notifications.",
  },
  {
    id: 'doctor_availability',
    patterns: ['availability', 'available', 'when is doctor', 'doctor free', 'open slots', 'time slot'],
    response: "Doctor availability is shown on their profile page. Each doctor sets their weekly schedule with available time slots. When you open a doctor's profile and select a date, only the available (unbooked) time slots will appear for you to choose from.",
  },
  {
    id: 'safety_disclaimer',
    patterns: ['diagnose', 'diagnosis', 'what disease', 'do i have', 'my symptoms', 'should i take', 'is it serious'],
    response: "⚠️ I'm a healthcare assistant chatbot, not a medical professional. I cannot diagnose conditions, recommend medication, or evaluate your symptoms.\n\nIf you're experiencing health concerns, please **book an appointment** with a doctor through MediConnect. For emergencies, contact emergency services immediately.",
  },
  {
    id: 'contact',
    patterns: ['contact', 'support', 'help', 'problem', 'issue', 'not working'],
    response: "If you're experiencing a technical issue with MediConnect:\n1. Try refreshing the page.\n2. Check your internet connection.\n3. Clear your browser cache and try again.\n\nFor persistent issues, this platform is a college project. Please contact your system administrator.",
  },
  {
    id: 'logout',
    patterns: ['logout', 'log out', 'sign out', 'how to logout'],
    response: "To log out:\n1. Click your name or avatar in the top navigation.\n2. Click **Log out**.\n\nYou'll be taken back to the home page. Your session data will be cleared from the browser.",
  },
  {
    id: 'thank_you',
    patterns: ['thank', 'thanks', 'thank you', 'great', 'helpful', 'perfect', 'awesome'],
    response: "You're welcome! Is there anything else I can help you with? 😊",
  },
];

/**
 * matchIntent(message) → { intent, response }
 * Returns the best matching intent or a fallback.
 */
const matchIntent = (message) => {
  const lower = message.toLowerCase().trim();

  for (const intent of intents) {
    for (const pattern of intent.patterns) {
      if (lower.includes(pattern)) {
        return { intentId: intent.id, response: intent.response };
      }
    }
  }

  // Fallback
  return {
    intentId: 'unknown',
    response:
      "I'm not sure I understand that. I can help with:\n• Booking appointments\n• Finding doctors\n• Viewing prescriptions\n• Uploading reports\n• Medical records\n• Profile updates\n\nWhat would you like help with?",
  };
};

module.exports = { matchIntent };
