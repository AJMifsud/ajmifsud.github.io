// Creates or opens the database
const dbPromise = idb.openDB('GamesLibraryDB', 1, {
	upgrade(db) {
		// Create a single database table called 'games'
		if (!db.objectStoreNames.contains('games')) {
			// We use 'id' as the primary key since every game has a local ID
			const store = db.createObjectStore('games', { keyPath: 'id' });
			
			// Create indexes so we can search by console or raId later if needed
			store.createIndex('console', 'consoleId');
			store.createIndex('consoleName', 'consoleName');
			store.createIndex('raId', 'raId');
		}
	},
});

window.openImageViewer = function(src) {
	const overlay = document.getElementById('image-viewer-overlay');
	const img = document.getElementById('image-viewer-img');
	img.style.imageRendering = 'crisp-edges';
	img.style.flexGrow = '1';
	img.src = src;
	overlay.style.display = 'flex';
};

window.safeApiCall = async function(apiFunc, auth, params) {
	let retries = 4;
	let backoff = 1000;
	while(retries > 0) {
		try {
			return await apiFunc(auth, params);
		} catch(e) {
			if(retries === 1) throw e;
			console.warn(`API Rate Limit hit, retrying in ${backoff}ms...`);
			await new Promise(r => setTimeout(r, backoff));
			backoff += 1000;
			retries--;
		}
	}
};

const CONSOLE_FULL_NAMES = {
	"32X": "32X", "3DO": "3DO Interactive Multiplayer", "CPC": "Amstrad CPC",
	"A2": "Apple II", "ARC": "Arcade", "A2001": "Arcadia 2001", "ARD": "Arduboy",
	"2600": "Atari 2600", "7800": "Atari 7800", "JAG": "Atari Jaguar",
	"JCD": "Atari Jaguar CD", "LYNX": "Atari Lynx",
	"CV": "ColecoVision", "DC": "Dreamcast", "ELEK": "Elektor TV Games Computer",
	"CHF": "Fairchild Channel F", "FDS": "Famicom Disk System",
	"GB": "Game Boy", "GBA": "Game Boy Advance",
	"GBC": "Game Boy Color", "GG": "Game Gear", "GC": "GameCube",
	"MD": "Genesis/Mega Drive", "INTV": "Intellivision", "VC4000": "Interton VC 4000",
	"MO2": "Magnavox Odyssey 2", "SMS": "Master System", "DUCK": "Mega Duck", 
	"MSX": "MSX", "NGCD": "Neo Geo CD", "NGP": "Neo Geo Pocket", "NES": "NES/Famicom",
	"3DS": "Nintendo 3DS", "N64": "Nintendo 64", "DS": "Nintendo DS", 
	"DSi": "Nintendo DSi", "PCCD": "PC Engine CD/TurboGrafx-CD", 
	"PCE": "PC Engine/TurboGrafx-16", "8088": "PC-8000/8800",
	"PCFX": "PC-FX", "PS1": "PlayStation", "PS2": "PlayStation 2",  "PS3": "PlayStation 3", 
	"PSP": "PlayStation Portable", "MINI": "Pokemon Mini",
	"SAT": "Saturn", "SCD": "Sega CD",
	"SG1K": "SG-1000", "SNES": "SNES/Super Famicom", "EXE": "Standalone",
	"UZE": "Uzebox", "VECT": "Vectrex", "VB": "Nintendo Virtual Boy", "WASM4": "WASM-4",
	"WSV": "Watara Supervision", "Wii": "Wii", "WiiU": "Wii U",
	"WS": "WonderSwan"
};

const CONSOLE_IMAGES = {
	"MD": "https://static.retroachievements.org/assets/images/system/md.png", "N64": "https://static.retroachievements.org/assets/images/system/n64.png",
	"SNES": "https://static.retroachievements.org/assets/images/system/snes.png", "GB": "https://static.retroachievements.org/assets/images/system/gb.png",
	"GBA": "https://static.retroachievements.org/assets/images/system/gba.png", "GBC": "https://static.retroachievements.org/assets/images/system/gbc.png",
	"NES": "https://static.retroachievements.org/assets/images/system/nes.png", "PS1": "https://static.retroachievements.org/assets/images/system/ps1.png",
	"PS2": "https://static.retroachievements.org/assets/images/system/ps2.png", "PS3": "https://static.retroachievements.org/assets/images/system/ps3.png", "PSP": "https://static.retroachievements.org/assets/images/system/psp.png",
	"Wii": "https://static.retroachievements.org/assets/images/system/wii.png", "GC": "https://static.retroachievements.org/assets/images/system/gc.png",
	"DS": "https://static.retroachievements.org/assets/images/system/ds.png", "VB": "https://static.retroachievements.org/assets/images/system/vb.png",
	"FDS": "https://static.retroachievements.org/assets/images/system/fds.png", "DSi": "https://static.retroachievements.org/assets/images/system/dsi.png",
	"MINI": "https://static.retroachievements.org/assets/images/system/mini.png", "2600": "https://static.retroachievements.org/assets/images/system/2600.png",
	"7800": "https://static.retroachievements.org/assets/images/system/7800.png", "JAG": "https://static.retroachievements.org/assets/images/system/jag.png",
	"JCD": "https://static.retroachievements.org/assets/images/system/jcd.png", "LYNX": "https://static.retroachievements.org/assets/images/system/lynx.png",
	"SG1K": "https://static.retroachievements.org/assets/images/system/sg1k.png", "SMS": "https://static.retroachievements.org/assets/images/system/sms.png",
	"SCD": "https://static.retroachievements.org/assets/images/system/scd.png", "32X": "https://static.retroachievements.org/assets/images/system/32x.png",
	"SAT": "https://static.retroachievements.org/assets/images/system/sat.png", "DC": "https://static.retroachievements.org/assets/images/system/dc.png",
	"GG": "https://static.retroachievements.org/assets/images/system/gg.png", "PC88": "https://static.retroachievements.org/assets/images/system/8088.png",
	"PCE": "https://static.retroachievements.org/assets/images/system/pce.png", "PCECD": "https://static.retroachievements.org/assets/images/system/pccd.png",
	"PCFX": "https://static.retroachievements.org/assets/images/system/pc-fx.png", "NGCD": "https://static.retroachievements.org/assets/images/system/ngcd.png",
	"NGP": "https://static.retroachievements.org/assets/images/system/ngp.png", "3DO": "https://static.retroachievements.org/assets/images/system/3do.png",
	"CPC": "https://static.retroachievements.org/assets/images/system/cpc.png", "A2": "https://static.retroachievements.org/assets/images/system/a2.png",
	"ARC": "https://static.retroachievements.org/assets/images/system/arc.png", "A2001": "https://static.retroachievements.org/assets/images/system/a2001.png",
	"ARD": "https://static.retroachievements.org/assets/images/system/ard.png", "CV": "https://static.retroachievements.org/assets/images/system/cv.png",
	"ELEK": "https://static.retroachievements.org/assets/images/system/elek.png", "CHF": "https://static.retroachievements.org/assets/images/system/chf.png",
	"INTV": "https://static.retroachievements.org/assets/images/system/intv.png", "VC4000": "https://static.retroachievements.org/assets/images/system/vc4000.png",
	"MO2": "https://static.retroachievements.org/assets/images/system/mo2.png", "DUCK": "https://static.retroachievements.org/assets/images/system/duck.png",
	"MSX": "https://static.retroachievements.org/assets/images/system/msx.png", "EXE": "https://static.retroachievements.org/assets/images/system/exe.png",
	"UZE": "https://static.retroachievements.org/assets/images/system/uze.png", "VECT": "https://static.retroachievements.org/assets/images/system/vect.png",
	"WASM4": "https://static.retroachievements.org/assets/images/system/wasm4.png", "WSV": "https://static.retroachievements.org/assets/images/system/wsv.png",
	"WS": "https://static.retroachievements.org/assets/images/system/ws.png", "WiiU": "https://static.retroachievements.org/assets/images/system/wiiu.png", 
	"3DS": "https://static.retroachievements.org/assets/images/system/3ds.png", "Events": "https://static.retroachievements.org/assets/images/system/events.png",
	"XBOX": "https://static.retroachievements.org/assets/images/system/xbox.png", "DOS": "https://static.retroachievements.org/assets/images/system/dos.png", "Hubs": "https://static.retroachievements.org/assets/images/system/hubs.png"
};

const CONSOLE_COLORS = {
	"GB": "#D1D1D1", "NES": "#D4D4D4", "SNES": "#E4E4E4", "PS1": "#BCC1CB",
	"GBC": "#427DE0", "GC": "#67489F", "GBA": "#68289F", "MD": "#4B4B4B",
	"N64": "#484644", "PS2": "#0050F4", "PSP": "#343642", "Wii": "#FFFFFF",
	"DS": "#CFCFCF", "VB": "#FF0000", "WiiU": "#E5E8FB", "SCD": "#2C2A28",
	"32X": "#4B4B4B","SMS": "#EFEADC", "LYNX": "#484949","GG": "#5B5B5B",
	"2600": "#E69B33", "ARC": "#9A9A9A", "CPC": "#4B4B4B", "A2": "#E9E2C0",
	"SAT": "#787585", "DC": "#F2F2F2", "3DS": "#CDCDCD", "PCE": "#E0E0E0",
	"XBOX": "#7FBA00", "PCECD": "#ea5626", "NGP": "#61749c", "JAG": "#4a4a4a", 
	"MO2": "#dadada", "MINI": "#bcc4ed", "MSX": "#50535e", "SG1K": "#c7c3b7", 
	"3DO": "#7a7a7a", "CV": "#5b5b5b", "INTV": "#262626", "VECT": "#424242", 
	"PC88": "#e6e3d6", "PCFX": "#f4f4f5", "7800": "#474747", "WS": "#5c5c5c", 
	"NGCD": "#3e3e3e", "CHF": "#6a6a6a", "WSV": "#bdbdbd", "DUCK": "#9fa087", 
	"ARD": "#ffffff", "WASM4": "#71a843", "A2001": "#706664", "VC4000": "#494949", 
	"ELEK": "#724224", "JCD": "#747474", "DSi": "#ffffff", "UZE": "#de3b3b", 
	"FDS": "#e9e5d1", "DOS": "#bfb588", "C64": "#e9e2c0", "ZX81": "#626262", 
	"ORIC": "#555555", "VIC-20": "#555555", "AMIGA": "#9c9585", "AST": "#555555", 
	"CD-I": "#5a5a5a", "9800": "#f8f8f3", "5200": "#414141", "X68K": "#555555", 
	"ECV": "#e7e7e7", "ESCV": "#e7e7e7", "FM-TOWNS": "#9296a2", "ZXS": "#636363", 
	"G&W": "#d0d3d5", "N-GAGE": "#313c39", "X1": "#555555", "TIC-80": "#FFFFFF", 
	"TO8": "#555555", "PC-6000": "#555555", "PICO": "#3647be", "ZEEBO": "#606070", 
	"TI-83": "#2f322e", "Events": "#ffac32", "EXE": "#0f65dc", "PS3": "#2596be"
};

const RA_CONSOLE_IDS = {
	"MD": 1, "N64": 2, "SNES": 3, "GB": 4, "GBA": 5, "GBC": 6,
	"NES": 7, "PCECD": 76, "SCD": 9, "32X": 10, "SMS": 11, "PS1": 12,
	"LYNX": 13, "NGP": 14, "GG": 15, "GC": 16, "JAG": 17, "DS": 18,
	"Wii": 19, "PS2": 21, "MO2": 23, "MINI": 24, "2600": 25, "ARC": 27,
	"VB": 28, "MSX": 29, "SG1K": 33, "CPC": 37, "A2": 38, "SAT": 39,
	"DC": 40, "PSP": 41, "3DO": 43, "CV": 44, "INTV": 45, "VECT": 46,
	"PC88": 47, "PCFX": 49, "7800": 51, "WS": 53, "NGCD": 56, "CHF": 57,
	"3DS": 62, "WSV": 63, "DUCK": 69, "ARD": 71, "WASM4": 72, "A2001": 73,
	"VC4000": 74, "ELEK": 75, "PCE": 8, "JCD": 77, "DSi": 78, "UZE": 80,
	"FDS": 81, "WiiU": 20, "XBOX": 22, "DOS": 26, "C64": 30, "ZX81": 31,
	"ORIC": 32, "VIC-20": 34, "AMIGA": 35, "AST": 36, "CD-I": 42, "9800": 48,
	"5200": 50, "X68K": 52, "ECV": 54, "ESCV": 55, "FM-TOWNS": 58, "ZXS": 59,
	"G&W": 60, "N-GAGE": 61, "X1": 64, "TIC-80": 65, "TO8": 66, "PC-6000": 67,
	"PICO": 68, "ZEEBO": 70, "TI-83": 79, "PS3": 82, "Hubs": 100, "Events": 101, "EXE": 102, 
};

const CONSOLE_METADATA = {};

const WHEEL_COLORS = ['#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00', '#00FF80', '#00FFFF', '#0080FF', '#0000FF', '#8000FF', '#FF00FF', '#FF0080'];
const EXTENSION_MAP = { "sfc": "SNES", "smc": "SNES", "n64": "N64", "nes": "NES", "md": "MD", "gb": "GB", "gba": "GBA", "gbc": "GBC", "gcm": "GC", "nds": "DS", "vb": "VB" };
const SHARED_EXTENSIONS = { "iso": ["PS1", "PS2", "GC", "PSP", "Wii"], "bin": ["PS1", "MD"], "cue": ["PS1", "MD"], "chd": ["PS1", "PS2"], "rvz": ["Wii", "GC"] };

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playTick() {
	if (audioCtx.state === 'suspended') audioCtx.resume();
	const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
	osc.type = 'sawtooth'; osc.frequency.setValueAtTime(2500, audioCtx.currentTime);
	gain.gain.setValueAtTime(0.02, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.02);
	osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 0.02);
}

