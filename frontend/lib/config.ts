// UI Configuration

export const TYPING_CONFIG = {
  // Typing speed in milliseconds per character
  // Lower = faster, Higher = slower
  CHAR_DELAY: 15, // Optimized: 15ms = 66 chars/second (faster, still natural)
  
  // Batch size: Type multiple characters at once for better performance
  // Higher = faster but less smooth, Lower = slower but smoother
  BATCH_SIZE: 1, // Type 1 char at a time (smoothest)
  // Try BATCH_SIZE: 2 or 3 for faster typing with good smoothness
  
  // Skip animation for very short chunks (optimization)
  MIN_CHUNK_LENGTH_FOR_ANIMATION: 3, // Chunks < 3 chars appear instantly
  
  // Adaptive speed: Type faster for longer chunks
  ADAPTIVE_SPEED: true,
  
  // Alternative speeds you can try:
  // CHAR_DELAY: 10,  // Very fast (100 chars/second)
  // CHAR_DELAY: 20,  // Medium-fast (50 chars/second)
  // CHAR_DELAY: 30,  // Medium (33 chars/second)
  // CHAR_DELAY: 50,  // Slow (20 chars/second)
  // CHAR_DELAY: 0,   // Instant (no animation)
};

export const CHAT_CONFIG = {
  // Maximum message length
  MAX_MESSAGE_LENGTH: 5000,
  
  // Auto-scroll behavior
  AUTO_SCROLL: true,
  
  // Show typing indicator
  SHOW_TYPING_INDICATOR: true,
  
  // Show streaming cursor
  SHOW_STREAMING_CURSOR: true,
  
  // Debounce scroll updates (ms) - prevents excessive scrolling
  SCROLL_DEBOUNCE: 50,
};
