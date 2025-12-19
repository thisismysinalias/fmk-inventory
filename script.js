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
"Aina (Joe).webp",
"Akane (Cog).webp",
"Akari Masudori (Nero).webp",
"Alexander (Joe).webp",
"Ally (Joe).webp",
"Alma (Cog).webp",
"Alois (Joe).webp",
"Alteria Dominicci de Calcinaia (Nero).webp",
"Amy Williams (Nero).webp",
"Ankoku (Joe).webp",
"Anna (Joe).webp",
"Aodhfin Essihl (Nero).webp",
"Asami (Joe).webp",
"Asher Teivel (Nero).webp",
"Asuka_H (Joe).webp",
"Asuka_T (Joe).webp",
"Audrey (Joe).webp",
"Ayame (Joe).webp",
"Azura (Joe).webp",
"Bea (Joe).webp",
"Becky Buckethead (Nero).webp",
"Bianca (Cog).webp",
"Bianca Zinzanni (Nero).webp",
"Blake (Joe).webp",
"Blanche (Joe).webp",
"Blues (Joe).webp",
"Caesar Cain (Nero).webp",
"Cagliostro (Alias).webp",
"Callie (Joe).webp",
"Canari (Cog).webp",
"Carolyn (Joe).webp",
"Caspar Sigurosson (Nero).webp",
"Cathy (Joe).webp",
"Cecilia (Joe).webp",
"Celebi (Cog).webp",
"Cerebellum (Joe).webp",
"Charlotte Williams (Nero).webp",
"Charon Valla-Williams (Nero).webp",
"Cheesecake (Cog).webp",
"Chiaki (Joe).webp",
"Chidori (Joe).webp",
"Chiharu (Joe).webp",
"Chloe (Joe).webp",
"Chrom (Joe).webp",
"Chuchu (Joe).webp",
"Chun Li (Joe).webp",
"Claire Donnelly-Walker (Nero).webp",
"Claude (Cog).webp",
"Cody (Joe).webp",
"Courtney (Cog).webp",
"Croissant (Cog).webp",
"Cyn (Joe).webp",
"Daisy (Cog).webp",
"Dark Pit or Vaal (Cog).webp",
"Dawn (Joe).webp",
"Dianne (Cog).webp",
"Dimitri (Joe).webp",
"Dr. Roy McCracken (Nero).webp",
"Dubhlainn 'John' Essihl (Nero).webp",
"Dusknoir (Cog).webp",
"Elaina (Alias).webp",
"Elena (Joe).webp",
"Elesa (Cog).webp",
"Elincia (Joe).webp",
"Elma (Joe).webp",
"Emiko (Cog).webp",
"Ethel (Cog).webp",
"Etie (Joe).webp",
"Eunie (Joe).webp",
"Evangeline (Joe).webp",
"Exusiai (Joe).webp",
"Finley (Joe).webp",
"Flora (Joe).webp",
"Fluttershy (Joe).webp",
"Frederick (Cog).webp",
"Futaba (Joe).webp",
"Fuyuka Masudori (Nero).webp",
"Gardenia (Cog).webp",
"Gina (Cog).webp",
"Ginkawa (Joe).webp",
"Gloria (Joe).webp",
"Goldmary (Alias).webp",
"Gr (Joe).webp",
"Grimsley (Cog).webp",
"Grovyle (Joe).webp",
"Hajime (Cog).webp",
"Hana (Joe).webp",
"Hanako (Cog).webp",
"Hanako (Joe).webp",
"Heather (Joe).webp",
"Hephaestus (Cog).webp",
"Hibiki (Cog).webp",
"Hibiki (Joe).webp",
"Hidemi (Cog).webp",
"Hijiyama (Alias).webp",
"Hilda (Joe).webp",
"Hinoka (Joe).webp",
"Hitenshi (Cog).webp",
"Hizuki (Joe).webp",
"Honedge (Cog).webp",
"Ike (Joe).webp",
"Ilyana (Joe).webp",
"Inei (Cog).webp",
"Inigo (Joe).webp",
"Iono (Joe).webp",
"Iori (Alias).webp",
"Itsuki (Joe).webp",
"Jacinthe (Joe).webp",
"Jacob (Joe).webp",
"James (Cog).webp",
"Jason (Joe).webp",
"Jethro Quereces (Nero).webp",
"Johanna (Joe).webp",
"Johannes Joinari (Nero).webp",
"Juliana (Joe).webp",
"Juliette (Alias).webp",
"Kal'tsit (Cog).webp",
"Kamina (Joe).webp",
"Kanato Kobayashi (Nero).webp",
"Kanji (Joe).webp",
"Kanna (Alias).webp",
"Kasetsu (Joe).webp",
"Katarina (Joe).webp",
"Katherine (Joe).webp",
"Kazehana (Cog).webp",
"Kiba (Joe).webp",
"Korone (Joe).webp",
"Kotone (Joe).webp",
"Kotori (Joe).webp",
"Kotori Otonashi (Nero).webp",
"Lana (Joe).webp",
"L'Arachel (Cog).webp",
"Leanne (Joe).webp",
"Lena (Joe).webp",
"Leo (Nreo).webp",
"Lethe (Joe).webp",
"Lilac (Joe).webp",
"Lillian Cox (Nero).webp",
"Link (Cog).webp",
"Lissa (Cog).webp",
"Little Mac (Nero).webp",
"Lukas Redding (Nero).webp",
"Lyra (Joe).webp",
"Lysithea (Cog).webp",
"Mahiru (Cog).webp",
"Malon (Joe).webp",
"Marcille (Joe).webp",
"Maria Toyozaki (Nero).webp",
"Marice (Alias).webp",
"Marina (Joe).webp",
"Mark Shion (Nero).webp",
"Matsumoto (Joe).webp",
"Max 'Nine' Ninelius (Nero).webp",
"Maxwell (Joe).webp",
"Mayumi (Cog).webp",
"Meallán Essihl (Nero).webp",
"Medusa (Joe).webp",
"Megu (Cog).webp",
"Melody (Joe).webp",
"Mia (Cog).webp",
"Mikoto (Joe).webp",
"Mina (Alias).webp",
"Miranda (Joe).webp",
"Mizuki (Alias).webp",
"Mizuki (Joe).webp",
"Molly Mahoney (Nero).webp",
"Mord (Joe).webp",
"Moyu Satsuka (Nero).webp",
"Mukuro (Cog).webp",
"Mythra (Joe).webp",
"Naomi (Cog).webp",
"Naoto (Joe).webp",
"Nemona (Joe).webp",
"Nephenee (Joe).webp",
"Nonon (Cog).webp",
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
"Penny (Cog).webp",
"Phoebe (Joe).webp",
"Phosphora (Cog).webp",
"Pinkie Pie (Joe).webp",
"Pit (Cog).webp",
"Python (Cog).webp",
"Riesbyfe (Citru).webp",
"Riko (Joe).webp",
"Rinkah (Joe).webp",
"Rise (Alias).webp",
"Ro (Joe).webp",
"Rosie MacGanicus.webp",
"Rottytops (Cog).webp",
"Roxanne (Joe).webp",
"Roxas (Joe).webp",
"Ruby (Joe).webp",
"Rui Mirei (Nero).webp",
"Saber (Cog).webp",
"Saero Rhinum (Nero).webp",
"Sakura (Joe).webp",
"Sam (Alias).webp",
"Samael (Joe).webp",
"Sandy (Joe).webp",
"Sato (Joe).webp",
"Sawyer Edgar (Nero).webp",
"Setsuka (Joe).webp",
"Setsuna (Cog).webp",
"Shantae (Joe).webp",
"Shay (Joe).webp",
"Shun (Joe).webp",
"Sigrun (Joe).webp",
"Silque (Cog).webp",
"Skyla (Cog).webp",
"Somnus (Joe).webp",
"Sora (Joe).webp",
"Sou (Joe).webp",
"Souta (Joe).webp",
"Spark (Joe).webp",
"Starla Paskett (Nero).webp",
"Steven (Cog).webp",
"Stocking (Joe).webp",
"Sueo Ikari (Nero).webp",
"Suletta (Alias).webp",
"Sunny (Cog).webp",
"Suzu (Joe).webp",
"Taion (Joe).webp",
"Takeshi (Joe).webp",
"Takumi (Cog).webp",
"Teru (Alias).webp",
"Tharja (Joe).webp",
"Tiger Lily (Joe).webp",
"Tiki (Cog).webp",
"Timerra (Joe).webp",
"Tobias Weaver (Nero).webp",
"Tron (Joe).webp",
"Tsumugi (Joe).webp",
"Tyche (Cog).webp",
"Vaz (Joe).webp",
"Victor Century (Nero).webp",
"Vincent (Cog).webp",
"Vivy (Joe).webp",
"Whislash (Alias).webp",
"Yb (Joe).webp",
"Yoko (Cog).webp",
"Yukari (Cog).webp",
"Yukiko (Joe).webp",
"Yuma (Cog).webp",
"Yumi (Joe).webp",
"Yumiko (Joe).webp",
"Yunaka (Joe).webp",
"Yuri (Joe).webp",
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
    downloadButton.addEventListener("click", () => {
      // Hide the download button temporarily to exclude it from screenshot
      downloadButton.style.display = "none";
      
      // Use html2canvas to render the resultsContainer into a canvas, then download as optimized image.
      html2canvas(resultsContainer, { 
        scale: 2,
        backgroundColor: "#000000",
        useCORS: true,
        allowTaint: false
      }).then(canvas => {
        // Show the download button again
        downloadButton.style.display = "block";
        
        // Smart compression to stay under 4MB
        const maxFileSize = 4 * 1024 * 1024; // 4MB
        let quality = 0.92; // Start with high quality
        
        const compressAndDownload = () => {
          canvas.toBlob(blob => {
            if (blob.size > maxFileSize && quality > 0.3) {
              // File too large, reduce quality and try again
              quality -= 0.08;
              compressAndDownload();
            } else {
              // File size acceptable or we've reached minimum quality
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = `results_${quality < 0.9 ? 'compressed_' : ''}${Date.now()}.jpg`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              // Log final file size for debugging
              console.log(`Downloaded image: ${(blob.size / 1024 / 1024).toFixed(2)}MB at ${Math.round(quality * 100)}% quality`);
            }
          }, "image/jpeg", quality);
        };
        
        compressAndDownload();
        
      }).catch(error => {
        // Make sure to show the button again even if there's an error
        downloadButton.style.display = "block";
        console.error("Error generating screenshot:", error);
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
