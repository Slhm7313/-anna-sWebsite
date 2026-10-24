// Prepares a user-approved problem report email addressed to both site contacts.
const reportRecipients = ['g.slimistinos.dev@gmail.com', 'gnwsi.2023@gmail.com'];
export function createProblemReportMailto(impact, description, pageTitle, pageUrl, timestamp = new Date()) {
    const subject = `[Αναφορά προβλήματος] ${impact}`;
    const body = [
        'Περιγραφή προβλήματος:',
        description.trim(),
        '',
        `Επίδραση: ${impact}`,
        `Σελίδα: ${pageTitle}`,
        `Διεύθυνση σελίδας: ${pageUrl}`,
        `Ημερομηνία: ${timestamp.toLocaleString('el-GR')}`,
        '',
        'Και οι δύο παραλήπτες βρίσκονται στο πεδίο «Προς» και μπορούν να απαντήσουν στην αναφορά.'
    ].join('\n');
    return `mailto:${reportRecipients.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
export function setupProblemReportForm() {
    const form = document.getElementById('problem-report-form');
    const status = document.getElementById('problem-report-status');
    const issueField = document.getElementById('problem-description');
    const impactField = document.getElementById('problem-impact');
    if (!(form instanceof HTMLFormElement)
        || !(status instanceof HTMLElement)
        || !(issueField instanceof HTMLTextAreaElement)
        || !(impactField instanceof HTMLSelectElement)) {
        return;
    }
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!form.reportValidity())
            return;
        const formData = new FormData(form);
        const impact = String(formData.get('impact') ?? '');
        const description = String(formData.get('description') ?? '');
        const pageUrl = String(formData.get('page-url') ?? window.location.href);
        const pageTitle = String(formData.get('page-title') ?? document.title);
        const mailtoUrl = createProblemReportMailto(impact, description, pageTitle, pageUrl);
        status.textContent = 'Ανοίγουμε την εφαρμογή email σας. Ελέγξτε το μήνυμα και πατήστε «Αποστολή» για να το λάβουν και οι δύο παραλήπτες.';
        const emailLink = document.createElement('a');
        emailLink.href = mailtoUrl;
        emailLink.click();
    });
}
//# sourceMappingURL=problem-report.js.map