// API client for interacting with the Express backend
const API_BASE = ''; // Relies on Vite's dev server proxy to point to http://localhost:5000

const getAuthHeader = () => {
  const token = localStorage.getItem('vizball_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...getAuthHeader(),
});

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = 'Une erreur est survenue';
    try {
      const data = await response.json();
      errorMessage = data.error || errorMessage;
    } catch (e) {
      // JSON parsing failed, use status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  if (response.status === 204) return null;
  return response.json();
};

export const api = {
  // Auth
  auth: {
    login: async (username, password) => {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ username, password }),
      });
      const data = await handleResponse(res);
      if (data.token) {
        localStorage.setItem('vizball_auth_token', data.token);
      }
      return data;
    },
    me: async () => {
      const token = localStorage.getItem('vizball_auth_token');
      if (!token) return null;
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    register: async (username, password, email) => {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ username, password, email }),
      });
      const data = await handleResponse(res);
      if (data.token) {
        localStorage.setItem('vizball_auth_token', data.token);
      }
      return data;
    },
    logout: () => {
      localStorage.removeItem('vizball_auth_token');
    },
  },

  // Articles / News
  articles: {
    list: async () => {
      const res = await fetch(`${API_BASE}/api/articles`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    get: async (id) => {
      const res = await fetch(`${API_BASE}/api/articles/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (article) => {
      const res = await fetch(`${API_BASE}/api/articles`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(article),
      });
      return handleResponse(res);
    },
    update: async (id, article) => {
      const res = await fetch(`${API_BASE}/api/articles/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(article),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE}/api/articles/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    trackView: async (id) => {
      const res = await fetch(`${API_BASE}/api/articles/${id}/view`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    rate: async (id, value) => {
      const res = await fetch(`${API_BASE}/api/articles/${id}/rate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ value }),
      });
      return handleResponse(res);
    },
  },

  // Forum
  forum: {
    listTopics: async () => {
      const res = await fetch(`${API_BASE}/api/forum/topics`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getTopic: async (id) => {
      const res = await fetch(`${API_BASE}/api/forum/topics/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    createTopic: async (topic) => {
      const res = await fetch(`${API_BASE}/api/forum/topics`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(topic),
      });
      return handleResponse(res);
    },
    getReplies: async (topicId) => {
      const res = await fetch(`${API_BASE}/api/forum/topics/${topicId}/replies`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    createReply: async (topicId, reply) => {
      const res = await fetch(`${API_BASE}/api/forum/topics/${topicId}/replies`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(reply),
      });
      return handleResponse(res);
    },
    updateTopic: async (id, updates) => {
      const res = await fetch(`${API_BASE}/api/forum/topics/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      return handleResponse(res);
    },
    deleteTopic: async (id) => {
      const res = await fetch(`${API_BASE}/api/forum/topics/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Products
  products: {
    list: async () => {
      const res = await fetch(`${API_BASE}/api/products`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (product) => {
      const res = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(product),
      });
      return handleResponse(res);
    },
    update: async (id, product) => {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(product),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Clubs
  clubs: {
    list: async () => {
      const res = await fetch(`${API_BASE}/api/clubs`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (club) => {
      const res = await fetch(`${API_BASE}/api/clubs`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(club),
      });
      return handleResponse(res);
    },
    update: async (id, club) => {
      const res = await fetch(`${API_BASE}/api/clubs/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(club),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE}/api/clubs/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Events
  events: {
    list: async () => {
      const res = await fetch(`${API_BASE}/api/events`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (event) => {
      const res = await fetch(`${API_BASE}/api/events`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(event),
      });
      return handleResponse(res);
    },
    update: async (id, event) => {
      const res = await fetch(`${API_BASE}/api/events/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(event),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE}/api/events/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Visitors
  visitors: {
    get: async () => {
      const res = await fetch(`${API_BASE}/api/visitors`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    track: async () => {
      const res = await fetch(`${API_BASE}/api/visitors`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Tutorials / videos
  tutorials: {
    list: async () => {
      const res = await fetch(`${API_BASE}/api/tutorials`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (tutorial) => {
      const res = await fetch(`${API_BASE}/api/tutorials`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(tutorial),
      });
      return handleResponse(res);
    },
    update: async (id, tutorial) => {
      const res = await fetch(`${API_BASE}/api/tutorials/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(tutorial),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE}/api/tutorials/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    trackView: async (id) => {
      const res = await fetch(`${API_BASE}/api/tutorials/${id}/view`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    rate: async (id, value) => {
      const res = await fetch(`${API_BASE}/api/tutorials/${id}/rate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ value }),
      });
      return handleResponse(res);
    },
  },

  // Governance documents
  governanceDocuments: {
    list: async () => {
      const res = await fetch(`${API_BASE}/api/governance-documents`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (doc) => {
      const res = await fetch(`${API_BASE}/api/governance-documents`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(doc),
      });
      return handleResponse(res);
    },
    update: async (id, doc) => {
      const res = await fetch(`${API_BASE}/api/governance-documents/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(doc),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE}/api/governance-documents/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Team members
  teamMembers: {
    list: async () => {
      const res = await fetch(`${API_BASE}/api/team-members`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (member) => {
      const res = await fetch(`${API_BASE}/api/team-members`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(member),
      });
      return handleResponse(res);
    },
    update: async (id, member) => {
      const res = await fetch(`${API_BASE}/api/team-members/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(member),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE}/api/team-members/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Gallery photos
  gallery: {
    list: async () => {
      const res = await fetch(`${API_BASE}/api/gallery`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (photo) => {
      const res = await fetch(`${API_BASE}/api/gallery`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(photo),
      });
      return handleResponse(res);
    },
    update: async (id, photo) => {
      const res = await fetch(`${API_BASE}/api/gallery/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(photo),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE}/api/gallery/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // File uploads (admin only)
  uploads: {
    upload: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/api/uploads`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: formData,
      });
      return handleResponse(res);
    },
    resolveImageUrl: async (url) => {
      const res = await fetch(`${API_BASE}/api/uploads/resolve-image-url`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ url }),
      });
      return handleResponse(res);
    },
  },
};
