// 切换照片表单显示/隐藏
function togglePhotoForm() {
  const form = document.getElementById("photoForm");
  form.classList.toggle("hidden");

  if (form.classList.contains("hidden")) {
    // 重置表单
    form.reset();
    document.getElementById("imagePreview").classList.add("hidden");
    document.getElementById("uploadPrompt").classList.remove("hidden");
  }
}

// 处理照片上传和预览
document.getElementById("photoInput").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const preview = document.getElementById("imagePreview");
      preview.src = e.target.result;
      preview.classList.remove("hidden");
      document.getElementById("uploadPrompt").classList.add("hidden");
    };
    reader.readAsDataURL(file);
  }
});

// 处理照片表单提交
document
  .getElementById("photoForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const date = document.getElementById("photoDate").value;
    const title = document.getElementById("photoTitle").value;
    const description = document.getElementById("photoDescription").value;
    const imageFile = document.getElementById("photoInput").files[0];

    if (imageFile) {
      try {
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(imageFile);
        });

        // 创建新的照片卡片
        const photoCard = document.createElement("div");
        photoCard.className = "photo-card";
        photoCard.innerHTML = `
        <div class="photo-header">
          <span class="date">${formatDate(date)}</span>
          <div class="photo-actions">
            <button class="edit-btn" onclick="editPhoto(this.closest('.photo-card'))">✎</button>
            <button class="delete-btn" onclick="deletePhoto(this.closest('.photo-card'))">✕</button>
          </div>
        </div>
        <img src="${base64}" alt="${title}" />
        <div class="photo-info">
          <h3>${title}</h3>
          <p>${description}</p>
        </div>
      `;

        // 将新照片添加到网格开头
        const photoGrid = document.getElementById("photoGrid");
        photoGrid.insertBefore(photoCard, photoGrid.firstChild);

        // 重置表单并隐藏
        this.reset();
        document.getElementById("imagePreview").classList.add("hidden");
        document.getElementById("uploadPrompt").classList.remove("hidden");
        togglePhotoForm();

        // 保存数据
        await saveMedia();
      } catch (error) {
        console.error("Error handling photo upload:", error);
      }
    }
  });

// 编辑照片
function editPhoto(photoCard) {
  const date = photoCard.querySelector(".date").textContent;
  const title = photoCard.querySelector("h3").textContent;
  const description = photoCard.querySelector("p").textContent;
  const image = photoCard.querySelector("img").src;

  // 填充表单
  const form = document.getElementById("photoForm");
  const dateParts = date.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  form.querySelector("#photoDate").value = `${
    dateParts[1]
  }-${dateParts[2].padStart(2, "0")}-${dateParts[3].padStart(2, "0")}`;
  form.querySelector("#photoTitle").value = title;
  form.querySelector("#photoDescription").value = description;

  // 显示图片预览
  const preview = document.getElementById("imagePreview");
  preview.src = image;
  preview.classList.remove("hidden");
  document.getElementById("uploadPrompt").classList.add("hidden");

  // 显示表单
  form.classList.remove("hidden");
  form.scrollIntoView({ behavior: "smooth" });

  // 存储要编辑的卡片引用
  form.photoToEdit = photoCard;
}

// 删除照片
async function deletePhoto(photoCard) {
  if (confirm("确定要删除这张照片吗？💔")) {
    photoCard.style.transition = "all 0.3s ease";
    photoCard.style.opacity = "0";
    photoCard.style.transform = "scale(0.8)";

    setTimeout(async () => {
      photoCard.remove();
      await saveMedia();
    }, 300);
  }
}

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

// 切换视频表单显示/隐藏
function toggleVideoForm() {
  const form = document.getElementById("videoForm");
  const photoForm = document.getElementById("photoForm");

  // 如果照片表单是打开的，先关闭它
  if (!photoForm.classList.contains("hidden")) {
    togglePhotoForm();
  }

  form.classList.toggle("hidden");

  if (form.classList.contains("hidden")) {
    // 重置表单
    form.reset();
    document.getElementById("videoPreview").classList.add("hidden");
    document.getElementById("videoUploadPrompt").classList.remove("hidden");
    // 清除视频源
    document.getElementById("videoPreview").src = "";
  }
}

// 处理视频上传和预览
document.getElementById("videoInput").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const video = document.getElementById("videoPreview");
    video.src = URL.createObjectURL(file);
    video.classList.remove("hidden");
    document.getElementById("videoUploadPrompt").classList.add("hidden");
  }
});

// 处理视频表单提交
document
  .getElementById("videoForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const date = document.getElementById("videoDate").value;
    const title = document.getElementById("videoTitle").value;
    const description = document.getElementById("videoDescription").value;
    const videoFile = document.getElementById("videoInput").files[0];

    if (videoFile) {
      try {
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(videoFile);
        });

        // 创建新的视频卡片
        const videoCard = document.createElement("div");
        videoCard.className = "photo-card video-card";
        videoCard.innerHTML = `
        <div class="photo-header">
          <span class="date">${formatDate(date)}</span>
          <div class="photo-actions">
            <button class="edit-btn" onclick="editVideo(this.closest('.video-card'))">✎</button>
            <button class="delete-btn" onclick="deleteVideo(this.closest('.video-card'))">✕</button>
          </div>
        </div>
        <div class="video-container">
          <video src="${base64}" controls></video>
        </div>
        <div class="photo-info">
          <h3>${title}</h3>
          <p>${description}</p>
        </div>
      `;

        // 将新视频添加到网格开头
        const photoGrid = document.getElementById("photoGrid");
        photoGrid.insertBefore(videoCard, photoGrid.firstChild);

        // 重置表单并隐藏
        this.reset();
        document.getElementById("videoPreview").classList.add("hidden");
        document.getElementById("videoUploadPrompt").classList.remove("hidden");
        document.getElementById("videoPreview").src = "";
        toggleVideoForm();

        // 保存数据
        await saveMedia();
      } catch (error) {
        console.error("Error handling video upload:", error);
      }
    }
  });

