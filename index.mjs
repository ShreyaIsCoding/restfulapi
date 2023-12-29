import express from "express";
import fs from "fs";
import { validateBookData, getId } from "./utility.js";

const app = express();
app.use(express.json());

const port = 3000;


app.get("/books", async (req, res) => {
    try {
        const data = await fs.promises.readFile("./books.json", "utf8");
        res.status(200).send(data);
    } catch (err) {
        if (err.code === "ENOENT") {
            // Handle specific error for file not found
            res.status(500).send("Error: books.json file not found");
        } else {
            res.status(500).send("Error retrieving books"); // Generic message for users
        }
    }
});

app.post("/books", async (req, res) => {
    try {
        
        

        // Access and parse books data with specific error handling
        try {
            const data = await fs.promises.readFile("./books.json", "utf8");
            const parsedData = JSON.parse(data);
            const book=req.body;
            const validationError = validateBookData(book,parsedData);
            if (validationError){
                return res.status(400).send(validationError);
            }
            // Add the new book
            const newId = getId();
            const newBook = {
                id: newId,
                bookName: book.bookName,
                author: book.author,
                publishedYear: book.publishedYear,
            };
            parsedData.push(newBook);
            const updatedJson = JSON.stringify(parsedData, null, 2);

            // Write updated data to file with specific error handling
            await fs.promises.writeFile("./books.json", updatedJson);

            res.status(201).send(newBook); // Send the created book in the response
        } catch (err) {
            // console.error("Error handling books.json:", err);

            if (err.code === "ENOENT") {
                return res.status(500).send("Error: books.json file not found");
            } else if (err instanceof SyntaxError) {
                return res
                    .status(500)
                    .send("Error: Invalid JSON format in books.json");
            } else {
                return res.status(500).send("Error processing books.json");
            }
        }
    } catch (err) {
        // console.error("Unexpected error:", err); // Log any other unexpected errors
        res.status(500).send("Internal server error");
    }
});

//

app.get("/books/:id", async (req, res) => {
    // console.log(req.params);
    try {
        // Validate input ID
        if (!req.params.id || isNaN(req.params.id)) {
            return res.status(400).send("Invalid ID");
        }

        // Access and parse books data with specific error handling
        try {
            const data = await fs.promises.readFile("./books.json", "utf8");
            const parsedData = JSON.parse(data);

            // Find the book
            const book = parsedData.find(
                (book) => book.id === parseInt(req.params.id),
            );

            if (book) {
                res.status(200).send(book);
            } else {
                res.status(404).send("Book not found");
            }
        } catch (err) {
            // console.error("Error handling books.json:", err);

            if (err.code === "ENOENT") {
                return res.status(500).send("Error: books.json file not found");
            } else if (err instanceof SyntaxError) {
                return res
                    .status(500)
                    .send("Error: Invalid JSON format in books.json");
            } else {
                return res.status(500).send("Error processing books.json");
            }
        }
    } catch (err) {
        // console.error("Unexpected error:", err); // Log other unexpected errors
        res.status(500).send("Internal server error");
    }
});

app.delete("/books/:id", async (req, res) => {
    try {
        // Validate input ID
        if (!req.params.id || isNaN(req.params.id)) {
            return res.status(400).send("Invalid ID");
        }

        // Access and parse books data with specific error handling
        try {
            const data = await fs.promises.readFile("./books.json", "utf8");
            const parsedData = JSON.parse(data);

            // Find and remove the book
            const bookIndex = parsedData.findIndex(
                (book) => book.id === parseInt(req.params.id),
            );
            if (bookIndex !== -1) {
                const deletedData = parsedData[bookIndex];
                parsedData.splice(bookIndex, 1);
                const updatedJson = JSON.stringify(parsedData, null, 2);

                // Write updated data to file with specific error handling
                try {
                    await fs.promises.writeFile("./books.json", updatedJson);
                    res.status(200).send(deletedData); // Send the deleted book details
                } catch (err) {
                    // console.error("Error writing books.json:", err);
                    res.status(500).send("Error updating book data");
                }
            } else {
                res.status(404).send("Book not found");
            }
        } catch (err) {
            // console.error("Error handling books.json:", err);

            if (err.code === "ENOENT") {
                return res.status(500).send("Error: books.json file not found");
            } else if (err instanceof SyntaxError) {
                return res
                    .status(500)
                    .send("Error: Invalid JSON format in books.json");
            } else {
                return res.status(500).send("Error processing books.json");
            }
        }
    } catch (err) {
        // console.error("Unexpected error:", err); // Log any other unexpected errors
        res.status(500).send("Internal server error");
    }
});


app.put("/books/:id",async (req, res) => {
    try {
        // Validate input ID
        if (!req.params.id || isNaN(req.params.id)) {
            return res.status(400).send("Invalid ID");
        }

        // Access and parse books data with specific error handling
        try {
            const data = await fs.promises.readFile("./books.json", "utf8");
            const parsedData = JSON.parse(data);
            const validationError = validateBookData(book,parsedData);
            if (validationError){
                return res.status(400).send(validationError);
            }
            // Find and remove the book
            const bookIndex = parsedData.findIndex(
                (book) => book.id === parseInt(req.params.id),
            );
            const newBook = {
                id:parseInt(req.params.id) ,
                bookName: req.body.bookName,
                author: req.body.author,
                publishedYear: req.body.publishedYear,
            };
            if (bookIndex !== -1) {

                parsedData[bookIndex]=newBook;
                // parsedData.splice(bookIndex, 1);
                const updatedJson = JSON.stringify(parsedData, null, 2);

                // Write updated data to file with specific error handling
                try {
                    await fs.promises.writeFile("./books.json", updatedJson);
                    res.status(200).send(newBook); // Send the deleted book details
                } catch (err) {
                    // console.error("Error writing books.json:", err);
                    res.status(500).send("Error updating book data");
                }
            } else {
                res.status(404).send("Book not found");
            }
        } catch (err) {
            // console.error("Error handling books.json:", err);

            if (err.code === "ENOENT") {
                return res.status(500).send("Error: books.json file not found");
            } else if (err instanceof SyntaxError) {
                return res
                    .status(500)
                    .send("Error: Invalid JSON format in books.json");
            } else {
                return res.status(500).send("Error processing books.json");
            }
        }
    } catch (err) {
        // console.error("Unexpected error:", err); // Log any other unexpected errors
        res.status(500).send("Internal server error");
    }
});

app.listen(port, () => {
    console.log("Server is running on port 3000");
});