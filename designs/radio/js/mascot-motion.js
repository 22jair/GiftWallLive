// API visual de la mascota. Los eventos reales podrán usar window.radioMascot.
const mascot = document.querySelector('.radio-mascot-image');
let mouthTimer;

// Las rutas se resuelven desde la página HTML, no desde este archivo JS.
const mascotBase = '../../assets/images/radio-mascot-mouth-closed.png';
const mascotOpen = '../../assets/images/radio-mascot-mouth-open.png';
const mascotWink = '../../assets/images/radio-mascot-wink.png';

const stopMouthAnimation = () => {
  clearInterval(mouthTimer);
  mouthTimer = undefined;
};

const setState = (state) => {
  stopMouthAnimation();
  mascot.className = `radio-mascot-image is-${state}`;

  if (state === 'greeting') {
    mascot.src = mascotWink;
  } else if (state === 'listening') {
    mascot.src = mascotOpen;
    mouthTimer = setInterval(() => {
      mascot.src = mascot.src.endsWith('mouth-open.png') ? mascotBase : mascotOpen;
    }, 360);
  } else if (state === 'happy') {
    mascot.src = mascotOpen;
  } else {
    mascot.src = mascotBase;
  }
};

window.radioMascot = Object.freeze({
  idle: () => setState('idle'), greeting: () => setState('greeting'),
  listening: () => setState('listening'), happy: () => setState('happy'), setState
});
window.radioMascot.idle();
