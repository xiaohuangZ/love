// 存储标签的数组
let currentTags = [];

// 切换表单显示/隐藏
function toggleForm() {
  const form = document.getElementById("diaryForm");
  const searchForm = document.getElementById("searchForm");
  const submitBtn = form.querySelector('button[type="submit"]');

  // 如果搜索表单是打开的，先关闭它
  if (!searchForm.classList.contains("hidden")) {
    searchForm.classList.add("hidden");
    clearSearch();
    clearDates();
  }

  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    form.scrollIntoView({ behavior: "smooth" });
  } else {
    form.classList.add("hidden");
    // 重置编辑状态
    currentEditingEntry = null;
    submitBtn.textContent = "保存 💝";
    submitBtn.classList.remove("update-mode");
    // 清空表单
    form.reset();
    currentTags = [];
    updateTagsDisplay();
  }
}

// 处理标签输入
document.getElementById("tagInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    const tagValue = this.value.trim();
    if (tagValue && !currentTags.includes(tagValue)) {
      currentTags.push(tagValue);
      updateTagsDisplay();
    }
    this.value = "";
  }
});

// 更新标签显示
function updateTagsDisplay() {
  const tagsContainer = document.getElementById("selectedTags");
  tagsContainer.innerHTML = currentTags
    .map(
      (tag) => `
        <span class="tag">
            ${tag}
            <span onclick="removeTag('${tag}')" style="cursor:pointer;margin-left:5px;">×</span>
        </span>
    `
    )
    .join("");
}

// 移除标签
function removeTag(tag) {
  currentTags = currentTags.filter((t) => t !== tag);
  updateTagsDisplay();
}

// 处理表单提交
document.getElementById("diaryForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const date = document.getElementById("diaryDate").value;
  const title = document.getElementById("diaryTitle").value;
  const content = document.getElementById("diaryContent").value;

  // 创建新的日记条目
  const diaryEntry = document.createElement("div");
  diaryEntry.className = "diary-entry";
  diaryEntry.innerHTML = `
        <div class="date">${formatDate(date)}</div>
        <h2>${title}</h2>
        <p>${content}</p>
        <div class="tags">
            ${currentTags
              .map((tag) => `<span class="tag">${tag}</span>`)
              .join("")}
        </div>
    `;

  // 将新日记添加到列表开头
  const diaryList = document.getElementById("diaryList");
  diaryList.insertBefore(diaryEntry, diaryList.firstChild);

  // 重置表单
  this.reset();
  currentTags = [];
  updateTagsDisplay();
  toggleForm();

  // 在添加或更新日记后保存
  saveDiaries();
});

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

let currentEditingEntry = null;

// 编辑日记
function editDiary(diaryEntry) {
  currentEditingEntry = diaryEntry;

  // 获取当前日记的内容
  const dateText = diaryEntry.querySelector(".date").textContent;
  const title = diaryEntry.querySelector("h2").textContent;
  const content = diaryEntry.querySelector("p").textContent;
  const tags = Array.from(diaryEntry.querySelectorAll(".tag")).map((tag) =>
    tag.textContent.trim()
  );

  // 将日期转换为 YYYY-MM-DD 格式
  const dateParts = dateText.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  const formattedDate = `${dateParts[1]}-${dateParts[2].padStart(
    2,
    "0"
  )}-${dateParts[3].padStart(2, "0")}`;

  // 填充表单
  const form = document.getElementById("diaryForm");
  form.querySelector("#diaryDate").value = formattedDate;
  form.querySelector("#diaryTitle").value = title;
  form.querySelector("#diaryContent").value = content;

  // 设置标签
  currentTags = tags;
  updateTagsDisplay();

  // 修改表单按钮
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.textContent = "更新 ✨";
  submitBtn.classList.add("update-mode");

  // 显示表单
  form.classList.remove("hidden");

  // 滚动到表单位置
  form.scrollIntoView({ behavior: "smooth" });
}

