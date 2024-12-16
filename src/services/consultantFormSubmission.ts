export async function submitConsultantForm(data: {
    firstName: string;
    lastName: string;
    linkedin?: string;
    email: string;
}) {
    // Replace with your new Google Form pre-filled URL for consultants
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScX3EDIKp0TnSZNvexUUv3aHyQo9lEpiw1H7KDyU-IUoPfWWA/formResponse';

    const formData = new URLSearchParams({
        'entry.145915408': data.firstName,    // Replace with actual form field IDs
        'entry.1599037512': data.lastName,
        'entry.310146666': data.linkedin || '',
        'entry.1888449810': data.email || ''
    });

    return fetch(`${GOOGLE_FORM_URL}?${formData.toString()}`, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
} 