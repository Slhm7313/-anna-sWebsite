// Prepares and sends the problem report automatically via Formspree.
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/myeezryr';
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
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!form.reportValidity())
            return;
        // Visual feedback during submission
        status.textContent = 'Αποστολή αναφοράς...';
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton)
            submitButton.disabled = true;
        const formData = new FormData(form);
        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                status.textContent = 'Η αναφορά σας στάλθηκε επιτυχώς! Ευχαριστούμε.';
                form.reset();
                // Επαναφορά κρυφών πεδίων URL και τίτλου (αν υπάρχουν)
                const pageUrlInput = document.getElementById('report-page-url');
                const pageTitleInput = document.getElementById('report-page-title');
                if (pageUrlInput)
                    pageUrlInput.value = window.location.href;
                if (pageTitleInput)
                    pageTitleInput.value = document.title;
            }
            else {
                // Προσπάθεια ανάγνωσης συγκεκριμένου σφάλματος από το Formspree
                const data = await response.json().catch(() => null);
                if (data && data.errors && Array.isArray(data.errors)) {
                    status.textContent = data.errors.map((err) => err.message).join(', ');
                }
                else {
                    status.textContent = 'Προέκυψε σφάλμα κατά την αποστολή. Παρακαλούμε δοκιμάστε ξανά.';
                }
            }
        }
        catch (error) {
            status.textContent = 'Σφάλμα σύνδεσης. Παρακαλούμε ελέγξτε τη σύνδεσή σας στο διαδίκτυο.';
        }
        finally {
            if (submitButton)
                submitButton.disabled = false;
        }
    });
}
//# sourceMappingURL=problem-report.js.map