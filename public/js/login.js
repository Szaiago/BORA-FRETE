// Alternar entre Login e Cadastro
function showTab(tab) {
  const loginForm = document.getElementById('loginForm');
  const cadastroForm = document.getElementById('cadastroForm');
  const loginTab = document.getElementById('loginTab');
  const cadastroTab = document.getElementById('cadastroTab');

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    cadastroForm.classList.add('hidden');
    loginTab.classList.add('border-navy', 'text-navy');
    loginTab.classList.remove('border-transparent', 'text-gray-500');
    cadastroTab.classList.remove('border-navy', 'text-navy');
    cadastroTab.classList.add('border-transparent', 'text-gray-500');
  } else {
    loginForm.classList.add('hidden');
    cadastroForm.classList.remove('hidden');
    cadastroTab.classList.add('border-navy', 'text-navy');
    cadastroTab.classList.remove('border-transparent', 'text-gray-500');
    loginTab.classList.remove('border-navy', 'text-navy');
    loginTab.classList.add('border-transparent', 'text-gray-500');
  }
}

// Atualizar campos de cadastro baseado no tipo
function updateCadastroFields() {
  const userType = document.getElementById('userType').value;
  const transportadoraFields = document.getElementById('transportadoraFields');
  const agenciadorFields = document.getElementById('agenciadorFields');
  const motoristaFields = document.getElementById('motoristaFields');

  transportadoraFields.classList.add('hidden');
  agenciadorFields.classList.add('hidden');
  motoristaFields.classList.add('hidden');

  if (userType === 'transportadora') {
    transportadoraFields.classList.remove('hidden');
  } else if (userType === 'agenciador') {
    agenciadorFields.classList.remove('hidden');
  } else if (userType === 'motorista') {
    motoristaFields.classList.remove('hidden');
  }
}

// Atualizar label do documento
function updateDocLabel(tipo) {
  const select = document.getElementById(`tipoDoc${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
  const label = document.getElementById(`labelDoc${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
  label.textContent = select.value;
}

// Mostrar mensagem
function showMessage(text, type = 'info') {
  const messageEl = document.getElementById('message');
  messageEl.textContent = text;
  messageEl.className = `mt-4 text-center text-sm ${type === 'error' ? 'text-red-600' : 'text-green-600'}`;
}

// Handle Login
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const { data, error } = await window.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    showMessage('Login realizado com sucesso!', 'success');

    setTimeout(() => {
      window.location.href = '/dashboard.html';
    }, 1000);

  } catch (error) {
    showMessage(error.message, 'error');
  }
}

// Handle Cadastro
async function handleCadastro(event) {
  event.preventDefault();

  const userType = document.getElementById('userType').value;
  const email = document.getElementById('cadastroEmail').value;
  const password = document.getElementById('cadastroPassword').value;

  if (!userType) {
    showMessage('Selecione o tipo de usuário', 'error');
    return;
  }

  try {
    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await window.supabase.auth.signUp({
      email,
      password
    });

    if (authError) throw authError;

    const userId = authData.user.id;

    // Inserir na tabela users
    const { error: userError } = await window.supabase
      .from('users')
      .insert({
        id: userId,
        email,
        password_hash: 'managed_by_supabase_auth',
        user_type: userType
      });

    if (userError) throw userError;

    // Inserir dados específicos do tipo
    if (userType === 'transportadora') {
      const { error } = await window.supabase
        .from('transportadoras')
        .insert({
          user_id: userId,
          razao_social: document.getElementById('razaoSocial').value,
          cnpj: document.getElementById('cnpj').value,
          ie: document.getElementById('ie').value,
          telefone: document.getElementById('telefoneTransp').value
        });
      if (error) throw error;

    } else if (userType === 'agenciador') {
      const { error } = await window.supabase
        .from('agenciadores')
        .insert({
          user_id: userId,
          nome: document.getElementById('nomeAgenciador').value,
          cpf_cnpj: document.getElementById('cpfCnpjAgenciador').value,
          tipo_documento: document.getElementById('tipoDocAgenciador').value,
          telefone: document.getElementById('telefoneAgenciador').value
        });
      if (error) throw error;

    } else if (userType === 'motorista') {
      const { error } = await window.supabase
        .from('motoristas')
        .insert({
          user_id: userId,
          nome: document.getElementById('nomeMotorista').value,
          cpf_cnpj: document.getElementById('cpfCnpjMotorista').value,
          tipo_documento: document.getElementById('tipoDocMotorista').value,
          telefone: document.getElementById('telefoneMotorista').value,
          cnh_c: document.getElementById('cnhC').checked,
          cnh_e: document.getElementById('cnhE').checked,
          curso_mopp: document.getElementById('cursoMopp').checked
        });
      if (error) throw error;
    }

    showMessage('Cadastro realizado com sucesso!', 'success');

    setTimeout(() => {
      window.location.href = '/dashboard.html';
    }, 1500);

  } catch (error) {
    showMessage(error.message, 'error');
  }
}

// Máscaras para inputs
document.addEventListener('DOMContentLoaded', () => {
  // Máscara CNPJ
  const cnpjInput = document.getElementById('cnpj');
  if (cnpjInput) {
    cnpjInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
      e.target.value = value;
    });
  }

  // Máscara Telefone
  const telefoneInputs = ['telefoneTransp', 'telefoneAgenciador', 'telefoneMotorista'];
  telefoneInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 10) {
          value = value.replace(/^(\d{2})(\d)/, '($1) $2');
          value = value.replace(/(\d{4})(\d)/, '$1-$2');
        } else {
          value = value.replace(/^(\d{2})(\d)/, '($1) $2');
          value = value.replace(/(\d{5})(\d)/, '$1-$2');
        }
        e.target.value = value;
      });
    }
  });

  // Máscara CPF/CNPJ dinâmica
  ['cpfCnpjAgenciador', 'cpfCnpjMotorista'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        const tipoDoc = document.getElementById(id.replace('cpfCnpj', 'tipoDoc')).value;

        if (tipoDoc === 'CPF') {
          value = value.replace(/(\d{3})(\d)/, '$1.$2');
          value = value.replace(/(\d{3})(\d)/, '$1.$2');
          value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        } else {
          value = value.replace(/^(\d{2})(\d)/, '$1.$2');
          value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
          value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
          value = value.replace(/(\d{4})(\d)/, '$1-$2');
        }
        e.target.value = value;
      });
    }
  });
});
