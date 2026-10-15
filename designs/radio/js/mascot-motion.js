// API visual de la mascota. Los eventos reales podrán usar window.radioMascot.
const mascot = document.querySelector('.radio-mascot-image');
const speech = document.querySelector('[data-mascot-speech]');
let mouthTimer;
let speechTimer;

// Las rutas se resuelven desde la página HTML, no desde este archivo JS.
const mascotBase = '../../assets/images/radio-mascot-mouth-closed.png';
const mascotOpen = '../../assets/images/radio-mascot-mouth-open.png';
const mascotWink = '../../assets/images/radio-mascot-wink.png';

const stopMouthAnimation = () => {
  clearInterval(mouthTimer);
  mouthTimer = undefined;
};

const hideSpeech = () => {
  clearTimeout(speechTimer);
  speech?.classList.remove('is-visible');
};

const speak = (text, duration = 2600) => {
  if (!speech) return;
  clearTimeout(speechTimer);
  speech.textContent = text;
  speech.classList.add('is-visible');
  speechTimer = setTimeout(hideSpeech, duration);
};

const setState = (state, options = {}) => {
  stopMouthAnimation();
  hideSpeech();
  if (speech) speech.dataset.state = state;
  mascot.className = `radio-mascot-image is-${state}`;

  if (state === 'greeting') {
    mascot.src = mascotWink;
    speak('Gracias por seguir');
  } else if (state === 'listening') {
    mascot.src = mascotOpen;
    if (!options.silent) speak('Nueva música en cola');
    mouthTimer = setInterval(() => {
      mascot.src = mascot.src.endsWith('mouth-open.png') ? mascotBase : mascotOpen;
    }, 360);
  } else if (state === 'happy') {
    mascot.src = mascotOpen;
    speak('¡Gracias por el regalo!');
  } else {
    mascot.src = mascotBase;
  }
};

window.radioMascot = Object.freeze({
  idle: () => setState('idle'), greeting: () => setState('greeting'),
  listening: (options) => setState('listening', options), happy: () => setState('happy'), speak, setState
});
window.radioMascot.idle();
