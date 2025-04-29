const API = '/api';

document.addEventListener('DOMContentLoaded', () => {
  const p = location.pathname.split('/').pop().toLowerCase();

  if (p === '' || p === 'index.html') {
    // login page
    document.getElementById('loginForm')
            .addEventListener('submit', handleLogin);
  }
  else if (p === 'createaccount.html') {
    // registration page
    document.getElementById('registerForm')
            .addEventListener('submit', handleRegister);
  }
  else if (p === 'home.html') {
    // load posts
    loadPosts();
    document.getElementById('logoutBtn')
            ?.addEventListener('click', () => location.href = 'index.html');
  }
});

async function handleLogin(evt) {
  evt.preventDefault();
  const f = evt.target;
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      username: f.username.value.trim(),
      password: f.password.value
    })
  });
  if (res.ok) {
    location.href = 'Home.html';
  } else {
    const { error } = await res.json();
    alert(error || 'Login failed');
  }
}

async function handleRegister(evt) {
  evt.preventDefault();
  const f = evt.target;
  const res = await fetch(`${API}/register`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      accountID:   f.accountID.value.trim(),
      password:    f.password.value,
      email:       f.email.value.trim(),
      phoneNumber: f.phoneNumber.value.trim()
    })
  });
  if (res.ok) {
    alert('Account created!');
    location.href = 'index.html';
  } else {
    const { error } = await res.json();
    alert(error || 'Registration failed');
  }
}

async function loadPosts() {
  const container = document.getElementById('postsContainer');
  const res = await fetch(`${API}/posts`);
  const posts = await res.json();
  container.innerHTML = '';
  for (let post of posts) {
    const card = document.createElement('div');
    card.className = 'post';
    card.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <small>By ${post.author}</small>
    `;
    container.appendChild(card);
  }
}
