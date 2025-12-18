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
"Cagliostro (Alias).webp",
"Elaina (Alias).webp",
"Goldmary (Alias).webp",
"Hijiyama (Alias).webp",
"Iori (Alias).webp",
"Juliette (Alias).webp",
"Kanna (Alias).webp",
"Marice (Alias).webp",
"Mina (Alias).webp",
"Mizuki (Alias).webp",
"Riesbyfe (Citru).webp",
"Rise (Alias).webp",
"Suletta (Alias).webp",
"Teru (Alias).webp",
"Whislash (Alias).webp",
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
