
const SUPABASE_URL = "https://esvbmzicadtmfvnancof.supabase.co";
const SUPABASE_KEY = "sb_publishable_fopD3_XxbPXwHGwQCKyWCQ_3g-7lEWq";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const MODES = [
  "CRYSTAL",
  "SWORD",
  "SMP",
  "MACE",
  "NETHERITE POT",
  "AXE"
];

const playersList = document.getElementById("playersList");
const searchInput = document.getElementById("searchInput");
const regionFilter = document.getElementById("regionFilter");
const emptyMessage = document.getElementById("emptyMessage");
const errorMessage = document.getElementById("errorMessage");

const loginModal = document.getElementById("loginModal");
const playerModal = document.getElementById("playerModal");
const profileModal = document.getElementById("profileModal");

let records = [];
let groupedPlayers = [];
let displayedPlayers = [];
let selectedMode = "GERAL";
let currentUser = null;
let staffRole = null;
let editingPlayerId = null;

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function showModal(modal) {
  modal.classList.remove("hidden");
}

function hideModal(modal) {
  modal.classList.add("hidden");
}

function getFlag(region) {
  const flags = {
    "Brasil": "🇧🇷",
    "Estados Unidos": "🇺🇸",
    "México": "🇲🇽",
    "Uruguai": "🇺🇾",
    "Equador": "🇪🇨",
    "Venezuela": "🇻🇪",
    "Colômbia": "🇨🇴",
    "Chile": "🇨🇱",
    "Argentina": "🇦🇷",
    "Espanha": "🇪🇸"
  };

  return flags[region] || "🌎";
}

function getHead(player) {
  if (player.skin_url) return player.skin_url;

  return `https://mc-heads.net/avatar/${encodeURIComponent(player.player_name)}/64`;
}

function tierScore(tier) {
  const match = String(tier || "").match(/^(HT|LT)([1-5])$/);
  if (!match) return 999;

  return Number(match[2]) * 2 + (match[1] === "HT" ? 0 : 1);
}

