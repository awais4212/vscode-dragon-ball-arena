(() => {
  "use strict";

  const dataNode = document.getElementById("arena-data");
  const data = JSON.parse(dataNode.textContent || "{}");
  const roster = Array.isArray(data.fighters) ? data.fighters : [];
  const battlefields = Array.isArray(data.battlefields) ? data.battlefields : [];

  const canvas = document.getElementById("arena");
  const ctx = canvas.getContext("2d");
  const leftSelect = document.getElementById("leftFighter");
  const rightSelect = document.getElementById("rightFighter");
  const fieldSelect = document.getElementById("battlefield");
  const fightButton = document.getElementById("fightButton");
  const randomButton = document.getElementById("randomButton");
  const resetButton = document.getElementById("resetButton");
  const logLines = document.getElementById("logLines");
  const statusPill = document.getElementById("statusPill");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const sprites = new Map();
  for (const fighter of roster) {
    const image = new Image();
    image.decoding = "sync";
    image.src = fighter.spriteUri;
    image.addEventListener("error", () => setStatus(`Sprite error: ${fighter.name}`));
    sprites.set(fighter.id, image);

    const leftOption = document.createElement("option");
    leftOption.value = fighter.id;
    leftOption.textContent = fighter.name;
    leftSelect.appendChild(leftOption);

    const rightOption = document.createElement("option");
    rightOption.value = fighter.id;
    rightOption.textContent = fighter.name;
    rightSelect.appendChild(rightOption);
  }

  for (const battlefield of battlefields) {
    const option = document.createElement("option");
    option.value = battlefield.id;
    option.textContent = battlefield.name;
    fieldSelect.appendChild(option);
  }

  leftSelect.value = "goku";
  rightSelect.value = "vegeta";
  fieldSelect.value = "tournament";

  const W = canvas.width;
  const H = canvas.height;
  const FLOOR = 266;

  const state = {
    left: null,
    right: null,
    battlefield: "tournament",
    running: false,
    round: 1,
    banner: "READY",
    bannerAlpha: 1,
    beam: null,
    particles: [],
    shockwaves: [],
    shake: 0,
    flash: 0,
    logs: [],
    lastTime: performance.now()
  };

  function configById(id) {
    return roster.find((fighter) => fighter.id === id) || roster[0];
  }

  function createRuntime(config, side) {
    return {
      config,
      side,
      x: side === "left" ? 130 : W - 130,
      baseX: side === "left" ? 130 : W - 130,
      y: FLOOR,
      hp: 100,
      pose: "idle",
      poseTime: 0,
      bob: Math.random() * Math.PI * 2,
      lunge: 0,
      lungeTarget: 0,
      trail: 0,
      hitShake: 0,
      flash: 0,
      aura: 0.26,
      defeated: false
    };
  }

  function setStatus(text) {
    statusPill.textContent = text;
  }

  function addLog(text, kind = "") {
    state.logs.unshift({ text, kind });
    state.logs = state.logs.slice(0, 3);
    logLines.replaceChildren();
    for (const entry of state.logs) {
      const line = document.createElement("div");
      line.className = `log-line ${entry.kind}`;
      line.textContent = entry.text;
      logLines.appendChild(line);
    }
  }

  function resetMatch(logReset = true) {
    state.running = false;
    state.round = 1;
    state.banner = "READY";
    state.bannerAlpha = 1;
    state.beam = null;
    state.particles = [];
    state.shockwaves = [];
    state.shake = 0;
    state.flash = 0;
    state.left = createRuntime(configById(leftSelect.value), "left");
    state.right = createRuntime(configById(rightSelect.value), "right");
    state.battlefield = fieldSelect.value;
    fightButton.disabled = false;
    leftSelect.disabled = false;
    rightSelect.disabled = false;
    fieldSelect.disabled = false;
    setStatus("Ready");
    if (logReset) {
      state.logs = [];
      addLog(`${state.left.config.name} vs ${state.right.config.name}`);
      addLog("Press Fight to start the match.");
    }
  }

  function sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function damageFor(attacker, defender) {
    const variance = Math.floor(Math.random() * 8) - 2;
    const powerEdge = (attacker.config.power - defender.config.power) / 2500;
    let damage = attacker.config.baseDamage + variance + powerEdge;
    damage -= defender.config.defense * 0.035;
    const critical = Math.random() < attacker.config.criticalChance;
    if (critical) damage *= 1.5;
    return { damage: clamp(Math.round(damage), 8, 36), critical };
  }

  function dodgeChance(attacker, defender) {
    return clamp(0.07 + (defender.config.speed - attacker.config.speed) / 400, 0.04, 0.2);
  }

  function spawnImpact(x, y, color, amount = 28) {
    for (let index = 0; index < amount; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 55 + Math.random() * 125;
      state.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.55 + Math.random() * 0.4,
        maxLife: 0.95,
        size: 1.5 + Math.random() * 4,
        color
      });
    }
    state.shockwaves.push({ x, y, radius: 5, life: 0.42, color });
  }

  function spawnCharge(fighter) {
    const color = fighter.config.palette.aura;
    for (let index = 0; index < 3; index += 1) {
      const offset = (Math.random() - 0.5) * 62;
      state.particles.push({
        x: fighter.x + offset,
        y: fighter.y + 4,
        vx: -offset * 0.35,
        vy: -80 - Math.random() * 55,
        life: 0.55 + Math.random() * 0.35,
        maxLife: 0.9,
        size: 1.5 + Math.random() * 3,
        color
      });
    }
  }

  async function performAttack(attacker, defender) {
    attacker.pose = "charge";
    attacker.aura = 1;
    addLog(`${attacker.config.name} charges ${attacker.config.signatureAttack}!`, "attack");
    await sleep(560);
    if (!state.running) return;

    const dodged = Math.random() < dodgeChance(attacker, defender);
    attacker.pose = "attack";
    attacker.lungeTarget = attacker.side === "left" ? 58 : -58;
    attacker.trail = 1;
    await sleep(120);
    if (!state.running) return;
    state.beam = {
      owner: attacker,
      target: defender,
      style: attacker.config.attackStyle,
      color: attacker.config.palette.aura,
      progress: 0,
      life: 0.62
    };
    await sleep(430);
    if (!state.running) return;

    if (dodged) {
      defender.pose = "dodge";
      defender.lungeTarget = defender.side === "left" ? -28 : 28;
      addLog(`${defender.config.name} vanished and dodged!`, "hit");
      await sleep(360);
    } else {
      const result = damageFor(attacker, defender);
      defender.hp = clamp(defender.hp - result.damage, 0, 100);
      defender.pose = "hit";
      defender.hitShake = 1;
      defender.flash = 1;
      state.shake = 1;
      state.flash = 0.7;
      spawnImpact(defender.x, defender.y - 68, attacker.config.palette.aura);
      addLog(
        `${defender.config.name} takes ${result.damage} damage${result.critical ? " — critical!" : ""}`,
        "hit"
      );
      await sleep(420);
    }

    attacker.pose = "idle";
    attacker.lungeTarget = 0;
    attacker.aura = 0.26;
    defender.pose = defender.hp <= 0 ? "defeated" : "idle";
    defender.lungeTarget = 0;
    state.beam = null;
  }

  async function runBattle() {
    if (state.running) return;

    resetMatch(false);
    state.running = true;
    fightButton.disabled = true;
    leftSelect.disabled = true;
    rightSelect.disabled = true;
    fieldSelect.disabled = true;
    state.logs = [];
    setStatus("Fighting");

    for (const countdown of ["3", "2", "1", "FIGHT!"]) {
      state.banner = countdown;
      state.bannerAlpha = 1;
      await sleep(countdown === "FIGHT!" ? 520 : 370);
    }

    addLog(`${state.left.config.name}: ${state.left.config.greeting}`);
    addLog(`${state.right.config.name}: ${state.right.config.greeting}`);

    while (state.running && state.left.hp > 0 && state.right.hp > 0 && state.round <= 7) {
      state.banner = `ROUND ${state.round}`;
      state.bannerAlpha = 1;
      await sleep(380);

      const first =
        state.left.config.speed + Math.random() * 18 >=
        state.right.config.speed + Math.random() * 18
          ? state.left
          : state.right;
      const second = first === state.left ? state.right : state.left;

      await performAttack(first, second);
      if (second.hp <= 0 || !state.running) break;
      await sleep(300);
      await performAttack(second, first);
      if (first.hp <= 0 || !state.running) break;

      state.round += 1;
      await sleep(420);
    }

    if (!state.running) return;

    let winner;
    if (state.left.hp === state.right.hp) {
      winner = state.left.config.power >= state.right.config.power ? state.left : state.right;
    } else {
      winner = state.left.hp > state.right.hp ? state.left : state.right;
    }
    const loser = winner === state.left ? state.right : state.left;
    winner.pose = "victory";
    winner.aura = 1;
    loser.pose = "defeated";
    state.banner = `${winner.config.name.toUpperCase()} WINS`;
    state.bannerAlpha = 1;
    addLog(`${winner.config.name} wins the match!`, "win");
    setStatus("Finished");
    state.running = false;
    fightButton.disabled = false;
    leftSelect.disabled = false;
    rightSelect.disabled = false;
    fieldSelect.disabled = false;
  }

  function randomize() {
    const leftIndex = Math.floor(Math.random() * roster.length);
    let rightIndex = Math.floor(Math.random() * roster.length);
    if (rightIndex === leftIndex) rightIndex = (rightIndex + 1) % roster.length;
    leftSelect.value = roster[leftIndex].id;
    rightSelect.value = roster[rightIndex].id;
    fieldSelect.value = battlefields[Math.floor(Math.random() * battlefields.length)].id;
    resetMatch();
  }

  leftSelect.addEventListener("change", () => resetMatch());
  rightSelect.addEventListener("change", () => resetMatch());
  fieldSelect.addEventListener("change", () => resetMatch());
  fightButton.addEventListener("click", runBattle);
  randomButton.addEventListener("click", randomize);
  resetButton.addEventListener("click", () => resetMatch());
  window.addEventListener("message", (event) => {
    if (event.data && event.data.type === "reset") resetMatch();
  });

  function drawNamek(time) {
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#267d6c");
    sky.addColorStop(0.58, "#73bd83");
    sky.addColorStop(1, "#1c3740");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "rgba(238,255,197,0.85)";
    ctx.beginPath(); ctx.arc(80, 52, 25, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(184,224,193,0.72)";
    ctx.beginPath(); ctx.arc(410, 69, 14, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#325d57";
    ctx.beginPath();
    ctx.moveTo(0, 190); ctx.lineTo(74, 104); ctx.lineTo(129, 190);
    ctx.lineTo(210, 120); ctx.lineTo(278, 190); ctx.lineTo(368, 92);
    ctx.lineTo(W, 190); ctx.closePath(); ctx.fill();

    ctx.fillStyle = "#2c7c72";
    ctx.fillRect(0, 188, W, 70);
    ctx.strokeStyle = "rgba(150,255,226,0.46)";
    ctx.lineWidth = 1.2;
    for (let y = 198; y < 252; y += 10) {
      ctx.beginPath();
      for (let x = 0; x <= W; x += 12) {
        const wave = Math.sin(x * 0.06 + time * 0.002 + y) * 2;
        if (x === 0) ctx.moveTo(x, y + wave); else ctx.lineTo(x, y + wave);
      }
      ctx.stroke();
    }

    ctx.fillStyle = "#65473b";
    ctx.beginPath();
    ctx.moveTo(0, 258); ctx.lineTo(W, 249); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#997253";
    for (let x = 0; x < W; x += 28) ctx.fillRect(x, 269 + ((x / 28) % 3) * 7, 17, 4);
  }

  function drawTournament(time) {
    const space = ctx.createRadialGradient(W / 2, 120, 18, W / 2, 120, 360);
    space.addColorStop(0, "#28324f");
    space.addColorStop(0.55, "#11162a");
    space.addColorStop(1, "#05070f");
    ctx.fillStyle = space;
    ctx.fillRect(0, 0, W, H);

    for (let index = 0; index < 72; index += 1) {
      const x = (index * 83 + 17) % W;
      const y = (index * 37 + 9) % 190;
      const pulse = 0.35 + 0.55 * Math.sin(time * 0.002 + index);
      ctx.fillStyle = `rgba(215,225,255,${pulse})`;
      ctx.fillRect(x, y, index % 8 === 0 ? 2 : 1, index % 11 === 0 ? 2 : 1);
    }

    ctx.fillStyle = "#343746";
    for (let index = 0; index < 12; index += 1) {
      const x = (index * 71 + 28) % W;
      const y = 66 + ((index * 43) % 116);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(index * 0.58 + time * 0.00012);
      ctx.fillRect(-7, -4, 14, 8);
      ctx.restore();
    }

    const floor = ctx.createLinearGradient(0, 205, 0, H);
    floor.addColorStop(0, "#55596a");
    floor.addColorStop(1, "#292b37");
    ctx.fillStyle = floor;
    ctx.beginPath();
    ctx.moveTo(28, 239); ctx.lineTo(86, 205); ctx.lineTo(395, 205); ctx.lineTo(454, 239);
    ctx.lineTo(420, H); ctx.lineTo(57, H); ctx.closePath(); ctx.fill();

    ctx.strokeStyle = "rgba(166,171,192,0.62)";
    ctx.lineWidth = 2;
    for (let x = 70; x < 430; x += 42) {
      ctx.beginPath(); ctx.moveTo(x, 214); ctx.lineTo(x - 17, H); ctx.stroke();
    }
    for (let y = 226; y < H; y += 20) {
      ctx.beginPath(); ctx.moveTo(39, y); ctx.lineTo(441, y); ctx.stroke();
    }
  }

  function drawAura(fighter, time) {
    if (!fighter || fighter.aura <= 0.05) return;
    const color = fighter.config.palette.aura;
    const power = fighter.aura;
    const cx = fighter.x + fighter.lunge;
    const cy = fighter.y - 65;
    const scale = fighter.config.scale;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.translate(cx, cy);
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 20 + power * 16;

    for (let layer = 0; layer < 3; layer += 1) {
      ctx.globalAlpha = 0.16 + power * (0.18 - layer * 0.03);
      ctx.lineWidth = 3 - layer * 0.6;
      ctx.beginPath();
      const points = 42;
      for (let index = 0; index <= points; index += 1) {
        const angle = (Math.PI * 2 * index) / points;
        const noise = Math.sin(time * 0.012 + index * 1.9 + layer) * 7;
        const rx = (43 + noise + layer * 5) * scale;
        const ry = (74 + noise * 1.5 + layer * 7) * scale;
        const x = Math.cos(angle) * rx;
        const y = Math.sin(angle) * ry;
        if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawFallbackFighter(fighter) {
    const p = fighter.config.palette;
    ctx.fillStyle = p.primary;
    ctx.fillRect(-28, -80, 56, 75);
    ctx.fillStyle = p.skin;
    ctx.beginPath(); ctx.arc(0, -106, 26, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = p.hair;
    ctx.beginPath();
    ctx.moveTo(-27, -118); ctx.lineTo(-18, -150); ctx.lineTo(-4, -127);
    ctx.lineTo(8, -158); ctx.lineTo(17, -126); ctx.lineTo(31, -145); ctx.lineTo(25, -111);
    ctx.closePath(); ctx.fill();
  }

  function drawFighter(fighter, time) {
    if (!fighter) return;
    const config = fighter.config;
    const image = sprites.get(config.id);
    // Every sprite declares the direction its original artwork faces.
    // The left fighter must look right; the right fighter must look left.
    // Mirroring is applied only when the source artwork does not already
    // face the opponent. This keeps Goku, Vegeta, Broly, Trunks, Frieza,
    // Gohan and the rest facing inward in every pose and animation.
    const toward = fighter.side === "left" ? 1 : -1;
    const nativeFacing = config.nativeFacing === "left" ? -1 : 1;
    const spriteFacing = toward === nativeFacing ? 1 : -1;
    const idleBob = fighter.pose === "idle" ? Math.sin(time * 0.0048 + fighter.bob) * 2.5 : 0;
    const breathing = fighter.pose === "idle" ? 1 + Math.sin(time * 0.004 + fighter.bob) * 0.012 : 1;
    const shake = fighter.hitShake > 0 ? Math.sin(time * 0.07) * 9 * fighter.hitShake : 0;
    const dodgeLift = fighter.pose === "dodge" ? -24 : 0;
    const defeatedDrop = fighter.pose === "defeated" ? 13 : 0;
    const victoryLift = fighter.pose === "victory" ? Math.abs(Math.sin(time * 0.006)) * -5 : 0;
    const poseScale = fighter.pose === "charge" ? 1 + Math.sin(time * 0.024) * 0.025 : 1;
    const spriteHeight = config.id === "goku" || config.id === "vegeta" ? 145 : 140;
    const imageRatio = image && image.complete && image.naturalHeight > 0
      ? image.naturalWidth / image.naturalHeight
      : 0.7;
    const spriteWidth = spriteHeight * imageRatio;

    drawAura(fighter, time);

    if (fighter.trail > 0 && image && image.complete && image.naturalWidth > 0) {
      for (let index = 3; index >= 1; index -= 1) {
        ctx.save();
        ctx.globalAlpha = fighter.trail * (0.05 + index * 0.035);
        ctx.globalCompositeOperation = "lighter";
        ctx.translate(
          fighter.x + fighter.lunge - toward * index * 13,
          fighter.y + idleBob + dodgeLift + defeatedDrop + victoryLift
        );
        ctx.scale(spriteFacing * config.scale, config.scale);
        ctx.drawImage(image, -spriteWidth / 2, -spriteHeight, spriteWidth, spriteHeight);
        ctx.restore();
      }
    }

    ctx.save();
    ctx.translate(fighter.x + fighter.lunge + shake, fighter.y + idleBob + dodgeLift + defeatedDrop + victoryLift);
    ctx.scale(spriteFacing * config.scale * poseScale, config.scale * breathing * poseScale);

    if (fighter.pose === "hit") ctx.rotate(-0.13 * toward);
    if (fighter.pose === "attack") ctx.rotate(-0.06 * toward);
    if (fighter.pose === "defeated") ctx.rotate(-1.25 * toward);
    if (fighter.pose === "victory") ctx.rotate(Math.sin(time * 0.004) * 0.025);

    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath(); ctx.ellipse(0, 1, 43, 9, 0, 0, Math.PI * 2); ctx.fill();

    if (fighter.flash > 0) {
      ctx.globalAlpha = 0.55 + 0.45 * Math.sin(time * 0.08);
      ctx.filter = "brightness(2.1) saturate(0.4)";
    }

    if (image && image.complete && image.naturalWidth > 0) {
      ctx.drawImage(image, -spriteWidth / 2, -spriteHeight, spriteWidth, spriteHeight);
    } else {
      drawFallbackFighter(fighter);
    }

    ctx.filter = "none";
    ctx.globalAlpha = 1;

    if (fighter.pose === "charge") {
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = config.palette.aura;
      ctx.shadowColor = config.palette.aura;
      ctx.shadowBlur = 16;
      for (let index = 0; index < 6; index += 1) {
        const angle = time * 0.012 + index * Math.PI / 3;
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * 42, -70 + Math.sin(angle) * 58, 2.5 + (index % 2), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (fighter.pose === "attack") {
      // Keep the charging hand on the opponent-facing side after mirroring.
      const handX = 42 * toward * spriteFacing;
      const handY = -72;
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = config.palette.aura;
      ctx.shadowColor = config.palette.aura;
      ctx.shadowBlur = 24;
      ctx.beginPath(); ctx.arc(handX, handY, 9 + Math.sin(time * 0.03) * 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath(); ctx.arc(handX, handY, 3.5, 0, Math.PI * 2); ctx.fill();
    }

    ctx.restore();
  }

  function drawBeam() {
    const beam = state.beam;
    if (!beam) return;
    const start = beam.owner;
    const end = beam.target;
    const direction = start.side === "left" ? 1 : -1;
    const sx = start.x + start.lunge + direction * 46;
    const sy = start.y - 73;
    const tx = end.x - direction * 34;
    const ty = end.y - 72;
    const progress = clamp(beam.progress, 0, 1);
    const ex = sx + (tx - sx) * progress;
    const ey = sy + (ty - sy) * progress;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = beam.color;
    ctx.fillStyle = beam.color;
    ctx.shadowBlur = 24;
    ctx.shadowColor = beam.color;

    if (beam.style === "rush") {
      ctx.lineWidth = 15;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.beginPath(); ctx.arc(ex, ey, 17 + progress * 8, 0, Math.PI * 2); ctx.fill();
    } else if (beam.style === "orb") {
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.beginPath(); ctx.arc(ex, ey, 13 + Math.sin(performance.now() * 0.03) * 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(ex, ey, 5, 0, Math.PI * 2); ctx.fill();
    } else if (beam.style === "spiral") {
      ctx.lineWidth = 5;
      ctx.beginPath();
      for (let index = 0; index <= 28; index += 1) {
        const t = (index / 28) * progress;
        const x = sx + (tx - sx) * t;
        const y = sy + (ty - sy) * t + Math.sin(t * 30) * 8;
        if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
    } else {
      const beamWidth = 15 + Math.sin(performance.now() * 0.035) * 2;
      ctx.lineWidth = beamWidth;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#ffffff";
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.beginPath(); ctx.arc(ex, ey, 12 + progress * 5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  function drawHud() {
    const left = state.left;
    const right = state.right;
    if (!left || !right) return;

    function bar(x, y, width, value, color, alignRight) {
      ctx.fillStyle = "rgba(7,9,16,0.86)";
      ctx.fillRect(x, y, width, 15);
      const fill = (width - 5) * clamp(value / 100, 0, 1);
      ctx.fillStyle = color;
      ctx.fillRect(alignRight ? x + width - 2.5 - fill : x + 2.5, y + 2.5, fill, 10);
      ctx.strokeStyle = "rgba(255,255,255,0.36)";
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, width - 1, 14);
    }

    ctx.font = "bold 11px ui-monospace, monospace";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.fillText(left.config.name.toUpperCase(), 14, 9);
    ctx.textAlign = "right";
    ctx.fillText(right.config.name.toUpperCase(), W - 14, 9);
    bar(14, 25, 166, left.hp, left.hp > 35 ? "#42e87b" : "#ff4b4b", false);
    bar(W - 180, 25, 166, right.hp, right.hp > 35 ? "#42e87b" : "#ff4b4b", true);

    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(5,7,14,0.88)";
    ctx.fillRect(W / 2 - 30, 7, 60, 35);
    ctx.fillStyle = "#ffd45b";
    ctx.font = "bold 12px ui-monospace, monospace";
    ctx.fillText(`R${state.round}`, W / 2, 11);
    ctx.fillStyle = "#ffffff";
    ctx.font = "10px ui-monospace, monospace";
    ctx.fillText("VS", W / 2, 26);
  }

  function update(delta) {
    if (state.bannerAlpha > 0) state.bannerAlpha = Math.max(0, state.bannerAlpha - delta * 0.55);
    if (state.shake > 0) state.shake = Math.max(0, state.shake - delta * 4);
    if (state.flash > 0) state.flash = Math.max(0, state.flash - delta * 3.2);

    for (const fighter of [state.left, state.right]) {
      if (!fighter) continue;
      fighter.poseTime += delta;
      fighter.lunge += (fighter.lungeTarget - fighter.lunge) * Math.min(1, delta * 13);
      fighter.trail = Math.max(0, fighter.trail - delta * 2.6);
      fighter.hitShake = Math.max(0, fighter.hitShake - delta * 4.5);
      fighter.flash = Math.max(0, fighter.flash - delta * 3.7);
      if (fighter.pose === "idle") fighter.aura += (0.26 - fighter.aura) * delta * 3;
      if (fighter.pose === "dodge") fighter.lungeTarget *= Math.max(0, 1 - delta * 5);
      if (fighter.pose === "charge" && Math.random() < 0.18) spawnCharge(fighter);
    }

    if (state.beam) {
      state.beam.progress = Math.min(1, state.beam.progress + delta * 3.5);
      state.beam.life -= delta;
      if (state.beam.life <= 0) state.beam = null;
    }

    for (const particle of state.particles) {
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.vy += 70 * delta;
      particle.life -= delta;
    }
    state.particles = state.particles.filter((particle) => particle.life > 0);

    for (const wave of state.shockwaves) {
      wave.radius += delta * 150;
      wave.life -= delta;
    }
    state.shockwaves = state.shockwaves.filter((wave) => wave.life > 0);
  }

  function drawEffects() {
    for (const particle of state.particles) {
      ctx.globalAlpha = clamp(particle.life / particle.maxLife, 0, 1);
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = particle.color;
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.shadowBlur = 0;

    for (const wave of state.shockwaves) {
      ctx.globalAlpha = clamp(wave.life / 0.42, 0, 1);
      ctx.strokeStyle = wave.color;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function render(time) {
    ctx.save();
    const shakeX = state.shake > 0 ? (Math.random() - 0.5) * 12 * state.shake : 0;
    const shakeY = state.shake > 0 ? (Math.random() - 0.5) * 8 * state.shake : 0;
    ctx.translate(shakeX, shakeY);

    if (state.battlefield === "tournament") drawTournament(time);
    else drawNamek(time);

    drawFighter(state.left, time);
    drawFighter(state.right, time);
    drawBeam();
    drawEffects();
    drawHud();

    if (state.flash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${state.flash * 0.22})`;
      ctx.fillRect(0, 0, W, H);
    }

    if (state.bannerAlpha > 0 && state.banner) {
      ctx.globalAlpha = Math.min(1, state.bannerAlpha * 1.7);
      ctx.fillStyle = "rgba(5,7,14,0.82)";
      ctx.fillRect(W / 2 - 104, H / 2 - 24, 208, 48);
      ctx.strokeStyle = "#f0ad3f";
      ctx.lineWidth = 2;
      ctx.strokeRect(W / 2 - 103, H / 2 - 23, 206, 46);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 21px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(state.banner, W / 2, H / 2);
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  function frame(time) {
    const delta = Math.min(0.04, (time - state.lastTime) / 1000);
    state.lastTime = time;
    update(delta);
    render(time);
    requestAnimationFrame(frame);
  }

  resetMatch();
  requestAnimationFrame(frame);
})();
