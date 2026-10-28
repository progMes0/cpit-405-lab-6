// Cookie helper functions
function setCookie(name, value, days = 7) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
}

function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// Initial state values
let likes = 100;
let dislikes = 20;
let comments = [];
let userVoted = false;
let userCommented = false;

// DOM Elements
const likeCountEl = document.getElementById("likeCount");
const dislikeCountEl = document.getElementById("dislikeCount");
const likeBtn = document.getElementById("likeBtn");
const dislikeBtn = document.getElementById("dislikeBtn");
const commentInput = document.getElementById("commentInput");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");
const commentsDisplay = document.getElementById("commentsDisplay");
const statusMsg = document.getElementById("statusMsg");

// Load stored state on initial startup
function loadStoredState() {
  const storedLikes = getCookie("likes");
  const storedDislikes = getCookie("dislikes");
  const storedUserVoted = getCookie("userVoted");
  const storedComments = getCookie("comments");
  const storedUserCommented = getCookie("userCommented");

  if (storedLikes !== null) likes = parseInt(storedLikes, 10);
  if (storedDislikes !== null) dislikes = parseInt(storedDislikes, 10);
  if (storedUserVoted !== null) userVoted = storedUserVoted === "true";
  if (storedComments !== null) {
    try {
      comments = JSON.parse(storedComments);
    } catch (e) {
      comments = [];
    }
  }
  if (storedUserCommented !== null) userCommented = storedUserCommented === "true";

  updateUI();
}

// Render UI based on current state
function updateUI() {
  likeCountEl.textContent = likes;
  dislikeCountEl.textContent = dislikes;

  // Disable voting if already voted
  likeBtn.disabled = userVoted;
  dislikeBtn.disabled = userVoted;

  // Disable comment submission if already commented
  submitBtn.disabled = userCommented;
  commentInput.disabled = userCommented;

  // Display comments list
  commentsDisplay.innerHTML = "";
  comments.forEach(comment => {
    const div = document.createElement("div");
    div.className = "comment-item";
    div.textContent = comment;
    commentsDisplay.appendChild(div);
  });
}

// Handle Like / Dislike actions
function handleVote(type) {
  if (userVoted) return;

  if (type === 'like') {
    likes++;
  } else if (type === 'dislike') {
    dislikes++;
  }

  userVoted = true;

  // Save to cookies
  setCookie("likes", likes);
  setCookie("dislikes", dislikes);
  setCookie("userVoted", "true");

  updateUI();
}

// Handle Comment submission
function handleCommentSubmit() {
  const text = commentInput.value.trim();
  if (!text) {
    statusMsg.textContent = "Please write a comment before submitting.";
    return;
  }
  if (userCommented) return;

  comments.push(text);
  userCommented = true;

  // Save to cookies
  setCookie("comments", JSON.stringify(comments));
  setCookie("userCommented", "true");

  commentInput.value = "";
  statusMsg.textContent = "";
  updateUI();
}

// Reset functionality (Clear choices & comments)
function handleReset() {
  if (confirm("Are you sure you want to reset your choices and comments?")) {
    // Reset state variables
    likes = 100;
    dislikes = 20;
    comments = [];
    userVoted = false;
    userCommented = false;

    // Delete cookies
    deleteCookie("likes");
    deleteCookie("dislikes");
    deleteCookie("userVoted");
    deleteCookie("comments");
    deleteCookie("userCommented");

    commentInput.value = "";
    statusMsg.textContent = "State reset successfully.";
    setTimeout(() => { statusMsg.textContent = ""; }, 3000);

    updateUI();
  }
}

// Event Listeners
likeBtn.addEventListener("click", () => handleVote("like"));
dislikeBtn.addEventListener("click", () => handleVote("dislike"));
submitBtn.addEventListener("click", handleCommentSubmit);
clearBtn.addEventListener("click", handleReset);

// Initialize on script load
loadStoredState();