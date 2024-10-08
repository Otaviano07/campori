window.onload = function () {
    // Chamar as funções
    //teste();
    popularEstados();
    modal.style.display = 'block';
};

const modal = document.querySelector('.modal');
const gerar = document.querySelector('#btnGerar');
const okButton = document.querySelector('.ok-button');

// Close the modal when the OK button is clicked
okButton.addEventListener('click', function() {
    modal.style.display = 'none';
    gerar.style.display = 'block';
});

const estados = [
"Acre",
"Alagoas",
"Amapá",
"Amazonas",
"Bahia",
"Ceará",
"Distrito Federal",
"Espírito Santo",
"Goiás",
"Maranhão",
"Mato Grosso",
"Mato Grosso do Sul",
"Minas Gerais",
"Pará",
"Paraíba",
"Paraná",
"Pernambuco",
"Piauí",
"Rio de Janeiro",
"Rio Grande do Norte",
"Rio Grande do Sul",
"Rondônia",
"Roraima",
"Santa Catarina",
"São Paulo",
"Sergipe",
"Tocantins",
];

const siglas = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];


var nomerespon = document.getElementById("nomerespon");
var rgrespon = document.getElementById("rgrespon");
var orgaorespon = document.getElementById("orgaorespon");
var cpfrespon = document.getElementById("cpfrespon");
var contato1repons = document.getElementById("contato1repons");
var contato2repons = document.getElementById("contato2repons");
var nomedbv = document.getElementById("nomedbv");
var nomeclube = document.getElementById("nomeclube");
var nomeigreja = document.getElementById("nomeigreja");
var diretor = document.getElementById("diretor");
var associado = document.getElementById("associado");
var associada = document.getElementById("associada");
var cidade = document.getElementById("cidade");
var estado = document.getElementById("estado");
var dataembarque = document.getElementById("dataembarque");
var horaembarque = document.getElementById("horaembarque");
var localembarque = document.getElementById("localembarque");
var datachegada = document.getElementById("datachegada");
var horachegada = document.getElementById("horachegada");
var localchegada = document.getElementById("localchegada");

$(document).ready(function () {
    // Máscara de CPF
    $("#cpfrespon").on("input", function () {
        let inputValue = this.value.replace(/\D/g, ""); // Remove caracteres não numéricos
        if (inputValue.length > 3) inputValue = inputValue.replace(/(\d{3})(\d)/, "$1.$2");
        if (inputValue.length > 6) inputValue = inputValue.replace(/(\d{3})(\d)/, "$1.$2");
        if (inputValue.length > 9) inputValue = inputValue.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        this.value = inputValue;

        validarCPF(inputValue);
    });

    // Máscara de Data
    $("#dataembarque,#datachegada").on("input", function () {
        let inputValue = this.value.replace(/\D/g, ""); // Remove caracteres não numéricos
        if (inputValue.length > 2) inputValue = inputValue.replace(/(\d{2})(\d)/, "$1/$2");
        if (inputValue.length > 5) inputValue = inputValue.replace(/(\d{2})(\d)/, "$1/$2");
        this.value = inputValue;
    });

    // Adicionar event listener ao select de estados
    const selectEstado = document.getElementById("estado");
    if (selectEstado) {
        selectEstado.addEventListener("change", () => {
            const estadoSelecionado = selectEstado.value;
            popularCidades(estadoSelecionado);
        });
    }
});

// Função para capitalizar palavras
function capitalizarPalavras(elemento) {
    let palavras = elemento.value.toLowerCase().split(" ");
    for (let i = 0; i < palavras.length; i++) {
        if (palavras[i].length > 1 || i === 0) {
            palavras[i] = palavras[i].charAt(0).toUpperCase() + palavras[i].slice(1);
        }
    }
    elemento.value = palavras.join(" ");
}

