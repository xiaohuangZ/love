const API_BASE_URL = "http://localhost:3000/api";

// 日记相关 API
export const getDiaries = async () => {
  const response = await fetch(`${API_BASE_URL}/diaries`);
  return response.json();
};

export const saveDiary = async (diary) => {
  const response = await fetch(`${API_BASE_URL}/diaries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(diary),
  });
  return response.json();
};

// 照片和视频相关 API
export const getMedia = async () => {
  const response = await fetch(`${API_BASE_URL}/media`);
  return response.json();
};

export const saveMedia = async (media) => {
  const response = await fetch(`${API_BASE_URL}/media`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(media),
  });
  return response.json();
};

// 纪念日相关 API
export const getAnniversaries = async () => {
  const response = await fetch(`${API_BASE_URL}/anniversaries`);
  return response.json();
};

export const saveAnniversary = async (anniversary) => {
  const response = await fetch(`${API_BASE_URL}/anniversaries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(anniversary),
  });
  return response.json();
};

// 心愿相关 API
export const getWishes = async () => {
  const response = await fetch(`${API_BASE_URL}/wishes`);
  return response.json();
};

export const saveWish = async (wish) => {
  const response = await fetch(`${API_BASE_URL}/wishes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(wish),
  });
  return response.json();
};
