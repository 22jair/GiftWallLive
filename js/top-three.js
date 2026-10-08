window.GWLTopThree = (() => {
  const formatter = new Intl.NumberFormat("es-PE");

  function render(container, people) {
    const leaders = [...people].sort((a, b) => b.score - a.score).slice(0, 3);
    const existing = new Map([...container.children].map((item) => [item.dataset.user, item]));
    leaders.forEach((person, index) => {
      let item = existing.get(person.name);
      if (!item) {
        item = document.createElement("article");
        item.className = "leader";
        item.dataset.user = person.name;
        item.innerHTML = '<span class="leader__place"></span><p class="leader__name"></p><p class="leader__score"></p>';
      }
      item.querySelector(".leader__place").textContent = `Puesto ${index + 1}`;
      item.querySelector(".leader__name").textContent = person.name;
      const score = item.querySelector(".leader__score");
      const value = formatter.format(person.score);
      if (score.textContent && score.textContent !== value) {
        score.classList.remove("leader__score--changed");
        void score.offsetWidth;
        score.classList.add("leader__score--changed");
      }
      score.textContent = value;
      container.append(item);
      existing.delete(person.name);
    });
    existing.forEach((item) => item.remove());
  }
  return { render };
})();
