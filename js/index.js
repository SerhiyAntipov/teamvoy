    (function () {

        let colorPokemonType = []
        let pokemonOnPage = 12;
        let pokemonListSize = pokemonOnPage;
        let pokemonListData = [];
        let pokemonList;
        let closePokemonInformation;

        const pokemonsList = document.querySelector('.pokemons-list');
        const loadMore = document.querySelector('.load-more');
        const pokemonInformation = document.querySelector('.pokemon-information');

        fetchPokemonType();

        // Get Pokemon Type & Add random color
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
        fetchPokemonList = (pokemonOnPage) => {
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
        fetchPokemonData = (pokemonList) => {
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
            clickOnPokemon();
        }

        // Click On Pokemons Item 
        clickOnPokemon = () => {
            let pokemonsImg = document.querySelectorAll('.pokemons-list-item');
            pokemonsImg.forEach((data) => {
                data.addEventListener('click', (event) => {
                    if (event.target.classList.value == 'pokemons-list-item__types-li') {
                        console.log(event.target.innerText)
                    } else {
                        renderPokemonInformation(event.currentTarget.getAttribute('data-id'))
                        pokemonInformation.classList.remove('hidden');
                        closeInformation();
                    }
                })
            })
        }


        closeInformation = () =>{
            closePokemonInformation = document.querySelector('.close');
            closePokemonInformation.addEventListener( 'click', () =>{
                pokemonInformation.classList.add('hidden');
            })
        }

        //Render Pokemon Information
        renderPokemonInformation = (id) => {
            let sellektPokemonData = "";
            let pokemonInformation = '';
            let list = "";

            pokemonListData.forEach((data, i) => {
                if (data.id == id) {
                    sellektPokemonData = data;

                    if (data.types.length == 1) {
                        list = `<tr>
                            <td class="namename-characteristic"> Type </td>
                            <td class="value-characteristic">${data.types[0].type.name}</td>
                        </tr>`
                    } else {
                        data.types.forEach((data, i) => {
                            list += `<tr>
                                <td class="namename-characteristic"> Type </td>
                                <td class="value-characteristic">${data.type.name}</td>
                            </tr>`
                        })
                    }
                }
            })
            let spd = sellektPokemonData;
            pokemonInformation = `
            <div class="pokemon-information-wrapper">
                <div class="close"></div>
                <img class="pokemons-list-item__img" src=${spd.sprites.front_default} alt="Sellect Pokemon Photo">
                <table class="pokemon-information-table">
                        <caption>${spd.name}  #00${spd.id}</caption>
                    ${list}
                    <tr class="tr">
                        <td class="namename-characteristic">${spd.stats[4].stat.name}</td>
                        <td class="value-characteristic">${spd.stats[4].base_stat}</td>
                    </tr>
                    <tr class="tr">
                        <td class="namename-characteristic">${spd.stats[3].stat.name}</td>
                        <td class="value-characteristic">${spd.stats[3].base_stat}</td>
                    </tr>
                    <tr class="tr">
                        <td class="namename-characteristic">${spd.stats[5].stat.name}</td>
                        <td class="value-characteristic">${spd.stats[5].base_stat}</td>
                    </tr>
                    <tr class="tr">
                        <td class="namename-characteristic">${spd.stats[2].stat.name}</td>
                        <td class="value-characteristic">${spd.stats[2].base_stat}</td>
                    </tr>
                    <tr class="tr">
                        <td class="namename-characteristic">${spd.stats[1].stat.name}</td>
                        <td class="value-characteristic">${spd.stats[1].base_stat}</td>
                    </tr>
                    <tr class="tr">
                        <td class="namename-characteristic">${spd.stats[0].stat.name}</td>
                        <td class="value-characteristic">${spd.stats[0].base_stat}</td>
                    </tr>
                    <tr class="tr">
                        <td class="namename-characteristic">Weight</td>
                        <td class="value-characteristic">${spd.weight}</td>
                    </tr>
                    <tr class="tr">
                        <td class="namename-characteristic">Total moves</td>
                        <td class="value-characteristic">${spd.moves.length}</td>
                    </tr>
                </table>
            </div>
            `
            document.querySelector('.pokemon-information').innerHTML = pokemonInformation;
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
        });
    })()