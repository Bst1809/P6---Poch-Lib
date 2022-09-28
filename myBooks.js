// Buttons  
const addButton = document.createElement("button");
addButton.id = "addButton";
addButton.innerHTML = "Ajouter un livre";
const searchButton = document.createElement("button");
searchButton.id = "searchButton";
searchButton.innerHTML = "Rechercher";
const cancelButton = document.createElement("button");
cancelButton.innerHTML = "Annuler";
cancelButton.id = "cancelButton";
    // Append Buttons to <hr>
const hr = document.getElementsByTagName("hr")[0];
hr.appendChild(addButton);

// Search Inputs
    // Title input
const titleLabel = document.createElement("h3");
titleLabel.innerHTML = "Titre du livre : ";
const titleInput = document.createElement("input");
titleInput.id = "titleInput";
titleInput.setAttribute("type", "search");
titleInput.setAttribute("class", "input");
titleInput.placeholder = "Exemple : 1984";
    // Author input
const authorLabel = document.createElement("h3");
authorLabel.innerHTML = "Auteur-e : ";
const authorInput = document.createElement("input");
authorInput.id = "authorInput";
authorInput.setAttribute("type", "search");
authorInput.setAttribute("class", "input");
authorInput.placeholder = "Exemple : George Orwell";

// Div for Favorite List (poch'liste) and search list 
    // Search list
const searchListBox = document.createElement("div");
searchListBox.id = "searchListBox";
const searchListTitle = document.createElement("h2");
searchListTitle.innerHTML = "Ma Recherche";
searchListBox.appendChild(searchListTitle);
const searchList = document.createElement("div");
searchList.setAttribute("id","searchList");
searchListBox.appendChild(searchList);
content.prepend(searchListBox);
document.getElementById("searchListBox").style.display = "none"
    // Favorite list
const favoriteList = document.createElement("div");
favoriteList.setAttribute("id","favoriteList");
content.appendChild(favoriteList);

// Event handler : WHEN page loads => display favorite list 
window.onload = () => {
let favoriteBook = JSON.parse(sessionStorage.getItem("bookmarkedBook"));
    if (!favoriteBook){
    }else
    {
        for (let i = 0; i < favoriteBook.length; i++)
        {
            const favoriteBookCard = document.createElement("section");
            favoriteBookCard.id = "favorite" + favoriteBook[i].id;

            const imgBox = document.createElement("div");
            imgBox.id = "imgBox";

            const cardImg = document.createElement("img");
            cardImg.id = "cardImg";
            cardImg.src = favoriteBook[i].img;

            favoriteBookCard.appendChild(imgBox);
            imgBox.appendChild(cardImg);

            const txtBox = document.createElement("div");
            txtBox.id = "txtBox";

            const bookmark = document.createElement("i");
            bookmark.setAttribute("class", "fa-regular fa-trash-can fa-3x");
            bookmark.id = "binButton";
            txtBox.appendChild(bookmark);

            const cardTitle = document.createElement("h3");
            cardTitle.innerHTML = favoriteBook[i].title;
            txtBox.appendChild(cardTitle);

            const cardId = document.createElement("h4");
            cardId.innerHTML = "Id : " +  favoriteBook[i].id;
            txtBox.appendChild(cardId);

            const cardAuthor = document.createElement("h4");
            cardAuthor.innerHTML = "Auteur : " + favoriteBook[i].author;
            txtBox.appendChild(cardAuthor);

            const cardDescription = document.createElement("p");
            cardDescription.setAttribute("class", "cardDescription");
            cardDescription.innerHTML = favoriteBook[i].description;
            txtBox.appendChild(cardDescription);

            favoriteBookCard.appendChild(txtBox);

            favoriteList.appendChild(favoriteBookCard);

             // Event handler : WHEN click on binButton => delete book from favorite list
             bookmark.addEventListener('click', function () 
            {   // Remove from display
                let favoriteBook = JSON.parse(sessionStorage.getItem("bookmarkedBook"));
                const bookToDelete = document.getElementById("favorite"+favoriteBook[i].id);
                favoriteList.removeChild(bookToDelete);
                // Remove from array
                favoriteBook = favoriteBook.filter((book) => book.id != favoriteBook[i].id);
                sessionStorage.setItem("bookmarkedBook", JSON.stringify(favoriteBook));
                location.reload(true);
            });
        }
    }
}

// Event handler : WHEN click on addButton => addButton is replaced by searchButton and cancelButton
addButton.addEventListener ("click", function(){
    hr.removeChild(addButton);
    hr.appendChild(titleLabel);
    hr.appendChild(titleInput);
    hr.appendChild(authorLabel);
    hr.appendChild(authorInput);
    hr.appendChild(searchButton);
    hr.appendChild(cancelButton);
});

