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

  // Definir data mínima como hoje
  const hoje = new Date().toISOString().split('T')[0];
  document.getElementById('dataCarregamento').setAttribute('min', hoje);
  document.getElementById('dataEntrega').setAttribute('min', hoje);
}

// Toggle campos de valor do frete
function toggleFreteFields() {
  const freteCombinar = document.getElementById('freteCombinar').checked;
  const valorFreteFields = document.getElementById('valorFreteFields');
  const valorOfertadoInput = document.getElementById('valorOfertado');

  if (freteCombinar) {
    valorFreteFields.style.opacity = '0.5';
    valorFreteFields.style.pointerEvents = 'none';
    valorOfertadoInput.removeAttribute('required');
  } else {
    valorFreteFields.style.opacity = '1';
    valorFreteFields.style.pointerEvents = 'auto';
    valorOfertadoInput.setAttribute('required', 'required');
  }
}

// Criar oferta
async function handleCreateOferta(event) {
  event.preventDefault();

  const freteCombinar = document.getElementById('freteCombinar').checked;

  const ofertaData = {
    transportadora_id: transportadoraId,
    origem_cidade: document.getElementById('origemCidade').value,
    origem_uf: document.getElementById('origemUF').value.toUpperCase(),
    destino_cidade: document.getElementById('destinoCidade').value,
    destino_uf: document.getElementById('destinoUF').value.toUpperCase(),
    data_carregamento: document.getElementById('dataCarregamento').value,
    hora_carregamento: document.getElementById('horaCarregamento').value || null,
    data_entrega: document.getElementById('dataEntrega').value,
    hora_entrega: document.getElementById('horaEntrega').value || null,
    tipo_veiculo: document.getElementById('tipoVeiculo').value,
    tipo_carroceria: document.getElementById('tipoCarroceria').value,
    tipo_carga: document.getElementById('tipoCarga').value,
    modelo_carga: document.getElementById('modeloCarga').value,
    frete_combinar: freteCombinar,
    valor_ofertado: freteCombinar ? null : parseFloat(document.getElementById('valorOfertado').value),
    pedagio_incluso: freteCombinar ? false : document.getElementById('pedagioIncluso').checked,
    tipo_pagamento: freteCombinar ? null : document.getElementById('tipoPagamento').value || null,
    fator_adiantamento: freteCombinar ? null : document.getElementById('fatorAdiantamento').value || null
  };

  // Validar datas
  const dataCarregamento = new Date(ofertaData.data_carregamento);
  const dataEntrega = new Date(ofertaData.data_entrega);

  if (dataEntrega < dataCarregamento) {
    alert('A data de entrega não pode ser anterior à data de carregamento!');
    return;
  }

  const { error } = await window.supabase
    .from('ofertas_carga')
    .insert(ofertaData);

  if (error) {
    alert('Erro ao criar oferta: ' + error.message);
    console.error(error);
    return;
  }

  alert('Oferta publicada com sucesso!');
  window.location.href = '/minhas-ofertas.html';
}

// Logout
async function handleLogout() {
  await window.supabase.auth.signOut();
  window.location.href = '/login.html';
}

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', init);

// Formatar UF em maiúsculas
document.getElementById('origemUF').addEventListener('input', (e) => {
  e.target.value = e.target.value.toUpperCase();
});

document.getElementById('destinoUF').addEventListener('input', (e) => {
  e.target.value = e.target.value.toUpperCase();
});
