let motoristaId = null;

// Inicializar
async function init() {
  const { data: { session } } = await window.supabase.auth.getSession();

  if (!session) {
    window.location.href = '/login.html';
    return;
  }

  document.getElementById('userEmail').textContent = session.user.email;

  // Buscar ID do motorista
  const { data: motorista } = await window.supabase
    .from('motoristas')
    .select('id')
    .eq('user_id', session.user.id)
    .maybeSingle();

  if (!motorista) {
    alert('Erro: Perfil de motorista não encontrado');
    return;
  }

  motoristaId = motorista.id;
  loadVeiculos();
}

// Mostrar/Ocultar formulário
function showAddVehicleForm() {
  document.getElementById('formContainer').classList.remove('hidden');
}

function hideAddVehicleForm() {
  document.getElementById('formContainer').classList.add('hidden');
  document.getElementById('formContainer').querySelector('form').reset();
  updatePlacasFields();
}

// Atualizar campos de placa baseado no tipo de veículo
function updatePlacasFields() {
  const tipoVeiculo = document.getElementById('tipoVeiculo').value;
  const placaCavaloDiv = document.getElementById('placaCavaloDiv');
  const placaCarreta1Div = document.getElementById('placaCarreta1Div');
  const placaCarreta2Div = document.getElementById('placaCarreta2Div');
  const tipoCarroceriaDiv = document.getElementById('tipoCarroceriaDiv');

  // Resetar todos os campos
  placaCavaloDiv.classList.add('hidden');
  placaCarreta1Div.classList.add('hidden');
  placaCarreta2Div.classList.add('hidden');
  tipoCarroceriaDiv.classList.add('hidden');

  document.getElementById('placaCavalo').removeAttribute('required');
  document.getElementById('placaCarreta1').removeAttribute('required');
  document.getElementById('placaCarreta2').removeAttribute('required');
  document.getElementById('tipoCarroceria').removeAttribute('required');

  if (!tipoVeiculo) return;

  // Mostrar carroceria para todos exceto Fiorino/Van
  if (tipoVeiculo !== 'Fiorino' && tipoVeiculo !== 'Van') {
    tipoCarroceriaDiv.classList.remove('hidden');
    document.getElementById('tipoCarroceria').setAttribute('required', 'required');
  }

  // Lógica de placas
  if (['Van', 'Fiorino', '3/4', 'Toco', 'Truck'].includes(tipoVeiculo)) {
    // 1 placa
    placaCavaloDiv.classList.remove('hidden');
    document.getElementById('placaCavalo').setAttribute('required', 'required');
  } else if (tipoVeiculo === 'Carreta') {
    // 2 placas
    placaCavaloDiv.classList.remove('hidden');
    placaCarreta1Div.classList.remove('hidden');
    document.getElementById('placaCavalo').setAttribute('required', 'required');
    document.getElementById('placaCarreta1').setAttribute('required', 'required');
  } else if (tipoVeiculo === 'Rodotrem') {
    // 3 placas
    placaCavaloDiv.classList.remove('hidden');
    placaCarreta1Div.classList.remove('hidden');
    placaCarreta2Div.classList.remove('hidden');
    document.getElementById('placaCavalo').setAttribute('required', 'required');
    document.getElementById('placaCarreta1').setAttribute('required', 'required');
    document.getElementById('placaCarreta2').setAttribute('required', 'required');
  }
}

// Adicionar veículo
async function handleAddVehicle(event) {
  event.preventDefault();

  const tipoVeiculo = document.getElementById('tipoVeiculo').value;
  const tipoCarroceria = document.getElementById('tipoCarroceria').value;

  const vehicleData = {
    motorista_id: motoristaId,
    tipo_veiculo: tipoVeiculo,
    marca: document.getElementById('marca').value,
    ano: parseInt(document.getElementById('ano').value),
    peso_ton: parseFloat(document.getElementById('pesoTon').value),
    volume_m3: parseFloat(document.getElementById('volumeM3').value),
    qtd_pallets: parseInt(document.getElementById('qtdPallets').value),
    foto_url: document.getElementById('fotoUrl').value || null,
    placa_cavalo: document.getElementById('placaCavalo').value || null,
    placa_carreta1: document.getElementById('placaCarreta1').value || null,
    placa_carreta2: document.getElementById('placaCarreta2').value || null,
    tipo_carroceria: tipoCarroceria || null
  };

  const { error } = await window.supabase
    .from('veiculos')
    .insert(vehicleData);

  if (error) {
    alert('Erro ao cadastrar veículo: ' + error.message);
    return;
  }

  alert('Veículo cadastrado com sucesso!');
  hideAddVehicleForm();
  loadVeiculos();
}

// Carregar veículos
async function loadVeiculos() {
  const { data: veiculos, error } = await window.supabase
    .from('veiculos')
    .select('*')
    .eq('motorista_id', motoristaId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao carregar veículos:', error);
    return;
  }

  const veiculosLista = document.getElementById('veiculosLista');

  if (!veiculos || veiculos.length === 0) {
    veiculosLista.innerHTML = '<p class="text-gray-500 col-span-full text-center py-8">Nenhum veículo cadastrado. Clique em "Adicionar Veículo" para começar.</p>';
    return;
  }

  veiculosLista.innerHTML = veiculos.map(v => `
    <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
      ${v.foto_url ? `<img src="${v.foto_url}" alt="${v.marca}" class="w-full h-48 object-cover">` : '<div class="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">Sem foto</div>'}

      <div class="p-6">
        <h4 class="text-xl font-bold text-navy mb-2">${v.marca} ${v.ano}</h4>
        <div class="space-y-1 text-sm text-gray-600">
          <p><strong>Tipo:</strong> ${v.tipo_veiculo}</p>
          ${v.tipo_carroceria ? `<p><strong>Carroceria:</strong> ${v.tipo_carroceria}</p>` : ''}
          <p><strong>Capacidade:</strong> ${v.peso_ton}t | ${v.volume_m3}m³ | ${v.qtd_pallets} pallets</p>
          ${v.placa_cavalo ? `<p><strong>Placa:</strong> ${v.placa_cavalo}</p>` : ''}
          ${v.placa_carreta1 ? `<p><strong>Carreta 1:</strong> ${v.placa_carreta1}</p>` : ''}
          ${v.placa_carreta2 ? `<p><strong>Carreta 2:</strong> ${v.placa_carreta2}</p>` : ''}
        </div>

        <button onclick="deleteVeiculo('${v.id}')" class="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition text-sm">
          Excluir
        </button>
      </div>
    </div>
  `).join('');
}

// Deletar veículo
async function deleteVeiculo(id) {
  if (!confirm('Tem certeza que deseja excluir este veículo?')) return;

  const { error } = await window.supabase
    .from('veiculos')
    .delete()
    .eq('id', id);

  if (error) {
    alert('Erro ao excluir veículo: ' + error.message);
    return;
  }

  alert('Veículo excluído com sucesso!');
  loadVeiculos();
}

// Logout
async function handleLogout() {
  await window.supabase.auth.signOut();
  window.location.href = '/login.html';
}

// Máscaras de placa
document.addEventListener('DOMContentLoaded', () => {
  init();

  ['placaCavalo', 'placaCarreta1', 'placaCarreta2'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', (e) => {
        let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (value.length > 7) value = value.substring(0, 7);
        e.target.value = value;
      });
    }
  });
});
