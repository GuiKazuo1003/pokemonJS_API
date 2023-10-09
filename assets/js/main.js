// Obtém uma referência ao elemento HTML com o ID 'pokemonList'
const pokemonList = document.getElementById('pokemonList')

// Obtém uma referência ao elemento HTML com o ID 'loadMoreButton'
const loadMoreButton = document.getElementById('loadMoreButton')

// Define o número máximo de registros de Pokémon que serão carregados
const maxRecords = 151

// Define o limite de registros de Pokémon a serem carregados por vez
const limit = 10

// Inicializa a variável offset para 0, que será usada para controlar o deslocamento dos registros
let offset = 0;

// Função que converte um objeto Pokémon em uma string HTML formatada para uma lista
function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

// Função que carrega itens de Pokémon a partir da API com base no offset e no limite especificados
function loadPokemonItens(offset, limit) {

    // Chama a função getPokemons da variável pokeApi (presumivelmente uma API externa) para obter Pokémon
    // A função retorna uma Promise que resolve em um array de Pokémon
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        
        // Converte cada Pokémon em uma string HTML usando a função convertPokemonToLi e as une
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        
        // Adiciona o HTML gerado à lista de Pokémon (pokemonList)
        pokemonList.innerHTML += newHtml
    })
}

// Inicialmente, carrega Pokémon com o offset e o limite especificados
loadPokemonItens(offset, limit)

// Adiciona um ouvinte de eventos de clique ao botão "Load More"
loadMoreButton.addEventListener('click', () => {
    // Incrementa o offset para carregar mais Pokémon
    offset += limit

    // Calcula o número total de registros que serão carregados com a próxima página
    const qtdRecordsWithNexPage = offset + limit

    // Verifica se a próxima página excederá o número máximo de registros
    if (qtdRecordsWithNexPage >= maxRecords) {
        // Calcula o novo limite para garantir que não exceda o número máximo de registros
        const newLimit = maxRecords - offset
        
        // Carrega Pokémon com o novo limite
        loadPokemonItens(offset, newLimit)

        // Remove o botão "Load More" quando todos os registros foram carregados
        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        // Se a próxima página não exceder o número máximo de registros, carrega Pokémon com o limite padrão
        loadPokemonItens(offset, limit)
    }
})
