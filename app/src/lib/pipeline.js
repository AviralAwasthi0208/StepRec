import { mergeTimeline, clusterInteractions, selectKeyFrames } from "./post-processing"
import { generateStepDescription } from "./description-generator"

export async function processRecording(recordingData) {
  const { frames, interactions } = recordingData

  // Step 1: Timeline Merging
  const timeline = mergeTimeline(frames, interactions)

  // Step 2: Interaction Clustering
  const clusters = clusterInteractions(timeline, frames)

  // Step 3: Key Frame Selection
  const keyFrameClusters = selectKeyFrames(clusters)

  // Step 4: Generate descriptions and create final steps
  const steps = keyFrameClusters.map((cluster, index) => {
    const description = generateStepDescription(cluster, index + 1)

    return {
      stepNumber: index + 1,
      screenshot: cluster.representativeFrame.screenshotDataUrl,
      description,
      timestamp: cluster.representativeFrame.timestamp,
      activeWindow: cluster.representativeFrame.activeWindow,
      cluster,
      // Add App-compatible fields
      actionType: "DESKTOP",
      xpath: `desktop-step-${index}`,
      selector: "desktop-view",
      // Add ID to be consistent with web steps
      id: crypto.randomUUID()
    }
  })

  return steps
}
