// Inicializar
async function init() {
  const { data: { session } } = await window.supabase.auth.getSession();

  if (!session) {
    window.location.href = '/login.html';
    return;
  }

  document.getElementById('userEmail').textContent = session.user.email;

  // Buscar tipo de usuário
  const { data: userData } = await window.supabase
    .from('users')
    .select('user_type')
    .eq('id', session.user.id)
    .maybeSingle();

  if (userData) {
    loadNavigation(userData.user_type);
  }

  loadOfertas();
}

// Carregar navegação
function loadNavigation(userType) {
  const nav = document.getElementById('navigation');
  let links = `<a href="dashboard.html" class="block px-4 py-3 rounded-lg hover:bg-gray-700 transition">Início</a>`;

  if (userType === 'motorista') {
    links += `
      <a href="veiculos.html" class="block px-4 py-3 rounded-lg hover:bg-gray-700 transition">Meus Veículos</a>
      <a href="ofertas-disponiveis.html" class="block px-4 py-3 rounded-lg bg-gray-700">Buscar Fretes</a>
    `;
  } else if (userType === 'agenciador') {
    links += `<a href="ofertas-disponiveis.html" class="block px-4 py-3 rounded-lg bg-gray-700">Ver Ofertas</a>`;
  }

  nav.innerHTML = links;
}

// Carregar ofertas
async function loadOfertas(filters = {}) {
  let query = window.supabase
    .from('ofertas_carga')
    .select(`
      *,
      transportadoras (
        razao_social
      )
    `)
    .order('created_at', { ascending: false });

  // Aplicar filtros
  if (filters.origemUF) {
    query = query.eq('origem_uf', filters.origemUF.toUpperCase());
  }
  if (filters.destinoUF) {
    query = query.eq('destino_uf', filters.destinoUF.toUpperCase());
  }
  if (filters.tipoVeiculo) {
    query = query.eq('tipo_veiculo', filters.tipoVeiculo);
  }

  const { data: ofertas, error } = await query;

  if (error) {
    console.error('Erro ao carregar ofertas:', error);
    return;
  }

  const ofertasLista = document.getElementById('ofertasLista');

  if (!ofertas || ofertas.length === 0) {
    ofertasLista.innerHTML = '<p class="text-gray-500 col-span-full text-center py-8">Nenhuma oferta encontrada com os filtros selecionados.</p>';
    return;
  }

  ofertasLista.innerHTML = ofertas.map(oferta => `
    <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
      <div class="flex justify-between items-start mb-4">
        <h4 class="text-lg font-bold text-navy">${oferta.origem_cidade}/${oferta.origem_uf} → ${oferta.destino_cidade}/${oferta.destino_uf}</h4>
        ${oferta.frete_combinar
          ? '<span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">A combinar</span>'
          : `<span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-semibold">R$ ${parseFloat(oferta.valor_ofertado).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>`
        }
      </div>

      <div class="space-y-2 text-sm text-gray-600">
        <p><strong>Transportadora:</strong> ${oferta.transportadoras?.razao_social || 'N/A'}</p>
        <p><strong>Carregamento:</strong> ${new Date(oferta.data_carregamento).toLocaleDateString('pt-BR')} ${oferta.hora_carregamento ? `às ${oferta.hora_carregamento}` : ''}</p>
        <p><strong>Entrega:</strong> ${new Date(oferta.data_entrega).toLocaleDateString('pt-BR')} ${oferta.hora_entrega ? `às ${oferta.hora_entrega}` : ''}</p>
        <p><strong>Veículo:</strong> ${oferta.tipo_veiculo} - ${oferta.tipo_carroceria}</p>
        <p><strong>Carga:</strong> ${oferta.tipo_carga} - ${oferta.modelo_carga}</p>
        ${!oferta.frete_combinar && oferta.pedagio_incluso ? '<p class="text-green-600 text-xs">✓ Pedágio Incluso</p>' : ''}
        ${oferta.tipo_pagamento ? `<p class="text-xs"><strong>Pagamento:</strong> ${oferta.tipo_pagamento}</p>` : ''}
        ${oferta.fator_adiantamento ? `<p class="text-xs"><strong>Adiantamento:</strong> ${oferta.fator_adiantamento}</p>` : ''}
      </div>

      <div class="mt-4">
        <button class="w-full bg-navy text-white py-2 rounded-lg hover:bg-blue-900 transition text-sm font-semibold">
          Demonstrar Interesse
        </button>
      </div>
    </div>
  `).join('');
}

// Aplicar filtros
function applyFilters() {
  const filters = {
    origemUF: document.getElementById('filtroOrigemUF').value,
    destinoUF: document.getElementById('filtroDestinoUF').value,
    tipoVeiculo: document.getElementById('filtroTipoVeiculo').value
  };

  loadOfertas(filters);
}

// Logout
async function handleLogout() {
  await window.supabase.auth.signOut();
  window.location.href = '/login.html';
}

// Inicializar
document.addEventListener('DOMContentLoaded', init);

// Máscaras para UF
['filtroOrigemUF', 'filtroDestinoUF'].forEach(id => {
  const input = document.getElementById(id);
  input.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
  });
});
