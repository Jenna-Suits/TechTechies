document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const { username, password } = e.target;
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    });
    if (res.ok) {
      window.location.href = '/home.html';
    } else {
      alert('Login failed');
    }
  });