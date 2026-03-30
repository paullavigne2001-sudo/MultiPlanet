import { useState, useEffect, useRef, useCallback } from "react";

// Google Fonts - Nunito
const _fontLink = document.createElement("link");
_fontLink.rel = "stylesheet";
_fontLink.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap";
document.head.appendChild(_fontLink);

// ── i18n ─────────────────────────────────────────────────────────
const LANGS = ["fr","en","es","it","de","pt"];
const LANG_LABELS = { fr:"\u{1F1EB}\u{1F1F7} Fran\u00e7ais", en:"\u{1F1EC}\u{1F1E7} English", es:"\u{1F1EA}\u{1F1F8} Espa\u00f1ol", it:"\u{1F1EE}\u{1F1F9} Italiano", de:"\u{1F1E9}\u{1F1EA} Deutsch", pt:"\u{1F1F5}\u{1F1F9} Portugu\u00eas" };

const T = {
  appSubtitle: { fr:"L'aventure des chiffres !", en:"The number adventure!", es:"\u00a1La aventura de los n\u00fameros!", it:"L'avventura dei numeri!", de:"Das Zahlen-Abenteuer!", pt:"A aventura dos n\u00fameros!" },
  play:        { fr:"Jouer !", en:"Play!", es:"\u00a1Jugar!", it:"Gioca!", de:"Spielen!", pt:"Jogar!" },
  shop:        { fr:"Shop", en:"Shop", es:"Tienda", it:"Shop", de:"Shop", pt:"Loja" },
  settings:    { fr:"Param\u00e8tres", en:"Settings", es:"Ajustes", it:"Impostazioni", de:"Einstellungen", pt:"Configura\u00e7\u00f5es" },
  myHero:      { fr:"Mon h\u00e9ros", en:"My hero", es:"Mi h\u00e9roe", it:"Il mio eroe", de:"Mein Held", pt:"Meu her\u00f3i" },
  myTables:    { fr:"Mes tables \u00e0 r\u00e9viser", en:"My times tables", es:"Mis tablas", it:"Le mie tabelline", de:"Meine Tabellen", pt:"Minhas tabuadas" },
  levelWord:   { fr:"Niveau", en:"Level", es:"Nivel", it:"Livello", de:"Level", pt:"N\u00edvel" },
  unlockHero:  { fr:"Gagne des \u2B50 pour d\u00e9bloquer de nouveaux h\u00e9ros !", en:"Earn \u2B50 to unlock new heroes!", es:"\u00a1Gana \u2B50 para desbloquear h\u00e9roes!", it:"Guadagna \u2B50 per sbloccare eroi!", de:"Sammle \u2B50 f\u00fcr neue Helden!", pt:"Ganhe \u2B50 para desbloquear her\u00f3is!" },
  home:        { fr:"Accueil", en:"Home", es:"Inicio", it:"Home", de:"Start", pt:"In\u00edcio" },
  back:        { fr:"< Retour", en:"< Back", es:"< Volver", it:"< Indietro", de:"< Zur\u00fcck", pt:"< Voltar" },
  nextLevel:   { fr:"Niveau suivant !", en:"Next level!", es:"\u00a1Siguiente nivel!", it:"Livello successivo!", de:"N\u00e4chstes Level!", pt:"Pr\u00f3ximo n\u00edvel!" },
  retry:       { fr:"R\u00e9essayer \u{1F4AA}", en:"Try again \u{1F4AA}", es:"Intentar de nuevo \u{1F4AA}", it:"Riprova \u{1F4AA}", de:"Nochmal \u{1F4AA}", pt:"Tentar novamente \u{1F4AA}" },
  finished:    { fr:"termin\u00e9 !", en:"complete!", es:"\u00a1completado!", it:"completato!", de:"geschafft!", pt:"conclu\u00eddo!" },
  starTotal:   { fr:"Total", en:"Total", es:"Total", it:"Totale", de:"Gesamt", pt:"Total" },
  noStar:      { fr:"Mauvaise r\u00e9ponse \u2014 pas d'\u00e9toile cette fois \u{1F62C}", en:"Wrong answer \u2014 no star this time \u{1F62C}", es:"Respuesta incorrecta \u2014 sin estrella \u{1F62C}", it:"Risposta errata \u2014 nessuna stella \u{1F62C}", de:"Falsche Antwort \u2014 kein Stern \u{1F62C}", pt:"Resposta errada \u2014 sem estrela \u{1F62C}" },
  nextChar:    { fr:"Prochain perso", en:"Next character", es:"Pr\u00f3ximo personaje", it:"Prossimo personaggio", de:"N\u00e4chste Figur", pt:"Pr\u00f3ximo personagem" },
  newHero:     { fr:"Nouveau personnage !", en:"New character!", es:"\u00a1Nuevo personaje!", it:"Nuovo personaggio!", de:"Neue Figur!", pt:"Novo personagem!" },
  unlockedMsg: { fr:"est d\u00e9bloqu\u00e9 !", en:"is unlocked!", es:"\u00a1est\u00e1 desbloqueado!", it:"\u00e8 sbloccato!", de:"ist freigeschaltet!", pt:"est\u00e1 desbloqueado!" },
  skipBtn:     { fr:"Niveau trop difficile ? Passer \u27A1", en:"Too hard? Skip \u27A1", es:"\u00bfMuy dif\u00edcil? Saltar \u27A1", it:"Troppo difficile? Salta \u27A1", de:"Zu schwer? \u00dcberspringen \u27A1", pt:"Muito dif\u00edcil? Pular \u27A1" },
  skipTitle:   { fr:"Passer le niveau", en:"Skip level", es:"Saltar el nivel", it:"Salta il livello", de:"Level \u00fcberspringen", pt:"Pular o n\u00edvel" },
  skipHint:    { fr:"R\u00e9ponds correctement aux 2 pour gagner une \u2B50", en:"Answer both correctly to earn a \u2B50", es:"Responde correctamente las 2 para ganar \u2B50", it:"Rispondi correttamente a 2 per guadagnare \u2B50", de:"Beantworte beide richtig f\u00fcr einen \u2B50", pt:"Responda as 2 corretamente para ganhar \u2B50" },
  skipQ:       { fr:"Question", en:"Question", es:"Pregunta", it:"Domanda", de:"Frage", pt:"Pergunta" },
  skipWrong:   { fr:"Rat\u00e9 ! Retour au jeu.", en:"Wrong! Back to game.", es:"\u00a1Fallado! Vuelve al juego.", it:"Sbagliato! Torna al gioco.", de:"Falsch! Zur\u00fcck zum Spiel.", pt:"Errado! Volte ao jogo." },
  answerWas:   { fr:"La r\u00e9ponse \u00e9tait", en:"The answer was", es:"La respuesta era", it:"La risposta era", de:"Die Antwort war", pt:"A resposta era" },
  skipRight1:  { fr:"Bravo ! Question suivante\u2026", en:"Great! Next question\u2026", es:"\u00a1Bravo! Siguiente pregunta\u2026", it:"Bravo! Prossima domanda\u2026", de:"Super! N\u00e4chste Frage\u2026", pt:"\u00d3timo! Pr\u00f3xima pergunta\u2026" },
  quizTitle:   { fr:"Question du niveau", en:"Level question", es:"Pregunta del nivel", it:"Domanda del livello", de:"Level-Frage", pt:"Pergunta do n\u00edvel" },
  jumpHint:    { fr:"\u2191 Sauter par-dessus les obstacles au sol", en:"\u2191 Jump over ground obstacles", es:"\u2191 Salta sobre los obst\u00e1culos del suelo", it:"\u2191 Salta sugli ostacoli a terra", de:"\u2191 \u00dcber Bodenhindernisse springen", pt:"\u2191 Pular sobre obst\u00e1culos no ch\u00e3o" },
  duckHint:    { fr:"\u2193 Se baisser sous les obstacles volants", en:"\u2193 Duck under flying obstacles", es:"\u2193 Ag\u00e1chate bajo los obst\u00e1culos voladores", it:"\u2193 Abbassati sotto gli ostacoli volanti", de:"\u2193 Unter fliegenden Hindernissen ducken", pt:"\u2193 Abaixar sob obst\u00e1culos voadores" },
  sound:       { fr:"Son", en:"Sound", es:"Sonido", it:"Suono", de:"Ton", pt:"Som" },
  vibration:   { fr:"Vibrations", en:"Vibration", es:"Vibraci\u00f3n", it:"Vibrazione", de:"Vibration", pt:"Vibra\u00e7\u00e3o" },
  language:    { fr:"Langue", en:"Language", es:"Idioma", it:"Lingua", de:"Sprache", pt:"Idioma" },
  coppa:       { fr:"Application adapt\u00e9e aux enfants \u00b7 COPPA / RGPD-K", en:"Child-safe app \u00b7 COPPA / GDPR-K", es:"App para ni\u00f1os \u00b7 COPPA / RGPD-K", it:"App per bambini \u00b7 COPPA / GDPR-K", de:"Kinderfreundliche App \u00b7 COPPA / DSGVO-K", pt:"App para crian\u00e7as \u00b7 COPPA / RGPD-K" },
  resetBtn:    { fr:"R\u00e9initialiser la progression", en:"Reset progress", es:"Reiniciar progreso", it:"Reimposta progressi", de:"Fortschritt zur\u00fccksetzen", pt:"Redefinir progresso" },
  resetConfirm:{ fr:"Es-tu s\u00fbr ? Niveau, \u00e9toiles et personnages seront r\u00e9initialis\u00e9s. Le Pass MultiPlanet sera conserv\u00e9.", en:"Are you sure? Level, stars and characters will be reset. Your MultiPlanet Pass will be kept.", es:"\u00bfEst\u00e1s seguro? Nivel, estrellas y personajes se reiniciar\u00e1n. El Pase se conservar\u00e1.", it:"Sei sicuro? Livello, stelle e personaggi verranno azzerati. Il Pass viene mantenuto.", de:"Bist du sicher? Level, Sterne und Figuren werden zur\u00fcckgesetzt. Der Pass bleibt erhalten.", pt:"Tem certeza? N\u00edvel, estrelas e personagens ser\u00e3o redefinidos. O Passe ser\u00e1 mantido." },
  resetYes:    { fr:"Oui, r\u00e9initialiser", en:"Yes, reset", es:"S\u00ed, reiniciar", it:"S\u00ec, reimposta", de:"Ja, zur\u00fccksetzen", pt:"Sim, redefinir" },
  resetNo:     { fr:"Annuler", en:"Cancel", es:"Cancelar", it:"Annulla", de:"Abbrechen", pt:"Cancelar" },
  cheers: {
    fr:["Bien jou\u00e9 ! \u{1F3C6}","Tu d\u00e9chires ! \u{1F31F}","G\u00e9nial ! \u{1F389}","Incroyable ! \u{1F680}","Parfait ! \u2728","Tu es une star ! \u2B50"],
    en:["Bien jou\u00e9 ! \u{1F3C6}","You rock! \u{1F31F}","Awesome! \u{1F389}","Incredible! \u{1F680}","Perfect! \u2728","You are a star! \u2B50"],
    es:["\u00a1Super campe\u00f3n! \u{1F3C6}","\u00a1Eres incre\u00edble! \u{1F31F}","\u00a1Genial! \u{1F389}","\u00a1Incre\u00edble! \u{1F680}","\u00a1Perfecto! \u2728","\u00a1Eres una estrella! \u2B50"],
    it:["Super campione! \u{1F3C6}","Sei forte! \u{1F31F}","Fantastico! \u{1F389}","Incredibile! \u{1F680}","Perfetto! \u2728","Sei una stella! \u2B50"],
    de:["Super Champion! \u{1F3C6}","Du rockst! \u{1F31F}","Genial! \u{1F389}","Unglaublich! \u{1F680}","Perfekt! \u2728","Du bist ein Star! \u2B50"],
    pt:["Super campe\u00e3o! \u{1F3C6}","Voc\u00ea \u00e9 incr\u00edvel! \u{1F31F}","Genial! \u{1F389}","Incr\u00edvel! \u{1F680}","Perfeito! \u2728","Voc\u00ea \u00e9 uma estrela! \u2B50"],
  },
  fails: {
    fr:["Presque ! R\u00e9essaie \u{1F4AA}","Courage ! \u{1F308}","Encore un effort ! \u{1F3AF}"],
    en:["Almost! Try again \u{1F4AA}","Keep going! \u{1F308}","One more try! \u{1F3AF}"],
    es:["\u00a1Casi! Int\u00e9ntalo de nuevo \u{1F4AA}","\u00a1\u00c1nimo! \u{1F308}","\u00a1Un esfuerzo m\u00e1s! \u{1F3AF}"],
    it:["Quasi! Riprova \u{1F4AA}","Coraggio! \u{1F308}","Ancora uno sforzo! \u{1F3AF}"],
    de:["Fast! Nochmal \u{1F4AA}","Weiter so! \u{1F308}","Noch ein Versuch! \u{1F3AF}"],
    pt:["Quase! Tente de novo \u{1F4AA}","Coragem! \u{1F308}","Mais um esfor\u00e7o! \u{1F3AF}"],
  },
};

