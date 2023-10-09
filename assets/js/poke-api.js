// Objeto pokeApi usado para interagir com a API PokeAPI

const pokeApi = {}

// Função para converter detalhes do Pokémon da API em um objeto Pokémon
function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    // Define o número do Pokémon como o ID da API
    pokemon.number = pokeDetail.id
    // Define o nome do Pokémon com base nos detalhes da API
    pokemon.name = pokeDetail.name

    pokemon.base_stat = pokeDetail.base_stat

    // Verifica se há informações de habilidade na resposta da API
    if (pokeDetail.abilities && pokeDetail.abilities.length > 0) {
        // Assume a primeira habilidade, mas você pode personalizar a lógica de acordo com suas necessidades
        pokemon.ability = pokeDetail.abilities[0].ability.name;
    } else {
        pokemon.ability = "N/A";
    }

        // Verifica se há informações de stats na resposta da API
    if (pokeDetail.stats && pokeDetail.stats.length > 0) {
        // Encontra o stat de base (base_stat) dentro do array stats
        const baseStat = pokeDetail.stats.find((stat) => stat.stat.name === "hp"); // Substitua "hp" pelo nome da estatística desejada
        if (baseStat) {
            pokemon.base_stat = baseStat.base_stat;
        } else {
            pokemon.base_stat = "N/A";
        }
    } else {
        pokemon.base_stat = "N/A";
    }



    // Verifica se há informações de height e weight fora do objeto stats
if (pokeDetail.height) {
    pokemon.height = pokeDetail.height / 10; // Converta de decímetros para metros (10 decímetros = 1 metro)
} else {
    pokemon.height = "N/A"; 
}


    if (pokeDetail.weight) {
        pokemon.weight = pokeDetail.weight / 10; // Converta de hectogramas para quilogramas (10 hectogramas = 1 quilograma)
    } else {
        pokemon.weight = "N/A";
    }


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
