/**
 * ================================================================
 * API DO IBGE - LOCALIDADES
 * Popula campos de UF e Cidade usando a API oficial do IBGE
 * ================================================================
 */

const IBGEAPI = {
    baseUrl: 'https://servicodados.ibge.gov.br/api/v1/localidades',

    /**
     * Carrega todos os estados brasileiros
     * @param {string} selectId - ID do select de estados
     */
    carregarEstados: function(selectId) {
        const selectEstado = document.getElementById(selectId);
        if (!selectEstado) {
            console.error('Select de estado não encontrado:', selectId);
            return;
        }

        // Limpar select
        selectEstado.innerHTML = '<option value="">Carregando...</option>';

        fetch(`${this.baseUrl}/estados?orderBy=nome`)
            .then(response => response.json())
            .then(estados => {
                selectEstado.innerHTML = '<option value="">Selecione o Estado</option>';

                estados.forEach(estado => {
                    const option = document.createElement('option');
                    option.value = estado.sigla;
                    option.textContent = estado.nome;
                    selectEstado.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Erro ao carregar estados:', error);
                selectEstado.innerHTML = '<option value="">Erro ao carregar estados</option>';
            });
    },

    /**
     * Carrega cidades de um estado específico
     * @param {string} uf - Sigla do estado
     * @param {string} selectId - ID do select de cidades
     */
    carregarCidades: function(uf, selectId) {
        const selectCidade = document.getElementById(selectId);
        if (!selectCidade) {
            console.error('Select de cidade não encontrado:', selectId);
            return;
        }

        if (!uf) {
            selectCidade.innerHTML = '<option value="">Selecione o Estado primeiro</option>';
            selectCidade.disabled = true;
            return;
        }

        // Limpar select e desabilitar temporariamente
        selectCidade.innerHTML = '<option value="">Carregando cidades...</option>';
        selectCidade.disabled = true;

        fetch(`${this.baseUrl}/estados/${uf}/municipios?orderBy=nome`)
            .then(response => response.json())
            .then(cidades => {
                selectCidade.innerHTML = '<option value="">Selecione a Cidade</option>';

                cidades.forEach(cidade => {
                    const option = document.createElement('option');
                    option.value = cidade.nome;
                    option.textContent = cidade.nome;
                    selectCidade.appendChild(option);
                });

                selectCidade.disabled = false;
            })
            .catch(error => {
                console.error('Erro ao carregar cidades:', error);
                selectCidade.innerHTML = '<option value="">Erro ao carregar cidades</option>';
                selectCidade.disabled = false;
            });
    },

    /**
     * Inicializa os campos de origem (UF e Cidade)
     * @param {string} ufSelectId - ID do select de UF de origem
     * @param {string} cidadeSelectId - ID do select de cidade de origem
     */
    inicializarOrigem: function(ufSelectId, cidadeSelectId) {
        this.carregarEstados(ufSelectId);

        const selectUF = document.getElementById(ufSelectId);
        if (selectUF) {
            selectUF.addEventListener('change', (e) => {
                this.carregarCidades(e.target.value, cidadeSelectId);
            });
        }
    },

    /**
     * Inicializa os campos de destino (UF e Cidade)
     * @param {string} ufSelectId - ID do select de UF de destino
     * @param {string} cidadeSelectId - ID do select de cidade de destino
     */
    inicializarDestino: function(ufSelectId, cidadeSelectId) {
        this.carregarEstados(ufSelectId);

        const selectUF = document.getElementById(ufSelectId);
        if (selectUF) {
            selectUF.addEventListener('change', (e) => {
                this.carregarCidades(e.target.value, cidadeSelectId);
            });
        }
    },

    /**
     * Inicializa campos de endereço (para perfil)
     * @param {string} ufSelectId - ID do select de UF
     * @param {string} cidadeSelectId - ID do select de cidade
     */
    inicializarEndereco: function(ufSelectId, cidadeSelectId) {
        this.carregarEstados(ufSelectId);

        const selectUF = document.getElementById(ufSelectId);
        if (selectUF) {
            selectUF.addEventListener('change', (e) => {
                this.carregarCidades(e.target.value, cidadeSelectId);
            });
        }
    },

    /**
     * Busca CEP usando a API ViaCEP
     * @param {string} cep - CEP a ser buscado
     * @param {function} callback - Função de callback com os dados do CEP
     */
    buscarCEP: function(cep, callback) {
        // Remove caracteres não numéricos
        cep = cep.replace(/\D/g, '');

        if (cep.length !== 8) {
            console.error('CEP inválido');
            return;
        }

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    console.error('CEP não encontrado');
                    callback(null);
                    return;
                }

                callback({
                    cep: data.cep,
                    logradouro: data.logradouro,
                    complemento: data.complemento,
                    bairro: data.bairro,
                    cidade: data.localidade,
                    uf: data.uf
                });
            })
            .catch(error => {
                console.error('Erro ao buscar CEP:', error);
                callback(null);
            });
    }
};

// Exportar para uso global
window.IBGEAPI = IBGEAPI;

console.log('API do IBGE carregada com sucesso!');