function tr(key, lang) {
  const entry = T[key];
  if (!entry) return key;
  return entry[lang] ?? entry["fr"] ?? key;
}

// ── Audio engine (Web Audio API) ─────────────────────────────────
let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return _audioCtx;
}
function playTone({ freq=440, type="sine", duration=0.12, gain=0.18 }={}) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const vol = ctx.createGain();
    osc.connect(vol); vol.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    vol.gain.setValueAtTime(gain, ctx.currentTime);
    vol.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch(e) {}
}
function playSeq(notes) {
  notes.forEach(n => setTimeout(() => playTone(n), (n.delay ?? 0) * 1000));
}
const SFX = {
  jump:    () => playTone({ freq:520, type:"sine",     duration:0.15, gain:0.14 }),
  duck:    () => playTone({ freq:260, type:"sine",     duration:0.12, gain:0.11 }),
  crash:   () => playSeq([
    { freq:200, type:"sawtooth", duration:0.12, gain:0.20, delay:0   },
    { freq:150, type:"sawtooth", duration:0.14, gain:0.16, delay:0.1 },
    { freq:100, type:"sawtooth", duration:0.18, gain:0.12, delay:0.2 },
  ]),
  correct: () => playSeq([
    { freq:523, type:"sine", duration:0.1,  gain:0.16, delay:0   },
    { freq:659, type:"sine", duration:0.1,  gain:0.16, delay:0.1 },
    { freq:784, type:"sine", duration:0.18, gain:0.16, delay:0.2 },
  ]),
  wrong:   () => playSeq([
    { freq:330, type:"sine", duration:0.12, gain:0.14, delay:0    },
    { freq:220, type:"sine", duration:0.18, gain:0.14, delay:0.13 },
  ]),
  unlock:  () => playSeq([
    { freq:523,  type:"sine", duration:0.08, gain:0.18, delay:0    },
    { freq:659,  type:"sine", duration:0.08, gain:0.18, delay:0.09 },
    { freq:784,  type:"sine", duration:0.08, gain:0.18, delay:0.18 },
    { freq:1047, type:"sine", duration:0.2,  gain:0.18, delay:0.27 },
  ]),
  levelUp: () => playSeq([
    { freq:392, type:"sine", duration:0.1,  gain:0.16, delay:0    },
    { freq:523, type:"sine", duration:0.1,  gain:0.16, delay:0.11 },
    { freq:659, type:"sine", duration:0.1,  gain:0.16, delay:0.22 },
    { freq:784, type:"sine", duration:0.22, gain:0.16, delay:0.33 },
  ]),
};

// ── Haptic ────────────────────────────────────────────────────────
const HAP = {
  jump:  () => { try { navigator.vibrate?.([30]);       } catch(e){} },
  duck:  () => { try { navigator.vibrate?.([20]);       } catch(e){} },
  crash: () => { try { navigator.vibrate?.([80,30,80]); } catch(e){} },
};

const TOTAL_LEVELS = 100;