function getBestTier(playerRecords) {
  if (!playerRecords.length) return "—";

  return [...playerRecords].sort(
    (a, b) => tierScore(a.tier) - tierScore(b.tier)
  )[0].tier;
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("pt-BR");
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

function clearError() {
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");
}

// ==========================================
// AGRUPAR OS REGISTROS POR JOGADOR
// ==========================================

function groupPlayers() {
  const map = new Map();

  records.forEach(record => {
    const key = String(record.player_name || "").trim().toLowerCase();

    if (!key) return;

    if (!map.has(key)) {
      map.set(key, {
        key,
        player_name: record.player_name,
        region: record.region || "Brasil",
        skin_url: record.skin_url || null,
        records: []
      });
    }

    const player = map.get(key);
    player.records.push(record);

    if (!player.skin_url && record.skin_url) {
      player.skin_url = record.skin_url;
    }
  });

  groupedPlayers = Array.from(map.values());

  groupedPlayers.forEach(player => {
    player.totalPoints = player.records.reduce(
      (sum, record) => sum + Number(record.points || 0), 0
    );

    player.totalTests = player.records.reduce(
      (sum, record) => sum + Number(record.tests || 0), 0
    );

    player.modes = [...new Set(
      player.records.map(record => record.mode)
    )];

    player.bestTier = getBestTier(player.records);
  });

  updateDashboard();
}

function updateDashboard() {
  document.getElementById("playersCount").textContent =
    formatNumber(groupedPlayers.length);

  const totalTests = records.reduce(
    (sum, record) => sum + Number(record.tests || 0), 0
  );

  document.getElementById("testsCount").textContent =
    formatNumber(totalTests);
}

// ==========================================
// CARREGAR DADOS DO SUPABASE
// ==========================================

async function loadPlayers() {
  clearError();
  playersList.innerHTML = '<div class="loading">Carregando ranking...</div>';

  const { data, error } = await db
    .from("players")
    .select("*")
    .order("points", { ascending: false });

  if (error) {
    playersList.innerHTML = "";
    showError("Erro ao carregar jogadores: " + error.message);
    return;
  }

  records = data || [];
  groupPlayers();
  renderPlayers();
}

// ==========================================
// RENDERIZAR RANKING
// ==========================================

function renderPlayers() {
  const search = searchInput.value.trim().toLowerCase();
  const region = regionFilter.value;

  displayedPlayers = groupedPlayers.filter(player => {
    const matchesName =
      player.player_name.toLowerCase().includes(search);

    const matchesRegion =
      !region || player.region === region;

    const matchesMode =
      selectedMode === "GERAL" ||
      player.records.some(record => record.mode === selectedMode);

    return matchesName && matchesRegion && matchesMode;
  });

  displayedPlayers.sort((a, b) => {
    const pointsA = selectedMode === "GERAL"
      ? a.totalPoints
      : a.records
          .filter(record => record.mode === selectedMode)
          .reduce((sum, record) => sum + Number(record.points || 0), 0);

    const pointsB = selectedMode === "GERAL"
      ? b.totalPoints
      : b.records
          .filter(record => record.mode === selectedMode)
          .reduce((sum, record) => sum + Number(record.points || 0), 0);

    return pointsB - pointsA;
  });

  playersList.innerHTML = "";
  emptyMessage.classList.toggle("hidden", displayedPlayers.length !== 0);

  displayedPlayers.forEach((player, index) => {
    const points = selectedMode === "GERAL"
      ? player.totalPoints
      : player.records
          .filter(record => record.mode === selectedMode)
          .reduce((sum, record) => sum + Number(record.points || 0), 0);

    const row = document.createElement("div");
    row.className = "player-row";
    row.dataset.index = index;

    row.innerHTML = `
      <span class="position">${index + 1}</span>

      <div class="player-info">
        <img
          class="player-head"
          src="${escapeHTML(getHead(player))}"
          alt=""
        >
        <span class="player-name">${escapeHTML(player.player_name)}</span>
      </div>

      <span class="region">
        ${getFlag(player.region)} ${escapeHTML(player.region)}
      </span>

      <span class="points">${formatNumber(points)}</span>
    `;

    const image = row.querySelector(".player-head");
    image.addEventListener("error", () => {
      image.src = "https://mc-heads.net/avatar/MHF_Steve/64";
    }, { once: true });

    playersList.appendChild(row);
  });
}

// ==========================================
// ABRIR PERFIL DO JOGADOR
// ==========================================

function openProfile(player) {
  const modeRecords = player.records
    .slice()
    .sort((a, b) => MODES.indexOf(a.mode) - MODES.indexOf(b.mode));

  const versatility = Math.round(
    (player.modes.length / MODES.length) * 100
  );

  const profileContent = document.getElementById("profileContent");

  profileContent.innerHTML = `
    <span class="small-label">PLAYER PROFILE</span>

    <div class="profile-top">
      <img
        class="profile-head"
        id="profileHead"
        src="${escapeHTML(getHead(player))}"
        alt=""
      >

      <div>
        <div class="profile-name">${escapeHTML(player.player_name)}</div>
        <div class="profile-region">
          ${getFlag(player.region)} ${escapeHTML(player.region)}
        </div>
      </div>
    </div>

    <div class="profile-stats">
      <div class="profile-stat">
        <span>PONTOS TOTAIS</span>
        <strong>${formatNumber(player.totalPoints)}</strong>
      </div>

      <div class="profile-stat">
        <span>MELHOR TIER</span>
        <strong>${escapeHTML(player.bestTier)}</strong>
      </div>

      <div class="profile-stat">
        <span>TESTES REGISTRADOS</span>
        <strong>${formatNumber(player.totalTests)}</strong>
      </div>
    </div>

    <h3 class="profile-subtitle">DESEMPENHO</h3>
    <div class="performance-box">
      <span>Melhor tier alcançado: <strong>${escapeHTML(player.bestTier)}</strong></span>
      <span>Pontuação acumulada: <strong>${formatNumber(player.totalPoints)}</strong></span>
    </div>

    <h3 class="profile-subtitle">VERSATILIDADE</h3>
    <div class="versatility-info">
      <span>${player.modes.length} de ${MODES.length} modos testados</span>
      <strong>${versatility}%</strong>
    </div>
    <div class="versatility-track">
      <div class="versatility-fill" style="width:${versatility}%"></div>
    </div>

    <h3 class="profile-subtitle">MODOS TESTADOS</h3>

    <div class="mode-profile-list">
      ${modeRecords.map(record => `
        <div class="mode-profile-card">
          <strong>${escapeHTML(record.mode)}</strong>
          <span class="mode-tier">${escapeHTML(record.tier)}</span>
          <span>${formatNumber(record.points)} pts</span>
          <span>${formatNumber(record.tests)} testes</span>

          ${staffRole ? `
            <div class="mode-actions">
              <button data-profile-action="edit" data-id="${escapeHTML(record.id)}">EDITAR</button>
              <button data-profile-action="delete" data-id="${escapeHTML(record.id)}">EXCLUIR</button>
            </div>
          ` : ""}
        </div>
      `).join("")}
    </div>
  `;

  const profileHead = document.getElementById("profileHead");
  profileHead.addEventListener("error", () => {
    profileHead.src = "https://mc-heads.net/avatar/MHF_Steve/64";
  }, { once: true });

  showModal(profileModal);
}

playersList.addEventListener("click", event => {
  const row = event.target.closest(".player-row");
  if (!row) return;

  const player = displayedPlayers[Number(row.dataset.index)];
  if (player) openProfile(player);
});

// ==========================================
// LOGIN E PERMISSÕES DA STAFF
// ==========================================

function updateStaffInterface() {
  const isStaff = Boolean(currentUser && staffRole);

  document.getElementById("loginBtn").classList.toggle("hidden", isStaff);
  document.getElementById("logoutBtn").classList.toggle("hidden", !isStaff);
  document.getElementById("addPlayerBtn").classList.toggle("hidden", !isStaff);

  const status = document.getElementById("staffStatus");
  status.textContent = isStaff ? staffRole.toUpperCase() : "VISITANTE";
  status.style.color = isStaff ? "#9b5cff" : "#91899f";
}

async function checkStaff(user) {
  currentUser = user || null;
  staffRole = null;

  if (user) {
    const { data, error } = await db
      .from("staff_members")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!error && data) {
      staffRole = data.role;
    }
  }

  updateStaffInterface();
}

