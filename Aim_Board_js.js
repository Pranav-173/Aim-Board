const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const quoteInput = document.getElementById("quote");
const progressInput = document.getElementById("progress");
const progressValue = document.getElementById("progressValue");
const visionBoard = document.getElementById("visionBoard");
const timelineList = document.getElementById("timelineList");
const chart = document.getElementById("chart");
const onboarding = document.getElementById("onboarding");
const sortSelect = document.getElementById("sort");
let goals = JSON.parse(localStorage.getItem("goals")) || [];
if (!localStorage.getItem("visited")) {
  onboarding.style.display = "block";
  localStorage.setItem("visited", "true");
}
progressInput.addEventListener("input", () => {
  progressValue.textContent = progressInput.value + "%";
});
document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", e => {
    document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
    document.getElementById(btn.dataset.section).classList.add("active");
  });
});
document.getElementById("addGoal").addEventListener("click", () => {
  if (!titleInput.value || !dateInput.value) {
    alert("Please fill required fields");
    return;
  }
  goals.push({
    title: titleInput.value,
    category: categoryInput.value,
    date: dateInput.value,
    quote: quoteInput.value,
    progress: Number(progressInput.value)
  });
  saveAndRender();
  titleInput.value = quoteInput.value = "";
  progressInput.value = 0;
  progressValue.textContent = "0%";
});

function saveAndRender() {
  localStorage.setItem("goals", JSON.stringify(goals));
  renderAll();
}
sortSelect.addEventListener("change", renderAll);

function renderVision() {
  visionBoard.innerHTML = "";
  const today = new Date();

  let sorted = [...goals];

  if (sortSelect.value === "progress") {
    sorted.sort((a, b) => b.progress - a.progress);
  } else if (sortSelect.value === "category") {
    sorted.sort((a, b) => a.category.localeCompare(b.category));
  } else {
    sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  if (sorted.length === 0) {
    visionBoard.innerHTML = "No goals yet 🚀";
    return;
  }
  sorted.forEach((g) => {
    const index = goals.indexOf(g);
    const overdue = new Date(g.date) < today && g.progress < 100;
    visionBoard.innerHTML += `
      <div class="goal ${overdue ? "overdue" : ""}">
        <div class="goal-header">
          <b>${g.title}</b>
          <button class="delete-btn" onclick="deleteGoal(${index})" title="Delete goal">🗑</button>
        </div>
        ${g.quote ? `<div class="quote">"${g.quote}"</div>` : ""}
        <small>${g.category} • ${g.date}</small>
        <div class="progress">
          <div style="width:${g.progress}%"></div>
        </div>
        <small>${g.progress}%</small>
      </div>
    `;
  });
}

function renderTimeline() {
  timelineList.innerHTML = "";
  [...goals].sort((a,b) => new Date(a.date) - new Date(b.date))
    .forEach(g => {
      timelineList.innerHTML += `
        <div class="timeline-item">
          <b>${g.date}</b> — ${g.title} (${g.progress}%)
        </div>
      `;
    });
}

function renderChart() {
  const ctx = chart.getContext("2d");
  ctx.clearRect(0,0,400,200);
  let x = 30;
  goals.forEach(g => {
    ctx.fillStyle = "#3bacb6";
    ctx.fillRect(x, 200 - g.progress * 1.5, 30, g.progress * 1.5);
    ctx.fillStyle = "#000";
    ctx.fillText(g.progress + "%", x, 195);
    x += 50;
  });
}

function deleteGoal(index) {
  if (!confirm("Are you sure you want to delete this goal?")) return;

  goals.splice(index, 1);
  localStorage.setItem("goals", JSON.stringify(goals));
  renderAll();
}

function renderTimeline() {
  timelineList.innerHTML = "";
  [...goals]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((g, index) => {
      timelineList.innerHTML += `
        <div class="timeline-item">
          <b>${g.date}</b> — ${g.title} (${g.progress}%)
          <button class="delete-btn" onclick="deleteGoal(${index})">🗑</button>
        </div>
      `;
    });
}

function renderAll() {
  renderVision();
  renderTimeline();
  renderChart();
}

renderAll();