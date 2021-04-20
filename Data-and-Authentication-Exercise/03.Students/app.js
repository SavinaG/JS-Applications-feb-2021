function studentsDB() {
    let addBtn = document.getElementById('add-button');
    let table = document.getElementsByTagName('tbody')[0];

    loadData()
    addBtn.addEventListener('click', addStudent);

    async function addStudent(e) {
        e.preventDefault();
        let newStudent = JSON.stringify(await getFormInformation());
        await sendRequest(`http://localhost:3030/jsonstore/collections/students`, 'POST', newStudent);
        loadData();
    }

    async function loadData() {
        table.innerHTML = '';
        let data = await sendRequest(`http://localhost:3030/jsonstore/collections/students`, 'GET');
        for (const key in data) {
            genarateStudentHTML(data[key]);
        }
    }

    async function checkId() {
        let data = await sendRequest(`http://localhost:3030/jsonstore/collections/students`, 'GET');
        let last = 0;
        for (const key in data) {
            last = data[key].ID;
        }
        return last;
    }

    async function getFormInformation() {
        //Checker for empty fields can be added
        let id = await checkId();
        id === undefined ? id = 1 : id++;
        return {
            _id: id,
            firstName: document.getElementById('firstname').value,
            lastName: document.getElementById('lastname').value,
            facultyNumber: document.getElementById('faculty-number').value,
            grade: document.getElementById('grade').value
        }
    }

    function genarateStudentHTML(studentObj) {
        let newStudent =
            `<tr>
            <td>${studentObj._id}</td>
            <td>${studentObj.firstName}</td>
            <td>${studentObj.lastName}</td>
            <td>${studentObj.facultyNumber}</td>
            <td>${studentObj.grade}</td>
            </tr>`;
        table.innerHTML += newStudent;
    }

    async function sendRequest(url, method, body) {
        let requestObj = {
            method,
            body
        }
        if (body === undefined) {
            delete requestObj.body;
        }
        try {
            let response = await fetch(url, requestObj);
            if (response.status !== 200) {
                throw new Error('Something went wrong');
            }
            let data = await response.json();
            return data;
        } catch (error) {
            //Handle errors
        }
    }
}



studentsDB();