const PLANETS = [
  { name: "Etoile Brillante", color: "#FFD700", bg: "#1a0a3e", stars: "#fff"    },
  { name: "Planete Rose",     color: "#FF69B4", bg: "#200030", stars: "#FFD700" },
  { name: "Jungle Cosmique",  color: "#00E676", bg: "#071a07", stars: "#7FFF00" },
  { name: "Desert de Feu",    color: "#FF6D00", bg: "#1a0800", stars: "#FFD700" },
  { name: "Ocean Gele",       color: "#00B0FF", bg: "#001a2e", stars: "#E0F7FA" },
];

// each character: body color matched to the character
const CHARACTERS = [
  { n:"\u{1F680}", label:"Astronaute", color:"#CFD8DC" }, // combinaison gris clair
  { n:"\u{1F9DD}", label:"Elfe",       color:"#FF8C00" }, // orange
  { n:"\u{1F984}", label:"Licorne",    color:"#FFFFFF" }, // blanc
  { n:"\u{1F438}", label:"Grenouille", color:"#43A047" }, // vert grenouille
  { n:"\u{1F916}", label:"Robot",      color:"#78909C" }, // gris métal
  { n:"\u{1F98A}", label:"Renard",     color:"#E64A19" }, // orange renard
  { n:"\u{1F419}", label:"Pieuvre",    color:"#FF8C00" }, // orange
  { n:"\u26A1",    label:"Eclair",     color:"#F9A825" }, // jaune électrique
];
const CHAR_UNLOCK_COST = 10; // stars per character

const OBS_GROUND = ["\u{1F320}","\u{1F311}","\u{1F480}","\u{1FAA8}","\u{1F335}","\u{1F9B7}"];
const OBS_FLY    = ["\u{1F47E}","\u{1F300}","\u{1FA90}","\u{1F6F0}","\u{1F985}","\u{1F4AB}"];

// cheers and fails are now in T.cheers / T.fails (i18n)

const rand  = (a) => a[Math.floor(Math.random() * a.length)];
const randN = (mn, mx) => Math.floor(Math.random() * (mx - mn + 1)) + mn;


function makeQuestion(tables) {
  const a = rand(tables);
  const b = randN(1, 9);
  return { a, b, answer: a * b };
}

function makeChoices(answer) {
  const s = new Set([answer]);
  while (s.size < 4) {
    const v = answer + randN(-15, 15);
    if (v > 0 && v !== answer) s.add(v);
  }
  return [...s].sort(() => Math.random() - 0.5);
}


function Stars({ color }) {
  const pts = useRef(Array.from({ length: 32 }, () => ({
    x: Math.random() * 100, y: Math.random() * 100,
    r: Math.random() * 2.5 + 0.8, d: (Math.random() * 2 + 1).toFixed(1),
  }))).current;
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
      {pts.map((p, i) => (
        <div key={i} style={{
          position:"absolute", left:`${p.x}%`, top:`${p.y}%`,
          width:p.r, height:p.r, borderRadius:"50%", background:color, opacity:0.8,
          animation:`twinkle ${p.d}s ease-in-out infinite alternate`,
        }} />
      ))}
    </div>
  );
}

// ── Canvas game constants ─────────────────────────────────────────
const W_C      = 900;
const H_C      = 320;
const GROUND_Y = 235;
const CHAR_X   = 100;
const FLY_Y    = GROUND_Y - 80;

// Difficulty ramps gently — uses eased curve (ease-in) so early levels stay easy
function getDifficulty(level) {
  const t = Math.min((level - 1) / 99, 1);
  const e = t * t; // ease-in: slow start, faster ramp at end

  // Speed: flat 3.8 before lvl 25, linear 3.8→6.1 from lvl 25 to 75, flat 6.1 from lvl 75
  let speed;
  if (level < 25)       speed = 3.8;
  else if (level >= 75) speed = 6.1;
  else                  speed = 3.8 + ((level - 25) / 50) * (6.1 - 3.8);

  return {
    speed,
    obsCount: Math.round(4 + e * 6),       // 4 → 10
    spacing:  480 - Math.round(e * 200),   // 480 → 280
    flyRatio: 0.15 + e * 0.35,             // 15% → 50%
    jumpVY:  -23,
    gravity:  1.15,
  };
}


