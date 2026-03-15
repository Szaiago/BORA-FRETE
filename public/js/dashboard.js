// Verificar autenticação e carregar dashboard
async function init() {
  const { data: { session } } = await window.supabase.auth.getSession();

  if (!session) {
    window.location.href = '/login.html';
    return;
  }

  const user = session.user;
  document.getElementById('userEmail').textContent = user.email;

  // Buscar tipo de usuário
  const { data: userData } = await window.supabase
    .from('users')
    .select('user_type')
    .eq('id', user.id)
    .maybeSingle();

  if (!userData) {
    await window.supabase.auth.signOut();
    window.location.href = '/login.html';
    return;
  }

  const userType = userData.user_type;
  loadNavigation(userType);
  loadWelcomeMessage(userType);
  loadOfertas();
}

// Carregar navegação baseada no tipo de usuário
function loadNavigation(userType) {
  const nav = document.getElementById('navigation');
  let links = `
    <a href="dashboard.html" class="block px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
      Início
    </a>
  `;

  if (userType === 'transportadora') {
    links += `
      <a href="ofertas-carga.html" class="block px-4 py-3 rounded-lg hover:bg-gray-700 transition">
        Criar Oferta de Carga
      </a>
      <a href="minhas-ofertas.html" class="block px-4 py-3 rounded-lg hover:bg-gray-700 transition">
        Minhas Ofertas
      </a>
    `;
  } else if (userType === 'motorista') {
    links += `
      <a href="veiculos.html" class="block px-4 py-3 rounded-lg hover:bg-gray-700 transition">
        Meus Veículos
      </a>
      <a href="ofertas-disponiveis.html" class="block px-4 py-3 rounded-lg hover:bg-gray-700 transition">
        Buscar Fretes
      </a>
    `;
  } else if (userType === 'agenciador') {
    links += `
      <a href="ofertas-disponiveis.html" class="block px-4 py-3 rounded-lg hover:bg-gray-700 transition">
        Ver Ofertas
      </a>
    `;
  }

  nav.innerHTML = links;
}

// Carregar mensagem de boas-vindas
function loadWelcomeMessage(userType) {
  const messages = {
    'transportadora': 'Gerencie suas ofertas de carga e encontre motoristas qualificados',
    'motorista': 'Encontre fretes disponíveis e gerencie seus veículos',
    'agenciador': 'Conecte transportadoras e motoristas'
  };

  document.getElementById('welcomeMessage').textContent = messages[userType] || 'Bem-vindo ao sistema';
}

// Carregar ofertas de carga
async function loadOfertas() {
  const { data: ofertas, error } = await window.supabase
    .from('ofertas_carga')
    .select(`
      *,
      transportadoras (
        razao_social
      )
    `)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Erro ao carregar ofertas:', error);
    return;
  }

  const ofertasLista = document.getElementById('ofertasLista');

  if (!ofertas || ofertas.length === 0) {
    ofertasLista.innerHTML = '<p class="text-gray-500 col-span-full text-center py-8">Nenhuma oferta disponível no momento</p>';
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
        <p><strong>Carregamento:</strong> ${new Date(oferta.data_carregamento).toLocaleDateString('pt-BR')}</p>
        <p><strong>Entrega:</strong> ${new Date(oferta.data_entrega).toLocaleDateString('pt-BR')}</p>
        <p><strong>Veículo:</strong> ${oferta.tipo_veiculo} - ${oferta.tipo_carroceria}</p>
        <p><strong>Carga:</strong> ${oferta.tipo_carga} - ${oferta.modelo_carga}</p>
        ${!oferta.frete_combinar && oferta.pedagio_incluso ? '<p class="text-green-600 text-xs">✓ Pedágio Incluso</p>' : ''}
      </div>

      <div class="mt-4">
        <button class="w-full bg-navy text-white py-2 rounded-lg hover:bg-blue-900 transition text-sm font-semibold">
          Ver Detalhes
        </button>
      </div>
    </div>
  `).join('');
}

// Logout
async function handleLogout() {
  await window.supabase.auth.signOut();
  window.location.href = '/login.html';
}

// Inicializar
document.addEventListener('DOMContentLoaded', init);
