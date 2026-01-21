const stepsList = document.getElementById('steps-list');
const stepCount = document.getElementById('step-count');
const recordingDot = document.getElementById('recording-dot');

// Buttons
const startBtn = document.getElementById('start-btn');
const finishBtn = document.getElementById('finish-btn');
const newRecordingBtn = document.getElementById('new-recording-btn');
const openGuideBtn = document.getElementById('open-guide-btn');

function updateUI(steps, isRecording) {
  stepCount.textContent = `${steps.length} steps`;
  
  // State Machine for Buttons
  if (isRecording) {
    // RECORDING STATE
    recordingDot.classList.add('active');
    
    startBtn.classList.add('hidden');
    finishBtn.classList.remove('hidden');
    newRecordingBtn.classList.add('hidden');
    openGuideBtn.classList.add('hidden');
    
  } else {
    // IDLE / FINISHED STATE
    recordingDot.classList.remove('active');
    
    if (steps.length > 0) {
      // HAS RECORDING
      startBtn.classList.add('hidden');
      finishBtn.classList.add('hidden');
      newRecordingBtn.classList.remove('hidden');
      openGuideBtn.classList.remove('hidden');
    } else {
      // EMPTY / NEW
      startBtn.classList.remove('hidden');
      finishBtn.classList.add('hidden');
      newRecordingBtn.classList.add('hidden');
      openGuideBtn.classList.add('hidden');
    }
  }

  // Rebuild list
  stepsList.innerHTML = '';
  steps.forEach((step, index) => {
    addStepElement(step, index + 1);
  });
  
  // Scroll to bottom
  setTimeout(() => {
    stepsList.scrollTop = stepsList.scrollHeight;
  }, 50);
}

function addStepElement(step, number) {
  const item = document.createElement('div');
  item.className = 'step-item';
  item.innerHTML = `
    <div class="step-number">${number}</div>
    <div class="step-desc">${step.description}</div>
  `;
  stepsList.appendChild(item);
}

// Initial Load
chrome.runtime.sendMessage({ type: "GET_STATUS" }, (response) => {
  if (response) {
    updateUI(response.steps || [], response.isRecording);
  }
});

// Listen for messages
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "START_RECORDING") {
    chrome.runtime.sendMessage({ type: "GET_STATUS" }, (res) => {
       updateUI(res.steps || [], true);
    });
  } else if (message.type === "STOP_RECORDING") {
    chrome.runtime.sendMessage({ type: "GET_STATUS" }, (res) => {
       updateUI(res.steps || [], false);
    });
  } else if (message.type === "RESET_RECORDING") {
    updateUI([], false);
  } else if (message.type === "NEW_STEP") {
    // Refresh full state to be safe
    chrome.runtime.sendMessage({ type: "GET_STATUS" }, (res) => {
       updateUI(res.steps || [], res.isRecording);
    });
  } else if (message.type === "UPDATE_STEP") {
     // Update last element text locally to avoid flicker/reload
     const lastItem = stepsList.lastElementChild;
     if (lastItem) {
        const descEl = lastItem.querySelector('.step-desc');
        if (descEl) {
          descEl.textContent = message.payload.description;
        }
     }
  }
});

// Auto-scroll logic helper
const observer = new MutationObserver(() => {
  stepsList.scrollTop = stepsList.scrollHeight;
});
observer.observe(stepsList, { childList: true });

// Button Actions

// 1. START RECORDING
startBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: "BROADCAST_START" });
});

// 2. STOP RECORDING
finishBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: "BROADCAST_STOP" });
});

// 3. NEW RECORDING (Clear steps)
newRecordingBtn.addEventListener('click', () => {
  // Use broadcast to notify everyone (including React App)
  chrome.runtime.sendMessage({ type: "BROADCAST_RESET" });
});

// 4. OPEN WORKFLOW GUIDE (Main App)
openGuideBtn.addEventListener('click', () => {
  let APP_URL;
  
  if (typeof CONFIG !== 'undefined' && CONFIG.IS_DEV) {
    APP_URL = CONFIG.DEV_URL;
  } else {
    // Production Mode
    APP_URL = (typeof CONFIG !== 'undefined' && CONFIG.PROD_URL) ? CONFIG.PROD_URL : "https://steprec.onrender.com";
  }
  
  chrome.tabs.create({ url: APP_URL }, (tab) => {
     // Optional: Send data to the app once opened if needed
     // For now, the app reads from local storage or we can push it
  });
});
