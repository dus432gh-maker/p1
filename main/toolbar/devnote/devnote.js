let viewDate = new Date();
let viewYear = viewDate.getFullYear();
let viewMonth = viewDate.getMonth();
let selectedDate = null;

const calendarEl = document.getElementById("calendar");
const patchContainer = document.getElementById("patch-container");

const yearDisplay = document.getElementById("year-display");
const monthDisplay = document.getElementById("month-display");

const availableDates = [...new Set(PATCH_DATA.map(d => d.date))].sort();

function formatDate(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function groupByPage(data) {
  const grouped = {};
  data.forEach(item => {
    if (!grouped[item.page]) grouped[item.page] = [];
    grouped[item.page].push(item.content);
  });
  return grouped;
}

function renderPatchNote(date) {
  const filtered = PATCH_DATA.filter(d => d.date === date);

  if (filtered.length === 0) {
    patchContainer.innerHTML = "<p>작성된 패치노트가 없습니다.</p>";
    return;
  }

  const grouped = groupByPage(filtered);
  let html = `<h2>${date}</h2>`;

  for (const page in grouped) {
    html += `
      <div class="patch-group">
        <h3>${page}</h3>
        <pre>${grouped[page].join("\n")}</pre>
      </div>
    `;
  }

  patchContainer.innerHTML = html;
}

function renderCalendar() {
  calendarEl.innerHTML = "";

  yearDisplay.textContent = viewYear;
  monthDisplay.textContent = viewMonth + 1 + "월";

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const lastDate = new Date(viewYear, viewMonth + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    calendarEl.appendChild(empty);
  }

  for (let day = 1; day <= lastDate; day++) {
    const dayEl = document.createElement("div");
    dayEl.classList.add("day");
    dayEl.textContent = day;

    const dateKey = formatDate(viewYear, viewMonth, day);

    if (availableDates.includes(dateKey)) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      dayEl.appendChild(dot);
    }

    dayEl.addEventListener("click", () => {
      document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
      dayEl.classList.add("selected");
      selectedDate = dateKey;
      renderPatchNote(selectedDate);
    });

    calendarEl.appendChild(dayEl);
  }
}

/* 연도 이동 */
document.getElementById("prev-year").onclick = () => {
  viewYear--;
  renderCalendar();
};

document.getElementById("next-year").onclick = () => {
  viewYear++;
  renderCalendar();
};

/* 월 이동 */
document.getElementById("prev-month").onclick = () => {
  viewMonth--;
  if (viewMonth < 0) {
    viewMonth = 11;
    viewYear--;
  }
  renderCalendar();
};

document.getElementById("next-month").onclick = () => {
  viewMonth++;
  if (viewMonth > 11) {
    viewMonth = 0;
    viewYear++;
  }
  renderCalendar();
};

/* 휠 이동 */
patchContainer.addEventListener("wheel", (e) => {
  if (!selectedDate) return;

  const currentIndex = availableDates.indexOf(selectedDate);

  if (e.deltaY > 0 && currentIndex < availableDates.length - 1) {
    selectedDate = availableDates[currentIndex + 1];
  } 
  else if (e.deltaY < 0 && currentIndex > 0) {
    selectedDate = availableDates[currentIndex - 1];
  }

  renderPatchNote(selectedDate);
});

renderCalendar();