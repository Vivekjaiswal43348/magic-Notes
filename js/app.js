console.log('Magic Notes Project');

addNoteInHTMLList();
/** regular and important note */
let regularNoteElem = document.getElementById('regular');
let imprtantNoteElem = document.getElementById('important');
regularNoteElem.addEventListener('click', function(){
    regularNoteElem.style.display='none';
    important.style.display='inline';
});
imprtantNoteElem.addEventListener('click', function(){
    regularNoteElem.style.display='inline';
    important.style.display='none';
});
/** */
let addBtnElem = document.getElementById('addNoteBtn');
addBtnElem.addEventListener('click', function () {
    let userNoteElem = document.getElementById('noteDescription');
    let noteTitleElem = document.getElementById('noteTitle');
    let starImgs = document.getElementById('sub-container').getElementsByTagName('img');
    if(userNoteElem.value && noteTitleElem.value){
    let isRegular = true;
    // taking current star imgs value and resting them to default value
    Array.from(starImgs).forEach(function(element){
        if(element.id === 'regular' && getComputedStyle(element).getPropertyValue('display') === 'inline'){
            isRegular = true;
        }else if(element.id === 'important' && getComputedStyle(element).getPropertyValue('display') === 'inline'){
            isRegular = false;
        }
        if(element.id === 'regular'){
            element.style.display = 'inline';
        } else {
            element.style.display = 'none';
        }
    })
    // checking for existing localstorage notes
    let notes = localStorage.getItem('notes');
    let notesArrList;
    if (!notes) {
        // if no notes
        notesArrList = [];
    } else {
        // if notes are there
        notesArrList = JSON.parse(notes);
    }
    // pushong new note to notesArrList object
    notesArrList.push({
        desc: userNoteElem.value,
        title: noteTitleElem.value,
        isRegular: isRegular
    });
    // updating localStorage variable
    localStorage.setItem('notes', JSON.stringify(notesArrList));
    userNoteElem.value = '';
    noteTitleElem.value = '';
    addNoteInHTMLList();
} else{
    if(!userNoteElem.value && !noteTitleElem.value){
    alert('Add title and dsecrption fields properly');
    } else if (!noteTitleElem.value){
    alert('Enter title');
    } else if (!userNoteElem.value){
        alert('Enter description');
        }
}
});
/**Adding card notes dynamically */
function addNoteInHTMLList() {
    let notes = localStorage.getItem('notes');
    let notesArrList = JSON.parse(notes);
    let html = '';
    if (!notesArrList || !notesArrList.length) {
        html = '<p>NOTHING TO DISPLAY. ADD SOME NOTES.</p>'
    } else {
        notesArrList.forEach(function (element, index, arrayList) {
            html += `
                <div class="card mx-2 my-2 note-card" style="width: 18rem" 
                title="${element.isRegular?'Regular Note':'Important Note'}">
                <img src='./images/regular.png' width='16px/' style="display: ${element.isRegular ? 'inline' : 'none'}">
                <img src='./images/important.png' width='16px/' style="display: ${element.isRegular ? 'none' : 'inline'}">
                    <div class="card-body">
                        <span><b>${element.title}</b></span>
                        <p class="card-text">${element.desc}</p>
                        <button class="btn btn-primary" id="${index + 1}" onclick="handleDeleteNote(this.id)">Delete</button>
                    </div>
                </div>
    `;
        });
    }
    document.getElementById('noteID').innerHTML = html;
};
function handleDeleteNote(id) {
    // deleting localstorage stored notes, and updating the UI by calling addNoteInHTMLList()
    let notes = localStorage.getItem('notes');
    let arrNoteList = JSON.parse(notes);
    arrNoteList.splice(id - 1, 1);
    localStorage.setItem('notes', JSON.stringify(arrNoteList));
    addNoteInHTMLList();
}
/** Search filter on Search button press */
// let searchBtn = document.getElementById('searchNote');
// searchBtn.addEventListener('click', function () {
//     let allNotes = localStorage.getItem('notes');
//     let arrayNotes = JSON.parse(allNotes);
//     let searchedItem = document.getElementById('searchedItem').value;
//     let filteredArray = [];
//     // filtering matched items
//     filteredArray = arrayNotes.filter(function (element) {
//         return element.includes(searchedItem);
//     });
//     let html = '';
//     if(!arrayNotes || !arrayNotes.length){
//         // if searched without any note
//         html = 'Add some notes first';
//     } else if(!filteredArray.length){
//         // if nothing matched
//         html = 'Nothing matched';
//     } else if (filteredArray && filteredArray.length) {
//         // if some notes matched
//         filteredArray.forEach(function (element, index, arrayList) {
//             html += `
//                 <div class="card mx-2 my-2" style="width: 18rem">
//                     <div class="card-body">
//                         <h5 class="card-title">Note ${index + 1}</h5>
//                         <p class="card-text">${element}</p>
//                         <button class="btn btn-primary" id="${index + 1}" onclick="handleDeleteNote(this.id)">Delete</button>
//                     </div>
//                 </div>
//                 `;
//         });
//     }
//     document.getElementById('noteID').innerHTML = html;
// });

