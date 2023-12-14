const input = document.querySelector('.input');
const auto = document.querySelector('.autocomplete');
const ul = document.querySelector('.list');
ul.addEventListener('click', function(e) {
    if(e.target.tagName === 'IMG'){
        const del = e.target.closest('.list__li');
        del.remove();
    }
})

function constructor(array, id) {
    ul.insertAdjacentHTML('beforeend', 
    `<li class='list__li'>
        <div>
            <p class='par'>
                <span class='parameters'>Name:</span>
                <span id='parametersName'>${array[Number(id)].name}</span>
            </p>
            <p class='par'>
                <span class='parameters'>Owner:</span>
                <span id='parametersOwner'>${array[Number(id)].owner.login}</span>
            </p>
            <p class='par'>
                <span class='parameters'>Stars:</span>
                <span id='parametersStars'>${array[Number(id)].stargazers_count}</span>
            </p>
        </div>
            <button class='delete'>
            <img src="https://comrety.github.io/ProjectDOM/deleteButton.png" alt="Удалить" width="80" height="80">
            </button>
        </div>
    </li>`)
}

function autoComplit(arr) {
    for(let i = 0; i < arr.length; i++) {
        auto.insertAdjacentHTML("beforeend", `<li class='autocomplete__list' data-id='${i}'>${arr[i].name}</li>`);
        document.querySelector(`[data-id="${i}"]`).onclick = function() {
            constructor(arr, this.dataset.id);
            input.value = '';
            document.querySelectorAll('.autocomplete__list').forEach(elem => elem.remove());
            document.querySelectorAll('.autocomplete__list').forEach(el => el.removeEventListener('click', mop))
        }
    }
}

function debounce(fn, ms) {
    let timeout;

    return function() {
        const fnCall = () => {
            let trim = input.value.trim();
            if(trim.length > 0) {
                fn.apply(this, arguments)
            } else {
                input.value = '';
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