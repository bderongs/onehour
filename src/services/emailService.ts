import emailjs from '@emailjs/browser';

export async function sendConsultationEmail(data: any) {
    // Replace these with your EmailJS credentials
    const PUBLIC_KEY = "YOUR_PUBLIC_KEY";
    const TEMPLATE_ID = "YOUR_TEMPLATE_ID";
    const SERVICE_ID = "YOUR_SERVICE_ID";

    const templateParams = {
        to_email: "your-gmail@gmail.com",
        from_name: data.name,
        from_email: data.email,
        phone: data.phone,
        preferred_contact: data.preferredContact,
        problem_summary: data.problemSummary,
        chat_history: data.chatHistory,
        submitted_at: data.submittedAt
    };

    try {
        const result = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            templateParams,
            PUBLIC_KEY
        );
        return result;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
} 