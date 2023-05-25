function scrollToContact() {
  document.getElementById("contact").scrollIntoView();
}

//underline active section in nav
function activeNavTab() {
  const sections = [...document.querySelectorAll('section')].reverse()
  const belowSections = []
  sections.forEach(section => {
    if (section.offsetTop < window.scrollY + window.innerHeight * 0.3) {
      belowSections.push(section)
    }
  })
  const activeEl = document.querySelector('.activeMenu').getAttribute("href").slice(1)
  if (belowSections.length && activeEl === belowSections[0].id) return

  const links = [...document.querySelectorAll('nav a')]

  if (!belowSections.length) return 
  const oldAnchors = document.querySelectorAll('nav a.activeMenu')
  const newAnchors = (function (id) {
    let temp = []
    links.forEach(link => {
      if (link.getAttribute("href") === '#' + id) {
        temp.push(link)
      }
    })
    return temp
  })(belowSections[0].id)

  if (!newAnchors.length) return
  oldAnchors.forEach(anchor => anchor.classList.remove('activeMenu'))
  newAnchors.forEach(anchor => anchor.classList.add('activeMenu'))
}

//reveal elements on scroll
function reveal() {
  const reveals = [...document.querySelectorAll('.reveal-right'), ...document.querySelectorAll('.reveal-left'), ...document.querySelectorAll('.reveal-appear')]
  reveals.forEach(reveal => {
    let windowHeight = window.innerHeight
    let revealTop = reveal.getBoundingClientRect().top
    let revealPoint = window.innerHeight * 0.3
    if (revealTop < windowHeight - revealPoint) reveal.classList.add('active')
  })
}

//handle scroll function
function handleScroll() {
  activeNavTab()
  reveal()
  // hide glitched recaptcha icon
  const recaptcha = document.querySelector('.basin-recaptcha-v2-container')
  if (recaptcha) recaptcha.style.display = "none"
}

window.addEventListener('scroll', handleScroll)

async function submitMessage() {
  // select message input if empty
  const msgInput = document.getElementById('formMessage')
  if (!msgInput.value.length) msgInput.focus()

  const data = {
    name: document.getElementById('formName') ? document.getElementById('formName').value : '',
    email: document.getElementById('formEmail') ? document.getElementById('formEmail').value : '',
    subject: document.getElementById('formSubject') ? document.getElementById('formSubject').value : '',
    message: document.getElementById('formMessage') ? document.getElementById('formMessage').value : '',
  }
  const date = (function() {
    const dateNow = new Date()
    const string = dateNow.getFullYear() + '-' + dateNow.getMonth() + '-' + dateNow.getDay() + '-' + dateNow.getHours() + ':' + dateNow.getMinutes() + ":" + dateNow.getSeconds()
    return string
  })()
  const response = await fetch(`https://portfolio-7a4dd-default-rtdb.europe-west1.firebasedatabase.app/messages/${date}.json`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
  const responseData = await response.json()
}


// cursor animation
// set the starting position of the cursor outside of the screen
let clientX = -50;
let clientY = -50;
const innerCursor = document.querySelector(".cursor--small");

const initCursor = () => {
  // add listener to track the current mouse position
  document.addEventListener("mousemove", e => {
    // if touch event - skip
    if (e.sourceCapabilities.firesTouchEvents) return
    clientX = e.clientX;
    clientY = e.clientY;
  });
  
  // transform the innerCursor to the current mouse position
  const render = () => {
    innerCursor.style.transform = `translate(${clientX}px, ${clientY}px)`;
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
};

initCursor();

let lastX = 0;
let lastY = 0;
let isStuck = false;
let showCursor = false;
let group, stuckX, stuckY, fillOuterCursor;

const initCanvas = () => {
  const canvas = document.querySelector(".cursor--canvas");
  const shapeBounds = {
    width: 75,
    height: 75
  };
  paper.setup(canvas);
  const strokeColor = "rgba(233, 69, 96, 0.3)";
  const strokeWidth = 2;
  const segments = 8;
  const radius = 20;
  
  //noisy circle
  const noiseScale = 150; // speed
  const noiseRange = 4; // range of distortion
  let isNoisy = false; // state
  
  // the base shape for the noisy circle
  const polygon = new paper.Path.RegularPolygon(
    new paper.Point(0, 0),
    segments,
    radius
  );
  polygon.strokeColor = strokeColor;
  polygon.strokeWidth = strokeWidth;
  polygon.smooth();
  group = new paper.Group([polygon]);
  group.applyMatrix = false;
  
  const noiseObjects = polygon.segments.map(() => new SimplexNoise());
  let bigCoordinates = [];
  
  // function for linear interpolation of values
  const lerp = (a, b, n) => {
    return (1 - n) * a + n * b;
  };
  
  // function to map a value from one range to another range
  const map = (value, in_min, in_max, out_min, out_max) => {
    return (
      ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
    );
  };
  
  // the draw loop of Paper.js 
  // (60fps with requestAnimationFrame under the hood)
  paper.view.onFrame = event => {
    // using linear interpolation, the circle will move 0.2 (20%)
    // of the distance between its current position and the mouse
    // coordinates per Frame
    lastX = lerp(lastX, clientX, 0.2);
    lastY = lerp(lastY, clientY, 0.2);
    group.position = new paper.Point(lastX, lastY);
  }
}

initCanvas();

// handle mobile nav
let nav = document.querySelector('nav.mobile')
function toggleNav() {
  nav.classList.toggle('showNav')
}

document.getElementById('switchNav').addEventListener('click', toggleNav)
document.querySelectorAll('nav.mobile ul a').forEach(link => link.addEventListener('click', toggleNav))


// click effect
function clickEffect(e) {
  // disable click animation for mouse
  if (e.pointerType === "mouse") return
  // disable click animation for inputs
  const tag = e.target.tagName
  if (tag === "INPUT" || tag === "TEXTAREA") return

  const click = document.createElement('div')
  click.className = 'clickEffect'
  click.style.top = e.clientY + 'px'
  click.style.left = e.clientX + 'px'
  document.body.appendChild(click)
  click.addEventListener('animationend', () => {
    click.remove()
  })
}
document.addEventListener('click', clickEffect)