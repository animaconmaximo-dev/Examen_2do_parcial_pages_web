// Datos iniciales de ejemplo (puedes incluir personajes propios aquí para los puntos extra)
let characters = JSON.parse(localStorage.getItem('characters')) || [
    {
        id: 1,
        name: "Tracer",
        role: "Daño / Ofensivo",
        image: "https://images.blizzard.lat/content/services/3/a0cf2cd5a0cbb868351b689aa6c38a3c-Tracer-portrait.png",
        description: "Una aventurera en el tiempo y antigua agente de Overwatch con un acelerador cronológico."
    },
    {
        id: 2,
        name: "Zenyatta",
        role: "Apoyo",
        image: "https://images.blizzard.lat/content/services/3/e288e2cb25d36e7ee96c21327170a41d-Zenyatta-portrait.png",
        description: "Un ómnico errante que busca la armonía espiritual entre humanos y máquinas."
    },
    {
        id: 3,
        name: "Astra (Creación Propia)",
        role: "Guerrera Estelar",
        image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=60",
        description: "Personaje original creado para este universo, capaz de manipular la gravedad mediante cristales cósmicos."
    }
];

// Guardar en localStorage
function saveToLocalStorage() {
    localStorage.setItem('characters', JSON.stringify(characters));
}

// Renderizar la cuadrícula de personajes
function renderCharacters(filter = "") {
    const grid = document.getElementById('characterGrid');
    grid.innerHTML = "";

    const filtered = characters.filter(c => 
        c.name.toLowerCase().includes(filter.toLowerCase()) || 
        c.role.toLowerCase().includes(filter.toLowerCase())
    );

    if (filtered.length === 0) {
        grid.innerHTML = `<p class="col-span-full text-center text-slate-400 py-8">No se encontraron personajes.</p>`;
        return;
    }

    filtered.forEach(char => {
        const card = document.createElement('div');
        card.className = "bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg hover:border-indigo-500 transition duration-300 flex flex-col justify-between";
        
        card.innerHTML = `
            <div>
                <img src="${char.image}" alt="${char.name}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <span class="text-xs font-semibold px-2.5 py-1 bg-indigo-900 text-indigo-200 rounded-full">${char.role}</span>
                    <h3 class="text-xl font-bold mt-2 text-white">${char.name}</h3>
                    <p class="text-slate-400 text-sm mt-1 line-clamp-2">${char.description}</p>
                </div>
            </div>
            <div class="p-4 pt-0 flex gap-2">
                <button onclick="viewDetail(${char.id})" class="flex-1 bg-slate-700 hover:bg-slate-600 text-sm py-1.5 rounded font-medium transition">Ver más</button>
                <button onclick="editCharacter(${char.id})" class="bg-amber-600/80 hover:bg-amber-600 text-sm px-3 py-1.5 rounded font-medium transition">Editar</button>
                <button onclick="deleteCharacter(${char.id})" class="bg-rose-600/80 hover:bg-rose-600 text-sm px-3 py-1.5 rounded font-medium transition">Eliminar</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Buscador en tiempo real
document.getElementById('searchInput').addEventListener('input', (e) => {
    renderCharacters(e.target.value);
});

// Modales
function openModal(isEdit = false) {
    document.getElementById('characterModal').classList.remove('hidden');
    if (!isEdit) {
        document.getElementById('modalTitle').innerText = "Nuevo Personaje";
        document.getElementById('characterForm').reset();
        document.getElementById('charId').value = "";
    }
}

function closeModal() {
    document.getElementById('characterModal').classList.add('hidden');
}

// Guardar (Crear o Editar)
function saveCharacter(e) {
    e.preventDefault();
    const id = document.getElementById('charId').value;
    const name = document.getElementById('charName').value;
    const role = document.getElementById('charRole').value;
    const image = document.getElementById('charImage').value;
    const description = document.getElementById('charDesc').value;

    if (id) {
        // Editar
        characters = characters.map(c => c.id == id ? { id: Number(id), name, role, image, description } : c);
    } else {
        // Crear
        const newChar = {
            id: Date.now(),
            name,
            role,
            image,
            description
        };
        characters.push(newChar);
    }

    saveToLocalStorage();
    renderCharacters();
    closeModal();
}

// Cargar datos para Editar
function editCharacter(id) {
    const char = characters.find(c => c.id === id);
    if (!char) return;

    document.getElementById('charId').value = char.id;
    document.getElementById('charName').value = char.name;
    document.getElementById('charRole').value = char.role;
    document.getElementById('charImage').value = char.image;
    document.getElementById('charDesc').value = char.description;

    document.getElementById('modalTitle').innerText = "Editar Personaje";
    openModal(true);
}

// Eliminar personaje
function deleteCharacter(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este personaje?")) {
        characters = characters.filter(c => c.id !== id);
        saveToLocalStorage();
        renderCharacters();
    }
}

// Ver detalles en un modal
function viewDetail(id) {
    const char = characters.find(c => c.id === id);
    if (!char) return;

    const container = document.getElementById('detailContent');
    container.innerHTML = `
        <img src="${char.image}" alt="${char.name}" class="w-full h-64 object-cover rounded-lg mb-4">
        <span class="text-xs font-semibold px-2.5 py-1 bg-indigo-900 text-indigo-200 rounded-full">${char.role}</span>
        <h2 class="text-2xl font-bold mt-2 text-white">${char.name}</h2>
        <p class="text-slate-300 mt-3 leading-relaxed">${char.description}</p>
    `;
    document.getElementById('detailModal').classList.remove('hidden');
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.add('hidden');
}

// Inicializar la aplicación al cargar la página
renderCharacters();