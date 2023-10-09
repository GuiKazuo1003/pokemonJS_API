// Objeto pokeApi usado para interagir com a API PokeAPI

const pokeApi = {}

// Função para converter detalhes do Pokémon da API em um objeto Pokémon
function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    // Define o número do Pokémon como o ID da API
    pokemon.number = pokeDetail.id
    // Define o nome do Pokémon com base nos detalhes da API
    pokemon.name = pokeDetail.name

    // Mapeia os tipos do Pokémon a partir dos detalhes da API
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    // Obtém o primeiro tipo do array
    const [type] = types

    // Define a lista de tipos e o tipo principal do Pokémon
    pokemon.types = types
    pokemon.type = type

    // Define a foto do Pokémon com base na URL dos sprites da API
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

// Função para obter detalhes de um Pokémon específico da API
pokeApi.getPokemonDetail = (pokemon) => {
    // Faz uma solicitação fetch à URL do Pokémon na API
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon) // Converte os detalhes do Pokémon em um objeto Pokémon
}

// Função para obter uma lista de Pokémon da API com base no deslocamento e no limite especificados
pokeApi.getPokemons = (offset = 0, limit = 5) => {
    // Constrói a URL da API com base no deslocamento e no limite
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    // Faz uma solicitação fetch à URL da API
    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results) // Extrai a lista de resultados dos Pokémon
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail)) // Mapeia os resultados para obter detalhes de cada Pokémon
        .then((detailRequests) => Promise.all(detailRequests)) // Aguarda todas as solicitações de detalhes serem concluídas
        .then((pokemonsDetails) => pokemonsDetails) // Retorna os detalhes dos Pokémon
}
