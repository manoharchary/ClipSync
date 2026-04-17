function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
        view.classList.add('hidden');
    });
    
    if(tab === 'create') {
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
        document.getElementById('create-view').classList.remove('hidden');
        document.getElementById('create-view').classList.add('active');
    } else {
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
        document.getElementById('retrieve-view').classList.remove('hidden');
        document.getElementById('retrieve-view').classList.add('active');
    }
}

function showNotification(msg) {
    const notif = document.getElementById('notification');
    notif.textContent = msg;
    notif.classList.remove('hidden');
    setTimeout(() => {
        notif.classList.add('hidden');
    }, 3000);
}

document.getElementById('create-btn').addEventListener('click', async () => {
    const text = document.getElementById('clip-text').value;
    if (!text) {
        showNotification("Please enter some text!");
        return;
    }
    
    const btn = document.getElementById('create-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span style="opacity: 0.7">⏳ Generating...</span>`;
    
    try {
        const res = await fetch('/api/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const data = await res.json();
        
        if (res.ok) {
            document.getElementById('clip-code-display').textContent = data.code;
            document.getElementById('create-result').classList.remove('hidden');
            document.getElementById('clip-text').value = '';
        } else {
            showNotification(data.error || 'Server Error');
        }
    } catch (err) {
        showNotification('Failed to connect to server');
    }
    
    btn.innerHTML = originalText;
});

document.getElementById('retrieve-btn').addEventListener('click', async () => {
    const code = document.getElementById('retrieve-code').value.trim();
    if (!code) {
        showNotification("Please enter a code!");
        return;
    }
    
    const btn = document.getElementById('retrieve-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span style="opacity: 0.7">⏳ Fetching...</span>`;
    
    try {
        const res = await fetch(`/api/clip/${code}`);
        const data = await res.json();
        
        if (res.ok) {
            document.getElementById('retrieved-text').value = data.text;
            document.getElementById('retrieve-result').classList.remove('hidden');
        } else {
            showNotification(data.error || 'Clip not found');
            document.getElementById('retrieve-result').classList.add('hidden');
        }
    } catch (err) {
        showNotification('Failed to connect to server');
    }
    
    btn.innerHTML = originalText;
});

function copyCode() {
    const code = document.getElementById('clip-code-display').textContent;
    navigator.clipboard.writeText(code);
    showNotification("Code copied! ✨");
}

function copyLink() {
    const code = document.getElementById('clip-code-display').textContent;
    const link = window.location.origin + "/?c=" + code;
    navigator.clipboard.writeText(link);
    showNotification("Shareable Link copied! 🔗");
}

function copyRetrieved() {
    const text = document.getElementById('retrieved-text').value;
    navigator.clipboard.writeText(text);
    showNotification("Text copied! ✅");
}

window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('c');
    if (code) {
        switchTab('retrieve');
        document.getElementById('retrieve-code').value = code;
        document.getElementById('retrieve-btn').click();
    }
});
