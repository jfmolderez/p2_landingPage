/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
*/

/**
 * Define Global Variables
 * 
*/
const navParent = document.getElementById("navbar__list");
const sectionNodes = document.querySelectorAll('section');
const navDict = {};
let active = sectionNodes[0].id;

/**
 * End Global Variables
 * Start Helper Functions
 * 
*/

function buildNavigation() {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < sectionNodes.length; i++) {
        const navLine = document.createElement('li');
        const navLink = document.createElement('a');
        navLink.setAttribute("class", "menu__link");
        navLink.classList.add(sectionNodes[i].id);
        navLink.setAttribute("href", `#${sectionNodes[i].id}`);
        navLink.textContent = sectionNodes[i].dataset.nav;
        navLine.appendChild(navLink);
        fragment.appendChild(navLine);

        navDict[sectionNodes[i].dataset.nav] = sectionNodes[i].id
    }
    navParent.appendChild(fragment);
}

function offset(el, absolute) {
    let scrollLeft = 0;
    let scrollTop = 0;
    const rect = el.getBoundingClientRect();
    if (absolute) {
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    }
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

function navigateToSection(event) {
    event.preventDefault(); // for this to work in case of event delegation, the listener must be a capture listener
    const sectionId = navDict[event.target.textContent];
    const sectionEl = document.getElementById(sectionId);
    const offsetEl = offset(sectionEl, true);
    window.scrollTo({top: offsetEl.top, left: offsetEl.left, behavior: 'smooth'});
}

function setActiveSection() {
    // determine the highest section in the viewport
    let yOffsets = []
    for (let i = 0; i < sectionNodes.length; i++) {
        yOffsets.push(offset(sectionNodes[i], false).top);
    }
    yOffsets = yOffsets.map(x => Math.abs(x));
    const idx = yOffsets.indexOf(Math.min(...yOffsets));
    const idTop = sectionNodes[idx].id;

    // set the active section
    if (idTop != active) {
        const previousActiveSection =  document.getElementById(active);
        previousActiveSection.classList.remove('active');
        const previousActiveLink = document.querySelector(`a.${active}`);
        previousActiveLink.classList.remove('active');

        const activeSection = document.getElementById(idTop);
        activeSection.classList.add('active');
        active = idTop;
        const activeLink = document.querySelector(`a.${active}`);
        activeLink.classList.add('active');
    }
}

/**
 * End Helper Functions
 * Begin Main Functions
 * 
*/
document.addEventListener('DOMContentLoaded', function() {
    // build the nav
    buildNavigation();  

    // Add class 'active' to section and nav. link 
    const activeSection = document.getElementById(active);
    activeSection.classList.add('active');
    const activeLink = document.querySelector(`a.${active}`);
    activeLink.classList.add('active');

    // Navigation click activation (event delegation)
    navParent.addEventListener('click', navigateToSection, true); //  event delegation --> capture listener

    // Set active section upon scrolling the window
    // Use of a timer to detect the end of scrolling
    let timer = null;
    window.addEventListener('scroll', function() {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(setActiveSection, 150);
    });

    // Navigate to first navigation item
    window.scrollTo({top:-100, left: 0, behavior: 'smooth'});
})






/**
 * End Main Functions
 *
*/


