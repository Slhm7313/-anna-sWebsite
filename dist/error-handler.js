const recentErrors = new Set();
function getResourceError(target) {
    if (!(target instanceof HTMLElement))
        return null;
    const resourceUrl = target instanceof HTMLImageElement
        ? target.currentSrc || target.src
        : target instanceof HTMLScriptElement
            ? target.src
            : target instanceof HTMLLinkElement
                ? target.href
                : target instanceof HTMLMediaElement || target instanceof HTMLSourceElement
                    ? target.src
                    : null;
    if (!resourceUrl)
        return null;
    let url;
    try {
        url = new URL(resourceUrl, window.location.href);
    }
    catch {
        return null;
    }
    if (url.origin !== window.location.origin)
        return null;
    if (target instanceof HTMLImageElement) {
        target.classList.add('site-image-load-failed');
        return {
            title: 'Μια εικόνα δεν φορτώθηκε',
            explanation: 'Η εικόνα που ζητήσατε δεν είναι διαθέσιμη αυτή τη στιγμή.',
            suggestion: 'Ανανεώστε τη σελίδα. Αν το πρόβλημα συνεχιστεί, επικοινωνήστε μαζί μας.',
            diagnostic: `Image failed to load: ${url.href}`
        };
    }
    if (target instanceof HTMLLinkElement && target.rel === 'stylesheet') {
        return {
            title: 'Δεν φορτώθηκε μέρος της εμφάνισης',
            explanation: 'Ορισμένα στοιχεία της σελίδας μπορεί να μην εμφανίζονται σωστά.',
            suggestion: 'Ελέγξτε τη σύνδεσή σας και ανανεώστε τη σελίδα.',
            diagnostic: `Stylesheet failed to load: ${url.href}`
        };
    }
    if (target instanceof HTMLScriptElement) {
        return {
            title: 'Δεν φορτώθηκε μια λειτουργία της σελίδας',
            explanation: 'Ορισμένα κουμπιά ή διαδραστικά στοιχεία μπορεί να μη λειτουργούν.',
            suggestion: 'Ανανεώστε τη σελίδα. Αν το πρόβλημα συνεχιστεί, επικοινωνήστε μαζί μας.',
            diagnostic: `Script failed to load: ${url.href}`
        };
    }
    return {
        title: 'Ένας πόρος της σελίδας δεν φορτώθηκε',
        explanation: 'Ένα στοιχείο που χρειάζεται η σελίδα δεν είναι διαθέσιμο αυτή τη στιγμή.',
        suggestion: 'Ελέγξτε τη σύνδεσή σας και ανανεώστε τη σελίδα.',
        diagnostic: `Page resource failed to load: ${url.href}`
    };
}
function appendErrorNotification(error) {
    if (!document.body)
        return;
    const errorKey = `${error.title}:${error.diagnostic}`;
    if (recentErrors.has(errorKey))
        return;
    recentErrors.add(errorKey);
    window.setTimeout(() => recentErrors.delete(errorKey), 5000);
    console.error(error.diagnostic);
    let notifications = document.getElementById('site-error-notifications');
    if (!notifications) {
        notifications = document.createElement('section');
        notifications.id = 'site-error-notifications';
        notifications.className = 'site-error-notifications';
        notifications.setAttribute('aria-label', 'Ειδοποιήσεις σφαλμάτων');
        document.body.append(notifications);
    }
    const notification = document.createElement('article');
    notification.className = 'site-error-message';
    notification.setAttribute('role', 'alert');
    const heading = document.createElement('h2');
    heading.textContent = error.title;
    const explanation = document.createElement('p');
    explanation.textContent = error.explanation;
    const suggestion = document.createElement('p');
    suggestion.className = 'site-error-suggestion';
    suggestion.textContent = `Τι μπορείτε να κάνετε: ${error.suggestion}`;
    const dismissButton = document.createElement('button');
    dismissButton.className = 'site-error-dismiss';
    dismissButton.type = 'button';
    dismissButton.textContent = 'Κλείσιμο';
    dismissButton.setAttribute('aria-label', `Κλείσιμο ειδοποίησης: ${error.title}`);
    dismissButton.addEventListener('click', () => notification.remove());
    notification.append(heading, explanation, suggestion, dismissButton);
    notifications.append(notification);
}
function handlePageError(event) {
    const resourceError = getResourceError(event.target);
    if (resourceError) {
        appendErrorNotification(resourceError);
        return;
    }
    const error = event.error;
    const message = error instanceof Error ? error.message : event.message;
    console.error('Uncaught page error:', error ?? event.message);
    appendErrorNotification({
        title: 'Μια λειτουργία της σελίδας δεν ολοκληρώθηκε',
        explanation: 'Κάτι δεν λειτούργησε όπως αναμενόταν. Το υπόλοιπο περιεχόμενο παραμένει διαθέσιμο.',
        suggestion: 'Ανανεώστε τη σελίδα. Αν το πρόβλημα επαναληφθεί, επικοινωνήστε μαζί μας.',
        diagnostic: `Uncaught page error: ${message || 'Unknown browser error'}`
    });
}
export function installGlobalErrorHandler() {
    window.addEventListener('error', handlePageError, true);
    window.addEventListener('unhandledrejection', (event) => {
        const reason = event.reason;
        console.error('Unhandled promise rejection:', reason);
        appendErrorNotification({
            title: 'Μια ενέργεια δεν ολοκληρώθηκε',
            explanation: 'Η σελίδα δεν μπόρεσε να ολοκληρώσει μια ενέργεια.',
            suggestion: 'Δοκιμάστε ξανά σε λίγο. Αν το πρόβλημα συνεχιστεί, ανανεώστε τη σελίδα ή επικοινωνήστε μαζί μας.',
            diagnostic: `Unhandled promise rejection: ${reason instanceof Error ? reason.message : String(reason)}`
        });
    });
}
//# sourceMappingURL=error-handler.js.map