async function login(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const message = document.getElementById("loginMessage");

  message.textContent = "Entrando...";

  const { data, error } = await db.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    message.textContent = "Erro ao entrar: " + error.message;
    return;
  }

  await checkStaff(data.user);

  if (!staffRole) {
    await db.auth.signOut();
    currentUser = null;
    updateStaffInterface();
    message.textContent = "Essa conta ainda não foi cadastrada como staff.";
    return;
  }

  hideModal(loginModal);
  document.getElementById("loginForm").reset();
  await loadPlayers();
}

async function logout() {
  await db.auth.signOut();
  currentUser = null;
  staffRole = null;
  updateStaffInterface();
  await loadPlayers();
}

// ==========================================
// ADICIONAR E EDITAR TESTES
// ==========================================

function openAddPlayer() {
  editingPlayerId = null;

  document.getElementById("playerModalTitle").textContent = "ADICIONAR TESTE";
  document.getElementById("playerForm").reset();
  document.getElementById("playerPoints").value = 0;
  document.getElementById("playerTests").value = 0;
  document.getElementById("playerMessage").textContent = "";

  showModal(playerModal);
}

function openEditPlayer(id) {
  const record = records.find(item => String(item.id) === String(id));
  if (!record) return;

  editingPlayerId = record.id;

  document.getElementById("playerModalTitle").textContent = "EDITAR TESTE";
  document.getElementById("playerName").value = record.player_name || "";
  document.getElementById("playerMode").value = record.mode || "CRYSTAL";
  document.getElementById("playerTier").value = record.tier || "HT5";
  document.getElementById("playerRegion").value = record.region || "Brasil";
  document.getElementById("playerPoints").value = record.points || 0;
  document.getElementById("playerTests").value = record.tests || 0;
  document.getElementById("playerSkin").value = record.skin_url || "";
  document.getElementById("playerMessage").textContent = "";

  hideModal(profileModal);
  showModal(playerModal);
}

