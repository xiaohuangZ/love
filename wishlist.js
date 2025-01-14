// 切换心愿表单显示/隐藏
function toggleWishForm() {
  const form = document.getElementById("wishForm");
  form.classList.toggle("hidden");

  if (form.classList.contains("hidden")) {
    form.reset();
    delete form.wishToEdit;
  }
}

// 处理表单提交
document.getElementById("wishForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("wishTitle").value;
  const description = document.getElementById("wishDescription").value;
  const priority = document.getElementById("wishPriority").value;

  const priorityText = {
    high: "迫不及待 ✨",
    medium: "有机会就做 🌟",
    low: "以后再说 ⭐",
  }[priority];

  if (this.wishToEdit) {
    // 更新现有心愿
    updateWishCard(this.wishToEdit, title, description, priority, priorityText);
    delete this.wishToEdit;
  } else {
    // 创建新的心愿卡片
    createWishCard(title, description, priority, priorityText);
  }

  // 重置并隐藏表单
  this.reset();
  toggleWishForm();
  saveWishes();
});

// 创建心愿卡片
function createWishCard(title, description, priority, priorityText) {
  const wishCard = document.createElement("div");
  wishCard.className = "wish-card";
  wishCard.dataset.priority = priority;

  wishCard.innerHTML = `
    <div class="wish-header">
      <div class="wish-priority">${priorityText}</div>
      <div class="wish-actions">
        <button class="complete-btn" onclick="completeWish(this.closest('.wish-card'))">✓</button>
        <button class="edit-btn" onclick="editWish(this.closest('.wish-card'))">✎</button>
        <button class="delete-btn" onclick="deleteWish(this.closest('.wish-card'))">✕</button>
      </div>
    </div>
    <h3>${title}</h3>
    <p>${description}</p>
    <div class="wish-status">未完成</div>
  `;

  // 将新心愿添加到列表开头
  const wishList = document.getElementById("wishList");
  wishList.insertBefore(wishCard, wishList.firstChild);
}

// 更新心愿卡片
function updateWishCard(card, title, description, priority, priorityText) {
  card.dataset.priority = priority;
  card.querySelector(".wish-priority").textContent = priorityText;
  card.querySelector("h3").textContent = title;
  card.querySelector("p").textContent = description;
}

// 编辑心愿
function editWish(wishCard) {
  const form = document.getElementById("wishForm");

  // 填充表单
  form.querySelector("#wishTitle").value =
    wishCard.querySelector("h3").textContent;
  form.querySelector("#wishDescription").value =
    wishCard.querySelector("p").textContent;
  form.querySelector("#wishPriority").value = wishCard.dataset.priority;

  // 显示表单
  form.classList.remove("hidden");
  form.scrollIntoView({ behavior: "smooth" });

  // 存储要编辑的卡片引用
  form.wishToEdit = wishCard;
}

// 完成心愿
function completeWish(wishCard) {
  wishCard.classList.toggle("completed");
  const status = wishCard.querySelector(".wish-status");
  status.textContent = wishCard.classList.contains("completed")
    ? "已完成"
    : "未完成";
  saveWishes();
}

// 删除心愿
function deleteWish(wishCard) {
  if (confirm("确定要删除这个心愿吗？💔")) {
    wishCard.style.transition = "all 0.3s ease";
    wishCard.style.opacity = "0";
    wishCard.style.transform = "scale(0.8)";

    setTimeout(() => {
      wishCard.remove();
      saveWishes();
    }, 300);
  }
}

// 保存心愿数据
function saveWishes() {
  const wishList = document.getElementById("wishList");
  const wishes = [];

  wishList.querySelectorAll(".wish-card").forEach((card) => {
    wishes.push({
      priority: card.dataset.priority,
      priorityText: card.querySelector(".wish-priority").textContent,
      title: card.querySelector("h3").textContent,
      description: card.querySelector("p").textContent,
      completed: card.classList.contains("completed"),
    });
  });

  localStorage.setItem("wishes", JSON.stringify(wishes));
}

// 加载心愿数据
function loadWishes() {
  const wishes = JSON.parse(localStorage.getItem("wishes") || "[]");
  const wishList = document.getElementById("wishList");
  wishList.innerHTML = ""; // 清空现有内容

  wishes.forEach((wish) => {
    const card = document.createElement("div");
    card.className = `wish-card${wish.completed ? " completed" : ""}`;
    card.dataset.priority = wish.priority;

    card.innerHTML = `
      <div class="wish-header">
        <div class="wish-priority">${wish.priorityText}</div>
        <div class="wish-actions">
          <button class="complete-btn" onclick="completeWish(this.closest('.wish-card'))">✓</button>
          <button class="edit-btn" onclick="editWish(this.closest('.wish-card'))">✎</button>
          <button class="delete-btn" onclick="deleteWish(this.closest('.wish-card'))">✕</button>
        </div>
      </div>
      <h3>${wish.title}</h3>
      <p>${wish.description}</p>
      <div class="wish-status">${wish.completed ? "已完成" : "未完成"}</div>
    `;

    wishList.appendChild(card);
  });
}

// 页面加载时读取数据
document.addEventListener("DOMContentLoaded", loadWishes);
