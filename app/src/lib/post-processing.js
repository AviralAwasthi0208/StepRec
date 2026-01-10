// Phase 1: Timeline Merging
export function mergeTimeline(frames, interactions) {
  const events = [
    ...frames.map((frame) => ({
      timestamp: frame.timestamp,
      type: "frame",
      frame,
    })),
    ...interactions.map((interaction) => ({
      timestamp: interaction.timestamp,
      type: "interaction",
      interaction,
    })),
  ]

  return events.sort((a, b) => a.timestamp - b.timestamp)
}

// Phase 2: Interaction Clustering
export function clusterInteractions(timeline, frameCaptures) {
  const clusters = []
  let currentCluster = []
  let clusterStartTime = 0

  const frameMap = new Map(frameCaptures.map((f) => [f.timestamp, f]))

  for (let i = 0; i < timeline.length; i++) {
    const event = timeline[i]

    // Start a new cluster on meaningful interactions
    if (event.type === "interaction") {
      const interaction = event.interaction

      // Skip mouse movement alone - it should not start a cluster
      if (interaction.type === "mousemove") {
        if (currentCluster.length === 0) {
          continue
        }
      }

      if (currentCluster.length === 0) {
        clusterStartTime = event.timestamp
      }

      currentCluster.push(event)

      // Check if next event is a frame showing screen change (finalizes cluster)
      if (i + 1 < timeline.length && timeline[i + 1].type === "frame") {
        const nextFrame = timeline[i + 1].frame
        if (nextFrame.screenChangePercent > 12) {
          currentCluster.push(timeline[i + 1])
          clusters.push(
            createCluster(clusterStartTime, timeline[i + 1].timestamp, currentCluster, frameMap, interaction.type),
          )
          currentCluster = []
        }
      }
    } else if (event.type === "frame") {
      // Add frames to current cluster or finalize
      if (currentCluster.length > 0) {
        currentCluster.push(event)

        // Finalize if significant screen change
        if (event.frame.screenChangePercent > 12) {
          const lastInteraction = currentCluster.find(
            (e) => e.type === "interaction" && e.interaction.type !== "mousemove",
          )
          clusters.push(
            createCluster(
              clusterStartTime,
              event.timestamp,
              currentCluster,
              frameMap,
              lastInteraction?.interaction?.type || "frame",
            ),
          )
          currentCluster = []
        }
      } else {
        // Visual-only step detection:
        // If we are not tracking an interaction, but see a significant screen change,
        // we treat it as a visual step (e.g. navigation, or external interaction).
        if (event.frame.screenChangePercent > 5) {
          clusters.push(
            createCluster(
              event.timestamp,
              event.timestamp,
              [event],
              frameMap,
              "visual_change",
            ),
          )
        }
      }
    }
  }

  // Handle remaining cluster
  if (currentCluster.length > 0) {
    const lastInteraction = currentCluster.find((e) => e.type === "interaction" && e.interaction.type !== "mousemove")
    clusters.push(
      createCluster(
        clusterStartTime,
        currentCluster[currentCluster.length - 1].timestamp,
        currentCluster,
        frameMap,
        lastInteraction?.interaction?.type || "frame",
      ),
    )
  }

  return clusters
}

function createCluster(
  startTime,
  endTime,
  events,
  frameMap,
  interactionType,
) {
  // Find the most representative frame (immediately after action's visible effect)
  const frameEvents = events.filter((e) => e.type === "frame")
  let representativeFrame = frameEvents[frameEvents.length - 1]?.frame

  if (!representativeFrame && frameMap.size > 0) {
    representativeFrame = Array.from(frameMap.values())[0]
  }

  return {
    startTimestamp: startTime,
    endTimestamp: endTime,
    events,
    representativeFrame: representativeFrame,
    interactionType,
  }
}

// Phase 3: Key Frame Selection (filters clusters)
export function selectKeyFrames(clusters) {
  return clusters.filter((cluster) => {
    const frame = cluster.representativeFrame
    
    // Safety check
    if (!frame) return false;

    // Always keep visual changes
    if (cluster.interactionType === "visual_change") return true

    // Keep if interaction type is not mousemove
    if (cluster.interactionType !== "mousemove") return true

    // Keep if significant screen change
    if (frame.screenChangePercent > 12) return true

    // Keep if window changed
    const hasWindowChange = cluster.events.some((e) => e.interaction?.type === "window_focus_change")
    if (hasWindowChange) return true

    return false
  })
}
