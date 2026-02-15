
//  elements
const dashEl = document.getElementById("dash");
const timerNameEl = document.getElementById("timername");
const hrEl = document.getElementById("hr");
const minEl = document.getElementById("min");
const secEl = document.getElementById("sec");
const addTimerBtn = document.getElementById("add");

console.log(addTimerBtn);

// timers store STATE 
let timers = []; // centralized state (production style) all timers - store

//  HELPERS  timer look create 
function pad(n) {
  return String(n).padStart(2, "0");
}

// total seconds HMS calculation
function secondsToHMS(totalSeconds) {
  const hr = Math.floor(totalSeconds / 3600);
  const min = Math.floor((totalSeconds % 3600) / 60);
  const sec = totalSeconds % 60;
  return { hr, min, sec };
}

//  UI CREATE 
function createTimerCard(timer) {
  const card = document.createElement("div");
  card.className = "border-b-8 border-l-8 border-cyan-500 bg-white p-4 mt-4 text-center rounded-xl shadow-lg shadow-blue-500/50 inset-shadow-sm inset-shadow-indigo-500";
  card.dataset.id = timer.id;

//full timer ui create
  card.innerHTML = `   
    <p class="text-xl font-semibold italic">${timer.title}</p>

    <div class="text-2xl font-bold py-3">
      <span data-role="hr">00</span> :
      <span data-role="min">00</span> :
      <span data-role="sec">00</span>
    </div>

    <div class="*:px-2 *:rounded-2xl *:border flex flex-wrap gap-2 justify-center items-center py-2 *:flex-1">
      <button type="button" data-action="toggle" class="shadow-blue-500/50 inset-shadow-sm inset-shadow-indigo-500 cursor-pointer">Start</button>
      <button type="button" data-action="reset" class="shadow-blue-500/50 inset-shadow-sm inset-shadow-indigo-500 cursor-pointer ">Reset</button>
      <button type="button" data-action="delete" class="shadow-blue-500/50 inset-shadow-sm inset-shadow-indigo-500 cursor-pointer ">Delete</button>
    </div>
  `;

  // ✅ append first
  dashEl.appendChild(card);

  // ✅ update after append
  updateTimerCardUI(timer);
}

//  UI UPDATE (efficient) 
function updateTimerCardUI(timer) {
  const card = dashEl.querySelector(`[data-id="${timer.id}"]`);
  if (!card) return;

  const { hr, min, sec } = secondsToHMS(timer.remaining);

  card.querySelector('[data-role="hr"]').textContent = pad(hr);
  card.querySelector('[data-role="min"]').textContent = pad(min);
  card.querySelector('[data-role="sec"]').textContent = pad(sec);

  const toggleBtn = card.querySelector('[data-action="toggle"]');
  toggleBtn.textContent = timer.isRunning ? "Pause" : "Start";
}

//  CRUD (main logic) 
function addTimer(title, totalSeconds) {
  const timer = {                 //timer - object create
    id: crypto.randomUUID(),      //unique id 
    title,
    duration: totalSeconds,
    remaining: totalSeconds,
    isRunning: false,
  };
  
  timers.unshift(timer); // add new at top timer uilla timer add painrathu
  createTimerCard(timer);
}

function toggleTimer(id) {
  console.log(id);
  timers = timers.map((t) =>
    t.id === id ? { ...t, isRunning: !t.isRunning } : t

  );

  const timer = timers.find((t) => t.id === id);
  updateTimerCardUI(timer);
}

function resetTimer(id) {
  timers = timers.map((t) =>
    t.id === id
      ? { ...t, remaining: t.duration, isRunning: false }
      : t
  );

  const timer = timers.find((t) => t.id === id);
  updateTimerCardUI(timer);
}

function deleteTimer(id) {
  timers = timers.filter((t) => t.id !== id);

  const card = dashEl.querySelector(`[data-id="${id}"]`);
  if (card) card.remove();
}

//  EVENTS =========

// Add timer click
addTimerBtn.addEventListener("click", () => {
  const title = timerNameEl.value.trim() || `Timer ${timers.length + 1}`;

  const hr = Number(hrEl.value || 0);
  const min = Number(minEl.value || 0);
  const sec = Number(secEl.value || 0);

  const totalSeconds = hr * 3600 + min * 60 + sec;
  
  console.log(timerNameEl.value);

  if (totalSeconds <= 0) {
    alert("Enter valid duration!");
    return;
  }

  addTimer(title, totalSeconds);

  // clear form
  timerNameEl.value = "";
  hrEl.value = "";
  minEl.value = "";
  secEl.value = "";
});

// Dashboard buttons (event delegation)
dashEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  if (!action) return;

  const card = btn.closest("[data-id]");
  if (!card) return;

  const id = card.dataset.id;

  if (action === "toggle") toggleTimer(id);
  if (action === "reset") resetTimer(id);
  if (action === "delete") deleteTimer(id);
});

//timing fun
setInterval(() => {
  let changedTimers = [];

  timers = timers.map((t) => {
    if (!t.isRunning) return t;
    if (t.remaining <= 0) return { ...t, isRunning: false };

    const updated = { ...t, remaining: t.remaining - 1 };

    // auto stop at 0
    if (updated.remaining === 0) {
      updated.isRunning = false;
    }

    changedTimers.push(updated.id);
    return updated;
  });

  // update only the timers that changed
  changedTimers.forEach((id) => {
    const timer = timers.find((t) => t.id === id);
    updateTimerCardUI(timer);
  });
}, 1000);
