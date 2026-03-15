// Configuração do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Configurações do Supabase não encontradas!');
}

const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

// Verificar se usuário está autenticado
async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// Logout
async function logout() {
  await supabase.auth.signOut();
  window.location.href = '/login.html';
}

// Verificar tipo de usuário
async function getUserType() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('user_type')
    .eq('id', user.id)
    .maybeSingle();

  return data?.user_type || null;
}