// ── Runner ────────────────────────────────────────────────────────
function Runner({ planet, charObj, level, onFinish, sfx = ()=>{}, hap = ()=>{} }) {
  const diff = getDifficulty(level);

  const canvasRef = useRef(null);
  const doneFired = useRef(false);
  const rafRef    = useRef(null);

  function makeLevelObstacles() {
    const { obsCount, spacing, flyRatio } = diff;
    const obs = [];
    for (let i = 0; i < obsCount; i++) {
      const fly = Math.random() < flyRatio;
      obs.push({
        id: i,
        x: 560 + i * spacing + randN(-25, 25),
        type: fly ? "fly" : "ground",
        emoji: fly ? rand(OBS_FLY) : rand(OBS_GROUND),
      });
    }
    return obs;
  }

  const S = useRef({
    charY: GROUND_Y, vy: 0, onGround: true, ducking: false,
    obstacles: null,  // initialized below
    progress: 0, done: false, crashed: false, crashTimer: 0,
  });
  // init obstacles once
  if (!S.current.obstacles) S.current.obstacles = makeLevelObstacles();

  const startDuck = useCallback(() => {
    if (!S.current.done) { S.current.ducking = true; sfx("duck"); hap("duck"); }
  }, [sfx, hap]);
  const endDuck   = useCallback(() => { S.current.ducking = false; }, []);
  const jump      = useCallback(() => {
    const s = S.current;
    if (s.onGround && !s.done && !s.ducking) { s.vy = diff.jumpVY; s.onGround = false; sfx("jump"); hap("jump"); }
  }, [diff.jumpVY, sfx, hap]);

  // keyboard
  useEffect(() => {
    const kd = (e) => {
      if (e.code === "Space"     || e.code === "ArrowUp")   { e.preventDefault(); jump();      }
      if (e.code === "ArrowDown" || e.code === "ShiftLeft") { e.preventDefault(); startDuck(); }
    };
    const ku = (e) => { if (e.code === "ArrowDown" || e.code === "ShiftLeft") endDuck(); };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup",   ku);
    return () => { window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
  }, [jump, startDuck, endDuck]);

  // game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const tick = () => {
      const s = S.current;

      if (!s.crashed && !s.done) {
        if (!s.ducking) {
          s.vy += diff.gravity; s.charY += s.vy;
          if (s.charY >= GROUND_Y) { s.charY = GROUND_Y; s.vy = 0; s.onGround = true; }
        } else {
          s.charY = GROUND_Y; s.vy = 0; s.onGround = true;
        }

        s.obstacles.forEach(o => { o.x -= diff.speed; });
        const passed = s.obstacles.filter(o => o.x < CHAR_X - 40).length;
        s.progress = Math.min(99, Math.round((passed / diff.obsCount) * 95));

        s.obstacles.forEach(o => {
          if (Math.abs(o.x - CHAR_X) > 36) return;
          if (o.type === "ground" && s.charY > GROUND_Y - 32) {
            s.crashed = true; s.crashTimer = 65; sfx("crash"); hap("crash");
          }
          if (o.type === "fly" && !s.ducking) {
            s.crashed = true; s.crashTimer = 65; sfx("crash"); hap("crash");
          }
        });

        if (s.obstacles.every(o => o.x < -60) && !doneFired.current) {
          s.progress = 100; s.done = true;
        }
      } else if (s.crashed) {
        s.crashTimer--;
        if (s.crashTimer <= 0) {
          s.crashed = false; s.charY = GROUND_Y; s.vy = 0;
          s.onGround = true; s.ducking = false;
          s.obstacles = makeLevelObstacles(); s.progress = 0;
        }
      }

      // ── draw ──
      const W = W_C, H = H_C;
      ctx.clearRect(0, 0, W, H);

      // background
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, planet.bg + "ff");
      sky.addColorStop(1, planet.bg + "cc");
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

      // ground
      ctx.save();
      ctx.shadowBlur = 16; ctx.shadowColor = planet.color;
      ctx.strokeStyle = planet.color; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(0, GROUND_Y + 40); ctx.lineTo(W, GROUND_Y + 40); ctx.stroke();
      ctx.restore();

      // finish flag
      ctx.font = "40px serif"; ctx.fillText("\u{1F3C1}", W - 64, GROUND_Y + 18);



      // ── character ──
      const frame  = Math.floor(Date.now() / 150) % 2;
      const cc     = charObj.color;
      const feet   = s.charY + 40;
      const EHEAD  = 36;
      const legLen = 24, bodyH = 22, bodyW = 20;

      ctx.save();

      if (s.crashed) {
        ctx.font = "48px serif"; ctx.textAlign = "center";
        ctx.fillText("\u{1F4A5}", CHAR_X, feet - 10);

      } else if (s.ducking) {
        const by = feet - 12;
        // legs flat
        ctx.strokeStyle = cc; ctx.lineWidth = 8; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(CHAR_X - 6, by + 4); ctx.lineTo(CHAR_X - 28, by + 6); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(CHAR_X - 6, by + 4); ctx.lineTo(CHAR_X + 14, by + 6); ctx.stroke();
        // body
        ctx.fillStyle = cc;
        ctx.beginPath(); ctx.roundRect(CHAR_X - 24, by - 10, 38, 18, 8); ctx.fill();
        // arms
        ctx.strokeStyle = cc; ctx.lineWidth = 7;
        ctx.beginPath(); ctx.moveTo(CHAR_X + 10, by - 4); ctx.lineTo(CHAR_X + 28, by - 14); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(CHAR_X + 10, by + 4);  ctx.lineTo(CHAR_X + 28, by + 10);  ctx.stroke();
        // emoji head
        ctx.font = EHEAD + "px serif"; ctx.textAlign = "center";
        if (charObj.n === "\u{1F984}") {
          ctx.save(); ctx.scale(-1, 1);
          ctx.fillText(charObj.n, -(CHAR_X + 8), by + 6);
          ctx.restore();
        } else {
          ctx.fillText(charObj.n, CHAR_X + 8, by + 6);
        }

      } else {
        const airborne = !s.onGround;
        const bodyBot  = feet - legLen;
        const bodyTop  = bodyBot - bodyH;
        const swing    = airborne ? 16 : (frame === 0 ? 18 : -18);

        // LEGS
        ctx.strokeStyle = cc; ctx.lineWidth = 8; ctx.lineCap = "round";
        if (airborne) {
          ctx.beginPath(); ctx.moveTo(CHAR_X - 5, bodyBot);
          ctx.lineTo(CHAR_X - 16, bodyBot + 12); ctx.lineTo(CHAR_X - 6, bodyBot + 22); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(CHAR_X + 5, bodyBot);
          ctx.lineTo(CHAR_X + 16, bodyBot + 12); ctx.lineTo(CHAR_X + 6, bodyBot + 22); ctx.stroke();
        } else {
          ctx.beginPath(); ctx.moveTo(CHAR_X - 4, bodyBot);
          ctx.lineTo(CHAR_X - 4 - swing * 0.45, bodyBot + 14); ctx.lineTo(CHAR_X - swing * 0.75, feet); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(CHAR_X + 4, bodyBot);
          ctx.lineTo(CHAR_X + 4 + swing * 0.45, bodyBot + 14); ctx.lineTo(CHAR_X + swing * 0.75, feet); ctx.stroke();
        }

        // BODY
        ctx.fillStyle = cc;
        ctx.beginPath(); ctx.roundRect(CHAR_X - bodyW / 2, bodyTop, bodyW, bodyH, 7); ctx.fill();

        // ARMS
        ctx.strokeStyle = cc; ctx.lineWidth = 7; ctx.lineCap = "round";
        if (airborne) {
          ctx.beginPath(); ctx.moveTo(CHAR_X - 9, bodyTop + 5); ctx.lineTo(CHAR_X - 24, bodyTop - 6); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(CHAR_X + 9, bodyTop + 5); ctx.lineTo(CHAR_X + 24, bodyTop - 6); ctx.stroke();
        } else {
          ctx.beginPath(); ctx.moveTo(CHAR_X - 9, bodyTop + 5);
          ctx.lineTo(CHAR_X - 9 + swing * 0.55, bodyTop + 18); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(CHAR_X + 9, bodyTop + 5);
          ctx.lineTo(CHAR_X + 9 - swing * 0.55, bodyTop + 18); ctx.stroke();
        }

        // EMOJI HEAD
        ctx.font = EHEAD + "px serif"; ctx.textAlign = "center";
        if (charObj.n === "\u{1F984}") {
          // Licorne : flip horizontally so it faces forward
          ctx.save();
          ctx.scale(-1, 1);
          ctx.fillText(charObj.n, -CHAR_X, bodyTop - 2);
          ctx.restore();
        } else {
          ctx.fillText(charObj.n, CHAR_X, bodyTop - 2);
        }
        ctx.textAlign = "left";
      }

      ctx.restore();

      // obstacles
      ctx.textAlign = "left";
      s.obstacles.forEach(o => {
        if (o.x < -60 || o.x > W + 30) return;
        ctx.font = "42px serif";
        ctx.textAlign = "left";
        if (o.type === "ground") {
          ctx.fillText(o.emoji, o.x - 20, GROUND_Y + 20);
        } else {
          ctx.fillText(o.emoji, o.x - 20, FLY_Y + 18);
        }
      });

      // progress bar
      ctx.fillStyle = "#ffffff1a"; ctx.fillRect(16, 12, W - 32, 14);
      ctx.fillStyle = planet.color; ctx.fillRect(16, 12, (W - 32) * (s.progress / 100), 14);
      ctx.fillStyle = "#ffffffcc"; ctx.font = "bold 13px Nunito, sans-serif";
      ctx.fillText(s.progress + "% \u{1F3C1}", W - 76, 26);

      if (s.done && !doneFired.current) {
        doneFired.current = true;
        cancelAnimationFrame(rafRef.current);
        setTimeout(onFinish, 350);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [planet, charObj, onFinish]);

  const btnBase = {
    flex: 1, fontSize: 36, border: "none", borderRadius: 16,
    cursor: "pointer", userSelect: "none", touchAction: "none",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 900, transition: "filter 0.1s",
  };

  return (
    <div style={{ width:"100%" }}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={W_C} height={H_C}
        style={{ width:"100%", height:"auto", aspectRatio:`${W_C}/${H_C}`, borderRadius:14, display:"block" }}
      />

      {/* Control buttons — big arrow buttons below the canvas */}
      <div style={{ display:"flex", gap:12, marginTop:10, height:80 }}>

        {/* JUMP button ↑ */}
        <button
          onPointerDown={(e) => { e.preventDefault(); jump(); }}
          style={{ ...btnBase, background:`linear-gradient(135deg, ${planet.color}cc, ${planet.color}66)`, color:"#1a0a3e", boxShadow:`0 4px 20px ${planet.color}55` }}
        >
          &#x2191;
        </button>

        {/* DUCK button ↓ */}
        <button
          onPointerDown={(e) => { e.preventDefault(); startDuck(); }}
          onPointerUp={(e)   => { e.preventDefault(); endDuck();   }}
          onPointerLeave={(e)=> { e.preventDefault(); endDuck();   }}
          style={{ ...btnBase, background:"linear-gradient(135deg,#FF69B4cc,#FF69B466)", color:"#fff", boxShadow:"0 4px 20px #FF69B455" }}
        >
          &#x2193;
        </button>

      </div>
    </div>
  );
}

