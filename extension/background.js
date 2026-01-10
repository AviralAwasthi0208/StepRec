// Background script
console.log("Step Recorder Background Service Worker Loaded");

// Open Side Panel on Action Click
if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
}

// Initialize badge on load based on storage
chrome.storage.local.get(['isRecording'], (result) => {
  if (result.isRecording) {
    chrome.action.setBadgeText({ text: "REC" });
    chrome.action.setBadgeBackgroundColor({ color: "#ef4444" });
  } else {
    chrome.action.setBadgeText({ text: "ON" });
    chrome.action.setBadgeBackgroundColor({ color: "#22c55e" });
  }
});

// Listen for messages from content scripts or the main app
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "CHECK_EXTENSION") {
    sendResponse({ installed: true });
    return true;
  }

  // --- Status Check (New Tab / Reload) ---
  if (request.type === "GET_STATUS") {
    chrome.storage.local.get(['isRecording', 'recordedSteps'], (result) => {
      sendResponse({ 
        isRecording: result.isRecording || false, 
        steps: result.recordedSteps || [] 
      });
    });
    return true; // Keep channel open for async response
  }

  // --- Broadcast Logic (Start/Stop) ---
  if (request.type === "BROADCAST_START") {
    // 1. Try to open the side panel immediately (requires user gesture context)
    if (sender && sender.tab) {
      chrome.sidePanel.open({ windowId: sender.tab.windowId })
        .catch((err) => console.error("Could not open side panel:", err));
    }

    const initialState = {
      isRecording: true,
      recordedSteps: []
    };
    
    chrome.storage.local.set(initialState, () => {
      broadcastToAllTabs({ type: "START_RECORDING" });
      chrome.runtime.sendMessage({ type: "START_RECORDING" }).catch(() => {});
      chrome.action.setBadgeText({ text: "REC" });
      chrome.action.setBadgeBackgroundColor({ color: "#ef4444" });
    });
    return true;
  }

  if (request.type === "BROADCAST_STOP") {
    chrome.storage.local.set({ isRecording: false }, () => {
      broadcastToAllTabs({ type: "STOP_RECORDING" });
      chrome.runtime.sendMessage({ type: "STOP_RECORDING" }).catch(() => {});
      chrome.action.setBadgeText({ text: "ON" });
      chrome.action.setBadgeBackgroundColor({ color: "#22c55e" }); // Green
    });
    return true;
  }

  if (request.type === "BROADCAST_RESET") {
    chrome.storage.local.set({ isRecording: false, recordedSteps: [] }, () => {
      broadcastToAllTabs({ type: "RESET_RECORDING" });
      chrome.runtime.sendMessage({ type: "RESET_RECORDING" }).catch(() => {});
      chrome.action.setBadgeText({ text: "ON" });
      chrome.action.setBadgeBackgroundColor({ color: "#22c55e" });
    });
    return true;
  }

  // --- Event Handling ---
  if (request.type === "DOM_EVENT") {
    // SECURITY: Only process events if we are actually recording
    chrome.storage.local.get(['isRecording', 'recordedSteps'], (result) => {
      if (!result.isRecording) {
        return;
      }

      // We received a DOM event from content script
      // Now we capture the visible tab
      chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
        let finalStep = { ...request.payload };
        
        if (chrome.runtime.lastError) {
          // This happens if the tab is not active or not capture-able
          // We still want to record the step, just without a screenshot
          finalStep.screenshot = null;
        } else {
          finalStep.screenshot = dataUrl;
        }
        
        // Store the step
        const currentSteps = result.recordedSteps || [];
        
        // Deduplication logic for INPUT on same element
        const lastStep = currentSteps[currentSteps.length - 1];
        let isUpdate = false;

        if (lastStep && 
            lastStep.actionType === 'INPUT' && 
            finalStep.actionType === 'INPUT' &&
            lastStep.xpath === finalStep.xpath
        ) {
           // Update the last step
           currentSteps[currentSteps.length - 1] = finalStep;
           isUpdate = true;
        } else {
           currentSteps.push(finalStep);
        }
        
        chrome.storage.local.set({ recordedSteps: currentSteps }, () => {
          // Broadcast the step
          broadcastStep(finalStep, isUpdate);
          sendResponse({ success: true });
        });
      });
    });
    
    return true; // async response
  }
});

function broadcastToAllTabs(message) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, message).catch(err => {
        // Ignore errors for tabs that don't have our content script or aren't listening
      });
    });
  });
}

function broadcastStep(stepData, isUpdate = false) {
  const type = isUpdate ? "UPDATE_STEP" : "NEW_STEP";
  
  // Send to all tabs (content scripts)
  broadcastToAllTabs({
    type: type,
    payload: stepData
  });

  // Send to extension pages (Side Panel)
  chrome.runtime.sendMessage({
    type: type,
    payload: stepData
  }).catch(() => {});
}
