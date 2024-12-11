export async function submitToGoogleForm(data: any) {
    // Replace with your Google Form pre-filled URL
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScnQ2Oar_UrZLJ28f9WZeV91Gf47gFIJy8tcuEXlKImfjFDYQ/formResponse';

    const formData = new URLSearchParams({
        'entry.1980778891': data.name,             // Replace with your actual form field IDs
        'entry.410712562': data.email,
        'entry.1260668012': data.phone,
        'entry.921299297': data.problemSummary,
        'entry.1306789927': data.chatHistory
    });

    return fetch(`${GOOGLE_FORM_URL}?${formData.toString()}`, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
} 