// 编辑视频
function editVideo(videoCard) {
  const form = document.getElementById("videoForm");

  // 填充表单
  const date = videoCard.querySelector(".date").textContent;
  const title = videoCard.querySelector("h3").textContent;
  const description = videoCard.querySelector("p").textContent;
  const video = videoCard.querySelector("video").src;

  // 将日期转换为 YYYY-MM-DD 格式
  const dateParts = date.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  form.querySelector("#videoDate").value = `${
    dateParts[1]
  }-${dateParts[2].padStart(2, "0")}-${dateParts[3].padStart(2, "0")}`;
  form.querySelector("#videoTitle").value = title;
  form.querySelector("#videoDescription").value = description;

  // 显示视频预览
  const preview = document.getElementById("videoPreview");
  preview.src = video;
  preview.classList.remove("hidden");
  document.getElementById("videoUploadPrompt").classList.add("hidden");

  // 显示表单
  form.classList.remove("hidden");
  form.scrollIntoView({ behavior: "smooth" });

  // 存储要编辑的卡片引用
  form.videoToEdit = videoCard;
}

// 删除视频
async function deleteVideo(videoCard) {
  if (confirm("确定要删除这个视频吗？💔")) {
    videoCard.style.transition = "all 0.3s ease";
    videoCard.style.opacity = "0";
    videoCard.style.transform = "scale(0.8)";

    setTimeout(async () => {
      videoCard.remove();
      await saveMedia();
    }, 300);
  }
}

// 保存照片和视频数据到服务器
async function saveMedia() {
  try {
    const photoGrid = document.getElementById("photoGrid");
    const media = [];

    // 收集所有媒体数据
    await Promise.all(
      Array.from(photoGrid.querySelectorAll(".photo-card")).map(
        async (card) => {
          const isVideo = card.classList.contains("video-card");
          const mediaElement = isVideo
            ? card.querySelector("video")
            : card.querySelector("img");

          let src = mediaElement.src;
          if (src.startsWith("blob:")) {
            try {
              const response = await fetch(src);
              const blob = await response.blob();
              src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
              });
            } catch (error) {
              console.error("Error converting blob to base64:", error);
            }
          }

          media.push({
            type: isVideo ? "video" : "photo",
            date: card.querySelector(".date").textContent,
            title: card.querySelector("h3").textContent,
            description: card.querySelector("p").textContent,
            src: src,
          });
        }
      )
    );

    // 发送到服务器
    const response = await fetch(`${API_CONFIG.BASE_URL}/media`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(media),
    });

    if (!response.ok) {
      throw new Error("Failed to save media");
    }

    // 保存到本地存储作为备份
    localStorage.setItem("media", JSON.stringify(media));
  } catch (error) {
    console.error("Error saving media:", error);
    // 如果服务器保存失败，至少保存在本地
    saveToLocalStorage();
  }
}

// 从服务器加载照片和视频数据
async function loadMedia() {
  try {
    // 尝试从服务器加载
    const response = await fetch(`${API_CONFIG.BASE_URL}/media`);
    if (!response.ok) {
      throw new Error("Failed to fetch media");
    }

    const media = await response.json();
    displayMedia(media);
  } catch (error) {
    console.error("Error loading media from server:", error);
    // 如果服务器加载失败，尝试从本地加载
    loadFromLocalStorage();
  }
}

// 显示媒体内容
function displayMedia(media) {
  const photoGrid = document.getElementById("photoGrid");
  photoGrid.innerHTML = ""; // 清空现有内容

  media.forEach((item) => {
    const card = document.createElement("div");
    card.className = `photo-card${item.type === "video" ? " video-card" : ""}`;

    card.innerHTML = `
      <div class="photo-header">
        <span class="date">${item.date}</span>
        <div class="photo-actions">
          <button class="edit-btn" onclick="${
            item.type === "video" ? "editVideo" : "editPhoto"
          }(this.closest('.photo-card'))">✎</button>
          <button class="delete-btn" onclick="${
            item.type === "video" ? "deleteVideo" : "deletePhoto"
          }(this.closest('.photo-card'))">✕</button>
        </div>
      </div>
      ${
        item.type === "video"
          ? `<div class="video-container"><video src="${item.src}" controls></video></div>`
          : `<img src="${item.src}" alt="${item.title}" />`
      }
      <div class="photo-info">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    `;

    photoGrid.appendChild(card);
  });
}

// 备用的本地存储函数
function saveToLocalStorage() {
  const photoGrid = document.getElementById("photoGrid");
  const media = [];

  photoGrid.querySelectorAll(".photo-card").forEach((card) => {
    const isVideo = card.classList.contains("video-card");
    media.push({
      type: isVideo ? "video" : "photo",
      date: card.querySelector(".date").textContent,
      title: card.querySelector("h3").textContent,
      description: card.querySelector("p").textContent,
      src: isVideo
        ? card.querySelector("video").src
        : card.querySelector("img").src,
    });
  });

  localStorage.setItem("media", JSON.stringify(media));
}

// 从本地存储加载的备用函数
function loadFromLocalStorage() {
  const savedMedia = localStorage.getItem("media");
  if (savedMedia) {
    const media = JSON.parse(savedMedia);
    displayMedia(media);
  }
}

// 页面加载时读取数据
document.addEventListener("DOMContentLoaded", loadMedia);
