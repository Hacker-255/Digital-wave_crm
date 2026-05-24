import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAnalytics, isSupported as isAnalyticsSupported } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";
import {
  RecaptchaVerifier,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCFM205S8WQUWqJZDZIJqK5TzMv127P0jI",
  authDomain: "digital-wave-team.firebaseapp.com",
  projectId: "digital-wave-team",
  storageBucket: "digital-wave-team.firebasestorage.app",
  messagingSenderId: "14731493539",
  appId: "1:14731493539:web:691457a4a97fa4e9a5ff16",
  measurementId: "G-58WJRHGKB3",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

isAnalyticsSupported().then((supported) => {
  if (supported) getAnalytics(firebaseApp);
});

const crmState = {
  signedInProvider: "",
  currentUser: null,
  workspace: "personal",
  view: "dashboard",
  mode: "overview",
  detailTab: "activity",
  selectedId: "lead-1",
  activeView: "all",
  sortKey: "name",
  sortDirection: "asc",
};

const defaultRecords = [
  {
    id: "lead-1",
    type: "lead",
    name: "Nora Adel",
    company: "Apex Retail Systems",
    status: "Qualified",
    stage: "Qualified",
    value: "$18,400",
    owner: "Mariam",
    email: "nora@apex.example",
    phone: "+20 100 482 0193",
    next: "Send portal estimate",
    source: "Website form",
    score: 92,
  },
  {
    id: "deal-1",
    type: "deal",
    name: "CRM migration",
    company: "Blue Nile Clinics",
    status: "Proposal",
    stage: "Proposal",
    value: "$32,000",
    owner: "Youssef",
    email: "omar@bluenile.example",
    phone: "+20 111 720 2240",
    next: "Review CRM migration",
    source: "Referral",
    score: 84,
  },
  {
    id: "lead-2",
    type: "lead",
    name: "Laila Mostafa",
    company: "Orbit Academy",
    status: "New Lead",
    stage: "New Lead",
    value: "$9,800",
    owner: "Farah",
    email: "laila@orbit.example",
    phone: "+20 122 630 4431",
    next: "Book discovery call",
    source: "LinkedIn",
    score: 63,
  },
  {
    id: "company-1",
    type: "company",
    name: "Helio Foods",
    company: "Helio Foods",
    status: "Contacted",
    stage: "Contacted",
    value: "$14,600",
    owner: "Mariam",
    email: "karim@helio.example",
    phone: "+20 101 992 3170",
    next: "Share ecommerce audit",
    source: "Outbound",
    score: 74,
  },
  {
    id: "deal-2",
    type: "deal",
    name: "Operations dashboard",
    company: "Delta Logistics",
    status: "Won",
    stage: "Won",
    value: "$41,200",
    owner: "Youssef",
    email: "salma@delta.example",
    phone: "+20 120 881 5502",
    next: "Kickoff dashboard build",
    source: "Partner",
    score: 96,
  },
  {
    id: "lead-3",
    type: "lead",
    name: "Yara Samir",
    company: "Pulse Fitness",
    status: "Qualified",
    stage: "Qualified",
    value: "$11,500",
    owner: "Farah",
    email: "yara@pulse.example",
    phone: "+20 155 443 9032",
    next: "Confirm website scope",
    source: "Instagram",
    score: 79,
  },
  {
    id: "deal-3",
    type: "deal",
    name: "Real estate portal",
    company: "Stonebridge Estates",
    status: "Proposal",
    stage: "Proposal",
    value: "$27,900",
    owner: "Mariam",
    email: "hany@stonebridge.example",
    phone: "+20 100 228 7110",
    next: "Finalize payment terms",
    source: "Google Ads",
    score: 81,
  },
];

let records = cloneDefaultRecords();
let confirmationResult = null;
let recaptchaVerifier = null;

const tasks = [
  ["Send revised Digital Wave CRM proposal", "Nora Adel", "Today", false],
  ["Prepare website wireframe review", "Pulse Fitness", "Tomorrow", false],
  ["Invoice first milestone", "Delta Logistics", "Today", true],
  ["Schedule technical discovery", "Orbit Academy", "Wed", false],
  ["Connect WhatsApp lead source", "Blue Nile Clinics", "Thu", false],
];

const events = [
  ["10:00", "Discovery call", "Orbit Academy"],
  ["12:30", "CRM migration review", "Blue Nile Clinics"],
  ["15:00", "Website scope workshop", "Pulse Fitness"],
  ["17:00", "Dashboard kickoff", "Delta Logistics"],
];

const inbox = [
  ["Nora Adel", "Can you include client portal permissions?", "10m"],
  ["GitHub", "New issue assigned in Digital Wave CRM", "24m"],
  ["Blue Nile Clinics", "Migration sample file attached", "1h"],
  ["Google Ads", "Lead form generated 3 new prospects", "2h"],
];

const notes = [
  ["Apex Retail Systems", "Needs inventory sync, role permissions, and Arabic/English UI."],
  ["Digital Wave playbook", "Lead score over 80 gets proposal within 24 hours."],
  ["Blue Nile Clinics", "Concerned about historical CRM data quality."],
];

const workflows = [
  ["Website lead capture", "When form submitted, create lead and task", "Active"],
  ["Proposal follow-up", "If proposal idle for 3 days, notify owner", "Active"],
  ["Won deal handoff", "Create kickoff tasks and delivery workspace", "Paused"],
];

const savedViews = [
  ["all", "All"],
  ["mine", "My records"],
  ["recent", "Recently updated"],
  ["high", "High score"],
  ["proposal", "Proposal"],
];

const commands = [
  ["New lead", "Create a new lead", () => openCreateModal("New Lead")],
  ["Import records", "Load demo records from a CSV-style import", () => importDemoRecords()],
  ["Open people", "Go to People", () => setView("people")],
  ["Open companies", "Go to Companies", () => setView("companies")],
  ["Open opportunities", "Go to Opportunities", () => setView("deals")],
  ["Open workflows", "Go to Workflows", () => setView("workflows")],
  ["Open users", "Manage team users and workspace mode", () => setView("users")],
  ["Toggle compact mode", "Change table density", () => document.body.classList.toggle("compact")],
];

const viewConfig = {
  dashboard: ["Sales OS", "Dashboard", "Workspace overview", "Pipeline, tasks, accounts, and activity in one Digital Wave cockpit.", "New Lead"],
  leads: ["Acquisition", "Leads", "Lead inbox", "Inbound requests from campaigns, referrals, web forms, and WhatsApp.", "New Lead"],
  people: ["Objects", "People", "People", "Decision makers, champions, and technical contacts.", "New Person"],
  companies: ["Objects", "Companies", "Companies", "Accounts using or evaluating Digital Wave services.", "New Company"],
  deals: ["Revenue", "Deals", "Opportunities", "Software, CRM, website, and dashboard projects in progress.", "New Deal"],
  tasks: ["Execution", "Tasks", "Tasks", "Follow-ups, calls, proposals, invoices, and delivery handoffs.", "New Task"],
  activities: ["Timeline", "Activities", "Activities", "Calls, emails, notes, meetings, and object history.", "Log Activity"],
  calendar: ["Execution", "Calendar", "Today", "Meetings, demos, workshops, and delivery calls.", "New Event"],
  inbox: ["Communication", "Inbox", "Unified inbox", "Email, lead forms, GitHub, and client updates.", "Compose"],
  notes: ["Knowledge", "Notes", "Notes", "Research, call notes, project context, and account history.", "New Note"],
  workflows: ["Automation", "Workflows", "Workflows", "Automations inspired by Twenty workflow building.", "New Workflow"],
  reports: ["Analytics", "Reports", "Reports", "Revenue, conversion, source quality, and owner performance.", "Export"],
  users: ["Team", "Users", "Users and team workspace", "Invite teammates and choose whether you work in your own CRM or the shared team CRM.", "Add User"],
  settings: ["Workspace", "Settings", "Settings", "Members, fields, stages, integrations, and preferences.", "Invite Member"],
};

const metricSets = {
  dashboard: [["Total leads", "1,248", "+18.2%"], ["Open deals", "842", "+12.5%"], ["Revenue", "$96,420", "+24.7%"], ["Conversion", "24.6%", "+8.1%"]],
  leads: [["New leads", "128", "+22"], ["Qualified", "64", "+14"], ["Avg score", "78", "+6"], ["Sources", "9", "+2"]],
  deals: [["Pipeline", "$155.4k", "+18%"], ["Won", "$41.2k", "+1"], ["Avg deal", "$22.2k", "+7%"], ["Close rate", "31%", "+4%"]],
  tasks: [["Due today", "12", "-3"], ["Overdue", "2", "-1"], ["Completed", "48", "+9"], ["Automation", "7", "+2"]],
  reports: [["MRR influence", "$18.6k", "+11%"], ["Lead cost", "$21", "-8%"], ["Response SLA", "18m", "+5m"], ["Win rate", "31%", "+4%"]],
};

const landingPage = document.querySelector("#landingPage");
const crmApp = document.querySelector("#crmApp");
const signedInAs = document.querySelector("#signedInAs");
const pageTitle = document.querySelector("#pageTitle");
const viewKicker = document.querySelector("#viewKicker");
const moduleTitle = document.querySelector("#moduleTitle");
const moduleSubtitle = document.querySelector("#moduleSubtitle");
const metrics = document.querySelector("#metrics");
const moduleContent = document.querySelector("#moduleContent");
const searchInput = document.querySelector("#searchInput");
const modeTabs = document.querySelector("#modeTabs");
const newRecordButton = document.querySelector("#newRecordButton");
const recordModal = document.querySelector("#recordModal");
const modalTitle = document.querySelector("#modalTitle");
const commandModal = document.querySelector("#commandModal");
const commandInput = document.querySelector("#commandInput");
const commandResults = document.querySelector("#commandResults");
const toast = document.querySelector("#toast");

function saveRecords() {
  localStorage.setItem(recordsKey(), JSON.stringify(records));
}

function recordsKey() {
  const userKey = crmState.currentUser?.uid || "signed-out";
  return crmState.workspace === "team" ? "digitalWaveRecords:team" : `digitalWaveRecords:${userKey}`;
}

function cloneDefaultRecords() {
  return JSON.parse(JSON.stringify(defaultRecords));
}

function loadRecordsForWorkspace() {
  records = JSON.parse(localStorage.getItem(recordsKey()) || "null") || cloneDefaultRecords();
}

function teamKey() {
  return "digitalWaveTeamUsers";
}

function getTeamUsers() {
  return JSON.parse(localStorage.getItem(teamKey()) || "null") || [];
}

function saveTeamUsers(users) {
  localStorage.setItem(teamKey(), JSON.stringify(users));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  window.setTimeout(() => toast.classList.add("hidden"), 2200);
}

function currentRecord() {
  return records.find((record) => record.id === crmState.selectedId) || records[0] || defaultRecords[0];
}

function initials(name) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function visibleRecords() {
  const query = searchInput.value.trim().toLowerCase();
  let data = records;

  if (crmState.view === "leads") data = records.filter((record) => record.type === "lead");
  if (crmState.view === "people") data = records.filter((record) => record.type !== "company");
  if (crmState.view === "companies") data = records.filter((record) => record.type === "company" || record.company === record.name);
  if (crmState.view === "deals") data = records.filter((record) => record.type === "deal");

  if (crmState.activeView === "mine") data = data.filter((record) => record.owner === "Mariam");
  if (crmState.activeView === "high") data = data.filter((record) => record.score >= 80);
  if (crmState.activeView === "proposal") data = data.filter((record) => record.stage === "Proposal");
  if (crmState.activeView === "recent") data = [...data].reverse();

  if (query) {
    data = data.filter((record) =>
      [record.name, record.company, record.status, record.owner, record.next, record.email, record.source]
      .join(" ")
      .toLowerCase()
      .includes(query),
    );
  }

  return [...data].sort((a, b) => {
    const first = String(a[crmState.sortKey] || "");
    const second = String(b[crmState.sortKey] || "");
    return crmState.sortDirection === "asc" ? first.localeCompare(second) : second.localeCompare(first);
  });
}

function renderMetrics() {
  const set = metricSets[crmState.view] || metricSets.dashboard;
  metrics.innerHTML = set.map(([label, value, trend]) => `
    <article class="metric-card">
      <span>${label}</span>
      <strong>${value}</strong>
      <em>${trend}</em>
    </article>
  `).join("");
}

function renderTable() {
  const rows = visibleRecords().map((record) => `
    <tr data-id="${record.id}" class="${record.id === crmState.selectedId ? "selected" : ""}">
      <td><div class="person-cell"><span class="avatar">${initials(record.name)}</span><strong contenteditable="true" data-field="name">${record.name}</strong></div></td>
      <td contenteditable="true" data-field="company">${record.company}</td>
      <td><button class="badge status-button" data-action="cycle-stage" type="button">${record.status}</button></td>
      <td contenteditable="true" data-field="value">${record.value}</td>
      <td contenteditable="true" data-field="owner">${record.owner}</td>
      <td contenteditable="true" data-field="next">${record.next}</td>
    </tr>
  `).join("");

  moduleContent.innerHTML = `
    <div class="object-toolbar">
      <button class="object-tab active" type="button">${viewConfig[crmState.view][1]}</button>
      <button class="object-tab" type="button">Fields</button>
      <button class="object-tab" type="button">Relations</button>
      <button class="object-tab" type="button">API</button>
    </div>
    <div class="filter-strip">
      ${savedViews.map(([key, label]) => `<button class="chip ${crmState.activeView === key ? "active" : ""}" data-saved-view="${key}" type="button">${label}</button>`).join("")}
      <button class="chip" data-sort="name" type="button">Sort: Name</button>
      <button class="chip" data-sort="value" type="button">Sort: Value</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Name</th><th>Company</th><th>Stage</th><th>Amount</th><th>Owner</th><th>Next step</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;

  moduleContent.querySelectorAll("[data-saved-view]").forEach((button) => {
    button.addEventListener("click", () => {
      crmState.activeView = button.dataset.savedView;
      renderAll();
    });
  });

  moduleContent.querySelectorAll("[data-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      crmState.sortKey = button.dataset.sort;
      crmState.sortDirection = crmState.sortDirection === "asc" ? "desc" : "asc";
      renderAll();
    });
  });

  moduleContent.querySelectorAll("tbody tr").forEach((row) => {
    row.addEventListener("click", () => {
      crmState.selectedId = row.dataset.id;
      renderDetail();
      moduleContent.querySelectorAll("tbody tr").forEach((item) => item.classList.toggle("selected", item === row));
    });

    row.querySelectorAll("[contenteditable='true']").forEach((cell) => {
      cell.addEventListener("blur", () => {
        const record = records.find((item) => item.id === row.dataset.id);
        if (!record) return;
        record[cell.dataset.field] = cell.textContent.trim();
        saveRecords();
        renderDetail();
      });
    });

    row.querySelector("[data-action='cycle-stage']").addEventListener("click", (event) => {
      event.stopPropagation();
      const record = records.find((item) => item.id === row.dataset.id);
      const stages = ["New Lead", "Contacted", "Qualified", "Proposal", "Won"];
      const nextIndex = (stages.indexOf(record.stage) + 1) % stages.length;
      record.stage = stages[nextIndex];
      record.status = stages[nextIndex];
      saveRecords();
      renderAll();
    });
  });
}

function renderPipeline() {
  const stages = ["New Lead", "Contacted", "Qualified", "Proposal", "Won"];
  moduleContent.innerHTML = `
    <div class="pipeline">
      ${stages.map((stage) => {
        const stageRecords = visibleRecords().filter((record) => record.stage === stage);
        return `
          <section class="pipeline-column">
            <h3>${stage}<span>${stageRecords.length}</span></h3>
            ${stageRecords.map((record) => `
              <button class="deal-card" data-id="${record.id}" type="button">
                <strong>${record.company}</strong>
                <span>${record.name}</span>
                <em>${record.value}</em>
              </button>
            `).join("")}
          </section>
        `;
      }).join("")}
    </div>
  `;

  moduleContent.querySelectorAll(".deal-card").forEach((card) => {
    card.addEventListener("click", () => {
      crmState.selectedId = card.dataset.id;
      renderAll();
    });
  });
}

function renderDashboard() {
  moduleContent.innerHTML = `
    <div class="overview-grid">
      <section class="summary-band">
        <h3>Sales pipeline</h3>
        <div class="pipeline-bars">
          <span style="--w: 86%">New lead <b>320</b></span>
          <span style="--w: 62%">Contacted <b>210</b></span>
          <span style="--w: 48%">Qualified <b>145</b></span>
          <span style="--w: 32%">Proposal <b>85</b></span>
          <span style="--w: 18%">Won <b>42</b></span>
        </div>
      </section>
      <section class="summary-band">
        <h3>Revenue overview</h3>
        <div class="chart-lines tall">
          <i style="height: 36%"></i><i style="height: 54%"></i><i style="height: 44%"></i><i style="height: 68%"></i>
          <i style="height: 57%"></i><i style="height: 78%"></i><i style="height: 65%"></i><i style="height: 90%"></i>
        </div>
      </section>
      <section class="summary-band">
        <h3>Recent activity</h3>
        ${["New lead added", "Follow-up scheduled", "Deal won", "Invoice sent", "Meeting completed"].map((item) => `
          <div class="activity"><span class="dot blue"></span><p>${item}</p><time>now</time></div>
        `).join("")}
      </section>
      <section class="summary-band">
        <h3>Source quality</h3>
        <div class="source-list">
          <span>Website forms <b>42%</b></span>
          <span>Google Ads <b>26%</b></span>
          <span>Referrals <b>19%</b></span>
          <span>Social <b>13%</b></span>
        </div>
      </section>
    </div>
  `;
}

function renderListModule(title, items) {
  moduleContent.innerHTML = `
    <div class="list-module">
      ${items.map((item, index) => `
        <button class="list-row" type="button" data-index="${index}">
          <span class="avatar">${initials(item[0])}</span>
          <strong>${item[0]}</strong>
          <p>${item[1]}</p>
          <em>${item[2] || ""}</em>
        </button>
      `).join("")}
    </div>
  `;
}

function renderTasks() {
  moduleContent.innerHTML = `
    <div class="task-list">
      ${tasks.map((task, index) => `
        <label class="task-row">
          <input type="checkbox" ${task[3] ? "checked" : ""} data-index="${index}" />
          <span><strong>${task[0]}</strong><em>${task[1]} - ${task[2]}</em></span>
        </label>
      `).join("")}
    </div>
  `;

  moduleContent.querySelectorAll("input[type='checkbox']").forEach((input) => {
    input.addEventListener("change", () => {
      tasks[Number(input.dataset.index)][3] = input.checked;
      showToast(input.checked ? "Task completed" : "Task reopened");
    });
  });
}

function renderActivities() {
  moduleContent.innerHTML = `
    <div class="timeline">
      ${records.slice(0, 6).map((record, index) => `
        <article class="timeline-item">
          <span class="avatar">${initials(record.name)}</span>
          <div>
            <strong>${index % 2 ? "Email sent" : "Call logged"}</strong>
            <p>${record.next} for ${record.company}</p>
          </div>
          <time>${index + 1}h</time>
        </article>
      `).join("")}
    </div>
  `;
}

function renderWorkflows() {
  moduleContent.innerHTML = `
    <div class="workflow-builder">
      ${workflows.map((workflow) => `
        <article class="workflow-card">
          <span class="badge">${workflow[2]}</span>
          <h3>${workflow[0]}</h3>
          <p>${workflow[1]}</p>
          <div class="workflow-steps"><span>Trigger</span><span>Condition</span><span>Action</span></div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderReports() {
  moduleContent.innerHTML = `
    <div class="reports-grid">
      <section class="summary-band wide">
        <h3>Revenue by month</h3>
        <div class="chart-lines tall">
          <i style="height: 42%"></i><i style="height: 55%"></i><i style="height: 49%"></i><i style="height: 70%"></i>
          <i style="height: 62%"></i><i style="height: 86%"></i><i style="height: 76%"></i><i style="height: 94%"></i>
        </div>
      </section>
      <section class="summary-band"><h3>Owner performance</h3><div class="source-list"><span>Mariam <b>$60.9k</b></span><span>Youssef <b>$73.2k</b></span><span>Farah <b>$21.3k</b></span></div></section>
      <section class="summary-band"><h3>Conversion funnel</h3><div class="source-list"><span>Lead <b>100%</b></span><span>Qualified <b>46%</b></span><span>Proposal <b>27%</b></span><span>Won <b>13%</b></span></div></section>
    </div>
  `;
}

function renderSettings() {
  moduleContent.innerHTML = `
    <div class="settings-grid">
      ${["Workspace members", "Custom fields", "Pipeline stages", "Google integration", "Phone authentication", "Email sync"].map((setting) => `
        <article class="setting-card">
          <h3>${setting}</h3>
          <p>Configured for Digital Wave CRM operations.</p>
          <label class="switch"><input type="checkbox" checked /><span></span></label>
        </article>
      `).join("")}
    </div>
  `;
}

function renderUsers() {
  const teamUsers = getTeamUsers();
  const currentUser = crmState.currentUser;
  moduleContent.innerHTML = `
    <div class="users-layout">
      <section class="summary-band wide">
        <h3>Workspace mode</h3>
        <p class="muted-copy">Personal gives every login a fresh CRM. Team uses one shared local workspace on this browser.</p>
        <div class="workspace-toggle">
          <button class="${crmState.workspace === "personal" ? "active" : ""}" data-workspace="personal" type="button">Personal CRM</button>
          <button class="${crmState.workspace === "team" ? "active" : ""}" data-workspace="team" type="button">Team CRM</button>
        </div>
      </section>
      <section class="summary-band">
        <h3>Current user</h3>
        <div class="user-card">
          <span class="avatar">${initials(currentUser?.displayName || currentUser?.email || currentUser?.phoneNumber || "User")}</span>
          <div>
            <strong>${currentUser?.displayName || "Digital Wave user"}</strong>
            <p>${currentUser?.email || currentUser?.phoneNumber || "Authenticated account"}</p>
          </div>
          <span class="badge">Owner</span>
        </div>
      </section>
      <section class="summary-band">
        <h3>Add teammate</h3>
        <form class="team-form" id="teamForm">
          <input id="teamEmailInput" type="email" placeholder="teammate@digitalwave.example" required />
          <select id="teamRoleInput">
            <option>Admin</option>
            <option>Sales</option>
            <option>Delivery</option>
            <option>Viewer</option>
          </select>
          <button class="primary-button" type="submit">Add user</button>
        </form>
      </section>
      <section class="summary-band wide">
        <h3>Team users</h3>
        <div class="team-list">
          ${teamUsers.length ? teamUsers.map((user, index) => `
            <div class="user-card">
              <span class="avatar">${initials(user.email)}</span>
              <div><strong>${user.email}</strong><p>${user.role}</p></div>
              <button class="ghost-button" data-remove-user="${index}" type="button">Remove</button>
            </div>
          `).join("") : `<p class="muted-copy">No teammates added yet.</p>`}
        </div>
      </section>
    </div>
  `;

  moduleContent.querySelectorAll("[data-workspace]").forEach((button) => {
    button.addEventListener("click", () => {
      crmState.workspace = button.dataset.workspace;
      loadRecordsForWorkspace();
      renderAll();
      showToast(crmState.workspace === "team" ? "Team CRM loaded" : "Personal CRM loaded");
    });
  });

  moduleContent.querySelector("#teamForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = moduleContent.querySelector("#teamEmailInput").value.trim();
    const role = moduleContent.querySelector("#teamRoleInput").value;
    if (!email) return;
    saveTeamUsers([...getTeamUsers(), { email, role }]);
    renderUsers();
    showToast("User added to team");
  });

  moduleContent.querySelectorAll("[data-remove-user]").forEach((button) => {
    button.addEventListener("click", () => {
      const users = getTeamUsers();
      users.splice(Number(button.dataset.removeUser), 1);
      saveTeamUsers(users);
      renderUsers();
      showToast("User removed");
    });
  });
}

function renderModule() {
  const recordViews = ["dashboard", "leads", "people", "companies", "deals"];
  if (recordViews.includes(crmState.view) && crmState.mode === "table") return renderTable();
  if (recordViews.includes(crmState.view) && crmState.mode === "pipeline") return renderPipeline();
  if (crmState.view === "dashboard") return renderDashboard();
  if (["leads", "people", "companies", "deals"].includes(crmState.view)) return renderTable();
  if (crmState.view === "tasks") return renderTasks();
  if (crmState.view === "activities") return renderActivities();
  if (crmState.view === "calendar") return renderListModule("Calendar", events);
  if (crmState.view === "inbox") return renderListModule("Inbox", inbox);
  if (crmState.view === "notes") return renderListModule("Notes", notes);
  if (crmState.view === "workflows") return renderWorkflows();
  if (crmState.view === "reports") return renderReports();
  if (crmState.view === "users") return renderUsers();
  if (crmState.view === "settings") return renderSettings();
}

function renderDetail() {
  const record = currentRecord();
  document.querySelector("#detailStage").textContent = record.status;
  document.querySelector("#detailName").textContent = record.name;
  document.querySelector("#detailCompany").textContent = record.company;

  const details = {
    activity: `
      <div class="deal-score"><strong>${record.value}</strong><span>Estimated project value</span></div>
      ${["Discovery call completed", "Proposal deck shared", record.next].map((item, index) => `
        <div class="activity"><span class="dot ${index === 1 ? "cyan" : "blue"}"></span><p>${item}</p><time>${index + 1}h</time></div>
      `).join("")}
    `,
    fields: `
      <div class="field-list">
        <span>Email <b>${record.email}</b></span>
        <span>Phone <b>${record.phone}</b></span>
        <span>Owner <b>${record.owner}</b></span>
        <span>Source <b>${record.source}</b></span>
        <span>Lead score <b>${record.score}</b></span>
      </div>
    `,
    notes: `
      <div class="note-card"><strong>Call summary</strong><p>${record.company} wants a fast, clean system with clear ownership and automated follow-ups.</p></div>
      <div class="note-card"><strong>Digital Wave fit</strong><p>Good match for CRM setup, web portal, and reporting dashboard work.</p></div>
    `,
  };

  document.querySelector("#detailBody").innerHTML = details[crmState.detailTab];
}

function syncHeader() {
  const [kicker, title, panelTitle, subtitle, action] = viewConfig[crmState.view];
  viewKicker.textContent = kicker;
  pageTitle.textContent = title;
  moduleTitle.textContent = panelTitle;
  moduleSubtitle.textContent = subtitle;
  newRecordButton.textContent = action;
  document.querySelectorAll(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === crmState.view));
  modeTabs.classList.toggle("hidden", !["dashboard", "leads", "people", "companies", "deals"].includes(crmState.view));
}

function renderAll() {
  syncHeader();
  renderMetrics();
  renderModule();
  renderDetail();
}

document.querySelectorAll("[data-login]").forEach((button) => {
  button.addEventListener("click", async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      showToast(authErrorMessage(error));
    }
  });
});

document.querySelector("#emailAuthForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.querySelector("#emailInput").value.trim();
  const password = document.querySelector("#passwordInput").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    showToast(authErrorMessage(error));
  }
});

document.querySelector("#emailCreateButton").addEventListener("click", async () => {
  const email = document.querySelector("#emailInput").value.trim();
  const password = document.querySelector("#passwordInput").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    showToast(authErrorMessage(error));
  }
});

function ensureRecaptcha() {
  if (recaptchaVerifier) return recaptchaVerifier;
  recaptchaVerifier = new RecaptchaVerifier(auth, "recaptchaContainer", {
    size: "normal",
    callback: () => {},
  });
  return recaptchaVerifier;
}

document.querySelector("#phoneAuthForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const phoneNumber = document.querySelector("#phoneInput").value.trim();
  if (!phoneNumber) {
    showToast("Enter a phone number with country code.");
    return;
  }

  try {
    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, ensureRecaptcha());
    document.querySelector("#phoneCodeBox").classList.remove("hidden");
    showToast("Verification code sent");
  } catch (error) {
    showToast(authErrorMessage(error));
  }
});

document.querySelector("#verifyCodeButton").addEventListener("click", async () => {
  const code = document.querySelector("#smsCodeInput").value.trim();
  if (!confirmationResult || !code) {
    showToast("Send a code first.");
    return;
  }

  try {
    await confirmationResult.confirm(code);
  } catch (error) {
    showToast(authErrorMessage(error));
  }
});

function authErrorMessage(error) {
  const code = error?.code || "";
  if (code.includes("unauthorized-domain")) return "Add 127.0.0.1 and localhost to Firebase authorized domains.";
  if (code.includes("popup-closed-by-user")) return "Sign-in popup closed.";
  if (code.includes("operation-not-allowed")) return "Enable this provider in Firebase Authentication.";
  if (code.includes("invalid-verification-code")) return "The SMS code is not correct.";
  if (code.includes("invalid-phone-number")) return "Use international format, like +201001234567.";
  if (code.includes("email-already-in-use")) return "This email already has an account.";
  if (code.includes("weak-password")) return "Password must be at least 6 characters.";
  if (code.includes("invalid-credential")) return "Email or password is not correct.";
  if (code.includes("account-exists-with-different-credential")) return "This email is already linked to another provider.";
  return "Sign-in failed. Check Firebase Authentication settings.";
}

onAuthStateChanged(auth, (user) => {
  crmState.currentUser = user;

  if (user) {
    crmState.workspace = "personal";
    loadRecordsForWorkspace();
    signedInAs.textContent = user.displayName || user.email || user.phoneNumber || "Signed in";
    landingPage.classList.add("hidden");
    crmApp.classList.remove("hidden");
    renderAll();
    return;
  }

  crmApp.classList.add("hidden");
  landingPage.classList.remove("hidden");
});

function setView(view) {
  crmState.view = view;
  crmState.mode = ["dashboard", "leads", "people", "companies", "deals"].includes(view) ? "table" : "overview";
  if (view === "dashboard") crmState.mode = "overview";
  searchInput.value = "";
  document.querySelectorAll("#modeTabs button").forEach((tab) => tab.classList.toggle("active", tab.dataset.mode === crmState.mode));
  renderAll();
}

document.querySelector("#logoutButton").addEventListener("click", async () => {
  try {
    await signOut(auth);
  } catch {
    showToast("Could not sign out.");
  }
});

document.querySelectorAll("[data-focus-login]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".login-card")?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    setView(button.dataset.view);
  });
});

document.querySelectorAll("#modeTabs button").forEach((button) => {
  button.addEventListener("click", () => {
    crmState.mode = button.dataset.mode;
    document.querySelectorAll("#modeTabs button").forEach((tab) => tab.classList.toggle("active", tab === button));
    renderAll();
  });
});

document.querySelectorAll(".detail-tabs button").forEach((button) => {
  button.addEventListener("click", () => {
    crmState.detailTab = button.dataset.detail;
    document.querySelectorAll(".detail-tabs button").forEach((tab) => tab.classList.toggle("active", tab === button));
    renderDetail();
  });
});

searchInput.addEventListener("input", renderAll);

document.querySelector("#densityToggle").addEventListener("click", () => {
  document.body.classList.toggle("compact");
});

function openCreateModal(title) {
  modalTitle.textContent = title || newRecordButton.textContent;
  document.querySelector("#modalName").value = "";
  document.querySelector("#modalCompany").value = "";
  document.querySelector("#modalValue").value = "";
  recordModal.showModal();
}

newRecordButton.addEventListener("click", () => openCreateModal(newRecordButton.textContent));

document.querySelector("#saveRecordButton").addEventListener("click", () => {
  const name = document.querySelector("#modalName").value.trim() || "New Digital Wave Lead";
  const company = document.querySelector("#modalCompany").value.trim() || "New Account";
  const value = document.querySelector("#modalValue").value.trim() || "$12,000";
  const newRecord = {
    id: `new-${Date.now()}`,
    type: crmState.view === "deals" ? "deal" : "lead",
    name,
    company,
    status: "New Lead",
    stage: "New Lead",
    value,
    owner: "Mariam",
    email: "hello@example.com",
    phone: "+20 100 000 0000",
    next: "Qualify new opportunity",
    source: "Manual",
    score: 50,
  };
  records.unshift(newRecord);
  crmState.selectedId = newRecord.id;
  saveRecords();
  recordModal.close();
  renderAll();
  showToast("Record created");
});

function importDemoRecords() {
  const imported = [
    ["Website rebuild", "Cairo Labs", "$19,700", "Google Ads"],
    ["Client portal", "Mena Properties", "$28,300", "CSV import"],
    ["Support CRM", "WaveCare", "$16,900", "CSV import"],
  ];
  imported.forEach(([name, company, value, source], index) => {
    records.unshift({
      id: `import-${Date.now()}-${index}`,
      type: index === 1 ? "deal" : "lead",
      name,
      company,
      status: "New Lead",
      stage: "New Lead",
      value,
      owner: "Mariam",
      email: `${company.toLowerCase().replaceAll(" ", ".")}@example.com`,
      phone: "+20 100 000 0000",
      next: "Review imported opportunity",
      source,
      score: 68 + index * 7,
    });
  });
  saveRecords();
  renderAll();
  showToast("Imported 3 records");
}

document.querySelector("#importButton").addEventListener("click", importDemoRecords);

function renderCommands() {
  const query = commandInput.value.trim().toLowerCase();
  const visibleCommands = commands.filter(([title, subtitle]) => `${title} ${subtitle}`.toLowerCase().includes(query));
  commandResults.innerHTML = visibleCommands.map(([title, subtitle], index) => `
    <button class="command-row" data-command-index="${commands.findIndex((command) => command[0] === title)}" type="button">
      <strong>${title}</strong>
      <span>${subtitle}</span>
      <kbd>${index + 1}</kbd>
    </button>
  `).join("");

  commandResults.querySelectorAll(".command-row").forEach((row) => {
    row.addEventListener("click", () => {
      const command = commands[Number(row.dataset.commandIndex)];
      commandModal.close();
      command[2]();
      showToast(command[0]);
    });
  });
}

document.querySelector("#commandButton").addEventListener("click", () => {
  commandModal.showModal();
  commandInput.value = "";
  renderCommands();
  commandInput.focus();
});

commandInput.addEventListener("input", renderCommands);

window.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    commandModal.showModal();
    commandInput.value = "";
    renderCommands();
    commandInput.focus();
  }
});

renderAll();
