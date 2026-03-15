let transportadoraId = null;

// Inicializar
async function init() {
  const { data: { session } } = await window.supabase.auth.getSession();

  if (!session) {
    window.location.href = '/login.html';
    return;
  }

  document.getElementById('userEmail').textContent = session.user.email;

  // Buscar ID da transportadora
  const { data: transportadora } = await window.supabase
    .from('transportadoras')
    .select('id')
    .eq('user_id', session.user.id)
    .maybeSingle();

  if (!transportadora) {
    alert('Erro: Perfil de transportadora não encontrado');
    window.location.href = '/dashboard.html';
    return;
  }

  transportadoraId = transportadora.id;
  loadOfertas();
}

// Carregar ofertas
async function loadOfertas() {
  const { data: ofertas, error } = await window.supabase
    .from('ofertas_carga')
    .select('*')
    .eq('transportadora_id', transportadoraId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao carregar ofertas:', error);
    return;
  }

  const ofertasLista = document.getElementById('ofertasLista');

  if (!ofertas || ofertas.length === 0) {
    ofertasLista.innerHTML = '<p class="text-gray-500 col-span-full text-center py-8">Nenhuma oferta cadastrada. Clique em "Nova Oferta" para começar.</p>';
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

      <div class="space-y-2 text-sm text-gray-600 mb-4">
        <p><strong>Carregamento:</strong> ${new Date(oferta.data_carregamento).toLocaleDateString('pt-BR')} ${oferta.hora_carregamento ? `às ${oferta.hora_carregamento}` : ''}</p>
        <p><strong>Entrega:</strong> ${new Date(oferta.data_entrega).toLocaleDateString('pt-BR')} ${oferta.hora_entrega ? `às ${oferta.hora_entrega}` : ''}</p>
        <p><strong>Veículo:</strong> ${oferta.tipo_veiculo} - ${oferta.tipo_carroceria}</p>
        <p><strong>Carga:</strong> ${oferta.tipo_carga} - ${oferta.modelo_carga}</p>
        ${!oferta.frete_combinar && oferta.pedagio_incluso ? '<p class="text-green-600 text-xs">✓ Pedágio Incluso</p>' : ''}
        ${oferta.tipo_pagamento ? `<p class="text-xs"><strong>Pagamento:</strong> ${oferta.tipo_pagamento}</p>` : ''}
        ${oferta.fator_adiantamento ? `<p class="text-xs"><strong>Adiantamento:</strong> ${oferta.fator_adiantamento}</p>` : ''}
        <p class="text-xs text-gray-400">Criada em: ${new Date(oferta.created_at).toLocaleString('pt-BR')}</p>
      </div>

      <button onclick="deleteOferta('${oferta.id}')" class="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition text-sm">
        Excluir Oferta
      </button>
    </div>
  `).join('');
}

// Deletar oferta
async function deleteOferta(id) {
  if (!confirm('Tem certeza que deseja excluir esta oferta?')) return;

  const { error } = await window.supabase
    .from('ofertas_carga')
    .delete()
    .eq('id', id);

  if (error) {
    alert('Erro ao excluir oferta: ' + error.message);
    return;
  }

  alert('Oferta excluída com sucesso!');
  loadOfertas();
}

// Logout
async function handleLogout() {
  await window.supabase.auth.signOut();
  window.location.href = '/login.html';
}

// Inicializar
document.addEventListener('DOMContentLoaded', init);
