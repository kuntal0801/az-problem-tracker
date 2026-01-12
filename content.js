const bookmarkImageURL =  chrome.runtime.getURL("assets/bookmark.png");
const AZ_PROBLEM_KEY = "AZ_PROBLEM_KEY";

const observer = new MutationObserver(() => {
    addBookmarkButton();
});
observer.observe(document.body, {childList: true, subtree: true}); 

addBookmarkButton();

function onProblemsPage(){
    const azProblemUrlPath = window.location.pathname;
    return azProblemUrlPath.includes('/problems/');
}

function addBookmarkButton(){
    if(!onProblemsPage() || document.getElementById('add-bookmark-button')) return;

    const bookmarkButton = document.createElement("img");
    bookmarkButton.setAttribute('id', 'add-bookmark-button');
    bookmarkButton.src = bookmarkImageURL;
    bookmarkButton.alt = 'bookmark problem';
    
    const style = document.createElement("style");
    style.textContent = `
    #add-bookmark-button {
        height: 30px,
        width: 30px,
        cursor: pointer
        transition: filter 0.2s ease;
    }
    #add-bookmark-button:hover {
        filter:
        drop-shadow(0 0 6px #ffd700)
        drop-shadow(0 0 12px #ffd700);
    }
    `;
    document.head.appendChild(style);

    const problemDesc = document.getElementsByClassName('coding_runBtn__JDrPy')[0];
    problemDesc.insertAdjacentElement("beforebegin", bookmarkButton);

    bookmarkButton.addEventListener("click", addNewBookMarkHandler);
}

async function addNewBookMarkHandler() {
    const currentBookmarks = await getCurrentBookMarks();

    const azProblemUrl = window.location.href;
    const uniqueID = extractUniqueID(azProblemUrl);
    const problemName = document.getElementsByClassName('coding_problem_info_heading__G9ueL')[0].textContent;
    
    if(currentBookmarks.some((bookmark) => bookmark.id === uniqueID)) return;

    const bookmarkObj = {
        id: uniqueID,
        name: problemName,
        url: azProblemUrl
    };

    const updatedBookmarks = [...currentBookmarks, bookmarkObj];
    const setBookMarksResponse = await setBookMarks(updatedBookmarks);
}

function extractUniqueID(url){
    const start = url.indexOf('problems/') + 'problems/'.length;
    const end = url.indexOf('?', start);
    return (end === -1) ? url.slice(start) : url.slice(start, end);
}

function getCurrentBookMarks() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([AZ_PROBLEM_KEY], (results) => {
            resolve(results[AZ_PROBLEM_KEY] || []);
        });
    });
}

function setBookMarks(updatedBookmarks){
    return new Promise((resolve, reject) =>{
        chrome.storage.sync.set({AZ_PROBLEM_KEY: updatedBookmarks}, () => {
            resolve(updatedBookmarks);
        });
    });
}