/** search filter on the basis of input field */
let seacrhInputElem = document.querySelector('#searchedItem');
seacrhInputElem.addEventListener('input', function(){
    let searchedText = seacrhInputElem.value;
    // getting all note cards
    let allNoteCrads = document.getElementsByClassName('note-card');
    // looping all note cards to filter matching cases
Array.from(allNoteCrads).forEach(function(element){
    let pText = element.getElementsByTagName('p')[0].innerText;
    //
    if(pText.includes(searchedText)) {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
});
});

/** Adding filter event listener for regular and impotant type notes */
let filterUlElem = document.getElementById('note-filter');
let li_list_Of_UL = filterUlElem.getElementsByTagName('li');
Array.from(li_list_Of_UL).forEach(function(element){
    element.addEventListener('click', function(e){
        let selectedOption = element.getAttribute('value');
        let dataStored = JSON.parse(localStorage.getItem('notes'));
        let dataToDisplay = [];
        switch(selectedOption){
            case 'regular':{
                dataToDisplay = dataStored.filter(function(element){
                    return element.isRegular;
                });
                break;
            }
            case 'important':{
                dataToDisplay = dataStored.filter(function(element){
                    return !element.isRegular;
                });
                break;
            }
            case 'all':{
                dataToDisplay = dataStored;
                break;
            }
            default:{
                console.log('Case not matched');
            }
        }
        let html = '';
        dataToDisplay.forEach(function(element, index){
            html += `
                <div class="card mx-2 my-2 note-card" style="width: 18rem" 
                title="${element.isRegular?'Regular Note':'Important Note'}">
                <img src='./images/regular.png' width='16px/' style="display: ${element.isRegular ? 'inline' : 'none'}">
                <img src='./images/important.png' width='16px/' style="display: ${element.isRegular ? 'none' : 'inline'}">
                    <div class="card-body">
                        <span><b>${element.title}</b></span>
                        <p class="card-text">${element.desc}</p>
                        <button class="btn btn-primary" id="${index + 1}" onclick="handleDeleteNote(this.id)">Delete</button>
                    </div>
                </div>
    `;
        });
        document.getElementById('noteID').innerHTML = html;
    });
});


/** Add notes on enter press in text area */ 
// document.getElementById('noteDescription').addEventListener('keypress', function (e) {
//     let userNoteElem = document.getElementById('noteDescription');
//     if (e.key === 'Enter' && !userNoteElem.value && userNoteElem.value !== '') {
//         // checking for existing localstorage notes
//         let notes = localStorage.getItem('notes');
//         let notesArrList
//         if (!notes) {
//             // if no notes
//             notesArrList = [];
//         } else {
//             // if notes are there
//             notesArrList = JSON.parse(notes);
//         }
//         // pushong new note to notesArrList object
//         notesArrList.push(userNoteElem.value);
//         // updating localStorage variable
//         localStorage.setItem('notes', JSON.stringify(notesArrList));
//         userNoteElem.value = '';
//         addNoteInHTMLList();
//     } else if (e.key === 'Enter') {
//         alert('Add some note');
//     }
// })

/**
 * Firther features:
 * 1. Add title to each note : done
 * 2. Mark note as important
 * 3. Seperate notes by user
 * 4. Sync and host to a web server
 */