// Função para formatar número
function formatarContato(campo) {
    let valor = campo.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    if (valor.length > 0) valor = "(" + valor;
    if (valor.length > 3) valor = valor.replace(/(\(\d{2})(\d)/, "$1) $2");
    if (valor.length > 10) valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    if (valor.length > 15) valor = valor.substring(0, 16); // Limita a 16 caracteres
    campo.value = valor;
}

// Função para formatar hora
function formatarHora(campo) {
    let valor = campo.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    if (valor.length > 2) valor = valor.replace(/(\d{2})(\d)/, "$1:$2"); // Insere o ":" entre a hora e os minutos
    if (valor.length > 5) valor = valor.substring(0, 5); // Limita a 5 caracteres (HH:MM)
    campo.value = valor;
}

// Função para limpar formulário
function limpar(formulario) {
    if (document.getElementById(formulario)) document.getElementById(formulario).reset();
    if(formulario === "clube"){
        const cidadeSelect = document.getElementById("cidade");
        cidadeSelect.innerHTML = ""; // Limpar as opções anteriores
    
        // Adicionar a opção "Selecione" no início
        const optionCidade = document.createElement("option");
        optionCidade.value = ""; // Deixa o valor vazio
        optionCidade.text = "Selecione uma cidade"; // Texto a ser exibido
        optionCidade.disabled = true; // Desabilita a opção
        optionCidade.selected = true; // Define como selecionada
        cidadeSelect.appendChild(optionCidade);
    }


}

// Função para fazer a requisição à API e popular o select de estados
async function popularEstados() {
    const response = await fetch("https://brasilapi.com.br/api/ibge/uf/v1");
    const estados = await response.json();

    // Ordenar os estados por nome
    estados.sort((a, b) => a.nome.localeCompare(b.nome));

    const selectEstado = document.getElementById("estado");

    // Popular os estados em ordem alfabética
    estados.forEach((estado) => {
        const option = document.createElement("option");
        option.value = estado.sigla;
        option.text = estado.nome;
        selectEstado.appendChild(option);
    });
}


// Função para fazer a requisição à API e popular o select de cidades
async function popularCidades(estadoSigla) {
    const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSigla}/municipios`);
    const cidades = await response.json();

    const selectCidade = document.getElementById("cidade");
    selectCidade.innerHTML = ""; // Limpar as opções anteriores

    // Adicionar a opção "Selecione" no início
    const optionSelecione = document.createElement("option");
    optionSelecione.value = ""; // Deixa o valor vazio
    optionSelecione.text = "Selecione uma cidade"; // Texto a ser exibido
    optionSelecione.disabled = true; // Desabilita a opção
    optionSelecione.selected = true; // Define como selecionada
    selectCidade.appendChild(optionSelecione);

    // Adicionar as opções das cidades
    cidades.forEach((cidade) => {
        const option = document.createElement("option");
        option.value = cidade.nome;
        option.text = cidade.nome;
        selectCidade.appendChild(option);
    });
}


function verificarDados() {
    var campos = [
        { campo: nomerespon, mensagem: "Nome do responsável é obrigatório" },
        { campo: rgrespon, mensagem: "RG do responsável é obrigatório" },
        { campo: orgaorespon, mensagem: "Órgão expedidor do responsável é obrigatório" },
        { campo: cpfrespon, mensagem: "CPF do responsável é obrigatório" },
        { campo: contato1repons, mensagem: "Contato 1 do responsável é obrigatório" },
        { campo: contato2repons, mensagem: "Contato 2 do responsável é obrigatório" },
        { campo: nomedbv, mensagem: "Nome do desbravador é obrigatório" },
        { campo: nomeclube, mensagem: "Nome do clube é obrigatório" },
        { campo: nomeigreja, mensagem: "Nome da igreja é obrigatório" },
        { campo: diretor, mensagem: "Nome do diretor é obrigatório" },
        { campo: associado, mensagem: "Nome do diretor associado é obrigatório" },
        { campo: associada, mensagem: "Nome da diretora associada é obrigatório" },
        { campo: estado, mensagem: "Estado do clube é obrigatório" },
        { campo: cidade, mensagem: "Cidade do clube é obrigatório" },
        { campo: dataembarque, mensagem: "Data de embarque é obrigatório" },
        { campo: horaembarque, mensagem: "Hora de embarque é obrigatório" },
        { campo: localembarque, mensagem: "Local de embarque é obrigatório" },
        { campo: datachegada, mensagem: "Data de chegada é obrigatório" },
        { campo: horachegada, mensagem: "Hora de chegada é obrigatório" },
        { campo: localchegada, mensagem: "Local de chegada é obrigatório" },
    ];

    var erro = false;

    for (var i = 0; i < campos.length; i++) {
        if (campos[i].campo.value.trim() === "") {
            Swal.fire({
                icon: "error",
                title: "Erro",
                text: campos[i].mensagem,
                confirmButtonText: "OK",
            });
            erro = true;
            break;  // Interrompe o loop quando encontrar um campo vazio
        }
    }

    if (!erro) {
        // Se todos os campos estiverem preenchidos, você pode prosseguir com a lógica do seu programa
        imprimir();
        console.log("Todos os campos estão preenchidos");
    }
}

function novaData() {
    // Cria um objeto Date a partir da string
    const data = new Date();

    // Obtém os componentes da data
    const dia = data.getDate();
    const mes = data.getMonth() + 1; // Mês começa em 0
    const ano = data.getFullYear();

    // Formata a data no formato dd/mm/yyyy
    const dataFormatada = `${dia.toString().padStart(2, "0")}/${mes.toString().padStart(2, "0")}/${ano}`;

    return dataFormatada;
}

function imprimir() {
    const { jsPDF } = window.jspdf;
    const tel = contato1repons.value.replace(/\D/g, "");
    const ddd = tel.substring(0, 2);
    const primeiroTel = tel.substring(2, 7);
    const segundoTel = tel.substring(7, 11);
    const complemento = diretor.value.substring(28, 35);
    const diretoria = diretor.value.substring(0, 27);            var sigla = "";
    const data = novaData();

    // Criar um novo PDF com a largura de 1400mm e altura de 800mm
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [220, 170],
    });

    var templante = document.getElementById("templante");

    if (templante) {
        // Carregar a imagem e converter para base64
        var imagem = new Image();
        imagem.src = templante.src; // Usar o src da imagem do elemento <img>

        imagem.onload = function () {
            // Adicionar a imagem ao PDF
            doc.addImage(imagem, "PNG", 0, 0, 170, 220);

            // Adicionar texto ao PDF
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(7);

            // Certificar-se de que as coordenadas estão dentro do tamanho do PDF
            doc.text(nomerespon.value.toString(), 21, 38);
            doc.text(rgrespon.value.toString(), 24, 44);
            doc.text(orgaorespon.value.toString(), 86, 44);
            doc.text(cpfrespon.value.toString(), 125, 44);
            doc.text(ddd, 51, 50);
            doc.text(primeiroTel+"-"+segundoTel, 58, 50);
            doc.text(contato2repons.value.toString(), 91, 50);
            doc.text(nomedbv.value.toString(), 21, 62);
            doc.text(nomeclube.value.toString(), 33, 68);
            doc.text(nomeigreja.value.toString(), 18, 74);
            doc.text(diretoria.toString(), 122, 74);
            doc.text(complemento.toString() + ", " + associado.value.toString() + " e " + associada.value.toString(), 18, 80);
            doc.text(dataembarque.value.substring(0, 2).toString(), 62, 93);
            doc.text(dataembarque.value.substring(3, 5).toString(), 71, 93);
            doc.text(dataembarque.value.substring(6, 10).toString(), 79, 93);
            doc.text(horaembarque.value.toString(), 94, 93);
            doc.text(localembarque.value.toString(), 110, 93);
            doc.text(datachegada.value.substring(0, 2).toString(), 48, 99);
            doc.text(datachegada.value.substring(3, 5).toString(), 57, 99);
            doc.text(datachegada.value.substring(6, 10).toString(), 65, 99);
            doc.text(horachegada.value.toString(), 80, 99);
            doc.text(localchegada.value.toString(), 95, 99);
            doc.text(cidade.value.toString() + " - " + estado.value.toString(), 67, 123);
            doc.text(data.substring(0, 2).toString(), 107, 123);
            doc.text(data.substring(3, 5).toString(), 116, 123);

            // Gerar o PDF como um Blob
            const pdfBlob = doc.output("blob");

            // Criar um URL para o Blob
            const pdfUrl = URL.createObjectURL(pdfBlob);

            // Abrir o PDF em uma nova aba
            window.open(pdfUrl);

            // Envio da dados para planilha
            var formulario = "https://docs.google.com/forms/d/e/1FAIpQLScEo7DkObmQrtC92Wzb0v_5piIV-kBJbtxFceIVCEsE8CbAog/formResponse?usp=pp_url" +
            "&entry.246266120=" + encodeURIComponent(estado.value) +
            "&entry.470759012=" + encodeURIComponent(cidade.value) +
            "&entry.4549184=" + encodeURIComponent(nomeigreja.value) +
            "&entry.58272246=" + encodeURIComponent(nomeclube.value) +
            "&entry.71838891=" + encodeURIComponent(diretor.value);

            // Função para enviar o formulário automaticamente
            fetch(formulario, {
                method: 'POST',
                mode: 'no-cors'  // Esta opção desabilita a verificação de CORS, já que o Google Forms não envia uma resposta de CORS para as requisições.
            }).then(function() {
                console.log("Formulário enviado com sucesso!");
            }).catch(function(error) {
                console.error("Erro ao enviar o formulário:", error);
            });

            desenvolvedor();

        };
    } 
    
    else {
        console.error('Elemento com o ID "templante" não encontrado.');
        return;
    }
}

function desenvolvedor(){
    Swal.fire({
        title: 'Contato',
        html: `
            <p>Desenvolvedor: Otaviano Silva</p>
            <p>Email: otaviano.silva07@gmail.com</p>
            <p>Whatsapp: (88) 9 9278-4105</p>
            <p>Pix: <strong>otaviano.silva07@gmail.com</strong></p>
            <button id="copyPix">Copiar Pix</button>
        `,
        showCancelButton: true,
        confirmButtonText: 'Whatsapp',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: "#008000",
        cancelButtonColor: "#ff0000",
    }).then((result) => {
        if (result.isConfirmed) {
            window.open('https://wa.me/5588992784105' + "?text=" + encodeURIComponent('Olá Otaviano.'), '_blank');
        }
    });
    
    document.getElementById('copyPix').addEventListener('click', function() {
        let pix = 'otaviano.silva07@gmail.com';
        let tempInput = document.createElement('input');
        document.body.appendChild(tempInput);
        tempInput.value = pix;
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        Swal.fire('Pix copiado para a área de transferência!', '', 'success');
    });
    
}


  function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ""); // Remove todos os caracteres não numéricos

    const inputCpf = document.getElementById("cpfrespon"); // Seleciona a div

    if (cpf.length === 11) {
        if (validarDigitoVerificador(cpf)) {
            document.getElementById("cpf-validation-message").innerText = "";
            document.getElementById("cpfrespon").setCustomValidity("");
            inputCpf.style.backgroundColor = ""; // Remove a cor de fundo (volta ao normal)
        } else {
            document.getElementById("cpf-validation-message").innerText = "CPF inválido";
            document.getElementById("cpfrespon").setCustomValidity("CPF inválido");
            inputCpf.style.backgroundColor = "red"; // Muda a cor de fundo para vermelho
        }
    } else {
        document.getElementById("cpf-validation-message").innerText = "";
        document.getElementById("cpfrespon").setCustomValidity("");
        inputCpf.style.backgroundColor = ""; // Remove a cor de fundo se o CPF for menor que 11 dígitos
    }
}


function validarDigitoVerificador(cpf) {
    var soma = 0;
    var resto;

    // Verifica o primeiro dígito verificador
    for (var i = 1; i <= 9; i++) {
        soma += parseInt(cpf.charAt(i - 1)) * (11 - i);
    }
    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) {
        resto = 0;
    }

    if (resto !== parseInt(cpf.charAt(9))) {
        return false;
    }

    // Verifica o segundo dígito verificador
    soma = 0;
    for (var i = 1; i <= 10; i++) {
        soma += parseInt(cpf.charAt(i - 1)) * (12 - i);
    }
    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) {
        resto = 0;
    }

    if (resto !== parseInt(cpf.charAt(10))) {
        return false;
    }

    return true;
}

