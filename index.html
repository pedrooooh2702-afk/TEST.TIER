
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TEST TIER | Minecraft PvP Rankings</title>
  <link rel="stylesheet" href="style.css">
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
  <header class="topbar">
    <a class="logo" href="#">TEST<span>TIER</span></a>
    <div class="top-actions">
      <span id="staffStatus" class="staff-status">VISITANTE</span>
      <button id="loginBtn" class="outline-btn">STAFF LOGIN</button>
      <button id="logoutBtn" class="outline-btn hidden">SAIR</button>
    </div>
  </header>

  <main class="container">
    <section class="hero">
      <div class="hero-tag">MINECRAFT PVP RANKINGS</div>
      <h1>TEST <span>TIER</span></h1>
      <p>O ranking competitivo da comunidade.</p>
      <div class="hero-line"></div>
    </section>

    <section class="stats-grid">
      <div class="stat-card">
        <span class="stat-label">MODOS</span>
        <strong>6</strong>
        <small>MODOS COMPETITIVOS</small>
      </div>
      <div class="stat-card">
        <span class="stat-label">TEMPORADA</span>
        <strong>S1</strong>
        <small>TEMPORADA ATUAL</small>
      </div>
      <div class="stat-card">
        <span class="stat-label">JOGADORES</span>
        <strong id="playersCount">0</strong>
        <small>CADASTRADOS</small>
      </div>
      <div class="stat-card">
        <span class="stat-label">TESTES</span>
        <strong id="testsCount">0</strong>
        <small>REGISTRADOS</small>
      </div>
    </section>

    <section class="ranking-section">
      <div class="section-heading">
        <div>
          <span class="small-label">CLASSIFICAÇÃO</span>
          <h2>PLAYER RANKING</h2>
        </div>
        <button id="addPlayerBtn" class="primary-btn hidden">+ ADICIONAR TESTE</button>
      </div>

      <div class="tabs" id="modeTabs">
        <button class="tab active" data-mode="GERAL">GERAL</button>
        <button class="tab" data-mode="CRYSTAL">CRYSTAL</button>
        <button class="tab" data-mode="SWORD">SWORD</button>
        <button class="tab" data-mode="SMP">SMP</button>
        <button class="tab" data-mode="MACE">MACE</button>
        <button class="tab" data-mode="NETHERITE POT">NETHERITE POT</button>
        <button class="tab" data-mode="AXE">AXE</button>
      </div>

      <div class="filters">
        <input id="searchInput" type="search" placeholder="Pesquisar jogador...">
        <select id="regionFilter">
          <option value="">Todas as regiões</option>
          <option>Brasil</option>
          <option>Estados Unidos</option>
          <option>México</option>
          <option>Uruguai</option>
          <option>Equador</option>
          <option>Venezuela</option>
          <option>Colômbia</option>
          <option>Chile</option>
          <option>Argentina</option>
          <option>Espanha</option>
        </select>
      </div>

      <div class="ranking-header">
        <span>#</span>
        <span>JOGADOR</span>
        <span>REGIÃO</span>
        <span>PONTOS</span>
      </div>

      <div id="playersList" class="players-list">
        <div class="loading">Carregando ranking...</div>
      </div>

      <p id="emptyMessage" class="empty-message hidden">Nenhum jogador encontrado.</p>
      <p id="errorMessage" class="error-message hidden"></p>
    </section>

    <section class="season-section">
      <span class="small-label">COMPETITIVO</span>
      <h2>TEMPORADA <span>S1</span></h2>
      <p>Os melhores jogadores da comunidade TEST TIER.</p>
    </section>

    <footer>
      <span class="logo">TEST<span>TIER</span></span>
      <p>TEST TIER © 2026 — Todos os direitos reservados.</p>
    </footer>
  </main>

  <!-- LOGIN -->
  <div id="loginModal" class="modal hidden">
    <div class="modal-box">
      <button class="close-btn" data-close="loginModal">×</button>
      <span class="small-label">ÁREA RESTRITA</span>
      <h2>STAFF LOGIN</h2>
      <form id="loginForm">
        <label>E-mail</label>
        <input id="loginEmail" type="email" placeholder="Seu e-mail" required>
        <label>Senha</label>
        <input id="loginPassword" type="password" placeholder="Sua senha" required>
        <button class="primary-btn full-btn" type="submit">ENTRAR</button>
      </form>
      <p id="loginMessage" class="form-message"></p>
    </div>
  </div>

  <!-- ADICIONAR / EDITAR TESTE -->
  <div id="playerModal" class="modal hidden">
    <div class="modal-box">
      <button class="close-btn" data-close="playerModal">×</button>
      <span class="small-label">GERENCIAMENTO</span>
      <h2 id="playerModalTitle">ADICIONAR TESTE</h2>

      <form id="playerForm">
        <label>Nick do Minecraft</label>
        <input id="playerName" maxlength="16" placeholder="Ex: Steve" required>

        <label>Modo testado</label>
        <select id="playerMode" required>
          <option value="CRYSTAL">CRYSTAL</option>
          <option value="SWORD">SWORD</option>
          <option value="SMP">SMP</option>
          <option value="MACE">MACE</option>
          <option value="NETHERITE POT">NETHERITE POT</option>
          <option value="AXE">AXE</option>
        </select>

        <label>Tier</label>
        <select id="playerTier" required>
          <option>HT1</option><option>LT1</option>
          <option>HT2</option><option>LT2</option>
          <option>HT3</option><option>LT3</option>
          <option>HT4</option><option>LT4</option>
          <option>HT5</option><option>LT5</option>
        </select>

        <label>Região</label>
        <select id="playerRegion" required>
          <option>Brasil</option>
          <option>Estados Unidos</option>
          <option>México</option>
          <option>Uruguai</option>
          <option>Equador</option>
          <option>Venezuela</option>
          <option>Colômbia</option>
          <option>Chile</option>
          <option>Argentina</option>
          <option>Espanha</option>
        </select>

        <label>Pontos deste modo</label>
        <input id="playerPoints" type="number" min="0" value="0" required>

        <label>Quantidade de testes neste modo</label>
        <input id="playerTests" type="number" min="0" value="0" required>

        <label>URL da skin (opcional)</label>
        <input id="playerSkin" type="url" placeholder="https://...">

        <button class="primary-btn full-btn" type="submit">SALVAR TESTE</button>
      </form>
      <p id="playerMessage" class="form-message"></p>
    </div>
  </div>

  <!-- PERFIL DO JOGADOR -->
  <div id="profileModal" class="modal hidden">
    <div class="modal-box profile-box">
      <button class="close-btn" data-close="profileModal">×</button>
      <div id="profileContent"></div>
    </div>
  </div>

  <script src="script.js"></script>
</body>
</html>
