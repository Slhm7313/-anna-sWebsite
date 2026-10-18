"use strict";
function autoScalePage() {
    const currentWidth = window.innerWidth;
    const baseWidth = 1000;
    const baseFontSize = 16;
    if (currentWidth < baseWidth) {
        const scaleRatio = currentWidth / baseWidth;
        document.documentElement.style.fontSize = baseFontSize * scaleRatio + "px";
    }
    else {
        document.documentElement.style.fontSize = baseFontSize + "px";
    }
}
window.addEventListener("load", autoScalePage);
window.addEventListener("resize", autoScalePage);
//# sourceMappingURL=app.js.map