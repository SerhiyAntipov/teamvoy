(function () {

    let pokemonsList = document.querySelector('.pokemons-list');
    let colorPokemonType = []
    let pokemonOnPage = 12;
    let pokemonListSize = pokemonOnPage;
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
                fetchPokemonList(pokemonOnPage);
            })
    };

    // Pokemon List
    function fetchPokemonList(pokemonOnPage) {
        fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${pokemonOnPage}`)
            .then(data => {
                return data.json();
            })
            .then(data => {
                pokemonList = data.results;
                fetchPokemonData(pokemonList)
            })
    };

    // Pokemon Data
    function fetchPokemonData(pokemonList) {
        let tempData = []
        pokemonList.forEach((object) => {
            fetch(object.url)
                .then(data => {
                    return data.json();
                })
                .then(data => {
                    pokemonListData.push(data);
                    tempData.push(data);
                    if (tempData.length >= pokemonList.length) {
                        renderPokemonsList(tempData);
                    }
                })
        })
    }

    // Render Pokemons List
    renderPokemonsList = (tempData) => {
        console.log(pokemonListData)
        tempData.forEach((data, i) => {
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
                if (event.target.classList.value == 'pokemons-list-item__types-li') {
                    console.log(event.target.innerText)
                } else {
                    console.log(event.currentTarget.getAttribute('data-id'))
                }
            })
        })
    }

    // Click Load More
    loadMore.addEventListener("click", function () {
        fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${pokemonListSize}&limit=${pokemonOnPage}`)
            .then(data => {
                return data.json();
            })
            .then(data => {
                data = data.results;
                fetchPokemonData(data)
            })
        pokemonListSize = pokemonListSize + pokemonListSize
    })
})()