// 修改表单提交处理函数
document.getElementById("diaryForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const date = document.getElementById("diaryDate").value;
  const title = document.getElementById("diaryTitle").value;
  const content = document.getElementById("diaryContent").value;

  const diaryHTML = `
        <div class="diary-header">
            <div class="date">${formatDate(date)}</div>
            <div class="diary-actions">
                <button class="edit-btn" onclick="editDiary(this.closest('.diary-entry'))">✎</button>
                <button class="delete-btn" onclick="deleteDiary(this.closest('.diary-entry'))">✕</button>
            </div>
        </div>
        <h2>${title}</h2>
        <p>${content}</p>
        <div class="tags">
            ${currentTags
              .map((tag) => `<span class="tag">${tag}</span>`)
              .join("")}
        </div>
    `;

  if (currentEditingEntry) {
    // 更新现有日记
    currentEditingEntry.innerHTML = diaryHTML;
    currentEditingEntry = null;

    // 重置提交按钮
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.textContent = "保存 💝";
    submitBtn.classList.remove("update-mode");
  } else {
    // 创建新日记
    const diaryEntry = document.createElement("div");
    diaryEntry.className = "diary-entry";
    diaryEntry.innerHTML = diaryHTML;

    // 将新日记添加到列表开头
    const diaryList = document.getElementById("diaryList");
    diaryList.insertBefore(diaryEntry, diaryList.firstChild);
  }

  // 重置表单
  this.reset();
  currentTags = [];
  updateTagsDisplay();
  toggleForm();

  // 在添加或更新日记后保存
  saveDiaries();
});

// 删除日记
function deleteDiary(diaryEntry) {
  if (confirm("确定要删除这篇日记吗？💔")) {
    diaryEntry.style.transition = "all 0.3s ease";
    diaryEntry.style.opacity = "0";
    diaryEntry.style.transform = "scale(0.8)";

    setTimeout(() => {
      diaryEntry.remove();
      saveDiaries(); // 删除后保存
    }, 300);
  }
}

// 搜索日记
function searchDiaries() {
  const searchText = document.getElementById("searchInput").value.toLowerCase();
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const searchTitle = document.getElementById("searchTitle").checked;
  const searchContent = document.getElementById("searchContent").checked;
  const searchTags = document.getElementById("searchTags").checked;

  // 更新活动过滤器显示
  updateActiveFilters(searchText, startDate, endDate);

  const diaries = document.querySelectorAll(".diary-entry");
  let hasResults = false;

  diaries.forEach((diary) => {
    let match = false;
    const diaryDate = new Date(
      diary
        .querySelector(".date")
        .textContent.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/)
        .slice(1)
        .join("-")
    );

    // 检查日期范围
    const dateMatch =
      (!startDate || diaryDate >= new Date(startDate)) &&
      (!endDate || diaryDate <= new Date(endDate));

    if (!dateMatch) {
      diary.style.display = "none";
      return;
    }

    // 如果没有搜索文本，只考虑日期筛选
    if (!searchText) {
      diary.style.display = "block";
      hasResults = true;
      return;
    }

    // 搜索标题
    if (searchTitle) {
      const title = diary.querySelector("h2").textContent.toLowerCase();
      if (title.includes(searchText)) {
        match = true;
        highlightText(diary.querySelector("h2"), searchText);
      }
    }

    // 搜索内容
    if (searchContent) {
      const content = diary.querySelector("p").textContent.toLowerCase();
      if (content.includes(searchText)) {
        match = true;
        highlightText(diary.querySelector("p"), searchText);
      }
    }

    // 搜索标签
    if (searchTags) {
      const tags = Array.from(diary.querySelectorAll(".tag")).map((tag) =>
        tag.textContent.toLowerCase()
      );
      if (tags.some((tag) => tag.includes(searchText))) {
        match = true;
        diary.querySelectorAll(".tag").forEach((tag) => {
          if (tag.textContent.toLowerCase().includes(searchText)) {
            highlightText(tag, searchText);
          }
        });
      }
    }

    diary.style.display = match ? "block" : "none";
    if (match) hasResults = true;
  });

  // 显示无结果提示
  const noResults = document.querySelector(".no-results");
  if (!hasResults) {
    if (!noResults) {
      const message = document.createElement("div");
      message.className = "no-results";
      message.textContent = "没有找到符合条件的日记 💭";
      document.getElementById("diaryList").appendChild(message);
    }
  } else if (noResults) {
    noResults.remove();
  }
}

