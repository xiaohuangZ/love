// 切换纪念日表单显示/隐藏
function toggleAnniversaryForm() {
  const form = document.getElementById("anniversaryForm");
  form.classList.toggle("hidden");

  if (form.classList.contains("hidden")) {
    form.reset();
    delete form.cardToEdit;
  }
}

// 计算倒计时天数
function calculateCountdown(date, type) {
  const today = new Date();
  const eventDate = new Date(date);

  let nextDate = new Date(eventDate);

  switch (type) {
    case "yearly":
      // 设置为今年的日期
      nextDate.setFullYear(today.getFullYear());
      // 如果今年的日期已过，设置为明年
      if (nextDate < today) {
        nextDate.setFullYear(today.getFullYear() + 1);
      }
      break;
    case "monthly":
      // 设置为本月的日期
      nextDate.setMonth(today.getMonth());
      nextDate.setFullYear(today.getFullYear());
      // 如果本月的日期已过，设置为下月
      if (nextDate < today) {
        nextDate.setMonth(today.getMonth() + 1);
      }
      break;
    case "oneTime":
      // 一次性纪念日，如果日期已过返回负数
      if (nextDate < today) {
        return {
          days: -Math.ceil((today - nextDate) / (1000 * 60 * 60 * 24)),
          text: "",
        };
      }
      break;
  }

  const diffTime = nextDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    days: diffDays,
    text: diffDays === 0 ? "今天" : "",
  };
}

// 更新所有倒计时显示
function updateAllCountdowns() {
  const cards = document.querySelectorAll(".anniversary-card");
  cards.forEach((card) => {
    const type = card.dataset.type;
    const date = card.dataset.date;
    const countdown = calculateCountdown(date, type);

    const countdownNumber = card.querySelector(".countdown-number");
    const countdownText = card.querySelector(".countdown-text");

    countdownNumber.textContent = Math.abs(countdown.days);
    countdownText.textContent = countdown.text;

    // 如果是今天，添加特殊样式
    if (countdown.days === 0) {
      card.classList.add("today");
    } else {
      card.classList.remove("today");
    }
  });
}

// 处理表单提交
document
  .getElementById("anniversaryForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("eventTitle").value;
    const date = document.getElementById("eventDate").value;
    const type = document.getElementById("eventType").value;
    const description = document.getElementById("eventDescription").value;

    if (this.cardToEdit) {
      // 更新现有纪念日
      updateAnniversaryCard(this.cardToEdit, title, date, type, description);
      delete this.cardToEdit;
    } else {
      // 创建新的纪念日卡片
      createAnniversaryCard(title, date, type, description);
    }

    // 重置并隐藏表单
    this.reset();
    toggleAnniversaryForm();

    // 保存数据
    saveAnniversaries();
  });

// 创建纪念日卡片
function createAnniversaryCard(title, date, type, description) {
  const card = document.createElement("div");
  card.className = "anniversary-card";
  card.dataset.type = type;
  card.dataset.date = date;

  const typeText = {
    oneTime: "🎯 一次性",
    yearly: "💑 每年",
    monthly: "💕 每月",
  }[type];

  const countdown = calculateCountdown(date, type);

  card.innerHTML = `
    <div class="anniversary-header">
      <div class="anniversary-type">${typeText}纪念</div>
      <div class="anniversary-actions">
        <button class="edit-btn" onclick="editAnniversary(this.closest('.anniversary-card'))">✎</button>
        <button class="delete-btn" onclick="deleteAnniversary(this.closest('.anniversary-card'))">✕</button>
      </div>
    </div>
    <h3>${title}</h3>
    <div class="countdown">
      <div class="countdown-number">${Math.abs(countdown.days)}</div>
      <div class="countdown-text">天</div>
    </div>
    <p class="anniversary-date">${formatDate(date)}</p>
    <p class="anniversary-desc">${description}</p>
  `;

  const list = document.getElementById("anniversaryList");
  list.insertBefore(card, list.firstChild);
}

// 更新纪念日卡片
function updateAnniversaryCard(card, title, date, type, description) {
  card.dataset.type = type;
  card.dataset.date = date;

  const typeText = {
    oneTime: "🎯 一次性",
    yearly: "💑 每年",
    monthly: "💕 每月",
  }[type];

  const countdown = calculateCountdown(date, type);

  card.innerHTML = `
    <div class="anniversary-header">
      <div class="anniversary-type">${typeText}纪念</div>
      <div class="anniversary-actions">
        <button class="edit-btn" onclick="editAnniversary(this.closest('.anniversary-card'))">✎</button>
        <button class="delete-btn" onclick="deleteAnniversary(this.closest('.anniversary-card'))">✕</button>
      </div>
    </div>
    <h3>${title}</h3>
    <div class="countdown">
      <div class="countdown-number">${Math.abs(countdown.days)}</div>
      <div class="countdown-text">天</div>
    </div>
    <p class="anniversary-date">${formatDate(date)}</p>
    <p class="anniversary-desc">${description}</p>
  `;
}

// 保存纪念日数据
function saveAnniversaries() {
  const anniversaryList = document.getElementById("anniversaryList");
  const anniversaries = [];

  anniversaryList.querySelectorAll(".anniversary-card").forEach((card) => {
    anniversaries.push({
      title: card.querySelector("h3").textContent,
      date: card.dataset.date,
      type: card.dataset.type,
      description: card.querySelector(".anniversary-desc").textContent,
    });
  });

  localStorage.setItem("anniversaries", JSON.stringify(anniversaries));
}

// 加载纪念日数据
function loadAnniversaries() {
  const savedAnniversaries = localStorage.getItem("anniversaries");
  if (!savedAnniversaries) return; // 如果没有保存的数据，直接返回

  const anniversaries = JSON.parse(savedAnniversaries);
  const anniversaryList = document.getElementById("anniversaryList");
  anniversaryList.innerHTML = ""; // 清空现有内容

  anniversaries.forEach((anniversary) => {
    createAnniversaryCard(
      anniversary.title,
      anniversary.date,
      anniversary.type,
      anniversary.description
    );
  });
}

// 编辑纪念日
function editAnniversary(card) {
  const form = document.getElementById("anniversaryForm");

  // 填充表单
  form.querySelector("#eventTitle").value =
    card.querySelector("h3").textContent;
  form.querySelector("#eventType").value = card.dataset.type;
  form.querySelector("#eventDate").value = card.dataset.date;
  form.querySelector("#eventDescription").value =
    card.querySelector(".anniversary-desc").textContent;

  // 显示表单
  form.classList.remove("hidden");
  form.scrollIntoView({ behavior: "smooth" });

  // 存储要编辑的卡片引用
  form.cardToEdit = card;
}

// 删除纪念日
function deleteAnniversary(card) {
  if (confirm("确定要删除这个纪念日吗？💔")) {
    card.style.transition = "all 0.3s ease";
    card.style.opacity = "0";
    card.style.transform = "scale(0.8)";

    setTimeout(() => {
      card.remove();
      saveAnniversaries();
    }, 300);
  }
}

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

// 每小时更新倒计时
setInterval(updateAllCountdowns, 1000 * 60 * 60);

// 页面加载时读取数据和更新倒计时
document.addEventListener("DOMContentLoaded", () => {
  loadAnniversaries();
  updateAllCountdowns();
});
