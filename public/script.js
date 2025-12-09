document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    const btn = document.getElementById('btn-cadastrar');
    if (btn) {
        btn.addEventListener('click', adicionarProduto);
    }
});

async function carregarProdutos() {
    const response = await fetch('/api/produtos');
    const produtos = await response.json();
    
    const lista = document.getElementById('lista-produtos');
    lista.innerHTML = '';
    produtos.forEach(produto => {
        const item = document.createElement('li');
        item.innerHTML = `
            <strong>${produto.nome}</strong>
            <span>R$ ${produto.preco}</span>
        `;
        lista.appendChild(item);
    });
}

async function adicionarProduto() {
    const nomeInput = document.getElementById('nome');
    const precoInput = document.getElementById('preco');
    
    const nome = nomeInput.value;
    const preco = precoInput.value;

    if (!nome || !preco) return alert("Preencha todos os campos!");

    const response = await fetch('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, preco })
    });

    if (response.ok) {
        nomeInput.value = '';
        precoInput.value = '';
        carregarProdutos(); 
    } else {
        alert("Erro ao salvar produto");
    }
}