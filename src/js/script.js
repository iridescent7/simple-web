var introElements = [];

document.addEventListener('DOMContentLoaded', () => {
    introElements = document.getElementsByClassName('intro');
});

window.addEventListener('scroll', () => {
    Array.prototype.forEach.call(introElements, element => {
        let elementRect = element.getBoundingClientRect();
        let absRelativeY = Math.abs(elementRect.y);

        if (absRelativeY <= elementRect.height) {
            element.style.opacity = 1.0 - Math.round(absRelativeY / elementRect.height * 100) / 100;
            element.style.top = Math.round(absRelativeY * 0.5) + 'px';
        }
    });
});
