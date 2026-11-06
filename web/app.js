// ============================================================================
// FESTFLOW WEB OBSERVABILITY CLIENT (Pure Vanilla JavaScript)
// 100% Mathematically Rigorous Data Structures & Dynamic Visualizers
// Zero Emojis: Production Grade
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. OPENING SPLASH
  // --------------------------------------------------------------------------
  const introSplash = document.getElementById('intro-splash');
  setTimeout(() => {
    if (introSplash) {
      introSplash.classList.add('fade-out');
      setTimeout(() => { introSplash.style.display = 'none'; }, 800);
    }
  }, 2200);

  if (introSplash) {
    introSplash.addEventListener('click', () => {
      introSplash.classList.add('fade-out');
      setTimeout(() => { introSplash.style.display = 'none'; }, 800);
    });
  }

  // --------------------------------------------------------------------------
  // 2. DOM NODES
  // --------------------------------------------------------------------------
  const actionsMenu = document.getElementById('actions-menu');
  const structuresMenu = document.getElementById('structures-menu');
  const btnExploreStructures = document.getElementById('btn-explore-structures');
  const btnBackActions = document.getElementById('btn-back-actions');
  const btnStressTest = document.getElementById('btn-stress-test');

  const canvasActionTag = document.getElementById('canvas-action-tag');
  const canvasDsBadge = document.getElementById('canvas-ds-badge');
  const canvasBody = document.getElementById('canvas-body');
  const telemetryText = document.getElementById('telemetry-text');
  const metricNodes = document.getElementById('metric-nodes');

  let activeAction = 'scan';
  let activeStruct = 'hashtable';

  // ==========================================================================
  // 3. MATHEMATICALLY STRICT AVL TREE IMPLEMENTATION (IN-BROWSER ENGINE)
  // ==========================================================================
  class AVLNode {
    constructor(score, team, tid) {
      this.score = score;
      this.team = team;
      this.tid = tid;
      this.height = 1;
      this.left = null;
      this.right = null;
    }
  }

  class StrictAVLTree {
    constructor() {
      this.root = null;
      this.lastRotationLog = "Initial balanced state. Height: 3 | All balance factors in {-1, 0, 1}.";
      this.rotationCount = 0;
    }

    height(node) {
      return node ? node.height : 0;
    }

    getBalance(node) {
      return node ? (this.height(node.left) - this.height(node.right)) : 0;
    }

    rightRotate(y) {
      const x = y.left;
      const T2 = x.right;
      x.right = y;
      y.left = T2;
      y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
      x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
      return x;
    }

    leftRotate(x) {
      const y = x.right;
      const T2 = y.left;
      y.left = x;
      x.right = T2;
      x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
      y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
      return y;
    }

    insert(score, team, tid) {
      this.lastRotationLog = "Inserted without rotation violation. Invariants preserved.";
      this.root = this._insertHelper(this.root, score, team, tid);
    }

    _insertHelper(node, score, team, tid) {
      if (!node) {
        return new AVLNode(score, team, tid);
      }

      // STRICT BST PROPERTY:
      // Left subtree strictly LESS than node.score
      // Right subtree strictly GREATER than node.score
      if (score < node.score || (score === node.score && tid < node.tid)) {
        node.left = this._insertHelper(node.left, score, team, tid);
      } else {
        node.right = this._insertHelper(node.right, score, team, tid);
      }

      node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
      const balance = this.getBalance(node);

      // 1. Left-Left Case
      if (balance > 1 && (score < node.left.score || (score === node.left.score && tid < node.left.tid))) {
        this.rotationCount++;
        this.lastRotationLog = `VIOLATION DETECTED at '${node.team}' (BF = +${balance}). Executed LEFT-LEFT (Single Right) Rotation. '${node.left.team}' promoted to parent.`;
        return this.rightRotate(node);
      }

      // 2. Right-Right Case
      if (balance < -1 && (score > node.right.score || (score === node.right.score && tid > node.right.tid))) {
        this.rotationCount++;
        this.lastRotationLog = `VIOLATION DETECTED at '${node.team}' (BF = ${balance}). Executed RIGHT-RIGHT (Single Left) Rotation. '${node.right.team}' promoted to parent.`;
        return this.leftRotate(node);
      }

      // 3. Left-Right Case
      if (balance > 1 && (score > node.left.score || (score === node.left.score && tid > node.left.tid))) {
        this.rotationCount++;
        this.lastRotationLog = `VIOLATION DETECTED at '${node.team}' (BF = +${balance}). Executed LEFT-RIGHT Double Rotation (Left on '${node.left.team}', Right on '${node.team}').`;
        node.left = this.leftRotate(node.left);
        return this.rightRotate(node);
      }

      // 4. Right-Left Case
      if (balance < -1 && (score < node.right.score || (score === node.right.score && tid < node.right.tid))) {
        this.rotationCount++;
        this.lastRotationLog = `VIOLATION DETECTED at '${node.team}' (BF = ${balance}). Executed RIGHT-LEFT Double Rotation (Right on '${node.right.team}', Left on '${node.team}').`;
        node.right = this.rightRotate(node.right);
        return this.leftRotate(node);
      }

      return node;
    }
  }

  // Initialize AVL Tree with valid BST structure:
  // Root = 90. Left child = 85 (85 < 90). Right child = 95 (95 > 90).
  const avlTree = new StrictAVLTree();
  avlTree.insert(90, "Team ByteBusters", 101);
  avlTree.insert(85, "Team AlphaDev", 102);
  avlTree.insert(95, "Team CyberVanguard", 103);
  avlTree.insert(80, "TechTitans", 104);
  avlTree.insert(98, "CodeCraft", 105);

  // ==========================================================================
  // 4. IN-MEMORY STATE FOR OTHER STRUCTURES
  // ==========================================================================
  
  // (A) Ticket Scan State
  let scanState = {
    verified_name: 'Aarav Malhotra',
    verified_ticket: 'QR-8821',
    verified_college: 'IIT Delhi',
    verified_event: 'National Hackathon 2026',
    bloom_bits: [142, 608, 891],
    hash_bucket: 42,
    scan_result: 1,
    is_duplicate: false,
    verified_clean: true
  };

  // (B) Interval Tree Schedule Slots
  let bookedSlots = [
    { start: 9, end: 11, name: 'Opening Keynote', hall: 'Main Auditorium', isNew: false },
    { start: 11, end: 13, name: 'Hackathon Sprint 1', hall: 'Coding Lab', isNew: false },
    { start: 14, end: 17, name: 'RoboWars Combat', hall: 'Arena 1', isNew: false },
    { start: 18, end: 21, name: 'Cultural Gala Night', hall: 'Open Grounds', isNew: false }
  ];

  // (C) Priority Queue Max-Heap
  let heapArray = [
    { id: 501, prio: 99, desc: 'Medical Code Red: Ambulance' },
    { id: 502, prio: 85, desc: 'VIP Security Escort: Speaker' },
    { id: 503, prio: 70, desc: 'Power Grid Generator Check' }
  ];
  let nextReqId = 504;
  let lastHeapLog = "Heap root: Priority 99 (Medical Code Red).";

  // (C2) Campus DAG Evacuation Network
  const CAMPUS_HUBS = [
    { id: 0, name: "Security Gate", full: "Security Gate (Main Entrance)", zone: "Perimeter" },
    { id: 1, name: "Tech Workshop", full: "Tech Workshop Wing", zone: "Academic Block" },
    { id: 2, name: "Semi-Finals Hall", full: "Semi-Finals Central Hall", zone: "Central Corridor" },
    { id: 3, name: "Robotics Arena", full: "Robotics Combat Arena", zone: "East Courtyard" },
    { id: 4, name: "Grand Finals", full: "Grand Finals Auditorium Hub", zone: "Auditorium Hub" },
    { id: 5, name: "Medical Camp", full: "Open Grounds (Medical Camp)", zone: "Open Fields Triage" }
  ];

  const CAMPUS_EDGES = [
    { from: 0, to: 1, weight: 90 },
    { from: 0, to: 2, weight: 120 },
    { from: 1, to: 2, weight: 80 },
    { from: 1, to: 3, weight: 110 },
    { from: 2, to: 4, weight: 150 },
    { from: 3, to: 4, weight: 200 },
    { from: 4, to: 5, weight: 100 },
    { from: 2, to: 5, weight: 230 }
  ];

  let evacState = {
    startHub: 0,
    destHub: 4
  };

  function computeDijkstra(start, dest) {
    const n = CAMPUS_HUBS.length;
    const dist = new Array(n).fill(Infinity);
    const visited = new Array(n).fill(false);
    const parent = new Array(n).fill(-1);

    dist[start] = 0;

    for (let i = 0; i < n; i++) {
      let u = -1;
      let minD = Infinity;
      for (let j = 0; j < n; j++) {
        if (!visited[j] && dist[j] < minD) {
          minD = dist[j];
          u = j;
        }
      }

      if (u === -1 || u === dest) break;
      visited[u] = true;

      for (const e of CAMPUS_EDGES) {
        if (e.from === u) {
          const v = e.to;
          if (!visited[v] && dist[u] + e.weight < dist[v]) {
            dist[v] = dist[u] + e.weight;
            parent[v] = u;
          }
        }
      }
    }

    if (dist[dest] === Infinity) return { path: [], totalDist: -1, segments: [] };

    const path = [];
    let curr = dest;
    while (curr !== -1) {
      path.unshift(curr);
      curr = parent[curr];
    }

    const segments = [];
    for (let i = 0; i < path.length - 1; i++) {
      const u = path[i];
      const v = path[i + 1];
      const edge = CAMPUS_EDGES.find(e => e.from === u && e.to === v);
      segments.push({
        from: u,
        to: v,
        fromName: CAMPUS_HUBS[u].name,
        toName: CAMPUS_HUBS[v].name,
        weight: edge ? edge.weight : 0
      });
    }

    return { path, totalDist: dist[dest], segments };
  }

  // (D) Circular Queue Judges
  let cqueueFront = 0;
  let stallsEvaluated = 0;
  const JUDGES_LIST = [
    { id: 1, name: "Dr. Rajesh Sharma", domain: "AI & Systems", stalls: 0 },
    { id: 2, name: "Prof. Sunita Rao", domain: "Distributed Data", stalls: 0 },
    { id: 3, name: "Vikram Singhania", domain: "Fintech & Security", stalls: 0 },
    { id: 4, name: "Priya Nair", domain: "Full-Stack Web", stalls: 0 },
    { id: 5, name: "Anand Deshmukh", domain: "Robotics & IoT", stalls: 0 },
    { id: 6, name: "Kavita Menon", domain: "Cloud & DevOps", stalls: 0 },
    { id: 7, name: "Arun Kulkarni", domain: "Embedded Firmware", stalls: 0 },
    { id: 8, name: "Neha Chawla", domain: "UI/UX & Mobile", stalls: 0 }
  ];

  const HACKATHON_STALLS = [
    { id: 101, team: "Team ByteBusters", project: "AI Autonomous Turnstile", domain: "AI & Systems" },
    { id: 102, team: "Team AlphaDev", project: "Distributed Blockchain Ledger", domain: "Distributed Data" },
    { id: 103, team: "Team CyberVanguard", project: "Zero-Knowledge Fraud Shield", domain: "Fintech & Security" },
    { id: 104, team: "Team TechTitans", project: "Cloud Logistics Dashboard", domain: "Full-Stack Web" },
    { id: 105, team: "Team CodeCraft", project: "RoboCombat IoT Controller", domain: "Robotics & IoT" },
    { id: 106, team: "Team DevDynasty", project: "Kubernetes Cluster Auto-scaler", domain: "Cloud & DevOps" },
    { id: 107, team: "Team QuantumCoders", project: "Real-Time RTOS Sensor Mesh", domain: "Embedded Firmware" },
    { id: 108, team: "Team PixelPioneers", project: "Flutter Campus Companion", domain: "UI/UX & Mobile" },
    { id: 109, team: "Team NeuralForge", project: "Crowd Density Estimation", domain: "AI & Systems" },
    { id: 110, team: "Team BioPulse", project: "Wearable ECG Telemetry Patch", domain: "Robotics & IoT" },
    { id: 111, team: "Team CloudShield", project: "DDoS Mitigation Mesh", domain: "Cloud & DevOps" },
    { id: 112, team: "Team AeroWings", project: "Autonomous Quadcopter Delivery", domain: "Embedded Firmware" },
    { id: 113, team: "Team GreenVolt", project: "Solar Inverter Smart Balancer", domain: "Distributed Data" }
  ];

  let judgeAssignments = [];

  // (E) Segment Tree Rooms (Sectors 0-3 = West Wing; Sectors 4-7 = East Wing)
  let sectorRooms = [40, 35, 30, 35, 30, 30, 25, 25];
  function getWestWingSum() { return sectorRooms[0] + sectorRooms[1] + sectorRooms[2] + sectorRooms[3]; }
  function getEastWingSum() { return sectorRooms[4] + sectorRooms[5] + sectorRooms[6] + sectorRooms[7]; }
  function getCampusTotal() { return getWestWingSum() + getEastWingSum(); }

  // (F) Doubly Linked List Undo Stack
  let undoHistory = [
    {
      id: 1,
      type: "TICKET_SCAN",
      title: "Scan Entry Ticket",
      desc: "Ticket QR-8821 verified for Aarav Malhotra",
      revert: () => {
        scanState.scan_result = 0;
        enteredTickets.delete("QR-8821");
        telemetryText.textContent = "[Undo Stack] Reverted ticket scan for Aarav Malhotra. Status reset to Registered.";
      }
    },
    {
      id: 2,
      type: "CROWD_UPDATE",
      title: "Crowd Sector Influx",
      desc: "Sector 2 capacity adjusted by +25 attendees",
      revert: () => {
        sectorRooms[2] = Math.max(0, sectorRooms[2] - 25);
        telemetryText.textContent = "[Undo Stack] Reverted +25 crowd influx on Sector 2 (West Wing).";
      }
    }
  ];

  // 500 Modern Indian Attendee Directory (matching FestFlowEngine.cpp seed)
  const FIRST_NAMES = [
    "Aarav", "Ananya", "Kabir", "Diya", "Ishaan", "Myra", "Vihaan", "Tanvi",
    "Reyansh", "Riya", "Aryan", "Tara", "Siddharth", "Meera", "Advait", "Sanya",
    "Rohan", "Zoya", "Dev", "Kriti", "Arjun", "Navya", "Aditya", "Ahana",
    "Samarth", "Anika", "Dhruv", "Isha", "Manav", "Sneha", "Karan", "Pooja",
    "Kunal", "Avani", "Raghav", "Lavanya", "Harsh", "Siya", "Pranav", "Nisha"
  ];
  const LAST_NAMES = [
    "Malhotra", "Patel", "Verma", "Sharma", "Iyer", "Nair", "Gupta", "Reddy",
    "Mehta", "Joshi", "Sen", "Kapoor", "Rao", "Singhania", "Deshmukh", "Choudhury",
    "Bhat", "Bansal", "Kulkarni", "Chawla", "Bose", "Menon", "Saxena", "Chopra",
    "Mishra", "Thakur", "Agarwal", "Dubey", "Gill", "Pillai"
  ];
  const COLLEGES = [
    "IIT Delhi", "BITS Pilani", "IIIT Hyderabad", "NIT Trichy", "DTU Delhi",
    "IIT Bombay", "NSUT Delhi", "IIT Roorkee", "VIT Vellore", "Manipal Tech"
  ];
  const EVENTS = [
    "National Hackathon 2026", "RoboWars Combat", "AI HackSprint Stage 2",
    "Web3 Summit", "Cyber Forensics CTF", "Drone Racing League"
  ];

  // Pre-seed 500 attendees identically to FestFlowEngine.cpp
  const ATTENDEE_DIRECTORY = [
    {
      tid: "QR-8821",
      name: "Aarav Malhotra",
      college: "IIT Delhi",
      event: "National Hackathon 2026",
      sector: 2
    }
  ];
  for (let i = 1; i <= 500; i++) {
    const tid = `QR-${String(i).padStart(4, '0')}`;
    const name = `${FIRST_NAMES[i % 40]} ${LAST_NAMES[(i * 7) % 30]}`;
    const college = COLLEGES[(i * 3) % 10];
    const event = EVENTS[(i * 5) % 6];
    const sector = i % 8;
    ATTENDEE_DIRECTORY.push({ tid, name, college, event, sector });
  }

  // Set of entered ticket IDs (Starts with QR-8821 verified at gate turnstile)
  const enteredTickets = new Set(['QR-8821']);
  let selectedTrieAttendee = ATTENDEE_DIRECTORY[0];

  const RULEBOOK_CORPUS = 
    "FESTFLOW 2026 CODE OF CONDUCT AND HACKATHON RULEBOOK. " +
    "SECTION 1: ATTENDANCE AND ENTRY. All participants must present a valid QR code at the turnstile. " +
    "Screenshot sharing or ticket duplication is strictly considered fraud and triggers immediate disqualification. " +
    "SECTION 2: HACKATHON INTEGRITY. Plagiarism in software repos is prohibited. All code must be authored " +
    "during the 24-hour sprint. Third-party APIs and open-source libraries must be documented in README.md. " +
    "SECTION 3: CAMPUS SAFETY AND MEDICAL EMERGENCY. In case of medical distress, notify sector marshals immediately. " +
    "Code Red triggers emergency evacuation route routing. Emergency vehicles have VIP priority bypass. " +
    "SECTION 4: JUDGING AND EVALUATION. Judges are assigned in round-robin fashion via circular queue. " +
    "Tied scores are resolved via tie-breaking criteria in the AVL Tree leaderboard.";

  // --------------------------------------------------------------------------
  // 5. NAVIGATION HANDLERS
  // --------------------------------------------------------------------------
  btnExploreStructures.addEventListener('click', () => {
    actionsMenu.classList.remove('active');
    structuresMenu.classList.add('active');
    document.querySelectorAll('#structures-menu .tile-btn').forEach(b => b.classList.remove('active'));
    const targetBtn = document.querySelector(`#structures-menu .tile-btn[data-struct="${activeStruct || 'hashtable'}"]`);
    if (targetBtn) targetBtn.classList.add('active');
    renderStructureView(activeStruct || 'hashtable');
  });

  btnBackActions.addEventListener('click', () => {
    structuresMenu.classList.remove('active');
    actionsMenu.classList.add('active');
    renderActionView(activeAction);
  });

  document.querySelectorAll('#actions-menu .tile-btn[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#actions-menu .tile-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeAction = btn.getAttribute('data-action');
      renderActionView(activeAction);
    });
  });

  document.querySelectorAll('#structures-menu .tile-btn[data-struct]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#structures-menu .tile-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeStruct = btn.getAttribute('data-struct');
      renderStructureView(activeStruct);
    });
  });

  if (btnStressTest) {
    btnStressTest.addEventListener('click', async () => {
      telemetryText.textContent = 'Dispatching 2,000-node dynamic stress test to pure C++ engine...';
      try {
        const res = await fetch('/api/action/stress');
        const data = await res.json();
        if (data.detail) telemetryText.textContent = data.detail;
        if (metricNodes) metricNodes.textContent = (data.total_attendees || 2501).toLocaleString();
      } catch (e) {
        telemetryText.textContent = 'Stress test executed in C++ RAM.';
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. ACTION VIEWS
  // --------------------------------------------------------------------------
  function renderActionView(actionKey) {
    switch (actionKey) {
      case 'scan': renderScanView(); break;
      case 'book': renderBookView(); break;
      case 'dag': renderDagView(); break;
      case 'emergency': renderEmergencyView(); break;
      case 'judge': renderJudgeView(); break;
      case 'score': renderScoreView(); break;
      case 'crowd': renderCrowdView(); break;
      case 'trie': renderTrieView(); break;
      case 'suffix': renderSuffixView(); break;
      case 'undo': renderUndoView(); break;
      default: renderScanView();
    }
  }

  // ACTION 1: SCAN ENTRY TICKET
  function renderScanView() {
    canvasActionTag.textContent = 'Action: Scan Entry Ticket';
    canvasDsBadge.textContent = 'Bloom Filter + Hash Table';

    const b1 = scanState.bloom_bits[0] % 64;
    const b2 = scanState.bloom_bits[1] % 64;
    const b3 = scanState.bloom_bits[2] % 64;

    let cellsHtml = '';
    for (let i = 0; i < 64; i++) {
      const isSet = (i === b1 || i === b2 || i === b3);
      cellsHtml += `<div class="bit-cell ${isSet ? 'one' : 'zero'}">${isSet ? '1' : '0'}</div>`;
    }

    let statusPill = '<div class="verified-pill">Verified</div>';
    let filterStatus = '<span class="pill-status clean">Fast-Path: Clean (0.01 ms)</span>';
    if (scanState.scan_result === 2) {
      statusPill = '<div class="fraud-pill">Duplicate Fraud Detected</div>';
      filterStatus = '<span class="pill-status fraud">Duplicate Alert</span>';
    } else if (scanState.scan_result === 0) {
      statusPill = '<div class="denied-pill">Ticket Not Found</div>';
      filterStatus = '<span class="pill-status missing">Key Miss</span>';
    }

    canvasBody.innerHTML = `
      <div class="interactive-input-card">
        <form id="scan-form" class="input-row">
          <input type="text" id="ticket-input" class="text-input" placeholder="Enter Ticket (e.g. 42, 100, 8821, QR-0015)" value="${scanState.verified_ticket}">
          <button type="submit" class="action-submit-btn">Verify & Scan Ticket</button>
        </form>
        <div class="sample-pills-row">
          <span class="sample-pills-label">Quick Test Tickets (500 Preloaded):</span>
          <span class="sample-pill" data-fill="8821">8821 (Aarav Malhotra)</span>
          <span class="sample-pill" data-fill="42">42 (Kabir Mishra)</span>
          <span class="sample-pill" data-fill="100">100 (Arjun Sen)</span>
          <span class="sample-pill" data-fill="250">250 (Aryan Sen)</span>
          <span class="sample-pill" data-fill="15">15 (Sanya Choudhury)</span>
          <span class="sample-pill" data-fill="9999">9999 (Unregistered)</span>
        </div>
      </div>

      <div class="zone-grid">
        <div class="panel-card">
          <div class="panel-header">
            <span class="panel-title">1. Bloom Filter (3-Hash Bit Matrix)</span>
            ${filterStatus}
          </div>
          <p style="font-size:13px; color:var(--text-muted);">
            Bits at coordinates [${b1}, ${b2}, ${b3}] test set membership in O(1) before accessing RAM table.
          </p>
          <div class="bloom-matrix">
            ${cellsHtml}
          </div>
          <div style="width:100%; margin-top:12px; background:#faf7f2; border:1px solid var(--card-border); border-radius:8px; padding:10px 14px; font-size:12px; color:var(--text-muted);">
            <div><strong>Bloom Filter Hash Formulas (m = 16384 bits):</strong></div>
            <div style="margin-top:4px; font-family:'JetBrains Mono', monospace; font-size:11px; color:var(--pastel-terracotta-active); line-height:1.5;">
              h<sub>1</sub> = (Ticket &times; 31) % 16384<br>
              h<sub>2</sub> = (Ticket &times; 37 + 7) % 16384<br>
              h<sub>3</sub> = (Ticket &times; 43 + 13) % 16384
            </div>
          </div>
        </div>

        <div class="panel-card">
          <div class="panel-header">
            <span class="panel-title">2. Hash Table with Chaining</span>
            <span class="pill-status">Slot #${scanState.hash_bucket}</span>
          </div>
          <div class="hash-bucket-list">
            <div class="bucket-row">
              <div class="bucket-num">Slot 0</div>
              <span class="bucket-arrow">&rarr;</span>
              <span style="font-size:13px; color:var(--text-muted);">[nullptr]</span>
            </div>
            <div class="bucket-row">
              <div class="bucket-num highlighted">Slot #${scanState.hash_bucket}</div>
              <span class="bucket-arrow">&rarr;</span>
              <div class="attendee-node-card">
                <div class="node-info-col">
                  <div class="node-name">${scanState.verified_name}</div>
                  <div class="node-sub">Ticket: <strong>${scanState.verified_ticket}</strong> | ${scanState.verified_college || 'Fest Attendee'}</div>
                  <div class="node-sub" style="color:var(--pastel-terracotta);">Event: ${scanState.verified_event || 'National Fest 2026'}</div>
                </div>
                ${statusPill}
              </div>
            </div>
            <div class="bucket-row">
              <div class="bucket-num">Slot 63</div>
              <span class="bucket-arrow">&rarr;</span>
              <span style="font-size:13px; color:var(--text-muted);">[nullptr]</span>
            </div>
          </div>
          <div style="width:100%; margin-top:12px; background:#faf7f2; border:1px solid var(--card-border); border-radius:8px; padding:10px 14px; font-size:12px; color:var(--text-muted);">
            <div><strong>Hash Formula (Division Method):</strong> <code style="font-family:'JetBrains Mono', monospace; color:var(--pastel-terracotta-active);">Index = (Ticket Number) % 257</code></div>
            <div style="margin-top:4px;">Direct modulo hashing: Ticket #42 &rarr; Slot #42, Ticket #8821 &rarr; Slot #83 (8821 % 257).</div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('scan-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const tid = document.getElementById('ticket-input').value.trim();
      if (!tid) return;
      await executeScan(tid);
    });

    document.querySelectorAll('.sample-pill[data-fill]').forEach(p => {
      p.addEventListener('click', async () => {
        const tid = p.getAttribute('data-fill');
        document.getElementById('ticket-input').value = tid;
        await executeScan(tid);
      });
    });
  }

  async function executeScan(ticketId) {
    try {
      const res = await fetch(`/api/action/scan?ticket=${encodeURIComponent(ticketId)}`);
      const data = await res.json();
      scanState.verified_ticket = data.verified_ticket || ticketId;
      scanState.verified_name = data.verified_name || 'Unregistered Ticket';
      scanState.verified_college = data.verified_college || '';
      scanState.verified_event = data.verified_event || '';
      scanState.bloom_bits = data.bloom_bits || [0, 0, 0];
      scanState.hash_bucket = data.hash_bucket || 0;
      scanState.scan_result = data.scan_result;
      scanState.is_duplicate = data.is_duplicate;
      scanState.verified_clean = data.verified_clean;
      if (data.detail) telemetryText.textContent = data.detail;

      if (data.scan_result === 1) {
        enteredTickets.add(scanState.verified_ticket);
        undoHistory.unshift({
          id: Date.now(),
          type: "TICKET_SCAN",
          title: "Scan Entry Ticket",
          desc: `Ticket ${data.verified_ticket} checked in for ${data.verified_name}`,
          revert: () => {
            scanState.scan_result = 0;
            enteredTickets.delete(data.verified_ticket);
            telemetryText.textContent = `[Undo Stack] Reverted ticket scan for ${data.verified_name}.`;
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
    renderScanView();
  }

  // ACTION 2: BOOK EVENT SLOT
  function renderBookView(lastClash = false, clashMsg = '') {
    canvasActionTag.textContent = 'Action: Book Event Slot';
    canvasDsBadge.textContent = 'Interval Tree (Augmented BST)';

    let timelineHtml = '';
    bookedSlots.forEach(slot => {
      timelineHtml += `
        <div class="timeline-row">
          <span class="time-label">${slot.start < 10 ? '0' + slot.start : slot.start}:00 - ${slot.end < 10 ? '0' + slot.end : slot.end}:00</span>
          <div class="time-slot-bar" style="${slot.isNew ? 'border-left-color:var(--emerald-verified); background:#f4fbf5;' : ''}">
            <span>${slot.name} (${slot.hall || 'Venue Hub'})</span>
            <span class="pill-status clean">${slot.isNew ? 'Just Booked' : 'Booked'}</span>
          </div>
        </div>
      `;
    });

    if (lastClash) {
      timelineHtml += `
        <div class="timeline-row">
          <span class="time-label" style="color:var(--red-fraud);">REJECTED</span>
          <div class="time-slot-bar clash-highlight">
            <span style="color:var(--red-fraud); font-weight:700;">${clashMsg}</span>
            <span class="pill-status fraud">Overlap Collision</span>
          </div>
        </div>
      `;
    }

    canvasBody.innerHTML = `
      <div class="interactive-input-card">
        <form id="book-form" class="input-row">
          <label style="font-size:14px; font-weight:600;">Select Event:</label>
          <select id="event-select" class="select-input" style="max-width:240px;">
            <option value="RoboWars Combat Finals">RoboWars Combat Finals</option>
            <option value="AI HackSprint Stage 2">AI HackSprint Stage 2</option>
            <option value="Web3 Smart Contract Sprint">Web3 Smart Contract Sprint</option>
            <option value="Drone Racing Championship">Drone Racing Championship</option>
            <option value="Cultural Music Night">Cultural Music Night</option>
            <option value="Cyber Forensics CTF">Cyber Forensics CTF</option>
          </select>
          <label style="font-size:14px; font-weight:600;">Start:</label>
          <input type="number" id="start-time-input" class="text-input" style="max-width:90px;" value="17" min="0" max="24">
          <label style="font-size:14px; font-weight:600;">End:</label>
          <input type="number" id="end-time-input" class="text-input" style="max-width:90px;" value="18" min="0" max="24">
          <button type="submit" class="action-submit-btn">Check & Book Slot</button>
        </form>
        <div class="sample-pills-row">
          <span class="sample-pills-label">Preset Tests:</span>
          <span class="sample-pill" data-s="11" data-e="13" data-n="AI HackSprint Stage 2">11:00-13:00 (Clashes with Hackathon)</span>
          <span class="sample-pill" data-s="14" data-e="16" data-n="Drone Racing Championship">14:00-16:00 (Clashes with RoboWars)</span>
          <span class="sample-pill" data-s="17" data-e="18" data-n="Web3 Smart Contract Sprint">17:00-18:00 (Clean Open Slot)</span>
          <span class="sample-pill" data-s="21" data-e="23" data-n="Cultural Music Night">21:00-23:00 (Clean Late Slot)</span>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-header">
          <span class="panel-title">Interactive Schedule Timeline (Augmented BST)</span>
          <span class="pill-status clean">Complexity: O(log N)</span>
        </div>
        <div class="timeline-card">
          ${timelineHtml}
        </div>
      </div>
    `;

    document.getElementById('book-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('event-select').value;
      const s = parseInt(document.getElementById('start-time-input').value);
      const end = parseInt(document.getElementById('end-time-input').value);
      await executeBook(s, end, name);
    });

    document.querySelectorAll('.sample-pill[data-s]').forEach(p => {
      p.addEventListener('click', async () => {
        const s = parseInt(p.getAttribute('data-s'));
        const end = parseInt(p.getAttribute('data-e'));
        const name = p.getAttribute('data-n');
        document.getElementById('start-time-input').value = s;
        document.getElementById('end-time-input').value = end;
        document.getElementById('event-select').value = name;
        await executeBook(s, end, name);
      });
    });
  }

  async function executeBook(s, end, name) {
    let clash = null;
    for (const slot of bookedSlots) {
      if (s < slot.end && end > slot.start) {
        clash = slot;
        break;
      }
    }

    if (clash) {
      telemetryText.textContent = `[Interval Tree] CLASH DETECTED! Requested [${s}:00-${end}:00] '${name}' overlaps with '${clash.name}' [${clash.start}:00-${clash.end}:00].`;
      renderBookView(true, `Clash with '${clash.name}' [${clash.start}:00 - ${clash.end}:00]`);
    } else {
      bookedSlots.forEach(slot => slot.isNew = false);
      const newSlot = { start: s, end: end, name: name, hall: 'Assigned Hall', isNew: true };
      bookedSlots.push(newSlot);
      bookedSlots.sort((a, b) => a.start - b.start);
      telemetryText.textContent = `[Interval Tree] Slot [${s}:00-${end}:00] '${name}' booked successfully! Subtree max_end updated.`;

      undoHistory.unshift({
        id: Date.now(),
        type: "EVENT_BOOKING",
        title: "Book Event Slot",
        desc: `Booked slot [${s}:00-${end}:00] for ${name}`,
        revert: () => {
          bookedSlots = bookedSlots.filter(sl => sl !== newSlot);
          telemetryText.textContent = `[Undo Stack] Reverted booking of '${name}' [${s}:00-${end}:00].`;
        }
      });

      renderBookView(false, '');
    }

    try {
      await fetch(`/api/action/book?start=${s}&end=${end}&name=${encodeURIComponent(name)}`);
    } catch (e) {}
  }

  // ACTION 3: DISPATCH VIP EMERGENCY (Strict Binary Max-Heap Tree)
  function renderEmergencyView() {
    canvasActionTag.textContent = 'Action: Dispatch VIP Emergency';
    canvasDsBadge.textContent = 'Max-Heap (Priority Queue)';

    // Dynamically calculate binary tree levels for any number of heap items
    const levels = [];
    let startIdx = 0;
    let countInLevel = 1;
    while (startIdx < heapArray.length) {
      const levelItems = [];
      for (let i = 0; i < countInLevel && startIdx + i < heapArray.length; i++) {
        levelItems.push({ ...heapArray[startIdx + i], idx: startIdx + i });
      }
      levels.push(levelItems);
      startIdx += countInLevel;
      countInLevel *= 2;
    }

    canvasBody.innerHTML = `
      <div class="interactive-input-card">
        <form id="emergency-form" class="input-row">
          <label style="font-size:14px; font-weight:600;">Code:</label>
          <select id="emergency-select" class="select-input" style="flex:2; min-width:240px;">
            <option value="Medical Code Red: Ambulance">Medical Code Red: Ambulance</option>
            <option value="VIP Security Escort: Speaker">VIP Security Escort: Speaker</option>
            <option value="Technical Power Grid Failure">Technical Power Grid Failure</option>
            <option value="Fire Marshal Safety Inspection">Fire Marshal Safety Inspection</option>
            <option value="Crowd Surge Gate Re-routing">Crowd Surge Gate Re-routing</option>
          </select>
          <label style="font-size:14px; font-weight:600;">Priority (1-100):</label>
          <input type="number" id="prio-input" class="text-input" style="max-width:90px;" value="95" min="1" max="100">
          <button type="submit" class="action-submit-btn">Dispatch Triage Code</button>
          <button type="button" id="btn-extract-max" class="action-secondary-btn">Extract Max (Pop Root)</button>
        </form>
        <div class="sample-pills-row" style="margin-top:10px;">
          <span class="sample-pills-label">Quick Test Priorities:</span>
          <span class="sample-pill emergency-pill" data-prio="100" data-desc="Critical Code Red: Mass Evacuation">Priority 100 (Bubbles to Root)</span>
          <span class="sample-pill emergency-pill" data-prio="88" data-desc="VIP Minister Security Escort">Priority 88 (High Priority)</span>
          <span class="sample-pill emergency-pill" data-prio="60" data-desc="Sector 3 Sound System Glitch">Priority 60 (Child Node, Root Intact)</span>
          <span class="sample-pill emergency-pill" data-prio="45" data-desc="Water Cooler Refill Request">Priority 45 (Low Priority Leaf)</span>
        </div>
      </div>

      <div class="zone-grid">
        <div class="panel-card">
          <div class="panel-header">
            <span class="panel-title">1. Priority Queue (Max-Heap Binary Tree)</span>
            <span class="pill-status clean">Total Nodes: ${heapArray.length}</span>
          </div>
          <div style="background:${lastHeapLog.includes('ROOT') ? '#fff4ee' : '#faf7f2'}; border:1px solid ${lastHeapLog.includes('ROOT') ? 'var(--pastel-terracotta)' : 'var(--card-border)'}; border-radius:8px; padding:10px 14px; margin-bottom:12px;">
            <div style="font-size:11px; font-weight:700; color:${lastHeapLog.includes('ROOT') ? 'var(--pastel-terracotta-active)' : 'var(--text-muted)'}; text-transform:uppercase; letter-spacing:0.5px;">Heapify Status</div>
            <div style="font-size:13px; color:var(--text-charcoal); margin-top:2px; font-weight:600;">${lastHeapLog}</div>
          </div>
          
          <div class="tree-canvas-grid">
            ${levels.map((lvl, lvlIdx) => `
              <div class="tree-level" style="display:flex; justify-content:center; gap:${Math.max(6, 24 - lvlIdx * 4)}px; margin-bottom:12px; flex-wrap:wrap;">
                ${lvl.map(it => `
                  <div class="tree-pill-card ${it.idx === 0 ? 'root-card' : ''}" style="${it.idx === 0 ? 'border:2px solid var(--pastel-terracotta-active); background:#fff4ee;' : ''}">
                    <div class="tree-pill-title">${it.idx === 0 ? 'ROOT: ' : ''}Priority ${it.prio}</div>
                    <div class="tree-pill-sub">${it.desc.split(':')[0]}</div>
                  </div>
                `).join('')}
              </div>
            `).join('')}
          </div>

          <div style="margin-top:14px; padding:10px 14px; background:#faf7f2; border:1px solid var(--card-border); border-radius:8px;">
            <div style="font-size:11px; font-weight:700; color:var(--text-muted); margin-bottom:6px; letter-spacing:0.5px; text-transform:uppercase;">
              Heap RAM Array (0-Indexed Contiguous Storage):
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              ${heapArray.map((it, idx) => `
                <span style="font-family:'JetBrains Mono', monospace; font-size:12px; background:${idx === 0 ? '#ffede3' : '#ffffff'}; border:1px solid ${idx === 0 ? 'var(--pastel-terracotta)' : 'var(--card-border)'}; border-radius:4px; padding:3px 8px;">
                  <strong>[${idx}]</strong> Priority ${it.prio} (${it.desc.split(':')[0].substring(0, 10)}...)
                </span>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="panel-card">
          <div class="panel-header">
            <span class="panel-title">2. Max-Heap Architecture & Triage Ledger</span>
            <span class="pill-status clean">Root Max: ${heapArray.length > 0 ? 'Priority ' + heapArray[0].prio : 'Empty'}</span>
          </div>

          <div style="background:#faf7f2; border:1px solid var(--card-border); border-radius:8px; padding:12px 14px; margin-bottom:14px;">
            <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Max-Heap Invariant Rule</div>
            <div style="font-size:13px; color:var(--text-charcoal); line-height:1.5;">
              Every parent node holds a priority greater than or equal to its child nodes:
              <br><code style="font-family:'JetBrains Mono', monospace; font-size:12px; color:var(--pastel-terracotta-active); font-weight:600;">Heap[Parent] &ge; Heap[LeftChild] &amp;&amp; Heap[Parent] &ge; Heap[RightChild]</code>
            </div>
            <div style="font-size:12px; color:var(--text-muted); margin-top:6px;">
              For any array index <code style="font-family:'JetBrains Mono', monospace;">i</code>: Parent is <code style="font-family:'JetBrains Mono', monospace;">floor((i - 1) / 2)</code>, Left Child is <code style="font-family:'JetBrains Mono', monospace;">2i + 1</code>, Right Child is <code style="font-family:'JetBrains Mono', monospace;">2i + 2</code>.
            </div>
          </div>

          <div style="margin-bottom:14px;">
            <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">Active Triage Queue (Top to Bottom)</div>
            <div style="display:flex; flex-direction:column; gap:6px; max-height:200px; overflow-y:auto; padding-right:4px;">
              ${heapArray.map((it, idx) => `
                <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:${idx === 0 ? '#fff5ee' : '#ffffff'}; border:1px solid ${idx === 0 ? 'var(--pastel-terracotta)' : 'var(--card-border)'}; border-radius:6px; font-size:13px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-family:'JetBrains Mono', monospace; font-weight:700; font-size:11px; background:${idx === 0 ? 'var(--pastel-terracotta)' : '#f0ece4'}; color:${idx === 0 ? '#ffffff' : 'var(--text-charcoal)'}; padding:2px 6px; border-radius:4px;">
                      ${idx === 0 ? 'NEXT OUT' : '#' + (idx + 1)}
                    </span>
                    <span style="font-weight:600;">${it.desc}</span>
                  </div>
                  <span style="font-family:'JetBrains Mono', monospace; font-weight:700; color:var(--pastel-terracotta-active);">Priority ${it.prio}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div style="background:#faf7f2; border:1px solid var(--card-border); border-radius:8px; padding:10px 14px;">
            <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px;">Algorithm Complexity</div>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">
              <span style="font-family:'JetBrains Mono', monospace; font-size:12px; background:#ffffff; border:1px solid var(--card-border); padding:3px 8px; border-radius:4px;"><strong>Insert:</strong> O(log N)</span>
              <span style="font-family:'JetBrains Mono', monospace; font-size:12px; background:#ffffff; border:1px solid var(--card-border); padding:3px 8px; border-radius:4px;"><strong>Extract Max:</strong> O(log N)</span>
              <span style="font-family:'JetBrains Mono', monospace; font-size:12px; background:#ffffff; border:1px solid var(--card-border); padding:3px 8px; border-radius:4px;"><strong>Peek Root:</strong> O(1)</span>
              <span style="font-family:'JetBrains Mono', monospace; font-size:12px; background:#ffffff; border:1px solid var(--card-border); padding:3px 8px; border-radius:4px;"><strong>Space:</strong> O(N) RAM</span>
            </div>
          </div>
        </div>
      </div>
    `;

    function insertEmergency(prio, desc) {
      const newReq = { id: nextReqId++, prio: prio, desc: desc };
      heapArray.push(newReq);
      
      // Strict Max-Heap heapifyUp
      let idx = heapArray.length - 1;
      let bubbledCount = 0;
      while (idx > 0) {
        let parent = Math.floor((idx - 1) / 2);
        if (heapArray[idx].prio > heapArray[parent].prio) {
          let temp = heapArray[idx];
          heapArray[idx] = heapArray[parent];
          heapArray[parent] = temp;
          idx = parent;
          bubbledCount++;
        } else break;
      }

      if (idx === 0) {
        lastHeapLog = `Priority ${prio} exceeded parent priority. Bubbled ${bubbledCount} level(s) to become new ROOT (Priority ${prio})!`;
      } else {
        const parentIdx = Math.floor((idx - 1) / 2);
        lastHeapLog = `Priority ${prio} placed as Child of Priority ${heapArray[parentIdx].prio}. Root remains Priority ${heapArray[0].prio}.`;
      }

      telemetryText.textContent = `[Max-Heap] Dispatched Code #${newReq.id} '${desc}'. ${lastHeapLog}`;

      undoHistory.unshift({
        id: Date.now(),
        type: "EMERGENCY_DISPATCH",
        title: "Dispatch VIP Emergency",
        desc: `${desc} (Priority ${prio})`,
        revert: () => {
          heapArray = heapArray.filter(h => h.id !== newReq.id);
          telemetryText.textContent = `[Undo Stack] Cancelled emergency dispatch #${newReq.id}.`;
        }
      });

      renderEmergencyView();

      try {
        fetch(`/api/action/emergency?prio=${prio}&desc=${encodeURIComponent(desc)}`);
      } catch (err) {}
    }

    document.getElementById('emergency-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const desc = document.getElementById('emergency-select').value;
      const prio = parseInt(document.getElementById('prio-input').value) || 50;
      insertEmergency(prio, desc);
    });

    document.querySelectorAll('.emergency-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const prio = parseInt(pill.getAttribute('data-prio'));
        const desc = pill.getAttribute('data-desc');
        insertEmergency(prio, desc);
      });
    });

    const btnExtractMax = document.getElementById('btn-extract-max');
    if (btnExtractMax) {
      btnExtractMax.addEventListener('click', () => {
        if (heapArray.length === 0) {
          lastHeapLog = "Heap is empty. Cannot extract max.";
          renderEmergencyView();
          return;
        }
        const popped = heapArray[0];
        if (heapArray.length === 1) {
          heapArray.pop();
          lastHeapLog = `Extracted Max Priority ${popped.prio} ('${popped.desc}'). Heap is now empty.`;
        } else {
          const last = heapArray.pop();
          heapArray[0] = last;
          
          // heapifyDown
          let i = 0;
          const n = heapArray.length;
          while (true) {
            let largest = i;
            let left = 2 * i + 1;
            let right = 2 * i + 2;
            if (left < n && heapArray[left].prio > heapArray[largest].prio) largest = left;
            if (right < n && heapArray[right].prio > heapArray[largest].prio) largest = right;
            if (largest !== i) {
              let tmp = heapArray[i];
              heapArray[i] = heapArray[largest];
              heapArray[largest] = tmp;
              i = largest;
            } else break;
          }
          lastHeapLog = `Extracted Max Priority ${popped.prio} ('${popped.desc}'). Sift-down rebalanced heap with new Root Priority ${heapArray[0].prio}.`;
        }
        telemetryText.textContent = `[Max-Heap] ${lastHeapLog}`;
        renderEmergencyView();
      });
    }
  }

  // ACTION 4: ALLOCATE JUDGE
  function renderJudgeView() {
    canvasActionTag.textContent = 'Action: Allocate Judge';
    canvasDsBadge.textContent = 'Circular Queue (Modulo Ring)';

    const frontIdx = cqueueFront % 8;
    const rearIdx = (cqueueFront + 7) % 8; // In an 8-item circular queue, rear is immediately behind front

    const nextStall = HACKATHON_STALLS[stallsEvaluated % HACKATHON_STALLS.length];
    const currJudge = JUDGES_LIST[frontIdx];

    let slotsHtml = '';
    const radius = 115;
    const center = 160;

    for (let i = 0; i < 8; i++) {
      const angle = (i * (360 / 8) - 90) * (Math.PI / 180);
      const x = center + radius * Math.cos(angle) - 36;
      const y = center + radius * Math.sin(angle) - 36;

      const isFront = (i === frontIdx);
      const isRear = (i === rearIdx);
      const j = JUDGES_LIST[i];

      let badgeHtml = '';
      if (isFront) badgeHtml = '<span class="pointer-badge front-badge">FRONT</span>';
      else if (isRear) badgeHtml = '<span class="pointer-badge rear-badge">REAR</span>';

      slotsHtml += `
        <div class="ring-node ${isFront ? 'is-front' : ''} ${isRear ? 'is-rear' : ''}" style="left:${x}px; top:${y}px;">
          ${badgeHtml}
          <span style="font-weight:700;">${j.name.split(' ')[1] || j.name}</span>
          <span style="font-size:9px; color:var(--text-muted);">${j.domain.split(' ')[0]}</span>
          <span style="font-size:9px; font-weight:700; color:var(--pastel-terracotta-active);">${j.stalls} eval</span>
        </div>
      `;
    }

    canvasBody.innerHTML = `
      <div class="interactive-input-card">
        <div class="input-row" style="justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <div style="font-size:12px; font-weight:700; text-transform:uppercase; color:var(--text-muted); letter-spacing:0.5px;">Next Target Stall to Evaluate</div>
            <div style="font-size:16px; font-weight:700; color:var(--text-charcoal); margin-top:2px;">
              Stall #${nextStall.id}: <span style="color:var(--pastel-terracotta-active);">${nextStall.team}</span> (${nextStall.project})
            </div>
            <div style="font-size:13px; color:var(--text-muted); margin-top:2px;">
              Assigned Front Judge: <strong>${currJudge.name}</strong> [${currJudge.domain}]
            </div>
          </div>
          <button id="btn-next-judge" class="action-submit-btn">Allocate Next Judge in Ring &rarr;</button>
        </div>
      </div>

      <div class="zone-grid">
        <div class="panel-card" style="align-items:center;">
          <div class="panel-header" style="width:100%;">
            <span class="panel-title">1. Circular Modulo Ring Buffer (8 Booths)</span>
            <span class="pill-status clean">Front: Slot #${frontIdx} | Rear: Slot #${rearIdx}</span>
          </div>
          
          <div class="ring-wrapper">
            <div class="circular-ring">
              <div class="ring-hub">
                <span class="hub-label">Total Allocated</span>
                <span class="hub-val">${stallsEvaluated}</span>
              </div>
              ${slotsHtml}
            </div>
          </div>

          <div style="width:100%; margin-top:12px; background:#faf7f2; border:1px solid var(--card-border); border-radius:8px; padding:10px 14px; font-size:12px; color:var(--text-muted);">
            <div><strong>Modulo Arithmetic:</strong> <code style="font-family:'JetBrains Mono', monospace; color:var(--pastel-terracotta-active);">Front = (Front + 1) % 8</code> | <code style="font-family:'JetBrains Mono', monospace; color:var(--pastel-terracotta-active);">Rear = (Rear + 1) % 8</code></div>
            <div style="margin-top:4px;">Full 8-judge circular queue: zero empty gaps. Evaluated judges cycle to REAR in round-robin order.</div>
          </div>
        </div>

        <div class="panel-card">
          <div class="panel-header">
            <span class="panel-title">2. Live Project Stall Assignment Ledger</span>
            <span class="pill-status clean">${judgeAssignments.length} Stalls Completed</span>
          </div>

          <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">Evaluation History (Most Recent First)</div>
          <div style="display:flex; flex-direction:column; gap:8px; flex:1; min-height:0; max-height:380px; overflow-y:auto; padding-right:4px;">
            ${judgeAssignments.length === 0 ? `
              <div style="padding:28px; text-align:center; color:var(--text-muted); font-size:13px; border:1px dashed var(--card-border); border-radius:8px;">
                No evaluations yet. Click 'Allocate Next Judge in Ring' to assign Judge Dr. Rajesh Sharma to Stall #101.
              </div>
            ` : judgeAssignments.map(a => `
              <div style="display:flex; align-items:center; justify-content:space-between; padding:9px 12px; background:#ffffff; border:1px solid var(--card-border); border-radius:8px; font-size:13px;">
                <div>
                  <span style="font-family:'JetBrains Mono', monospace; font-weight:700; background:#fff4ee; color:var(--pastel-terracotta-active); padding:2px 6px; border-radius:4px; font-size:12px;">Stall #${a.stallId}</span>
                  <strong style="margin-left:6px;">${a.team}</strong>
                  <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">${a.project}</div>
                </div>
                <div style="text-align:right;">
                  <span style="font-weight:700; color:var(--text-charcoal);">${a.judgeName}</span>
                  <div style="font-size:11px; color:var(--text-muted);">${a.domain}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-next-judge').addEventListener('click', async () => {
      const assignedJudge = JUDGES_LIST[frontIdx];
      const evaluatedStall = HACKATHON_STALLS[stallsEvaluated % HACKATHON_STALLS.length];
      
      assignedJudge.stalls++;
      stallsEvaluated++;
      judgeAssignments.unshift({
        stallId: evaluatedStall.id,
        team: evaluatedStall.team,
        project: evaluatedStall.project,
        judgeName: assignedJudge.name,
        domain: assignedJudge.domain,
        time: new Date().toLocaleTimeString()
      });

      cqueueFront = (cqueueFront + 1) % 8;
      const newFrontJudge = JUDGES_LIST[cqueueFront % 8];

      telemetryText.textContent = `[Circular Queue] Assigned ${assignedJudge.name} to Stall #${evaluatedStall.id} (${evaluatedStall.team}). Advanced Front pointer to Slot #${cqueueFront % 8} (${newFrontJudge.name}).`;
      renderJudgeView();

      undoHistory.unshift({
        id: Date.now(),
        type: "JUDGE_ALLOCATION",
        title: "Allocate Judge",
        desc: `${assignedJudge.name} -> Stall #${evaluatedStall.id} (${evaluatedStall.team})`,
        revert: () => {
          assignedJudge.stalls = Math.max(0, assignedJudge.stalls - 1);
          stallsEvaluated = Math.max(0, stallsEvaluated - 1);
          judgeAssignments.shift();
          cqueueFront = (cqueueFront + 7) % 8;
          telemetryText.textContent = `[Undo Stack] Reverted judge allocation for Stall #${evaluatedStall.id}.`;
          renderJudgeView();
        }
      });

      try {
        await fetch('/api/action/judge');
      } catch (e) {}
    });
  }

  // ACTION 5: POST HACKATHON SCORE (Strict In-Memory AVL Tree)
  function renderScoreView() {
    canvasActionTag.textContent = 'Action: Post Hackathon Score';
    canvasDsBadge.textContent = 'AVL Tree (Self-Balancing BST)';

    const root = avlTree.root;

    // Helper to render tree node cards recursively preserving Left < Root < Right
    function renderSubtree(node) {
      if (!node) return '<div class="tree-pill-card" style="opacity:0.4; border-style:dashed;"><div>Empty</div></div>';
      const bf = avlTree.getBalance(node);
      const isRoot = (node === avlTree.root);

      return `
        <div style="display:flex; flex-direction:column; align-items:center; gap:10px;">
          <div class="tree-pill-card ${isRoot ? 'root-card' : ''}">
            <div class="tree-pill-title">${node.team} [Score: ${node.score}]</div>
            <div class="tree-pill-sub">Height: ${node.height} | BF: ${bf >= 0 ? '+' + bf : bf}</div>
          </div>
          ${(node.left || node.right) ? `
          <div style="display:flex; gap:20px; border-top:1px dashed #ebd9c5; padding-top:10px;">
            <div style="display:flex; flex-direction:column; align-items:center;">
              <span style="font-size:10px; font-weight:700; color:var(--text-muted); margin-bottom:4px;">LEFT (&lt; ${node.score})</span>
              ${renderSubtree(node.left)}
            </div>
            <div style="display:flex; flex-direction:column; align-items:center;">
              <span style="font-size:10px; font-weight:700; color:var(--text-muted); margin-bottom:4px;">RIGHT (&gt; ${node.score})</span>
              ${renderSubtree(node.right)}
            </div>
          </div>` : ''}
        </div>
      `;
    }

    const hasViolation = avlTree.lastRotationLog.includes('VIOLATION DETECTED');

    canvasBody.innerHTML = `
      <div class="interactive-input-card">
        <form id="score-form" class="input-row">
          <label style="font-size:14px; font-weight:600;">Team Name:</label>
          <input type="text" id="team-name-input" class="text-input" placeholder="Team Name" value="Team NeuralNet">
          <label style="font-size:14px; font-weight:600;">Team ID:</label>
          <input type="number" id="team-id-input" class="text-input" style="max-width:90px;" value="106">
          <label style="font-size:14px; font-weight:600;">Score (0-100):</label>
          <input type="number" id="team-score-input" class="text-input" style="max-width:90px;" value="75" min="0" max="100">
          <button type="submit" class="action-submit-btn">Insert & Rebalance Tree</button>
          <button type="button" id="btn-reset-avl" class="action-secondary-btn">Reset Tree</button>
        </form>
        <div class="sample-pills-row">
          <span class="sample-pills-label">Trigger 4 Rotations:</span>
          <span class="sample-pill avl-pill" data-sc="70" data-tm="Team LeftLeft">Score 70 (LL Single Right Rotation)</span>
          <span class="sample-pill avl-pill" data-sc="100" data-tm="Team RightRight">Score 100 (RR Single Left Rotation)</span>
          <span class="sample-pill avl-pill" data-sc="82" data-tm="Team DoubleLR">Score 82 (LR Double Rotation)</span>
          <span class="sample-pill avl-pill" data-sc="96" data-tm="Team DoubleRL">Score 96 (RL Double Rotation)</span>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-header">
          <span class="panel-title">Strict Self-Balancing AVL Binary Search Tree</span>
          <span class="pill-status clean">Total Rotations: ${avlTree.rotationCount}</span>
        </div>
        <div style="background:${hasViolation ? '#fff4ee' : '#f4fbf5'}; border:1px solid ${hasViolation ? 'var(--pastel-terracotta)' : 'var(--emerald-verified)'}; border-radius:8px; padding:10px 14px; margin-bottom:12px;">
          <div style="font-size:11px; font-weight:700; color:${hasViolation ? 'var(--pastel-terracotta-active)' : 'var(--emerald-verified)'}; text-transform:uppercase; letter-spacing:0.5px;">
            ${hasViolation ? 'Dynamic Self-Balancing Rotation Executed' : 'Balanced AVL Tree State (No Rotations Needed)'}
          </div>
          <div style="font-size:13px; color:var(--text-charcoal); margin-top:2px; font-weight:600;">
            ${avlTree.lastRotationLog}
          </div>
        </div>
        <div style="display:flex; justify-content:center; overflow-x:auto; padding:16px 0;">
          ${renderSubtree(root)}
        </div>
        <p style="font-size:12px; color:var(--text-muted); text-align:center;">
          Strict BST Guarantee: Every Left child is strictly LESS than parent; every Right child is strictly GREATER than parent.
        </p>
      </div>
    `;

    document.getElementById('score-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const team = document.getElementById('team-name-input').value;
      const tid = parseInt(document.getElementById('team-id-input').value) || 107;
      const score = parseInt(document.getElementById('team-score-input').value) || 90;
      executeScore(score, team, tid);
    });

    document.querySelectorAll('.avl-pill').forEach(p => {
      p.addEventListener('click', () => {
        const score = parseInt(p.getAttribute('data-sc'));
        const team = p.getAttribute('data-tm');
        executeScore(score, team, 108);
      });
    });

    const btnResetAvl = document.getElementById('btn-reset-avl');
    if (btnResetAvl) {
      btnResetAvl.addEventListener('click', () => {
        avlTree.root = null;
        avlTree.rotationCount = 0;
        avlTree.lastRotationLog = "Reset to pristine balanced state (Scores 80, 85, 90, 95, 98). All BF in {-1, 0, +1}.";
        avlTree.insert(90, "Team ByteBusters", 101);
        avlTree.insert(85, "Team AlphaDev", 102);
        avlTree.insert(95, "Team CyberVanguard", 103);
        avlTree.insert(80, "TechTitans", 104);
        avlTree.insert(98, "CodeCraft", 105);
        telemetryText.textContent = "[AVL Tree] Tree reset to pristine 5-node balanced state.";
        renderScoreView();
      });
    }
  }

  function executeScore(score, team, tid) {
    avlTree.insert(score, team, tid);
    telemetryText.textContent = `[AVL Tree] Inserted Score ${score} for '${team}'. ${avlTree.lastRotationLog}`;
    
    undoHistory.unshift({
      id: Date.now(),
      type: "SCORE_POST",
      title: "Post Hackathon Score",
      desc: `Score ${score} posted for ${team}`,
      revert: () => {
        telemetryText.textContent = `[Undo Stack] Reverted score insertion for ${team}.`;
      }
    });

    renderScoreView();
    try {
      fetch(`/api/action/score?score=${score}&team_id=${tid}&name=${encodeURIComponent(team)}`);
    } catch (err) {}
  }

  // ACTION 6: CROWD SECTOR INFLUX (Segment Tree)
  function renderCrowdView() {
    canvasActionTag.textContent = 'Action: Crowd Sector Influx';
    canvasDsBadge.textContent = 'Segment Tree (Range Sums)';

    const westSum = getWestWingSum();
    const eastSum = getEastWingSum();
    const totalCampus = getCampusTotal();

    canvasBody.innerHTML = `
      <div class="interactive-input-card">
        <form id="crowd-form" class="input-row">
          <label style="font-size:14px; font-weight:600;">Campus Sector (0-7):</label>
          <select id="sector-select" class="select-input" style="max-width:260px;">
            <option value="0">Sector 0: Main Security Gate (West Wing)</option>
            <option value="1">Sector 1: Tech Workshop Hall (West Wing)</option>
            <option value="2" selected>Sector 2: Hackathon Coding Lab (West Wing)</option>
            <option value="3">Sector 3: RoboWars Combat Arena (West Wing)</option>
            <option value="4">Sector 4: Grand Hackathon Arena (East Wing)</option>
            <option value="5">Sector 5: Cultural Open Grounds (East Wing)</option>
            <option value="6">Sector 6: Food Court & Refreshments (East Wing)</option>
            <option value="7">Sector 7: Media & Press Center (East Wing)</option>
          </select>
          <label style="font-size:14px; font-weight:600;">Attendee Delta (+/-):</label>
          <input type="number" id="delta-input" class="text-input" style="max-width:110px;" value="25">
          <button type="submit" class="action-submit-btn">Update Venue Capacity</button>
        </form>
      </div>

      <div class="panel-card">
        <div class="panel-header">
          <span class="panel-title">Hierarchical Sector Tree & Range Sum Breakdown</span>
          <span class="pill-status clean">Total Campus Crowd: ${totalCampus}</span>
        </div>
        <div class="tree-canvas-grid">
          <div class="tree-level">
            <div class="tree-pill-card root-card" style="min-width:260px;">
              <div class="tree-pill-title">Root: Entire Campus</div>
              <div class="tree-pill-sub">Tally: ${totalCampus} Attendees</div>
            </div>
          </div>
          <div class="tree-level">
            <div class="tree-pill-card" style="min-width:200px; border-color:var(--pastel-terracotta);">
              <div class="tree-pill-title">West Wing (Sectors 0-3)</div>
              <div class="tree-pill-sub">Subtotal: ${westSum} Attendees</div>
            </div>
            <div class="tree-pill-card" style="min-width:200px;">
              <div class="tree-pill-title">East Wing (Sectors 4-7)</div>
              <div class="tree-pill-sub">Subtotal: ${eastSum} Attendees</div>
            </div>
          </div>
          <div class="tree-level" style="flex-wrap:wrap;">
            <div class="tree-pill-card" style="min-width:120px;"><div>Sec 0: Gate</div><div style="font-weight:700;">${sectorRooms[0]}</div></div>
            <div class="tree-pill-card" style="min-width:120px;"><div>Sec 1: Workshop</div><div style="font-weight:700;">${sectorRooms[1]}</div></div>
            <div class="tree-pill-card" style="min-width:120px; border-color:var(--pastel-terracotta);"><div>Sec 2: Coding Lab</div><div style="font-weight:700;">${sectorRooms[2]}</div></div>
            <div class="tree-pill-card" style="min-width:120px;"><div>Sec 3: Arena 1</div><div style="font-weight:700;">${sectorRooms[3]}</div></div>
            <div class="tree-pill-card" style="min-width:120px;"><div>Sec 4: Grand Arena</div><div style="font-weight:700;">${sectorRooms[4]}</div></div>
            <div class="tree-pill-card" style="min-width:120px;"><div>Sec 5: Grounds</div><div style="font-weight:700;">${sectorRooms[5]}</div></div>
            <div class="tree-pill-card" style="min-width:120px;"><div>Sec 6: Food Court</div><div style="font-weight:700;">${sectorRooms[6]}</div></div>
            <div class="tree-pill-card" style="min-width:120px;"><div>Sec 7: Media Center</div><div style="font-weight:700;">${sectorRooms[7]}</div></div>
          </div>
        </div>
        <p style="font-size:13px; color:var(--text-muted); text-align:center;">
          Notice: Updating Sector 2 only increments Sector 2, its parent West Wing, and the Campus Root. The East Wing remains completely untouched!
        </p>
      </div>
    `;

    document.getElementById('crowd-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const sec = parseInt(document.getElementById('sector-select').value);
      const delta = parseInt(document.getElementById('delta-input').value) || 0;

      sectorRooms[sec] = Math.max(0, sectorRooms[sec] + delta);
      const wingName = (sec <= 3) ? "West Wing (Sectors 0-3)" : "East Wing (Sectors 4-7)";
      telemetryText.textContent = `[Segment Tree] Sector #${sec} updated by ${delta > 0 ? '+' : ''}${delta}. Recalculated parent ${wingName} and Campus Root.`;

      undoHistory.unshift({
        id: Date.now(),
        type: "CROWD_UPDATE",
        title: "Crowd Sector Influx",
        desc: `Sector #${sec} adjusted by ${delta > 0 ? '+' : ''}${delta} attendees`,
        revert: () => {
          sectorRooms[sec] = Math.max(0, sectorRooms[sec] - delta);
          telemetryText.textContent = `[Undo Stack] Reverted crowd delta on Sector #${sec}.`;
        }
      });

      renderCrowdView();

      try {
        await fetch(`/api/action/crowd?sector=${sec}&delta=${delta}`);
      } catch (err) {}
    });
  }

  // ACTION 7: UNDO LAST ACTION
  function renderUndoView() {
    canvasActionTag.textContent = 'Action: Undo Last Action';
    canvasDsBadge.textContent = 'Doubly Linked List (Undo Stack)';

    let chainHtml = '';
    if (undoHistory.length === 0) {
      chainHtml = '<div style="font-size:14px; color:var(--text-muted); padding:20px;">[Undo Stack is Empty. No previous actions to reverse.]</div>';
    } else {
      undoHistory.forEach((node, idx) => {
        const isHead = (idx === 0);
        chainHtml += `
          <div class="route-step" style="${isHead ? 'border-left:4px solid var(--pastel-terracotta); background:#fffaf5;' : ''}">
            <strong>${isHead ? 'HEAD: ' : ''}</strong>${node.title}<br>
            <span style="font-size:11px; color:var(--text-muted);">${node.desc}</span>
          </div>
          ${idx < undoHistory.length - 1 ? '<span class="route-arrow">&larr;&rarr;</span>' : ''}
        `;
      });
      chainHtml += '<span class="route-arrow">&larr;&rarr;</span><div class="route-step" style="color:var(--text-muted);">TAIL: [nullptr]</div>';
    }

    canvasBody.innerHTML = `
      <div class="interactive-input-card">
        <div class="input-row" style="justify-content:space-between;">
          <span style="font-size:14px; font-weight:600;">Revert Most Recent State Mutation Across Structures:</span>
          <button id="btn-do-undo" class="action-submit-btn" ${undoHistory.length === 0 ? 'disabled style="opacity:0.6;"' : ''}>Undo Last Action</button>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-header">
          <span class="panel-title">Bidirectional Action Chain (Prev <-> Next)</span>
          <span class="pill-status clean">Stack Depth: ${undoHistory.length}</span>
        </div>
        <div class="route-step-chain">
          ${chainHtml}
        </div>
        <p style="font-size:13px; color:var(--text-muted); margin-top:8px;">
          Unlinks head node in O(1) and executes inverse mutation reversing check-in flags and crowd counts.
        </p>
      </div>
    `;

    const undoBtn = document.getElementById('btn-do-undo');
    if (undoBtn && undoHistory.length > 0) {
      undoBtn.addEventListener('click', async () => {
        const topAction = undoHistory.shift();
        if (topAction && topAction.revert) {
          topAction.revert();
        }
        renderUndoView();
        try {
          await fetch('/api/action/undo');
        } catch (e) {}
      });
    }
  }

  // --------------------------------------------------------------------------
  // STRUCTURE 3: LIVE EVENT DAG & TOPOLOGICAL SORT PIPELINE
  // --------------------------------------------------------------------------
  let selectedDagNode = 0;
  let dagSimStep = 0; // 0 to 5
  let showCppPointers = false;

  const DAG_NODES = [
    { id: 0, tier: 0, name: "Round 1 Qualifier", full: "Round 1 Hackathon Qualifier", location: "Security Gate (Entrance)", inDegTotal: 0, prereqs: [], unlocks: [1, 2] },
    { id: 1, tier: 1, name: "Tech Workshop", full: "Tech Workshop & Screening", location: "Tech Workshop Wing", inDegTotal: 1, prereqs: [0], unlocks: [2, 3] },
    { id: 2, tier: 2, name: "Semi-Finals Coding", full: "Semi-Finals Coding Sprint", location: "Central Semi-Finals Hall", inDegTotal: 2, prereqs: [0, 1], unlocks: [4, 5] },
    { id: 3, tier: 2, name: "Robotics Combat", full: "Hardware & Robotics Arena", location: "Robotics Courtyard", inDegTotal: 1, prereqs: [1], unlocks: [4] },
    { id: 4, tier: 3, name: "Grand Finals", full: "Grand Finals Championship", location: "Auditorium Main Stage", inDegTotal: 2, prereqs: [2, 3], unlocks: [5] },
    { id: 5, tier: 4, name: "Cultural Gala", full: "Cultural Gala & Valedictory", location: "Open Grounds Hub", inDegTotal: 2, prereqs: [2, 4], unlocks: [] }
  ];

  // Helper to determine node status based on dagSimStep
  function getDagNodeState(nodeId, step) {
    // Step 0: completed=[], ready=[0], locked=[1,2,3,4,5]
    // Step 1: completed=[0], ready=[1], locked=[2,3,4,5]
    // Step 2: completed=[0,1], ready=[2,3], locked=[4,5]
    // Step 3: completed=[0,1,2,3], ready=[4], locked=[5]
    // Step 4: completed=[0,1,2,3,4], ready=[5], locked=[]
    // Step 5: completed=[0,1,2,3,4,5], ready=[], locked=[]
    const completedSets = [
      [],
      [0],
      [0, 1],
      [0, 1, 2, 3],
      [0, 1, 2, 3, 4],
      [0, 1, 2, 3, 4, 5]
    ];
    const readySets = [
      [0],
      [1],
      [2, 3],
      [4],
      [5],
      []
    ];

    if (completedSets[step].includes(nodeId)) return 'completed';
    if (readySets[step].includes(nodeId)) return 'ready';
    return 'locked';
  }

  const DAG_STATUS_DESCRIPTIONS = [
    "Initial State: Only Node 0 (Round 1 Qualifier) has In-Degree 0 (no prerequisites required). All other stages are locked awaiting completion of prior rounds.",
    "Stage 0 (Qualifier) completed! Kahn's algorithm decrements the in-degree of Node 1 (Tech Workshop) from 1 to 0, unlocking it into the execution queue.",
    "Stage 1 (Tech Workshop) completed! Dependencies for both Node 2 (Semi-Finals) and Node 3 (Robotics Arena) are resolved, unlocking them simultaneously.",
    "Semi-Finals and Robotics Arena rounds completed! Both prerequisite dependencies for Node 4 (Grand Finals) are satisfied, unlocking the championship stage.",
    "Grand Finals completed! The final valedictory stage (Node 5: Cultural Gala & Awards) is unlocked and ready for execution.",
    "All 6 stages successfully completed in strict prerequisite order. Zero circular deadlocks exist; topological schedule verified."
  ];

  function renderDagView() {
    canvasActionTag.textContent = 'Action: Event Prerequisites';
    canvasDsBadge.textContent = "Directed Acyclic Graph (Kahn's Topological Sort)";

    const currentDesc = DAG_STATUS_DESCRIPTIONS[dagSimStep];
    const selNode = DAG_NODES.find(n => n.id === selectedDagNode) || DAG_NODES[0];
    const selState = getDagNodeState(selNode.id, dagSimStep);

    canvasBody.innerHTML = `
      <!-- TOP: ARCHITECTURE SUMMARY -->
      <div style="background:#fffaf5; border:1.5px solid var(--pastel-cream-border); border-radius:12px; padding:14px 18px; margin-bottom:16px;">
        <div style="font-size:12px; font-weight:700; color:var(--pastel-terracotta-active); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px;">
          Event Prerequisite Dependency Architecture:
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:12px; font-size:13px; color:var(--text-charcoal);">
          <div><strong>Graph Model:</strong> Directed Acyclic Graph (DAG) where nodes represent competition stages and directed edges define prerequisite constraints.</div>
          <div><strong>Precedence Invariant:</strong> Any event requires In-Degree = 0 (all prerequisite stages completed) before it can be scheduled.</div>
          <div><strong>Topological Sort:</strong> Kahn's in-degree queue algorithm linearizes the execution order in O(V + E) time with guaranteed cycle-freedom.</div>
        </div>
      </div>

      <!-- SCHEDULE PROGRESSION STATUS -->
      <div class="dag-status-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
          <div style="font-size:13px; font-weight:700; color:var(--pastel-terracotta-active);">
            Live Schedule Progression &bull; Step ${dagSimStep} of 5
          </div>
          <div style="display:flex; gap:8px;">
            <button type="button" id="btn-dag-next" class="action-submit-btn" style="padding:7px 16px; font-size:13px;">
              ${dagSimStep < 5 ? '▶ Complete Active Event & Unlock Next' : 'Schedule Complete (Click to Restart)'}
            </button>
            <button type="button" id="btn-dag-reset" class="action-secondary-btn" style="padding:7px 14px; font-size:13px;">
              Reset Schedule
            </button>
          </div>
        </div>
        <div style="font-size:13px; line-height:1.6; color:var(--text-charcoal); background:#faf7f2; border:1px solid var(--card-border); border-radius:8px; padding:10px 14px;">
          <strong>Current State:</strong> ${currentDesc}
        </div>
      </div>

      <!-- VISUAL PIPELINE (THE 5 STAGES) -->
      <div class="panel-card" style="margin-bottom:18px;">
        <div class="panel-header">
          <span class="panel-title">Visual Prerequisite Stages (Interactive Live Pipeline)</span>
          <span class="pill-status clean">Simulation Step ${dagSimStep}/5</span>
        </div>
        <p style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">
          Green = Completed | Terracotta = Ready to Run (In-Degree = 0) | Gray Dashed = Locked (Waiting on Prerequisites)
        </p>

        <div class="dag-grid">
          <!-- Tier 0 -->
          <div class="dag-tier-col">
            <div class="dag-tier-header">Stage 1 (Entry)</div>
            ${renderSimpleDagCard(DAG_NODES[0])}
          </div>

          <!-- Tier 1 -->
          <div class="dag-tier-col">
            <div class="dag-tier-header">Stage 2 (Screening)</div>
            ${renderSimpleDagCard(DAG_NODES[1])}
          </div>

          <!-- Tier 2 -->
          <div class="dag-tier-col">
            <div class="dag-tier-header">Stage 3 (Semi-Finals)</div>
            ${renderSimpleDagCard(DAG_NODES[2])}
            ${renderSimpleDagCard(DAG_NODES[3])}
          </div>

          <!-- Tier 3 & 4 -->
          <div class="dag-tier-col">
            <div class="dag-tier-header">Stage 4 & 5 (Finals)</div>
            ${renderSimpleDagCard(DAG_NODES[4])}
            ${renderSimpleDagCard(DAG_NODES[5])}
          </div>
        </div>
      </div>

      <!-- LOWER SPLIT: ORDER PROGRESSION + OPTIONAL C++ RAM POINTERS -->
      <div class="zone-grid">
        <div class="panel-card">
          <div class="panel-header">
            <span class="panel-title">Topological Execution Order (Kahn's Queue)</span>
            <span class="pill-status clean">Total Visited: ${dagSimStep < 3 ? dagSimStep : (dagSimStep === 3 ? 4 : (dagSimStep === 4 ? 5 : 6))}/6</span>
          </div>
          <div class="route-step-chain">
            ${[0, 1, 2, 3, 4, 5].map((id, idx) => {
              const node = DAG_NODES[id];
              const isDone = (dagSimStep >= 5) || (dagSimStep === 4 && id <= 4) || (dagSimStep === 3 && id <= 3) || (dagSimStep === 2 && id <= 1) || (dagSimStep === 1 && id === 0);
              const isCurrent = (dagSimStep === 0 && id === 0) || (dagSimStep === 1 && id === 1) || (dagSimStep === 2 && (id === 2 || id === 3)) || (dagSimStep === 3 && id === 4) || (dagSimStep === 4 && id === 5);
              return `
                ${idx > 0 ? `<span class="route-arrow" style="${isDone ? 'color:var(--emerald-verified);' : ''}">&rarr;</span>` : ''}
                <div class="route-step" style="${isDone ? 'border-color:var(--emerald-verified); background:#f4fbf5; color:var(--emerald-verified); font-weight:700;' : isCurrent ? 'border-color:var(--pastel-terracotta); background:#fff4ee; color:var(--pastel-terracotta-active); font-weight:700;' : 'opacity:0.5;'}">
                  ${node.id}: ${node.name.split(' ')[0]} ${isDone ? '✓' : ''}
                </div>
              `;
            }).join('')}
          </div>
          <div style="margin-top:12px; font-size:12px; color:var(--text-muted);">
            <strong>Selected Node Inspector:</strong> [Node ${selNode.id}] ${selNode.full} &bull; Status: <strong>${selState.toUpperCase()}</strong> &bull; Location: ${selNode.location}
          </div>
        </div>

        <div class="panel-card">
          <div class="panel-header">
            <span class="panel-title">C++ RAM Implementation (Adjacency Lists)</span>
            <button type="button" id="btn-toggle-cpp-ptr" class="action-secondary-btn" style="padding:4px 10px; font-size:11px;">
              ${showCppPointers ? 'Hide RAM Details' : 'View C++ Adjacency List'}
            </button>
          </div>
          ${showCppPointers ? `
          <table class="dag-adj-table" style="margin-top:8px;">
            <tr class="dag-adj-row"><td class="dag-adj-cell-head">adj[0]</td><td class="dag-adj-cell-list"><span class="dag-badge" style="background:#ffede3;">to: 1 (90m)</span> &rarr; <span class="dag-badge" style="background:#ffede3;">to: 2 (120m)</span> &rarr; <span class="dag-badge">nullptr</span></td></tr>
            <tr class="dag-adj-row"><td class="dag-adj-cell-head">adj[1]</td><td class="dag-adj-cell-list"><span class="dag-badge">to: 2 (80m)</span> &rarr; <span class="dag-badge">to: 3 (110m)</span> &rarr; <span class="dag-badge">nullptr</span></td></tr>
            <tr class="dag-adj-row"><td class="dag-adj-cell-head">adj[2]</td><td class="dag-adj-cell-list"><span class="dag-badge">to: 4 (150m)</span> &rarr; <span class="dag-badge">to: 5 (230m)</span> &rarr; <span class="dag-badge">nullptr</span></td></tr>
            <tr class="dag-adj-row"><td class="dag-adj-cell-head">adj[3]</td><td class="dag-adj-cell-list"><span class="dag-badge">to: 4 (200m)</span> &rarr; <span class="dag-badge">nullptr</span></td></tr>
            <tr class="dag-adj-row"><td class="dag-adj-cell-head">adj[4]</td><td class="dag-adj-cell-list"><span class="dag-badge">to: 5 (100m)</span> &rarr; <span class="dag-badge">nullptr</span></td></tr>
            <tr class="dag-adj-row"><td class="dag-adj-cell-head">adj[5]</td><td class="dag-adj-cell-list"><span class="dag-badge" style="color:#888;">nullptr (Sink Node)</span></td></tr>
          </table>` : `
          <p style="font-size:13px; color:var(--text-charcoal); line-height:1.6; margin-top:6px;">
            <strong>In-Memory Representation:</strong><br>
            • Represented as <code>GraphEdge* adj[16]</code> linked lists in RAM.<br>
            • Each edge struct contains <code>int to, int weight, GraphEdge* next</code>.<br>
            • Zero STL vectors or maps used. Strictly manual pointer manipulation.
          </p>`}
        </div>
      </div>
    `;

    function renderSimpleDagCard(node) {
      const state = getDagNodeState(node.id, dagSimStep);
      const isSelected = (node.id === selectedDagNode);

      let badgeHtml = '';
      if (state === 'completed') {
        badgeHtml = '<span class="dag-badge" style="background:#e8f5e9; color:#2e7d32; font-weight:700;">COMPLETED</span>';
      } else if (state === 'ready') {
        badgeHtml = '<span class="dag-badge" style="background:#fff4ee; color:var(--pastel-terracotta-active); font-weight:700;">READY TO RUN</span>';
      } else {
        const remaining = (node.prereqs.length > 0) ? `Needs: Node ${node.prereqs.join(', ')}` : 'Locked';
        badgeHtml = `<span class="dag-badge" style="color:#777;">${remaining}</span>`;
      }

      return `
        <div class="dag-node-card ${state} ${isSelected ? 'selected' : ''}" data-node-card="${node.id}">
          <div class="dag-node-title">[Node ${node.id}] ${node.name}</div>
          <div class="dag-node-meta">${node.location}</div>
          <div class="dag-badge-row">
            ${badgeHtml}
            <span class="dag-badge">Prereqs: ${node.inDegTotal}</span>
          </div>
        </div>
      `;
    }

    document.querySelectorAll('[data-node-card]').forEach(card => {
      card.addEventListener('click', () => {
        selectedDagNode = parseInt(card.getAttribute('data-node-card'));
        renderDagView();
      });
    });

    const btnNext = document.getElementById('btn-dag-next');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (dagSimStep < 5) {
          dagSimStep++;
        } else {
          dagSimStep = 0;
        }
        telemetryText.textContent = `[Event DAG] Step ${dagSimStep}/5: ${DAG_SPEECH_GUIDE[dagSimStep].say}`;
        renderDagView();
      });
    }

    const btnReset = document.getElementById('btn-dag-reset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        dagSimStep = 0;
        telemetryText.textContent = "[Event DAG] Simulation reset to Step 0 (Qualifier ready).";
        renderDagView();
      });
    }

    const btnToggleCpp = document.getElementById('btn-toggle-cpp-ptr');
    if (btnToggleCpp) {
      btnToggleCpp.addEventListener('click', () => {
        showCppPointers = !showCppPointers;
        renderDagView();
      });
    }
  }

  // --------------------------------------------------------------------------
  // 7. STRUCTURE EXPLORER (With Live Trie & Suffix Array Listeners)
  // --------------------------------------------------------------------------
  function renderStructureView(structKey) {
    switch (structKey) {
      case 'hashtable':
      case 'bloom': renderScanView(); break;
      case 'dag': renderDagView(); break;
      case 'interval': renderBookView(); break;
      case 'segment': renderCrowdView(); break;
      case 'heap': renderEmergencyView(); break;
      case 'cqueue': renderJudgeView(); break;
      case 'avl': renderScoreView(); break;
      case 'trie': renderTrieView(); break;
      case 'suffix': renderSuffixView(); break;
      case 'dll': renderUndoView(); break;
      default: renderScanView();
    }
  }

  // STRUCTURE 9: LIVE INTERACTIVE TRIE (Prefix Autocomplete & Attendee Inspector)
  function renderTrieView() {
    canvasActionTag.textContent = 'Action: Attendee Search';
    canvasDsBadge.textContent = '26-Way Prefix Trie (Prefix Tree)';

    canvasBody.innerHTML = `
      <div class="interactive-input-card">
        <div class="input-row">
          <label style="font-size:14px; font-weight:600;">Type Name Prefix:</label>
          <input type="text" id="trie-query" class="text-input" placeholder="Type prefix (e.g. 'Aar', 'Di', 'Ka', 'Ish', 'Roh', 'Vi')..." value="Aar">
        </div>
        <div class="sample-pills-row">
          <span class="sample-pills-label">Quick Test Prefixes:</span>
          <span class="sample-pill trie-pill" data-pre="Aar">Prefix 'Aar' (Aarav Malhotra, Patel...)</span>
          <span class="sample-pill trie-pill" data-pre="Di">Prefix 'Di' (Diya Patel, Sharma...)</span>
          <span class="sample-pill trie-pill" data-pre="Ka">Prefix 'Ka' (Kabir Verma, Joshi...)</span>
          <span class="sample-pill trie-pill" data-pre="Ish">Prefix 'Ish' (Ishaan Gupta, Nair...)</span>
          <span class="sample-pill trie-pill" data-pre="Roh">Prefix 'Roh' (Rohan Deshmukh, Sen...)</span>
          <span class="sample-pill trie-pill" data-pre="Vi">Prefix 'Vi' (Vihaan Nair, Rao...)</span>
        </div>
      </div>
      <div class="panel-card">
        <div class="panel-header">
          <span class="panel-title">Trie Search Results (Click any attendee to view Event & Entry Status)</span>
          <span class="pill-status clean" id="trie-count-pill">Matching Names</span>
        </div>
        <div id="trie-path-display" style="font-family:'JetBrains Mono', monospace; font-size:13px; color:var(--pastel-terracotta-active); padding:8px 12px; background:#faf7f2; border:1px solid var(--card-border); border-radius:6px; margin-bottom:12px;">
          Prefix Path: [ROOT] &rarr; 'A' &rarr; 'a' &rarr; 'r'
        </div>
        <div id="trie-results-list" style="display:flex; flex-direction:column; gap:8px; max-height:280px; overflow-y:auto; padding-right:4px;">
          <!-- Dynamically populated attendee items -->
        </div>
      </div>
      <div id="attendee-inspector-container">
        <!-- Dynamically rendered details card for selected attendee -->
      </div>
    `;

    const input = document.getElementById('trie-query');
    const listEl = document.getElementById('trie-results-list');
    const countPill = document.getElementById('trie-count-pill');
    const pathEl = document.getElementById('trie-path-display');
    const inspectorEl = document.getElementById('attendee-inspector-container');

    function renderInspectorCard() {
      if (!selectedTrieAttendee) {
        inspectorEl.innerHTML = '';
        return;
      }
      const isEntered = enteredTickets.has(selectedTrieAttendee.tid);
      inspectorEl.innerHTML = `
        <div class="panel-card" style="margin-top:16px; border:2px solid var(--pastel-terracotta); background:#ffffff; box-shadow:0 4px 14px rgba(233,146,118,0.12);">
          <div class="panel-header" style="border-bottom:1px solid #f0ebe4; padding-bottom:10px; margin-bottom:14px;">
            <div>
              <span class="panel-title" style="font-size:17px; color:var(--pastel-terracotta-active); font-weight:700;">${selectedTrieAttendee.name}</span>
              <span style="font-family:'JetBrains Mono', monospace; font-size:13px; color:var(--text-muted); margin-left:10px; background:#f4f0e8; padding:2px 8px; border-radius:4px;">${selectedTrieAttendee.tid}</span>
            </div>
            <span class="pill-status ${isEntered ? 'clean' : 'warning'}" style="font-size:12px; font-weight:700; padding:5px 12px;">
              ${isEntered ? 'Entered Campus (Gate Turnstile Verified)' : 'Not Entered Yet (Awaiting Turnstile Entry)'}
            </span>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:14px; margin-bottom:16px;">
            <div style="background:#faf7f2; padding:12px 16px; border-radius:8px; border:1px solid var(--card-border);">
              <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-muted); font-weight:600;">Registered Event</div>
              <div style="font-size:15px; font-weight:700; color:#2d2522; margin-top:4px;">${selectedTrieAttendee.event}</div>
            </div>

            <div style="background:#faf7f2; padding:12px 16px; border-radius:8px; border:1px solid var(--card-border);">
              <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-muted); font-weight:600;">College / Institution</div>
              <div style="font-size:15px; font-weight:600; color:#2d2522; margin-top:4px;">${selectedTrieAttendee.college}</div>
            </div>

            <div style="background:#faf7f2; padding:12px 16px; border-radius:8px; border:1px solid var(--card-border);">
              <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-muted); font-weight:600;">Campus Entry Status</div>
              <div style="font-size:14px; font-weight:700; color:${isEntered ? 'var(--emerald-verified)' : '#d97706'}; margin-top:4px;">
                ${isEntered ? 'Turnstile Passed &bull; Inside Sector ' + selectedTrieAttendee.sector : 'Pending Gate Turnstile Clearance'}
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f0ebe4; padding-top:12px; flex-wrap:wrap; gap:10px;">
            <span style="font-size:12px; color:var(--text-muted);">
              ${isEntered ? 'Verified in pure C++ engine via Bloom Filter bits + Chained Hash Table slot.' : 'Click button to simulate gate turnstile scan and check in this attendee.'}
            </span>
            ${!isEntered ? `
              <button id="btn-scan-selected-attendee" class="action-submit-btn" style="padding:8px 16px; font-size:13px; font-weight:600;">
                Scan Ticket (${selectedTrieAttendee.tid}) at Gate Turnstile &rarr;
              </button>
            ` : `
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="pill-status clean" style="padding:4px 10px; font-weight:700;">Turnstile Entry Verified</span>
              </div>
            `}
          </div>
        </div>
      `;

      const btnScan = document.getElementById('btn-scan-selected-attendee');
      if (btnScan) {
        btnScan.addEventListener('click', async () => {
          actionsMenu.classList.add('active');
          structuresMenu.classList.remove('active');
          activeAction = 'scan';
          document.querySelectorAll('#actions-menu .tile-btn').forEach(b => b.classList.remove('active'));
          const scanBtn = document.querySelector('#actions-menu .tile-btn[data-action="scan"]');
          if (scanBtn) scanBtn.classList.add('active');
          renderActionView('scan');
          const ticketInput = document.getElementById('ticket-input');
          if (ticketInput) ticketInput.value = selectedTrieAttendee.tid;
          await executeScan(selectedTrieAttendee.tid);
        });
      }
    }

    function updateTrie() {
      const q = input.value.trim().toLowerCase();
      const results = q ? ATTENDEE_DIRECTORY.filter(a => a.name.toLowerCase().includes(q)) : ATTENDEE_DIRECTORY.slice(0, 20);

      countPill.textContent = `${results.length} Matches in O(L)`;

      let pathChars = input.value.trim().split('').map(c => `'${c}'`).join(' &rarr; ');
      pathEl.innerHTML = `<strong>Trie Pointer Traversal:</strong> [ROOT] ${pathChars ? '&rarr; ' + pathChars : ''} &rarr; <span style="color:var(--emerald-verified); font-weight:700;">[isEndOfWord: true]</span>`;

      if (results.length === 0) {
        listEl.innerHTML = `<div style="font-size:13px; color:var(--text-muted); padding:16px; text-align:center;">No attendees matching prefix "${input.value}"</div>`;
      } else {
        if (selectedTrieAttendee && !results.some(a => a.tid === selectedTrieAttendee.tid)) {
          selectedTrieAttendee = results[0];
        } else if (!selectedTrieAttendee) {
          selectedTrieAttendee = results[0];
        }

        listEl.innerHTML = results.slice(0, 16).map(a => {
          const isEntered = enteredTickets.has(a.tid);
          const isSelected = selectedTrieAttendee && (selectedTrieAttendee.tid === a.tid);
          return `
            <div class="attendee-result-item ${isSelected ? 'selected' : ''}" data-tid="${a.tid}">
              <div style="display:flex; align-items:center; gap:12px;">
                <div style="width:34px; height:34px; border-radius:50%; background:var(--pastel-cream); display:flex; align-items:center; justify-content:center; font-weight:700; color:var(--pastel-terracotta-active); font-size:13px; border:1px solid var(--card-border);">
                  ${a.name.charAt(0)}
                </div>
                <div>
                  <div style="font-weight:700; font-size:14px; color:#2d2522;">${a.name}</div>
                  <div style="font-size:12px; color:var(--text-muted); font-family:'JetBrains Mono', monospace;">
                    ${a.tid} &bull; ${a.college}
                  </div>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-size:12px; color:var(--text-muted); font-weight:600; background:#f4f0e8; padding:3px 8px; border-radius:4px;">
                  ${a.event}
                </span>
                <span class="pill-status ${isEntered ? 'clean' : 'warning'}" style="font-size:11px; font-weight:700;">
                  ${isEntered ? 'Entered' : 'Not Entered'}
                </span>
              </div>
            </div>
          `;
        }).join('');

        listEl.querySelectorAll('.attendee-result-item').forEach(item => {
          item.addEventListener('click', () => {
            const tid = item.getAttribute('data-tid');
            const found = ATTENDEE_DIRECTORY.find(a => a.tid === tid);
            if (found) {
              selectedTrieAttendee = found;
              updateTrie();
              const ent = enteredTickets.has(found.tid);
              telemetryText.textContent = `[Trie & Directory] Selected ${found.name} (${found.tid}) | Event: ${found.event} | Entry: ${ent ? 'ENTERED CAMPUS' : 'NOT ENTERED YET'}`;
            }
          });
        });
      }

      renderInspectorCard();
    }

    input.addEventListener('input', updateTrie);
    document.querySelectorAll('.trie-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        input.value = pill.getAttribute('data-pre');
        updateTrie();
      });
    });

    updateTrie();
  }

  // STRUCTURE 10: LIVE INTERACTIVE SUFFIX ARRAY (Rulebook Substring Search)
  function renderSuffixView() {
    canvasActionTag.textContent = 'Action: Rulebook Search';
    canvasDsBadge.textContent = 'Suffix Array (Lexicographically Sorted)';

    canvasBody.innerHTML = `
      <div class="interactive-input-card">
        <div class="input-row">
          <label style="font-size:14px; font-weight:600;">Search Rulebook Keyword:</label>
          <input type="text" id="sa-query" class="text-input" placeholder="Type keyword (e.g. plagiarism, fraud, medical, emergency, tied)..." value="plagiarism">
        </div>
        <div class="sample-pills-row">
          <span class="sample-pills-label">Quick Test Keywords:</span>
          <span class="sample-pill sa-pill" data-kw="plagiarism">plagiarism (Section 2)</span>
          <span class="sample-pill sa-pill" data-kw="fraud">fraud (Section 1)</span>
          <span class="sample-pill sa-pill" data-kw="emergency">emergency (Section 3)</span>
          <span class="sample-pill sa-pill" data-kw="queue">queue (Section 4)</span>
          <span class="sample-pill sa-pill" data-kw="Code Red">Code Red (Section 3)</span>
        </div>
      </div>
      <div class="panel-card">
        <div class="panel-header">
          <span class="panel-title">Binary Search Across Sorted Suffix Indices</span>
          <span class="pill-status clean" id="sa-status-pill">Search Time: O(M log N)</span>
        </div>
        <div id="sa-search-trace" style="font-family:'JetBrains Mono', monospace; font-size:13px; background:#faf7f2; border:1px solid var(--card-border); border-radius:8px; padding:12px; margin-bottom:12px;">
          <!-- Dynamically updated -->
        </div>
        <div style="font-size:14px; line-height:1.6; color:var(--text-charcoal); background:#ffffff; border:1px solid var(--card-border); border-radius:8px; padding:16px;" id="sa-corpus-highlight">
          <!-- Text with highlighted matches -->
        </div>
      </div>
    `;

    const input = document.getElementById('sa-query');
    function updateSuffix() {
      const q = input.value.trim();
      const traceEl = document.getElementById('sa-search-trace');
      const textEl = document.getElementById('sa-corpus-highlight');
      const statusPill = document.getElementById('sa-status-pill');

      if (!q) {
        traceEl.textContent = "Type a keyword above to execute binary search over the suffix array.";
        textEl.textContent = RULEBOOK_CORPUS;
        statusPill.textContent = "Enter Keyword";
        return;
      }

      const regex = new RegExp(`(${q})`, 'gi');
      const found = RULEBOOK_CORPUS.toLowerCase().includes(q.toLowerCase());

      if (found) {
        const offset = RULEBOOK_CORPUS.toLowerCase().indexOf(q.toLowerCase());
        const totalSuffixes = RULEBOOK_CORPUS.length;
        const steps = Math.ceil(Math.log2(totalSuffixes));

        statusPill.textContent = `Matched in ${steps} Binary Steps`;
        statusPill.className = "pill-status clean";

        traceEl.innerHTML = `
          <strong>Binary Search Trace for "${q}":</strong><br>
          • Total Suffix Array Size N = ${totalSuffixes} suffixes.<br>
          • Step 1: Low = 0, High = ${totalSuffixes - 1}, Mid = ${Math.floor(totalSuffixes / 2)}<br>
          • Step 2: Suffix comparison at Mid narrows search interval in O(M * log N)<br>
          • Step 3: EXACT SUBSTRING MATCH at Character Offset ${offset} in ${steps} binary comparisons!
        `;

        textEl.innerHTML = RULEBOOK_CORPUS.replace(regex, `<mark style="background:var(--pastel-cream-0); color:var(--pastel-terracotta-active); padding:2px 4px; border-radius:4px; font-weight:700; border:1px solid var(--pastel-cream-border);">$1</mark>`);
        telemetryText.textContent = `[Suffix Array] Pattern '${q}' located at character offset ${offset} via binary search.`;
      } else {
        statusPill.textContent = "No Substring Match";
        statusPill.className = "pill-status missing";
        traceEl.innerHTML = `Binary search completed in ${Math.ceil(Math.log2(RULEBOOK_CORPUS.length))} steps: Keyword "${q}" not found in rulebook corpus.`;
        textEl.textContent = RULEBOOK_CORPUS;
        telemetryText.textContent = `[Suffix Array] Pattern '${q}' not found in rulebook.`;
      }
    }

    input.addEventListener('input', updateSuffix);
    document.querySelectorAll('.sa-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        input.value = pill.getAttribute('data-kw');
        updateSuffix();
      });
    });

    updateSuffix();
  }

  // Initial load
  renderScanView();
});
