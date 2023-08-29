
const quoteList = document.getElementById('quote-list')
let authorList =[]

document.addEventListener('DOMContentLoaded', () => { 
fetch(`http://localhost:3000/quotes`)
.then(response => response.json())
.then(data => renderQuotes(data))
            

})


function renderQuotes (data) {
    authorList =[]
        data.forEach (phrase => {
            
            authorList.push(phrase.author)

    const quoteCard = document.createElement('li')
    quoteCard.id = phrase.id
    quoteCard.className = 'quote-card'

    const block = document.createElement('blockquote')
    const quoteText = document.createElement('p')
    quoteText.className = 'mb-0'
    quoteText.textContent = `"${phrase.quote}"`

    block.append(quoteText)
    
    const footer = document.createElement('footer')
    footer.className ='blockquote-footer'
    footer.textContent = phrase.author 
    block.append(footer)

    const likeBtn = document.createElement('button')
    likeBtn.className = 'btn-success'
    likeBtn.id = phrase.id
    likeBtn.textContent ="Likes: "
    const span = document.createElement('span')
    likeBtn.append(span)

    
    if (phrase.likes == undefined){
        span.textContent = 0
    }
    else {
        span.textContent = phrase.likes
    }
    
    block.append(likeBtn)
    

    const deleteBtn = document.createElement('button')
    deleteBtn.className ='btn-danger'
    deleteBtn.id = phrase.id
    deleteBtn.textContent ='Delete'
    block.append(deleteBtn)

    const editBtn = document.createElement('button')
    editBtn.id = phrase.id
    editBtn.className = 'edit'
    editBtn.textContent = 'Edit'
    editBtn.addEventListener('click', (e)=>{
        editQuote(quoteCard)
    })
    block.append(editBtn)






    quoteCard.append(block)
    quoteList.append(quoteCard)
    
    
    })

    
    // add all the listers
    addListeners()

    const deleteBtns = document.getElementsByClassName('btn-danger')
for (button of deleteBtns){
    button.addEventListener('click', (e)=>
    deleteQuote(e)
    )
}

    // const editBtns = document.getElementsByClassName('edit')
    // for (button of editBtns) {
    //     button.addEventListener('click', (e)=>
    //     editQuote(e)
    //     )
    // }

}


// Event listener for the like buttons
function addListeners () {
    const likeButtons = document.getElementsByClassName('btn-success')
    
   
     for (let button of likeButtons) {
        button.addEventListener('click', (e) => {
        const id = button.id
        let span = button.querySelector('span')
        span.textContent = parseInt(span.textContent) + 1
        console.log(span)
         fetch(`http://localhost:3000/quotes/${id}`, {
            method:"PATCH",
            headers: {
                "Content-Type": "application/json",
            Accept: "application/json"
            },
            body: JSON.stringify({
                "likes": parseInt(span.textContent) 
        })
         })
         .then(response => response.json())
         .then(data => data)

        })
     }
}

//Submitting the form creates a new quote and adds it to the list of quotes without having to refresh the page. Pessimistic rendering is recommended.

const submit = document.getElementById('new-quote-form')
submit.addEventListener('submit', (e) => {
    e.preventDefault()
    addQuote(e)

})


function deleteQuote (e) {
 const id = e.target.id
 console.log(id)
 fetch(`http://localhost:3000/quotes/${id}`, {
            method:"DELETE",
            headers: {
                "Content-Type": "application/json",
            Accept: "application/json"
            }
    })
.then (() => {
    quoteList.innerHTML = ''
fetch(`http://localhost:3000/quotes`)
.then(response => response.json())
.then(data => renderQuotes(data))
})
}


function addQuote (e) {
    const newQuote = document.getElementById('new-quote')
    const newAuthor = document.getElementById('author')
    console.log('i have been submitted')
    console.log(e.target)
    

    const newQuoteObj = {
        'quote': newQuote.value,
        'author': newAuthor.value,
        'likes': 0
    }
console.log(newQuoteObj)
    // add the new quote to the db

    fetch(`http://localhost:3000/quotes`,{
    method:"POST",
    headers: {
        "Content-Type": "application/json",
    Accept: "application/json"
    },
    body: JSON.stringify(newQuoteObj)
})
.then (response => response.json())
.then(data => {
    fetch(`http://localhost:3000/quotes`)
.then(response => response.json())
.then(data => renderQuotes(data))
})

} // end of function




//Add an edit button to each quote-card that will allow the editing of a quote. (Hint: there is no 'correct' way to do this. You can try creating a hidden form that will only show up when hitting the edit button.)

function editQuote(quoteCard) {
    const form = document.createElement('form')
    const quoteDiv = document.createElement('div')
    const quoteLabel = document.createElement('label')
    quoteLabel.textContent = 'New Quote...'
    form.append(quoteDiv)
    quoteDiv.append(quoteLabel)

    const authorDiv = document.createElement('div')
    const authorLabel = document.createElement('label')
    authorLabel.textContent = 'New Author...'
    form.append(authorDiv)
    authorDiv.append(authorLabel)

    const quoteInput = document.createElement('input')
    quoteDiv.append(quoteInput)

    const authorInput = document.createElement('input')
    authorDiv.append(authorInput)

    const submitBtn = document.createElement('button')
    submitBtn.textContent = 'Edit Quote'
    submitBtn.type = 'submit'
    form.append(submitBtn)

    quoteCard.append(form)



    // build out event listener for the edit submit
    form.addEventListener('submit', (e)=>{
        e.preventDefault()
        const id = quoteCard.id
         

        newQuoteObj = {
            'quote': quoteInput.value,
            'author':authorInput.value
           }

           fetch(`http://localhost:3000/quotes/${id}`, {
            method:"PATCH",
            headers: {
                "Content-Type": "application/json",
            Accept: "application/json"
            },
            body: JSON.stringify(newQuoteObj)
         })
         .then(()=>{
            quoteList.innerHTML = '';
            fetch(`http://localhost:3000/quotes`)
            .then(response => response.json())
            .then(data => renderQuotes(data))
    })
    
})

    
    
}


//Add a sort button that can be toggled on or off. When off the list of quotes will appear sorted by the ID. When the sort is active, it will display the quotes by author's name, alphabetically.

const form = document.getElementById('new-quote-form')
    const sortBtn = document.createElement('button')
    sortBtn.textContent = 'Sort Quotes: Off'
    document.querySelector('h1').append(sortBtn)

sortBtn.addEventListener('click', () => {
    
    if (sortBtn.textContent == 'Sort Quotes: On') {

        sortBtn.textContent = 'Sort Quotes: Off'
        quoteList.innerHTML = '';
        fetch(`http://localhost:3000/quotes`)
.then(response => response.json())
.then(data => renderQuotes(data))
    }
    else {
    sortQuotes()
    }
})

function sortQuotes() {
    
    
    quoteList.innerHTML = '';
        authorList.sort()
    console.log(authorList)
    fetch(`http://localhost:3000/quotes`)
    .then(response => response.json())
    .then(data => 
        {
            newData = []
            for (let i=0; i<authorList.length; i++) {
                for ( phrase of data) {
                    if ( phrase.author == authorList[i]) {
                        
                        newData.push(phrase)
                        
                    }
                }    
            }
            renderQuotes(newData)
            authorList =[]
            sortBtn.textContent = 'Sort Quotes: On'
        })
       
       
}









            // const sorted = data.sort((a,b) => a.author - b.author)
            
                
            // console.log(sorted) 