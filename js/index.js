(function () {

    let pokemonsList = document.querySelector('.pokemons-list');
    let colorPokemonType = []
    let pokemonListSize = 12;
    let pokemonListData = [];
    let pokemonList
    let loadMore = document.querySelector('.load-more');

    fetchPokemonType();

    // PokemonType
    function fetchPokemonType() {
        fetch(`https://pokeapi.co/api/v2/type/?limit=999`)
            .then(pokemonType => {
                return pokemonType.json();
            })
            .then(pokemonType => {
                pokemonType = pokemonType.results
                pokemonType.forEach((object) => {
                    colorPokemonType.push([object.name, '#' + Math.random().toString(16).substr(-6)])
                })
                fetchPokemonList(pokemonListSize);
            })
    };

    // Pokemon List
    function fetchPokemonList(pokemonListSize) {
        fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${pokemonListSize}`)
            .then(data => {
                return data.json();
            })
            .then(data => {
                pokemonList = data.results;
                fetchPokemonData()
            })
    };

    // Pokemon Data
    function fetchPokemonData() {
        pokemonList.forEach((object) => {
            fetch(object.url)
                .then(data => {
                    return data.json();
                })
                .then(data => {
                    pokemonListData.push(data)
                    if (pokemonListData.length >= pokemonListSize) {
                        renderPokemonsList();
                    }
                })
        })
    }

    // Render Pokemons List
    renderPokemonsList = () => {
        pokemonListData.forEach((data, i) => {
            let list = ''
            data.types.forEach((data, i) => {
                let color = data.type.name
                colorPokemonType.forEach((data, i) => {
                    if (data[0] == color) {
                        backgroundColor = data[1];
                    }
                })

                list += `<li class="pokemons-list-item__types-li" data-type=${data.type.name} style="background: linear-gradient(to top, ${backgroundColor}, #fff); border:solid 1px ${backgroundColor};">${data.type.name}</li>`
            })
            pokemonsList.innerHTML +=
                `<li class="pokemons-list-item" data-id=${data.id}>
                    <img src=${data.sprites.front_default} class="pokemons-list-item__img">
                    <h3 class="pokemons-list-item__title">${data.name}</h3>
                    <ul class="pokemons-list-item__types">
                        ${list}
                    </ul>
                </li>`
        })
        selectedView();
    }

    // Click On Pokemons Item 
    selectedView = () => {
        let pokemonsImg = document.querySelectorAll('.pokemons-list-item');
        pokemonsImg.forEach((data) => {
            data.addEventListener('click', (event) => {
                if (event.target.classList.value == 'pokemons-list-item__types') {
                    console.log(event.target.innerText)
                } else console.log(event.currentTarget.getAttribute('data-id'))
            })
        })
    }

    // Click Load More
    loadMore.addEventListener("click", function () {
        fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${pokemonListSize}&limit=12`)
            .then(data => {
                return data.json();
            })
            .then(data => {
                pokemonList = data.results;
                fetchPokemonData()
            })
        pokemonListSize = pokemonListSize + 12
    })
})()