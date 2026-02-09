// UI Configuration

export const TYPING_CONFIG = {
  // Typing speed in milliseconds per character
  // Lower = faster, Higher = slower
  CHAR_DELAY: 20, // 20ms = 50 chars/second (fast, natural)
  
  // Alternative speeds you can try:
  // CHAR_DELAY: 10,  // Very fast (100 chars/second)
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
};
