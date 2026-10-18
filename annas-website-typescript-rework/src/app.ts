//#important this function auto scale the page to be the same to all screen devices
function autoScalePage() {
    // Το πλάτος της οθόνης του χρήστη
    const currentWidth = window.innerWidth;

    // Το πλάτος της οθόνης για το οποίο σχεδίασες το site (π.χ. 1000px για το grid σου)
    const baseWidth = 1000;

    // Η βασική γραμματοσειρά (συνήθως 16px)
    const baseFontSize = 16;

    if (currentWidth < baseWidth) {
        // Υπολογισμός αναλογίας: π.χ. αν το κινητό είναι 375px, η αναλογία είναι 0.375
        const scaleRatio = currentWidth / baseWidth;

        // Ορίζουμε το νέο font-size στο html (π.χ. 16 * 0.375 = 6px)
        document.documentElement.style.fontSize = baseFontSize * scaleRatio + "px";
    } else {
        // Αν είναι σε desktop, επαναφέραμε το κανονικό μέγεθος
        document.documentElement.style.fontSize = baseFontSize + "px";
    }
}

// Τρέχει όταν φορτώνει η σελίδα και όταν αλλάζει μέγεθος η οθόνη (π.χ. στροφή κινητού)
window.addEventListener("load", autoScalePage);
window.addEventListener("resize", autoScalePage);