async function savePlayer(event) {
  event.preventDefault();

  if (!currentUser || !staffRole) {
    alert("Você precisa estar logado como staff.");
    return;
  }

  const message = document.getElementById("playerMessage");
  message.textContent = "Salvando...";

  const playerName = document.getElementById("playerName").value.trim();
  const playerMode = document.getElementById("playerMode").value;

  const playerData = {
    player_name: playerName,
    mode: playerMode,
    tier: document.getElementById("playerTier").value,
    region: document.getElementById("playerRegion").value,
    points: Number(document.getElementById("playerPoints").value),
    tests: Number(document.getElementById("playerTests").value),
    skin_url: document.getElementById("playerSkin").value.trim() || null
  };

  if (!editingPlayerId) {
    const duplicate = records.find(record =>
      record.player_name.toLowerCase() === playerName.toLowerCase() &&
      record.mode === playerMode
    );

    if (duplicate) {
      message.textContent =
        "Esse jogador já tem um registro nesse modo. Abra o perfil dele e edite o modo existente.";
      return;
    }
  }

  let result;

  if (editingPlayerId) {
    result = await db
      .from("players")
      .update(playerData)
      .eq("id", editingPlayerId);
  } else {
    result = await db
      .from("players")
      .insert(playerData);
  }

  if (result.error) {
    message.textContent = "Erro ao salvar: " + result.error.message;
    return;
  }

  message.textContent = "Registro salvo!";
  await loadPlayers();

  setTimeout(() => hideModal(playerModal), 500);
}

// ==========================================
// EXCLUIR REGISTRO DE UM MODO
// ==========================================

async function deletePlayer(id) {
  if (!currentUser || !staffRole) {
    alert("Você precisa estar logado como staff.");
    return;
  }

  const record = records.find(item => String(item.id) === String(id));
  if (!record) return;

  const confirmed = confirm(
    `Excluir o registro de ${record.player_name} no modo ${record.mode}?`
  );

  if (!confirmed) return;

  const { error } = await db
    .from("players")
    .delete()
    .eq("id", id);

  if (error) {
    alert("Erro ao excluir: " + error.message);
    return;
  }

  hideModal(profileModal);
  await loadPlayers();
}

// ==========================================
// EVENTOS
// ==========================================

document.getElementById("loginBtn").addEventListener("click", () => {
  showModal(loginModal);
});

document.getElementById("logoutBtn").addEventListener("click", logout);
document.getElementById("addPlayerBtn").addEventListener("click", openAddPlayer);

document.getElementById("loginForm").addEventListener("submit", login);
document.getElementById("playerForm").addEventListener("submit", savePlayer);

searchInput.addEventListener("input", renderPlayers);
regionFilter.addEventListener("change", renderPlayers);

document.getElementById("modeTabs").addEventListener("click", event => {
  const button = event.target.closest("[data-mode]");
  if (!button) return;

  selectedMode = button.dataset.mode;

  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.toggle("active", tab === button);
  });

  renderPlayers();
});

document.getElementById("profileContent").addEventListener("click", event => {
  const button = event.target.closest("[data-profile-action]");
  if (!button) return;

  const id = button.dataset.id;

  if (button.dataset.profileAction === "edit") {
    openEditPlayer(id);
  }

  if (button.dataset.profileAction === "delete") {
    deletePlayer(id);
  }
});

document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", () => {
    hideModal(document.getElementById(button.dataset.close));
  });
});

document.querySelectorAll(".modal").forEach(modal => {
  modal.addEventListener("click", event => {
    if (event.target === modal) hideModal(modal);
  });
});

// ==========================================
// INICIALIZAÇÃO
// ==========================================

async function startSite() {
  const { data } = await db.auth.getSession();

  if (data.session) {
    await checkStaff(data.session.user);
  } else {
    updateStaffInterface();
  }

  await loadPlayers();

  db.auth.onAuthStateChange(async (_event, session) => {
    await checkStaff(session?.user || null);
    await loadPlayers();
  });
}

startSite();