// Event handler : WHEN click on cancelButton => Clear <hr> and Search list + regeneration of addButton + switch h2 title + reload page
cancelButton.addEventListener ("click", function(){
    document.querySelector("hr").innerHTML = "";
    document.getElementById("searchList").innerHTML = "";
    document.getElementsByTagName("h2")[1].innerHTML = "Ma poch'liste ";
    hr.appendChild(addButton);
    location.reload(true);

});

// Event handler : WHEN click on searchButton => search and display book whith Google Books API
searchButton.addEventListener("click", async function() {

    let searchTitle = document.getElementById("titleInput").value; 
    let searchAuthor = document.getElementById("authorInput").value;

    if (!searchTitle || !searchAuthor) {
        alert("Merci de remplir les champs titre ET auteur-e");
    }else 
    {   

        const response = await fetch("https://www.googleapis.com/books/v1/volumes?q="+searchTitle + "+inauthor:" + searchAuthor + "&key=AIzaSyC4BzkgE2fpVlMpcAJBSx_YEYclTDQLjTU");
        const bookData = await response.json();

        if (bookData.totalItems === 0) {
            alert("Aucun livre n'a été trouvé");

        } else 
        {
            // Replace title "Ma Poch'list" with "Ma Recherche" and clear previous search
            document.getElementById("searchListBox").style.display = "initial"
            document.getElementsByTagName("h2")[1].innerHTML = "Ma Recherche";
            document.getElementById("searchList").innerHTML = "";

            // Loop to get each books' elements
            bookData.items.forEach(bookData => {
                //Creation of book object
                let book = {
                    title : bookData.volumeInfo.title,
                    id : bookData.id,
                    author : bookData.volumeInfo.authors,
                    description : bookData?.searchInfo?.textSnippet?bookData.searchInfo.textSnippet:"Information manquante",
                    img : bookData?.volumeInfo?.imageLinks?.thumbnail?bookData.volumeInfo.imageLinks.thumbnail:"Images/unavailable_thumbnail.jpg",
                  }
                // Create book card
                const bookBox = document.createElement("section");
                const imgBox = document.createElement("div");
                imgBox.id = "imgBox";

                const cardImg = document.createElement("img");
                cardImg.id = "cardImg";
                cardImg.src = book.img;
                bookBox.appendChild(imgBox);
                imgBox.appendChild(cardImg);

                const txtBox = document.createElement("div");
                txtBox.id = "txtBox";

                const bookmark = document.createElement("i");
                bookmark.setAttribute("class", "fa-regular fa-heart fa-3x");
                bookmark.id = "favoriteButton";
                txtBox.appendChild(bookmark);

                const cardHeader = document.createElement("h3");
                cardHeader.innerHTML = book.title;
                txtBox.appendChild(cardHeader);

                const cardId = document.createElement("h4");
                cardId.innerHTML ="Id : " + book.id;
                txtBox.appendChild(cardId);

                const cardAuthor = document.createElement("h4");
                cardAuthor.innerHTML = "Auteur : " + book.author;
                    if (book.author > 1) {
                        book.author = book.author.slice(0, 2);
                    }
                txtBox.appendChild(cardAuthor);

                const cardDescription = document.createElement("p");
                cardDescription.setAttribute("class", "cardDescription");
                cardDescription.innerHTML = book.description;
                    if (cardDescription.innerHTML.length > 200) {
                        cardDescription.innerHTML = cardDescription.innerHTML.substring(0, 200) + '...';
                    }
                txtBox.appendChild(cardDescription);
                bookBox.appendChild(txtBox);
                let favoriteBook = JSON.parse(sessionStorage.getItem("bookmarkedBook"));
                let bookIdCheck = favoriteBook.find(e => e.id==book.id);
                    if (bookIdCheck){
                    bookmark.setAttribute("class", "fa-solid fa-heart fa-3x");
                    }else{};

                // Event handler : WHEN click on bookmark => add to favorite list
                bookmark.addEventListener ("click", () => {
                    // Function : add book to favorite list 
                    const addToFavorite = () => {
                    favoriteBook.push(book);
                    sessionStorage.setItem("bookmarkedBook", JSON.stringify(favoriteBook))
                    bookmark.setAttribute("class", "fa-solid fa-heart fa-3x");
                    };
                    let favoriteBook = JSON.parse(sessionStorage.getItem("bookmarkedBook"));
                    if (favoriteBook == null){
                        favoriteBook = [];
                        addToFavorite();
                    }else{
                    let bookIdCheck = favoriteBook.find(e => e.id==book.id);
                        if (bookIdCheck){
                        alert('Ce livre existe déjà dans votre pochlist');
                        }else{
                        addToFavorite();
                        }
                    }                                                    
                })                       
                searchList.appendChild(bookBox);
            });
        }       
    }
})








  
