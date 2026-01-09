const bookmarkImageURL =  chrome.runtime.getURL("assets/bookmark.png");

function addBookmarkButton(){
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

    bookmarkButton.addEventListener("click", () => alert(`Problem Bookmarked!`));
}
window.addEventListener("load", addBookmarkButton);
