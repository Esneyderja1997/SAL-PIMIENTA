// Datos iniciales por defecto
const DEFAULT_MENU = {
    description: "Disfruta nuestro menú del día con deliciosos contornos y proteínas a elegir.",
    contornos: ["ARROZ", "PAPAS", "ENSALADA"],
    items: [
        { proteina: "Pollo", precio: 12000 },
        { proteina: "Carne", precio: 14000 },
        { proteina: "Pescado", precio: 15000 }
    ]
};
const PASSWORD = "Qwer0987"; // Cambia esta contraseña si lo deseas

function getMenuData() {
    const data = localStorage.getItem('menuData');
    return data ? JSON.parse(data) : DEFAULT_MENU;
}

function setMenuData(data) {
    localStorage.setItem('menuData', JSON.stringify(data));
}

// Aplicar imagen de fondo si existe
document.addEventListener('DOMContentLoaded', function() {
    const bgUrl = localStorage.getItem('bgImage');
    if(bgUrl) {
        document.body.style.backgroundImage = 'url(' + bgUrl + ')';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
    }
});
// Mostrar menú en index.html
if (document.getElementById('menu-description')) {
    const menu = getMenuData();
    document.getElementById('menu-description').textContent = menu.description;
    // Mostrar contornos
    if (menu.contornos && Array.isArray(menu.contornos)) {
        document.getElementById('contornos-list').textContent = 'Contornos: ' + menu.contornos.map(c => c.toUpperCase()).join(', ');
    } else {
        document.getElementById('contornos-list').textContent = '';
    }
    // Tabla de proteínas y precios
    const tbody = document.querySelector('#menu-table tbody');
    tbody.innerHTML = '';
    menu.items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${item.proteina}</td><td>${item.precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</td>`;
        tbody.appendChild(tr);
    });
}

// Admin (edición)
if (document.getElementById('login-form')) {
    const loginForm = document.getElementById('login-form');
    const editForm = document.getElementById('edit-form');
    const descInput = document.getElementById('desc');
    const contornosInput = document.getElementById('contornos');
    const tableBody = document.querySelector('#edit-menu-table tbody');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const pass = document.getElementById('password').value;
        if (pass === PASSWORD) {
            loginForm.style.display = 'none';
            editForm.style.display = 'block';
            loadEditTable();
        } else {
            alert('Contraseña incorrecta');
        }
    });

    function loadEditTable() {
        const menu = getMenuData();
        descInput.value = menu.description;
        contornosInput.value = (menu.contornos || []).join(', ');
        tableBody.innerHTML = '';
        menu.items.forEach((item, idx) => {
            addRow(item, idx);
        });
    }

    function addRow(item = {proteina:'', precio:0}, idx) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" value="${item.proteina}" required></td>
            <td><input type="number" value="${item.precio}" min="0" required></td>
            <td><button type="button" class="delete-row">Eliminar</button></td>
        `;
        tr.querySelector('.delete-row').onclick = () => {
            tr.remove();
        };
        tableBody.appendChild(tr);
    }

    document.getElementById('add-row').onclick = () => addRow();

    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newDesc = descInput.value;
        // Procesar contornos
        let contornosArr = contornosInput.value.split(',').map(c => c.trim().toUpperCase()).filter(Boolean);
        if (!contornosArr.length) {
            alert('Por favor, ingresa al menos un contorno.');
            return;
        }
        // Procesar proteínas y precios
        const rows = tableBody.querySelectorAll('tr');
        const items = [];
        let valid = true;
        rows.forEach(row => {
            const inputs = row.querySelectorAll('input');
            const proteina = inputs[0].value.trim();
            const precio = parseInt(inputs[1].value, 10);
            if (!proteina || isNaN(precio)) valid = false;
            items.push({ proteina, precio });
        });
        if (!valid) {
            alert('Por favor, completa todos los campos correctamente.');
            return;
        }
        setMenuData({ description: newDesc, contornos: contornosArr, items });
        alert('¡Menú actualizado!');
        window.location.href = 'index.html';
    });
}
