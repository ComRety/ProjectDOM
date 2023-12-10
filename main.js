const input = document.querySelector('.input');
const auto = document.querySelector('.autocomplete');
const ul = document.querySelector('.list');
ul.addEventListener('click', function(e) {
    if(e.target.tagName === 'IMG'){
        const del = e.target.closest('.list__li');
        del.remove();
    }
})

function debounce(fn, ms) {
    let timeout;

    return function() {
        if(input.value === '' || input.value === ' ') {
            auto.innerHTML = '';
        }
        const fnCall = () => {
            if(input.value !== '' && input.value !== ' ') {
                fn.apply(this, arguments)
            }
        };

        clearTimeout(timeout);
        
        timeout = setTimeout(fnCall, ms);
    }
}


function autocomplit(e) {
    fetch(`https://api.github.com/search/repositories?q=${e.target.value}`)
    .then(response => {
        return response.json();
    })
    .then(el => {
        if(el.total_count >= 5) {
            let array = [];
            for(let i = 0; i < 5; i++) {
                array.push(el.items[i]);
            }
            autoComplit(array);
        } else if (el.total_count < 5) {
            let array = [];
            for(let i of el.items) {
                array.push(i);
            }
            autoComplit(array);
        }
    })
    .catch(error => console.log(error));
}

autocomplit = debounce(autocomplit, 500);

document.querySelector('input').addEventListener('keyup', autocomplit);

function constructor(name, owner, stars) {
    ul.insertAdjacentHTML('beforeend', 
    `<li class='list__li'>
        <div>
            <p class='par'>
                <span class='parameters'>Name:</span>
                <span id='parametersName'>${name}</span>
            </p>
            <p class='par'>
                <span class='parameters'>Owner:</span>
                <span id='parametersOwner'>${owner}</span>
            </p>
            <p class='par'>
                <span class='parameters'>Stars:</span>
                <span id='parametersStars'>${stars}</span>
            </p>
        </div>
            <button class='delete'>
            <img src="/deleteButton.png" alt="Удалить" width="80" height="80">
            </button>
        </div>
    </li>`)
}

function autoComplit(arr) {
    auto.innerHTML = '';
    for(let i = 0; i < arr.length; i++) {
        auto.insertAdjacentHTML("beforeend", `<li class='autocomplete__list' id='${i}'>${arr[i].name}</li>`);  
    }
    auto.addEventListener('click', function(e) {
        if(e.target.tagName === 'LI'){
            const append = e.target.closest('.autocomplete__list');
            const id = Number(append.id);
            constructor(arr[id].name, arr[id].owner.login, arr[id].stargazers_count);
        }
    })
}