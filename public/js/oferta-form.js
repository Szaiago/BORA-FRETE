/**
 * ================================================================
 * FORMULÁRIO DE OFERTA - LÓGICA CONDICIONAL
 * Controla campos condicionais e validações
 * ================================================================
 */

document.addEventListener('DOMContentLoaded', function() {

    // Inicializar API do IBGE para Origem e Destino
    if (typeof IBGEAPI !== 'undefined') {
        IBGEAPI.inicializarOrigem('uf_origem', 'cidade_origem');
        IBGEAPI.inicializarDestino('uf_destino', 'cidade_destino');
    }

    // Controle do campo "Frete a Combinar"
    const freteACombinarCheck = document.getElementById('frete_a_combinar');
    const valorFreteContainer = document.getElementById('valor-frete-container');
    const valorFreteInput = document.getElementById('valor_frete');

    function toggleValorFrete() {
        if (freteACombinarCheck.checked) {
            valorFreteContainer.classList.add('hidden');
            valorFreteInput.removeAttribute('required');
            valorFreteInput.value = '';
        } else {
            valorFreteContainer.classList.remove('hidden');
            valorFreteInput.setAttribute('required', 'required');
        }
    }

    freteACombinarCheck.addEventListener('change', toggleValorFrete);
    toggleValorFrete(); // Chamada inicial

    // Máscara de telefone
    const telefoneInput = document.getElementById('contato_telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
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
    }

    // Validação de datas
    const dataColetaInput = document.getElementById('data_coleta');
    const dataEntregaInput = document.getElementById('data_entrega');

    if (dataEntregaInput && dataColetaInput) {
        dataEntregaInput.addEventListener('change', function() {
            const dataColeta = new Date(dataColetaInput.value);
            const dataEntrega = new Date(dataEntregaInput.value);

            if (dataColeta && dataEntrega && dataEntrega < dataColeta) {
                alert('A data de entrega não pode ser anterior à data de coleta.');
                dataEntregaInput.value = '';
            }
        });
    }

    // Cálculo automático de cubagem (Comprimento x Largura x Altura)
    const comprimentoInput = document.getElementById('comprimento');
    const larguraInput = document.getElementById('largura');
    const alturaInput = document.getElementById('altura');
    const cubagemInput = document.getElementById('cubagem');

    function calcularCubagem() {
        const comprimento = parseFloat(comprimentoInput.value) || 0;
        const largura = parseFloat(larguraInput.value) || 0;
        const altura = parseFloat(alturaInput.value) || 0;

        if (comprimento > 0 && largura > 0 && altura > 0) {
            const cubagem = (comprimento * largura * altura).toFixed(2);
            cubagemInput.value = cubagem;
        }
    }

    if (comprimentoInput && larguraInput && alturaInput) {
        comprimentoInput.addEventListener('input', calcularCubagem);
        larguraInput.addEventListener('input', calcularCubagem);
        alturaInput.addEventListener('input', calcularCubagem);
    }

    // Validação do formulário
    const formOferta = document.getElementById('formOferta');
    formOferta.addEventListener('submit', function(e) {
        // Validar UF e Cidade de Origem
        const ufOrigem = document.getElementById('uf_origem').value;
        const cidadeOrigem = document.getElementById('cidade_origem').value;

        if (!ufOrigem || !cidadeOrigem) {
            e.preventDefault();
            alert('Por favor, selecione a UF e Cidade de Origem.');
            return false;
        }

        // Validar UF e Cidade de Destino
        const ufDestino = document.getElementById('uf_destino').value;
        const cidadeDestino = document.getElementById('cidade_destino').value;

        if (!ufDestino || !cidadeDestino) {
            e.preventDefault();
            alert('Por favor, selecione a UF e Cidade de Destino.');
            return false;
        }

        // Validar valor do frete se não for "a combinar"
        if (!freteACombinarCheck.checked) {
            const valorFrete = parseFloat(valorFreteInput.value) || 0;
            if (valorFrete <= 0) {
                e.preventDefault();
                alert('Por favor, informe um valor válido para o frete ou marque "Frete a Combinar".');
                valorFreteInput.focus();
                return false;
            }
        }

        return true;
    });

    console.log('Formulário de oferta carregado com sucesso!');
});
