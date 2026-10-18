"use strict";
function setupScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    const elementsToAnimate = document.querySelectorAll('#header_howWeWork-text, #header-img, #small_text, #footer-card, .methodology-list li');
    elementsToAnimate.forEach(el => {
        el.classList.add('reveal-on-scroll');
        scrollObserver.observe(el);
    });
}
function setupReviewModal() {
    const openBtn = document.getElementById('open-review-btn');
    const closeBtn = document.getElementById('close-review-btn');
    const modal = document.getElementById('review-modal');
    const form = document.getElementById('review-form');
    const successMsg = document.getElementById('review-success-msg');
    if (!openBtn || !closeBtn || !modal || !form)
        return;
    const openModal = () => {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    };
    openBtn.addEventListener('click', openModal);
    const closeModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        openBtn.focus();
    };
    closeBtn.addEventListener('click', closeModal);
    if (window.location.hash === '#review-modal')
        openModal();
    modal.addEventListener('click', (e) => {
        if (e.target === modal)
            closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active'))
            closeModal();
    });
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const rating = formData.get('rating');
        const role = document.getElementById('review-role').value;
        const duration = document.getElementById('review-duration').value;
        const highlights = formData.getAll('highlights');
        const name = document.getElementById('review-name').value;
        const comment = document.getElementById('review-comment').value;
        const reviewPayload = {
            rating,
            role,
            duration,
            highlights,
            name,
            comment,
            timestamp: new Date().toISOString()
        };
        console.log("Review Submitted Successfully:", reviewPayload);
        form.style.display = 'none';
        if (successMsg)
            successMsg.classList.remove('review-success-hidden');
        setTimeout(() => {
            closeModal();
            setTimeout(() => {
                form.reset();
                form.style.display = 'block';
                if (successMsg)
                    successMsg.classList.add('review-success-hidden');
            }, 300);
        }, 2000);
    });
}
window.addEventListener('DOMContentLoaded', () => {
    setupScrollAnimations();
    setupReviewModal();
});
//# sourceMappingURL=app.js.map