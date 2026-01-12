const bookmarkSection = document.getElementById('bookmarks');
const AZ_PROBLEM_KEY = 'AZ_PROBLEM_KEY';

// assets-map
const assetsURLMap = {
    'play': chrome.runtime.getURL('assets/play.png'),
    'delete': chrome.runtime.getURL('assets/delete.png')
};

function getCurrentBookmarks(){
    return new Promise((resolve, reject) => {
        // fetch the data
        chrome.storage.sync.get([AZ_PROBLEM_KEY], (results) => {
            const data = results[AZ_PROBLEM_KEY] || [];
            resolve(data);
        });
    });
}

document.addEventListener('DOMContentLoaded', async() => {
    const currentBookmarks = await getCurrentBookmarks();
    viewBookmarks(currentBookmarks);
});

function viewBookmarks(bookmarks){
    bookmarkSection.innerHTML = "";
    if(bookmarks.length === 0){
        bookmarkSection.innerHTML = "<i>No Bookmarks to Show</i>";
        return;
    }
    bookmarks.forEach((bookmark) => {
        addNewBookmark(bookmark);
    });
}

function addNewBookmark(bookmark){
    const newBookmark = document.createElement('div');
    const bookmarkTitle = document.createElement('div');
    const bookmarkControls = document.createElement('div');

    newBookmark.classList.add('bookmark');

    bookmarkTitle.textContent = bookmark.name;
    bookmarkTitle.classList.add('bookmark-title');

    bookmarkControls.classList.add('bookmark-controls');

    
    setControlsAttribute(assetsURLMap.play, onPlay, bookmarkControls);
    setControlsAttribute(assetsURLMap.delete, onDelete, bookmarkControls);
    
    newBookmark.appendChild(bookmarkTitle);
    newBookmark.appendChild(bookmarkControls);

    newBookmark.setAttribute('url', bookmark.url);
    newBookmark.setAttribute('bookmark-id', bookmark.id);
    
    bookmarkSection.appendChild(newBookmark);
}

function setControlsAttribute(src, handler, parentDiv){
    const controlElement = document.createElement('img');
    controlElement.src = src;
    parentDiv.appendChild(controlElement);

    controlElement.addEventListener('click', handler);
}

function onPlay(event) {
    const problemURL = event.target.parentNode.parentNode.getAttribute('url');
    window.open(problemURL, "_blank");
}
function onDelete(event) {
    const bookmarkItem = event.target.parentNode.parentNode;
    const idToRemove = bookmarkItem.getAttribute('bookmark-id');
    bookmarkItem.remove();
    
    deleteItemFromStorage(idToRemove);
}
function deleteItemFromStorage(idToRemove){
    chrome.storage.sync.get([AZ_PROBLEM_KEY], (results) => {
        const currentBookmarks = results[AZ_PROBLEM_KEY] || [];
        const updatedBookmarks = currentBookmarks.filter((bookmark) => bookmark.id !== idToRemove);
        chrome.storage.sync.set({AZ_PROBLEM_KEY: updatedBookmarks}, () => {
            console.log("Updated bookmarks list!");
        });
    });
}
