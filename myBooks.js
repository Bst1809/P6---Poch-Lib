// Creation of buttons in DOM
const addButton = document.createElement("button");
const searchButton = document.createElement("button");
const cancelButton = document.createElement("button");
cancelButton.setAttribute("id", "cancelButton")

// Buttons' name
addButton.innerHTML = "Ajouter un livre";
searchButton.innerHTML = "Rechercher";
cancelButton.innerHTML = "Annuler";

// Append add button to <hr>
const hr = document.getElementsByTagName("hr")[0];
hr.appendChild(addButton);

// Creation of labels for search inputs
const titleLabel = document.createElement("h3");
titleLabel.innerHTML = "Titre du livre : ";

const authorLabel = document.createElement("h3");
authorLabel.innerHTML = "Auteur-e du livre : ";

// Creation of search inputs in DOM
    //Title Input
const titleInput = document.createElement("input");
titleInput.setAttribute("id", "titleInput");
titleInput.setAttribute("type", "search");
titleInput.placeholder = "Exemple : 1984";
    // Author Input
const authorInput = document.createElement("input");
authorInput.setAttribute("id","authorInput");
authorInput.setAttribute("type", "search");
authorInput.placeholder = "Exemple : George Orwell";

// Creation of div container for search list
const searchList = document.createElement("div");
searchList.setAttribute("id","searchList");
content.appendChild(searchList);


// Event handler : CLICK on addButton => addButton is replaced by searchButton and cancelButton
addButton.addEventListener ("click", function(){
    hr.removeChild(addButton);
    hr.appendChild(titleLabel);
    hr.appendChild(titleInput);
    hr.appendChild(authorLabel);
    hr.appendChild(authorInput);
    hr.appendChild(searchButton);
    hr.appendChild(cancelButton);
});

// Event handler : CLICK on cancelButton => Clear <hr> and regeneration of addButton
cancelButton.addEventListener ("click", function(){
    document.querySelector("hr").innerHTML = "";
    document.getElementById("searchList").innerHTML = "";
    document.getElementsByTagName("h2")[1].innerHTML = "Ma poch'liste ";
    hr.appendChild(addButton);

});

// Event handler : CLICK on searchButton
searchButton.addEventListener("click", async function() {

    var searchTitle = document.getElementById("titleInput").value; 
    var searchAuthor = document.getElementById("authorInput").value;

    if ((searchTitle || searchAuthor) === "" || (searchTitle || searchAuthor) === null) {
        alert("Merci de remplir les champs titre ET auteur-e");
    } else {   

        const response = await fetch("https://www.googleapis.com/books/v1/volumes?q="+searchTitle + "+inauthor:" + searchAuthor + "&key=AIzaSyC4BzkgE2fpVlMpcAJBSx_YEYclTDQLjTU");
        const bookData = await response.json();

        if (bookData.totalItems === 0) {
            alert("Aucun livre n'a été trouvé");

        } else {
            // Replace title by "Ma Recherche" and clear previous search
            document.getElementsByTagName("h2")[1].innerHTML = "Ma Recherche";
            document.getElementById("searchList").innerHTML = "";

            // Loop to get each books' elements
            bookData.items.forEach(bookData => {
                var title = bookData.volumeInfo.title;
                var id = bookData.id;
                var author = bookData.volumeInfo.authors;
                var description = bookData?.searchInfo?.textSnippet?bookData.searchInfo.textSnippet:"Information manquante";
                var image = bookData?.volumeInfo?.imageLinks?.thumbnail?bookData.volumeInfo.imageLinks.thumbnail:"Images/unavailable_thumbnail.jpg";
                const bookBox = document.createElement("section");

                // Creation of book container
                bookBox.innerHTML =
                `<div id = "imgBox">
                <div class="image">
                <img src="${image}"/>
                </div>
                </div>
                <div id = "txtBox">
                <div id = "bookmark"><i class="fa-regular fa-bookmark fa-4x" onclick = addToFavorite('${id}')></i></div>
                <h3 class="titre">${title}</h3>
                <div class="id">Id : ${id}</div>
                <div class="auteur">Auteur(s) : ${author}</div>
                <div class="description">${description}</div>
                </div>`;
                                    
                searchList.appendChild(bookBox);  
            });

        }
                
    }
})




  
