async function lockedProfile() {
    let mainElement = document.getElementById('main');
    try {
        mainElement.removeChild(mainElement.firstElementChild); 
    
        let profileList = `http://localhost:3030/jsonstore/advanced/profiles`;
    
        let response = await fetch(profileList);
        let data = await response.json();
    
        Object.values(data)
            .map(x => createProfile(x)).join('');
    } catch (error){
        console.log(error);
    }

    function createProfile(data) {
        let result = `
        <div class="profile">
            <img src="./iconProfile2.png" class="userIcon" />
            <label>Lock</label>
            <input type="radio" name="${data._id}" value="lock" checked>
            <label>Unlock</label>
            <input type="radio" name="${data._id}" value="unlock"><br>
            <hr>
            <label>Username</label>
            <input type="text" name="${data.username}" value="${data.username}" disabled readonly />
            <div id="${data._id}" style="display:none">
                <hr>
                <label>Email:</label>
                <input type="email" name="${data.email}" value="${data.email}" disabled readonly />
                <label>Age:</label>
                <input type="email" name="${data.age}" value="${data.age}" disabled readonly />
            </div>
            <button class = "btn-show">Show more</button>
        </div>`;

        return mainElement.innerHTML += result;
    }
    mainElement.addEventListener('click', loadInfo)

    function loadInfo(e) {
        if (e.target.className !== 'btn-show') {
            return
        }
        let btnShow = e.target
        let isLocked = e.target.parentElement.querySelector('input').checked
        let moreInfo = e.target.parentElement.querySelector('div')
        if (isLocked === false) {
            btnShow.innerHTML = btnShow.innerHTML === 'Show more' ? 'Hide it' : 'Show more'
            btnShow.innerHTML === 'Hide it' ? moreInfo.style.display = 'block' : moreInfo.style.display = 'none'
        }
    }
}