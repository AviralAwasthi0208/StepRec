export class ScreenRecorder {
  constructor() {
    this.canvas = null
    this.context = null
    this.frames = []
    this.interactions = []
    this.isRecording = false
    this.startTime = 0
    this.frameInterval = 350 // ms
    this.frameIntervalId = null
    this.lastImageData = null
  }

  async startRecording() {
    this.isRecording = true
    this.startTime = Date.now()
    this.frames = []
    this.interactions = []
    this.lastImageData = null

    // Request screen capture
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" },
      })

      this.canvas = document.createElement("canvas")
      this.context = this.canvas.getContext("2d", { willReadFrequently: true })

      const video = document.createElement("video")
      video.srcObject = stream
      video.play()

      video.onloadedmetadata = () => {
        this.canvas.width = video.videoWidth
        this.canvas.height = video.videoHeight

        // Start capturing frames
        this.frameIntervalId = setInterval(() => {
          if (this.isRecording && this.context && this.canvas) {
            this.context.drawImage(video, 0, 0)
            const screenshotDataUrl = this.canvas.toDataURL("image/jpeg", 0.7)
            const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)

            const screenChangePercent = this.calculateScreenChange(imageData)
            this.lastImageData = imageData

            const frame = {
              timestamp: Date.now() - this.startTime,
              screenshotDataUrl,
              interactionType: "frame",
              cursorPosition: { x: 0, y: 0 },
              activeWindow: this.getActiveWindow(),
              screenChangePercent,
            }

            this.frames.push(frame)
            this.lastFrame = frame
          }
        }, this.frameInterval)
      }

      // Attach event listeners
      this.attachEventListeners()
      
      // Stop recording if user stops sharing via browser UI
      stream.getVideoTracks()[0].onended = () => {
        if (this.isRecording) {
            // Optional: Dispatch a custom event or let the UI handle it via state
            console.log("Screen sharing stopped by user");
        }
      };

    } catch (error) {
      console.error("Failed to start recording:", error)
      this.isRecording = false
      throw error;
    }
  }

  attachEventListeners() {
    const handlers = {
      mousemove: (e) => this.logInteraction("mousemove", e.clientX, e.clientY),
      click: (e) => this.logInteraction("click", e.clientX, e.clientY),
      dblclick: (e) => this.logInteraction("double_click", e.clientX, e.clientY),
      contextmenu: (e) => this.logInteraction("right_click", e.clientX, e.clientY),
      scroll: () => this.logInteraction("scroll", 0, 0),
      keypress: (e) => this.logInteraction("key_press", 0, 0, { key: e.key }),
    }

    Object.entries(handlers).forEach(([event, handler]) => {
      document.addEventListener(event, handler)
    })

    // Store for cleanup
    this.eventHandlers = handlers
  }

  logInteraction(type, x, y, metadata) {
    if (!this.isRecording) return

    const interaction = {
      type,
      timestamp: Date.now() - this.startTime,
      cursorPosition: { x, y },
      activeWindow: this.getActiveWindow(),
      metadata,
    }

    this.interactions.push(interaction)
  }

  calculateScreenChange(currentImageData) {
    if (!this.lastImageData) return 0

    const data1 = currentImageData.data
    const data2 = this.lastImageData.data
    const len = data1.length
    let diffPixels = 0
    
    // Check every 4th pixel (step by 16 bytes: 4 bytes/pixel * 4 pixels)
    // This reduces CPU load significantly while still detecting changes
    for (let i = 0; i < len; i += 16) {
      if (
        Math.abs(data1[i] - data2[i]) > 20 ||
        Math.abs(data1[i + 1] - data2[i + 1]) > 20 ||
        Math.abs(data1[i + 2] - data2[i + 2]) > 20
      ) {
        diffPixels++
      }
    }

    const totalPixelsChecked = len / 16
    return (diffPixels / totalPixelsChecked) * 100
  }

  getActiveWindow() {
    // In a browser environment, we return a mock value
    // In Electron/native context, this would use OS APIs
    return "Desktop/Window"
  }

  stopRecording() {
    this.isRecording = false

    if (this.frameIntervalId) {
      clearInterval(this.frameIntervalId)
    }

    // Remove event listeners
    if (this.eventHandlers) {
      Object.entries(this.eventHandlers).forEach(([event, handler]) => {
        document.removeEventListener(event, handler)
      })
    }

    const endTime = Date.now()

    return {
      frames: this.frames,
      interactions: this.interactions,
      startTime: this.startTime,
      endTime,
      duration: endTime - this.startTime,
    }
  }
}

export const screenRecorder = new ScreenRecorder()
