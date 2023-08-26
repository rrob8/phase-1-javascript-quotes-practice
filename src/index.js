
const quoteList = document.getElementById('quote-list')


fetch(`http://localhost:3000/quotes?_embed=likes`)
.then(response => response.json())
.then(data => renderQuotes(data))


function renderQuotes (data) {
    console.log(data)
    data.forEach (phrase => {
    const quoteCard = document.createElement('li')
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
    likeBtn.textContent ="Likes: "
    const span = document.createElement('span')
    likeBtn.append(span)
    span.textContent = 0
    block.append(likeBtn)

    const deleteBtn = document.createElement('button')
    deleteBtn.className ='btn-danger'
    deleteBtn.textContent ='Delete'
    block.append(deleteBtn)

    quoteCard.append(block)
    quoteList.append(quoteCard)
    
    })
}