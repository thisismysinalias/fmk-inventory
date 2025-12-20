(function() {
  // ─────────────────────────────────────────────────────────────────────────
  // 1) FRANCHISE SELECTION LOGIC
  // ─────────────────────────────────────────────────────────────────────────
  let selectedFranchise = null;
  
  const franchiseOptions = document.querySelectorAll('.franchise-option');
  const startGameButton = document.getElementById('start-game-button');
  const franchiseSelection = document.getElementById('franchise-selection');
  const gameContainer = document.getElementById('game-container');

  // Handle franchise selection
  franchiseOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove selection from all options
      franchiseOptions.forEach(opt => opt.classList.remove('selected'));
      
      // Select the clicked option
      option.classList.add('selected');
      selectedFranchise = option.dataset.franchise;
      
      // Enable start button
      startGameButton.classList.add('enabled');
      startGameButton.disabled = false;
    });
  });

  // Handle start game button
  startGameButton.addEventListener('click', () => {
    if (!selectedFranchise) return;
    
    if (selectedFranchise === 'rance') {
      // Show Rance options popup
      document.getElementById('rance-popup').style.display = 'flex';
    } else {
      // For Fire Emblem, start preloading and game
      startPreloadingAndGame(selectedFranchise);
    }
  });

  // Handle Rance popup
  const rancePopup = document.getElementById('rance-popup');
  const confirmRanceOptions = document.getElementById('confirm-rance-options');
  const cancelRanceOptions = document.getElementById('cancel-rance-options');
  const includeRanceX = document.getElementById('include-rance-x');
  const includeOldSprites = document.getElementById('include-old-sprites');

  confirmRanceOptions.addEventListener('click', () => {
    // Hide popup and start preloading
    rancePopup.style.display = 'none';
    
    // Start preloading and game with Rance options
    startPreloadingAndGame('rance', {
      includeRanceX: includeRanceX.checked,
      includeOldSprites: includeOldSprites.checked
    });
  });

  cancelRanceOptions.addEventListener('click', () => {
    // Just hide the popup, return to franchise selection
    rancePopup.style.display = 'none';
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 2) IMAGE PRELOADING SYSTEM
  // ─────────────────────────────────────────────────────────────────────────
  function startPreloadingAndGame(franchise, options = {}) {
    // Hide franchise selection and show loading
    franchiseSelection.style.display = 'none';
    document.getElementById('loading-container').style.display = 'flex';
    
    // Get image configuration
    const { imageList, imageFolder } = getImageConfiguration(franchise, options);
    
    // Start preloading
    preloadImages(imageList, imageFolder)
      .then(() => {
        // All images loaded, hide loading and start game
        document.getElementById('loading-container').style.display = 'none';
        gameContainer.style.display = 'block';
        initGame(imageList, imageFolder);
      })
      .catch((error) => {
        console.error('Error preloading images:', error);
        // Even if some images fail, try to start the game
        document.getElementById('loading-container').style.display = 'none';
        gameContainer.style.display = 'block';
        initGame(imageList, imageFolder);
      });
  }

  function preloadImages(imageList, imageFolder) {
    return new Promise((resolve, reject) => {
      const totalImages = imageList.length;
      let loadedImages = 0;
      let failedImages = 0;
      
      const loadingText = document.getElementById('loading-text');
      const loadingProgress = document.getElementById('loading-progress');
      
      // Update progress display
      function updateProgress() {
        const progress = Math.round(((loadedImages + failedImages) / totalImages) * 100);
        loadingText.textContent = `Loading images... ${loadedImages + failedImages}/${totalImages}`;
        loadingProgress.style.width = `${progress}%`;
        
        if (loadedImages + failedImages === totalImages) {
          loadingText.textContent = `Ready! Loaded ${loadedImages}/${totalImages} images`;
          setTimeout(resolve, 500); // Small delay to show completion
        }
      }
      
      // Preload each image
      imageList.forEach((filename) => {
        const img = new Image();
        
        img.onload = () => {
          loadedImages++;
          updateProgress();
        };
        
        img.onerror = () => {
          failedImages++;
          console.warn(`Failed to load: images/${imageFolder}/${filename}`);
          updateProgress();
        };
        
        img.src = `images/${imageFolder}/${filename}`;
      });
      
      // Handle edge case of empty image list
      if (totalImages === 0) {
        resolve();
      }
    });
  }

function getImageConfiguration(franchise, options = {}) {
  let imageList = [];
  let imageFolder = '';

  if (franchise === 'rance') {
    imageFolder = 'rance';
    const fileExtension = '.webp';

    imageList = Array.from({ length: 237 }, (_, i) => `image (${i + 1})${fileExtension}`);

    if (!options.includeRanceX) {
      const ranceXSkipNumbers = [
        4, 5, 15, 24, 35, 38, 44, 46, 51, 56, 62, 67,
        70, 73, 87, 91, 95, 98, 100, 105, 107, 110,
        118, 20, 119, 120, 126, 127, 132, 134, 135,
        136, 140, 141, 19, 146, 147, 149, 150, 151,
        152, 153, 155, 157, 164, 11, 109
      ];

      const skipSet = new Set(ranceXSkipNumbers);
      imageList = imageList.filter(name => {
        const match = name.match(/image \((\d+)\)\.webp/);
        return !match || !skipSet.has(parseInt(match[1], 10));
      });
    }

    if (!options.includeOldSprites) {
      imageList = imageList.filter(name => {
        const match = name.match(/image \((\d+)\)\.webp/);
        return !match || parseInt(match[1], 10) < 165;
      });
    }

  } else if (franchise === 'inventory') {
    imageFolder = 'inventory';

    imageList = [
"Agave (Halo).webp",
"Aina (Joe).webp",
"Airi (Halo).webp",
"Akane (Cog).webp",
"Akane (Halo).webp",
"Akari Masudori (Nero).webp",
"Alear (Halo).webp",
"Alexander (Joe).webp",
"Ally (Joe).webp",
"Alm (Halo).webp",
"Alma (Cog).webp",
"Aloe (Caliber).webp",
"Alois (Joe).webp",
"Alteria Dominicci de Calcinaia (Nero).webp",
"Amalia (Halo).webp",
"Amy (Halo).webp",
"Amy Williams (Nero).webp",
"Ankoku (Joe).webp",
"Anna (Joe).webp",
"Aodhfin Essihl (Nero).webp",
"Apollo (Halo).webp",
"Artemis (Caliber).webp",
"Aru (Halo).webp",
"Asami (Joe).webp",
"Ash (Caliber).webp",
"Asher Teivel (Nero).webp",
"Asteroth (Caliber).webp",
"Asuka (Halo).webp",
"Asuka_H (Joe).webp",
"Asuka_T (Joe).webp",
"Asulla (Halo).webp",
"Audrey (Joe).webp",
"Aya (Eluria).webp",
"Ayame (Joe).webp",
"Ayumu (sheets).webp",
"Azura (Joe).webp",
"Bea (Joe).webp",
"Becky Buckethead (Nero).webp",
"Bianca (Cog).webp",
"Bianca Zinzanni (Nero).webp",
"Black Knight (Halo).webp",
"Black Raisin (Halo).webp",
"Blake (Joe).webp",
"Blanche (Joe).webp",
"Blemishine (Caliber).webp",
"Blues (Joe).webp",
"Byleth (Halo).webp",
"Caelus (Caliber).webp",
"Caesar Cain (Nero).webp",
"Cagliostro (Alias).webp",
"Callie (Joe).webp",
"Canari (Cog).webp",
"Caroline (Halo).webp",
"Carolyn (Joe).webp",
"Caspar Sigurosson (Nero).webp",
"Cassie (Halo).webp",
"Cathy (Joe).webp",
"Cecilia (Joe).webp",
"Celebi (Cog).webp",
"Cerebellum (Joe).webp",
"Charlotte Williams (Nero).webp",
"Charon Valla-Williams (Nero).webp",
"Cheesecake (Cog).webp",
"Chiaki (Joe).webp",
"Chidori (Joe).webp",
"Chiharu (Caliber).webp",
"Chiharu (Joe).webp",
"Chinatsu (Caliber).webp",
"Chishiki (Halo).webp",
"Chiyo (Halo).webp",
"Chizuru (Halo).webp",
"Chloe (Joe).webp",
"Chrom (Joe).webp",
"Chuchu (Joe).webp",
"Chun Li (Joe).webp",
"Claire Donnelly-Walker (Nero).webp",
"Claude (Cog).webp",
"Click (sheets).webp",
"Cody (Joe).webp",
"Courtney (Cog).webp",
"Croissant (Cog).webp",
"Cyn (Joe).webp",
"D.Va (Halo).webp",
"Daisy (Cog).webp",
"Dark Pit or Vaal (Cog).webp",
"Dawn (Joe).webp",
"Dianne (Cog).webp",
"Dimitri (Joe).webp",
"Dr. Roy McCracken (Nero).webp",
"Dubhlainn 'John' Essihl (Nero).webp",
"Dusk (Caliber).webp",
"Dusknoir (Cog).webp",
"Edelgard (Halo).webp",
"Eggma'am (Halo).webp",
"Eirika (Caliber).webp",
"Elaina (Alias).webp",
"Eleanor (Halo).webp",
"Elena (Joe).webp",
"Elesa (Cog).webp",
"Elincia (Joe).webp",
"Eliwood (Caliber).webp",
"Elma (Joe).webp",
"Emiko (Cog).webp",
"Erika (Halo).webp",
"Eris (Caliber).webp",
"Estelle (Halo).webp",
"Ethel (Cog).webp",
"Etie (Joe).webp",
"Eunie (Joe).webp",
"Evangeline (Joe).webp",
"Exusiai (Joe).webp",
"Felipe (Caliber).webp",
"Finley (Joe).webp",
"Fjorm (Caliber).webp",
"Flora (Joe).webp",
"Florina (Halo).webp",
"Fluttershy (Joe).webp",
"Frederick (Cog).webp",
"Frieren (Halo).webp",
"Futaba (Joe).webp",
"Fuyuka Masudori (Nero).webp",
"Gabby (Halo).webp",
"Gardenia (Cog).webp",
"Gina (Cog).webp",
"Ginkawa (Joe).webp",
"Gladiia (Eluria).webp",
"Gloria (Joe).webp",
"Goldmary (Alias).webp",
"Goomy (Halo).webp",
"Gr (Joe).webp",
"Grim Aloe (Caliber).webp",
"Grimsley (Cog).webp",
"Grovyle (Joe).webp",
"Hajime (Cog).webp",
"Hana (Joe).webp",
"Hanako (Cog).webp",
"Hanako (Joe).webp",
"Haruna (Caliber).webp",
"Hasumi (sheets).webp",
"Heather (Joe).webp",
"Hecate (Halo).webp",
"Helsie (Halo).webp",
"Hephaestus (Cog).webp",
"Hibiki (Cog).webp",
"Hibiki (Joe).webp",
"Hibiscus (Caliber).webp",
"Hidemi (Cog).webp",
"Hijiyama (Alias).webp",
"Hilda (Caliber).webp",
"Hilda (Joe).webp",
"Hinoka (Joe).webp",
"Hitenshi (Cog).webp",
"Hitomi (Halo).webp",
"Hizuki (Joe).webp",
"Honedge (Cog).webp",
"Ichigo (Halo).webp",
"Ike (Joe).webp",
"Ilyana (Joe).webp",
"Inei (Cog).webp",
"Inigo (Joe).webp",
"Iono (Joe).webp",
"Iori (Alias).webp",
"Iris (Joe).webp",
"IRIS (sheets).webp",
"Iro (Halo).webp",
"Isabella (Alias).webp",
"Itsuki (Joe).webp",
"Izuna (Caliber).webp",
"Jacinthe (Joe).webp",
"Jacob (Joe).webp",
"James (Cog).webp",
"Janine (Caliber).webp",
"Jasmine (Caliber).webp",
"Jason (Joe).webp",
"Jennifer (Caliber).webp",
"Jethro Quereces (Nero).webp",
"Jill (Halo).webp",
"Ji-woo (Halo).webp",
"Johanna (Joe).webp",
"Johanna (sheets).webp",
"Johannes Joinari (Nero).webp",
"Jules (Yater).webp",
"Juliana (Joe).webp",
"Juliette (Alias).webp",
"Junko (Halo).webp",
"Kahili (Caliber).webp",
"Kal'tsit (Cog).webp",
"Kamina (Joe).webp",
"Kana (Halo).webp",
"Kanato Kobayashi (Nero).webp",
"Kanji (Joe).webp",
"Kanna (Alias).webp",
"Kasetsu (Joe).webp",
"Kasumi (Caliber).webp",
"Katarina (Joe).webp",
"Katherine (Joe).webp",
"Katsumi (Halo).webp",
"Kazehana (Cog).webp",
"Kazuo (Caliber).webp",
"Kiba (Joe).webp",
"Kirika (Halo).webp",
"Kisaki (Caliber).webp",
"Kitty (Halo).webp",
"Kiyoko (Halo).webp",
"Kneesocks (Halo).webp",
"Korone (Joe).webp",
"Kotone (Joe).webp",
"Kotori (Joe).webp",
"Kotori Otonashi (Nero).webp",
"Krow (Halo).webp",
"Kurisu (Halo).webp",
"Kyoko (Halo).webp",
"Kyu (Halo).webp",
"Lana (Joe).webp",
"L'Arachel (Cog).webp",
"Lea (Halo).webp",
"Leanne (Joe).webp",
"Lena (Joe).webp",
"Leo (Nreo).webp",
"Lethe (Joe).webp",
"Lilac (Caliber).webp",
"Lilac (Joe).webp",
"Lillian Cox (Nero).webp",
"Lillie (Halo).webp",
"Link (Cog).webp",
"Lissa (Cog).webp",
"Little Mac (Nero).webp",
"Lovely Labrynth of the Silver Castle (Caliber).webp",
"Lucina (Halo).webp",
"Lucy (Halo).webp",
"Lukas Redding (Nero).webp",
"Lyn (Caliber).webp",
"Lyra (Joe).webp",
"Lyre (Halo).webp",
"Lysithea (Cog).webp",
"Mahiru (Cog).webp",
"Makoto (Halo).webp",
"Mal0 (Halo).webp",
"Malon (Joe).webp",
"Manticore (sheets).webp",
"Marcille (Joe).webp",
"Maria Toyozaki (Nero).webp",
"Marice (Alias).webp",
"Marina (Joe).webp",
"Mark Shion (Nero).webp",
"Marnie (Halo).webp",
"Matsumoto (Joe).webp",
"Max 'Nine' Ninelius (Nero).webp",
"Maxwell (Joe).webp",
"Mayumi (Cog).webp",
"Meallán Essihl (Nero).webp",
"Medusa (Joe).webp",
"Megatron (Halo).webp",
"Megu (Cog).webp",
"Megumin (Halo).webp",
"Melody (Joe).webp",
"Metal Man (sheets).webp",
"Mia (Cog).webp",
"Micaiah (Halo).webp",
"Mikoto (Joe).webp",
"Mina (Alias).webp",
"Mina (Halo).webp",
"Minato (Halo).webp",
"Miralla (Yater).webp",
"Miranda (Halo).webp",
"Miranda (Joe).webp",
"Mirin (Yater).webp",
"Misty (Halo).webp",
"Mizuki (Alias).webp",
"Mizuki (Joe).webp",
"Molly Mahoney (Nero).webp",
"Momiji (Halo).webp",
"Mord (Joe).webp",
"Morrigan (Caliber).webp",
"Mostima (Caliber).webp",
"Moxie (Halo).webp",
"Moyu Satsuka (Nero).webp",
"Mukuro (Cog).webp",
"Mythra (Joe).webp",
"Nadia (Caliber).webp",
"Naomi (Cog).webp",
"Naoto (Joe).webp",
"Natsuki (Halo).webp",
"Nayru (Halo).webp",
"Nemona (Joe).webp",
"Nephenee (Joe).webp",
"Nicole (Halo).webp",
"Nonon (Cog).webp",
"Nora (Caliber).webp",
"Nurse Hitomi (sheets).webp",
"Nyx (Cog).webp",
"Ochako (Joe).webp",
"Octavia (Joe).webp",
"Okabe (Joe).webp",
"Olivia (Cog).webp",
"Orie (Joe).webp",
"Oz (Cog).webp",
"Palutena (Cog).webp",
"Pandora (Cog).webp",
"Pandreo (Cog).webp",
"Panty (Cog).webp",
"Penelope (Caliber).webp",
"Penny (Cog).webp",
"Phoebe (Joe).webp",
"Phosphora (Cog).webp",
"Pinkie Pie (Joe).webp",
"Pit (Cog).webp",
"Python (Cog).webp",
"Rainmaker (Eluria).webp",
"Ram (Halo).webp",
"Raven (Halo).webp",
"Red Hood (Halo).webp",
"Rem (Halo).webp",
"Ren (Halo).webp",
"Rena (Halo).webp",
"Riesbyfe (Citru).webp",
"Rika (Halo).webp",
"Riko (Joe).webp",
"Rinkah (Joe).webp",
"Rise (Alias).webp",
"Ro (Joe).webp",
"Romero (Halo).webp",
"Rosie MacGanicus.webp",
"Rottytops (Cog).webp",
"Roxanne (Halo).webp",
"Roxanne (Joe).webp",
"Roxas (Joe).webp",
"Ruby (Caliber).webp",
"Ruby (Joe).webp",
"Rui Mirei (Nero).webp",
"Ryuko (Halo).webp",
"Saber (Cog).webp",
"Sabimaru (Caliber).webp",
"Saero Rhinum (Nero).webp",
"Sakura (Joe).webp",
"Sam (Alias).webp",
"Sam (Halo).webp",
"Samael (Joe).webp",
"Sanaki (Halo).webp",
"Sandy (Joe).webp",
"Sato (Joe).webp",
"Sawyer Edgar (Nero).webp",
"Scorpion (Halo).webp",
"Setsuka (Joe).webp",
"Setsuna (Cog).webp",
"Shalltear (Halo).webp",
"Shantae (Joe).webp",
"Shauntal (Caliber).webp",
"Shay (Joe).webp",
"Shino (Halo).webp",
"Shiori (Caliber).webp",
"Shiro (Caliber).webp",
"Shun (Joe).webp",
"Sigrun (Joe).webp",
"Silque (Cog).webp",
"Skye (Halo).webp",
"Skyla (Cog).webp",
"Sojiro (Halo).webp",
"Somnus (Joe).webp",
"Sonia (Halo).webp",
"Sophie (Halo).webp",
"Sora (Joe).webp",
"Sou (Joe).webp",
"Souta (Joe).webp",
"Spark (Joe).webp",
"Sprig (Halo).webp",
"Starla Paskett (Nero).webp",
"Stelle (sheets).webp",
"Steven (Cog).webp",
"Stocking (Joe).webp",
"Strawberry (Halo).webp",
"Sueo Ikari (Nero).webp",
"Suletta (Alias).webp",
"Sunny (Cog).webp",
"Suzu (Joe).webp",
"Taion (Joe).webp",
"Takeshi (Joe).webp",
"Takumi (Cog).webp",
"Taylor (Halo).webp",
"Tenten (Halo).webp",
"Teru (Alias).webp",
"Teuth (sheets).webp",
"Texas (Caliber).webp",
"Tharja (Joe).webp",
"Tiger Lily (Joe).webp",
"Tiki (Cog).webp",
"Timerra (Joe).webp",
"Tobias Weaver (Nero).webp",
"Tron (Joe).webp",
"Tsumugi (Joe).webp",
"Tyche (Cog).webp",
"Vaporeon (Halo).webp",
"Vaz (Joe).webp",
"Vicky (Halo).webp",
"Victor Century (Nero).webp",
"Vincent (Cog).webp",
"Vivy (Joe).webp",
"Warfarin (sheets).webp",
"Whislash (Alias).webp",
"Yb (Joe).webp",
"Yoko (Cog).webp",
"Yomiko (Caliber).webp",
"Yukari (Cog).webp",
"Yuki (Caliber).webp",
"Yukiko (Joe).webp",
"Yuma (Cog).webp",
"Yumi (Joe).webp",
"Yumiko (Joe).webp",
"Yunaka (Joe).webp",
"Yuri (Joe).webp",
"Yuuka (Caliber).webp",
"Zelda (Halo).webp",
"Zinnia (Halo).webp",
"Zoe (Joe).webp"
];
  } else {
    // Fire Emblem
    imageFolder = 'fe';
    const fileExtension = '.webp';

    imageList = Array.from({ length: 237 }, (_, i) => `image (${i + 1})${fileExtension}`);
  }

  return { imageList, imageFolder };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 3) GAME INITIALIZATION (simplified, moved configuration logic above)
  // ─────────────────────────────────────────────────────────────────────────
  function initializeGame(franchise, options = {}) {
    const { imageList, imageFolder } = getImageConfiguration(franchise, options);
    initGame(imageList, imageFolder);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4) MAIN GAME LOGIC (adapted from original)
  // ─────────────────────────────────────────────────────────────────────────
  function initGame(imageList, imageFolder) {
    // Filter out any bad entries
    const onlyStrings = imageList.filter(x => typeof x === "string" && x.trim().length > 0);
    const validImages = onlyStrings.filter(name => /\.(webp|png)$/i.test(name));

    const totalTriples = Math.floor(validImages.length / 3);
    if (totalTriples < 1) {
      alert(
        "Not enough images to play after filtering.\n" +
        "Please ensure at least 3 valid images remain."
      );
      document.getElementById("pull-counter").textContent = "Not enough images.";
      return;
    }

    // Use exactly the first (totalTriples * 3) images, ignore leftovers
    const usableImages = validImages.slice(0, totalTriples * 3);

    // Shuffle in place (Fisher–Yates)
    shuffleArray(usableImages);

    // Group into trios (pulls)
    const pulls = [];
    for (let i = 0; i < totalTriples; i++) {
      pulls.push( usableImages.slice(i * 3, i * 3 + 3) );
    }

    // Keep track of user choices: { "filename": "fuck"|"marry"|"kill" }
    const userChoices = {};

    // Which pull index are we on? (0-based)
    let currentPullIndex = 0;

    // DOM references
    const pullCounterEl    = document.getElementById("pull-counter");
    const imagesRowEl      = document.getElementById("images-row");
    const nextButton      = document.getElementById("next-button");
    const resultsContainer = document.getElementById("results-container");
    const resultsGridEl    = document.getElementById("results-grid");
    const downloadButton   = document.getElementById("download-button");

    // Render the very first pull:
    renderCurrentPull();

    // ─────────────────────────────────────────────────────────────────────
    // RENDER one trio of images + "Fuck/Marry/Kill" buttons
    // ─────────────────────────────────────────────────────────────────────
    function renderCurrentPull() {
      imagesRowEl.innerHTML = "";
      pullCounterEl.textContent = `Pull ${currentPullIndex + 1} / ${totalTriples}`;

      const trio = pulls[currentPullIndex];
      trio.forEach(filename => {
      const card = document.createElement("div");
      card.classList.add("image-card");

      // Label container
      const title = document.createElement("div");
      title.classList.add("image-title");

      // Show filename without extension if you want cleaner look:
      const cleanName = filename.replace(/\.(png|webp)$/i, "");
      title.textContent = cleanName;
      card.appendChild(title);

      // Image itself
      const img = document.createElement("img");
      img.src = `images/${imageFolder}/${filename}`;
      img.alt = filename;
      card.appendChild(img);

        // Buttons row under each image
        const btnRow = document.createElement("div");
        btnRow.classList.add("buttons-row");

        ["fuck", "marry", "kill"].forEach(action => {
          const btn = document.createElement("button");
          btn.textContent = action.charAt(0).toUpperCase() + action.slice(1);
          btn.classList.add("choice-button", action);
          btn.dataset.action   = action;   // "fuck" | "marry" | "kill"
          btn.dataset.filename = filename; // e.g. "image (27).webp"
          btn.addEventListener("click", onChoiceClicked);
          btnRow.appendChild(btn);
        });

        card.appendChild(btnRow);
        imagesRowEl.appendChild(card);
      });

      // Disable "Next" until all three are chosen
      nextButton.classList.remove("enabled");
      nextButton.disabled = true;
    }

    // ─────────────────────────────────────────────────────────────────────
    // HANDLER: User clicks "Fuck/Marry/Kill"
    // ─────────────────────────────────────────────────────────────────────
    function onChoiceClicked(e) {
      const clickedBtn   = e.currentTarget;
      const chosenAction = clickedBtn.dataset.action;   // "fuck"/"marry"/"kill"
      const chosenFile   = clickedBtn.dataset.filename; // e.g. "image (42).webp"

      // 1) If the clicked button is already selected, un‐select it:
      if (clickedBtn.classList.contains("selected")) {
        clickedBtn.classList.remove("selected");
        delete userChoices[chosenFile];

        // Re-enable that action on other cards in this pull
        const allBtnsThisPull = imagesRowEl.querySelectorAll(".choice-button");
        allBtnsThisPull.forEach(b => {
          if (
            b.dataset.action === chosenAction &&
            b.dataset.filename !== chosenFile
          ) {
            b.disabled = false;
          }
        });

        // Disable Next again, since one image is now unassigned
        nextButton.classList.remove("enabled");
        nextButton.disabled = true;
        return;
      }

      // 2) Otherwise, proceed with normal selection logic:
      const allBtnsThisPull = imagesRowEl.querySelectorAll(".choice-button");

      // If this filename had a previous choice, re-enable that action elsewhere
      const prevChoice = userChoices[chosenFile];
      if (prevChoice) {
        allBtnsThisPull.forEach(b => {
          if (
            b.dataset.action === prevChoice &&
            b.dataset.filename !== chosenFile
          ) {
            b.disabled = false;
          }
        });
      }

      // Remove "selected" from any other button for this same image
      allBtnsThisPull.forEach(b => {
        if (b.dataset.filename === chosenFile) {
          b.classList.remove("selected");
        }
      });

      // Record new choice
      userChoices[chosenFile] = chosenAction;
      clickedBtn.classList.add("selected");

      // Disable this same action on the other two cards in this pull
      allBtnsThisPull.forEach(b => {
        if (
          b.dataset.action === chosenAction &&
          b.dataset.filename !== chosenFile
        ) {
          if (b.classList.contains("selected")) {
            b.classList.remove("selected");
            delete userChoices[b.dataset.filename];
          }
          b.disabled = true;
        }
      });

      // Check if all three images in this pull now have a choice
      const trio = pulls[currentPullIndex];
      const allChosen = trio.every(f => typeof userChoices[f] === "string");
      if (allChosen) {
        nextButton.classList.add("enabled");
        nextButton.disabled = false;
      }
    }

    // ─────────────────────────────────────────────────────────────────────
    // "Next" button: either go to the next pull or finish and show results
    // ─────────────────────────────────────────────────────────────────────
    nextButton.addEventListener("click", () => {
      if (!nextButton.classList.contains("enabled")) return;

      if (currentPullIndex === pulls.length - 1) {
        showResults();
      } else {
        currentPullIndex++;
        renderCurrentPull();
      }
    });

    // ─────────────────────────────────────────────────────────────────────
    // SHOW FINAL RESULTS: hide game, display each pull in its own square
    // ─────────────────────────────────────────────────────────────────────
    function showResults() {
      document.getElementById("game-container").style.display = "none";
      resultsContainer.style.display = "block";
      downloadButton.style.display = "block"; 
      // (Now that results are visible, show the "Download Results" button)

      // Flatten [ [a,b,c], [d,e,f], … ] into [a,b,c,d,e,f,…] for iteration
      const allFilenames = pulls.flat();

      // Group by each pull of 3 (chunks of 3)
      for (let i = 0; i < allFilenames.length; i += 3) {
        const trio = allFilenames.slice(i, i + 3);
        const groupDiv = document.createElement("div");
        groupDiv.classList.add("pull-group");

        // Place each of the three results side by side in this square container
        trio.forEach((filename) => {
          const choice = userChoices[filename] || "No Choice";
          const resultCard = document.createElement("div");
          resultCard.classList.add("result-card");

          const thumb = document.createElement("img");
          thumb.src = `images/${imageFolder}/${filename}`;
          thumb.alt = filename;
          resultCard.appendChild(thumb);

          const labelDiv = document.createElement("div");
          if (choice === "fuck") {
            labelDiv.classList.add("label-fuck");
          } else if (choice === "marry") {
            labelDiv.classList.add("label-marry");
          } else if (choice === "kill") {
            labelDiv.classList.add("label-kill");
          }
          labelDiv.textContent = choice.charAt(0).toUpperCase() + choice.slice(1);
          resultCard.appendChild(labelDiv);

          groupDiv.appendChild(resultCard);
        });

        // Each .pull-group is a 310×310px square with three 100×100 thumbnails in a row.
        resultsGridEl.appendChild(groupDiv);
      }
    }

    // ─────────────────────────────────────────────────────────────────────
    // HANDLE "Download Results" BUTTON
    // ─────────────────────────────────────────────────────────────────────
downloadButton.addEventListener("click", async () => {
  downloadButton.style.display = "none";

  // Wait for images just in case
  const images = resultsContainer.querySelectorAll("img");
  await Promise.all(Array.from(images).map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(resolve => img.onload = img.onerror = resolve);
  }));

  html2canvas(resultsContainer, {
    scale: 4,
    backgroundColor: null,      // <-- Do NOT force black fill
    useCORS: true,
    allowTaint: true,           // <-- allows WebP + mixed-origin edge cases
    imageTimeout: 0
  }).then(canvas => {
    downloadButton.style.display = "block";

    canvas.toBlob(blob => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `results1_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, "image/jpeg", 0.92);
  }).catch(err => {
    console.error("html2canvas failed:", err);
    downloadButton.style.display = "block";
  });
});

    // ─────────────────────────────────────────────────────────────────────
    // UTILITY: Fisher–Yates shuffle in place
    // ─────────────────────────────────────────────────────────────────────
    function shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
  }
})();
