// import books from '/books.json'
const books=require('./books.json')
function validateBookData(bookData) {
    // Basic validation checks (add more as needed)
    if (bookData === null || typeof bookData !== 'object') {
      return 'Invalid data: Data must be an object';
    }

    const requiredProperties = [ 'bookName', 'author', 'publishedYear'];
    const missingProperties = requiredProperties.filter(prop => !bookData.hasOwnProperty(prop));

    if (missingProperties.length > 0) {
      return `Missing required properties: ${missingProperties.join(', ')}`;
    }
    
    const now = new Date();
    const currentYear = now.getFullYear();
    if(bookData.publishedYear<0||bookData.publishedYear>currentYear){
        return 'Invalid published year';
    }
    
    const isBookAndAuthorNamePresent=books.find((book)=>book.bookName===bookData.bookName&&book.author===bookData.author);
    if(isBookAndAuthorNamePresent){
        return 'Same book with same author name exists';
    }
    
  
    if (typeof bookData.bookName !== 'string' || bookData.bookName.length === 0|| bookData.bookName===" ") {
      return 'bookName must be a non-empty string';
    }
  
    if (typeof bookData.author !== 'string' || bookData.author.length === 0|| bookData.author===" ") {
      return 'Author must be a non-empty string';
    }
  
    if (typeof bookData.publishedYear !== 'number') {
      return 'Invalid type for publishedYear: must be a number';
    }
    
    return null; 
  }

function getId() {
    const timestamp = Date.now().toString(); // Get current timestamp as a string
    const random = Math.random().toString(); // Get random number as a string
    const hash = timestamp + random; // Concatenate timestamp and random number
    const uniqueId = hash.split('').reduce((acc, char) => {
        const charCode = char.charCodeAt(0); // Get ASCII code of each character
        return (acc + charCode); // Sum up the ASCII codes
    }, 0);
    return uniqueId;
}



  module.exports={validateBookData,getId}