const works = [
  {
    src: "images/flute-and-flowers.jpeg",
    title: "Flute and flowers",
    note: "A finished square panel. Yellow ground, a figure in profile with a flute, vine and flower repeats, and a diamond border. This is the clearest view for judging line and color."
  },
  {
    src: "images/flute-player.jpeg",
    title: "The flute player",
    note: "A second square in the same hand: green and brown garment, leaf sprigs, and a geometric frame. Strong enough to read across a corridor."
  },
  {
    src: "images/greeting.jpeg",
    title: "A greeting",
    note: "Kneeling figure with joined hands, brown drape, and the same border language. Paired with the flute player, the two boards already look like a set."
  },
  {
    src: "images/peacocks.jpeg",
    title: "Two peacocks",
    note: "A matched pair of panels, photographed together. Blue birds, green tails, mirrored plants. They are built to hang side by side."
  },
  {
    src: "images/two-figures.jpeg",
    title: "The two figures together",
    note: "The flute player and the greeting figure as they would sit together. Useful for spacing, not just for the drawing."
  },
  {
    src: "images/trees-and-dancers.jpeg",
    title: "Trees and dancers",
    note: "A wider festival panel standing on its own. Black trees, rows of dancers, yellow field. The yard and tent are only the setting."
  },
  {
    src: "images/river-boards.jpeg",
    title: "River panels, at scale",
    note: "Two large horizontal panels outdoors: boats, fish, and a wave band between yellow and orange. This photo is here for size. The people in the yard are the painting group, not the subject."
  }
];

const img = document.getElementById("stage-img");
const title = document.getElementById("stage-title");
const note = document.getElementById("stage-note");
const count = document.getElementById("stage-count");
const thumbs = document.getElementById("thumbs");
let index = 0;
let timer = null;

function show(next) {
  index = (next + works.length) % works.length;
  const work = works[index];
  img.classList.add("is-fading");
  window.setTimeout(() => {
    img.src = work.src;
    img.alt = work.title + ". " + work.note;
    title.textContent = work.title;
    note.textContent = work.note;
    count.textContent = String(index + 1).padStart(2, "0") + " / " + String(works.length).padStart(2, "0");
    img.classList.remove("is-fading");
  }, 180);
  [...thumbs.children].forEach((button, i) => {
    button.setAttribute("aria-selected", i === index ? "true" : "false");
  });
}

works.forEach((work, i) => {
  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute("role", "tab");
  button.setAttribute("aria-label", work.title);
  const thumb = document.createElement("img");
  thumb.src = work.src;
  thumb.alt = "";
  button.appendChild(thumb);
  button.addEventListener("click", () => {
    show(i);
    restart();
  });
  thumbs.appendChild(button);
});

document.querySelector(".prev").addEventListener("click", () => { show(index - 1); restart(); });
document.querySelector(".next").addEventListener("click", () => { show(index + 1); restart(); });
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") { show(index + 1); restart(); }
  if (event.key === "ArrowLeft") { show(index - 1); restart(); }
});

function restart() {
  if (timer) window.clearInterval(timer);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  timer = window.setInterval(() => show(index + 1), 7000);
}

show(0);
restart();
