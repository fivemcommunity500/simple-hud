const hud = document.getElementById('hud-container');

window.addEventListener('message', function(event) {
    if (event.data.action === "updateHUD") {
        document.getElementById('cash').innerText = event.data.cash.toLocaleString();
        document.getElementById('bank').innerText = event.data.bank.toLocaleString();
        document.getElementById('job').innerText = event.data.job;
        document.getElementById('grade').innerText = event.data.grade;
        document.getElementById('id').innerText = event.data.playerId;

        const blackBox = document.getElementById('black-container');
        if (event.data.black > 0) {
            blackBox.style.display = 'block';
            document.getElementById('black').innerText = event.data.black.toLocaleString();
        } else {
            blackBox.style.display = 'none';
        }
    }

    if (event.data.action === "toggleEdit") {
        if (event.data.active) {
            hud.classList.add('dragging');
            enableDrag(hud);
        } else {
            hud.classList.remove('dragging');
            hud.onmousedown = null;
        }
    }

    if (event.data.action === "notifyRefresh") {
        showNeonNotification("HUD REINICIADO CORRECTAMENTE");
    }
});

function showNeonNotification(text) {
    const container = document.getElementById('notification-container');
    const msg = document.createElement('div');
    msg.className = 'neon-msg';
    msg.innerText = text;
    container.appendChild(msg);
    setTimeout(() => { msg.remove(); }, 3000);
}

// Salir con ESC o ENTER
document.onkeydown = function (data) {
    if (data.key === "Escape" || data.key === "Enter") {
        fetch(`https://${GetParentResourceName()}/exitEditMode`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
    }
};

function enableDrag(el) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    el.onmousedown = dragMouseDown;
    function dragMouseDown(e) {
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";
        el.style.right = "auto";
    }
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}