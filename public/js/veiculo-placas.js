/**
 * ================================================================
 * LÓGICA DE PLACAS - CADASTRO DE VEÍCULOS
 * Controla a exibição dinâmica dos campos de placa baseado no tipo
 * ================================================================
 */

document.addEventListener('DOMContentLoaded', function() {
    const tipoVeiculoSelect = document.getElementById('tipo_veiculo');
    const placaCarretaContainer = document.getElementById('placa-carreta-container');
    const placaCarreta2Container = document.getElementById('placa-carreta2-container');
    const placaCarretaInput = document.getElementById('placa_carreta');
    const placaCarreta2Input = document.getElementById('placa_carreta2');

    // Função para atualizar a visibilidade dos campos de placa
    function atualizarCamposPlaca() {
        const tipoSelecionado = tipoVeiculoSelect.value;

        // Resetar todos os campos
        placaCarretaContainer.classList.add('hidden');
        placaCarreta2Container.classList.add('hidden');
        placaCarretaInput.removeAttribute('required');
        placaCarreta2Input.removeAttribute('required');
        placaCarretaInput.value = '';
        placaCarreta2Input.value = '';

        // Lógica baseada no tipo de veículo
        switch(tipoSelecionado) {
            case 'van':
            case 'truck':
            case '3/4':
            case 'toco':
                // Apenas 1 campo de placa (cavalo) - já está visível por padrão
                break;

            case 'carreta':
            case 'bitrem':
                // 2 campos de placa: Cavalo + Carreta
                placaCarretaContainer.classList.remove('hidden');
                placaCarretaInput.setAttribute('required', 'required');
                break;

            case 'rodotrem':
                // 3 campos de placa: Cavalo + Carreta + Carreta 2
                placaCarretaContainer.classList.remove('hidden');
                placaCarreta2Container.classList.remove('hidden');
                placaCarretaInput.setAttribute('required', 'required');
                placaCarreta2Input.setAttribute('required', 'required');
                break;

            default:
                // Nenhum tipo selecionado
                break;
        }
    }

    // Event listener para mudança no tipo de veículo
    tipoVeiculoSelect.addEventListener('change', atualizarCamposPlaca);

    // Chamada inicial para configurar o estado correto
    atualizarCamposPlaca();

    // Máscaras para os campos de placa (formato ABC-1234 ou ABC1D234)
    const camposPlaca = document.querySelectorAll('[name^="placa_"]');
    camposPlaca.forEach(function(campo) {
        campo.addEventListener('input', function(e) {
            let valor = e.target.value.toUpperCase();

            // Remove tudo que não for letra ou número
            valor = valor.replace(/[^A-Z0-9]/g, '');

            // Aplica a máscara ABC-1234 ou ABC1D234
            if (valor.length > 3) {
                // Verifica se é placa Mercosul (ABC1D23) ou antiga (ABC1234)
                const parte1 = valor.substring(0, 3); // Letras
                const parte2 = valor.substring(3); // Números e possível letra

                valor = parte1 + '-' + parte2;
            }

            // Limita ao tamanho máximo
            if (valor.length > 8) {
                valor = valor.substring(0, 8);
            }

            e.target.value = valor;
        });
    });

    // Validação do formulário antes do envio
    const formVeiculo = document.getElementById('formVeiculo');
    formVeiculo.addEventListener('submit', function(e) {
        const tipoSelecionado = tipoVeiculoSelect.value;

        // Validar placas baseado no tipo
        if (tipoSelecionado === '') {
            e.preventDefault();
            alert('Por favor, selecione o tipo de veículo.');
            tipoVeiculoSelect.focus();
            return false;
        }

        // Validar placa do cavalo
        const placaCavalo = document.getElementById('placa_cavalo').value;
        if (placaCavalo === '' || placaCavalo.length < 7) {
            e.preventDefault();
            alert('Por favor, insira uma placa válida para o veículo/cavalo.');
            document.getElementById('placa_cavalo').focus();
            return false;
        }

        // Validar placa da carreta se necessário
        if ((tipoSelecionado === 'carreta' || tipoSelecionado === 'bitrem' || tipoSelecionado === 'rodotrem')) {
            const placaCarreta = placaCarretaInput.value;
            if (placaCarreta === '' || placaCarreta.length < 7) {
                e.preventDefault();
                alert('Por favor, insira uma placa válida para a carreta.');
                placaCarretaInput.focus();
                return false;
            }
        }

        // Validar segunda placa da carreta se necessário
        if (tipoSelecionado === 'rodotrem') {
            const placaCarreta2 = placaCarreta2Input.value;
            if (placaCarreta2 === '' || placaCarreta2.length < 7) {
                e.preventDefault();
                alert('Por favor, insira uma placa válida para a segunda carreta.');
                placaCarreta2Input.focus();
                return false;
            }
        }

        return true;
    });

    console.log('Sistema de placas carregado com sucesso!');
});
