(() => {
  const greeting = document.querySelector("#gift-mascot-greeting");
  if (!greeting) return;

  const pet = document.querySelector('.gift-mascot__printer');
  if (pet) {
    pet.className = 'lumi-pup';
    pet.innerHTML = `<svg viewBox="0 0 180 180" role="img" aria-label="Happy little puppy waving hello">
      <defs>
        <linearGradient id="pup-fur" x2=".7" y2="1"><stop stop-color="#fff8ea"/><stop offset="1" stop-color="#dfb686"/></linearGradient>
        <linearGradient id="pup-ear" x2="1" y2="1"><stop stop-color="#b98264"/><stop offset="1" stop-color="#734e49"/></linearGradient>
      </defs>
      <ellipse cx="91" cy="164" rx="54" ry="7" fill="#080f30" opacity=".3"/>
      <g class="lumi-pup__tail"><path d="M120 130Q160 137 152 104Q177 139 134 149" fill="url(#pup-fur)" stroke="#906752" stroke-width="2"/></g>
      <path d="M67 99Q44 121 57 155Q85 170 121 154Q134 125 110 101" fill="url(#pup-fur)" stroke="#ba906d" stroke-width="2"/>
      <ellipse cx="91" cy="136" rx="23" ry="25" fill="#fff5df"/>
      <g fill="url(#pup-fur)" stroke="#ba906d" stroke-width="2"><path d="M66 140Q42 147 51 160Q64 169 78 159L79 143"/><path d="M104 144L102 159Q126 171 132 158Q135 146 116 140"/></g>
      <g class="lumi-pup__paw"><path d="M61 123Q39 122 36 99Q30 81 21 91Q10 111 29 132Q45 148 62 137" fill="url(#pup-fur)" stroke="#ba906d" stroke-width="2"/><ellipse cx="29" cy="106" rx="7" ry="9" fill="#ecacac"/><circle cx="23" cy="94" r="3" fill="#ecacac"/><circle cx="31" cy="93" r="3" fill="#ecacac"/></g>
      <g class="lumi-pup__head">
      <path d="M53 48Q20 27 21 71Q19 98 40 92L59 66M123 47Q151 25 156 68Q162 96 141 94L122 67" fill="url(#pup-ear)" stroke="#6b4b46" stroke-width="2"/>
      <path d="M39 62Q39 31 87 31Q132 27 141 63L144 83Q142 115 93 116Q44 117 37 88Z" fill="url(#pup-fur)" stroke="#ba906d" stroke-width="2"/>
      <path d="M69 37Q78 17 94 28L88 35Q105 20 110 34" fill="#fff4dc"/>
      <g class="lumi-pup__eyes" fill="#372b36"><ellipse cx="65" cy="72" rx="10" ry="14"/><ellipse cx="116" cy="72" rx="10" ry="14"/><g fill="white"><circle cx="62" cy="67" r="4"/><circle cx="113" cy="67" r="4"/><circle cx="69" cy="78" r="2"/><circle cx="120" cy="78" r="2"/></g></g>
      <ellipse cx="52" cy="90" rx="10" ry="5" fill="#efa9a1" opacity=".65"/><ellipse cx="130" cy="90" rx="10" ry="5" fill="#efa9a1" opacity=".65"/>
      <ellipse cx="91" cy="92" rx="25" ry="18" fill="#fff7e8"/>
      <path d="M83 87Q91 81 99 87Q99 95 91 97Q83 94 83 87" fill="#493239"/><path d="M79 99Q92 114 104 99" fill="#633d45"/><path d="M86 104Q94 100 98 106Q95 115 88 110" fill="#ee94aa"/>
      </g>
      <path d="M61 113Q90 125 121 113L118 122Q88 135 63 121Z" fill="#73d9d6"/><path d="m91 126 7 8-7 9-7-9Z" fill="#ffe5a3" stroke="#b99056"/>
    </svg>`;
  }

  const greetings = [
    "¡Hola! Buen día",
    "Hello! Have a great day",
    "¡Bienvenido! Todo genial",
    "You are going to be great!",
    "¡Qué gusto verte!",
    "Good vibes for you",
    "¡Hoy será increíble!",
    "You’ve got this!",
    "¡Confía en ti!",
    "Believe in yourself!",
    "¡Sonríe mucho!",
    "Keep smiling!",
    "¡Eres increíble!",
    "You make today brighter!",
    "¡Algo bonito te espera!",
    "Something great awaits",
    "¡Gracias por venir!",
    "Have a beautiful day!",
    "¡Hoy vas a brillar!",
    "Go shine brightly!",
    "¡Tu energía es genial!",
    "Wonderful energy!",
    "¡Suerte y un abrazo!",
    "Wishing you happiness!",
    "¡Vas por buen camino!",
    "You are doing great!",
    "¡Qué bueno tenerte aquí!",
    "So happy you are here!",
    "¡Disfruta el momento!",
    "Enjoy this moment!",
  ];
  let index = 0;

  window.setInterval(() => {
    index = (index + 1) % greetings.length;
    greeting.classList.remove("is-changing");
    void greeting.offsetWidth;
    greeting.textContent = greetings[index];
    greeting.classList.add("is-changing");
  }, 5000);
})();
