/**
 * ================================================================
 * FORMULÁRIO DE PERFIL - LÓGICA MULTI-PERFIL
 * Controla campos condicionais CPF/CNPJ e máscaras
 * ================================================================
 */

document.addEventListener('DOMContentLoaded', function() {

    // Inicializar API do IBGE para endereço
    if (typeof IBGEAPI !== 'undefined') {
        IBGEAPI.inicializarEndereco('uf', 'cidade');
    }

    const tipoDocumentoSelect = document.getElementById('tipo_documento');
    const documentoInput = document.getElementById('documento');
    const labelDocumento = document.getElementById('label-documento');
    const razaoSocialContainer = document.getElementById('razao-social-container');
    const razaoSocialInput = document.getElementById('razao_social');

    // Função para atualizar o campo de documento baseado no tipo
    function atualizarCampoDocumento() {
        const tipoSelecionado = tipoDocumentoSelect.value;

        if (tipoSelecionado === 'cpf') {
            labelDocumento.textContent = 'CPF *';
            documentoInput.placeholder = '000.000.000-00';
            documentoInput.maxLength = 14;
            razaoSocialContainer.style.display = 'none';
            razaoSocialInput.removeAttribute('required');
        } else if (tipoSelecionado === 'cnpj') {
            labelDocumento.textContent = 'CNPJ *';
            documentoInput.placeholder = '00.000.000/0000-00';
            documentoInput.maxLength = 18;
            razaoSocialContainer.style.display = 'block';
            razaoSocialInput.setAttribute('required', 'required');
        }

        // Limpar o campo ao mudar o tipo
        if (!documentoInput.hasAttribute('readonly')) {
            documentoInput.value = '';
        }
    }

    // Event listener para mudança no tipo de documento
    tipoDocumentoSelect.addEventListener('change', atualizarCampoDocumento);

    // Chamada inicial
    atualizarCampoDocumento();

    // Máscara de CPF/CNPJ
    documentoInput.addEventListener('input', function(e) {
        let valor = e.target.value.replace(/\D/g, '');
        const tipoSelecionado = tipoDocumentoSelect.value;

        if (tipoSelecionado === 'cpf') {
            // Máscara CPF: 000.000.000-00
            if (valor.length > 11) valor = valor.substring(0, 11);

            valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
            valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        } else if (tipoSelecionado === 'cnpj') {
            // Máscara CNPJ: 00.000.000/0000-00
            if (valor.length > 14) valor = valor.substring(0, 14);

            valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
            valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
            valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
        }

        e.target.value = valor;
    });

    // Máscara de telefone
    const telefoneInputs = document.querySelectorAll('#telefone, #celular');
    telefoneInputs.forEach(function(input) {
        input.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');

            if (valor.length > 11) {
                valor = valor.substring(0, 11);
            }

            if (valor.length > 10) {
                // Celular: (11) 99999-9999
                valor = valor.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (valor.length > 6) {
                // Telefone fixo: (11) 9999-9999
                valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            } else if (valor.length > 2) {
                valor = valor.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
            } else if (valor.length > 0) {
                valor = valor.replace(/^(\d{0,2})/, '($1');
            }

            e.target.value = valor;
        });
    });

    // Máscara de CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');

            if (valor.length > 8) {
                valor = valor.substring(0, 8);
            }

            // Máscara: 00000-000
            valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');

            e.target.value = valor;
        });

        // Buscar CEP automaticamente
        cepInput.addEventListener('blur', function(e) {
            const cep = e.target.value.replace(/\D/g, '');

            if (cep.length === 8 && typeof IBGEAPI !== 'undefined') {
                IBGEAPI.buscarCEP(cep, function(dados) {
                    if (dados) {
                        document.getElementById('endereco').value = dados.logradouro || '';
                        document.getElementById('bairro').value = dados.bairro || '';
                        document.getElementById('complemento').value = dados.complemento || '';

                        // Selecionar UF e Cidade
                        const ufSelect = document.getElementById('uf');
                        if (ufSelect && dados.uf) {
                            ufSelect.value = dados.uf;

                            // Aguardar carregamento das cidades e selecionar
                            setTimeout(function() {
                                IBGEAPI.carregarCidades(dados.uf, 'cidade');

                                setTimeout(function() {
                                    const cidadeSelect = document.getElementById('cidade');
                                    if (cidadeSelect && dados.cidade) {
                                        cidadeSelect.value = dados.cidade;
                                    }
                                }, 500);
                            }, 300);
                        }
                    }
                });
            }
        });
    }

    // Validação do formulário
    const formPerfil = document.getElementById('formPerfil');
    formPerfil.addEventListener('submit', function(e) {
        const tipoDocumento = tipoDocumentoSelect.value;
        const documento = documentoInput.value.replace(/\D/g, '');

        // Validar CPF
        if (tipoDocumento === 'cpf') {
            if (documento.length !== 11) {
                e.preventDefault();
                alert('CPF inválido. Deve conter 11 dígitos.');
                documentoInput.focus();
                return false;
            }

            // Validação básica de CPF
            if (!validarCPF(documento)) {
                e.preventDefault();
                alert('CPF inválido.');
                documentoInput.focus();
                return false;
            }
        }

        // Validar CNPJ
        if (tipoDocumento === 'cnpj') {
            if (documento.length !== 14) {
                e.preventDefault();
                alert('CNPJ inválido. Deve conter 14 dígitos.');
                documentoInput.focus();
                return false;
            }

            // Validação básica de CNPJ
            if (!validarCNPJ(documento)) {
                e.preventDefault();
                alert('CNPJ inválido.');
                documentoInput.focus();
                return false;
            }
        }

        // Validar senhas (apenas no modo cadastro)
        const senhaInput = document.getElementById('senha');
        const confirmarSenhaInput = document.getElementById('confirmar_senha');

        if (senhaInput && confirmarSenhaInput) {
            if (senhaInput.value !== confirmarSenhaInput.value) {
                e.preventDefault();
                alert('As senhas não conferem.');
                confirmarSenhaInput.focus();
                return false;
            }

            if (senhaInput.value.length < 6) {
                e.preventDefault();
                alert('A senha deve ter no mínimo 6 caracteres.');
                senhaInput.focus();
                return false;
            }
        }

        return true;
    });

    // Função de validação de CPF
    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');

        if (cpf.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cpf)) return false;

        let soma = 0;
        let resto;

        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }

        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }

        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return false;

        return true;
    }

    // Função de validação de CNPJ
    function validarCNPJ(cnpj) {
        cnpj = cnpj.replace(/\D/g, '');

        if (cnpj.length !== 14) return false;
        if (/^(\d)\1{13}$/.test(cnpj)) return false;

        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }

        let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado != digitos.charAt(0)) return false;

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }

        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado != digitos.charAt(1)) return false;

        return true;
    }

    console.log('Formulário de perfil carregado com sucesso!');
});