// 高亮搜索文本
function highlightText(element, searchText) {
  const originalText = element.textContent;
  const regex = new RegExp(searchText, "gi");
  element.innerHTML = originalText.replace(
    regex,
    (match) => `<span class="highlight">${match}</span>`
  );
}

// 更新活动过滤器显示
function updateActiveFilters(searchText, startDate, endDate) {
  const filtersContainer = document.getElementById("activeFilters");
  let filterHTML = "";

  if (searchText) {
    filterHTML += `
      <span class="filter-tag">
        搜索: ${searchText}
        <button onclick="clearSearch()">×</button>
      </span>
    `;
  }

  if (startDate || endDate) {
    filterHTML += `
      <span class="filter-tag">
        日期: ${startDate || "起始"} 至 ${endDate || "结束"}
        <button onclick="clearDates()">×</button>
      </span>
    `;
  }

  filtersContainer.innerHTML = filterHTML;
}

// 清除搜索
function clearSearch() {
  document.getElementById("searchInput").value = "";
  searchDiaries();
}

// 清除日期过滤器
function clearDates() {
  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value = "";
  searchDiaries();
}

// 在创建新日记和编辑日记后触发搜索更新
document.getElementById("diaryForm").addEventListener("submit", function () {
  setTimeout(searchDiaries, 0);
});

// 添加切换搜索表单的函数
function toggleSearch() {
  const searchForm = document.getElementById("searchForm");
  const diaryForm = document.getElementById("diaryForm");

  // 如果日记表单是打开的，先关闭它
  if (!diaryForm.classList.contains("hidden")) {
    toggleForm();
  }

  // 切换搜索表单的显示状态
  searchForm.classList.toggle("hidden");

  // 如果是打开搜索表单，滚动到表单位置
  if (!searchForm.classList.contains("hidden")) {
    searchForm.scrollIntoView({ behavior: "smooth" });
  } else {
    // 清除搜索结果
    clearSearch();
    clearDates();
  }
}

// 保存日记数据到 localStorage
function saveDiaries() {
  const diaryList = document.getElementById("diaryList");
  const diaries = [];

  diaryList.querySelectorAll(".diary-entry").forEach((entry) => {
    diaries.push({
      date: entry.querySelector(".date").textContent,
      title: entry.querySelector("h2").textContent,
      content: entry.querySelector("p").textContent,
      tags: Array.from(entry.querySelectorAll(".tag")).map(
        (tag) => tag.textContent
      ),
    });
  });

  localStorage.setItem("diaries", JSON.stringify(diaries));
}

// 从 localStorage 加载日记数据
function loadDiaries() {
  const savedDiaries = localStorage.getItem("diaries");
  if (!savedDiaries) return; // 如果没有保存的数据，直接返回

  const diaries = JSON.parse(savedDiaries);
  const diaryList = document.getElementById("diaryList");
  diaryList.innerHTML = ""; // 清空现有内容

  diaries.forEach((diary) => {
    const entry = document.createElement("div");
    entry.className = "diary-entry";

    entry.innerHTML = `
      <div class="diary-header">
        <div class="date">${diary.date}</div>
        <div class="diary-actions">
          <button class="edit-btn" onclick="editDiary(this.closest('.diary-entry'))">✎</button>
          <button class="delete-btn" onclick="deleteDiary(this.closest('.diary-entry'))">✕</button>
        </div>
      </div>
      <h2>${diary.title}</h2>
      <p>${diary.content}</p>
      <div class="tags">
        ${diary.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
      </div>
    `;

    diaryList.appendChild(entry);
  });
}

// 确保页面加载时读取数据
document.addEventListener("DOMContentLoaded", loadDiaries);