const cleanImg = (str) => {
	if(!str) return "";
	return str.replace(/^.*?\/Images\//i, '').replace(/\.png$/i, '');
};

function formatTime(seconds) {
	if (seconds === null || seconds === undefined || seconds === "N/A" || isNaN(seconds)) return "N/A";
	let totalMinutes = Math.round(Number(seconds) / 60);
	if (totalMinutes === 0) return "0m";
	let h = Math.floor(totalMinutes / 60);
	let m = totalMinutes % 60;
	if (h > 0) return `${h}h ${m}m`;
	return `${m}m`;
}

function toggleSidebarHeight() {
	const sidebar = document.getElementById('sidebar');
	if (sidebar) {
		sidebar.classList.toggle('expanded-mobile');
	}
}

function toggleRASidebarHeight() {
	const raSidebar = document.getElementById('ra-sidebar');
	if (raSidebar) {
		raSidebar.classList.toggle('expanded');
	}
}

window.generateGameInfoHtml = function(data, raId, excludeScreenshots = false) {
	let html = '';
	const rawBox = data.imageBoxArt || data.ImageBoxArt;
	html += `<div style="display:flex; gap:15px; margin-bottom:15px; justify-content:center; align-items:center; flex-shrink:0; flex-wrap: wrap;">`;
	if (rawBox) {
		const boxSrc = `https://media.retroachievements.org${rawBox.startsWith('/') ? rawBox : '/Images/'+rawBox}`;
		html += `<img src="${boxSrc}" style="width:120px; border-radius:8px; box-shadow: 0 4px 10px rgba(0,0,0,0.5); object-fit:contain; cursor:pointer;" onclick="openImageViewer('${boxSrc}')">`;
	}
	const rawIcon = data.imageIcon || data.ImageIcon;
	if (rawIcon) {
		const iconSrc = `https://media.retroachievements.org${rawIcon.startsWith('/') ? rawIcon : '/Images/'+rawIcon}`;
		html += `<img src="${iconSrc}" style="width:64px; height:64px; border-radius:8px; box-shadow: 0 4px 10px rgba(0,0,0,0.5); object-fit:cover; cursor:pointer;" onclick="openImageViewer('${iconSrc}')">`;
	}
	html += `</div>`;
	
	html += `<div style="text-align:center; margin-bottom:10px; flex-shrink:0;">`;
	
	const tagMatches = data.title.match(/~([^~]+)~/g);
	const cleanName = (data.title || '').replace(/~([^~]+)~/g, '').trim();
	
	html += `<h3 style="margin:0; color:var(--primary); font-size:1.1rem; cursor:pointer; text-decoration:underline;" onclick="window.open('https://retroachievements.org/game/${raId}', '_blank')">${cleanName || 'Unknown Title'}</h3>`;
	
	if (tagMatches) {
		if (tagMatches.length > 0) {
			tagMatches.forEach(tag => {
				const cleanTag = (tag).replace(/~/g, '').trim();
				html += `<span style="color: black; background: white; border: 0px; border-radius: 4px; padding: 2px 4px; margin-left: 5px; font-size: 0.75em; font-weight: bold;">${cleanTag}</span>`;
			});
		}
	}
	if(data.released || data.Released) {
		const options = {
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		const dateReleased = new Date(data.released || data.Released).toLocaleDateString(undefined, options);
		html += `<p style="margin:5px 0 0 0; font-size:0.7rem; color:#94a3b8;">Release Date • ${dateReleased || 'Unknown'}</p>`;
	}
	html += `<div style="display:flex; justify-content: space-evenly;">`;
	const developer = data.developer || data.Developer;
	const publisher = data.publisher || data.Publisher;

	if (developer) {
		html += `<span style="margin:5px auto 0 auto; font-size:0.7rem; color:#94a3b8;">Developer • ${developer}</span>`;
	}
	if (developer && publisher) {
		html += `<span style="margin:5px 0 0 0; font-size:0.7rem; color:#94a3b8;"> | </span>`;
	}
	if (publisher) {
		html += `<span style="margin:5px auto 0 auto; font-size:0.7rem; color:#94a3b8;">Publisher • ${publisher}</span>`;
	}
	html += `</div>`;

	// --- EXTRACT ACHIEVEMENTS EARLY FOR DETAILS PANELS ---
	const achievements = data.achievements || data.Achievements;
	const achList = achievements ? (Array.isArray(achievements) ? achievements : Object.values(achievements)) : [];
	const numDistCas = data.numDistinctPlayersCasual || data.NumDistinctPlayersCasual || 0;
	const numDistHC = data.numDistinctPlayersHardcore || data.NumDistinctPlayersHardcore || 0;

	// Helper to generate the internal expanded list HTML
	const generateAchDetails = (ids) => {
		if (!ids || ids.length === 0) return '';
		let detailsHtml = '<div style="margin-top:5px; display:flex; flex-direction:column; gap:5px; text-align:left;">';
		ids.forEach(id => {
			const ach = achList.find(a => String(a.id || a.ID) === String(id));
			if (ach) {
				const title = ach.title || ach.Title || 'Unknown';
				const desc = ach.description || ach.Description || 'No description';
				const pts = ach.points || ach.Points || 0;
				let icons = '';
				let badgeStyle ='filter: blur(1px) grayscale(1);';
				if (ach.dateEarnedHardcore){
					badgeStyle = 'border: 2px solid #eab308;';
				} else if (ach.dateEarned){
					badgeStyle = 'border: 2px solid #3b82f6;';
				}
				if (ach.type == "missable"){
					icons += '<strong title="Missable">❕</strong>';
				}
				if (data.damagelessIDs.includes(ach.id)){
					icons += icons ? '<strong title="Damageless"> ☠️</strong>' : '<strong title="Damageless">☠️</strong>';
				}
				if (data.speedrunIDs.includes(ach.id)){
					icons += icons ? '<strong title="Speedrun"> ⏲️</strong>' : '<strong title="Speedrun">⏲️</strong>';
				}
				const awdCas = ach.numAwarded || ach.NumAwarded || 0;
				const awdHC = ach.numAwardedHardcore || ach.NumAwardedHardcore || 0;
				
				const pctCas = numDistCas > 0 ? ((awdCas / numDistCas) * 100).toFixed(2) : '0.00';
				const pctHC = numDistHC > 0 ? ((awdHC / numDistHC) * 100).toFixed(2) : '0.00';
				
				detailsHtml += `
					<div style="background:rgba(0,0,0,0.3); padding:6px; border-radius:4px; font-size:0.65rem;">
						<div style="display: flex; flex-direction: row; gap: 5px; align-items: center;">
							<a href="https://retroachievements.org/achievement/${ach.id}" target="_blank"><img src="https://media.retroachievements.org/Badge/${ach.badgeName}.png" style="max-width: 42px; max-height: 42px; border-radius: 4px; ${badgeStyle}" alt="badge"></a>
							<div style="display: flex; flex-direction: column; width: 100%;">
								<div style="display: flex; gap: 3px; font-weight:bold; color:var(--accent); margin-bottom:2px;"><a href="https://retroachievements.org/achievement/${ach.id}" target="_blank" style="color: inherit;">${title} </a><span style="color:#cbd5e1; font-weight:normal; white-space: nowrap;">(${pts} pts)</span><span style="display:flex; gap:3px; margin-left:auto; color:#cbd5e1; font-weight:normal;">${icons}</span></div>
								<div style="color:#cbd5e1; margin-bottom:4px; font-style:italic;">${desc}</div>
							</div>
						</div>
						<div style="display:flex; justify-content:space-between; font-size:0.6rem; color:#94a3b8;">
							<span>Casual: ${awdCas} / ${numDistCas} (${pctCas}%)</span>
							<span>Hardcore: ${awdHC} / ${numDistHC} (${pctHC}%)</span>
						</div>
					</div>
				`;
			}
		});
		detailsHtml += '</div>';
		return detailsHtml;
	};

	if(data.missableIDs && data.missableIDs.length > 0) {
		let missableLabel = data.missableIDs.length > 1 ? "Achievements" : "Achievement";
		html += `
		<details style="margin:5px 0 0 0; font-size:0.7rem; color: #ffffff; background: teal; border-radius: 5px;">
			<summary style="cursor: pointer; padding: 5px; list-style: none; font-weight: bold; text-align: center;">
				❕ Game has ${data.missableIDs.length} Missable ${missableLabel} ▼
			</summary>
			<div style="padding: 5px; background: rgba(0,0,0,0.15); border-top: 1px solid rgba(255,255,255,0.2);">
				${generateAchDetails(data.missableIDs)}
			</div>
		</details>`;
	}

	if(data.damagelessIDs && data.damagelessIDs.length > 0) {
		let damagelessLabel = data.damagelessIDs.length > 1 ? "Achievements" : "Achievement";
		html += `
		<details style="margin:5px 0 0 0; font-size:0.7rem; color: #ffffff; background: var(--danger); border-radius: 5px;">
			<summary style="cursor: pointer; padding: 5px; list-style: none; font-weight: bold; text-align: center;">
				☠️ Game has ${data.damagelessIDs.length} Damageless ${damagelessLabel} ▼
			</summary>
			<div style="padding: 5px; background: rgba(0,0,0,0.15); border-top: 1px solid rgba(255,255,255,0.2);">
				${generateAchDetails(data.damagelessIDs)}
			</div>
		</details>`;
	}

	if(data.speedrunIDs && data.speedrunIDs.length > 0) {
		let speedrunLabel = data.speedrunIDs.length > 1 ? "Achievements" : "Achievement";
		html += `
		<details style="margin:5px 0 0 0; font-size:0.7rem; color: #ffffff; background: #d19902; border-radius: 5px;">
			<summary style="cursor: pointer; padding: 5px; list-style: none; font-weight: bold; text-align: center;">
				⏲️ Game has ${data.speedrunIDs.length} SpeedRun ${speedrunLabel} ▼
			</summary>
			<div style="padding: 5px; background: rgba(0,0,0,0.15); border-top: 1px solid rgba(255,255,255,0.2);">
				${generateAchDetails(data.speedrunIDs)}
			</div>
		</details>`;
	}

	html += `</div>`;
	
	html += `<div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:10px; flex-shrink:0;">`;
	
	let calculatedPoints = 0;
	let achCount = 0;
	
	// NEW VARIABLES FOR ATTAINED STATS
	let earnedPts = 0;
	let earnedAch = 0;

	// Re-use achList generated above
	if (achList.length > 0) {
		achCount = achList.length;
		
		achList.forEach(ach => {
			const pts = parseInt(ach.points || ach.Points || 0);
			calculatedPoints += pts;
			
			// Check if the API data shows the user unlocked this achievement
			if (ach.dateEarned || ach.DateEarned || ach.dateEarnedHardcore || ach.DateEarnedHardcore) {
				earnedPts += pts;
				earnedAch++;
			}
		});
	}

	// FALLBACK: Gather from local cache if API data lacks user progress
	if (earnedAch === 0 && typeof raCompletedGamesCache !== 'undefined') {
		const raData = raCompletedGamesCache.find(ra => String(ra.gameId || ra.GameID || ra.id) === String(raId));
		if (raData) {
			earnedAch = parseInt(raData.progData?.numAchieved || raData.numAwarded) || 0;
			earnedPts = parseInt(raData.progData?.scoreAchieved || raData.ScoreAchieved) || 0; 
		}
	}
	
	const numAch = achCount > 0 ? achCount : (data.numAchievements || data.NumAchievements || "?");
	const totalPts = calculatedPoints > 0 ? calculatedPoints : (data.points || data.Points || "?");

	let genre = data.genre || data.Genre || "";

	if (Array.isArray(genre)) {
		genre = genre.join(", ");
	} else {
		genre = genre.replace(/\s*,\s*/g, ", ");
	}
	const timeBeat = formatTime(data.medianTimeToBeat);
	const timeBeatHC = formatTime(data.medianTimeToBeatHardcore);
	const timeComp = formatTime(data.medianTimeToComplete);
	const timeMaster = formatTime(data.medianTimeToMaster);
	let avgPphSc = "N/A";
	if (data.medianTimeToComplete > 0 && totalPts > 0) {
		avgPphSc = (totalPts / (data.medianTimeToComplete / 3600)).toFixed(2);
	}

	let avgPphHc = "N/A";
	if (data.medianTimeToMaster > 0 && totalPts > 0) {
		avgPphHc = (totalPts / (data.medianTimeToMaster / 3600)).toFixed(2);
	}
	const displayAvgPphSc = avgPphSc === "N/A" ? "N/A" : `${avgPphSc} pts/hr`;
	const displayAvgPphHc = avgPphHc === "N/A" ? "N/A" : `${avgPphHc} pts/hr`;
	
	html += `
		<div class="panel-totals" style="background:#0f172a; padding:10px; border-radius:6px; border:1px solid var(--border); text-align:center; font-size: 70%;">
			<div style="font-size:1.2em; font-weight:bold; color:var(--accent);">${earnedAch} / ${numAch}</div>
			<div style="font-size:0.8em; color:#94a3b8; text-transform:uppercase; margin-top:3px;">Achievements</div>
		</div>
		<div class="panel-totals" style="background:#0f172a; padding:10px; border-radius:6px; border:1px solid var(--border); text-align:center; font-size: 70%;">
			<div style="font-size:1.2em; font-weight:bold; color:var(--primary);">${earnedPts} / ${totalPts}</div>
			<div style="font-size:0.8em; color:#94a3b8; text-transform:uppercase; margin-top:3px;">Total Points</div>
		</div>
	</div>`;
	
	html += `<div style="background:#0f172a; padding:12px; border-radius:6px; border:1px solid var(--border); font-size:0.75rem; margin-bottom: 5px; flex-shrink:0;">`;
	html += `<div style="display:flex; justify-content:space-between; margin-bottom:6px;"><span style="color:#94a3b8;">Time to Beat (Casual):</span> <strong style="text-align:right;">${timeBeat}</strong></div>`;
	html += `<div style="display:flex; justify-content:space-between; margin-bottom:6px;"><span style="color:#94a3b8;">Time to Beat (Hardcore):</span> <strong style="text-align:right;">${timeBeatHC}</strong></div>`;
	html += `<div style="display:flex; justify-content:space-between; margin-bottom:6px;"><span style="color:#94a3b8;">Time to Complete (Casual):</span> <strong style="text-align:right;">${timeComp}</strong></div>`;
	html += `<div style="display:flex; justify-content:space-between; margin-bottom:6px;"><span style="color:#94a3b8;">Time to Master (Hardcore):</span> <strong style="text-align:right;">${timeMaster}</strong></div>`;
	html += `<div style="display:flex; justify-content:space-between; margin-bottom:6px;"><span style="color:#94a3b8;">Avg. Points/Hour (Casual):</span> <strong style="text-align:right;">${displayAvgPphSc}</strong></div>`;
	html += `<div style="display:flex; justify-content:space-between; margin-bottom:6px;"><span style="color:#94a3b8;">Avg. Points/Hour (Hardcore):</span> <strong style="text-align:right;">${displayAvgPphHc}</strong></div>`;
	if (genre) { html += `<div style="display:flex; justify-content:space-between; margin-bottom:6px;"><span style="color:#94a3b8;">Genre:</span> <strong style="text-align:right;">${genre}</strong></div>`; }
	const players = data.numDistinctPlayersCasual || data.NumDistinctPlayersCasual;
	if (players) { html += `<div style="display:flex; justify-content:space-between; margin-bottom:0;"><span style="color:#94a3b8;">Total Players:</span> <strong style="text-align:right;">${players}</strong></div>`; }
	html += `</div>`;
	
	if (!excludeScreenshots) {
		html += `<div id="screenshots" style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom: 15px; justify-content: center;">`;
		const imgTitle = data.imageTitle || data.ImageTitle;
		if (imgTitle) {
			const titleSrc = `https://media.retroachievements.org${imgTitle.startsWith('/') ? imgTitle : '/Images/'+imgTitle}`;
			html += `<div><span style="font-size: 0.75rem; color: #94a3b8;">Title Screen</span><img src="${titleSrc}" style="width:100%; border-radius:6px; border:1px solid var(--border); cursor:pointer; flex-shrink:1;" onclick="openImageViewer('${titleSrc}')"></div>`;
		}
		const imgIngame = data.imageIngame || data.ImageIngame;
		if (imgIngame) {
			const ingameSrc = `https://media.retroachievements.org${imgIngame.startsWith('/') ? imgIngame : '/Images/'+imgIngame}`;
			html += `<div><span style="font-size: 0.75rem; color: #94a3b8;">In-Game Screenshot</span><img src="${ingameSrc}" style="width:100%; border-radius:6px; border:1px solid var(--border); cursor:pointer; flex-shrink:1;" onclick="openImageViewer('${ingameSrc}')"></div>`;
		}
		html += `</div>`;
	}
	
	if(data.forumTopicId || data.forumTopicID  || data.ForumTopicId || data.ForumTopicID) {
		html += `<a href="https://retroachievements.org/forums/topic/${data.forumTopicId || data.forumTopicID  || data.ForumTopicId || data.ForumTopicID}" target="_blank" style="display:flex; margin-top: 5px; align-items:center; justify-content:center; background:#2a2a2a; color:white; padding:10px; border-radius:6px; text-decoration:none; font-weight:bold; font-size:0.8rem; flex-shrink:0;">
		Open<img src="https://static.retroachievements.org/assets/images/ra-icon.webp" style="max-height: 16px; padding: 0 5px;">Forum Topic</a>`;
	}
	if(data.guideURL || data.GuideURL) {
		html += `<a href="${data.guideURL || data.GuideURL}" target="_blank" style="display:flex; margin-top: 5px; align-items:center; justify-content:center; background:#2a2a2a; color:white; padding:10px; border-radius:6px; text-decoration:none; font-weight:bold; font-size:0.8rem; flex-shrink:0;">
		Open<img src="https://static.retroachievements.org/assets/images/ra-icon.webp" style="max-height: 16px; padding: 0 5px;">Guide</a>`;
	}
	
	// --- MODIFIED YOUTUBE BUTTON SECTION ---
	let rawTitle = data.title || data.Title || data.name || 'Unknown Title';
	let cleanConName = "";
	
	// 1. Most accurate: Check if data natively provides a Console ID, and reverse lookup the full name.
	let apiConId = data.consoleId || data.ConsoleId || data.ConsoleID;
	if (apiConId && typeof RA_CONSOLE_IDS !== 'undefined') {
		const conKey = Object.keys(RA_CONSOLE_IDS).find(k => RA_CONSOLE_IDS[k] == apiConId);
		if (conKey && typeof CONSOLE_FULL_NAMES !== 'undefined' && CONSOLE_FULL_NAMES[conKey]) {
			cleanConName = CONSOLE_FULL_NAMES[conKey];
		}
	}

	// 2. Second most accurate: Find the game in userLibrary strictly by unique ID (raId or internal id).
	// This prevents "Name Collision" where multi-platform games grab the wrong console.
	if (!cleanConName && typeof userLibrary !== 'undefined' && userLibrary) {
		for (const libCon of Object.keys(userLibrary)) {
			// Strict ID check ONLY. Do not use generic g.name matching here.
			if (userLibrary[libCon].some(g => (raId && g.raId == raId) || (data.id && g.id == data.id))) {
				cleanConName = typeof CONSOLE_FULL_NAMES !== 'undefined' && CONSOLE_FULL_NAMES[libCon] ? CONSOLE_FULL_NAMES[libCon] : libCon;
				break;
			}
		}
	}
	
	// 3. Fallbacks: Text properties or the globally selected console
	if (!cleanConName) {
		cleanConName = data.consoleName || data.ConsoleName || "";
	}
	
	if (!cleanConName && typeof selectedConsole !== 'undefined' && selectedConsole) {
		cleanConName = typeof CONSOLE_FULL_NAMES !== 'undefined' && CONSOLE_FULL_NAMES[selectedConsole] ? CONSOLE_FULL_NAMES[selectedConsole] : selectedConsole;
	}

	// Clean up double spacing but leave special characters and full names untouched
	const queryText = `${rawTitle} ${cleanConName}`.trim().replace(/\s+/g, ' ');

	// URL-encode query securely
	const ytQuery = encodeURIComponent(queryText).replace(/%20/g, '+');
	const ytUrl = `https://www.youtube.com/results?search_query=${ytQuery}&sp=EgIQAQ%253D%253D`;

	html += `<a href="${ytUrl}" target="_blank" style="display:flex; align-items:center; justify-content:center; background:#2a2a2a; color:white; padding:10px; margin-top: 5px; border-radius:6px; text-decoration:none; font-weight:bold; font-size:0.8rem; flex-shrink:0;">
		Search on <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ff0000" style="display:inline-block; margin-left:5px; margin-right:1px; flex-shrink:0;"><path fill="#ff0000" d="M23.498 6.163c-.272-1.022-1.074-1.826-2.099-2.097C19.516 3.5 12 3.5 12 3.5s-7.602-.032-9.498.607c-1.174.495-1.827 1.075-2.099 2.097C0 8.06 0 12 0 12s0 3.94.501 5.837c.272 1.022 1.074 1.826 2.1 2.097 1.883.502 9.399.502 9.399.502s7.516 0 9.4-.502c1.025-.271 1.827-1.075 2.099-2.097C24 15.34 24 11.4 24 11.4s0-3.94-.502-5.237z"/><path fill="#ffffff" d="M9.545 15.568V8.432L15.818 12z"/></svg> YouTube
	</a>`;

	// Create synchronous placeholder container for the searches
	html += `<div id="searches-container-${raId}" style="font-size: 0.8rem; display: flex; flex-direction: column; overflow-y: auto; max-height: 128px; flex-shrink: 0;"></div>`;
	// Create synchronous placeholder container for the patches
	html += `<div id="patches-container-${raId}" style="font-size: 0.8rem; display: flex; flex-direction: column; flex-shrink: 0;"></div>`;

	// Fetch credentials dynamically from localStorage to prevent 401 Unauthorized errors
	const raUser = localStorage.getItem('ra_user') || '';
	const raKey = localStorage.getItem('ra_key') || '';

	// Run async API call in the background without halting the HTML return
	if (raUser && raKey && raId) {
		fetch(`https://retroachievements.org/API/API_GetGameHashes.php?z=${raUser}&y=${raKey}&i=${raId}`)
			.then(response => {
				if (!response.ok) throw new Error("Network response error or 401");

				return response.json();
			})
			.then(hashData => {
				const searchesContainer = document.getElementById(`searches-container-${raId}`);
				const patchesContainer = document.getElementById(`patches-container-${raId}`);
				if (!patchesContainer) return;

				let hasPatches = false;
				let patchRowsHtml = '';
				let searchListHtml = '';
				let patchesHtml = '';
				let patchlessCount = 0;

				const results = Array.isArray(hashData) ? hashData : (hashData?.Results || []);

				// Loop through each item in the results array
				results.forEach(hashObj => {
					if (hashObj.PatchUrl) {
						hasPatches = true;
						const label = hashObj.Name;
						patchRowsHtml += `
							<div style="font-size: 0.9rem; padding: 3px;">${label}</div>
							<div style="text-align: right;"><a href="${hashObj.PatchUrl}" target="_blank" style="color: var(--primary); font-weight: bold; padding: 3px;">Download</a></div>
						`;
					} else {
						// Increment count for entries without a PatchUrl
						patchlessCount++;
						
						const regionMatch = hashObj.Name ? hashObj.Name.match(/\([^)]*\)/) : null;
						const region = regionMatch ? ` ${regionMatch[0]}` : '';
						const queryName = hashObj.Name || rawTitle;
						const query = encodeURIComponent(`${queryName} ${cleanConName} rom download`);

						searchListHtml += `<div><a href="https://www.google.com/search?q=${query}" target="_blank" style="display:flex; align-items:center; justify-content:center; background:#2a2a2a; color:white; padding:10px; margin-top: 5px; border-radius:6px; text-decoration:none; font-weight:bold; font-size:0.8rem; flex-shrink:0; gap:5px;"><svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg> Search for ROM${region}</a></div>`;
					}
				});

				// Guarantee at least one search button if no patchless items were found or results were empty
				if (patchlessCount === 0) {
					const fallbackQuery = encodeURIComponent(`${rawTitle} ${cleanConName} rom download`);
					searchListHtml = `<div><a href="https://www.google.com/search?q=${fallbackQuery}" target="_blank" style="display:flex; align-items:center; justify-content:center; background:#2a2a2a; color:white; padding:10px; margin-top: 5px; border-radius:6px; text-decoration:none; font-weight:bold; font-size:0.8rem; flex-shrink:0; gap:5px;"><svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>Search for ROM</a></div>` + searchListHtml;
				}

				// Always put Search buttons on top
				let searchesHtml = searchListHtml;

				// Append Patches section below search buttons if patches exist
				if (hasPatches) {
					patchesHtml += `
						<div style="font-weight: bold; margin-top: 10px; margin-bottom: 5px;">Available Patches:</div>
						<div style="display: grid; grid-template-columns: 1fr auto; gap: 5px; align-items: center; background: var(--bg);">
							${patchRowsHtml}
						</div>
					`;
				}

				searchesContainer.innerHTML = searchesHtml;
				patchesContainer.innerHTML = patchesHtml;
			})
			.catch(err => console.error("Error fetching game hashes:", err));
	}
	
	return html;
};

async function fetchExtendedDataForGame(raApi, authorization, gameId) {
	try {
		// The new endpoint requires a username, so we grab it from storage
		const user = localStorage.getItem('ra_user');
		if (!user) {
			console.error("Username is required for getGameInfoAndUserProgress");
			return null;
		}

		// Changed to getGameInfoAndUserProgress and added the username parameter[cite: 1]
		const data = await window.safeApiCall(raApi.getGameInfoAndUserProgress, authorization, { username: user, gameId: parseInt(gameId) });
		
		if (!data) return null;
		try { 
			if (typeof raApi.getGameProgression === 'function') {
				const prog = await window.safeApiCall(raApi.getGameProgression, authorization, { gameId: parseInt(gameId) });
				if(prog) {
					data.medianTimeToBeat = prog.medianTimeToBeat;
					data.medianTimeToBeatHardcore = prog.medianTimeToBeatHardcore;
					data.medianTimeToComplete = prog.medianTimeToComplete;
					data.medianTimeToMaster = prog.medianTimeToMaster;
				}
			}
		} catch(e) {
			console.warn("getGameProgression unavailable for this game id:", gameId);
		}

		let calculatedPoints = 0;
		if (data.achievements || data.Achievements) {
			const achs = data.achievements || data.Achievements;
			const achList = Array.isArray(achs) ? achs : Object.values(achs);
			achList.forEach(ach => calculatedPoints += parseInt(ach.points || ach.Points || 0));
		}
		
		return {
			consoleId: data.consoleId || data.ConsoleId || data.ConsoleID,
			maxAch: data.numAchievements || data.NumAchievements || 0,
			achievements: data.achievements,
			pts: calculatedPoints || data.points || data.Points || 0,
			genre: data.genre || data.Genre || "Unknown",
			timeToMaster: parseInt(data.medianTimeToMaster) || 0,
			timeToBeatHardcore: parseInt(data.medianTimeToBeatHardcore) || 0,
			timeToBeat: parseInt(data.medianTimeToBeat) || 0,
			timeToComplete: parseInt(data.medianTimeToComplete) || 0,
			developer: data.developer || data.Developer || "Unknown",
			publisher: data.publisher || data.Publisher || "Unknown",
			released: data.released || data.Released || "Unknown",
			players: data.numDistinctPlayersCasual || data.NumDistinctPlayersCasual || 0,
			imageTitle: cleanImg(data.imageTitle || data.ImageTitle),
			imageIngame: cleanImg(data.imageIngame || data.ImageIngame),
			imageBoxArt: cleanImg(data.imageBoxArt || data.ImageBoxArt),
			imageIcon: cleanImg(data.imageIcon || data.ImageIcon),
			flags: data.flags || data.Flags || null,
			forumTopicID: data.forumTopicId || data.forumTopicID || data.ForumTopicId || data.ForumTopicID || null,
			guideURL: data.guideUrl || data.guideURL || data.GuideUrl || data.GuideURL || null,
			raUpdated: data.updated || data.Updated || null,
			consoleName: data.consoleName || data.ConsoleName || "Unknown",
			parentGameID: data.parentGameId || data.parentGameID || data.ParentGameId || data.ParentGameID || null,
			numDistinctPlayersCasual: data.numDistinctPlayersCasual || data.NumDistinctPlayersCasual || 0,
			numDistinctPlayersHardcore: data.numDistinctPlayersHardcore || data.NumDistinctPlayersHardcore || 0,
			userTotalPlaytime: data.userTotalPlaytime || data.UserTotalPlaytime || 0
		};
	} catch(e) {
		console.error("Failed fetching extended data for gameId:", gameId, e);
		return null;
	}
}

		// Global State Variables
window.userLibrary = {};
window.completedData = {};
window.masteredData = {};

let gamePool = {};
let currentWheelItems = [];
let selectedConsole = null;
let selectedGame = null;
let rotation = 0;
let isSpinning = false;
let isEditing = false;
let collapsedGroups = {};

let raCompletedGamesCache = JSON.parse(localStorage.getItem('ra_api_completed')) || [];
window.wtpGamesCache = [];
window.wtpActiveTab = null;

window.updateHistoryItemDOM = function(game, conName) {
	const li = document.getElementById(`history-item-${game.id}`);
	if (!li) return;
	const sortElement = document.getElementById('library-sort-select');
	const sortMode = sortElement ? sortElement.value : 'console';

	const isCompleted = completedData[conName] && completedData[conName].includes(game.id);
	const isMastered = masteredData[conName] && masteredData[conName].includes(game.id);
	const raData = raCompletedGamesCache.find(ra => String(ra.gameId || ra.GameID || ra.id) === String(game.raId));

	let numAchTotal = 0;
	let numAchHC = 0;
	let numPoss = game.maxAch || 0;

	if (raData) {
		numPoss = parseInt(raData.progData?.numPossibleAchievements || raData.maxPossible) || numPoss;
		numAchTotal = parseInt(raData.progData?.numAchieved || raData.numAwarded) || 0;
		numAchHC = parseInt(raData.progData?.numAchievedHardcore || raData.numAwardedHardcore) || 0;
	}

	if (isMastered) numAchHC = numPoss;
	if (isCompleted || isMastered) numAchTotal = numPoss;

	let numAchSoftcore = Math.max(0, numAchTotal - numAchHC);
	let trueMax = numPoss > 0 ? numPoss : (game.maxAch || '?');
	let progressPoss = numPoss > 0 ? numPoss : (game.maxAch || 1);
	
	let yellowPct = progressPoss > 0 ? (numAchHC / progressPoss) * 100 : 0;
	let bluePct = progressPoss > 0 ? (numAchSoftcore / progressPoss) * 100 : 0;
	if (isMastered && progressPoss > 0) { yellowPct = 100; bluePct = 0; }

	li.style.backgroundImage = `linear-gradient(to right, #eab308 0%, #eab308 ${yellowPct}%, #3b82f6 ${yellowPct}%, #3b82f6 ${yellowPct + bluePct}%, transparent ${yellowPct + bluePct}%)`;

	let imgOutline = '';
	if (isMastered) imgOutline = 'border: 2px solid #eab308;';
	else if (isCompleted) imgOutline = 'border: 2px solid #3b82f6;';
	else imgOutline = 'border: 2px solid transparent;';

	const imgContainer = document.getElementById(`history-item-img-${game.id}`);
	if (imgContainer) {
		if (game.imgId) {
			imgContainer.innerHTML = `<img src="https://media.retroachievements.org/Images/${game.imgId}.png" style="width:24px; height:24px; object-fit:cover; margin-right:8px; border-radius:4px; flex-shrink:0; box-sizing:border-box; ${imgOutline}">`;
		} else {
			imgContainer.innerHTML = `<div style="width:24px; height:24px; margin-right:8px; border-radius:4px; flex-shrink:0; box-sizing:border-box; ${imgOutline}; display:inline-block;"></div>`;
		}
	}

	let rightText = '';
	if (sortMode === 'time') {
		rightText = `<span style="font-size:0.6rem; color:#94a3b8;">${formatTime(game.timeToMaster)}</span>`;
	} else if (sortMode === 'hc_time') {
		rightText = `<span style="font-size:0.6rem; color:#94a3b8;">${formatTime(game.timeToBeatHardcore)}</span>`;
	} else if (sortMode === 'percentage') {
		let pct = game.maxAch > 0 ? (numAchTotal / game.maxAch) * 100 : 0;
		rightText = `<span style="font-size:0.6rem; color:#94a3b8;">${pct.toFixed(1)}%</span>`;
	} else if (sortMode === 'points') {
		rightText = `<span style="font-size:0.6rem; color:#94a3b8;">${game.pts} Pts</span>`;
	} else if (sortMode === 'genre') {
		rightText = `<span style="font-size:0.6rem; color:#94a3b8;">${game.genre}</span>`;
	} else if (sortMode === 'pph_hc') {
		rightText = `<span style="font-size:0.6rem; color:#94a3b8;">${game.pointsPerHourHC}</span>`;
	} else if (sortMode === 'developer') {
		rightText = `<span style="font-size:0.6rem; color:#94a3b8;">${game.developer}</span>`;
	} else if (sortMode === 'publisher') {
		rightText = `<span style="font-size:0.6rem; color:#94a3b8;">${game.publisher}</span>`;
	} else {
		if (isMastered) rightText = '👑';
		else if (isCompleted) rightText = '🎖️';
		else rightText = `<span style="font-size:0.6rem; color:#94a3b8;">${numAchTotal} / ${trueMax}</span>`;
	}

	const rightContainer = document.getElementById(`history-item-right-text-${game.id}`);
	if (rightContainer) {
		rightContainer.innerHTML = rightText;
	}

	if (window.activeSidebarInfo && window.activeSidebarInfo.id === `sidebar-info-${game.id}`) {
		let data = {
			title: game.name,
			// Track game's internal console ID through to HTML builder
			consoleId: game.consoleId || game.consoleID || game.conId || game.conID || game.console_id || '',
			imageBoxArt: game.imageBoxArt ? `${game.imageBoxArt}.png` : (game.imgId ? `${game.imgId}.png` : null),
			imageIcon: game.imgId ? `${game.imgId}.png` : null,
			publisher: game.publisher || "Unknown",
			developer: game.developer || "Unknown",
			released: game.released || "Unknown",
			numAchievements: game.maxAch || 0,
			missableIDs: game.missableIDs || 0,
			damagelessIDs: game.damagelessIDs || 0,
			speedrunIDs: game.speedrunIDs || 0,
			points: game.pts || 0,
			genre: game.genre || "Unknown",
			numDistinctPlayersCasual: game.players || 0,
			imageTitle: game.imageTitle ? `${game.imageTitle}.png` : null,
			imageIngame: game.imageIngame ? `${game.imageIngame}.png` : null,
			medianTimeToBeat: game.timeToBeat || 0,
			medianTimeToBeatHardcore: game.timeToBeatHardcore || 0,
			medianTimeToComplete: game.timeToComplete || 0,
			medianTimeToMaster: game.timeToMaster || 0,
			flags: game.flags || game.Flags || null,
			forumTopicID: game.forumTopicId || game.forumTopicID || game.ForumTopicId || game.ForumTopicID || null,
			guideURL: game.guideUrl || game.guideURL || game.GuideUrl || game.GuideURL || null,
			raUpdated: game.updated || game.Updated || null,
			consoleName: game.consoleName || game.ConsoleName || "Unknown",
			parentGameID: game.parentGameId || game.parentGameID || game.ParentGameId || game.ParentGameID || null,
			numDistinctPlayersCasual: game.numDistinctPlayersCasual || game.NumDistinctPlayersCasual || 0,
			numDistinctPlayersHardcore: game.numDistinctPlayersHardcore || game.NumDistinctPlayersHardcore || 0,
			userTotalPlaytime: game.userTotalPlaytime || game.UserTotalPlaytime || 0
		};
		window.activeSidebarInfo.innerHTML = generateGameInfoHtml(data, game.raId, true);
	}
};

let isFetchingExtended = false;
window.processExtendedFetchQueue = async function() {
	if (isFetchingExtended) return;
	isFetchingExtended = true;
	
	const user = localStorage.getItem('ra_user');
	const key = localStorage.getItem('ra_key');
	if (!user || !key) { isFetchingExtended = false; return; }
	
	let raApi, authorization;
	try {
		raApi = await import("https://esm.sh/@retroachievements/api");
		authorization = raApi.buildAuthorization({ username: user, webApiKey: key });
	} catch(e) { isFetchingExtended = false; return; }

	let gamesToProcess = [];
	const now = Date.now();
	const oneWeekMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

	// Open connection to your IndexedDB
	const db = await dbPromise; 

	// Fetch every single game from the 'games' store efficiently in one go
	const allGamesFromDB = await db.getAll('games'); 

	for (const g of allGamesFromDB) {
		// Extract the console name directly from the saved game object 
		// since we are no longer iterating through the userLibrary console keys
		const con = g.consoleName || 'Unknown';
		
		// FIX: Extremely strict completeness check.
		// It will only skip the queue if ALL data points exist and are valid.
		const hasCoreData = g.imageBoxArt && g.developer && g.genre && g.genre !== "Unknown";
		const hasStats = g.maxAch !== undefined && g.pts !== undefined;
		const hasProgression = g.timeToBeat !== undefined && g.timeToMaster !== undefined;
		
		const hasAllData = hasCoreData && hasStats && hasProgression;
		const hasData = g.extendedFetched === true && hasAllData;
		
		// Robust numeric parsing to prevent NaN math errors
		const parsedTime = parseInt(g.lastUpdated, 10);
		const updatedRecently = !isNaN(parsedTime) && (now - parsedTime < oneWeekMs);

		if (g.raId) {
			if (!hasData || !updatedRecently) {
				console.log(`[Queue Include] ${g.name || g.raId} - hasData: ${hasData}, updatedRecently: ${updatedRecently}`);
				gamesToProcess.push({ game: g, con: con });
			} else {
				console.log(`[Queue Skip] ${g.name || g.raId} is up to date.`);
			}
		}
	}

	const totalToFetch = gamesToProcess.length;
	let fetchedCount = 0;

	if (totalToFetch > 0) {
		const pContainer = document.getElementById('extended-progress-container');
		const pBar = document.getElementById('extended-progress-bar');
		const pText = document.getElementById('extended-progress-text');
		if(pContainer) pContainer.style.display = 'block';
		
		for (let i = 0; i < totalToFetch; i++) {
			const { game: g, con: conName } = gamesToProcess[i];
			try {
				console.log(`[Queue Fetch] Requesting API data for ${g.name || g.raId}...`);
				const ext = await fetchExtendedDataForGame(raApi, authorization, g.raId);
				if (ext) {
					let missableIDs = [];
					let damagelessIDs = [];
					let speedrunIDs = [];
					let storedAchievements = null;

					// REGEX: Catches common phrases used for "no damage" achievements (case-insensitive)
					const damagelessRegex = /without taking (any )?damage|without (being|getting) (hit|harmed|damaged|hurt)|without taking a hit|without taking (any )?health damage|without receiving (any )?health damage|without receiving (any )?damage|without suffering (any )?damage|without sustaining (any )?damage|taking no damage|taking zero damage|no damage taken|zero damage taken|no hits taken|taking no hits|without getting hit|without being hit/i;

					// REGEX: Updated to handle timestamp formats like "1:58" where unit words (seconds/minutes) are omitted
					const speedrunRegex = /(?:within|in under|under|in less than|with a time of|(?:complete|finish|beat|clear)\b.*?\bin) \d+(?::\d+){0,2}(?:\.\d+)?(?: (?:seconds|minutes|secs|mins|hours))?|\d+(?::\d+){0,2}(?:\.\d+)? (?:or less|or fewer)|with \d+(?::\d+){0,2}(?:\.\d+)?(?: (?:seconds|minutes|secs|mins|hours))? (?:remaining|left)/i;

					if (ext.achievements || ext.Achievements) {
						storedAchievements = ext.achievements || ext.Achievements;
						const achList = Array.isArray(storedAchievements) ? storedAchievements : Object.values(storedAchievements);
						
						achList.forEach(ach => {									
							const desc = ach.description || ach.Description || "";

							// Push achievement ID to missableIDs array when matched
							if (ach.type == "missable") {
								const achId = ach.ID !== undefined ? ach.ID : ach.id;
								if (achId !== undefined) missableIDs.push(achId);
							}

							// Push achievement ID to damagelessIDs array when matched
							if (damagelessRegex.test(desc)) {
								const achId = ach.ID !== undefined ? ach.ID : ach.id;
								if (achId !== undefined) damagelessIDs.push(achId);
							}

							// Push achievement ID to speedrunIDs array when matched
							if (speedrunRegex.test(desc)) {
								const achId = ach.ID !== undefined ? ach.ID : ach.id;
								if (achId !== undefined) speedrunIDs.push(achId);
							}
						});
					}

					ext.missableIDs = missableIDs;
					ext.damagelessIDs = damagelessIDs;
					ext.speedrunIDs = speedrunIDs;

					// FIX: Safely map keys handling both custom mapped names and raw RA API response names
					g.maxAch = ext.maxAch !== undefined ? ext.maxAch : ext.numAchievements;
					g.pts = ext.pts !== undefined ? ext.pts : ext.points;
					g.players = ext.players !== undefined ? ext.players : ext.numDistinctPlayersCasual;
					console.log(`Data returned for ${g.name}:`, ext);

					// FIX: Intercept "Unknown", split into an array, and standardize "Action-Adventure"
					let rawGenre = (ext.genre === "Unknown" || !ext.genre) ? "Not Available" : String(ext.genre);
					g.genre = rawGenre.split(',').map(genreStr => {
						let cleanGenre = genreStr.trim();
						let lowerGenre = cleanGenre.toLowerCase();
						if (lowerGenre === "action adventure" || lowerGenre === "action-adventure" || lowerGenre === "action/adventure") {
							return "Action-Adventure";
						}
						return cleanGenre;
					});

					g.consoleId = ext.consoleId;
					let targetCon = null;
					for (const [conName, conId] of Object.entries(RA_CONSOLE_IDS)) {
						if (conId === g.consoleId) {
							targetCon = conName;
							break;
						}
					}
					g.consoleName = targetCon;
					g.missableIDs = missableIDs;
					g.damagelessIDs = damagelessIDs;
					g.speedrunIDs= speedrunIDs;
					g.timeToMaster = ext.timeToMaster;
					g.timeToBeatHardcore = ext.timeToBeatHardcore;
					g.timeToBeat = ext.timeToBeat;
					g.timeToComplete = ext.timeToComplete;
					g.developer = ext.developer;
					g.publisher = ext.publisher;
					g.released = ext.released;
					g.imageTitle = ext.imageTitle;
					g.imageIngame = ext.imageIngame;
					g.imageBoxArt = ext.imageBoxArt;
					if (ext.imageIcon && !g.imgId) g.imgId = ext.imageIcon;
					g.extendedFetched = true;
					g.lastUpdated = Date.now();
					g.pointsPerHourHC = g.pts / ((g.timeToMaster / 60) / 60);
					g.pointsPerHourSC = g.pts / ((g.timeToComplete / 60) / 60);
					g.achievements = ext.achievements || null;
					g.flags = ext.flags;
					g.forumTopicID = ext.forumTopicID;
					g.guideURL = ext.guideURL;
					g.raUpdated = ext.updated;
					g.parentGameID = ext.parentGameID;
					g.numDistinctPlayersCasual = ext.numDistinctPlayersCasual;
					g.numDistinctPlayersHardcore = ext.numDistinctPlayersHardcore;
					g.userTotalPlaytime = ext.userTotalPlaytime;
												
					try {
						const db = await dbPromise;
						await db.put('games', g); // This instantly saves/updates the game in the database!
					} catch (dbErr) {
						console.error(`Failed to save ${g.name} to DB:`, dbErr);
					}

					// 1. Sync updated game directly to window.userLibrary in memory
					if (window.userLibrary && window.userLibrary[conName]) {
						const idx = window.userLibrary[conName].findIndex(item => 
							(item.id && item.id === g.id) || (item.raId && item.raId === g.raId)
						);
						if (idx !== -1) {
							window.userLibrary[conName][idx] = g;
						} else {
							window.userLibrary[conName].push(g);
						}
					}

					if (typeof window.updateHistoryItemDOM === 'function') {
						window.updateHistoryItemDOM(g, conName);
					}

					// Refresh active game info panel if currently expanded
					const sidebarDiv = document.getElementById(`sidebar-info-${g.id}`);
					if (sidebarDiv && window.activeSidebarInfo === sidebarDiv) {
						window.toggleSidebarGameInfo(g.id, g.raId, null);
						window.toggleSidebarGameInfo(g.id, g.raId, null);
					}
				} else {
					console.warn(`[Queue Warning] API returned empty data for ${g.name || g.raId}`);
				}
			} catch(e) {
				console.error(`[Queue Error] Failed fetching extended data for ${g.name || g.raId}`, e);
			}
			
			fetchedCount++;
			let pct = Math.floor((fetchedCount / totalToFetch) * 100);
			if(pBar) pBar.style.width = pct + '%';
			if(pText) pText.innerText = `Updating extended game information - ${pct}%`;
			
			// 2. Rebuild pool with updated memory state
			if (typeof rebuildPool === 'function') rebuildPool();
			
			// 3. Await async sidebar render to prevent render racing
			if (typeof renderSidebar === 'function') await renderSidebar();
			
			await new Promise(r => setTimeout(r, 500));
		}
		
		if(pContainer) pContainer.style.display = 'none';
	}
	isFetchingExtended = false;
}; 

window.forceUpdateAllExtended = async function() {
	try {
		const db = await dbPromise;
		
		// 1. Open a "readwrite" transaction for bulk updating
		const tx = db.transaction('games', 'readwrite');
		const store = tx.objectStore('games');
		
		// 2. Get all games from the database
		const allGamesFromDB = await store.getAll();
		
		// 3. Loop through and modify them
		for (const g of allGamesFromDB) {
			if (g.raId) {
				g.extendedFetched = false;
				delete g.lastUpdated; // Clear timestamp so it is forced to fetch
				
				// Save the updated game back into the transaction
				store.put(g); 
			}
		}
		
		// 4. Wait for the transaction to complete all saves
		await tx.done;
		
		// 5. Keep your in-memory RAM library synced with the database changes
		Object.keys(window.userLibrary).forEach(con => {
			window.userLibrary[con].forEach(g => {
				if (g.raId) {
					g.extendedFetched = false;
					delete g.lastUpdated;
				}
			});
		});
		window.processExtendedFetchQueue();
	} catch (error) {
		console.error("Failed to force update all extended data:", error);
	}
};

const canvas = document.getElementById('wheelCanvas'), ctx = canvas.getContext('2d'), overlay = document.getElementById('icon-overlay');

function rebuildPool() {
	gamePool = {};
	Object.keys(userLibrary).forEach(con => {
		const validGames = userLibrary[con].filter(g => g.name && g.name.trim() !== "");
		if (validGames.length > 0) {
			gamePool[con] = JSON.parse(JSON.stringify(validGames));
			
			if (completedData[con]) {
				completedData[con].forEach(completedId => {
					const idx = gamePool[con].findIndex(g => g.id === completedId || g.name === completedId);
					if (idx > -1) gamePool[con].splice(idx, 1);
				});
			}
			if (masteredData[con]) {
				masteredData[con].forEach(masteredId => {
					const idx = gamePool[con].findIndex(g => g.id === masteredId || g.name === masteredId);
					if (idx > -1) gamePool[con].splice(idx, 1);
				});
			}
			
			if (gamePool[con].length === 0) delete gamePool[con];
		}
	});
}

function shuffleArray(array) {
	let shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

const searchInput = document.getElementById('game-search');
const clearBtn = document.getElementById('clear-search-btn');
const container = document.getElementById('history-container');
const searchResultsContainer = document.getElementById('search-results-container');

searchInput.addEventListener('input', () => { 
	clearBtn.style.display = searchInput.value.length > 0 ? 'block' : 'none';
	renderSidebar(); 
});

clearBtn.addEventListener('click', () => {
	searchInput.value = '';
	clearBtn.style.display = 'none';
	renderSidebar();
});

container.addEventListener('click', (e) => {
	const clickedItem = e.target.closest('.search-result-item');
	if (clickedItem) handleQuickComplete(clickedItem.getAttribute('data-con'), clickedItem.getAttribute('data-gameid'), 'completed');
});


window.toggleGroupCollapse = function(groupId) {
	collapsedGroups[groupId] = !collapsedGroups[groupId];
	const isCollapsed = collapsedGroups[groupId];
	const section = document.getElementById(`console-section-${groupId}`);
	if (section) {
		const wrapper = section.querySelector('.history-list-wrapper');
		const arrow = section.querySelector('.collapse-arrow');
		const headerBg = section.querySelector('.console-header-bg');
		if (wrapper) wrapper.style.gridTemplateRows = isCollapsed ? '0fr' : '1fr';
		if (arrow) arrow.style.transform = `rotate(${isCollapsed ? '0deg' : '180deg'})`;
		if (headerBg) {           
			headerBg.classList.toggle('collapsed', isCollapsed);
			headerBg.classList.toggle('expanded', !isCollapsed);
		}
	}
}

window.toggleRASettings = function() {
	const wrapper = document.getElementById('ra-api-wrapper');
	const arrow = document.getElementById('ra-settings-arrow');
	if (wrapper.style.gridTemplateRows === '1fr') {
		wrapper.style.gridTemplateRows = '0fr';
		arrow.style.transform = 'rotate(0deg)';
	} else {
		wrapper.style.gridTemplateRows = '1fr';
		arrow.style.transform = 'rotate(180deg)';
	}
}

window.activeSidebarInfo = null;
window.toggleSidebarGameInfo = async function(gameId, raId, element) {
	const infoDiv = document.getElementById(`sidebar-info-${gameId}`);
	const wrapper = document.getElementById(`sidebar-info-wrapper-${gameId}`);
	const item = document.getElementById(`history-item-${gameId}`);

	if (!infoDiv || !wrapper || !item) return;

	if (wrapper.style.gridTemplateRows === '1fr') {
		wrapper.style.gridTemplateRows = '0fr';
		infoDiv.style.opacity = '0';
		item.classList.remove('expanded');
		window.activeSidebarInfo = null;
		return;
	}

	if (window.activeSidebarInfo && window.activeSidebarInfo !== infoDiv) {
		const oldWrapper = window.activeSidebarInfo.closest('.sidebar-info-wrapper');
		const oldItem = window.activeSidebarInfo.closest('li')?.querySelector('.history-item');

		if (oldWrapper) {
			oldWrapper.style.gridTemplateRows = '0fr';
		}
		window.activeSidebarInfo.style.opacity = '0';

		if (oldItem) {
			oldItem.classList.remove('expanded');
		}
	}

	window.activeSidebarInfo = infoDiv;
	wrapper.style.gridTemplateRows = '1fr';
	infoDiv.style.opacity = '1';
	item.classList.add('expanded');

	// FIX: Include the "not fetched yet" text in the condition so it forces a re-render
	// when the data is finally available.
	const needsRender = infoDiv.innerHTML.trim() === '' || 
						infoDiv.innerHTML.includes('Loading info...') || 
						infoDiv.innerHTML.includes('Extended info not fetched yet');

	if (needsRender) {
		// NEW: Fetch directly from IndexedDB using the primary key
		const db = await dbPromise;
		const foundGame = await db.get('games', gameId);

		if (!foundGame || !foundGame.extendedFetched) {
			infoDiv.innerHTML = '<p style="color:var(--accent); font-size:0.7rem; text-align:center; padding: 10px 0;">Extended info not fetched yet. Click "Update All Games" or wait for background process.</p>';
			return;
		}

		// Map data for generateGameInfoHtml ensuring all required keys are present
		let data = {
			id: foundGame.id, // Passed so YouTube lookup fallback works
			consoleName: foundGame.consoleName, // Passed so YouTube lookup fallback works
			title: foundGame.name || foundGame.title,
			imageBoxArt: foundGame.imageBoxArt ? `${foundGame.imageBoxArt}.png` : (foundGame.imgId ? `${foundGame.imgId}.png` : null),
			imageIcon: foundGame.imgId ? `${foundGame.imgId}.png` : null,
			publisher: foundGame.publisher || "Unknown",
			developer: foundGame.developer || "Unknown",
			released: foundGame.released || "Unknown",
			numAchievements: foundGame.maxAch || 0,
			achievements: foundGame.achievements || null, // MUST be included for progress calculations
			missableIDs: foundGame.missableIDs || [],
			damagelessIDs: foundGame.damagelessIDs || [],
			speedrunIDs: foundGame.speedrunIDs || [],
			points: foundGame.pts || 0,
			genre: foundGame.genre || "Unknown",
			players: foundGame.players || 0,
			imageTitle: foundGame.imageTitle ? `${foundGame.imageTitle}.png` : null,
			imageIngame: foundGame.imageIngame ? `${foundGame.imageIngame}.png` : null,
			medianTimeToBeat: foundGame.timeToBeat || 0,
			medianTimeToBeatHardcore: foundGame.timeToBeatHardcore || 0,
			medianTimeToComplete: foundGame.timeToComplete || 0,
			medianTimeToMaster: foundGame.timeToMaster || 0,
			flags: foundGame.flags || foundGame.Flags || null,
			forumTopicID: foundGame.forumTopicId || foundGame.forumTopicID || foundGame.ForumTopicId || foundGame.ForumTopicID || null,
			guideURL: foundGame.guideUrl || foundGame.guideURL || foundGame.GuideUrl || foundGame.GuideURL || null,
			raUpdated: foundGame.updated || foundGame.Updated || null,
			consoleName: foundGame.consoleName || foundGame.ConsoleName || "Unknown",
			parentGameID: foundGame.parentGameId || foundGame.parentGameID || foundGame.ParentGameId || foundGame.ParentGameID || null,
			numDistinctPlayersCasual: foundGame.numDistinctPlayersCasual || foundGame.NumDistinctPlayersCasual || 0,
			numDistinctPlayersHardcore: foundGame.numDistinctPlayersHardcore || foundGame.NumDistinctPlayersHardcore || 0,
			userTotalPlaytime: foundGame.userTotalPlaytime || foundGame.UserTotalPlaytime || 0
		};

		infoDiv.innerHTML = window.generateGameInfoHtml(data, raId, true);
	}
}

function getGenres(genre) {
	if (Array.isArray(genre)) {
		return genre.map(g => g.trim()).filter(Boolean);
	}

	if (typeof genre === "string" && genre.trim()) {
		return genre.split(",").map(g => g.trim()).filter(Boolean);
	}

	return ["Unknown"];
}

// ==========================================
// 1. HELPER: Generate Game List Item HTML
// ==========================================
function createSidebarListItemHtml(game, con, options = {}) {
	const { sortMode = 'console', isGenreItem = false, currentlyOpenId = null, currentlyOpenHtml = '' } = options;

	const isCompleted = game.isCompleted !== undefined ? game.isCompleted : (completedData[con] && completedData[con].includes(game.id));
	const isMastered = game.isMastered !== undefined ? game.isMastered : (masteredData[con] && masteredData[con].includes(game.id));

	let numAchTotal = game.numAchTotal !== undefined ? game.numAchTotal : 0;
	let numAchHC = game.numAchHC !== undefined ? game.numAchHC : 0;
	let numPoss = game.numAch !== undefined ? game.numAch : 0;

	if (game.numAchTotal === undefined) {
		const raData = raCompletedGamesCache.find(ra => String(ra.gameId || ra.GameID || ra.id) === String(game.raId));
		if (raData) {
			numPoss = parseInt(raData.progData?.numPossibleAchievements || raData.maxPossible) || 0;
			numAchTotal = parseInt(raData.progData?.numAchieved || raData.numAwarded) || 0;
			numAchHC = parseInt(raData.progData?.numAchievedHardcore || raData.numAwardedHardcore) || 0;
		}
	}

	let numAchSoftcore = Math.max(0, numAchTotal - numAchHC);
	let trueMax = numPoss > 0 ? numPoss : (game.maxAch || '?');
	let progressPoss = numPoss > 0 ? numPoss : (game.maxAch || 1);
	
	let yellowPct = progressPoss > 0 ? (numAchHC / progressPoss) * 100 : 0;
	let bluePct = progressPoss > 0 ? (numAchSoftcore / progressPoss) * 100 : 0;
	if (isMastered && progressPoss > 0) { yellowPct = 100; bluePct = 0; }

	let imgOutline = isMastered ? 'border: 2px solid #eab308;' : isCompleted ? 'border: 2px solid #3b82f6;' : 'border: 2px solid transparent;';

	let imgHtml = game.imgId 
		? `<img src="https://media.retroachievements.org/Images/${game.imgId}.png" style="width:24px; height:24px; object-fit:cover; margin-right:8px; border-radius:4px; flex-shrink:0; box-sizing:border-box; ${imgOutline}">`
		: `<div style="width:24px; height:24px; margin-right:8px; border-radius:4px; flex-shrink:0; box-sizing:border-box; ${imgOutline}; display:inline-block;"></div>`;

	let rightText = '';
	if (isGenreItem) {
		rightText = `<span style="font-size:0.6rem; color:#94a3b8;">${game.genre || 'Unknown'}</span>`;
	} else if (sortMode === 'time' && typeof formatTime === 'function') {
		rightText = `<span style="font-size:0.6rem; color:#94a3b8;">${formatTime(game.time)}</span>`;
	} else if (sortMode === 'hc_time' && typeof formatTime === 'function') {
		rightText = `<span style="font-size:0.6rem; color:#94a3b8;">${formatTime(game.hcTime)}</span>`;
	} else if (sortMode === 'pph_hc') {
		let pph = game.time > 0 ? (game.pts / (game.time / 3600)) : 0;
		rightText = `<span style="font-size:0.6rem; color:#94a3b8;">${game.time > 0 ? pph.toFixed(1) + ' PPH' : 'Unknown'}</span>`;
	} else if (sortMode === 'percentage') {
		let pct = progressPoss > 0 ? (numAchTotal / progressPoss) * 100 : 0;
		rightText = `<span style="font-size:0.6rem; color:#94a3b8;">${pct.toFixed(1)}%</span>`;
	} else if (sortMode === 'points') {
		rightText = `<span style="font-size:0.6rem; color:#94a3b8;">${game.pts || 0} Pts</span>`;
	} else if (sortMode === 'developer') {
		rightText = `<span style="font-size:0.6rem; color:#94a3b8;">${game.developer}</span>`;
	} else if (sortMode === 'publisher') {
		rightText = `<span style="font-size:0.6rem; color:#94a3b8;">${game.publisher}</span>`;
	} else {
		if (isMastered) rightText = '👑';
		else if (isCompleted) rightText = '🎖️';
		else rightText = `<span style="font-size:0.6rem; color:#94a3b8;">${numAchTotal} / ${trueMax}</span>`;
	}

	const genres = getGenres(game.genre);
	const genreDataAttr = isGenreItem ? `data-genres="${genres.join("|")}"` : "";
	const itemClass = isGenreItem ? 'history-item genre-item' : 'history-item';
	
	let consoleKey = null;
	if (game.consoleId && typeof RA_CONSOLE_IDS !== 'undefined') consoleKey = Object.keys(RA_CONSOLE_IDS).find(key => RA_CONSOLE_IDS[key] == game.consoleId);
	const consoleFullName = (con && typeof CONSOLE_FULL_NAMES !== 'undefined') ? CONSOLE_FULL_NAMES[con] : null;
	const customConsoleImgUrl = (consoleKey && typeof CONSOLE_IMAGES !== 'undefined') ? CONSOLE_IMAGES[consoleKey] : null;
	const consoleIconHtml = customConsoleImgUrl
		? `<img src="${customConsoleImgUrl}" title="${consoleFullName}" style="height:14px; width:auto; object-fit:contain; margin-right:6px;" alt="${con} icon">`
		: (game.consoleId ? `<img src="https://media.retroachievements.org/Images/Console/${game.consoleId}.png" style="width:16px; height:16px; margin-right:4px;" onerror="this.style.display='none'">` : ``);

	// --- NEW LOGIC: Extract and style tilde tags ---
	let cleanName = game.name || '';
	let tagsHtml = '';
	const tagMatches = cleanName.match(/~([^~]+)~/g);
	
	if (tagMatches) {
		tagMatches.forEach(match => {
			// Remove the tildes for the displayed text
			const tagText = match.replace(/~/g, '');
			// Append the styled badge (added minor padding and margin so it looks clean)
			tagsHtml += `<span style="color: black; background: white; border: 0px; border-radius: 4px; padding: 2px 4px; margin-left: 5px; font-size: 0.75em; font-weight: bold;">${tagText}</span>`;
		});
		// Strip the tags from the main title text
		cleanName = cleanName.replace(/~([^~]+)~/g, '').trim();
	}
	// -------------------------------------------------

	return `
		<li id="history-list-wrapper-${game.id}" style="display: flex; flex-direction: column; width: 100%; list-style: none; margin: 0; padding: 0;">
			<div id="history-item-${game.id}" class="${itemClass} ${currentlyOpenId === game.id ? 'expanded' : 'collapsed'}" ${genreDataAttr} style="background-image: linear-gradient(to right, #eab308 0%, #eab308 ${yellowPct}%, #3b82f6 ${yellowPct}%, #3b82f6 ${yellowPct + bluePct}%, transparent ${yellowPct + bluePct}%);" onclick="toggleSidebarGameInfo('${game.id}', '${game.raId}', this)">
				<div style="display:flex; width:100%; justify-content:space-between; align-items:center;">
					<div style="display:flex; align-items:center; flex-shrink:1; min-width:0;">
						<span id="history-item-img-${game.id}" style="display:flex;">${imgHtml}</span>
						<span class="game-title-text" style="color:var(--text); z-index:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${cleanName}${tagsHtml}</span>
						${sortMode !== 'console' ? `<span style="font-size:0.6rem; color:#64748b; margin-left: 6px;">${consoleIconHtml}</span>` : ''}
					</div>
					<div style="display:flex; align-items:center; gap: 8px; z-index:1; flex-shrink:0;">
						<span id="history-item-right-text-${game.id}">${rightText}</span>
						<button class="delete-btn" onclick="event.stopPropagation(); removeHistoryEntry('${con}', '${game.id}')">✕</button>
					</div>
				</div>
			</div>
			<div id="sidebar-info-wrapper-${game.id}" class="sidebar-info-wrapper" style="position: relative; z-index: 1; display: grid; grid-template-rows: ${currentlyOpenId === game.id ? '1fr' : '0fr'}; transition: grid-template-rows 0.3s ease; width: 100%;">
				<div style="overflow: hidden;">
					<div id="sidebar-info-${game.id}" class="sidebar-inline-info" style="display:flex; flex-direction:column; padding:10px; cursor:default; opacity: ${currentlyOpenId === game.id ? '1' : '0'}; transition: opacity 0.3s ease; background: rgba(0, 0, 0, 0.2); border: solid 1px var(--border); border-top: none; box-shadow: 2px 2px 0px 0px var(--bg) inset, -2px -2px 0px 0px var(--border) inset; border-radius: 0px 0px 10px 10px;" onclick="event.stopPropagation()">
						${currentlyOpenId === game.id ? currentlyOpenHtml : ''}
					</div>
				</div>
			</div>
		</li>`;
}

// ==========================================
// 2. RENDER: Search Overlay
// ==========================================
function renderSidebarSearch(term, currentlyOpenId, currentlyOpenHtml) {
	searchResultsContainer.innerHTML = '';
	
	if (!term) {
		searchResultsContainer.style.display = 'none';
		return;
	}

	searchResultsContainer.style.display = 'flex';
	searchResultsContainer.innerHTML = `<p style="font-size:0.7rem; color:var(--primary); margin-bottom:10px;">SEARCH RESULTS:</p>`;
	
	let listHtml = `<ul class="history-list" style="padding: 4px; border: 1px solid var(--border); border-radius: 5px; max-height: 50dvh; overflow-y: scroll;">`;
	let found = false;

	Object.keys(userLibrary).forEach(con => {
		userLibrary[con].forEach(game => {
			const isCompleted = completedData[con] && completedData[con].includes(game.id);
			const isMastered = masteredData[con] && masteredData[con].includes(game.id);

			if (game.name && game.name.toLowerCase().includes(term)) {
				found = true;
				listHtml += createSidebarListItemHtml(game, con, { currentlyOpenId, currentlyOpenHtml });
			}
		});
	});
	if (found) searchResultsContainer.innerHTML += listHtml;
}


// ==========================================
// 3. RENDER: Default Console Sort
// ==========================================
function renderSidebarByConsole(currentlyOpenId, currentlyOpenHtml) {
	let hasAnyGames = false;

	// Grab the current checkbox states
	const filterAch = document.getElementById('achievements-spin-filter') ? document.getElementById('achievements-spin-filter').checked : false;
	const filterDamageless = document.getElementById('damageless-spin-filter') ? document.getElementById('damageless-spin-filter').checked : false;
	const filterSpeedrun = document.getElementById('speedrun-spin-filter') ? document.getElementById('speedrun-spin-filter').checked : false;

	Object.keys(userLibrary).sort().forEach(con => {
		if (con && con.toLowerCase() === 'events') return '';
		if (con && con.toLowerCase() === 'hubs') return '';
		
		// Apply the same strict filtering rules used for the game wheel
		let games = userLibrary[con].filter(g => {
			// Must have a valid name
			if (!g.name || g.name.trim() === "") return false;
			
			// Check against active filters
			if (filterAch && (!g.maxAch || parseInt(g.maxAch) === 0)) return false;
			if (filterDamageless && g.damagelessIDs && parseInt(g.damagelessIDs.length) > 0) return false;
			if (filterSpeedrun && g.speedrunIDs && parseInt(g.speedrunIDs.length) > 0) return false;
			
			return true; // Passes all conditions
		});

		// Skip the entire console block if filters leave it with 0 games
		if (games.length === 0) return;
		
		hasAnyGames = true;
		
		games.sort((a, b) => {
			const cleanA = (a.name || '').replace(/~([^~]+)~/g, '').trim();
			const cleanB = (b.name || '').replace(/~([^~]+)~/g, '').trim();
			return cleanA.localeCompare(cleanB);
		});

		if (collapsedGroups[con] === undefined) collapsedGroups[con] = true;
		const isCollapsed = collapsedGroups[con];

		// Stats tracking for the console header (this will now only count visible games)
		let comp = 0;
		games.forEach(g => {
			if ((completedData[con] && completedData[con].includes(g.id)) || (masteredData[con] && masteredData[con].includes(g.id))) comp++;
		});

		const pct = Math.min(100, Math.round((comp / Math.max(1, games.length)) * 100));
		const color = CONSOLE_COLORS[con] || 'var(--primary)';
		const icon = CONSOLE_IMAGES[con] || '';
		const displayTitle = (CONSOLE_FULL_NAMES[con] || con).replace(/\//g, " / ");

		let html = `
		<div class="console-section" id="console-section-${con}">
			<div class="console-header-bg ${isCollapsed ? 'collapsed' : 'expanded'}" onclick="toggleGroupCollapse('${con}')" style="cursor:pointer; user-select:none; transition: background 0.2s; padding: 5px; border-radius: 4px;">
				<div class="console-header-box" style="margin-bottom: 0; border-bottom: none; padding-bottom: 0;">
					${icon ? `<img src="${icon}" class="console-icon">` : `<span style="font-size:10px; width:32px; display:inline-block; text-align:center;">${con}</span>`}
					<span class="console-title" style="flex-grow:1;">${displayTitle}</span>
					<span class="collapse-arrow" style="font-size:0.6rem; color:#94a3b8; transition: transform 0.3s ease; transform: rotate(${isCollapsed ? '0deg' : '180deg'}); display: inline-block;">▼</span>
				</div>
				<div style="display: flex; align-items: center;">
					<div style="flex-grow: 1; background: #1e293b; height: 8px; border-radius: 4px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);">
						<div style="background: ${color}; width: ${pct}%; height: 100%; border-radius: 4px; box-shadow: 0 0 5px ${color};"></div>
					</div>
					<span style="font-size: 0.7rem; color: #94a3b8; width: 35px; text-align: right;">${comp}/${games.length}</span>
				</div>
			</div>
			<div class="history-list-wrapper" style="display: grid; grid-template-rows: ${isCollapsed ? '0fr' : '1fr'}; transition: grid-template-rows 0.3s ease;">
				<div style="overflow: hidden;">
					<ul class="history-list" style="padding: 4px 4px 0px; border-style: solid; border-width: 0px 1px 1px 1px; border-color: var(--border); border-radius: 0px 0px 5px 5px; box-shadow: inset 2px 2px 5px 2px #00000050; background: rgba(0, 0, 0, 0.1);">`;
		
		games.forEach(game => {
			html += createSidebarListItemHtml(game, con, { sortMode: 'console', currentlyOpenId, currentlyOpenHtml });
		});
		
		html += `</ul></div></div></div>`;
		
		container.insertAdjacentHTML('beforeend', html);
	});

	return hasAnyGames;
}

// ==========================================
// 4. RENDER: Genre Sort
// ==========================================
function renderSidebarByGenre(allGames, currentlyOpenId, currentlyOpenHtml) {
	allGames = allGames.filter(g => !g.con || g.con.toLowerCase() !== 'events');
	allGames = allGames.filter(g => !g.con || g.con.toLowerCase() !== 'hubs');
	if (allGames.length === 0) return false;
	let uniqueGenres = new Set();

	allGames.forEach(game => {
		getGenres(game.genre).forEach(genre => uniqueGenres.add(genre));
	});
	
	
	let sortedGenres = Array.from(uniqueGenres).sort();
	
	let genreContainer = document.createElement('div');
	genreContainer.style.cssText = "display:grid; grid-template-columns: 1fr 1fr; gap:8px; padding:10px; background:rgba(0,0,0,0.2); border-radius:5px; margin-bottom:10px; max-height:150px; overflow-y:auto; direction: rtl;";
	
	sortedGenres.forEach(genre => {
		let label = document.createElement('label');
		label.style.cssText = "display:flex; align-items:center; gap:4px; font-size:0.75rem; color:var(--text); cursor:pointer; direction: ltr;";
		label.innerHTML = `<input type="checkbox" class="genre-filter-cb" style="width: auto; margin: 0" value="${genre.replace(/"/g, '&quot;')}"> ${genre}`;
		genreContainer.appendChild(label);
	});
	container.appendChild(genreContainer);

	allGames.sort((a, b) => {
		const cleanA = (a.name || '').replace(/~([^~]+)~/g, '').trim();
		const cleanB = (b.name || '').replace(/~([^~]+)~/g, '').trim();
		return cleanA.localeCompare(cleanB);
	});

	const section = document.createElement('div');
	section.className = 'console-section';
	
	let listHtml = `<div class="history-list-wrapper" style="display: grid; grid-template-rows: 1fr; width: 100%;">
						<div style="overflow: hidden;">
							<ul class="history-list genre-game-list" style="padding: 4px; border: 1px solid var(--border); border-radius: 5px;">`;

	allGames.forEach(game => {
		listHtml += createSidebarListItemHtml(game, game.con, { sortMode: 'genre', isGenreItem: true, currentlyOpenId, currentlyOpenHtml });
	});
	
	listHtml += `</ul></div></div>`;
	section.innerHTML = listHtml;
	container.appendChild(section);

	genreContainer.addEventListener('change', (e) => {
		if (e.target.classList.contains('genre-filter-cb')) {
			const checkboxes = Array.from(genreContainer.querySelectorAll('.genre-filter-cb:checked'));
			const selectedGenres = checkboxes.map(cb => cb.value);
			const items = section.querySelectorAll('.genre-item');
			
			items.forEach(item => {
				const itemGenres = item.getAttribute('data-genres').split('|');
				if (selectedGenres.length === 0) {
					item.style.display = ''; // IF NOTHING IS CHECKED, SHOW ALL
				} else {
					const hasAll = selectedGenres.every(sg => itemGenres.includes(sg));
					item.style.display = hasAll ? '' : 'none';
				}
			});
		}
	});

	return true;
}

// ==========================================
// 5. RENDER: Category Group Sort
// ==========================================
function renderSidebarByGroup(allGames, sortMode, currentlyOpenId, currentlyOpenHtml) {
	if (allGames.length === 0) return false;
	
	function getTimeGroupName(timeInSecs) {
		if (!timeInSecs || timeInSecs === 0) return "Unknown";
		let hours = timeInSecs / 3600;
		if (hours < 1) return "Under 1 Hour";
		if (hours <= 2) return "1 - 2 Hours";
		if (hours <= 4) return "2 - 4 Hours";
		if (hours <= 8) return "4 - 8 Hours";
		if (hours <= 12) return "8 - 12 Hours";
		if (hours <= 16) return "12 - 16 Hours";
		if (hours <= 24) return "16 - 24 Hours";
		if (hours <= 36) return "24 - 36 Hours";
		if (hours <= 48) return "36 - 48 Hours";
		return "48+ Hours";
	}

	let groups = {};
	allGames.forEach(g => {
		if (g.con && g.con.toLowerCase() === 'events') return '';
		if (g.con && g.con.toLowerCase() === 'hubs') return '';
		let groupName = "Unknown";
		if (sortMode === 'achievements') {
			if (g.numAch === 0) groupName = "No Achievements";
			else if (g.numAch <= 25) groupName = "1 - 25 Achievements";
			else if (g.numAch <= 50) groupName = "26 - 50 Achievements";
			else if (g.numAch <= 100) groupName = "51 - 100 Achievements";
			else groupName = "100+ Achievements";
		} else if (sortMode === 'points') {
			if (g.pts === 0) groupName = "No Achievements";
			else if (g.pts <= 99) groupName = "1 - 99 Points";
			else if (g.pts <= 249) groupName = "100 - 249 Points";
			else if (g.pts <= 499) groupName = "250 - 499 Points";
			else if (g.pts <= 749) groupName = "500 - 749 Points";
			else if (g.pts <= 999) groupName = "750 - 999 Points";
			else groupName = "1000+ Points";
		} else if (sortMode === 'time') {
			groupName = getTimeGroupName(g.time);
		} else if (sortMode === 'hc_time') {
			groupName = getTimeGroupName(g.hcTime);
		} else if (sortMode === 'percentage') {
			let pct = g.numAch > 0 ? Math.floor((g.numAchTotal / g.numAch) * 100) : 0;
			if (g.numAch === 0) groupName = "No Achievements";
			else if (pct === 0) groupName = "Not Started";
			else if (pct < 10) groupName = "1 - 9%";
			else if (pct < 20) groupName = "10 - 19%";
			else if (pct < 30) groupName = "20 - 29%";
			else if (pct < 40) groupName = "30 - 39%";
			else if (pct < 50) groupName = "40 - 49%";
			else if (pct < 60) groupName = "50 - 59%";
			else if (pct < 70) groupName = "60 - 69%";
			else if (pct < 80) groupName = "70 - 79%";
			else if (pct < 90) groupName = "80 - 89%";
			else if (pct < 100) groupName = "90 - 99%";
			else groupName = "100%";
		} else if (sortMode === 'release_year') {					
			let released = g.released;
			if (released) {
				const match = String(released).match(/^(\d{4})/);
				if (match) released = match[1];
			}
			if (released < 1980) groupName = "1970 - 1979";
			else if (released < 1990) groupName = "1980 - 1989";
			else if (released < 2000) groupName = "1990 - 1999";
			else if (released < 2010) groupName = "2000 - 2009";
			else if (released < 2020) groupName = "2010 - 2019";
			else if (released < 2030) groupName = "2020 - 2029";
			else groupName = "Unknown";
		} else if (sortMode === 'pph_hc') {
			let pph = g.time > 0 ? g.pts / (g.time / 3600) : 0;
			if (g.numAch === 0) groupName = "No Achievements";
			else if (g.time === 0) groupName = "Unknown";
			else if (pph <= 10) groupName = "1 - 10 Points per Hour";
			else if (pph <= 20) groupName = "11 - 20 Points per Hour";
			else if (pph <= 35) groupName = "21 - 35 Points per Hour";
			else if (pph <= 50) groupName = "36 - 50 Points per Hour";
			else if (pph <= 65) groupName = "51 - 65 Points per Hour";
			else if (pph <= 80) groupName = "66 - 80 Points per Hour";
			else if (pph <= 100) groupName = "81 - 100 Points per Hour";
			else if (pph <= 115) groupName = "101 - 115 Points per Hour";
			else groupName = "116+ Points per Hour";
		} else if (sortMode === 'title') {
			groupName = (g.name || '').replace(/~([^~]+)~/g, '').trim().charAt(0).toUpperCase() || "Unknown";
		} else if (sortMode === 'developer') {
			groupName = (g.developer || '').trim().charAt(0).toUpperCase() || "Unknown";
		} else if (sortMode === 'publisher') {
			groupName = (g.publisher || '').trim().charAt(0).toUpperCase() || "Unknown";
		}
		if (!groups[groupName]) groups[groupName] = [];
		groups[groupName].push(g);
	});

	const timeOrder = ["Under 1 Hour", "1 - 2 Hours", "2 - 4 Hours", "4 - 8 Hours", "8 - 12 Hours", "12 - 16 Hours", "16 - 24 Hours", "24 - 36 Hours", "36 - 48 Hours", "48+ Hours", "Unknown"];
	const pctOrder = ["Not Started", "1 - 9%", "10 - 19%", "20 - 29%", "30 - 39%", "40 - 49%", "50 - 59%", "60 - 69%", "70 - 79%", "80 - 89%", "90 - 99%", "100%", "No Achievements"];
	const achOrder = ["1 - 25 Achievements", "26 - 50 Achievements", "51 - 100 Achievements", "100+ Achievements", "No Achievements"];
	const ptsOrder = ["1 - 99 Points", "100 - 249 Points", "250 - 499 Points", "500 - 749 Points", "750 - 999 Points", "1000+ Points", "No Achievements"];
	const pphOrder = ["116+ Points per Hour", "101 - 115 Points per Hour", "81 - 100 Points per Hour", "66 - 80 Points per Hour", "51 - 65 Points per Hour", "36 - 50 Points per Hour", "21 - 35 Points per Hour", "11 - 20 Points per Hour", "1 - 10 Points per Hour", "Unknown", "No Achievements"];
	const releaseOrder = ["1970 - 1979", "1980 - 1989", "1990 - 1999", "2000 - 2009", "2010 - 2019", "2020 - 2029", "Unknown"];

	let groupKeys = Object.keys(groups).sort((a,b) => {
		if (a === "No Achievements" || a === "Unknown") return 1;
		if (b === "No Achievements" || b === "Unknown") return -1;
		
		if (sortMode === 'time' || sortMode === 'hc_time') return timeOrder.indexOf(a) - timeOrder.indexOf(b);
		if (sortMode === 'percentage') return pctOrder.indexOf(a) - pctOrder.indexOf(b);
		if (sortMode === 'achievements') return achOrder.indexOf(a) - achOrder.indexOf(b);
		if (sortMode === 'points') return ptsOrder.indexOf(a) - ptsOrder.indexOf(b);
		if (sortMode === 'pph_hc') return pphOrder.indexOf(a) - pphOrder.indexOf(b);
		if (sortMode === 'release_year') return releaseOrder.indexOf(a) - releaseOrder.indexOf(b);
		if (sortMode === 'title') return a.localeCompare(b);
		if (sortMode === 'developer') return a.localeCompare(b);
		if (sortMode === 'publisher') return a.localeCompare(b);
		
		return (parseInt(a.replace(/[^0-9]/g, '')) || 0) - (parseInt(b.replace(/[^0-9]/g, '')) || 0);
	});

	groupKeys.forEach(gName => {
		let games = groups[gName];

		// Helper function to handle fallback alphabetical sorting while ignoring tilde tags
		const cleanCompare = (a, b) => {
			const cleanA = (a.name || '').replace(/~([^~]+)~/g, '').trim();
			const cleanB = (b.name || '').replace(/~([^~]+)~/g, '').trim();
			return cleanA.localeCompare(cleanB);
		};
						
		if (sortMode === 'time') games.sort((a, b) => (a.time || 0) - (b.time || 0) || cleanCompare(a, b));
		else if (sortMode === 'hc_time') games.sort((a, b) => (a.hcTime || 0) - (b.hcTime || 0) || cleanCompare(a, b));
		else if (sortMode === 'percentage') games.sort((a, b) => {
			let pctA = a.numAch > 0 ? (a.numAchTotal / a.numAch) : 0;
			let pctB = b.numAch > 0 ? (b.numAchTotal / b.numAch) : 0;
			return pctA - pctB || cleanCompare(a, b);
		});
		else if (sortMode === 'achievements') games.sort((a, b) => (a.numAch || 0) - (b.numAch || 0) || cleanCompare(a, b));
		else if (sortMode === 'points') games.sort((a, b) => (a.pts || 0) - (b.pts || 0) || cleanCompare(a, b));
		else if (sortMode === 'pph_hc') games.sort((a, b) => {
			let pphA = a.time > 0 ? a.pts / (a.time / 3600) : 0;
			let pphB = b.time > 0 ? b.pts / (b.time / 3600) : 0;
			return pphB - pphA || cleanCompare(a, b); // Sorts highest to lowest!
		});				
		else if (sortMode === 'release_year') games.sort((a, b) => {
			return (a.released || '').localeCompare(b.released || '') || cleanCompare(a, b);
		});			
		else if (sortMode === 'title') games.sort((a, b) => {
			return cleanCompare(a, b);
		});			
		else if (sortMode === 'developer') games.sort((a, b) => {
			return (a.developer || '').localeCompare(b.developer || '') || cleanCompare(a, b);
		});			
		else if (sortMode === 'publisher') games.sort((a, b) => {
			return (a.publisher || '').localeCompare(b.publisher || '') || cleanCompare(a, b);
		});
		else games.sort(cleanCompare);
		
		const safeGroupId = gName.replace(/[^a-zA-Z0-9]/g, '_');
		if (collapsedGroups[safeGroupId] === undefined) collapsedGroups[safeGroupId] = true;
		const isCollapsed = collapsedGroups[safeGroupId];

		let html = `
		<div class="console-section" id="console-section-${safeGroupId}">
			<div class="console-header-bg ${isCollapsed ? 'collapsed' : 'expanded'}" onclick="toggleGroupCollapse('${safeGroupId}')" style="cursor:pointer; user-select:none; transition: background 0.2s; padding: 6px; border-radius: 4px;">
				<div class="console-header-box" style="margin-bottom: 0; border-bottom: none; padding-bottom: 0; display:flex; align-items:center;">
					<span class="console-title" style="flex-grow:1;">${gName}</span>
					<span style="font-size:0.7rem; color:#94a3b8; margin-right:8px;">${games.length}</span>
					<span class="collapse-arrow" style="font-size:0.6rem; color:#94a3b8; transition: transform 0.3s ease; transform: rotate(${isCollapsed ? '0deg' : '180deg'}); display: inline-block;">▼</span>
				</div>
			</div>
			<div class="history-list-wrapper" style="display: grid; grid-template-rows: ${isCollapsed ? '0fr' : '1fr'}; transition: grid-template-rows 0.3s ease;">
				<div style="overflow: hidden;">
					<ul class="history-list" style="padding: 4px 4px 0px; border-style: solid; border-width: 0px 1px 1px 1px; border-color: var(--border); border-radius: 0px 0px 5px 5px;">`;
		
		games.forEach(game => {
			html += createSidebarListItemHtml(game, game.con, { sortMode, currentlyOpenId, currentlyOpenHtml });
		});
		html += `</ul></div></div></div>`;
		container.insertAdjacentHTML('beforeend', html);
	});
	
	return true;
}

// ==========================================
// 6. MASTER FUNCTION: Render Sidebar
// ==========================================
function renderSidebar() {
	let currentlyOpenId = window.activeSidebarInfo ? window.activeSidebarInfo.id.replace('sidebar-info-', '') : null;
	let currentlyOpenHtml = window.activeSidebarInfo ? window.activeSidebarInfo.innerHTML : "";
	
	// 1. Read the current state of the active filters
	const filterAch = document.getElementById('achievements-spin-filter') ? document.getElementById('achievements-spin-filter').checked : false;
	const filterDamageless = document.getElementById('damageless-spin-filter') ? document.getElementById('damageless-spin-filter').checked : false;
	const filterSpeedrun = document.getElementById('speedrun-spin-filter') ? document.getElementById('speedrun-spin-filter').checked : false;

	let totalGames = 0;
	let totalAchGames = 0;
	let totalCompleted = 0;
	
	// Tracking hidden games
	let hiddenNoAch = 0;
	let hiddenDamageless = 0;
	let hiddenSpeedrun = 0;

	// Calculate top-level stats and hidden breakdown
	Object.keys(userLibrary).forEach(con => {
		if (con && con.toLowerCase() === 'events') return '';
		if (con && con.toLowerCase() === 'hubs') return '';
		const games = userLibrary[con].filter(g => g.name && g.name.trim() !== "");
		
		games.forEach(g => {
			totalGames++;
			
			const hasAch = g.maxAch !== "" && Number(g.maxAch) !== 0;
			if (hasAch) totalAchGames++;

			// Evaluate if this game gets hidden (using else-if prevents double-counting)
			let isHidden = false;
			
			if (filterAch && (!g.maxAch || parseInt(g.maxAch) === 0)) {
				hiddenNoAch++;
				isHidden = true;
			} else if (filterDamageless && g.damagelessIDs && parseInt(g.damagelessIDs.length) > 0) {
				hiddenDamageless++;
				isHidden = true;
			} else if (filterSpeedrun && g.speedrunIDs && parseInt(g.speedrunIDs.length) > 0) {
				hiddenSpeedrun++;
				isHidden = true;
			}

			// Calculate completions (you can change this to only count visible games if preferred)
			const isCompleted = completedData[con] && completedData[con].includes(g.id);
			const isMastered = masteredData[con] && masteredData[con].includes(g.id);
			if (isCompleted || isMastered) totalCompleted++;
		});
	});

	const totalHidden = hiddenNoAch + hiddenDamageless + hiddenSpeedrun;

	document.getElementById('sidebar-header').innerHTML = `<h2>Games Library</h2>`;

	// 2. Build the Tooltip & Stats Container HTML
	let tooltipLines = [];
	if (hiddenNoAch > 0) tooltipLines.push(`${hiddenNoAch}: No Achievements`);
	if (hiddenDamageless > 0) tooltipLines.push(`${hiddenDamageless}: Damageless`);
	if (hiddenSpeedrun > 0) tooltipLines.push(`${hiddenSpeedrun}: SpeedRun`);
	
	// Join with &#10; to force a new line inside an HTML title attribute
	const tooltipText = tooltipLines.join('&#10;');

	let statsHtml = `<div style="color: var(--text); text-align: left;">Total Games: <strong>${totalGames}</strong>`;
	
	if (totalHidden > 0) {
		// Adding cursor: help and a dotted underline so the user knows they can hover over it
		statsHtml += ` | <span title="${tooltipText}" style="cursor: help; border-bottom: 1px dotted #94a3b8; color: #94a3b8;">(${totalHidden} Hidden)</span>`;
	}
	
	statsHtml += `</div>`;
	document.getElementById('stats-container').innerHTML = statsHtml;

	const term = searchInput.value.toLowerCase();
	container.innerHTML = '';
	
	// 3. Render Search Box
	renderSidebarSearch(term, currentlyOpenId, currentlyOpenHtml);
	
	const sortElement = document.getElementById('library-sort-select');
	const sortMode = sortElement ? sortElement.value : 'console';
	let hasAnyGames = false;

	// 4. Route Rendering based on Sort Mode
	if (sortMode === 'console') {
		hasAnyGames = renderSidebarByConsole(currentlyOpenId, currentlyOpenHtml);
	} else {
		// Prepare the unified allGames array required for non-console sorting
		let allGames = [];
		
		Object.keys(userLibrary).forEach(con => {
			userLibrary[con].forEach(g => {
				if (g.name && g.name.trim() !== "") {
					
					// APPLY FILTERS HERE: Skip pushing the game if it violates active filters
					let isHidden = false;
					if (filterAch && (!g.maxAch || parseInt(g.maxAch) === 0)) isHidden = true;
					else if (filterDamageless && g.damagelessIDs && parseInt(g.damagelessIDs.length) > 0) isHidden = true;
					else if (filterSpeedrun && g.speedrunIDs && parseInt(g.speedrunIDs) > 0) isHidden = true;
					
					if (isHidden) return; 

					let raData = raCompletedGamesCache.find(ra => String(ra.gameId || ra.GameID || ra.id) === String(g.raId));
					let numAch = g.maxAch || (raData ? parseInt(raData.maxPossible) : 0) || 0;
					let numAchTotal = raData ? (parseInt(raData.progData?.numAchieved || raData.numAwarded) || 0) : 0;
					let numAchHC = raData ? (parseInt(raData.progData?.numAchievedHardcore || raData.numAwardedHardcore) || 0) : 0;
					const isCompleted = completedData[con] && completedData[con].includes(g.id);
					const isMastered = masteredData[con] && masteredData[con].includes(g.id);
					
					if (isMastered) numAchHC = numAch;
					if (isCompleted || isMastered) numAchTotal = numAch;
					
					allGames.push({ 
						...g, con, 
						pts: g.pts || 0, 
						genre: g.genre || 'Unknown', 
						time: g.timeToMaster || 0, 
						hcTime: g.timeToBeatHardcore || 0, 
						numAch, numAchTotal, numAchHC, 
						isCompleted, isMastered 
					});
				}
			});
		});
		
		if (sortMode === 'genre') {
			hasAnyGames = renderSidebarByGenre(allGames, currentlyOpenId, currentlyOpenHtml);
		} else {
			hasAnyGames = renderSidebarByGroup(allGames, sortMode, currentlyOpenId, currentlyOpenHtml);
		}
	}
	
	// 5. Handle entirely empty library state
	if (!hasAnyGames && !term) {
		document.getElementById('stats-container').innerHTML += `<div style="font-size: 0.7rem; color: #64748b; font-style: italic; margin-top: 5px;">No games match your current filters.</div>`;
	}
	
	// 6. Restore the info-panel visual toggle state if an item was expanded
	setTimeout(() => {
		if (currentlyOpenId) window.activeSidebarInfo = document.getElementById(`sidebar-info-${currentlyOpenId}`);
	}, 0);
}

function handleQuickComplete(con, gameId, status = 'completed') {
	if (!completedData[con]) completedData[con] = [];
	if (!masteredData[con]) masteredData[con] = [];
	
	completedData[con] = completedData[con].filter(id => id !== gameId);
	masteredData[con] = masteredData[con].filter(id => id !== gameId);

	if (status === 'mastered') {
		masteredData[con].push(gameId);
	} else {
		completedData[con].push(gameId);
	}
	
	localStorage.setItem('completedData_v3', JSON.stringify(completedData));
	localStorage.setItem('masteredData_v3', JSON.stringify(masteredData));
	rebuildPool(); renderSidebar(); resetToConsole();
}

function removeHistoryEntry(con, id) {
	if (completedData[con]) {
		completedData[con] = completedData[con].filter(x => x !== id);
		if (completedData[con].length === 0) delete completedData[con];
		localStorage.setItem('completedData_v3', JSON.stringify(completedData));
	}
	if (masteredData[con]) {
		masteredData[con] = masteredData[con].filter(x => x !== id);
		if (masteredData[con].length === 0) delete masteredData[con];
		localStorage.setItem('masteredData_v3', JSON.stringify(masteredData));
	}
	renderSidebar(); rebuildPool();
}

function updateWheelFilters() {
	// Prevent updating the visual wheel during spin animations
	if (typeof isSpinning !== 'undefined' && isSpinning) return;

	// Read the current state of checkboxes
	const filterAch = document.getElementById('achievements-spin-filter').checked;
	const filterDamageless = document.getElementById('damageless-spin-filter').checked;
	const filterSpeedrun = document.getElementById('speedrun-spin-filter').checked;

	// Helper evaluation function to check if a single game passes both active filters
	const gamePassesFilters = (g) => {
		// Condition 1: Hide games with no achievements (0 maxAch)
		if (filterAch && (!g.maxAch || parseInt(g.maxAch) === 0)) {
			return false;
		}

		// Condition 2: Hide games with damageless achievements (damagelessIDs.length > 0)
		if (filterDamageless && g.damagelessIDs && parseInt(g.damagelessIDs.length) > 0) {
			return false;
		}

		// Condition 3: Hide games with speedrun achievements (speedrunIDs.length > 0)
		if (filterSpeedrun && g.speedrunIDs && parseInt(g.speedrunIDs.length) > 0) {
			return false;
		}

		// Passes all checked criteria (or both false = keep all)
		return true;
	};

	if (selectedConsole === null) {
		// --- CONSOLE WHEEL ---
		const availableConsoles = Object.keys(gamePool).filter(con => {
			if (con === 'Hubs') return false;
			if (con === 'Events') return false;

			// Keep console if it has AT LEAST ONE game meeting the combined filter criteria
			return gamePool[con].some(gamePassesFilters);
		});

		currentWheelItems = availableConsoles;
		drawWheel(currentWheelItems);

	} else {
		// --- GAME WHEEL ---
		let itemsToSpin = gamePool[selectedConsole] || [];

		// Apply both filter criteria simultaneously to the games list
		itemsToSpin = itemsToSpin.filter(gamePassesFilters);

		currentWheelItems = itemsToSpin;

		// Handle edge case where combined filters leave 0 games available
		if (currentWheelItems.length === 0) {
			resetToConsole();
			return;
		} else {
			const statusMain = document.getElementById('status-main');
			if (statusMain) statusMain.innerText = "Spin the wheel for a random game";
		}

		drawWheel(currentWheelItems);
		if (typeof resetToGame === 'function') resetToGame();
	}
}

// Bind the listener function to checkbox elements
document.getElementById('achievements-spin-filter').addEventListener('change', () => {
	updateWheelFilters();
	renderSidebar();
});

document.getElementById('damageless-spin-filter').addEventListener('change', () => {
	updateWheelFilters();
	renderSidebar();
});

document.getElementById('speedrun-spin-filter').addEventListener('change', () => {
	updateWheelFilters();
	renderSidebar();
});


function drawWheel(items) {
	// 2. Clear the canvas FIRST, so if the filter leaves 0 items, the screen wipes clean!
	ctx.clearRect(0, 0, 1400, 1400);
	if (selectedConsole === null) {
		overlay.querySelectorAll('.wheel-icon').forEach(icon => { if (!items.includes(icon.dataset.id)) icon.remove(); });
	} else { 
		overlay.innerHTML = ''; 
	}

	// 3. Now it is safe to abort if there are no items to draw
	if (!items.length) return;
	
	const centerX = 700, centerY = 700, radius = 650, sliceAngle = (2 * Math.PI) / items.length;

	items.forEach((item, i) => {
		const label = (typeof item === 'string') ? item : item.name;
		const cleanLabel = (label || '').replace(/~([^~]+)~/g, '').trim();
		const angle = rotation + i * sliceAngle;
		
		ctx.save();
		ctx.beginPath(); 
		ctx.moveTo(centerX, centerY); 
		ctx.arc(centerX, centerY, radius, angle, angle + sliceAngle);
		ctx.closePath();
		ctx.clip();
		
		ctx.fillStyle = (selectedConsole === null) ? (CONSOLE_COLORS[label] || WHEEL_COLORS[i % WHEEL_COLORS.length]) : WHEEL_COLORS[i % WHEEL_COLORS.length];
		ctx.fill();
		ctx.stroke();

		ctx.translate(centerX, centerY); 
		ctx.rotate(angle + sliceAngle / 2); 
		ctx.textAlign = "right"; 
		
		// Use dark text for light console colors and the requested bright wheel colors
		const lightColors = ['#d1d1d1', '#d4d4d4', '#e4e4e4', '#bcc1cb', '#ffffff', '#cfcfcf', '#e5e8fb', '#efeadc', '#e9e2c0', '#f2f2f2', '#cdcdcd', '#e0e0e0', '#dadada', '#bcc4ed', '#c7c3b7', '#e6e3d6', '#f4f4f5', '#bdbdbd', '#9fa087', '#e9e5d1', '#bfb588', '#f8f8f3', '#e7e7e7', '#9296a2', '#d0d3d5', '#e2e8f0', '#cbd5e1', '#d1d5db', '#ff8000', '#ffff00', '#80ff00', '#00ff00', '#00ff80', '#00ffff'];
		ctx.fillStyle = lightColors.includes(ctx.fillStyle.toLowerCase()) ? "#1e293b" : "white";
		
		if (selectedConsole === null) {
			ctx.font = "bold 32px Inter"; 
			if (isSpinning) {
				ctx.shadowColor = "rgba(0,0,0,0.8)"; 
				ctx.shadowBlur = 2;
			} else {
				ctx.shadowColor = "rgba(0,0,0,0.8)"; 
				ctx.shadowBlur = 2;
			}
			ctx.fillText(label, radius - 300, 12); 
			
			if (CONSOLE_IMAGES[label]) {
				let img = overlay.querySelector(`.wheel-icon[data-id="${label}"]`);
				if (!img) {
					img = document.createElement('img'); img.src = CONSOLE_IMAGES[label];
					img.className = 'wheel-icon'; img.dataset.id = label; 
					
					// Scale icon size using percentages (45px / 600px = 7.5%)
					img.style.width = '7.5%';
					img.style.height = '7.5%';
					overlay.appendChild(img);
				}
				const rad = (angle + sliceAngle / 2);
				
				// Calculate coordinates using percentage-based distance (230px / 600px = 38.333%)
				const percentDist = 38.333;
				img.style.left = `calc(50% + ${Math.cos(rad) * percentDist}%)`;
				img.style.top = `calc(50% + ${Math.sin(rad) * percentDist}%)`;
				
				// Only rely on transform to center the anchor point and apply the rotation
				img.style.transform = `translate(-50%, -50%) rotate(${rad}rad)`;
			}
		} else { 
			let fontSize = 32;
			ctx.font = `${fontSize}px Inter`;
			let maxTextWidth = radius - 150;
			
			let words = cleanLabel.split(' ');
			let lines = [cleanLabel];
			
			if (ctx.measureText(cleanLabel).width > maxTextWidth && words.length > 1) {
				const mid = Math.ceil(words.length / 2);
				lines = [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
			}
			
			while ((ctx.measureText(lines[0]).width > maxTextWidth || (lines[1] && ctx.measureText(lines[1]).width > maxTextWidth)) && fontSize > 14) {
				fontSize -= 2;
				ctx.font = `bold ${fontSize}px Inter`;
			}
			
			if (lines.length > 1) {
				ctx.fillText(lines[0], radius - 50, -fontSize / 2 + 4);
				ctx.fillText(lines[1], radius - 50, fontSize / 2 + 8);
			} else {
				ctx.fillText(lines[0], radius - 50, 12);
			}
		}
		ctx.restore();
	});
}

canvas.addEventListener('click', (e) => {
	if (isSpinning || !currentWheelItems.length) return;
	
	const rect = canvas.getBoundingClientRect();
	const x = (e.clientX - rect.left) * (1400 / rect.width);
	const y = (e.clientY - rect.top) * (1400 / rect.height);
	
	const dist = Math.sqrt((x - 700)**2 + (y - 700)**2);
	if (dist > 650) return; 
	
	let rawAngle = Math.atan2(y - 700, x - 700);

	// --- HITBOX ALIGNMENT FIX ---
	// Check if the CSS media query for the 90deg rotation is active
	const isMobileRotated = window.matchMedia("(max-width: 850px) and (orientation: portrait)").matches;
	if (isMobileRotated) {
		// Offset the angle by 90 degrees (PI / 2) to match the CSS rotation
		rawAngle -= (Math.PI / 2);
	}
	// ----------------------------

	// Normalize the angle securely between 0 and 2 * PI
	const angle = (rawAngle + (Math.PI * 4)) % (Math.PI * 2);
	
	const sliceAngle = (Math.PI * 2) / currentWheelItems.length;
	const index = Math.floor(((angle - (rotation % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2)) / sliceAngle);
	
	const clickedItem = currentWheelItems[index];
	
	if (selectedConsole === null && clickedItem) { 
		playTick(); 
		onConsoleSelected(clickedItem); 
	} else if (clickedItem && clickedItem.raId) { 
		playTick(); 
		window.open(`https://retroachievements.org/game/${clickedItem.raId}`, '_blank'); 
	}
});

function onConsoleSelected(con) { 
	selectedConsole = con; 

	// Use your helper function if you kept the recent refactor, otherwise default to the standard text
	if (typeof updateConsoleLabel === 'function') {
		updateConsoleLabel(con);
	} else {
		document.getElementById('status-label').innerText = `Selected console - ${CONSOLE_FULL_NAMES[con] || con}`;
	}

	document.getElementById('status-main').innerText = "Spin the wheel for a random game"; 
	
	setTimeout(() => { 
		// 1. Check the hidden checkbox state
		const filterAch = document.getElementById('achievements-spin-filter').checked;
		const filterDamageless = document.getElementById('damageless-spin-filter').checked;
		const filterSpeedrun = document.getElementById('speedrun-spin-filter').checked;
		
		// 2. Grab the console's games
		let itemsToSpin = gamePool[selectedConsole] || [];
		
		// 3. Filter using all possible state combinations
		itemsToSpin = itemsToSpin.filter(g => {
			// State: Hide 0-achievement games
			if (filterAch && (!g.maxAch || parseInt(g.maxAch) === 0)) {
				return false;
			}
			
			// State: Hide damageless achievement games
			if (filterDamageless && g.damagelessIDs && parseInt(g.damagelessIDs.length) > 0) {
				return false;
			}
			
			// State: Hide speedrun achievement games
			if (filterSpeedrun && g.speedrunIDs && parseInt(g.speedrunIDs.length) > 0) {
				return false;
			}
			
			return true;
		});
		
		// 4. Update the visual wheel
		currentWheelItems = shuffleArray(itemsToSpin); 
		rotation = 0;
		drawWheel(currentWheelItems); 
		setUI('game-ready'); 
		document.getElementById('achievements-spin-filter').disabled = false;
		document.getElementById('damageless-spin-filter').disabled = false;
		document.getElementById('speedrun-spin-filter').disabled = false;
	}, 500);
}		

function updateConsoleLabel(con) {
	const displayName = CONSOLE_FULL_NAMES[con] || con;
	const conIcon = CONSOLE_IMAGES[con];
	
	// If the icon exists, build the img tag; otherwise, return an empty string
	const iconHtml = conIcon ? `<img src="${conIcon}" alt="${displayName}" style="height: 28px; vertical-align: middle; margin-left: 10px;">` : '';
	
	document.getElementById('status-label').innerHTML = `Selected console - ${displayName}${iconHtml}`;
}

function animateSpin(items, cb) {
	if (isSpinning) return; 
	isSpinning = true;
	document.getElementById('status-main').innerText = "Spinning...";


	const totalRotation = (8 + Math.random() * 8) * Math.PI * 2 + Math.random() * (Math.PI * 2);
	const duration = 8000 + Math.random() * 2000;
	const start = rotation; 
	const startTime = performance.now();
	let lastIdx = -1; 
	const sliceAngle = (Math.PI * 2) / items.length;

	// Grab the elements we want to spin visually
	const canvas = document.getElementById('wheelCanvas');
	const overlay = document.getElementById('icon-overlay');

	// Ensure the wheel is drawn in its starting position before animating
	drawWheel(items);

	function frame(now) {
		const p = Math.min((now - startTime) / duration, 1);
		const ease = 1 - Math.pow(2, -10 * p);
		
		// Update global rotation for the tick math
		rotation = start + (totalRotation * ease); 
		
		// 1. THE MAGIC: Rotate the HTML elements using the GPU instead of redrawing the canvas
		const currentSpin = totalRotation * ease;
		if (canvas) canvas.style.transform = `rotate(${currentSpin}rad)`;
		if (overlay) overlay.style.transform = `rotate(${currentSpin}rad)`;

		const currentIdx = Math.floor(((Math.PI * 2) - (rotation % (Math.PI * 2))) % (Math.PI * 2) / sliceAngle);
		
		if (currentIdx !== lastIdx) { 
			playTick(); 
			lastIdx = currentIdx; 
			
			const pointer = document.getElementById('wheel-pointer');
			if (pointer) {
				// 2. FIXED: Nested requestAnimationFrame prevents layout-thrashing
				pointer.style.animation = 'none';
				requestAnimationFrame(() => {
					pointer.style.animation = 'pointerTick 0.2s ease-out';
				});
			}
		}
		
		if (p < 1) {
			requestAnimationFrame(frame); 
		} else { 
			isSpinning = false; 
			
			// 3. CLEANUP: Reset CSS transforms instantly...
			if (canvas) canvas.style.transform = 'none';
			if (overlay) overlay.style.transform = 'none';
			
			// ...and draw the canvas one final time at its true new resting rotation!
			rotation = rotation % (Math.PI * 2); 
			drawWheel(items); 
			
			cb(items[currentIdx]); 
		}
	}
	requestAnimationFrame(frame);
}

function spinForConsole() {
	setUI('wheel-spinning');
	document.getElementById('status-label').innerText = "";
	document.getElementById('achievements-spin-filter').disabled = true;
	document.getElementById('damageless-spin-filter').disabled = true;
	document.getElementById('speedrun-spin-filter').disabled = true;

	const filterAch = document.getElementById('achievements-spin-filter').checked;
	const filterDamageless = document.getElementById('damageless-spin-filter').checked;
	const filterSpeedrun = document.getElementById('speedrun-spin-filter').checked;

	const availableConsoles = Object.keys(gamePool).filter(con =>
		con !== 'Events' && con !== 'Hubs' &&
		gamePool[con].some(g =>
			(!filterAch || (g.maxAch && parseInt(g.maxAch, 10) > 0)) &&
			(!filterDamageless || !g.damagelessIDs || parseInt(g.damagelessIDs.length, 10) === 0) &&
			(!filterSpeedrun || !g.speedrunIDs || parseInt(g.speedrunIDs.length, 10) === 0)
		)
	);

	currentWheelItems = shuffleArray(availableConsoles);
	animateSpin(currentWheelItems, onConsoleSelected);
}

function spinForGame() {
	setUI('wheel-spinning'); 
	document.getElementById('achievements-spin-filter').disabled = true;
	document.getElementById('damageless-spin-filter').disabled = true;
	document.getElementById('speedrun-spin-filter').disabled = true;
	
	// Smoothly close the panel if it is currently open
	const panel = document.getElementById('game-info-panel');
	if (panel && panel.style.display !== 'none') {
		panel.classList.remove('open');
		// Wait 400ms for the CSS transition to finish before hiding it from the DOM
		setTimeout(() => {
			panel.style.display = 'none';
		}, 400);
	}
	
	document.getElementById('bg-fade-layer').style.opacity = 0;

	animateSpin(currentWheelItems, (res) => { 
		if (masteredData[selectedConsole] && masteredData[selectedConsole].includes(res.id)) {
			console.warn("Failsafe activated: Prevented mastered game from appearing.");
			return spinForGame(); 
		}
		
		selectedGame = res; 
		
		updateConsoleLabel(selectedConsole);
		
		document.getElementById('status-main').innerText = res.name; 
		setUI('result'); 
		document.getElementById('achievements-spin-filter').disabled = false;
		document.getElementById('damageless-spin-filter').disabled = false;
		document.getElementById('speedrun-spin-filter').disabled = false;
		
		if(res.raId) {
			fetchAndShowGameInfo(res.raId);
		}

		// Delay slightly to allow the DOM to register 'display: flex' before scrolling
		setTimeout(() => {
			const activePanel = document.getElementById('game-info-panel');
			if (activePanel) {
				activePanel.scrollIntoView({ 
					behavior: 'smooth', 
					block: 'start' 
				});
			}
		}, 400);
	});
}

async function fetchAndShowGameInfo(raId) {
	const panel = document.getElementById('game-info-panel');
	const user = localStorage.getItem('ra_user');
	const key = localStorage.getItem('ra_key');
	
	if (!user || !key || !raId) return;

	// 1. Turn the display on (it is still 0 width and invisible due to the base CSS)
	panel.style.display = 'flex';
	
	// 2. Force the browser to recalculate the layout
	void panel.offsetWidth;
	
	// 3. Add the open class to trigger the smooth width and opacity transition
	panel.classList.add('open');

	panel.innerHTML = '<p style="color:var(--accent); font-size:0.8rem; text-align:center; margin-top:20px;">Gathering extended info...</p>';

	try {
		const raApi = await import("https://esm.sh/@retroachievements/api");
		const authorization = raApi.buildAuthorization({ username: user, webApiKey: key });
		
		// Changed to getGameInfoAndUserProgress and added the username parameter[cite: 1]
		const data = await window.safeApiCall(raApi.getGameInfoAndUserProgress, authorization, { username: user, gameId: parseInt(raId) });
		try { 
			if (typeof raApi.getGameProgression === 'function') {
				const prog = await window.safeApiCall(raApi.getGameProgression, authorization, { gameId: parseInt(raId) });
				if(prog) {
					data.medianTimeToBeat = prog.medianTimeToBeat;
					data.medianTimeToBeatHardcore = prog.medianTimeToBeatHardcore;
					data.medianTimeToComplete = prog.medianTimeToComplete;
					data.medianTimeToMaster = prog.medianTimeToMaster;
				}
			}
		} catch(e) {
			console.warn("Progression call failed or unavailable", e);
		}

		if (data && (data.id || data.ID)) {
			const bgFade = document.getElementById('bg-fade-layer');
			const rawBox = data.imageBoxArt || data.ImageBoxArt;
			if (rawBox) {
				const boxArtUrl = `https://media.retroachievements.org${rawBox.startsWith('/') ? rawBox : '/Images/'+rawBox}`;
				bgFade.style.backgroundImage = `url('${boxArtUrl}')`;
				bgFade.style.opacity = 1;
			}

			if (selectedConsole && selectedGame) {
				let libGame = userLibrary[selectedConsole].find(g => g.id === selectedGame.id);
				if (libGame) {
					libGame.maxAch = data.numAchievements || data.NumAchievements || libGame.maxAch || 0;
					let calculatedPts = 0;
					if (data.achievements || data.Achievements) {
						libGame.achievements = data.achievements || data.Achievements;
						const achs = data.achievements || data.Achievements;
						(Array.isArray(achs) ? achs : Object.values(achs)).forEach(ach => calculatedPts += parseInt(ach.points || ach.Points || 0));
					}
					libGame.consoleId = data.consoleId;
					let targetCon = null;
					for (const [conName, conId] of Object.entries(RA_CONSOLE_IDS)) {
						if (conId === libGame.consoleId) {
							targetCon = conName;
							break;
						}
					}
					libGame.consoleName = targetCon;
					libGame.pts = calculatedPts || libGame.pts || 0;
					libGame.genre = data.genre || data.Genre || libGame.genre || "Unknown";
					libGame.timeToMaster = parseInt(data.medianTimeToMaster) || libGame.timeToMaster || 0;
					libGame.timeToBeatHardcore = parseInt(data.medianTimeToBeatHardcore) || libGame.timeToBeatHardcore || 0;
					libGame.timeToBeat = parseInt(data.medianTimeToBeat) || libGame.timeToBeat || 0;
					libGame.timeToComplete = parseInt(data.medianTimeToComplete) || libGame.timeToComplete || 0;
					libGame.developer = data.developer || data.Developer || libGame.developer || "Unknown";
					libGame.publisher = data.publisher || data.Publisher || libGame.publisher || "Unknown";
					libGame.released = data.released || data.Released || libGame.released || "Unknown";
					libGame.players = data.numDistinctPlayersCasual || data.NumDistinctPlayersCasual || libGame.players || 0;
					libGame.imageTitle = cleanImg(data.imageTitle || data.ImageTitle) || libGame.imageTitle;
					libGame.imageIngame = cleanImg(data.imageIngame || data.ImageIngame) || libGame.imageIngame;
					libGame.imageBoxArt = cleanImg(data.imageBoxArt || data.ImageBoxArt) || libGame.imageBoxArt;
					libGame.pointsPerHourHC = libGame.pts / ((libGame.timeToMaster / 60) / 60);
					libGame.pointsPerHourSC = libGame.pts / ((libGame.timeToComplete / 60) / 60);
					data.pointsPerHourHC = libGame.pts / ((libGame.timeToMaster / 60) / 60);
					data.pointsPerHourSC = libGame.pts / ((libGame.timeToComplete / 60) / 60);
					data.missableIDs = libGame.missableIDs;
					data.damagelessIDs = libGame.damagelessIDs;
					data.speedrunIDs = libGame.speedrunIDs;
					libGame.flags = data.flags || data.Flags || null;
					libGame.forumTopicID = data.forumTopicId || data.forumTopicID || data.ForumTopicId || data.ForumTopicID || null;
					libGame.guideURL = data.guideUrl || data.guideURL || data.GuideUrl || data.GuideURL || null;
					libGame.raUpdated = data.updated || data.Updated || null;
					libGame.parentGameID = data.parentGameId || data.parentGameID || data.ParentGameId || data.ParentGameID || null;
					libGame.numDistinctPlayersCasual = data.numDistinctPlayersCasual || data.NumDistinctPlayersCasual || 0;
					libGame.numDistinctPlayersHardcore = data.numDistinctPlayersHardcore || data.NumDistinctPlayersHardcore || 0;
					libGame.userTotalPlaytime = data.userTotalPlaytime || data.UserTotalPlaytime || 0;
							
					libGame.extendedFetched = true;
					
					try {
						const db = await dbPromise;
						await db.put('games', libGame); // This instantly saves/updates the game in the database!
					} catch (dbErr) {
						console.error(`Failed to save ${libGame.name} to DB:`, dbErr);
					}
					window.updateHistoryItemDOM(libGame, selectedConsole);
				}
			}

			panel.innerHTML = generateGameInfoHtml(data, raId, false);
		} else {
			panel.innerHTML = '<p style="color:var(--danger); font-size:0.8rem; text-align:center; margin-top:20px;">Could not load game info.</p>';
		}
	} catch(e) {
		console.error(e);
		panel.innerHTML = '<p style="color:var(--danger); font-size:0.8rem; text-align:center; margin-top:20px;">Error connecting to API.</p>';
	}
}

function completeGame(status = 'completed') { handleQuickComplete(selectedConsole, selectedGame.id, status); }

function resetToConsole() { 
	selectedConsole = null; selectedGame = null; rotation = 0; rebuildPool(); 
	
	
	// Smoothly close the panel if it is currently open
	const panel = document.getElementById('game-info-panel');
	if (panel && panel.style.display !== 'none') {
		panel.classList.remove('open');
		// Wait 400ms for the CSS transition to finish before hiding it from the DOM
		setTimeout(() => {
			panel.style.display = 'none';
		}, 400);
	}
	document.getElementById('bg-fade-layer').style.opacity = 0;
	
	// 1. Check the current state of the checkbox
	const filterAch = document.getElementById('achievements-spin-filter').checked;
	const filterDamageless = document.getElementById('damageless-spin-filter').checked;
	const filterSpeedrun = document.getElementById('speedrun-spin-filter').checked;

	// 2. Filter consoles based on the checkbox and safely remove 'Events'
	const availableConsoles = Object.keys(gamePool).filter(con =>
		con !== 'Events' && con !== 'Hubs' &&
		gamePool[con].some(g =>
			(!filterAch || (g.maxAch && parseInt(g.maxAch, 10) > 0)) &&
			(!filterDamageless || !g.damagelessIDs || parseInt(g.damagelessIDs.length, 10) === 0) &&
			(!filterSpeedrun || !g.speedrunIDs || parseInt(g.speedrunIDs.length, 10) === 0)
		)
	);

	// 3. Rebuild and draw the console wheel
	selectedConsole = null;
	currentWheelItems = shuffleArray(availableConsoles);
	rotation = 0;
	drawWheel(currentWheelItems);

	// Make sure your UI reset call is here too (e.g., setUI('console-ready');) 
	setUI('console'); 
	document.getElementById('achievements-spin-filter').disabled = false;
	document.getElementById('damageless-spin-filter').disabled = false;
	document.getElementById('speedrun-spin-filter').disabled = false;
	
	document.getElementById('status-label').innerText = "Ready";
	document.getElementById('status-main').innerText = "Select a console or spin the wheel";
}

function resetToGame() { 
	selectedGame = null; rotation = 0; rebuildPool(); 
	
	
	// Smoothly close the panel if it is currently open
	const panel = document.getElementById('game-info-panel');
	if (panel && panel.style.display !== 'none') {
		panel.classList.remove('open');
		// Wait 400ms for the CSS transition to finish before hiding it from the DOM
		setTimeout(() => {
			panel.style.display = 'none';
		}, 400);
	}
	document.getElementById('bg-fade-layer').style.opacity = 0;
	
	// Make sure your UI reset call is here too (e.g., setUI('console-ready');) 
	setUI('game-ready'); 
	document.getElementById('achievements-spin-filter').disabled = false;
	document.getElementById('damageless-spin-filter').disabled = false;
	document.getElementById('speedrun-spin-filter').disabled = false;
	document.getElementById('status-main').innerText = "Select a console or spin the wheel";
}

function setUI(p) { 
	document.getElementById('ctrl-console').className = (p === 'console' ? 'controls' : 'hidden'); 
	document.getElementById('ctrl-game-ready').className = (p === 'game-ready' ? 'controls' : 'hidden'); 
	document.getElementById('ctrl-result').className = (p === 'result' ? 'controls' : 'hidden'); 
	document.getElementById('ctrl-wheel-spinning').className = (p === 'wheel-spinning' ? 'controls' : 'hidden'); 
}

function updateModifySelect(selectedCon) {
	const s = document.getElementById('modify-console-select');
	const activeConsoles = Object.keys(userLibrary).filter(con => userLibrary[con] && userLibrary[con].length > 0);
	s.innerHTML = activeConsoles.length === 0 ? `<option value="">No consoles in library</option>` : '';
	activeConsoles.sort((a,b) => (CONSOLE_FULL_NAMES[a] || a).localeCompare(CONSOLE_FULL_NAMES[b] || b)).forEach(con => { 
		s.innerHTML += `<option value="${con}">${CONSOLE_FULL_NAMES[con] || con}</option>`; 
	});
	if (selectedCon && activeConsoles.includes(selectedCon)) {
		s.value = selectedCon;
	} else if (activeConsoles.length > 0) {
		s.selectedIndex = 0;
	}
}

function openManager() {
	updateModifySelect();

	const addS = document.getElementById('add-game-console-select');
	addS.innerHTML = '<option value="">Select Console to Add...</option>';
	Object.keys(CONSOLE_FULL_NAMES).sort((a,b) => CONSOLE_FULL_NAMES[a].localeCompare(CONSOLE_FULL_NAMES[b])).forEach(con => { 
		addS.innerHTML += `<option value="${con}">${CONSOLE_FULL_NAMES[con]}</option>`; 
	});

	document.getElementById('ra-username').value = localStorage.getItem('ra_user') || '';
	document.getElementById('ra-api-key').value = localStorage.getItem('ra_key') || '';
	document.getElementById('manager-modal').style.display = 'flex'; renderModifyList();
}

function saveCredentials() {
	localStorage.setItem('ra_user', document.getElementById('ra-username').value);
	localStorage.setItem('ra_key', document.getElementById('ra-api-key').value);
}

async function loadCachedStats() {
	const user = localStorage.getItem('ra_user');
	if (!user) return;

	const summary = JSON.parse(localStorage.getItem('ra_api_summary'));
	let wtp = JSON.parse(localStorage.getItem('ra_api_wtp'));
	const completed = JSON.parse(localStorage.getItem('ra_api_completed'));

	if (summary) {
		await renderSummary(summary, user);
	} else {
		document.getElementById('ra-user-stats').innerHTML = '<p style="font-size: 0.8rem; color: #64748b; font-style: italic;">No cached stats. Click Refresh Stats to load.</p>';
		return;
	}

	if (wtp) {
		wtp = wtp.filter(g => {
			const cId = g.consoleId !== undefined ? g.consoleId : g.ConsoleID;
			const cName = g.consoleName !== undefined ? g.consoleName : g.ConsoleName;
			return ![100, 101].includes(Number(cId)) && !['events', 'hubs'].includes(String(cName || '').toLowerCase());
		});
		window.wtpGamesCache = wtp;
		renderWantToPlayList(wtp);
	}
	
	if (completed) {
		raCompletedGamesCache = completed;
		renderCompletedTabs('mastered');
	}
}

async function fetchUserStats(forceRefresh = false) {
	const user = localStorage.getItem('ra_user');
	const key = localStorage.getItem('ra_key');
	const container = document.getElementById('ra-user-stats');

	if (!user || !key) {
		container.innerHTML = '<p style="font-size: 0.8rem; color: #64748b; font-style: italic;">Enter your API details to view stats.</p>';
		return;
	}

	container.innerHTML = '<p style="font-size: 0.8rem; color: var(--accent);">Fetching stats...</p>';

	try {
		const raApi = await import("https://esm.sh/@retroachievements/api");
		const { buildAuthorization, getUserSummary } = raApi;
		
		const authorization = buildAuthorization({ username: user, webApiKey: key });

		// Appending the dynamic 't' timestamp forces a bypass of both browser and CDN/server caches
		const data = await window.safeApiCall(getUserSummary, authorization, { 
			username: user,
			recentGamesCount: 5,
			recentAchievementsCount: 10,
			t: Date.now() 
		});
		
		if (data) {
			const keysToRemove = [
				'user', 'richPresenceMsgDate', 'lastGameId', 'contribCount', 
				'contribYield', 'permissions', 'untracked', 'id', 
				'userWallActive', 'recentlyPlayedCount', 'ulid', 'totalRanked',
				'awarded', 'lastGame'
			];
			keysToRemove.forEach(k => delete data[k]);

			localStorage.setItem('ra_api_summary', JSON.stringify(data));
			await renderSummary(data, user);
		}

		// Triggers the actual game data fetches
		await fetchUserWantToPlay(user, key, raApi, authorization);
		await fetchUserCompleted(user, key, raApi, authorization);
		
	} catch (err) {
		console.error(err);
		container.innerHTML = '<p style="font-size: 0.8rem; color: var(--danger);">Network error fetching stats.</p>';
	}
}

function buildUserHeaderHTML(data, user) {
	let html = `<div id="stats-box-1" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; background: #1e293b; padding: 10px; border-radius: 8px; border: 1px solid var(--border);">`;

	// Left side: Avatar, Name, Motto
	html += `<div style="display: flex; gap: 15px; align-items: center;">`;
	if (data.userPic) html += `<a href="https://retroachievements.org/user/${user}" target="_blank" style="display: flex; line-height: 0;"><img src="https://media.retroachievements.org${data.userPic}" style="border-radius: 50%; border: 2px solid var(--primary); flex-shrink: 0;"></a>`;
	html += `<div><h2 style="margin: 0; color: var(--primary);"><a href="https://retroachievements.org/user/${user}" target="_blank" style="color: inherit;">${user}</a></h2>`;

	if (data.motto) html += `<p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 0.75rem; font-style: italic;">"${data.motto}"</p>`;
	const memSince = data.memberSince || data.MemberSince;
	console.log(memSince)
	if (memSince) html += `<p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 0.75rem;"><strong style="color:white;">Member Since:</strong> ${memSince}</p>`;
	html += `</div></div>`;

	// Right side: Points and Rank
	html += `<div style="text-align: right; color: #94a3b8; font-size: 0.8rem;">`;
	const tPoints = data.totalPoints !== undefined ? data.totalPoints : 0;
	const tTruePoints = data.totalTruePoints !== undefined ? data.totalTruePoints : 0;
	html += `<div style="margin-bottom: 4px; color: var(--text);"><strong>Points (Hardcore):</strong> ${tPoints} (<span title="RetroPoints: Points adjusted by achievement rarity." style="cursor:help; border-bottom:1px dotted #94a3b8;">${tTruePoints}</span>)</div>`;

	const tSoftcore = parseInt(data.totalSoftcorePoints || 0, 10);
	if (tSoftcore > 0) html += `<div style="margin-bottom: 4px; color: var(--text);"><strong>Points (Casual):</strong> ${tSoftcore}</div>`;
	if (data.rank) {
		const urlOffset = Math.floor((data.rank - 1) / 25) * 25;
		const rankUrl = `https://retroachievements.org/globalRanking.php?t=2&o=${urlOffset}&s=5`;
		html += `<div id="user-rank-display"><strong style="color:white;">Rank:</strong> <a href="${rankUrl}" target="_blank" style="color:inherit;">${data.rank}</a></div>`;
	}
	
	html += `</div></div>`;

	return html;
}

async function buildCompletionChartsHTML() {
	const completedCache = JSON.parse(localStorage.getItem('ra_api_completed')) || [];
	
	// 1. Fetch the unified library directly from IndexedDB
	const db = await dbPromise; 
	const rawLibrary = await db.getAll('games');
	
	// Helper to safely find the game in the flat IDB array
	const findGame = (gameId) => rawLibrary.find(g => String(g.raId) === String(gameId) || String(g.id) === String(gameId));

	const getReleaseYear = (gameId) => {
		const foundGame = findGame(gameId);
		return foundGame ? (foundGame.released || foundGame.Released) : null;
	};

	const getGenres = (gameId) => {
		const foundGame = findGame(gameId);
		return foundGame ? (foundGame.genre || foundGame.Genre) : null;
	};

	const getPublisher = (gameId) => {
		const foundGame = findGame(gameId);
		return foundGame ? (foundGame.publisher || foundGame.Publisher) : null;
	};
	
	const getDeveloper = (gameId) => {
		const foundGame = findGame(gameId);
		return foundGame ? (foundGame.developer || foundGame.Developer) : null;
	};
	
	const getCompletionDate = (gameId) => {
		const foundGame = findGame(gameId);
		return foundGame ? (foundGame.highestAwardDate || foundGame.HighestAwardDate) : null;
	};

	const yearCounts = {};
	const genreCounts = {};
	const consoleCounts = {};
	const publisherCounts = {};
	const developerCounts = {};
	
	const yearGames = {};
	const genreGames = {};
	const consoleGames = {};
	const publisherGames = {};
	const developerGames = {};

	// Setup for Day/Month stacked chart
	const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

	const monthCounts = {}; const monthGames = {};
	monthNames.forEach(m => { monthCounts[m] = { mastered: 0, completed: 0 }; monthGames[m] = { mastered: [], completed: [] }; });
	
	const dayCounts = {}; const dayGames = {};
	dayNames.forEach(d => { dayCounts[d] = { mastered: 0, completed: 0 }; dayGames[d] = { mastered: [], completed: [] }; });

	// 2. Scan the cache and build the data maps
	completedCache.forEach(game => {
		if (game.calculatedCategory === 'completed' || game.calculatedCategory === 'mastered') {
			const gameId = game.gameId || game.GameID || game.id;
			const isMastered = game.calculatedCategory === 'mastered';
			const catKey = isMastered ? 'mastered' : 'completed';
			
			// Grab the console name first so we can attach it to the title
			const cName = game.consoleName || game.ConsoleName || 'Unknown';
			
			// Clean the title so double quotes don't break the HTML title attribute
			const gameTitle = `${(game.title || game.Title || 'Unknown Game').replace(/"/g, '&quot;')} [${cName}]`;
			
			// Extract Date Information for Day/Month Chart
			const awardDateStr = game.highestAwardDate || game.HighestAwardDate;
			if (awardDateStr) {
				const dateObj = new Date(awardDateStr);
				if (!isNaN(dateObj)) {
					const mName = monthNames[dateObj.getMonth()];
					
					// JS getDay() is 0=Sun. Shift it so 0=Mon, 6=Sun
					const dayIndex = (dateObj.getDay() + 6) % 7; 
					const dName = dayNames[dayIndex];
					
					if (mName && dName) {
						monthCounts[mName][catKey]++;
						monthGames[mName][catKey].push(gameTitle);
						
						dayCounts[dName][catKey]++;
						dayGames[dName][catKey].push(gameTitle);
					}
				}
			}

			// Count by Genre (Normalize "Not Available" / "Unknown")
			const rawGenre = getGenres(gameId);
			let genre = (Array.isArray(rawGenre) ? rawGenre.join(', ') : String(rawGenre || 'Unknown')).replace(/\s*,\s*/g, ', ').trim();
			if (genre.toLowerCase() === 'not available' || genre.toLowerCase() === 'unknown' || genre === '') {
				genre = 'Unknown';
			}
			if (!genreCounts[genre]) genreCounts[genre] = { mastered: 0, completed: 0 };
			genreCounts[genre][catKey]++;
			if (!genreGames[genre]) genreGames[genre] = { mastered: [], completed: [] };
			genreGames[genre][catKey].push(gameTitle);
			
			// Count by Console
			if (!consoleCounts[cName]) consoleCounts[cName] = { mastered: 0, completed: 0 };
			consoleCounts[cName][catKey]++;
			if (!consoleGames[cName]) consoleGames[cName] = { mastered: [], completed: [] };
			consoleGames[cName][catKey].push(gameTitle);
			
			// Count by Publisher (Normalize "Not Available" / "Unknown")
			const rawPublisher = getPublisher(gameId);
			let publisher = (Array.isArray(rawPublisher) ? rawPublisher.join(', ') : String(rawPublisher || 'Unknown')).replace(/\s*,\s*/g, ', ').trim();
			if (publisher.toLowerCase() === 'not available' || publisher.toLowerCase() === 'unknown' || publisher === '') {
				publisher = 'Unknown';
			}
			if (!publisherCounts[publisher]) publisherCounts[publisher] = { mastered: 0, completed: 0 };
			publisherCounts[publisher][catKey]++;
			if (!publisherGames[publisher]) publisherGames[publisher] = { mastered: [], completed: [] };
			publisherGames[publisher][catKey].push(gameTitle);
			
			// Count by Developer (Normalize "Not Available" / "Unknown")
			const rawDeveloper = getDeveloper(gameId);
			let developer = (Array.isArray(rawDeveloper) ? rawDeveloper.join(', ') : String(rawDeveloper || 'Unknown')).replace(/\s*,\s*/g, ', ').trim();
			if (developer.toLowerCase() === 'not available' || developer.toLowerCase() === 'unknown' || developer === '') {
				developer = 'Unknown';
			}
			if (!developerCounts[developer]) developerCounts[developer] = { mastered: 0, completed: 0 };
			developerCounts[developer][catKey]++;
			if (!developerGames[developer]) developerGames[developer] = { mastered: [], completed: [] };
			developerGames[developer][catKey].push(gameTitle);

			// Cross-reference with rawLibrary to recover missing release dates
			let rYear = 'Unknown';
			const libReleased = getReleaseYear(gameId);
			const released = libReleased || game.released || game.Released;
			
			if (released) {
				const match = String(released).match(/^(\d{4})/);
				if (match) rYear = match[1];
			}
			
			if (rYear !== 'Unknown') {
				if (!yearCounts[rYear]) yearCounts[rYear] = { mastered: 0, completed: 0 };
				yearCounts[rYear][catKey]++;
				if (!yearGames[rYear]) yearGames[rYear] = { mastered: [], completed: [] };
				yearGames[rYear][catKey].push(gameTitle);
			}
		}
	});

	// 3. Sort constraints
	const years = Object.keys(yearCounts).sort((a, b) => parseInt(a) - parseInt(b)); 
	const genres = Object.keys(genreCounts).sort(); 
	const consoles = Object.keys(consoleCounts).sort(); 
	const publishers = Object.keys(publisherCounts).sort(); 
	const developers = Object.keys(developerCounts).sort(); 
	
	if (years.length === 0 && genres.length === 0 && consoles.length === 0 && publishers.length === 0) return '';

	const maxYear = Math.max(0, ...Object.values(yearCounts).map(v => v.mastered + v.completed));
	const maxGenre = Math.max(0, ...Object.values(genreCounts).map(v => v.mastered + v.completed));
	const maxConsole = Math.max(0, ...Object.values(consoleCounts).map(v => v.mastered + v.completed));
	const maxPublisher = Math.max(0, ...Object.values(publisherCounts).map(v => v.mastered + v.completed));
	const maxDeveloper = Math.max(0, ...Object.values(developerCounts).map(v => v.mastered + v.completed));
	const maxDay = Math.max(0, ...dayNames.map(d => dayCounts[d].mastered + dayCounts[d].completed));
	const maxMonth = Math.max(0, ...monthNames.map(m => monthCounts[m].mastered + monthCounts[m].completed));

	// 4. Helper to generate standard CSS Bar Charts
	const generateBarChart = (title, keys, dataMap, maxVal, gamesMap, hasToggle = false) => {
		
		let columnsHtml = keys.map(key => {
			const mCount = dataMap[key].mastered;
			const cCount = dataMap[key].completed;
			const total = mCount + cCount;
			const mPct = maxVal > 0 ? (mCount / maxVal) * 100 : 0;
			const cPct = maxVal > 0 ? (cCount / maxVal) * 100 : 0;
			
			const safeClass = `column-safe-${key.replace(/[^a-zA-Z0-9]/g, '_')}`;
			
			const mList = gamesMap[key].mastered.join('&#10;• ').replace(/~([^~]+)~\s?/g, '').trim();
			const cList = gamesMap[key].completed.join('&#10;• ').replace(/~([^~]+)~\s?/g, '').trim();
			let tooltipText = `${key} (${total})`;
			if (mCount > 0) tooltipText += `&#10;🏆 Mastered (${mCount}):&#10;• ${mList}`;
			if (cCount > 0) tooltipText += `&#10;🎖 Completed (${cCount}):&#10;• ${cList}`;
			
			const cleanKey = key.replace(/\//g, '/ ');
			
			const topRadius = cPct === 0 ? '4px 4px 0 0' : '4px 4px 0 0'; 
			const bottomRadius = mPct === 0 ? '4px 4px 0 0' : '0';

			return `
			<div class="${safeClass}" style="display: flex; flex-direction: column; width: 55px; flex-shrink: 0; align-items: center;">
				<div style="position: relative; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; width: 100%; height: 150px; border-bottom: 1px solid var(--border);" title="${tooltipText}">
					<span style="font-size: 0.65rem; color: #94a3b8; position: absolute; bottom: calc(${mPct + cPct}% + 4px);">${total > 0 ? total : ''}</span>
					<!-- Mastered (Yellow) -->
					<div style="background: #eab308; width: 25px; height: ${mPct}%; border-radius: ${topRadius}; min-height: ${mPct > 0 ? '2px' : '0'}; transition: height 0.3s; margin-bottom: 0;"></div>
					<!-- Completed (Blue) -->
					<div style="background: #3b82f6; width: 25px; height: ${cPct}%; border-radius: ${bottomRadius}; min-height: ${cPct > 0 ? '2px' : '0'}; transition: height 0.3s;"></div>
				</div>
				<div style="display: flex; justify-content: flex-end; margin-top: 10px; width: 100%;">
					<span style="font-size: 0.55rem; color: #64748b; transform: rotate(-45deg); transform-origin: bottom; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; width: 75px; margin-right: 15px; line-height: 1.1; text-align: right; padding-top: 5px;" title="${cleanKey}">${cleanKey}</span>
				</div>
			</div>`;
		}).join('');
		
		const toggleHtml = hasToggle ? `
			<label style="font-size: 0.65rem; color: #94a3b8; display: flex; align-items: center; gap: 5px; cursor: pointer; font-weight: normal;">
				<input type="checkbox" checked onchange="this.closest('.chart-container').querySelectorAll('.column-safe-Unknown').forEach(el => el.style.display = this.checked ? 'flex' : 'none');">
				Show Unknown
			</label>
		` : '';

		return `
		<div class="chart-container" style="background: #1e293b; padding: 10px; border-radius: 8px; border: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden;">
			<div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); margin-bottom: 10px; padding-bottom: 5px;">
				<h4 style="margin: 0; font-size: 0.8rem; color: var(--text);">${title}</h4>
				${toggleHtml}
			</div>
			<div style="position: relative;">
				<div style="position: absolute; top: 20px; left: 0; right: 0; height: 150px; pointer-events: none; display: flex; flex-direction: column; justify-content: space-between; z-index: 0; padding: 0 10px;">
					<div style="border-top: 1px dashed rgba(148, 163, 184, 0.2); width: 100%; position: relative;"><span style="position: absolute; left: 0; top: -8px; font-size: 0.6rem; color: #64748b; background: #1e293b; padding-right: 4px;">${maxVal}</span></div>
					<div style="border-top: 1px dashed rgba(148, 163, 184, 0.2); width: 100%; position: relative;"><span style="position: absolute; left: 0; top: -8px; font-size: 0.6rem; color: #64748b; background: #1e293b; padding-right: 4px;">${maxVal > 1 ? Math.round(maxVal * 0.75) : ''}</span></div>
					<div style="border-top: 1px dashed rgba(148, 163, 184, 0.2); width: 100%; position: relative;"><span style="position: absolute; left: 0; top: -8px; font-size: 0.6rem; color: #64748b; background: #1e293b; padding-right: 4px;">${maxVal > 1 ? Math.round(maxVal / 2) : ''}</span></div>
					<div style="border-top: 1px dashed rgba(148, 163, 184, 0.2); width: 100%; position: relative;"><span style="position: absolute; left: 0; top: -8px; font-size: 0.6rem; color: #64748b; background: #1e293b; padding-right: 4px;">${maxVal > 1 ? Math.round(maxVal * 0.25) : ''}</span></div>
					<div style="border-top: 1px solid transparent; width: 100%;"></div> 
				</div>
				<div style="overflow-x: auto; overflow-y: hidden; padding-bottom: 35px; padding-top: 20px; position: relative; z-index: 1;">
					<div style="display: flex; flex-wrap: nowrap; padding: 0 10px 0 25px; min-width: 100%; width: max-content; justify-content: space-around; box-sizing: border-box;">
						${columnsHtml}
					</div>
				</div>
			</div>
		</div>`;
	};

	// 5. Helper to generate Stacked Time Charts (Day/Month Toggle)
	const generateStackedTimeChart = () => {
		const buildBackgroundLines = (maxVal) => `
			<div style="position: absolute; top: 20px; left: 0; right: 0; height: 150px; pointer-events: none; display: flex; flex-direction: column; justify-content: space-between; z-index: 0; padding: 0 10px;">
				<div style="border-top: 1px dashed rgba(148, 163, 184, 0.2); width: 100%; position: relative;"><span style="position: absolute; left: 0; top: -8px; font-size: 0.6rem; color: #64748b; background: #1e293b; padding-right: 4px;">${maxVal}</span></div>
				<div style="border-top: 1px dashed rgba(148, 163, 184, 0.2); width: 100%; position: relative;"><span style="position: absolute; left: 0; top: -8px; font-size: 0.6rem; color: #64748b; background: #1e293b; padding-right: 4px;">${maxVal > 1 ? Math.round(maxVal * 0.75) : ''}</span></div>
				<div style="border-top: 1px dashed rgba(148, 163, 184, 0.2); width: 100%; position: relative;"><span style="position: absolute; left: 0; top: -8px; font-size: 0.6rem; color: #64748b; background: #1e293b; padding-right: 4px;">${maxVal > 1 ? Math.round(maxVal / 2) : ''}</span></div>
				<div style="border-top: 1px dashed rgba(148, 163, 184, 0.2); width: 100%; position: relative;"><span style="position: absolute; left: 0; top: -8px; font-size: 0.6rem; color: #64748b; background: #1e293b; padding-right: 4px;">${maxVal > 1 ? Math.round(maxVal * 0.25) : ''}</span></div>
				<div style="border-top: 1px solid transparent; width: 100%;"></div> 
			</div>
		`;

		const buildStackedColumns = (keys, dataMap, gamesMap, maxVal) => {
			return keys.map(key => {
				const mCount = dataMap[key].mastered;
				const cCount = dataMap[key].completed;
				const total = mCount + cCount;
				const mPct = maxVal > 0 ? (mCount / maxVal) * 100 : 0;
				const cPct = maxVal > 0 ? (cCount / maxVal) * 100 : 0;
				
				const mList = gamesMap[key].mastered.join('&#10;• ').replace(/~([^~]+)~\s?/g, '').trim();
				const cList = gamesMap[key].completed.join('&#10;• ').replace(/~([^~]+)~\s?/g, '').trim();
				console.log('mlist', mList)
				let tooltipText = `${key} (${total})`;
				if (mCount > 0) tooltipText += `&#10;🏆 Mastered (${mCount}):&#10;• ${mList}`;
				if (cCount > 0) tooltipText += `&#10;🎖 Completed (${cCount}):&#10;• ${cList}`;

				const topRadius = cPct === 0 ? '4px 4px 0 0' : '4px 4px 0 0'; 
				const bottomRadius = mPct === 0 ? '4px 4px 0 0' : '0';

				return `
				<div style="display: flex; flex-direction: column; width: 55px; flex-shrink: 0; align-items: center;">
					<div style="position: relative; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; width: 100%; height: 150px; border-bottom: 1px solid var(--border);" title="${tooltipText}">
						<span style="font-size: 0.65rem; color: #94a3b8; position: absolute; bottom: calc(${mPct + cPct}% + 4px);">${total > 0 ? total : ''}</span>
						<!-- Mastered (Yellow) -->
						<div style="background: #eab308; width: 25px; height: ${mPct}%; border-radius: ${topRadius}; min-height: ${mPct > 0 ? '2px' : '0'}; transition: height 0.3s; margin-bottom: 0;"></div>
						<!-- Completed (Blue) -->
						<div style="background: #3b82f6; width: 25px; height: ${cPct}%; border-radius: ${bottomRadius}; min-height: ${cPct > 0 ? '2px' : '0'}; transition: height 0.3s;"></div>
					</div>
					<div style="display: flex; justify-content: flex-end; margin-top: 10px; width: 100%;">
						<span style="font-size: 0.55rem; color: #64748b; transform: rotate(-45deg); transform-origin: bottom; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; width: 75px; margin-right: 15px; line-height: 1.1; text-align: right; padding-top: 5px;">${key}</span>
					</div>
				</div>`;
			}).join('');
		};

		return `
		<div class="chart-container" style="background: #1e293b; padding: 10px; border-radius: 8px; border: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden; ">
			
			<div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); margin-bottom: 10px; padding-bottom: 5px;">
				<h4 style="margin: 0; font-size: 0.8rem; color: var(--text);">Completions by Completion Date</h4>
				<div style="font-size: 0.65rem; background: #0f172a; padding: 2px; border-radius: 4px; display: flex; gap: 2px; border: 1px solid var(--border);">
					<button onclick="this.closest('.chart-container').querySelector('.day-view').style.display='block'; this.closest('.chart-container').querySelector('.month-view').style.display='none'; this.style.background='var(--primary)'; this.style.color='#fff'; this.nextElementSibling.style.background='transparent'; this.nextElementSibling.style.color='#94a3b8';" style="background: var(--primary); color: #fff; border: none; padding: 3px 8px; border-radius: 3px; cursor: pointer; transition: background 0.2s;">Day</button>
					<button onclick="this.closest('.chart-container').querySelector('.day-view').style.display='none'; this.closest('.chart-container').querySelector('.month-view').style.display='block'; this.style.background='var(--primary)'; this.style.color='#fff'; this.previousElementSibling.style.background='transparent'; this.previousElementSibling.style.color='#94a3b8';" style="background: transparent; color: #94a3b8; border: none; padding: 3px 8px; border-radius: 3px; cursor: pointer; transition: background 0.2s;">Month</button>
				</div>
			</div>
			
			<!-- DAY VIEW -->
			<div class="day-view" style="display: block; position: relative;">
				${buildBackgroundLines(maxDay)}
				<div style="overflow-x: auto; overflow-y: hidden; padding-bottom: 35px; padding-top: 20px; position: relative; z-index: 1;">
					<div style="display: flex; flex-wrap: nowrap; padding: 0 10px 0 25px; min-width: 100%; width: max-content; justify-content: space-around; box-sizing: border-box;">
						${buildStackedColumns(dayNames, dayCounts, dayGames, maxDay)}
					</div>
				</div>
			</div>

			<!-- MONTH VIEW -->
			<div class="month-view" style="display: none; position: relative;">
				${buildBackgroundLines(maxMonth)}
				<div style="overflow-x: auto; overflow-y: hidden; padding-bottom: 35px; padding-top: 20px; position: relative; z-index: 1;">
					<div style="display: flex; flex-wrap: nowrap; padding: 0 10px 0 25px; min-width: 100%; width: max-content; justify-content: space-around; box-sizing: border-box;">
						${buildStackedColumns(monthNames, monthCounts, monthGames, maxMonth)}
					</div>
				</div>
			</div>
			
		</div>`;
	};
	
	return `
	<div id="completion-graphs" style="display: grid; gap: 10px; margin-bottom: 15px; grid-template-columns: repeat(auto-fit, minmax(1fr, 1fr));">
		${consoles.length > 1 ? generateBarChart('Completions by Console', consoles, consoleCounts, maxConsole, consoleGames) : ''}
		${years.length > 1 ? generateBarChart('Completions by Release Year', years, yearCounts, maxYear, yearGames) : ''}
		${genres.length > 1 ? generateBarChart('Completions by Genre', genres, genreCounts, maxGenre, genreGames, true) : ''}
		${publishers.length > 1 ? generateBarChart('Completions by Publisher', publishers, publisherCounts, maxPublisher, publisherGames, true) : ''}
		${developers.length > 1 ? generateBarChart('Completions by Developer', developers, developerCounts, maxDeveloper, developerGames, true) : ''}
		${(maxDay > 0 || maxMonth > 0) ? generateStackedTimeChart() : ''}
	</div>`;
}

function buildLastPlayedHTML(data) {
	const recentGamesSrc = data.recentlyPlayed || data.recentGames || [];
	const mostRecentGame = Array.isArray(recentGamesSrc) && recentGamesSrc.length > 0 ? recentGamesSrc[0] : null;

	let rpHeaderHtml = `<h4 style="margin: 0px; padding-bottom: 5px;">Rich Presence Msg</h4>`;

	if (mostRecentGame) {
		const rpGameId = mostRecentGame.gameId || mostRecentGame.GameID || mostRecentGame.id || mostRecentGame.ID;
		const gameIcon = mostRecentGame.imageIcon || mostRecentGame.ImageIcon;
		const gameTitle = mostRecentGame.title || mostRecentGame.Title || mostRecentGame.gameTitle || mostRecentGame.GameTitle || 'Unknown Game';
		const consoleName = mostRecentGame.consoleName || mostRecentGame.ConsoleName || '';
		const consoleId = mostRecentGame.consoleID || mostRecentGame.ConsoleID || mostRecentGame.consoleId;

		let consoleKey = null;
		if (consoleId && typeof RA_CONSOLE_IDS !== 'undefined') consoleKey = Object.keys(RA_CONSOLE_IDS).find(key => RA_CONSOLE_IDS[key] == consoleId);
		if (!consoleKey && consoleName && typeof CONSOLE_FULL_NAMES !== 'undefined') consoleKey = Object.keys(CONSOLE_FULL_NAMES).find(key => CONSOLE_FULL_NAMES[key] === consoleName);

		const customConsoleImgUrl = (consoleKey && typeof CONSOLE_IMAGES !== 'undefined') ? CONSOLE_IMAGES[consoleKey] : null;
		const consoleIconHtml = customConsoleImgUrl
			? `<img src="${customConsoleImgUrl}" style="height:14px; width:auto; object-fit:contain; margin-right:6px;" alt="${consoleName} icon">`
			: (consoleId ? `<img src="https://media.retroachievements.org/Images/Console/${consoleId}.png" style="width:16px; height:16px; margin-right:4px;" onerror="this.style.display='none'">` : ``);

		rpHeaderHtml = `
		<h4 style="margin: 0 0 10px 0; padding-bottom: 5px; border-bottom: 1px solid var(--border);">Last Played</h4>
		<div style="display: flex; gap: 10px; align-items: center; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid var(--border);">
			${gameIcon ? `<a href="https://retroachievements.org/game/${rpGameId}" target="_blank">
			<img src="https://media.retroachievements.org${gameIcon}" style="width: 48px; height: 48px; border-radius: 4px; flex-shrink: 0;" alt="Game Icon">
			</a>` : `<div style="width: 48px; height: 48px; background: #334155; border-radius: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">🎮</div>`}
			<div style="min-width: 0;">
				<div style="font-weight: bold; color: var(--primary); font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><a href="https://retroachievements.org/game/${rpGameId}" target="_blank" style="color: inherit;">${gameTitle}</a></div>
				${consoleName ? `<div style="display: flex; align-items: center; font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">${consoleIconHtml}${consoleName}</div>` : ''}
			</div>
		</div>`;
	}

	return `
	<div class="recent-stats" style="background: #1e293b; padding: 10px; border-radius: 6px; border: 1px solid var(--border); grid-column: 1 / -1;">
		${rpHeaderHtml}
		<div style="font-size: 0.9rem; font-weight: normal; color: var(--text); word-break: break-word;">${data.richPresenceMsg || ''}</div>
	</div>`;
}

function buildRecentAchievementsHTML(achData) {
	let allAchievements = [];
	for (let gameId in achData) {
		let achievements = achData[gameId];
		for (let achId in achievements) allAchievements.push(achievements[achId]);
	}
	allAchievements.sort((a, b) => new Date(b.dateAwarded) - new Date(a.dateAwarded));

	let html = `<div class="mgmt-list-scroll" style="max-height: 200px; overflow-y: auto; padding-right: 5px;">`;
	for (let ach of allAchievements) {
		const achId = ach.id || ach.ID;
		const achGameId = ach.gameId || ach.GameID;
		const achGameTitle = ach.gameTitle || ach.GameTitle;

		html += `
		<div style="display: flex; gap: 10px; margin-bottom: 8px; align-items: center; background: rgba(0,0,0,0.2); padding: 5px; border-radius: 4px;">
		<a href="https://retroachievements.org/achievement/${achId}" target="_blank">
		<img src="https://media.retroachievements.org/Badge/${ach.badgeName}.png" style="width: 48px; height: 48px; border-radius: 4px;" alt="badge">
		</a>
			<div>
				<div style="font-size: 0.8rem; font-weight: bold; color: var(--primary);"><a href="https://retroachievements.org/achievement/${achId}" target="_blank" style="color: inherit;">${ach.title}</a> <span style="color: var(--accent);">(${ach.points}pts)</span></div>
				<div style="font-size: 0.7rem; color: #94a3b8; margin: 2px 0;">${ach.description}</div>
				<div style="font-size: 0.65rem; color: #64748b;"><a href="https://retroachievements.org/game/${achGameId}" target="_blank" style="color: inherit;">${achGameTitle}</a> • ${ach.dateAwarded}</div>
			</div>
		</div>`;
	}
	html += `</div>`;
	return html;
}

function buildRecentlyPlayedHTML(gamesData, gamesToLookup) {
	let html = `<div class="mgmt-list-scroll" style="max-height: 200px; overflow-y: auto; padding-right: 5px;">`;
	const completedCache = JSON.parse(localStorage.getItem('ra_api_completed')) || [];

	gamesData.forEach(game => {
		const title = typeof game === 'object' && game !== null ? (game.title || game.Title || game.gameTitle || game.GameTitle || 'Unknown Game') : game;
		const iconPath = typeof game === 'object' && game !== null ? (game.imageIcon || game.ImageIcon) : null;
		const gameId = typeof game === 'object' && game !== null ? (game.id || game.gameId || game.GameID) : null;

		let numAchieved = 0; let numPossible = 0; let scoreAchieved = 0; let possibleScore = 0;

		const cachedGame = completedCache.find(g => String(g.gameId || g.GameID || g.id) === String(gameId));
		const isMastered = cachedGame && cachedGame.calculatedCategory === 'mastered';
		const isCompleted = cachedGame && cachedGame.calculatedCategory === 'completed';

		if (cachedGame && cachedGame.progData) {
			numAchieved = parseInt(cachedGame.progData.numAchieved || cachedGame.progData.NumAchieved) || 0;
			numPossible = parseInt(cachedGame.progData.numPossibleAchievements || cachedGame.progData.NumPossibleAchievements) || parseInt(cachedGame.maxPossible) || 0;
			scoreAchieved = parseInt(cachedGame.progData.scoreAchieved || cachedGame.progData.ScoreAchieved) || 0;
			possibleScore = parseInt(cachedGame.progData.possibleScore || cachedGame.progData.PossibleScore) || 0;
		} else {
			numAchieved = typeof game === 'object' && game !== null ? parseInt(game.numAchieved || game.NumAchieved || 0) : 0;
			numPossible = typeof game === 'object' && game !== null ? parseInt(game.numPossibleAchievements || game.NumPossibleAchievements || 0) : 0;
			scoreAchieved = typeof game === 'object' && game !== null ? parseInt(game.scoreAchieved || game.ScoreAchieved || 0) : 0;
			possibleScore = typeof game === 'object' && game !== null ? parseInt(game.possibleScore || game.PossibleScore || 0) : 0;
		}

		if ((!numPossible || !possibleScore) && typeof userLibrary !== 'undefined') {
			for (const con in userLibrary) {
				const libGame = userLibrary[con].find(g => String(g.raId) === String(gameId));
				if (libGame && (libGame.maxAch || libGame.pts)) {
					numPossible = libGame.maxAch || 0;
					possibleScore = libGame.pts || 0;
					break;
				}
			}
		}

		let needsLookup = false;
		if (!numPossible || !possibleScore) {
			needsLookup = true;
			if (gameId) gamesToLookup.push({ gameId, numAchieved, scoreAchieved });
		}

		let imgOutline = '';
		if (isMastered) imgOutline = 'border: 2px solid #eab308;';
		else if (isCompleted) imgOutline = 'border: 2px solid #3b82f6;';
		else imgOutline = 'border: 2px solid transparent;';

		const iconHtml = iconPath
			? `<img src="https://media.retroachievements.org${iconPath}" style="width: 48px; height: 48px; border-radius: 4px; flex-shrink: 0; box-sizing: border-box; ${imgOutline}" alt="game icon">`
			: `<div style="width: 48px; height: 48px; border-radius: 4px; flex-shrink: 0; box-sizing: border-box; background: #334155; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; ${imgOutline}">🎮</div>`;

		html += `
		<div style="display: flex; gap: 10px; margin-bottom: 8px; align-items: center; background: rgba(0,0,0,0.2); padding: 5px; border-radius: 4px;">
		<a href="https://retroachievements.org/game/${gameId}" target="_blank">${iconHtml}</a>
			<div>
				<div style="font-size: 0.8rem; font-weight: bold; color: var(--primary);"><a href="https://retroachievements.org/game/${gameId}" target="_blank" style="color: inherit;">${title}</a></div>
				<div style="font-size: 0.7rem; color: #94a3b8; margin: 2px 0;">Achievements: <span id="rp-ach-${gameId}" style="color:var(--text); font-weight: bold;">${numAchieved} / ${needsLookup ? '...' : numPossible}</span></div>
				<div style="font-size: 0.65rem; color: #64748b;">Points: <span id="rp-pts-${gameId}" style="color:var(--text); font-weight: bold;">${scoreAchieved} / ${needsLookup ? '...' : possibleScore}</span></div>
			</div>
		</div>`;
	});
	html += `</div>`;
	return html;
}

// ==========================================
// MAIN RENDER FUNCTION
// ==========================================
async function renderSummary(data, user) {
	const container = document.getElementById('ra-user-stats');
	let gamesToLookup = [];

	// 1. Build Header
	let statsHtml = buildUserHeaderHTML(data, user);

	// 2. Inject New Completion Charts
	// Because updateAndRenderRankChart targets the top of `container`, placing this
	// right here ensures it sits beneath the Rank Chart but above the Data Grid.
	statsHtml += await buildCompletionChartsHTML();

	// 3. Build the Data Grid
	statsHtml += `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">`;

	// Force "Last Played" (richPresenceMsg) to render at the top of the grid
	if (data.richPresenceMsg) {
		statsHtml += buildLastPlayedHTML(data);
	}

	// Render remaining dynamic blocks
	const excludedKeys = ['totalPoints', 'totalTruePoints', 'totalSoftcorePoints', 'rank', 'richPresenceMsg', 'userPic', 'status', 'memberSince', 'MemberSince', 'motto'];
	const dynamicKeys = Object.keys(data).filter(k => !excludedKeys.includes(k));

	dynamicKeys.forEach(k => {
		if (data[k] !== undefined && data[k] !== null && data[k] !== '') {
			const formattedKey = k.replace(/([A-Z])/g, ' $1').trim().toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
			let displayValue = data[k];

			if (k === 'lastActivity') {
				if (!displayValue || displayValue.id === 0 || !displayValue.activitytype) return;
				displayValue = `<strong>Type:</strong> ${displayValue.activitytype} <br><strong style="margin-top:4px; display:inline-block;">Updated:</strong> ${displayValue.lastupdate || 'N/A'}`;
			}
			else if (k === 'recentAchievements') displayValue = buildRecentAchievementsHTML(displayValue);
			else if (k === 'recentlyPlayed' || k === 'recentGames') {
				if (Array.isArray(displayValue)) displayValue = buildRecentlyPlayedHTML(displayValue, gamesToLookup);
			}
			else if (typeof displayValue === 'object') {
				if (Array.isArray(displayValue)) {
					displayValue = displayValue.map(item => {
						if (typeof item === 'object' && item !== null) return item.title || item.Title || item.gameTitle || item.GameTitle || JSON.stringify(item);
						return item;
					}).join(', ');
				} else {
					displayValue = JSON.stringify(displayValue);
				}
			}

			statsHtml += `
			<div class="recent-stats" style="background: #1e293b; padding: 10px; border-radius: 6px; border: 1px solid var(--border);">
				<h4 style="margin: 0px; padding-bottom: 5px;">${formattedKey}</h4>
				<div style="font-size: 0.9rem; font-weight: normal; color: var(--text); word-break: break-word;">${displayValue}</div>
			</div>`;
		}
	});
	statsHtml += `</div>`; // Close Grid

	// 4. Footer Additions
	const userAwardsDiv = document.getElementById('user-awards');
	if (userAwardsDiv) userAwardsDiv.innerHTML = `<div id="ra-user-awards"><p style="font-size:0.75rem; color:#94a3b8;">Loading...</p></div>`;

	statsHtml += `<h4 style="margin-top:20px; border-bottom:1px solid var(--border); padding-bottom:5px; margin-bottom: 10px; display: flex;justify-content: space-between; align-items: center;">Want to Play
	<button class="ui-btn btn-success" style="padding:8px; font-size:0.75rem;" onclick="importWantToPlayGames()">Add ${typeof wtpGamesCache !== 'undefined' ? wtpGamesCache.length : 0} Games to Library</button></h4>`;
	statsHtml += `<div id="ra-want-to-play-header"></div>`;
	statsHtml += `<div id="ra-want-to-play" class="mgmt-list-scroll" style="max-height: 250px; border:none; background:transparent; padding-top: 0px;"><p style="font-size:0.75rem; color:#94a3b8;">Loading...</p></div>`;

	statsHtml += `<h4 style="display: none; margin-top:20px; border-bottom:1px solid var(--border); padding-bottom:5px; margin-bottom: 0;">Games in Progress</h4>`;
	statsHtml += `<div style="display: none;" id="ra-completed"><p style="font-size:0.75rem; color:#94a3b8;">Loading...</p></div>`;

	// Final DOM Injection
	container.innerHTML = statsHtml;

	// 5. External Function Triggers
	if (data.rank && typeof window.updateAndRenderRankChart === 'function') {
		const cleanRankNumber = parseInt(String(data.rank).replace(/,/g, ''), 10);
		if (!isNaN(cleanRankNumber)) window.updateAndRenderRankChart(container, cleanRankNumber);
	}

	// 6. Async Data Recovery (Preserved exactly as requested)
	if (gamesToLookup.length > 0) {
		gamesToLookup.forEach(async (g) => {
			let maxAch = 0; let maxPts = 0; let found = false;
			const cacheKeys = [`ra_game_data_${g.gameId}`, `ra_game_${g.gameId}`, `game_${g.gameId}`, `ra_api_game_${g.gameId}`];
			for (let key of cacheKeys) {
				try {
					const stored = localStorage.getItem(key);
					if (stored) {
						const parsed = JSON.parse(stored);
						if (parsed.numPossibleAchievements || parsed.NumAchievements || parsed.numAchievements) {
							maxAch = parseInt(parsed.numPossibleAchievements || parsed.NumAchievements || parsed.numAchievements || 0);
							maxPts = parseInt(parsed.possibleScore || parsed.Points || parsed.points || 0);
							found = true;
							break;
						}
					}
				} catch (e) {}
			}

			if (!found) {
				try {
					const raUser = localStorage.getItem('ra_user');
					const raKey = localStorage.getItem('ra_key');
					if (raUser && raKey) {
						const raApi = await import("https://esm.sh/@retroachievements/api");
						const authorization = raApi.buildAuthorization({ username: raUser, webApiKey: raKey });
						const extData = await fetchExtendedDataForGame(raApi, authorization, g.gameId);
						if (extData) {
							maxAch = extData.maxAch || 0;
							maxPts = extData.pts || 0;
						}
					}
				} catch (e) {
					console.warn("Could not fetch extended info for game:", g.gameId);
				}
			}

			const achEl = document.getElementById(`rp-ach-${g.gameId}`);
			const ptsEl = document.getElementById(`rp-pts-${g.gameId}`);
			if (achEl) achEl.innerHTML = `${g.numAchieved} / ${maxAch}`;
			if (ptsEl) ptsEl.innerHTML = `${g.scoreAchieved} / ${maxPts}`;
		});
	}
}

window.renderWantToPlayList = function(list, activeConsole = null) {
	const headerContainer = document.getElementById('ra-want-to-play-header');
	const wtpContainer = document.getElementById('ra-want-to-play');
	
	// Make sure both containers exist before proceeding
	if (!wtpContainer || !headerContainer) return;

	if (list && list.length > 0) {
		let grouped = { "All Games": [] };
		list.forEach(g => {
			const conName = g.ConsoleName || g.consoleName || 'Unknown Console';
			if(!grouped[conName]) grouped[conName] = [];
			grouped[conName].push(g);
			grouped["All Games"].push(g);
		});

		const consoles = Object.keys(grouped).sort((a,b) => a === "All Games" ? -1 : (b === "All Games" ? 1 : a.localeCompare(b)));
		if (!activeConsole || !grouped[activeConsole]) {
			activeConsole = consoles[0];
		}

		// --- 1. BUILD AND INJECT THE HEADER (Grand Total & Buttons) ---				
		let headerHtml = `<div style="display:flex; gap:5px; margin-bottom:10px; overflow-x:auto; padding-bottom:5px;">`;
		consoles.forEach(con => {
			const isActive = con === activeConsole;
			const btnClass = isActive ? 'btn-primary' : 'btn-ghost';
			const safeConStr = con.replace(/'/g, "\\'");
			headerHtml += `<button class="ui-btn ${btnClass}" style="padding:6px 10px; font-size:0.65rem; flex-shrink:0; text-transform:none;" onclick="renderWantToPlayList(window.wtpGamesCache, '${safeConStr}')">${con} (${grouped[con].length})</button>`;
		});
		headerHtml += `</div>`;
		
		headerContainer.innerHTML = headerHtml;

		// --- 2. BUILD AND INJECT THE LIST (Games & Import Button) ---
		let listHtml = `<ul style="list-style:none; padding:0 5px; margin:0; margin-bottom:10px; background: #00000050;">`;
		grouped[activeConsole].forEach(g => {
			const icon = g.ImageIcon || g.imageIcon || g.Image || g.BoxArt;
			const title = g.Title || g.title;
			const imgSrc = icon ? `<img src="https://media.retroachievements.org${icon.startsWith('/') ? icon : '/Images/'+icon}" style="width:20px; height:20px; vertical-align:middle; margin-right:5px; border-radius:3px; object-fit:cover;">` : '';
			listHtml += `<li style="font-size:0.75rem; padding:6px 0; border-bottom:1px solid var(--border); color:var(--text);">
				<a href="https://retroachievements.org/game/${g.id}" target="_blank" style="color: inherit;">${imgSrc}</a><a href="https://retroachievements.org/game/${g.id}" target="_blank" style="color: inherit;">${title}</a> <span style="font-size:0.65rem; color:#64748b;">[${g.ConsoleName || g.consoleName}]</span>
			</li>`;
		});
		listHtml += `</ul>`;
		
		wtpContainer.innerHTML = listHtml;
		
	} else {
		// Clear the header and show the empty message
		headerContainer.innerHTML = '';
		wtpContainer.innerHTML = `<p style="font-size:0.75rem; color:#64748b;">No games found in list. To populate this list, you must click the 'Want to Play' button on game pages directly on the RetroAchievements website.</p>`;
	}
};

async function fetchUserWantToPlay(user, key, raApi, authorization) {
	const wtpContainer = document.getElementById('ra-want-to-play');
	try {
		let list = [];
		let offset = 0;

		while (true) {
			const data = await window.safeApiCall(raApi.getUserWantToPlayList, authorization, { username: user, count: 500, offset: offset });
			if (data) {
				const results = data.Results || data.results || (Array.isArray(data) ? data : []);
				list.push(...results);

				if (results.length < 500) {
					break;
				}

				offset += 500;
			}
		}

		localStorage.setItem('ra_api_wtp', JSON.stringify(list));
		
		list = list.filter(g => {
			const cId = g.consoleId !== undefined ? g.consoleId : g.ConsoleID;
			const cName = g.consoleName !== undefined ? g.consoleName : g.ConsoleName;
			return ![100, 101].includes(Number(cId)) && !['events', 'hubs'].includes(String(cName || '').toLowerCase());
		});

		window.wtpGamesCache = list;
		window.renderWantToPlayList(list);

	} catch (err) {
		console.error("WTP Fetch error:", err);
		if(wtpContainer) wtpContainer.innerHTML = `<p style="font-size:0.75rem; color:var(--danger);">Error loading list. Check console.</p>`;
	}
}

async function importWantToPlayGames() {
	if (!window.wtpGamesCache || window.wtpGamesCache.length === 0) return alert("No games in Want to Play list.");
	
	// Open DB and load all games into memory for fast searching
	const db = await dbPromise;
	const allGamesFromDB = await db.getAll('games');
	
	let importCount = 0;
	
	// Switched to for...of loop to allow asynchronous database saving
	for (const g of window.wtpGamesCache) {
		const conId = parseInt(g.ConsoleID || g.consoleId);
		const title = g.Title || g.title;
		const id = g.ID || g.id;
		const icon = g.ImageIcon || g.imageIcon;

		let targetCon = null;
		for (const [conName, cId] of Object.entries(RA_CONSOLE_IDS)) {
			if (cId === conId) { targetCon = conName; break; }
		}
		
		if (!targetCon) {
			for (const [conName, fullName] of Object.entries(CONSOLE_FULL_NAMES)) {
				if (fullName === (g.ConsoleName || g.consoleName)) { targetCon = conName; break; }
			}
		}
		
		if (!targetCon) targetCon = g.ConsoleName || g.consoleName || "Unknown";

		if (targetCon) {
			if (!userLibrary[targetCon]) userLibrary[targetCon] = [];
			const raIdStr = String(id);
			
			// Search the database array instead of just the local RAM array
			let match = allGamesFromDB.find(libGame => libGame.raId === raIdStr);
			
			if (!match) {
				const normRa = normalizeString(title);
				match = allGamesFromDB.find(libGame => libGame.consoleName === targetCon && normalizeString(libGame.name) === normRa);
			}
			
			let needsDbSave = false;

			if (!match) {
				match = {
					id: Math.random().toString(36).substr(2, 9),
					name: title,
					raId: raIdStr,
					imgId: cleanImg(icon),
					maxAch: g.numAchievements || g.NumAchievements || 0,
					consoleName: targetCon, // Required for DB structural grouping
					consoleId: conId        // Injected per your request
				};
				userLibrary[targetCon].push(match);
				allGamesFromDB.push(match);
				needsDbSave = true;
				importCount++;
			} else if (!match.raId) {
				match.raId = raIdStr;
				needsDbSave = true;
			}
			
			if (!completedData[targetCon]) completedData[targetCon] = [];
			if (!masteredData[targetCon]) masteredData[targetCon] = [];

			// Save the newly created or updated game directly to the DB
			if (needsDbSave) {
				try {
					await db.put('games', match);
				} catch (err) {
					console.error(`Failed to save WTP game ${match.name} to DB`, err);
				}
			}
		}
	}

	if (importCount > 0) {
		cleanupLibrary();
		updateModifySelect();
		renderSidebar();
		renderModifyList();
		alert(`Successfully imported ${importCount} game(s) from your Want to Play list!`);
	} else {
		alert("All games in your Want to Play list are already in your library.");
	}
}

async function renderUserAwards(masteredList, completedList, beatenHardcoreList, beatenSoftcoreList, progressList) {
	const db = await dbPromise;
	const container = document.getElementById('ra-user-awards');
	if (!container) return;
	
	let html = ``;
	if (masteredList) {
		if (masteredList.length > 0) { 
			html += `<div><h5 style="margin: 0;padding-bottom:5px;">👑 Mastered Games (${masteredList.length})</h5></div>`;
			html += `<div class="awards-grid" style="display: grid; grid-template-columns:repeat(auto-fill, 68px); gap:5px; justify-content:center; border-bottom: solid 1px var(--border);
			padding-bottom: 10px;">`;
			let hasAwards = false;
			
			masteredList.forEach(g => {
				hasAwards = true;
				const icon = g.imageIcon || g.ImageIcon;
				const title = g.title || g.Title;
				const imgSrc = `https://media.retroachievements.org${icon.startsWith('/') ? icon : '/Images/' + icon}`;
				const masteryDate = new Date(g.highestAwardDate);
				const masteryDateText = masteryDate.toLocaleDateString();
				html += `<a class="award-icon" href="https://retroachievements.org/game/${g.gameId}" target="_blank" style="display: flex; align-items: center; justify-content: center;">`;
				html += `<img src="${imgSrc}" title="${title}&#10;Mastery Date: ${masteryDateText}&#10;Achievements: ${g.progData.numAchievedHardcore}/${g.progData.numPossibleAchievements}&#10;Points: ${g.progData.scoreAchievedHardcore}/${g.progData.possibleScore}" style="border-radius:4px; border: 2px solid #eab308; object-fit:cover;">`;
				html += `</a>`;
			});
			
			html += `</div>`;
		}
	}
	if (completedList) {
		if (completedList.length > 0) { 
			html += `<div><h5 style="margin-top: 10px; margin-bottom: 0;padding-bottom:5px; ">🎖️ Completed Games (${completedList.length})</h5></div>`;			
			html += `<div class="awards-grid" style="display: grid; grid-template-columns:repeat(auto-fill, 68px); gap:5px; justify-content:center; border-bottom: solid 1px var(--border);
			padding-bottom: 10px;">`;	
							
			completedList.forEach(g => {
				hasAwards = true;
				const icon = g.imageIcon || g.ImageIcon;
				const title = g.title || g.Title;
				const imgSrc = `https://media.retroachievements.org${icon.startsWith('/') ? icon : '/Images/'+icon}`;
				const completionDate = new Date(g.highestAwardDate);
				const completionDateText = completionDate.toLocaleDateString();
				html += `<a class="award-icon" href="https://retroachievements.org/game/${g.gameId}" target="_blank">`;
				html += `<img src="${imgSrc}" title="${title}&#10;Completion Date: ${completionDateText}&#10;Achievements: ${g.progData.numAchieved}/${g.progData.numPossibleAchievements}&#10;Points: ${g.progData.scoreAchieved}/${g.progData.possibleScore}" style="border-radius:4px; border: 2px solid #3b82f6; object-fit:cover;">`;
				html += `</a>`;
			});
			
			html += `</div>`;
		}
	}
	if (beatenHardcoreList) {
		if (beatenHardcoreList.length > 0) { 
			html += `<div><h5 style="margin-top: 10px; margin-bottom: 0;padding-bottom:5px; ">🏆 Beaten Games - Hardcore (${beatenHardcoreList.length})</h5></div>`;			
			html += `<div class="awards-grid" style="display: grid; grid-template-columns:repeat(auto-fill, 68px); gap:5px; justify-content:center; border-bottom: solid 1px var(--border);
			padding-bottom: 10px;">`;	
							
			beatenHardcoreList.forEach(g => {
				hasAwards = true;
				const icon = g.imageIcon || g.ImageIcon;
				const title = g.title || g.Title;
				const imgSrc = `https://media.retroachievements.org${icon.startsWith('/') ? icon : '/Images/'+icon}`;
				const beatenDate = new Date(g.highestAwardDate);
				const beatenDateText = beatenDate.toLocaleDateString();
				html += `<a href="https://retroachievements.org/game/${g.gameId}" target="_blank">`;
				html += `<img src="${imgSrc}" title="${title}&#10;Date Beaten: ${beatenDateText}&#10;Achievements: ${g.progData.numAchieved}/${g.progData.numPossibleAchievements}&#10;Points: ${g.progData.scoreAchieved}/${g.progData.possibleScore}" style="border-radius:4px; border: 2px solid #ffffff; object-fit:cover;">`;
				html += `</a>`;
			});
			
			html += `</div>`;
		}
	}
	if (beatenSoftcoreList) {
		if (beatenSoftcoreList.length > 0) {
			html += `<div><h5 style="margin-top: 10px; margin-bottom: 0;padding-bottom:5px; ">🏆 Games Beaten - Softcore (${beatenSoftcoreList.length})</h5></div>`;			
			html += `<div class="awards-grid" style="display: grid; grid-template-columns:repeat(auto-fill, 68px); gap:5px; justify-content:center; border-bottom: solid 1px var(--border);
			padding-bottom: 10px;">`;	
							
			beatenSoftcoreList.forEach(g => {
				hasAwards = true;
				const icon = g.imageIcon || g.ImageIcon;
				const title = g.title || g.Title;
				const imgSrc = `https://media.retroachievements.org${icon.startsWith('/') ? icon : '/Images/'+icon}`;
				const beatenDate = new Date(g.highestAwardDate);
				const beatenDateText = beatenDate.toLocaleDateString();
				html += `<a href="https://retroachievements.org/game/${g.gameId}" target="_blank">`;
				html += `<img src="${imgSrc}" title="${title}&#10;Date Beaten: ${beatenDateText}&#10;Achievements: ${g.progData.numAchieved}/${g.progData.numPossibleAchievements}&#10;Points: ${g.progData.scoreAchieved}/${g.progData.possibleScore}" style="border-radius:4px; border: 2px solid #ffffff; object-fit:cover;">`;
				html += `</a>`;
			});
			
			html += `</div>`;
		}
	}
	
	if (progressList) html += `<div><h5 style="margin-top: 10px; margin-bottom: 0;padding-bottom:5px; ">🎮 Games in Progress (${progressList.length})</h5></div>`;			
	html += `<div class="awards-grid" style="display: grid; grid-template-columns:repeat(auto-fill, 68px); gap:5px; justify-content:center; border-bottom: solid 1px var(--border);
	padding-bottom: 10px;">`;	 
	
	// Changed from .forEach to for...of to allow 'await' to pause the loop properly
	for (const g of progressList) {
		// Query the 'raId' index you created instead of the primary 'id' key
		const progressedGame = await db.getFromIndex('games', 'raId', String(g.gameId));
		console.log(progressedGame)
		hasAwards = true;
		const icon = g.imageIcon || g.ImageIcon;
		const title = g.title || g.Title;
		const imgSrc = `https://media.retroachievements.org${icon.startsWith('/') ? icon : '/Images/'+icon}`;
		const lastAchievedDate = new Date(g.mostRecentAwardedDate);
		const lastAchievedDateText = lastAchievedDate.toLocaleDateString();
		let dateStarted = ''
		let dateStartedText = '';
		if (progressedGame) {
			const achievements = progressedGame.achievements || progressedGame.Achievements;
			const achList = achievements ? (Array.isArray(achievements) ? achievements : Object.values(achievements)) : [];		
			let oldestDate = null;
			achList.forEach(ach => {
				[ach.dateEarned, ach.dateEarnedHardcore].forEach(earnedDate => {
					if (earnedDate) {
						const date = new Date(earnedDate);

						if (!oldestDate || date < oldestDate) {
							oldestDate = date;
						}
					}
				});
			});
			dateStarted = oldestDate;
			dateStartedText += `&#10;Date Started: ${dateStarted?.toLocaleDateString() ?? ""}`;
		}
		
		
		html += `<a href="https://retroachievements.org/game/${g.gameId}" target="_blank">`;
		html += `<img src="${imgSrc}" title="${title}${dateStartedText}&#10;Most Recent Achievement: ${lastAchievedDateText}&#10;Achievements: ${g.progData.numAchieved}/${g.progData.numPossibleAchievements}&#10;Points: ${g.progData.scoreAchieved}/${g.progData.possibleScore}" style="border-radius:4px; filter: grayscale(1); object-fit:cover;">`;
		html += `</a>`;
	}
	
	html += `</div>`;
	
	
	
	if (hasAwards) {
		container.innerHTML = html;
	} else {
		container.innerHTML = `<p style="font-size:0.75rem; color:#64748b;">No mastered/completed awards to display.</p>`;
	}
}

function renderCompletedTabs(activeTab) {
	const compContainer = document.getElementById('ra-completed');
	if (!compContainer) return;
	const masteredList = [];
	const completedList = [];
	const beatenHardcoreList = [];
	const beatenSoftcoreList = [];
	const progressList = [];

	raCompletedGamesCache.forEach(g => {
		if (g.calculatedCategory === "mastered") {
			masteredList.push(g);
		} else if (g.calculatedCategory === "completed") {
			completedList.push(g);
		} else if (g.calculatedCategory === "progress") {
			switch (g.highestAwardKind) {
				case "beaten-hardcore":
					beatenHardcoreList.push(g);
					break;
				case "beaten-softcore":
					beatenSoftcoreList.push(g);
					break;
				case null:
					progressList.push(g);
					break;
			}
		}
	});
	
	renderUserAwards(masteredList, completedList, beatenHardcoreList, beatenSoftcoreList, progressList);

	let html = `<div class="mgmt-list-scroll" style="max-height:355px; padding-right:5px; border:none; background:transparent;">`;

	const listToRender = progressList;

	if (listToRender.length > 0) {
		html += `<ul style="list-style:none; padding:0; margin:0;">`;
		listToRender.forEach(g => {	
			const awDate = g.mostRecentAwardedDate || g.MostRecentAwardedDate;
			const date = awDate ? new Date(awDate).toLocaleDateString() : 'Unknown Date';
			const icon = g.imageIcon || g.ImageIcon;
			const title = g.title || g.Title;
			const conName = g.consoleName || g.ConsoleName || 'Unknown';
			const consoleCode = Object.keys(RA_CONSOLE_IDS).find(key => RA_CONSOLE_IDS[key] === g.consoleId);
			const conIcon = CONSOLE_IMAGES[consoleCode];
			
			let numAch = 0; let pts = 0;
			if (g.progData) {
				numAch = activeTab === 'mastered' ? (g.progData.numAchievedHardcore || 0) : (g.progData.numAchieved || 0);
				pts = activeTab === 'mastered' ? (g.progData.scoreAchievedHardcore || 0) : (g.progData.scoreAchieved || 0);
			}
			const maxAch = g.progData ? (g.progData.numPossibleAchievements || '?') : '?';
			
			const imgSrc = `https://media.retroachievements.org${icon.startsWith('/') ? icon : '/Images/'+icon}`;

			html += `<li style="font-size:0.75rem; padding:8px; margin-bottom:4px; background:#0f172a; border-radius:6px; border:1px solid var(--border); color:var(--text); display:flex; gap:12px; align-items:center;">
				<a href="https://retroachievements.org/game/${g.gameId}" target="_blank" style="color: inherit;"><img src="${imgSrc}" style="max-width:48px; max-height:48px; border-radius:4px; flex-shrink:0; object-fit:cover;"></a>
				<div style="flex-grow:1;">
					<div style="font-weight:bold; font-size:0.8rem; display: flex;"><a href="https://retroachievements.org/game/${g.gameId}" target="_blank" style="color: inherit;">${title}</a> <span style="color:#64748b; font-weight:normal; font-size:0.7rem; display: flex;"><img src="${conIcon}" style="height:14px; width:auto; object-fit:contain; margin:0 5px;" alt="${g.consoleName} icon">${conName}</span></div>
					<div style="font-size:0.65rem; color:#94a3b8; margin-top:4px;">
						<span style="color:var(--text);">Last Progressed:</span> ${date} <br> <span style="color:var(--text);">Achievements:</span> ${numAch}/${maxAch} | <span style="color:var(--text);">Points:</span> ${pts || '0'}
					</div>
				</div>
			</li>`;
		});
		html += `</ul>`;
	} else {
		html += `<p style="font-size:0.75rem; color:#64748b; text-align:center; margin-top:20px;">No games in this category.</p>`;
	}
	html += `</div>`;
	compContainer.innerHTML = html;
}

async function fetchUserCompleted(user, key, raApi, authorization) {
	const compContainer = document.getElementById('ra-completed');
	try {
		const completion = await window.safeApiCall(raApi.getUserCompletionProgress, authorization, { username: user });
		if (!completion) return;
		
		const baseList = Array.isArray(completion) ? completion : (completion.results || Object.values(completion));
		if (baseList && baseList.length > 0) {
			const gameIds = baseList.map(g => g.gameId || g.GameID || g.id);
			
			let progressMap = {};
			const chunkSize = 20; 
			for (let i = 0; i < gameIds.length; i += chunkSize) {
				const chunk = gameIds.slice(i, i + chunkSize);
				const progChunk = await window.safeApiCall(raApi.getUserProgress, authorization, { username: user, gameIds: chunk });
				if (progChunk) Object.assign(progressMap, progChunk);
				await new Promise(r => setTimeout(r, 500)); 
			}

			raCompletedGamesCache = baseList.map(g => {
				const idStr = String(g.gameId || g.GameID || g.id);
				const prog = progressMap[idStr] || {};
				const numPoss = parseInt(prog.numPossibleAchievements || prog.NumPossibleAchievements) || parseInt(g.maxPossible) || 0;
				const numAch = parseInt(prog.numAchieved || prog.NumAchieved) || parseInt(g.numAwarded) || 0;
				const numAchHC = parseInt(prog.numAchievedHardcore || prog.NumAchievedHardcore) || parseInt(g.numAwardedHardcore) || 0;

				let cat = "none";
				
				if (numPoss > 0 && numAchHC === numPoss) {
					cat = "mastered";
				} else if (numPoss > 0 && numAch === numPoss && numAchHC < numPoss) {
					cat = "completed";
				} else if ((numAch > 0 || numAchHC > 0) && numAch < numPoss) {
					cat = "progress";
				}

				return { ...g, calculatedCategory: cat, progData: prog, extractedConsoleId: parseInt(g.consoleId || g.ConsoleID) };
			});

			const db = await dbPromise;
			const allGames = await db.getAll('games');
			let statusesChanged = false;
			
			for (const cacheGame of raCompletedGamesCache) {
				const raIdStr = String(cacheGame.gameId || cacheGame.GameID || cacheGame.id);
				const match = allGames.find(g => g.raId === raIdStr);
				
				if (match) {
					// Update database metadata
					match.progData = cacheGame.progData;
					match.calculatedCategory = cacheGame.calculatedCategory;
					match.consoleId = cacheGame.extractedConsoleId || match.consoleId;
					
					// Store the requested completion information 
					// Using ?? to ensure 0 values for NumAwarded don't trigger the fallback
					match.NumAwarded = cacheGame.NumAwarded ?? cacheGame.numAwarded ?? match.NumAwarded;
					match.NumAwardedHardcore = cacheGame.NumAwardedHardcore ?? cacheGame.numAwardedHardcore ?? match.NumAwardedHardcore;
					match.MostRecentAwardedDate = cacheGame.MostRecentAwardedDate ?? cacheGame.mostRecentAwardedDate ?? match.MostRecentAwardedDate;
					match.HighestAwardKind = cacheGame.HighestAwardKind ?? cacheGame.highestAwardKind ?? match.HighestAwardKind;
					match.HighestAwardDate = cacheGame.HighestAwardDate ?? cacheGame.highestAwardDate ?? match.HighestAwardDate;

					await db.put('games', match);

					// Mark games as mastered/completed
					const targetCon = match.consoleName;
					const cat = cacheGame.calculatedCategory;

					if (targetCon) {
						if (!completedData[targetCon]) completedData[targetCon] = [];
						if (!masteredData[targetCon]) masteredData[targetCon] = [];
						
						if (cat === "mastered" && !masteredData[targetCon].includes(match.id)) {
							masteredData[targetCon].push(match.id);
							completedData[targetCon] = completedData[targetCon].filter(id => id !== match.id);
							statusesChanged = true;
						} else if (cat === "completed" && !completedData[targetCon].includes(match.id) && !masteredData[targetCon].includes(match.id)) {
							completedData[targetCon].push(match.id);
							statusesChanged = true;
						}
					}
				}
			}

			// Save marking updates to localStorage if any categories changed
			if (statusesChanged) {
				localStorage.setItem('completedData_v3', JSON.stringify(completedData));
				localStorage.setItem('masteredData_v3', JSON.stringify(masteredData));
			}

			localStorage.setItem('ra_api_completed', JSON.stringify(raCompletedGamesCache));
			renderCompletedTabs('mastered');
		} else {
			localStorage.removeItem('ra_api_completed');
			if(compContainer) compContainer.innerHTML = `<p style="font-size:0.75rem; color:#64748b;">No completed games found.</p>`;
		}
	} catch (err) {
		console.error(err);
		if(compContainer) compContainer.innerHTML = `<p style="font-size:0.75rem; color:var(--danger);">Error loading list.</p>`;
	}
}

async function syncRACompletedGames() {
	const user = localStorage.getItem('ra_user');
	const key = localStorage.getItem('ra_key');
	
	const btn = document.querySelector('button[onclick="syncRACompletedGames()"]');
	const origText = btn ? btn.innerText : '';
	if (btn) btn.innerText = "Adding to Library...";
	
	if (user && key) {
		try {
			const raApi = await import("https://esm.sh/@retroachievements/api");
			const authorization = raApi.buildAuthorization({ username: user, webApiKey: key });
			await fetchUserCompleted(user, key, raApi, authorization); 
		} catch (e) { 
			console.error("Failed to update progress during sync", e); 
		}
	}
	if (btn) btn.innerText = origText;

	if (!raCompletedGamesCache || raCompletedGamesCache.length === 0) {
		return alert("No games found to sync. Ensure you fetched API stats first.");
	}

	const db = await dbPromise;
	let newlyAddedCount = 0;
	
	for (const raGame of raCompletedGamesCache) {
		const cat = raGame.calculatedCategory;
		
		// Allow mastered, completed, and in-progress games to be added
		if (cat !== "mastered" && cat !== "completed" && cat !== "progress") continue;

		const raIdStr = String(raGame.gameId || raGame.GameID || raGame.id || raGame.ID);
		const raConsoleId = parseInt(raGame.consoleId || raGame.ConsoleID);
		const title = raGame.title || raGame.Title;
		const icon = raGame.imageIcon || raGame.ImageIcon;

		let targetCon = null;
		for (const [conName, conId] of Object.entries(RA_CONSOLE_IDS)) {
			if (conId === raConsoleId) { targetCon = conName; break; }
		}

		if (!targetCon) continue; 

		if (!userLibrary[targetCon]) userLibrary[targetCon] = [];

		let match = userLibrary[targetCon].find(g => g.raId === raIdStr);
		if (!match) {
			const normRa = normalizeString(title);
			match = userLibrary[targetCon].find(g => normalizeString(g.name) === normRa);
		}

		let gameModified = false;

		if (!match) {
			match = { 
				id: Math.random().toString(36).substr(2, 9), 
				name: title, 
				raId: raIdStr, 
				imgId: cleanImg(icon),
				maxAch: raGame.numAchievements || raGame.NumAchievements || raGame.maxPossible || 0,
				consoleName: targetCon
			};
			userLibrary[targetCon].push(match);
			newlyAddedCount++;
			gameModified = true;
		} else if (!match.raId) {
			match.raId = raIdStr; 
			gameModified = true;
		}

		// Save new or updated game object directly to IndexedDB
		if (gameModified && db) {
			await db.put('games', match);
		}
	}
	
	await cleanupLibrary();
	updateModifySelect();
	renderSidebar();
	renderModifyList();
	
	if (newlyAddedCount > 0) {
		alert(`${newlyAddedCount} new games successfully added to Library.`);
	} else {
		alert(`All mastered/completed/in progress games are already in your library.`);
	}
}

function showGameSelection(games) {
	return new Promise((resolve) => {
		let modal = document.getElementById('game-select-modal');
		if (!modal) {
			const modalHtml = `
			<div id="game-select-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:200; display:flex; justify-content:center; align-items:center;">
				<div class="modal-content" style="width: 500px; height: auto; max-height: 80vh; padding: 20px;">
					<h3 style="margin-top:0; color:var(--primary);">Select a Game</h3>
					<p style="font-size:0.8rem; color:#94a3b8; margin-top: -10px; margin-bottom: 15px;">Multiple games found. Please choose the correct one:</p>
					<div id="game-select-list" class="mgmt-list-scroll" style="margin-bottom: 10px; max-height: 400px; overflow-y: auto;"></div>
					<button class="ui-btn btn-ghost" style="width:100%; flex-shrink: 0;" onclick="cancelGameSelection()">Cancel</button>
				</div>
			</div>`;
			document.body.insertAdjacentHTML('beforeend', modalHtml);
			modal = document.getElementById('game-select-modal');
		} else {
			modal.style.display = 'flex';
		}

		const listContainer = document.getElementById('game-select-list');
		listContainer.innerHTML = '';

		games.forEach((g) => {
			const item = document.createElement('div');
			item.style.cssText = "padding: 10px; border-bottom: 1px solid var(--border); cursor: pointer; display: flex; flex-direction: column; gap: 4px; transition: background 0.2s;";
			item.onmouseover = () => item.style.background = '#1e293b';
			item.onmouseout = () => item.style.background = 'transparent';
			item.innerHTML = `<strong style="color:var(--text); font-size: 0.85rem;">${g.title || g.Title}</strong> <span style="font-size:0.7rem; color:var(--accent);">RA ID: ${g.id || g.ID}</span>`;
			item.onclick = () => {
				modal.style.display = 'none';
				resolve(g);
			};
			listContainer.appendChild(item);
		});

		window.cancelGameSelection = function() {
			modal.style.display = 'none';
			resolve(null);
		}
	});
}

function normalizeString(str) {
	if (!str) return "";
	let fixedStr = String(str).replace(/^(.*?),\s*the(?:\s*-\s*|\s+)(.*)$/i, 'The $1 $2');
	fixedStr = fixedStr.replace(/^(.*?),\s*the$/i, 'The $1');
	fixedStr = fixedStr.replace(/^(disney's\s+|disney-pixar\s+|disney\s+)/i, '');
	return fixedStr.normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
				.replace(/[-:]/g, " ") 
				.replace(/[^\w\s]/gi, "") 
				.replace(/\s+/g, " ") 
				.toLowerCase().trim();
}

function findGameInList(gameTitle, apiGames) {
	const normSearch = normalizeString(gameTitle);
	
	let searchOverride = normSearch;
	if (normSearch.includes("pitfall pitfall harrys jungle adventure")) searchOverride = "pitfall";
	if (normSearch.includes("crash bandicoot warped")) searchOverride = "crash bandicoot 3 warped";
	if (normSearch.includes("ctr crash team racing")) searchOverride = "crash team racing";
	
	let exact = apiGames.find(g => normalizeString(g.title || g.Title) === searchOverride);
	if (exact) return exact;

	let substringMatches = apiGames.filter(g => {
		let t = normalizeString(g.title || g.Title);
		if (t === searchOverride) return true;
		if (searchOverride.length >= 4 && t.includes(searchOverride)) return true;
		if (t.length >= 4 && searchOverride.includes(t)) return true;
		return false;
	});

	if (substringMatches.length === 1) return substringMatches[0];
	if (substringMatches.length > 1) return substringMatches;

	const baseSearch = normalizeString(gameTitle.split('-')[0]);
	let baseExact = apiGames.find(g => normalizeString(g.title || g.Title) === baseSearch);
	if (baseExact) return baseExact;

	function getScore(s1, s2) {
		const w1 = s1.split(' ').filter(x=>x);
		const w2 = s2.split(' ').filter(x=>x);
		let matches = 0;
		w1.forEach(w => { if (w2.includes(w)) matches++; });
		return matches / Math.max(w1.length, w2.length);
	}

	let bestMatch = null;
	let highestScore = 0.5;
	let multipleBest = [];

	apiGames.forEach(g => {
		const gTitleNorm = normalizeString(g.title || g.Title);
		let score = getScore(searchOverride, gTitleNorm);
		
		const gBase = normalizeString((g.title || g.Title).split('-')[0]);
		if (baseSearch === gBase) score += 0.3;

		if (score > highestScore) {
			highestScore = score;
			bestMatch = g;
			multipleBest = [g];
		} else if (score === highestScore && score > 0.5) {
			multipleBest.push(g);
		}
	});

	if (multipleBest.length === 1) return bestMatch;
	if (multipleBest.length > 1) return multipleBest;

	return null;
}

async function fetchFromRA(con, idx) {
	const user = localStorage.getItem('ra_user');
	const key = localStorage.getItem('ra_key');
	const gameTitle = userLibrary[con][idx].name;

	if (!user || !key || !gameTitle) return alert("Please ensure Username, API Key, and Game Title are set.");

	const raConsoleId = RA_CONSOLE_IDS[con];
	if (!raConsoleId) return alert("Console mapping not found for " + con);

	let raApi, authorization;
	try {
		raApi = await import("https://esm.sh/@retroachievements/api");
		authorization = raApi.buildAuthorization({ username: user, webApiKey: key });
		const data = await window.safeApiCall(raApi.getGameList, authorization, { consoleId: raConsoleId });

		if (Array.isArray(data)) {
			let selectedGame = findGameInList(gameTitle, data);

			if (Array.isArray(selectedGame)) {
				selectedGame = await showGameSelection(selectedGame);
			}

			if (selectedGame) {
				userLibrary[con][idx].name = selectedGame.title || selectedGame.Title;
				const gameId = (selectedGame.id || selectedGame.ID).toString();
				userLibrary[con][idx].raId = gameId;
				userLibrary[con][idx].imgId = cleanImg(selectedGame.imageIcon || selectedGame.ImageIcon);
				
				const ext = await fetchExtendedDataForGame(raApi, authorization, gameId);
				if (ext) {
					
					userLibrary[con][idx].maxAch = ext.maxAch || selectedGame.numAchievements || selectedGame.NumAchievements || 0;
					userLibrary[con][idx].pts = ext.pts;
					userLibrary[con][idx].genre = ext.genre;
					userLibrary[con][idx].timeToMaster = ext.timeToMaster;
					userLibrary[con][idx].timeToBeatHardcore = ext.timeToBeatHardcore;
					userLibrary[con][idx].timeToBeat = ext.timeToBeat;
					userLibrary[con][idx].timeToComplete = ext.timeToComplete;
					userLibrary[con][idx].developer = ext.developer;
					userLibrary[con][idx].publisher = ext.publisher;
					userLibrary[con][idx].released = ext.released;
					userLibrary[con][idx].players = ext.players;
					userLibrary[con][idx].imageTitle = ext.imageTitle;
					userLibrary[con][idx].imageIngame = ext.imageIngame;
					userLibrary[con][idx].imageBoxArt = ext.imageBoxArt;
					userLibrary[con][idx].extendedFetched = true;
				} else {
					userLibrary[con][idx].maxAch = selectedGame.numAchievements || selectedGame.NumAchievements || 0;
				}

				cleanupLibrary();
				renderModifyList();
				renderSidebar();
			} else {
				alert("Game not found in RA database for this console. Try a different title.");
			}
		} else {
			alert("Failed to retrieve the game list from RA.");
		}
	} catch (err) {
		console.error(err);
		alert("Failed to fetch data. Check API settings or internet connection.");
	}
}

async function fetchAllRA() {
	const btn = document.getElementById('btn-fetch-all');
	const user = localStorage.getItem('ra_user');
	const key = localStorage.getItem('ra_key');
	if (!user || !key) return alert("Please ensure Username and API Key are set in the API Settings tab.");

	let failedGames = [];
	btn.innerText = "Fetching...";
	btn.disabled = true;

	let raApi, authorization;
	try {
		raApi = await import("https://esm.sh/@retroachievements/api");
		authorization = raApi.buildAuthorization({ username: user, webApiKey: key });
	} catch(e) {
		alert("Failed to import API module.");
		btn.innerText = "Fetch All";
		btn.disabled = false;
		return;
	}

	for (const con of Object.keys(userLibrary)) {
		if (!userLibrary[con] || userLibrary[con].length === 0) continue;
		const raConsoleId = RA_CONSOLE_IDS[con];
		
		if (!raConsoleId) {
			userLibrary[con].forEach(g => { if (!g.raId) failedGames.push(`[${con}] ${g.name} (No System Link)`); });
			continue;
		}

		const needsFetch = userLibrary[con].some(g => !g.raId);
		if (!needsFetch) continue;

		try {
			const data = await window.safeApiCall(raApi.getGameList, authorization, { consoleId: raConsoleId });
			let consoleAllMatched = true;

			if (Array.isArray(data)) {
				for (let idx = 0; idx < userLibrary[con].length; idx++) {
					let game = userLibrary[con][idx];
					if (!game.raId) {
						let selectedGame = findGameInList(game.name, data);

						if (Array.isArray(selectedGame) || !selectedGame) {
							failedGames.push(`[${con}] ${game.name}`);
							consoleAllMatched = false;
						} else {
							game.name = selectedGame.title || selectedGame.Title;
							const gameId = (selectedGame.id || selectedGame.ID).toString();
							game.raId = gameId;
							game.imgId = cleanImg(selectedGame.imageIcon || selectedGame.ImageIcon);
							game.maxAch = selectedGame.numAchievements || selectedGame.NumAchievements || 0;
							game.extendedFetched = false;
						}
					}
				}
			} else {
				userLibrary[con].forEach(g => { if (!g.raId) failedGames.push(`[${con}] ${g.name}`); });
				consoleAllMatched = false;
			}
			
			if (!consoleAllMatched) {
				await new Promise(r => setTimeout(r, 800));
			} else {
				await new Promise(r => setTimeout(r, 50)); 
			}
		} catch (err) {
			console.error(err);
			userLibrary[con].forEach(g => { if (!g.raId) failedGames.push(`[${con}] ${g.name}`); });
		}
	}
	
	cleanupLibrary();
	renderModifyList();
	rebuildPool();
	renderSidebar();

	btn.innerText = "Fetch All";
	btn.disabled = false;

	if (failedGames.length > 0) {
		alert(`Fetch completed. ${failedGames.length} game(s) could not be identified automatically:\n\n${failedGames.join('\n')}`);
	} else {
		alert("Fetch completed! All missing games were successfully identified.");
	}
}

async function cleanupLibrary() {
	const db = await dbPromise;

	Object.keys(userLibrary).forEach(con => {
		let uniqueGames = [];
		let seenNames = new Set();
		let seenIds = new Set();
		
		userLibrary[con].forEach(g => {
			if (!g.name || g.name.trim() === "") return;
			let normName = normalizeString(g.name);
			if (seenNames.has(normName)) return; 
			if (g.raId && seenIds.has(g.raId)) return;
			
			seenNames.add(normName);
			if (g.raId) seenIds.add(g.raId);
			uniqueGames.push(g);
		});
		
		userLibrary[con] = uniqueGames;
		if (userLibrary[con].length === 0) delete userLibrary[con];
	});

	// Wipe DB and rewrite only the unique games
	await db.clear('games');
	for (const con of Object.keys(userLibrary)) {
		for (const g of userLibrary[con]) {
			await db.put('games', g);
		}
	}
	
	rebuildPool();
}

function handleConsoleChange() { cleanupLibrary(); renderModifyList(); }

function addEmptyGame() {
	const addSelect = document.getElementById('add-game-console-select');
	const con = addSelect.value;
	if (!con) return alert("Please select a console from the dropdown to add a new game.");
	if (!userLibrary[con]) userLibrary[con] = [];
	userLibrary[con].push({ id: Math.random().toString(36).substr(2, 9), name: "", raId: "", imgId: "", maxAch: 0 }); 
	updateModifySelect(con);
	renderModifyList();
}

async function clearEntireLibrary() {
	if (confirm("Are you sure you want to remove all games from your library? This cannot be undone.")) {
		const db = await dbPromise;
		await db.clear('games');
		
		userLibrary = {}; 
		updateModifySelect(); 
		renderModifyList(); 
		rebuildPool(); 
		renderSidebar();
	}
}

function renderModifyList() {
	const selectEl = document.getElementById('modify-console-select');
	const con = selectEl ? selectEl.value : '';
	const list = document.getElementById('modify-game-list'); list.innerHTML = '';
	if (con && userLibrary[con]) {
		userLibrary[con].forEach((game, idx) => {
			const div = document.createElement('div'); div.className = 'mgmt-list-item';
			div.innerHTML = `
				<input type="text" value="${game.name || ''}" placeholder="Title" oninput="updateGameField('${con}', ${idx}, 'name', this.value)">
				<input type="text" value="${game.raId || ''}" placeholder="RA ID" oninput="updateGameField('${con}', ${idx}, 'raId', this.value)">
				<button class="ui-btn btn-primary" style="padding:5px; font-size:0.6rem;" onclick="fetchFromRA('${con}', ${idx})">FETCH</button>
				<button class="ui-btn btn-danger" style="padding:5px;" onclick="removeFromLibrary('${con}', ${idx})">DEL</button>
			`;
			list.appendChild(div);
		});
	}
}

async function updateGameField(con, idx, field, val) { 
	const game = userLibrary[con][idx];
	game[field] = val; // Update in RAM
	
	// Update specific game in database
	const db = await dbPromise;
	await db.put('games', game); 
	
	if(field === 'name') { 
		rebuildPool(); 
		renderSidebar(); 
	}
}

async function removeFromLibrary(con, idx) { 
	const deletedGame = userLibrary[con][idx];
	
	// Delete from Database
	const db = await dbPromise;
	await db.delete('games', deletedGame.id);

	// Delete from RAM
	userLibrary[con].splice(idx, 1); 
	if (userLibrary[con].length === 0) {
		delete userLibrary[con]; 
		updateModifySelect(); 
	}
	
	// Manage local storage completion tags
	if (completedData[con]) {
		completedData[con] = completedData[con].filter(id => id !== deletedGame.id);
		if (completedData[con].length === 0) delete completedData[con];
		localStorage.setItem('completedData_v3', JSON.stringify(completedData));
	}
	if (masteredData[con]) {
		masteredData[con] = masteredData[con].filter(id => id !== deletedGame.id);
		if (masteredData[con].length === 0) delete masteredData[con];
		localStorage.setItem('masteredData_v3', JSON.stringify(masteredData));
	}
	
	renderModifyList();
	rebuildPool();
	renderSidebar(); 
}

function closeManager() { cleanupLibrary(); updateModifySelect(); document.getElementById('manager-modal').style.display = 'none'; resetToConsole(); }

function switchTab(tab, btn) {
	document.querySelectorAll('.mgmt-section').forEach(el => el.classList.remove('active'));
	document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
	
	document.getElementById(`mgmt-${tab}`).classList.add('active'); 
	
	const btns = document.querySelectorAll('.tab-btn');
	if (tab === 'modify') btns[0].classList.add('active');
	if (tab === 'settings') btns[1].classList.add('active');
	if (tab === 'backup') btns[2].classList.add('active');
	
	if(tab === 'modify') renderModifyList();
	if(tab === 'settings') loadCachedStats();
	
}

let scanTree = null;
async function runScanner() {
	if (!window.showDirectoryPicker) return alert("Browser not supported.");
	const rootHandle = await window.showDirectoryPicker();
	document.getElementById('scanner-view').classList.add('active-flex');
	document.getElementById('standard-manager-view').classList.add('hidden');
	scanTree = await buildFolderTree(rootHandle, rootHandle.name); renderScanTree();
}

async function buildFolderTree(handle, name, parentPath = "", inheritedSystem = null) {
	let currentSystem = inheritedSystem;
	let folderLower = name.toLowerCase();
	
	if (folderLower === 'a26') currentSystem = '2600';
	else if (folderLower === 'n64') currentSystem = 'N64';
	else if (folderLower === 'arc' || folderLower === 'arcade') currentSystem = 'ARC';
	else if (folderLower === 'cpc') currentSystem = 'CPC';
	else if (folderLower === 'ps2') currentSystem = 'PS2';
	else if (folderLower === 'ps1' || folderLower === 'psx') currentSystem = 'PS1';
	
	let node = { id: Math.random().toString(36), name: name, children: [], games: [], selectedConsole: currentSystem, checked: true };
	const currentPath = parentPath ? `${parentPath}/${name}` : name;
	const seenInThisFolder = new Set();
	
	let hasFiles = false;

	for await (const entry of handle.values()) {
		if (entry.kind === 'directory') {
			const child = await buildFolderTree(entry, entry.name, currentPath, currentSystem);
			if (child.games.length > 0 || child.children.length > 0) {
				node.children.push(child);
				hasFiles = true;
			}
		} else {
			const nameParts = entry.name.split('.');
			if (nameParts.length < 2) continue; 

			const ext = nameParts.pop().toLowerCase();
			if (ext === 'txt') continue;

			const clean = nameParts.join('.').replace(/\.nkit\.[a-z0-9]+$/i, '').replace(/\.nkit$/i, '').replace(/\(.*\)|\[.*\]/g, '').replace(/Track\s*\d+/gi, '').trim();
			if (!clean || seenInThisFolder.has(clean.toLowerCase())) continue;
			seenInThisFolder.add(clean.toLowerCase());
			
			let system = EXTENSION_MAP[ext];
			if (!system && SHARED_EXTENSIONS[ext]) {
				const upperPath = currentPath.toUpperCase();
				if (SHARED_EXTENSIONS[ext].includes("GC") && (upperPath.includes("GC") || upperPath.includes("GCN") || upperPath.includes("NGC") || upperPath.includes("GAMECUBE"))) {
					system = "GC";
				} else if (SHARED_EXTENSIONS[ext].includes("Wii") && upperPath.includes("WII")) {
					system = "Wii";
				} else {
					system = SHARED_EXTENSIONS[ext].find(s => upperPath.includes(s));
				}
			}
			
			if (!system && currentSystem) system = currentSystem;
			if (!node.selectedConsole && system) node.selectedConsole = system;
			
			node.games.push({ name: clean, checked: true });
			hasFiles = true;
		}
	}
	return node;
}

function recalculateSelection(node) {
	node.children.forEach(recalculateSelection);
	const allChecked = node.games.every(g => g.checked) && node.children.every(c => c.checked);
	node.checked = (node.games.length > 0 || node.children.length > 0) && allChecked;
}

function setSelectionRecursive(node, val) {
	node.checked = val; node.games.forEach(g => g.checked = val); node.children.forEach(c => setSelectionRecursive(c, val));
}

function nodeAction(nodeId, action, val) {
	const findAndApply = (n) => {
		if (n.id === nodeId) {
			if (action === 'toggleFolder') setSelectionRecursive(n, val);
			if (action === 'setConsole') n.selectedConsole = val;
			return true;
		}
		return n.children.some(findAndApply);
	};
	findAndApply(scanTree); recalculateSelection(scanTree); renderScanTree();
}

function gameAction(nodeId, idx, val) {
	const findAndApply = (n) => { if (n.id === nodeId) { n.games[idx].checked = val; return true; } return n.children.some(findAndApply); };
	findAndApply(scanTree); recalculateSelection(scanTree); renderScanTree();
}

function renderScanTree() {
	const container = document.getElementById('scanner-tree-root'); container.innerHTML = '';
	if (scanTree) container.appendChild(createFolderElement(scanTree));
}

function createFolderElement(node) {
	const div = document.createElement('div'); div.className = 'folder-tree-item';
	const header = document.createElement('div'); header.className = 'folder-header';
	header.innerHTML = `
		<input type="checkbox" ${node.checked ? 'checked' : ''} onchange="nodeAction('${node.id}', 'toggleFolder', this.checked)">
		<span class="folder-name">📁 ${node.name}</span>
		<select style="width:100px; margin:0;" onchange="nodeAction('${node.id}', 'setConsole', this.value)">
			<option value="">--</option>
			${Object.keys(CONSOLE_FULL_NAMES).map(c => `<option value="${c}" ${node.selectedConsole===c?'selected':''}>${c}</option>`).join('')}
		</select>`;
	const contents = document.createElement('div');
	node.games.forEach((g, i) => {
		const item = document.createElement('div'); item.className = 'file-item';
		item.innerHTML = `<input type="checkbox" ${g.checked?'checked':''} onchange="gameAction('${node.id}', ${i}, this.checked)"><span>${g.name}</span>`;
		contents.appendChild(item);
	});
	node.children.forEach(c => contents.appendChild(createFolderElement(c)));
	div.appendChild(header); div.appendChild(contents); return div;
}

function importScannedGames() {
	const traverse = (n) => {
		if (n.selectedConsole) {
			if (!userLibrary[n.selectedConsole]) userLibrary[n.selectedConsole] = [];
			n.games.forEach(g => { 
				if (g.checked && !userLibrary[n.selectedConsole].some(ex => ex.name === g.name)) {
					userLibrary[n.selectedConsole].push({ id: Math.random().toString(36).substr(2, 9), name: g.name, raId: "", imgId: "", maxAch: 0 });
				}
			});
		}
		n.children.forEach(traverse);
	};
	traverse(scanTree); 
	cleanupLibrary();
	closeScanner(); 
	updateModifySelect(); 
	renderModifyList();
}

function closeScanner() { document.getElementById('scanner-view').classList.remove('active-flex'); document.getElementById('standard-manager-view').classList.remove('hidden'); }

function exportLibrary() {
	const blob = new Blob([JSON.stringify(userLibrary, null, 2)], { type: "application/json" });
	const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "retro_library.json"; a.click();
}

function importLibrary() {
	const input = document.getElementById('import-input');
	if (!input.files.length) return alert("Select a file.");
	
	const reader = new FileReader();
	reader.onload = async (e) => {
		try {
			const importedData = JSON.parse(e.target.result); 
			const db = await dbPromise;
			
			// Format imported games, apply IDs, and push to DB
			for (const con of Object.keys(importedData)) {
				if (!window.userLibrary[con]) window.userLibrary[con] = [];
				
				for (let g of importedData[con]) {
					let obj = typeof g === 'string' ? { name: g, raId: "", imgId: "", maxAch: 0 } : { ...g };
					if (!obj.id) obj.id = Math.random().toString(36).substr(2, 9);
					obj.consoleName = con;
					
					window.userLibrary[con].push(obj);
					await db.put('games', obj);
				}
			}
			
			await cleanupLibrary(); 
			resetToConsole(); 
			updateModifySelect(); 
			alert("Imported!");
		} catch (err) { 
			console.error(err);
			alert("Invalid file format."); 
		}
	};
	reader.readAsText(input.files[0]);
}

// Initialize empty arrays in global memory (avoids localStorage limitations)
window.console100Games = [];
window.console101Games = [];

function fetchEventsAndHubs(raApi, authorization) {
	// Fetch Console 100 in the background
	raApi.getGameList(authorization, {
		consoleId: 100,
		shouldOnlyRetrieveGamesWithAchievements: false, // f=0 equivalent[cite: 1]
		shouldRetrieveGameHashes: true                  // h=1 equivalent[cite: 1]
	})
	.then(data => {
		window.console100Games = data;
		console.log("Hubs successfully loaded into memory.");
	})
	.catch(err => console.error("Failed to background fetch Hubs:", err));

	// Fetch Console 101 in the background
	raApi.getGameList(authorization, {
		consoleId: 101,
		shouldOnlyRetrieveGamesWithAchievements: false, // f=0 equivalent[cite: 1]
		shouldRetrieveGameHashes: true                  // h=1 equivalent[cite: 1]
	})
	.then(data => {
		window.console101Games = data;
		console.log("Events successfully loaded into memory.");
	})
	.catch(err => console.error("Failed to background fetch Events", err));
}

async function bootApp() {
	document.getElementById('ra-username').value = localStorage.getItem('ra_user') || '';
	document.getElementById('ra-api-key').value = localStorage.getItem('ra_key') || '';

	const db = await dbPromise;

	// ONE-TIME MIGRATION FROM LOCALSTORAGE IF APPLICABLE
	let rawLibrary = JSON.parse(localStorage.getItem('userLibrary_v3'));
	if (rawLibrary) {
		for (const con of Object.keys(rawLibrary)) {
			for (let g of rawLibrary[con]) {
				let obj = typeof g === 'string' ? { name: g, raId: "", imgId: "", maxAch: 0 } : { ...g };
				if (!obj.id) obj.id = Math.random().toString(36).substr(2, 9);
				if (obj.imgId) obj.imgId = cleanImg(obj.imgId);
				obj.consoleName = con;
				await db.put('games', obj);
			}
		}
		localStorage.removeItem('userLibrary_v3');
	}

	// 1. POPULATE USERLIBRARY FROM INDEXEDDB
	const allGamesFromDB = await db.getAll('games');
	window.userLibrary = {};
	allGamesFromDB.forEach(g => {
		const conName = g.consoleName || 'Unknown';
		if (!window.userLibrary[conName]) window.userLibrary[conName] = [];
		window.userLibrary[conName].push(g);
	});

	// 2. NOW MAP COMPLETED AND MASTERED DATA (userLibrary is now populated!)
	let rawCompleted = JSON.parse(localStorage.getItem('completedData_v3')) || {};
	let completedModified = false;
	
	let rawMastered = JSON.parse(localStorage.getItem('masteredData_v3')) || {};
	let masteredModified = false;
	
	Object.keys(rawCompleted).forEach(con => {
		window.completedData[con] = rawCompleted[con].map(item => {
			let existsById = window.userLibrary[con]?.some(g => g.id === item);
			if (!existsById) {
				let libGame = window.userLibrary[con]?.find(g => g.name === item);
				if (libGame) {
					completedModified = true;
					return libGame.id;
				}
			}
			return item;
		});
	});
	if (completedModified) localStorage.setItem('completedData_v3', JSON.stringify(window.completedData));

	Object.keys(rawMastered).forEach(con => {
		window.masteredData[con] = rawMastered[con].map(item => {
			let existsById = window.userLibrary[con]?.some(g => g.id === item);
			if (!existsById) {
				let libGame = window.userLibrary[con]?.find(g => g.name === item);
				if (libGame) {
					masteredModified = true;
					return libGame.id;
				}
			}
			return item;
		});
	});
	if (masteredModified) localStorage.setItem('masteredData_v3', JSON.stringify(window.masteredData));

	// 3. RENDER UI
	rebuildPool();
	renderSidebar();
	
	const filterAch = document.getElementById('achievements-spin-filter').checked;
	const filterDamageless = document.getElementById('damageless-spin-filter').checked;
	const filterSpeedrun = document.getElementById('speedrun-spin-filter').checked;

	const availableConsoles = Object.keys(gamePool).filter(con =>
		con !== 'Events' &&
		gamePool[con].some(g =>
			(!filterAch || (g.maxAch && parseInt(g.maxAch, 10) > 0)) &&
			(!filterDamageless || !g.damagelessIDs || parseInt(g.damagelessIDs.length, 10) === 0) &&
			(!filterSpeedrun || !g.speedrunIDs || parseInt(g.speedrunIDs.length, 10) === 0)
		)
	);

	currentWheelItems = shuffleArray(availableConsoles);
	drawWheel(currentWheelItems);

	const user = localStorage.getItem('ra_user');
	const key = localStorage.getItem('ra_key');
	
	if (user && key) {
		try {
			const raApi = await import("https://esm.sh/@retroachievements/api");
			const authorization = raApi.buildAuthorization({ username: user, webApiKey: key });

			const consoleReq = await fetch(`https://retroachievements.org/API/API_GetConsoleIDs.php?z=${user}&y=${key}`);
			const consoleData = await consoleReq.json();

			consoleData.forEach(c => {
				const existingKey = Object.keys(CONSOLE_IMAGES).find(k => CONSOLE_IMAGES[k] === c.IconURL) || 
									Object.keys(RA_CONSOLE_IDS).find(k => RA_CONSOLE_IDS[k] === c.ID);
				const shortName = existingKey || c.IconURL.split('/').pop().replace('.png', '').toUpperCase();

				if (!RA_CONSOLE_IDS[shortName]) RA_CONSOLE_IDS[shortName] = c.ID;
				if (!CONSOLE_FULL_NAMES[shortName]) CONSOLE_FULL_NAMES[shortName] = c.Name;
				if (!CONSOLE_IMAGES[shortName]) CONSOLE_IMAGES[shortName] = c.IconURL;
				if (!CONSOLE_COLORS[shortName]) CONSOLE_COLORS[shortName] = "#808080"; 
				
				CONSOLE_METADATA[shortName] = {
					active: c.Active,
					isGameSystem: c.IsGameSystem
				};
			});

			fetchUserStats(true);

			// FIRE AND FORGET: Start pulling IDs 100 and 101 in the background
			fetchEventsAndHubs(raApi, authorization);

			renderSidebar();
			
		} catch(e) {
			console.error("Boot sequence API error:", e);
		}
	}
}

bootApp(); 
let rankChartInstance = null;

// Renders the chart and manages the conditional local storage
window.updateAndRenderRankChart = function(containerElement, currentRank, forceRender = false) {
	let history = JSON.parse(localStorage.getItem('ra_rank_history')) || [];
	const now = Date.now();
	const oneHour = 60 * 60 * 1000;

	// ALWAYS SYNC DISPLAY: Moved outside the plotting logic so it never falls behind
	const rankDisplay = document.getElementById('user-rank-display');
	if (rankDisplay) {
		const urlOffset = Math.floor((currentRank - 1) / 25) * 25;
		const rankUrl = `https://retroachievements.org/globalRanking.php?t=2&o=${urlOffset}&s=5`;
		rankDisplay.innerHTML = `<strong style="color:white;">Rank:</strong> <a href="${rankUrl}" target="_blank" style="color:inherit;">${currentRank}</a>`;
	}

	let shouldPlot = false;
	
	// DATA SAFETY LOCK: Only log new data on routine checks, NEVER during UI forced re-renders
	if (!forceRender) {
		if (history.length === 0) {
			shouldPlot = true;
		} else {
			const lastEntry = history[history.length - 1];
			// Plot if the rank has changed OR if 1 hour has elapsed since the last plotted point
			if (currentRank !== lastEntry.rank || (now - lastEntry.time) >= oneHour) {
				shouldPlot = true;
			}
		}
	}

	// Save full data so historical records are not purged
	if (shouldPlot) {
		history.push({ time: now, rank: currentRank });
		localStorage.setItem('ra_rank_history', JSON.stringify(history));
	}

	let wrapper = document.getElementById('rank-history-wrapper');

	// PERFORMANCE LOCK: Do not re-render the chart unless we added a new data point OR clicked a UI button
	if (!shouldPlot && wrapper && !forceRender) {
		return; 
	}

	if (history.length < 1) return;

	// Set Default Time Range (1 Week) if none is selected yet
	if (!window.currentRankChartRange) {
		window.currentRankChartRange = 7 * 24 * oneHour; 
	}
	const selectedRange = window.currentRankChartRange;
	const rangeMinTime = now - selectedRange;

	// Filter the dataset for the selected time range
	let displayHistory = history.filter(entry => entry.time >= rangeMinTime);

	// GAP PREVENTION: Lock the left side of the chart to the oldest data point if the data is shorter than the selected range
	let chartMinTime = displayHistory.length > 0 ? Math.max(rangeMinTime, displayHistory[0].time) : rangeMinTime;

	// DATA OPTIMIZATION: Keep only the first, last, and points where a rank change occurs
	displayHistory = displayHistory.filter((entry, i, arr) => {
		if (i === 0 || i === arr.length - 1) return true; // Always keep the very first and last visible points
		if (entry.rank !== arr[i - 1].rank) return true;  // Keep if different from the previous point
		if (entry.rank !== arr[i + 1].rank) return true;  // Keep if different from the next point
		return false;                                     // Drop redundant flatline points
	});

	// Build the UI if it doesn't exist yet
	if (!wrapper) {
		wrapper = document.createElement('div');
		wrapper.id = 'rank-history-wrapper';
		wrapper.style.padding = '10px';
		wrapper.style.marginBottom = '10px';
		wrapper.style.borderRadius = '8px';
		wrapper.style.border = '1px solid var(--border)';

		const headerContainer = document.createElement('div');
		headerContainer.style.display = 'flex';
		headerContainer.style.justifyContent = 'space-between';
		headerContainer.style.alignItems = 'center';
		headerContainer.style.borderBottom = '1px solid var(--border)';
		headerContainer.style.paddingBottom = '5px';
		headerContainer.style.marginBottom = '10px';

		const titleEl = document.createElement('h4');
		titleEl.textContent = 'Rank History';
		titleEl.style.margin = '0';
		headerContainer.appendChild(titleEl);

		const controlsContainer = document.createElement('div');
		controlsContainer.style.display = 'flex';
		controlsContainer.style.gap = '5px';
		
		const ranges = [
			{ label: '1D', value: 24 * oneHour },
			{ label: '1W', value: 7 * 24 * oneHour },
			{ label: '1M', value: 30 * 24 * oneHour },
			{ label: '1Y', value: 365 * 24 * oneHour }
		];

		// Create UI Buttons and attach data-range attributes for easy querying
		ranges.forEach(r => {
			const btn = document.createElement('button');
			btn.textContent = r.label;
			btn.setAttribute('data-range', r.value);
			btn.style.padding = '4px 10px';
			btn.style.fontSize = '0.7rem';
			
			btn.onclick = () => {
				window.currentRankChartRange = r.value;
				const latestHistory = JSON.parse(localStorage.getItem('ra_rank_history')) || [];
				const latestRank = latestHistory.length > 0 ? latestHistory[latestHistory.length - 1].rank : currentRank;
				window.updateAndRenderRankChart(containerElement, latestRank, true);
			};
			controlsContainer.appendChild(btn);
		});

		headerContainer.appendChild(controlsContainer);
		wrapper.appendChild(headerContainer);
		
		const canvasWrapper = document.createElement('div');
		canvasWrapper.style.width = '100%';
		canvasWrapper.style.height = '200px';
		canvasWrapper.style.position = 'relative'; 
		
		let canvas = document.createElement('canvas');
		canvas.id = 'rank-history-chart';
		
		canvasWrapper.appendChild(canvas);
		wrapper.appendChild(canvasWrapper);
		
		const statsBox1 = document.getElementById('stats-box-1');
		if (statsBox1) {
			statsBox1.after(wrapper);
		} else {
			containerElement.appendChild(wrapper);
		}
	}

	// UI SYNC: Safely update button colors every single time the function runs
	const rangeButtons = wrapper.querySelectorAll('button[data-range]');
	rangeButtons.forEach(btn => {
		if (parseInt(btn.getAttribute('data-range')) === window.currentRankChartRange) {
			btn.className = 'ui-btn btn-primary';
		} else {
			btn.className = 'ui-btn btn-ghost';
		}
	});

	// ---------------------------------------------------------
	// THE CANVAS GUILLOTINE (Fixes Ghost Points)
	// ---------------------------------------------------------
	if (typeof window.rankChartInstance !== 'undefined' && window.rankChartInstance) {
		window.rankChartInstance.destroy();
	}

	let oldCanvas = document.getElementById('rank-history-chart');
	
	// Physically rip the canvas out and replace it with a fresh one
	let newCanvas = document.createElement('canvas');
	newCanvas.id = 'rank-history-chart';
	oldCanvas.parentNode.replaceChild(newCanvas, oldCanvas);
	
	const ctx = newCanvas.getContext('2d');
	
	const dataPoints = displayHistory.map(entry => ({
		x: entry.time,
		y: entry.rank
	}));

	// Lock Y-Axis boundaries based on the currently displayed dataset
	const allRanks = dataPoints.map(p => p.y);
	let globalMinRank = (allRanks.length > 0 ? Math.min(...allRanks) : currentRank) - 10;
	let globalMaxRank = (allRanks.length > 0 ? Math.max(...allRanks) : currentRank) + 10;
	
	if (globalMinRank === globalMaxRank) {
		globalMinRank -= 1;
		globalMaxRank += 1;
	}


	const user = localStorage.getItem('ra_user');
		
	window.rankChartInstance = new Chart(ctx, {
		type: 'line',
		data: {
			datasets: [{
				label: `${user}'s Rank`,
				data: dataPoints,
				borderColor: '#eab308',
				backgroundColor: 'rgba(16, 185, 129, 0.1)',
				borderWidth: 2,
				pointBackgroundColor: '#ffffff',
				pointRadius: 4,
				fill: false,
				tension: 0
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			animation: {
				duration: forceRender ? 400 : 0
			},
			scales: {
				x: { 
					type: 'linear', 
					min: chartMinTime,
					max: now,
					ticks: { 
						maxTicksLimit: 24,
						color: '#94a3b8',
						callback: function(value) {
							const d = new Date(value);
							let hours = d.getHours();
							const minutes = d.getMinutes().toString().padStart(2, '0');
							const ampm = hours >= 12 ? 'PM' : 'AM';
							hours = hours % 12;
							hours = hours ? hours : 12; 
							
							const timeStr = `${hours}:${minutes} ${ampm}`;
							const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
							
							return [timeStr, dateStr];
						}
					}, 
					grid: { color: '#334155' } 
				},
				y: { 
					reverse: true, 
					min: globalMinRank,     
					max: globalMaxRank,     
					ticks: { color: '#94a3b8', stepSize: 1 }, 
					grid: { color: '#334155' } 
				}
			},
			plugins: { 
				tooltip: {
					callbacks: {
						title: function(context) {
							const value = context[0].raw.x;
							const d = new Date(value);
							let hours = d.getHours();
							const minutes = d.getMinutes().toString().padStart(2, '0');
							const ampm = hours >= 12 ? 'PM' : 'AM';
							hours = hours % 12;
							hours = hours ? hours : 12;
							return `${hours}:${minutes} ${ampm} - ${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
						}
					}
				},
				legend: { display: false } 
			}
		}
	});
};

// ==========================================
// 3. CONSOLE DATA MANAGEMENT TOOL
// ==========================================
window.rankHistoryManager = {
	view: function() {
		const h = JSON.parse(localStorage.getItem('ra_rank_history')) || [];
		if (h.length === 0) {
			console.log("%cNo rank history found.", "color: #eab308");
			return;
		}
		const tableData = h.map((entry, index) => ({
			Index: index,
			Date: new Date(entry.time).toLocaleString(),
			Rank: entry.rank
		}));
		console.table(tableData);
		console.log("%cTo remove a specific data point, type: %crankHistoryManager.remove(Index)", "color: #94a3b8", "color: #3b82f6; font-weight: bold;");
	},
	
	remove: function(index) {
		let h = JSON.parse(localStorage.getItem('ra_rank_history')) || [];
		if (index >= 0 && index < h.length) {
			const removed = h.splice(index, 1);
			localStorage.setItem('ra_rank_history', JSON.stringify(h));
			console.log(`%cSuccessfully removed Rank ${removed[0].rank} from ${new Date(removed[0].time).toLocaleString()}`, "color: #10b981");
			console.log("%cTriggering a chart re-render...", "color: #94a3b8");
			
			// Force chart update with the new latest rank
			const latestRank = h.length > 0 ? h[h.length - 1].rank : 0;
			
			// Re-render the chart immediately
			if (window.updateAndRenderRankChart) {
				window.updateAndRenderRankChart(document.body, latestRank, true);
			}
		} else {
			console.error("Invalid Index. Run rankHistoryManager.view() to see available indexes.");
		}
	}
};

// Leave a helpful hint in the console when the script loads!
console.log("%c🛠️ Rank History Manager loaded! Type %crankHistoryManager.view()%c to inspect and edit your graph data.", "color: #eab308", "color: #3b82f6; font-weight: bold;", "color: #eab308");





// Inline Web Worker ensures the checking interval runs accurately every 1 minute in background tabs
const workerBlob = new Blob([
	`setInterval(() => { postMessage('tick'); }, 60000);`
], { type: 'text/javascript' });

const backgroundTimerWorker = new Worker(URL.createObjectURL(workerBlob));

backgroundTimerWorker.onmessage = function() {
	if (typeof checkAndRefreshRankChartSilently === 'function') {
		checkAndRefreshRankChartSilently();
	}
};

// Silently fetches current rank and updates the chart without clearing or reloading the main UI
async function checkAndRefreshRankChartSilently() {
	const user = localStorage.getItem('ra_user');
	const key = localStorage.getItem('ra_key');
	const container = document.getElementById('ra-user-stats');

	if (!user || !key || !container) return;

	try {
		const raApi = await import("https://esm.sh/@retroachievements/api");
		const { buildAuthorization, getUserSummary } = raApi;
		const authorization = buildAuthorization({ username: user, webApiKey: key });

		// Request minimal payload counts (1 game/achievement) to quickly query rank
		const data = await window.safeApiCall(getUserSummary, authorization, { 
			username: user,
			recentGamesCount: 1,
			recentAchievementsCount: 1,
			t: Date.now() 
		});

		if (data && data.rank) {
			const cleanRankNumber = parseInt(String(data.rank).replace(/,/g, ''), 10);
			if (!isNaN(cleanRankNumber) && typeof window.updateAndRenderRankChart === 'function') {
				// Update only the chart component
				window.updateAndRenderRankChart(container, cleanRankNumber); 
				
				// Silently keep cached summary in sync for future manual page actions
				const cachedSummary = JSON.parse(localStorage.getItem('ra_api_summary'));
				if (cachedSummary) {
					cachedSummary.rank = data.rank;
					localStorage.setItem('ra_api_summary', JSON.stringify(cachedSummary));
				}
			}
		}
	} catch (err) {
		console.error("Background rank check failed:", err);
	}
}

async function getAllGames(propName) {
	const db = await (typeof dbPromise !== 'undefined' ? dbPromise : idb.openDB('GamesLibraryDB', 1));
	const allGames = await db.getAll('games');
	
	return allGames.filter(game => {
		const val = game[propName];
		if (val === null || val === undefined || val === 0) return false;
		if (Array.isArray(val) && val.length === 0) return false;
		if (typeof val === 'object' && Object.keys(val).length === 0) return false;
		return true;
	});
}