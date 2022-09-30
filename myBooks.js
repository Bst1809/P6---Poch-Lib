// Book object
class books {
  constructor(id,title,author,description,img) {
    this.id = id;
    this.title = title;
	this.author = author;
	this.description = description;
	this.img = img;
  }
}

// Buttons  
    //addButton
const addButton = document.createElement("button");
addButton.id = "addButton";
addButton.innerHTML = "Ajouter un livre";
    //searchButton
const searchButton = document.createElement("button");
searchButton.id = "searchButton";
searchButton.innerHTML = "Rechercher";
    //cancelButton
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
    for (let i = 0; i < sessionStorage.length; i++){
      let id = sessionStorage.key(i);
	  let favoriteBook=JSON.parse(sessionStorage.getItem(id));
	  addFavoriteList(favoriteBook);
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
    document.getElementById("searchListBox").style.display = "none";
});

// Event handler : WHEN click on searchButton => search and display book whith Google Books API
searchButton.addEventListener("click", async function() {

    let searchTitle = document.getElementById("titleInput").value; 
    let searchAuthor = document.getElementById("authorInput").value;

    // TODO : Fill both inputs in order to display search
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
                //Variables
				    let title =bookData.volumeInfo.title;
                    let id = bookData.id;
                    let author = bookData.volumeInfo.authors;
                    let description = bookData?.searchInfo?.textSnippet?bookData.searchInfo.textSnippet:"Information manquante"; // TODO : if no description => display message
                    let img= bookData?.volumeInfo?.imageLinks?.thumbnail?bookData.volumeInfo.imageLinks.thumbnail:"Images/unavailable_thumbnail.jpg"; // TODO : if no image => display image "no image"
				
				let book = new books(id,title,author,description,img);
                // Book card
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

                const bookmark = document.createElement("i"); // Bookmark Add To Favorite
                bookmark.setAttribute("class", "fa-regular fa-heart fa-3x");
                bookmark.id = "favoriteButton"+book.id; // Each favorite bookmark gets its unique ID
                txtBox.appendChild(bookmark);

                const cardHeader = document.createElement("h3");
                cardHeader.innerHTML = book.title;
                txtBox.appendChild(cardHeader);

                const cardId = document.createElement("h4");
                cardId.innerHTML ="Id : " + book.id;
                txtBox.appendChild(cardId);

                const cardAuthor = document.createElement("h4");
                cardAuthor.innerHTML = "Auteur : " + book.author;
                // TODO : if more than 1 author, just display first author
                    if (book.author > 1) {
                        book.author = book.author.slice(0, 2);
                    }
                txtBox.appendChild(cardAuthor);

                const cardDescription = document.createElement("p");
                cardDescription.setAttribute("class", "cardDescription");
                cardDescription.innerHTML = book.description;
                // TODO : max length description = 200 characters
                    if (cardDescription.innerHTML.length > 200) {
                        cardDescription.innerHTML = cardDescription.innerHTML.substring(0, 200) + '...';
                    }
                txtBox.appendChild(cardDescription);
                bookBox.appendChild(txtBox);

                // Special feature : if searched book is already in favorite list => add to favorite bookmark display is solid 
	            let favoriteBook=JSON.parse(sessionStorage.getItem(book.id));
				if(favoriteBook)bookmark.setAttribute("class", "fa-solid fa-heart fa-3x");

                // Event handler : WHEN click on bookmark => add to favorite list
                bookmark.addEventListener ("click", () => { 
				bookmark.setAttribute("class", "fa-solid fa-heart fa-3x");
					if (sessionStorage.getItem(book.id)) {
						alert("Vous ne pouvez ajouter deux fois le même livre");
					} else {
						addFavoriteStorage(book);
					}                                                 
                })                       
                searchList.appendChild(bookBox);
            });
        }       
    }
})
// Function addFavoriteStorage : add favorite book to session storage
function addFavoriteStorage(book){
	sessionStorage.setItem(book.id,JSON.stringify(book));
	addFavoriteList(book);
} 
// Function addFavoriteList : creates book card for favorite book
function addFavoriteList(favoriteBook){
	        const favoriteBookCard = document.createElement("section");
            favoriteBookCard.id = "favorite" + favoriteBook.id;

            const imgBox = document.createElement("div");
            imgBox.id = "imgBox";

            const cardImg = document.createElement("img");
            cardImg.id = "cardImg";
            cardImg.src = favoriteBook.img;

            favoriteBookCard.appendChild(imgBox);
            imgBox.appendChild(cardImg);

            const txtBox = document.createElement("div");
            txtBox.id = "txtBox";

            const bookmark = document.createElement("i"); // Bookmark Delete from Favorite
            bookmark.setAttribute("class", "fa-regular fa-trash-can fa-3x");
            bookmark.id = "binButton";
            txtBox.appendChild(bookmark);

            const cardTitle = document.createElement("h3");
            cardTitle.innerHTML = favoriteBook.title;
            txtBox.appendChild(cardTitle);

            const cardId = document.createElement("h4");
            cardId.innerHTML = "Id : " +  favoriteBook.id;
            txtBox.appendChild(cardId);

            const cardAuthor = document.createElement("h4");
            cardAuthor.innerHTML = "Auteur : " + favoriteBook.author;
            txtBox.appendChild(cardAuthor);

            const cardDescription = document.createElement("p");
            cardDescription.setAttribute("class", "cardDescription");
            cardDescription.innerHTML = favoriteBook.description;
            
            txtBox.appendChild(cardDescription);
            favoriteBookCard.appendChild(txtBox);

            favoriteList.appendChild(favoriteBookCard);

            // Event handler : WHEN click on binButton => delete book from favorite list
             bookmark.addEventListener('click', function () 
            {  
				favoriteList.removeChild(favoriteBookCard);
                sessionStorage.removeItem(favoriteBook.id);
				let bookmarkOriginal=document.getElementById("favoriteButton"+favoriteBook.id);
				if(bookmarkOriginal)bookmarkOriginal.setAttribute("class", "fa-regular fa-heart fa-3x");
            });
	       favoriteList.appendChild(favoriteBookCard);
}






  
