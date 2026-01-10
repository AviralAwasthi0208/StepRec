const actionDescriptions = {
  click: "Click",
  double_click: "Double-click",
  right_click: "Right-click",
  scroll: "Scroll",
  key_press: "Press a key",
  window_focus_change: "Switch window",
}

const intentMap = {
  "File Explorer": "in the file manager",
  Settings: "in system settings",
  Browser: "in the web browser",
  Terminal: "in the terminal",
  "Text Editor": "in the text editor",
}

export function generateStepDescription(cluster, stepNumber) {
  const { interactionType, representativeFrame } = cluster
  const interaction = cluster.events.find((e) => e.interaction?.type !== "mousemove")?.interaction
  const screenChange = representativeFrame ? representativeFrame.screenChangePercent : 0;
  const activeWindow = representativeFrame ? representativeFrame.activeWindow : "Desktop";

  let description = ""

  // Build action-based description
  const action = actionDescriptions[interactionType] || "Perform action"
  const windowContext = intentMap[activeWindow] || `in ${activeWindow}`

  if (interactionType === "click" || interactionType === "double_click") {
    if (screenChange > 15) {
      description = `${action} to open or navigate to a new screen`
    } else {
      description = `${action} to perform an action`
    }
  } else if (interactionType === "right_click") {
    description = `${action} to open the context menu ${windowContext}`
  } else if (interactionType === "scroll") {
    if (screenChange > 10) {
      description = `${action} to reveal more content`
    } else {
      description = `${action} to browse content`
    }
  } else if (interactionType === "key_press") {
    const key = interaction?.metadata?.key
    if (key === "Enter") {
      description = `Press Enter to confirm or submit`
    } else if (key === "Escape") {
      description = `Press Escape to cancel or close`
    } else {
      description = `Press ${key} to perform an action`
    }
  } else if (interactionType === "window_focus_change") {
    description = `Switch to ${activeWindow}`
  } else if (interactionType === "visual_change") {
    description = `Observe screen change or navigation ${windowContext}`
  } else {
    description = `Complete step ${stepNumber}: perform action in ${windowContext}`
  }

  return description
}
