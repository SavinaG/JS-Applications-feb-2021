async function getRecipes() {
    let url = 'http://localhost:3030/jsonstore/cookbook/recipes';
    let main = document.querySelector('main');

    try {
        let response = await fetch(url);
        if (response.ok == false) {
            throw new Error(response.statusText);
        };
        let recipes = await response.json();
        main.innerHTML = '';
        Object.values(recipes).map(createPreview).forEach(r => main.appendChild(r));

    } catch (error) {
        alert(error.message);
    }
}

function createPreview(recipe) {
    let result = e('article', { className: 'preview' },
        e('div', { className: 'title' }, e('h2', {}, recipe.name)),
        e('div', { className: 'small' }, e('img', { src: recipe.img }))
    );

    result.addEventListener('click', () => getRecipeDetails(recipe._id, result));

    return result;
}

async function getRecipeDetails(id, preview) {
    let url = `http://localhost:3030/jsonstore/cookbook/details/${id}`;

    let response = await fetch(url);
    let data = await response.json();

    let result = e('article', {},
        e('h2', { onClick: toggleCard }, data.name),
        e('div', { className: 'band' },
            e('div', { className: 'thumb' }, e('img', { src: data.img })),
            e('div', { className: 'ingredients' },
                e('h3', {}, 'Ingredients:'),
                e('ul', {}, data.ingredients.map(i => e('li', {}, i)))
            )
        ),
        e('div', { className: 'description' },
            e('h3', {}, 'Preparation:'),
            data.steps.map(s => e('p', {}, s))
        )
    );
    preview.replaceWith(result);

    function toggleCard() {
        result.replaceWith(preview);
    }
}

window.addEventListener('load', () => {
    getRecipes();
});

function e(type, attributes, ...content) {
    let result = document.createElement(type);

    for (let [attr, value] of Object.entries(attributes || {})) {
        if (attr.substring(0, 2) == 'on') {
            result.addEventListener(attr.substring(0, 2).toLocaleLowerCase(), value);
        } else {
            result[attr] = value;
        }
    }

    content = content.reduce((a, c) => a.concat(Array.isArray(c) ? c : [c]), []);

    content.forEach(e => {
        if (typeof e == 'string' || typeof e == 'number') {
            let node = document.createTextNode(e);
            result.appendChild(node);
        } else {
            result.appendChild(e);
        }
    });

    return result;
}