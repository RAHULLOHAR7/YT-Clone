let allVideos = [],
  history = JSON.parse(localStorage.getItem("ytHistory")) || [],
  watchLater = JSON.parse(localStorage.getItem("ytWatchLater")) || [];

const grid = document.querySelector(".grid");
const modal = document.querySelector(".modal");
const player = document.querySelector(".player");
const closeBtn = document.querySelector(".close-btn");
const watchLaterBtn = document.querySelector(".watch-later-btn");

fetch("videos.json")
  .then((res) => res.json())
  .then((videos) => {
    allVideos = videos;
    showSection("home");
  });

// Render function
function render(videos) {
  grid.innerHTML = "";
  videos.forEach((video) => {
    const div = document.createElement("div");
    div.className = "video-preview";
    div.innerHTML = `
      <img class="thumbnail" src="${video.thumbnail}" alt="">
      <div class="video-details">
        <div class="channel-picture">
          <img class="profile-picture" src="${video.profile}" alt="">
        </div>
        <div class="video-info">
          <p class="video-title">${video.title}</p>
          <p class="channel-name">${video.channel}</p>
          <p class="video-stats">${video.views}</p>
        </div>
      </div>`;
    div.addEventListener("click", () => openModal(video));
    grid.appendChild(div);
  });
}
function renderWatchLater(videos) {
  grid.innerHTML = "";
  videos.forEach((video, index) => {
    const div = document.createElement("div");
    div.className = "video-preview watch-later-style";
    div.innerHTML = `
      <img class="thumbnail" src="${video.thumbnail}" alt="thumbnail">
      <div class="video-details">
        <div class="channel-picture">
          <img class="profile-picture" src="${video.profile}" alt="channel">
        </div>
        <div class="video-info">
          <p class="video-title">${video.title}</p>
          <p class="channel-name">${video.channel}</p>
          <p class="video-stats">${video.views}</p>
          <button class="remove-btn" data-index="${index}">Remove</button>
        </div>
      </div>
    `;

    div
      .querySelector(".thumbnail")
      .addEventListener("click", () => openModal(video));
    div.querySelector(".remove-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      watchLater.splice(index, 1);
      localStorage.setItem("ytWatchLater", JSON.stringify(watchLater));
      renderWatchLater(watchLater);
    });

    grid.appendChild(div);
  });
}

function openModal(video) {
  player.src = `https://www.youtube.com/embed/${video.videoId}?autoplay=1`;
  modal.classList.remove("hidden");

  // Save to history
  history = history.filter((v) => v.videoId !== video.videoId); // Remove duplicates
  history.unshift(video);
  localStorage.setItem("ytHistory", JSON.stringify(history));

  watchLaterBtn.onclick = () => {
    if (!watchLater.find((v) => v.videoId === video.videoId)) {
      watchLater.unshift(video);
      localStorage.setItem("ytWatchLater", JSON.stringify(watchLater));
      alert("Added to Watch Later");
    }
  };
}

function closeModal() {
  modal.classList.add("hidden");
  player.src = "";
}
closeBtn.onclick = closeModal;
modal.onclick = (e) => e.target === modal && closeModal();

// Sidebar navigation
document.querySelectorAll(".sidebar-item").forEach((btn) => {
  btn.addEventListener("click", () => showSection(btn.dataset.section));
});
function showSection(section) {
  document
    .querySelectorAll(".sidebar-item")
    .forEach((btn) =>
      btn.classList.toggle("active", btn.dataset.section === section)
    );

  if (section === "home") render(allVideos);
  else if (section === "history") render(history);
  else if (section === "watch-later") renderWatchLater(watchLater);
  else render([]);
}

// Search
const searchInput = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search-button");
const voiceBtn = document.querySelector(".voice-button");

function redirectToYouTube(q) {
  window.open(
    `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
    "_blank"
  );
}
searchBtn.onclick = () => {
  const q = searchInput.value.trim();
  if (q) redirectToYouTube(q);
};
searchInput.onkeydown = (e) => {
  if (e.key === "Enter") redirectToYouTube(searchInput.value.trim());
};

// Voice Search
voiceBtn.onclick = () => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return alert("Voice not supported");
  const rec = new SR();
  rec.lang = "en-US";
  rec.onresult = (e) => {
    searchInput.value = e.results[0][0].transcript;
    redirectToYouTube(searchInput.value);
  };
  rec.start();
};
const sidebar = document.querySelector(".sidebar");
const mainContent = document.querySelector(".main-content");

document.querySelector(".bars").onclick = () => {
  sidebar.classList.toggle("expanded");
  mainContent.classList.toggle("shifted");
};

document.querySelector(".dark-toggle").onclick = () => {
  document.body.classList.toggle("dark-mode");

  // Optional: toggle button emoji/icon
  const btn = document.querySelector(".dark-toggle");
  if (document.body.classList.contains("dark-mode")) {
    btn.textContent = "🌙"; // Back to dark mode
  } else {
    btn.textContent = "☀️"; // Light mode
  }
};

// Toggle sidebar
document.querySelector(".bars").onclick = () => {
  document.querySelector(".sidebar").classList.toggle("expanded");
};
//yt-btn reload
document.querySelector(".yt-btn").addEventListener("click", () => {
  location.reload();
});
