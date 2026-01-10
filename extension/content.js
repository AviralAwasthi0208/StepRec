const STEPREC_APP_ORIGINS = [
  'http://localhost:5173',
  'https://steprec.app', // your future prod domain
  'https://*.onrender.com' // Allow Render subdomains (update this with your specific URL after deployment)
];

function isStepRecAppPage() {
  return STEPREC_APP_ORIGINS.some(origin =>
    window.location.origin.startsWith(origin)
  );
}


// Content script
console.log("Step Recorder Content Script Active");

let isRecording = false;

// --- 1. Event Listeners Management ---

const eventTypes = ['click', 'change', 'submit', 'keydown', 'focus'];
let lastEventTime = 0;

function enableRecording(initialSteps = []) {
  if (isRecording) {
    return;
  }
  isRecording = true;
  console.log("StepRec: Recording STARTED");
  
  eventTypes.forEach(type => {
    document.addEventListener(type, handleEvent, true);
  });
}

function disableRecording() {
  if (!isRecording) return;
  isRecording = false;
  console.log("StepRec: Recording STOPPED");
  
  eventTypes.forEach(type => {
    document.removeEventListener(type, handleEvent, true);
  });
}

function handleEvent(event) {
    // 🚫 ABSOLUTE BLOCK: never record StepRec dashboard itself
  if (isStepRecAppPage()) {
    return;
  }

  if (!isRecording) return;
  
  // IGNORE events inside the side panel
  
  // Filter out nuisance events
  if (event.type === 'focus' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) {
      return; 
  }
  
  // Filter Keydown: Only capture Enter
  if (event.type === 'keydown' && event.key !== 'Enter') {
      return;
  }

  // Basic debounce to avoid double captures (e.g. click + focus)
  const now = Date.now();
  if (now - lastEventTime < 100) return;
  lastEventTime = now;

  const target = event.target;
  const interactiveTarget = getInteractiveElement(target);
  
  if (!interactiveTarget) return;

  let rect;
  try {
    rect = interactiveTarget.getBoundingClientRect();
  } catch (e) {
    console.error("StepRec: Failed to get rect", e);
    return;
  }
  
  // Security: Do not record input from password fields
  if (target.type === 'password' || interactiveTarget.type === 'password') return;

  const stepData = {
    mode: "WEB",
    actionType: mapEventType(event.type),
    description: generateDescription(event, interactiveTarget),
    timestamp: now,
    url: window.location.href,
    devicePixelRatio: window.devicePixelRatio,
    xpath: getXPath(interactiveTarget),
    highlight: {
      x: rect.x,
      y: rect.y,
      w: rect.width,
      h: rect.height
    },
    tagName: interactiveTarget.tagName,
    // Privacy: Only capture value for non-sensitive fields
    inputValue: (target.type !== 'password' && target.type !== 'hidden') 
      ? (target.value || target.innerText || '').substring(0, 500) 
      : '[REDACTED]'
  };

  // Send to background to get screenshot 
  try { 
    if (!chrome.runtime?.id) return; // Context invalid
    chrome.runtime.sendMessage({ 
      type: "DOM_EVENT", 
      payload: stepData 
    }); 
  } catch (e) { 
     if (e.message.includes("Extension context invalidated")) {
       console.log("Extension connection lost. Please refresh the page.");
       return;
     }
     console.error("Failed to send message", e); 
   } 
}

// --- 2. Helpers ---

function mapEventType(type) {
  if (type === 'click' || type === 'focus') return 'CLICK';
  if (type === 'input' || type === 'change') return 'INPUT';
  if (type === 'submit') return 'SUBMIT';
  if (type === 'keydown') return 'KEYDOWN';
  return 'UNKNOWN';
}

function generateDescription(event, target) {
  const tagName = target.tagName.toLowerCase();
  
  // Semantic Label Logic
  const label = 
    (target.innerText || '').trim() || 
    target.getAttribute('aria-label') || 
    target.getAttribute('title') || 
    target.getAttribute('alt') || 
    target.getAttribute('placeholder') ||
    tagName;

  // Clean up label (first 30 chars, remove newlines)
  const cleanLabel = label.replace(/\s+/g, ' ').substring(0, 30).trim();

  if (event.type === 'click') return `Click on ${cleanLabel}`;
  if (event.type === 'focus') return `Click on ${cleanLabel}`;
  if (event.type === 'input' || event.type === 'change') return `Type in ${cleanLabel}`;
  if (event.type === 'keydown') return `Press Enter on ${cleanLabel}`;
  if (event.type === 'submit') return `Submit form`;
  return `Interact with ${cleanLabel}`;
}