// ── Question ──────────────────────────────────────────────────────
function Question({ question, planet, onResult, lang="fr" }) {
  const [choices]  = useState(() => makeChoices(question.answer));
  const [picked,   setPicked]  = useState(null);
  const [feedback, setFeedback] = useState(null);

  const pick = (c) => {
    if (picked !== null) return;
    setPicked(c);
    const ok = c === question.answer;
    setFeedback(ok ? "ok" : "ko");
    setTimeout(() => onResult(ok), 950);
  };

  return (
    <div style={{ textAlign:"center", padding:"8px 0" }}>
      <div style={{ fontSize:15, color:"#ffffffaa", marginBottom:6 }}>Combien font...</div>
      <div style={{
        fontSize:54, fontWeight:900, color:planet.color,
        textShadow:`0 0 24px ${planet.color}88`,
        margin:"4px 0 18px", animation:"pulse 1.2s ease-in-out infinite",
      }}>
        {question.a} x {question.b} = ?
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {choices.map((c, i) => {
          let bg = "#ffffff14", border = "#ffffff30";
          if (picked !== null) {
            if (c === question.answer)                 { bg="#00C85333"; border="#00C853"; }
            if (c === picked && c !== question.answer) { bg="#FF174433"; border="#FF1744"; }
          }
          return (
            <button key={i} onClick={() => pick(c)} style={{
              padding:"15px 8px", fontSize:26, fontWeight:900,
              background:bg, border:`2px solid ${border}`, borderRadius:14,
              color:"#fff", cursor:"pointer", transition:"all 0.15s",
            }}>
              {c}
            </button>
          );
        })}
      </div>
      {feedback && (
        <div style={{ marginTop:14, animation:"bounceIn 0.3s ease" }}>
          {feedback === "ok" ? (
            <div style={{ fontSize:22, fontWeight:900, color:"#00C853" }}>
              {T.cheers[lang]?.[Math.floor(Math.random()*T.cheers[lang].length)] ?? T.cheers.fr[0]}
            </div>
          ) : (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:18, fontWeight:900, color:"#FF5252" }}>
                {T.fails[lang]?.[Math.floor(Math.random()*T.fails[lang].length)] ?? T.fails.fr[0]}
              </div>
              <div style={{ marginTop:6, fontSize:20, fontWeight:900, color:"#FFD700", background:"#FFD70022", borderRadius:10, padding:"6px 14px", display:"inline-block" }}>
                {tr("answerWas", lang)} : {question.a} × {question.b} = {question.answer}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Level complete ────────────────────────────────────────────────
function LevelDone({ level, correct, totalStars, newUnlock, onNext, lang="fr", unlockedChars=[] }) {
  return (
    <div style={{ textAlign:"center", padding:"16px 0" }}>
      <div style={{ fontSize:64, animation:"spin 0.7s ease" }}>{"\u{1F3C6}"}</div>
      <div style={{ fontSize:26, fontWeight:900, color:"#FFD700", margin:"10px 0 4px" }}>{tr("levelWord",lang)} {level} {tr("finished",lang)}</div>

      {/* Star earned */}
      {correct ? (
        <div style={{ fontSize:18, color:"#FFD700", margin:"8px 0", fontWeight:700 }}>
          +1 {"\u2B50"} &nbsp;—&nbsp; Total : {totalStars} {"\u2B50"}
        </div>
      ) : (
        <div style={{ fontSize:15, color:"#ffffff77", margin:"8px 0" }}>
          Mauvaise reponse — pas d'etoile cette fois {"\u{1F62C}"}
        </div>
      )}

      {/* Progress bar toward next character */}
      {(() => {
        const nextIdx = CHARACTERS.findIndex((_, i) => i > 0 && !unlockedChars.includes(i));
        if (nextIdx === -1) return null;
        const progress = Math.min(totalStars % CHAR_UNLOCK_COST, CHAR_UNLOCK_COST);
        return (
          <div style={{ margin:"10px 16px", textAlign:"left" }}>
            <div style={{ fontSize:12, color:"#ffffff77", marginBottom:4, display:"flex", justifyContent:"space-between" }}>
              <span>{tr("nextChar",lang)} : {CHARACTERS[nextIdx].n} {CHARACTERS[nextIdx].label}</span>
              <span>{totalStars % CHAR_UNLOCK_COST}/{CHAR_UNLOCK_COST} {"\u2B50"}</span>
            </div>
            <div style={{ background:"#ffffff22", borderRadius:8, height:10 }}>
              <div style={{ width:`${(progress / CHAR_UNLOCK_COST) * 100}%`, background:"#FFD700", height:"100%", borderRadius:8, transition:"width 0.5s" }} />
            </div>
          </div>
        );
      })()}

      {/* New character unlocked! */}
      {newUnlock && (
        <div style={{
          margin:"12px 16px", padding:"12px", borderRadius:14,
          background:"linear-gradient(135deg,#FFD70033,#FF6D0022)",
          border:"2px solid #FFD700", animation:"bounceIn 0.4s ease",
        }}>
          <div style={{ fontSize:40 }}>{newUnlock.n}</div>
          <div style={{ fontSize:16, fontWeight:900, color:"#FFD700" }}>{tr("newHero",lang)}</div>
          <div style={{ fontSize:13, color:"#ffffff99" }}>{newUnlock.label} {tr("unlockedMsg",lang)}</div>
        </div>
      )}

      <button onClick={onNext} style={{
        marginTop:14, padding:"14px 40px", fontSize:19, fontWeight:900,
        background: correct
          ? "linear-gradient(135deg,#FFD700,#FF6D00)"
          : "linear-gradient(135deg,#4FC3F7,#0288D1)",
        border:"none", borderRadius:50, color:"#1a0a3e", cursor:"pointer",
        boxShadow: correct ? "0 4px 20px #FFD70066" : "0 4px 20px #4FC3F766",
      }}>
        {correct ? tr("nextLevel",lang) : tr("retry",lang)}
      </button>
    </div>
  );
}

// ── Table picker ──────────────────────────────────────────────────
function TablePicker({ selected, unlocked, onToggle }) {
  return (
    <div>
      <div style={{ fontSize:15, fontWeight:900, color:"#FFD700", textAlign:"center", marginBottom:10 }}>
        Mes tables a reviser
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
        {[1,2,3,4,5,6,7,8,9].map(n => {
          const isU = unlocked.includes(n), isS = selected.includes(n);
          return (
            <button key={n} onClick={() => onToggle(n)} style={{
              padding:"12px 4px", fontSize:17, fontWeight:900,
              background: isS ? "#FFD70022" : "#ffffff11",
              border:`2px solid ${isS ? "#FFD700" : "#ffffff22"}`,
              borderRadius:12, color: isU ? "#fff" : "#ffffff44",
              cursor: isU ? "pointer" : "not-allowed", position:"relative",
            }}>
              x{n}
              {!isU && <span style={{ position:"absolute", top:2, right:4, fontSize:11 }}>{"\u{1F512}"}</span>}
            </button>
          );
        })}
      </div>
      {[4,5,6,7,8,9].some(n => !unlocked.includes(n)) && (
        <div style={{ marginTop:10, padding:"8px 12px", background:"#FFD70011", border:"1px solid #FFD70033", borderRadius:10, fontSize:12, color:"#FFD700", textAlign:"center" }}>
          Débloquer les tables 4-9 avec le Pass MultiPlanet dans le magasin
        </div>
      )}
    </div>
  );
}

// ── Shop ──────────────────────────────────────────────────────────
function Shop({ onClose, onBuy, unlocked=[] }) {
  const passBought = unlocked.length >= 9;
  return (
    <div style={{ position:"fixed", inset:0, background:"#000000cc", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"linear-gradient(135deg,#1a0a3e,#0d1a4e)", border:"2px solid #FFD700", borderRadius:20, padding:24, maxWidth:320, width:"100%", boxShadow:"0 0 40px #FFD70044" }}>
        <div style={{ textAlign:"center", marginBottom:14 }}>
          <div style={{ fontSize:52 }}>{"\u{1F31F}"}</div>
          <div style={{ fontSize:22, fontWeight:900, color:"#FFD700" }}>Pass MultiPlanet</div>
          <div style={{ fontSize:13, color:"#ffffff99", marginTop:4 }}>Toutes les tables débloquées !</div>
        </div>
        {["Tables x4 a x9","100 niveaux complets","Personnages bonus","Mondes secrets"].map((f,i)=>(
          <div key={i} style={{ display:"flex", gap:8, alignItems:"center", color:"#fff", fontSize:14, marginBottom:7 }}>
            <span style={{ color:"#00C853", fontSize:16 }}>{"\u2713"}</span>{f}
          </div>
        ))}
        <div style={{ textAlign:"center", margin:"14px 0 4px", fontSize:30, fontWeight:900, color:"#FFD700" }}>2,99 EUR</div>
        <div style={{ fontSize:11, color:"#ffffff55", textAlign:"center", marginBottom:12 }}>Achat unique - Pas d'abonnement</div>
        <div style={{ fontSize:11, color:"#FFD70099", background:"#FFD70011", border:"1px solid #FFD70033", borderRadius:8, padding:"8px 10px", marginBottom:14, lineHeight:1.6, textAlign:"center" }}>
          Achat intégré. L’accord d’un parent ou tuteur légal est requis.
        </div>
        <button onClick={passBought ? undefined : onBuy} style={{ width:"100%", padding:14, fontSize:17, fontWeight:900, background: passBought ? "#ffffff22" : "linear-gradient(135deg,#FFD700,#FF6D00)", border:"none", borderRadius:50, color: passBought ? "#ffffff44" : "#1a0a3e", cursor: passBought ? "not-allowed" : "pointer", marginBottom:8 }}>
          {passBought ? "Déjà acheté ✓" : "Acheter !"}
        </button>
        <button onClick={onClose} style={{ width:"100%", padding:10, fontSize:14, background:"transparent", border:"1px solid #ffffff33", borderRadius:50, color:"#ffffff77", cursor:"pointer" }}>
          Pas maintenant
        </button>
      </div>
    </div>
  );
}

// ── Skip Quiz : 2 multiplications pour passer le niveau ──────────
function SkipQuiz({ tables, planet, onDone, lang="fr" }) {
  const [step,      setStep]     = useState(0);       // 0 or 1
  const [q,         setQ]        = useState(() => makeQuestion(tables));
  const [choices,   setChoices]  = useState(() => makeChoices(makeQuestion(tables).answer));
  const [results,   setResults]  = useState([]);      // true/false per step
  const [picked,    setPicked]   = useState(null);
  const [feedback,  setFeedback] = useState(null);

  // fresh question when step changes
  useEffect(() => {
    const nq = makeQuestion(tables);
    setQ(nq);
    setChoices(makeChoices(nq.answer));
    setPicked(null);
    setFeedback(null);
  }, [step]);

  const pick = (c) => {
    if (picked !== null) return;
    setPicked(c);
    const ok = c === q.answer;
    setFeedback(ok);
    setTimeout(() => {
      if (!ok) {
        onDone(false); // faux → retour au jeu
      } else if (step < 1) {
        setResults([true]);
        setStep(1);
      } else {
        onDone(true); // les 2 bonnes → niveau passé + étoile
      }
    }, 1100);
  };

  return (
    <div style={{ padding:"8px 0", textAlign:"center" }}>
      <div style={{ fontSize:13, color:"#ffffff77", marginBottom:4 }}>
        {tr("skipQ",lang)} {step + 1} / 2 — {tr("skipHint",lang)}
      </div>
      {/* stepper dots */}
      <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:14 }}>
        {[0,1].map(i => (
          <div key={i} style={{
            width:12, height:12, borderRadius:"50%",
            background: i < step ? "#00C853" : i === step ? planet.color : "#ffffff33",
            transition:"background 0.3s",
          }} />
        ))}
      </div>

      <div style={{
        fontSize:50, fontWeight:900, color:planet.color,
        textShadow:`0 0 20px ${planet.color}88`,
        margin:"4px 0 18px", animation:"pulse 1.2s ease-in-out infinite",
      }}>
        {q.a} x {q.b} = ?
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {choices.map((c, i) => {
          let bg = "#ffffff14", border = "#ffffff30";
          if (picked !== null) {
            if (c === q.answer)                 { bg="#00C85333"; border="#00C853"; }
            if (c === picked && c !== q.answer) { bg="#FF174433"; border="#FF1744"; }
          }
          return (
            <button key={i} onClick={() => pick(c)} style={{
              padding:"14px 8px", fontSize:26, fontWeight:900,
              background:bg, border:`2px solid ${border}`, borderRadius:14,
              color:"#fff", cursor:"pointer", transition:"all 0.15s",
            }}>{c}</button>
          );
        })}
      </div>

      {feedback !== null && (
        <div style={{ marginTop:12, animation:"bounceIn 0.3s ease" }}>
          {feedback ? (
            <div style={{ fontSize:20, fontWeight:900, color:"#00C853" }}>
              {step < 1 ? tr("skipRight1",lang) : ""}
            </div>
          ) : (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:17, fontWeight:900, color:"#FF5252" }}>{tr("skipWrong",lang)}</div>
              <div style={{ marginTop:6, fontSize:19, fontWeight:900, color:"#FFD700", background:"#FFD70022", borderRadius:10, padding:"5px 12px", display:"inline-block" }}>
                {tr("answerWas",lang)} : {q.a} × {q.b} = {q.answer}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// ── Settings modal ────────────────────────────────────────────────
function Settings({ soundOn, setSoundOn, hapticOn, setHapticOn, lang, setLang, onClose, onReset }) {
  const [confirmReset, setConfirmReset] = useState(false);

  const Toggle = ({ value, onChange, label }) => (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #ffffff11" }}>
      <span style={{ fontSize:15, color:"#ffffffcc" }}>{label}</span>
      <div onClick={() => onChange(!value)} style={{
        width:46, height:26, borderRadius:13, cursor:"pointer", position:"relative",
        background: value ? "#00C853" : "#ffffff22", transition:"background 0.2s",
      }}>
        <div style={{
          position:"absolute", top:3, left: value ? 22 : 2,
          width:20, height:20, borderRadius:"50%", background:"#fff",
          transition:"left 0.2s", boxShadow:"0 1px 4px #0004",
        }} />
      </div>
    </div>
  );

  return (
    <div style={{ position:"fixed", inset:0, background:"#000000cc", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"linear-gradient(135deg,#1a0a3e,#0d1a4e)", border:"2px solid #ffffff33", borderRadius:20, padding:24, maxWidth:320, width:"100%", boxShadow:"0 0 40px #0008" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <div style={{ fontSize:20, fontWeight:900, color:"#fff" }}>
            {"\u2699\uFE0F"} {tr("settings", lang)}
          </div>
          <button onClick={onClose} style={{ background:"#ffffff22", border:"none", borderRadius:50, width:32, height:32, color:"#fff", fontSize:18, cursor:"pointer", lineHeight:"32px" }}>✕</button>
        </div>

        <Toggle value={soundOn}  onChange={setSoundOn}  label={"\u{1F50A} " + tr("sound",lang)} />
        <Toggle value={hapticOn} onChange={setHapticOn} label={"\u{1F4F3} " + tr("vibration",lang)} />

        <div style={{ marginTop:14, paddingBottom:14, borderBottom:"1px solid #ffffff11" }}>
          <div style={{ fontSize:13, color:"#ffffff77", marginBottom:8 }}>{"\u{1F310} "}{tr("language",lang)}</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {LANGS.map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding:"6px 12px", fontSize:13, fontWeight:700, borderRadius:20, cursor:"pointer",
                background: lang===l ? "#FFD70033" : "#ffffff11",
                border: `2px solid ${lang===l ? "#FFD700" : "#ffffff22"}`,
                color: lang===l ? "#FFD700" : "#ffffff88",
              }}>{LANG_LABELS[l]}</button>
            ))}
          </div>
        </div>

        {/* Reset progress */}
        <div style={{ marginTop:14 }}>
          {!confirmReset ? (
            <button onClick={() => setConfirmReset(true)} style={{
              width:"100%", padding:"10px", fontSize:13, fontWeight:700,
              background:"#FF174411", border:"1px solid #FF174444",
              borderRadius:12, color:"#FF7043", cursor:"pointer",
            }}>
              {"\u{1F504}"} {tr("resetBtn", lang)}
            </button>
          ) : (
            <div style={{ background:"#FF174411", border:"1px solid #FF174444", borderRadius:12, padding:12 }}>
              <div style={{ fontSize:12, color:"#FFB74D", marginBottom:10, lineHeight:1.5 }}>
                {tr("resetConfirm", lang)}
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => { onReset(); setConfirmReset(false); onClose(); }} style={{
                  flex:1, padding:"8px", fontSize:13, fontWeight:900,
                  background:"#FF1744", border:"none", borderRadius:10,
                  color:"#fff", cursor:"pointer",
                }}>
                  {tr("resetYes", lang)}
                </button>
                <button onClick={() => setConfirmReset(false)} style={{
                  flex:1, padding:"8px", fontSize:13, fontWeight:700,
                  background:"#ffffff22", border:"none", borderRadius:10,
                  color:"#fff", cursor:"pointer",
                }}>
                  {tr("resetNo", lang)}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ── APP ───────────────────────────────────────────────────────────
const SAVE_KEY = "multiplanet-save";

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return null;
}

function writeSave(data) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch(e) {}
}

export default function App() {
  const saved = useRef(loadSave());
  const s0    = saved.current;

  const [screen,        setScreen]       = useState("home");
  const [level,         setLevel]        = useState(s0?.level        ?? 1);
  const [tables,        setTables]       = useState(s0?.tables       ?? [1, 2]);
  const [unlocked,      setUnlocked]     = useState(s0?.unlocked     ?? [1, 2, 3]);
  const [heroIdx,       setHeroIdx]      = useState(s0?.heroIdx      ?? 0);
  const [question,      setQuestion]     = useState(null);
  const [correct,       setCorrect]      = useState(false);
  const [totalStars,    setTotalStars]   = useState(s0?.totalStars   ?? 0);
  const [unlockedChars, setUnlockedChars]= useState(s0?.unlockedChars ?? [0]);
  const [newUnlock,     setNewUnlock]    = useState(null);
  const [shop,          setShop]         = useState(false);
  const [soundOn,       setSoundOn]      = useState(s0?.soundOn      ?? true);
  const [hapticOn,      setHapticOn]     = useState(s0?.hapticOn     ?? true);
  const [lang,          setLang]         = useState(s0?.lang         ?? "fr");
  const [showSettings,  setShowSettings] = useState(false);

  // helpers that respect user prefs
  const sfx = useCallback((name) => { if (soundOn)  SFX[name]?.(); }, [soundOn]);
  const hap = useCallback((name) => { if (hapticOn) HAP[name]?.(); }, [hapticOn]);

  // Save to localStorage whenever key state changes
  useEffect(() => {
    writeSave({ level, tables, unlocked, heroIdx, totalStars, unlockedChars, soundOn, hapticOn, lang });
  }, [level, tables, unlocked, heroIdx, totalStars, unlockedChars, soundOn, hapticOn, lang]);

  const planet    = PLANETS[(level - 1) % PLANETS.length];
  const charObj   = CHARACTERS[heroIdx];
  const useTabs   = tables.filter(t => unlocked.includes(t));
  const activeTabs = useTabs.length > 0 ? useTabs : [1];

  const toggleTable = (n) => {
    if (!unlocked.includes(n)) { setShop(true); return; }
    setTables(prev => prev.includes(n) ? (prev.length > 1 ? prev.filter(x => x !== n) : prev) : [...prev, n]);
  };

  const handleRunFinish = useCallback(() => {
    setQuestion(makeQuestion(activeTabs));
    setScreen("quiz");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, activeTabs.join(",")]);

  const handleAnswer = (ok) => {
    setCorrect(ok);
    if (ok) {
      sfx("correct");
      setTotalStars(prev => {
        const next = prev + 1;
        setNewUnlock(null);
        return next;
      });
      setTimeout(() => { sfx("levelUp"); setScreen("done"); }, 950);
    } else {
      sfx("wrong");
      setNewUnlock(null);
      setTimeout(() => setScreen("run"), 950);
    }
  };

  const handleSkipDone = (bothCorrect) => {
    if (!bothCorrect) {
      sfx("wrong");
      setScreen("run");
      return;
    }
    sfx("correct");
    setNewUnlock(null);
    setCorrect(true);
    setTotalStars(prev => {
      const next = prev + 1;

      return next;
    });
    setTimeout(() => sfx("levelUp"), 200);
    setScreen("done");
  };

  const handleReset = () => {
    const passOwned = unlocked.length >= 9; // pass was bought if all tables unlocked
    setLevel(1);
    setTotalStars(0);
    setUnlockedChars([0]);
    setHeroIdx(0);
    setTables([1, 2]);
    if (!passOwned) setUnlocked([1, 2, 3]);
    setScreen("home");
  };

  const handleNext = () => {
    if (correct) {
      setLevel(l => (l < TOTAL_LEVELS ? l + 1 : 1));
    }
    setScreen("run");
  };

  // game screen uses landscape layout
  const isGame = screen === "run";

  return (
    <div style={{
      minHeight:"100vh", background:planet.bg,
      fontFamily:"'Nunito', sans-serif",
      display:"flex", flexDirection:"column", alignItems:"center",
      position:"relative", overflowX:"hidden",
    }}>
      <style>{`
        @keyframes twinkle  { from{opacity:.3;transform:scale(.8)} to{opacity:1;transform:scale(1.3)} }
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes pulse    { 0%,100%{transform:scale(1)} 50%{transform:scale(1.07)} }
        @keyframes spin     { from{transform:rotate(0deg) scale(.4);opacity:0} to{transform:rotate(360deg) scale(1);opacity:1} }
        @keyframes bounceIn { from{transform:scale(.4);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes slideUp  { from{transform:translateY(30px);opacity:0} to{transform:translateY(0);opacity:1} }
        button:active { filter: brightness(0.85); }
      `}</style>

      <Stars color={planet.stars} />

      {/* ── GAME SCREEN (landscape, full width) ── */}
      {isGame && (
        <div style={{ position:"relative", zIndex:10, width:"100%", maxWidth:960, padding:"10px 12px 80px", animation:"slideUp .3s ease" }}>
          {/* game header */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
            <button onClick={() => setScreen("home")} style={{ background:"#ffffff22", border:"none", borderRadius:20, padding:"5px 14px", color:"#fff", cursor:"pointer", fontSize:15 }}>
              {"<"} Accueil
            </button>
            <div style={{ fontSize:16, fontWeight:900, color:planet.color, textShadow:`0 0 10px ${planet.color}` }}>
              {planet.name} — Niveau {level}
            </div>
            <div style={{ color:"#FFD700", fontSize:14, fontWeight:700 }}>{"\u2B50"} {totalStars}</div>
          </div>

          <div style={{ background:"#ffffff0d", borderRadius:18, padding:12, border:`1px solid ${planet.color}33` }}>
            {(() => {
              const d = getDifficulty(level);
              const label = level <= 10 ? "Facile" : level <= 25 ? "Normal" : level <= 50 ? "Difficile" : level <= 75 ? "Intense" : "Extreme";
              const labelColor = level <= 10 ? "#00C853" : level <= 25 ? "#FFD700" : level <= 50 ? "#FF8A65" : level <= 75 ? "#FF5252" : "#FF1744";
              return (
                <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:8, fontSize:12, color:"#ffffff88" }}>
                  <span style={{ color:labelColor, fontWeight:900, fontSize:13 }}>{label}</span>
                  <span>Vitesse : {d.speed.toFixed(1)}</span>
                  <span>Obstacles : {d.obsCount}</span>
                  <span>Vol : {Math.round(d.flyRatio * 100)}%</span>
                </div>
              );
            })()}
            <Runner key={`run-${level}`} planet={planet} charObj={charObj} level={level} onFinish={handleRunFinish} sfx={sfx} hap={hap} />
          </div>

          <div style={{ textAlign:"center", marginTop:8, fontSize:13, color:"#ffffff55" }}>
            {tr("jumpHint",lang)} | {tr("duckHint",lang)}
          </div>

          {/* Skip button */}
          <div style={{ textAlign:"center", marginTop:10 }}>
            <button onClick={() => setScreen("skip")} style={{
              padding:"8px 22px", fontSize:13, fontWeight:700,
              background:"#ffffff11", border:"1px solid #ffffff33",
              borderRadius:50, color:"#ffffff88", cursor:"pointer",
            }}>
              {tr("skipBtn",lang)}
            </button>
          </div>
        </div>
      )}

      {/* ── SKIP MODAL (overlay above game) ── */}
      {screen === "skip" && (
        <div style={{ position:"fixed", inset:0, zIndex:150, background:"#000000bb", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div style={{ background:"linear-gradient(135deg,#1a0a3e,#0d1a4e)", border:`2px solid ${planet.color}`, borderRadius:20, padding:24, width:"100%", maxWidth:360, boxShadow:`0 0 40px ${planet.color}44`, animation:"slideUp .25s ease" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <div style={{ fontSize:16, fontWeight:900, color:planet.color }}>{tr("skipTitle",lang)} {level}</div>
              <button onClick={() => setScreen("run")} style={{ background:"#ffffff22", border:"none", borderRadius:50, width:30, height:30, color:"#fff", fontSize:16, cursor:"pointer", lineHeight:"30px" }}>✕</button>
            </div>
            <SkipQuiz tables={activeTabs} planet={planet} onDone={handleSkipDone} lang={lang} />
          </div>
        </div>
      )}

      {/* ── ALL OTHER SCREENS (portrait, centered) ── */}
      {!isGame && (
        <div style={{ position:"relative", zIndex:10, width:"100%", maxWidth:420, flex:1, paddingBottom:70, animation:"slideUp .3s ease" }}>
          {/* header */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px 6px" }}>
            {screen !== "home"
              ? <button onClick={() => setScreen("home")} style={{ background:"#ffffff22", border:"none", borderRadius:20, padding:"5px 12px", color:"#fff", cursor:"pointer", fontSize:15 }}>{"<"} Accueil</button>
              : <div />}
            <div style={{ fontSize:18, fontWeight:900, color:planet.color, textShadow:`0 0 12px ${planet.color}` }}>MultiPlanet</div>
            <div style={{ color:"#FFD700", fontSize:13, fontWeight:700 }}>{"\u2B50"} {totalStars}</div>
          </div>

          <div style={{ padding:"0 14px" }}>

            {/* HOME */}
            {screen === "home" && (
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:90, margin:"12px 0 4px", animation:"float 3s ease-in-out infinite" }}>{charObj.n}</div>
                <div style={{ fontSize:28, fontWeight:900, color:"#fff", textShadow:`0 0 18px ${planet.color}`, marginBottom:2 }}>MultiPlanet</div>
                <div style={{ fontSize:14, color:"#ffffff77", marginBottom:18 }}>{tr("appSubtitle",lang)}</div>

                <div style={{ background:"#ffffff0d", borderRadius:16, padding:12, marginBottom:12, border:`1px solid ${planet.color}33` }}>
                  <div style={{ fontSize:13, color:"#ffffff77", marginBottom:8 }}>{tr("myHero",lang)}</div>
                  <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
                    {CHARACTERS.map((c, i) => {
                      const isUnlocked = unlockedChars.includes(i);
                      const isSelected = heroIdx === i;
                      const cost = i === 0 ? 0 : CHAR_UNLOCK_COST;
                      const canAfford = totalStars >= cost;
                      return (
                        <button key={i} onClick={() => {
                          if (isUnlocked) { setHeroIdx(i); }
                          else if (canAfford) {
                            setTotalStars(s => s - cost);
                            setUnlockedChars(u => [...u, i]);
                            setHeroIdx(i);
                          }
                        }} style={{
                          background: isSelected ? `${c.color}44` : isUnlocked ? "#ffffff11" : "#ffffff08",
                          border:`2px solid ${isSelected ? c.color : isUnlocked ? "#ffffff22" : "#ffffff11"}`,
                          borderRadius:10, padding:"6px 8px", cursor: isUnlocked || canAfford ? "pointer" : "not-allowed",
                          display:"flex", flexDirection:"column", alignItems:"center", gap:2,
                          position:"relative", opacity: !isUnlocked && !canAfford ? 0.5 : 1,
                        }}>
                          <span style={{ fontSize:28, filter: isUnlocked ? "none" : "grayscale(0.6)" }}>{c.n}</span>
                          {isUnlocked ? (
                            <span style={{ fontSize:10, color: isSelected ? c.color : "#ffffff66", fontWeight:700 }}>{c.label}</span>
                          ) : (
                            <span style={{ fontSize:10, color: canAfford ? "#FFD700" : "#ffffff44", fontWeight:700 }}>
                              {CHAR_UNLOCK_COST}{"\u2B50"}
                            </span>
                          )}
                          {!isUnlocked && (
                            <span style={{ position:"absolute", top:2, right:4, fontSize:11 }}>{canAfford ? "\u{1F513}" : "\u{1F512}"}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {unlockedChars.length < CHARACTERS.length && (
                    <div style={{ marginTop:8, fontSize:11, color:"#ffffff55", textAlign:"center" }}>
                      {tr("unlockHero",lang)}
                    </div>
                  )}
                </div>

                <div style={{ background:"#ffffff0d", borderRadius:16, padding:14, marginBottom:14, border:`1px solid ${planet.color}33` }}>
                  <TablePicker selected={tables} unlocked={unlocked} onToggle={toggleTable} />
                </div>

                <div style={{ display:"flex", gap:8, justifyContent:"center", alignItems:"center", marginBottom:16 }}>
                  <span style={{ color:"#ffffff66", fontSize:14 }}>{tr("levelWord",lang)} :</span>
                  <span style={{ color:planet.color, fontSize:17, fontWeight:900, background:`${planet.color}22`, borderRadius:10, padding:"2px 10px" }}>{level} / {TOTAL_LEVELS}</span>
                </div>

                <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
                  <button onClick={() => setScreen("run")} style={{ padding:"15px 36px", fontSize:19, fontWeight:900, border:"none", borderRadius:50, background:`linear-gradient(135deg,${planet.color},${planet.color}88)`, color:"#1a0a3e", cursor:"pointer", boxShadow:`0 4px 20px ${planet.color}55` }}>{tr("play",lang)}</button>
                  <button onClick={() => setShop(true)} style={{ padding:"15px 18px", fontSize:15, fontWeight:700, border:`2px solid #FFD700`, borderRadius:50, background:"#FFD70011", color:"#FFD700", cursor:"pointer" }}>{tr("shop",lang)}</button>
                  <button onClick={() => setShowSettings(true)} style={{ padding:"15px 18px", fontSize:18, fontWeight:700, border:"2px solid #ffffff33", borderRadius:50, background:"#ffffff11", color:"#ffffff99", cursor:"pointer" }}>{"\u2699\uFE0F"}</button>
                </div>

                <div style={{ marginTop:18, padding:"8px 12px", borderRadius:10, background:"#ffffff08", border:"1px solid #ffffff11", fontSize:11, color:"#ffffff44", lineHeight:1.7 }}>
                  {tr("coppa",lang)}
                </div>
              </div>
            )}

            {/* QUIZ */}
            {screen === "quiz" && question && (
              <div style={{ background:"#ffffff0d", borderRadius:16, padding:16, border:`1px solid ${planet.color}33` }}>
                <div style={{ textAlign:"center", marginBottom:10, fontSize:15, color:planet.color, fontWeight:700 }}>{tr("quizTitle",lang)} {level}</div>
                <Question key={`q-${level}`} question={question} planet={planet} onResult={handleAnswer} lang={lang} />
              </div>
            )}

            {/* DONE */}
            {screen === "done" && (
              <div style={{ background:"#ffffff0d", borderRadius:16, padding:16, border:`1px solid ${planet.color}33` }}>
                <LevelDone level={level} correct={correct} totalStars={totalStars} newUnlock={newUnlock} onNext={handleNext} lang={lang} unlockedChars={unlockedChars} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ad banner */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, height:56, zIndex:100, background:"#0a0520f0", borderTop:"1px solid #ffffff18", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ background:"#ffffff0d", border:"1px solid #ffffff1a", borderRadius:8, padding:"5px 22px", fontSize:12, color:"#ffffff44", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:16 }}>{"\u{1F4E3}"}</span>
          Espace publicitaire - Annonce securisee pour enfants
        </div>
      </div>

      {shop && <Shop onClose={() => setShop(false)} onBuy={() => { setUnlocked([1,2,3,4,5,6,7,8,9]); setShop(false); }} unlocked={unlocked} />}
      {showSettings && <Settings soundOn={soundOn} setSoundOn={setSoundOn} hapticOn={hapticOn} setHapticOn={setHapticOn} lang={lang} setLang={setLang} onClose={() => setShowSettings(false)} onReset={handleReset} />}
    </div>
  );
}
