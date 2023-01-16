const cardsEl = document.getElementById('cards')


const favMoviesId = []

async function getMovieData() {
    

    for (let id of getFromLs().reverse()) {
        const res = await fetch(`https://www.omdbapi.com/?apikey=c286dd4c&i=${id}`)
        const movieData = await res.json()

        favMoviesId.push({
            id: id,
            title: movieData.Title,
            rate: movieData.imdbRating,
            runtime: movieData.Runtime,
            genre: movieData.Genre,
            plot: movieData.Plot,
            image: movieData.Poster,
            fav: true
        })
    }

    return favMoviesId
}


function getCardHtml(data) {
    const { id, image, title, rate, runtime, genre, plot, fav } = data
    return `
    <div class="card">
    <img src=${image} class="movie-image" alt="">
    <div class="card-description">
        <div class="card-title">
            <p class="movie-name">${title}</p>
            <p class="movie-rate">${rate}</p>
        </div>
        <div class="card-captions">
            <p class="movie-time">${runtime}</p>
            <p class="movie-genre">${genre}</p>
            <div class="movie-remove">
                <div class="remove-button" data-remove=${id}>
                    <img src="/images/Icon3.png" class="remove-button-image" alt="">
                </div>
                <p>Remove</p>
            </div>
        </div>
        <div class="card-text">
            <p class="movie-description">${plot}</p>
        </div>
    </div>
</div>
    `
}

async function addCards(){
    const fullData = await getMovieData()
    for(let el of fullData){
        cardsEl.innerHTML += getCardHtml(el)  
        cardsEl.innerHTML += getSeparatorHtml()
    }
}

document.addEventListener('click', (event) => {
    if(event.target.className === 'remove-button-image'){
        const targetId = event.target.parentElement.dataset.remove
        removeFromLs(targetId)
        addCards()
    }
})


function getSeparatorHtml() {
    return `<div class="separator"></div>`
}

function getFromLs() {
    const movies = JSON.parse(localStorage.getItem('favMovies'))
    return movies === null ? [] : movies
}

function removeFromLs(id){
    const newArr = getFromLs().filter(el => el!== id)
    localStorage.setItem('favMovies', JSON.stringify(newArr))
}

console.log(getFromLs())


addCards()