function getInteractiveElement(el) {
  if (!el) return null;
  // Ensure we are dealing with an Element node (nodeType 1)
  if (el.nodeType !== 1) {
    if (el.parentElement) {
       el = el.parentElement;
    } else {
       return null;
    }
  }

  // If the element itself is interactive, return it
  if (el.matches('a, button, [role="button"], input, select, textarea, summary, details')) {
    return el;
  }
  // Otherwise find closest interactive ancestor
  return el.closest('a, button, [role="button"], input, select, textarea, li, nav, summary, details') || el;
}

function getXPath(element) {
  if (element.id !== '') return `//*[@id="${element.id}"]`;
  if (element === document.body) return element.tagName;
  let ix = 0;
  const siblings = element.parentNode.childNodes;
  for (let i = 0; i < siblings.length; i++) {
    const sibling = siblings[i];
    if (sibling === element) return getXPath(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
  }
}

// --- 3. Messaging & Coordination ---

// Listen for commands from Background (broadcasted to all tabs)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "START_RECORDING") {
    enableRecording([]); // New recording, empty steps
    // Notify the page (in case it's the dashboard)
    window.postMessage({ type: "EXTERNAL_STATE_CHANGE", payload: { isRecording: true } }, "*");
  }
  else if (message.type === "STOP_RECORDING") {
    disableRecording();
    // Notify the page
    window.postMessage({ type: "EXTERNAL_STATE_CHANGE", payload: { isRecording: false } }, "*");
  }
  else if (message.type === "RESET_RECORDING") {
    disableRecording();
    // Notify the page to clear steps
    window.postMessage({ type: "EXTERNAL_STATE_CHANGE", payload: { isRecording: false, steps: [] } }, "*");
  }
  else if (message.type === "NEW_STEP" || message.type === "UPDATE_STEP") {
    // Forward to the window so the React App can hear it
    window.postMessage({ type: "RECORDER_STEP", payload: message.payload }, "*");
  }
});

// Initialize: Check if we should be recording (Cross-tab persistence)
function checkRecordingStatus() {
  try {
    if (chrome.runtime?.id) {
      chrome.runtime.sendMessage({ type: "GET_STATUS" }, (response) => {
        if (chrome.runtime.lastError) return;
        
        if (response && response.isRecording) {
           if (!isRecording) {
             console.log("StepRec: Resuming recording (status check)");
             enableRecording(response.steps || []);
           }
        } else {
          // Background says NOT recording, but we are? Stop.
          if (isRecording) {
             disableRecording();
          }
        }
      });
    }
  } catch (e) {
    console.error("StepRec: Status check failed", e);
  }
}

// Check on load
setTimeout(checkRecordingStatus, 100);

// Check on visibility change (tab switch)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    checkRecordingStatus();
  }
});

// Check on focus (window switch)
window.addEventListener('focus', checkRecordingStatus);

// Notify page that extension is installed
window.postMessage({ type: "EXTENSION_INSTALLED" }, "*");
window.__STEP_RECORDER_EXTENSION_ACTIVE__ = true;

// Listen for messages FROM the React App (via window)
window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  
  // App wants to check if we are here
  if (event.data.type === "CHECK_EXTENSION_AVAILABILITY") {
    window.postMessage({ type: "EXTENSION_INSTALLED" }, "*");
  }

  // App wants to check status
  if (event.data.type === "GET_RECORDING_STATUS_REQUEST") {
    try {
      chrome.runtime.sendMessage({ type: "GET_STATUS" }, (response) => {
         if (!chrome.runtime.lastError && response) {
             window.postMessage({ 
                 type: "RECORDING_STATUS_RESPONSE", 
                 payload: response 
             }, "*");
         }
      });
    } catch (e) {
      // ignore
    }
  }
  
  // App wants to START recording (Bridge to Background)
  if (event.data.type === "START_RECORDING_REQUEST") {
    try {
      chrome.runtime.sendMessage({ type: "BROADCAST_START" });
    } catch (error) {
      console.error("StepRec: Connection failed", error);
      if (error.message.includes("Extension context invalidated")) {
         alert("Step Recorder Extension was updated. Please refresh this page to continue.");
         window.location.reload();
      }
    }
  }
  
  // App wants to STOP recording (Bridge to Background)
  if (event.data.type === "STOP_RECORDING_REQUEST") {
    try {
      chrome.runtime.sendMessage({ type: "BROADCAST_STOP" });
    } catch (error) {
      console.error("StepRec: Connection failed", error);
       if (error.message.includes("Extension context invalidated")) {
         alert("Step Recorder Extension was updated. Please refresh this page to save your recording.");
         // We can't easily save if context is lost, but refreshing re-hooks the extension
      }
    }
  }

  // App wants to RESET recording (Bridge to Background)
  if (event.data.type === "RESET_RECORDING_REQUEST") {
    try {
      chrome.runtime.sendMessage({ type: "BROADCAST_RESET" });
    } catch (error) {
      console.error("StepRec: Connection failed", error);
    }
  }
});