window.addEventListener('load', solution);

let section = document.getElementById('main');
async function solution() {
    try {

        let url = 'http://localhost:3030/jsonstore/advanced/articles/list';
    
        let response = await fetch(url);
        let data = await response.json();
    
        Object.values(data).forEach(a => createArticle(a));
    } catch (error) {
        console.log(error);
    }

    function createArticle(data) {
        let result = ` 
        <div class="accordion">
        <div class="head">
            <span>${data.title}</span>
            <button class="button" id=${data._id}>More</button>
        </div>
        <div class="extra">
            <p></p>
        </div>
        </div>`;
        return section.innerHTML += result;
    }

    section.addEventListener('click', getMoreInfo);

    async function getMoreInfo(e) {
        if (e.target.className !== 'button') {
            return;
        }
        let divElement = e.target.parentElement.nextElementSibling;
        if(e.target.textContent == "More"){
            divElement.style.display = "block";
            e.target.textContent = "Less";
        } else {
            divElement.style.display = "none";
            e.target.textContent = "More";
        }

        let pElement = e.target.parentElement.nextElementSibling.getElementsByTagName('p')[0];

        let infoURL = `http://localhost:3030/jsonstore/advanced/articles/details/${e.target.id}`

        let response = await fetch(infoURL);
        let infoData = await response.json();

        pElement.innerHTML = infoData.content;
    }
}