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
        
        // console.error("Error retrieving books:", err);

        if (err.code === "ENOENT") {
            // Handle specific error for file not found
            res.status(500).send("Error: books.json file not found");
        } else {
            res.status(500).send("Error retrieving books"); // Generic message for users
        }
    }
});

app.post("/books", async (req, res) => {
    

    // debugger;
    try {
        
        const book=req.body;
        
        const validationError = validateBookData(book);
        if (validationError) {
            return res.status(400).send(validationError);
        }

        // Access and parse books data with specific error handling
        try {
            const data = await fs.promises.readFile("./books.json", "utf8");
            const parsedData = JSON.parse(data);

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
            console.error("Error handling books.json:", err);

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
        console.error("Unexpected error:", err); // Log any other unexpected errors
        res.status(500).send("Internal server error");
    }
});

//

app.get("/books/:id", async (req, res) => {
    console.log(req.params);
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
            console.error("Error handling books.json:", err);

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
        console.error("Unexpected error:", err); // Log other unexpected errors
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
                    console.error("Error writing books.json:", err);
                    res.status(500).send("Error updating book data");
                }
            } else {
                res.status(404).send("Book not found");
            }
        } catch (err) {
            console.error("Error handling books.json:", err);

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
        console.error("Unexpected error:", err); // Log any other unexpected errors
        res.status(500).send("Internal server error");
    }
});

app.put("/books/:id", (req, res) => {
    try {
        // Validate input

        if (!req.params.id || isNaN(req.params.id)) {
            return res.status(400).send("Invalid book ID");
        }

        // Ensure JSON content type
        if (!req.is("application/json")) {
            return res.status(415).send("Unsupported Media Type");
        }

        fs.access("./books.json", fs.constants.F_OK, (err) => {
            if (err) {
                return res.status(500).send("Error: books.json file not found");
            }

            fs.readFile("./books.json", "utf8", (err, data) => {
                if (err) {
                    return res
                        .status(500)
                        .send("Error reading books.json file");
                }

                try {
                    const parsedData = JSON.parse(data);
                    const bookIndex = parsedData.findIndex(
                        (book) => book.id === parseInt(req.params.id),
                    );

                    if (bookIndex !== -1) {
                        // Validate incoming book data structure (replace with your validation logic)
                        const validationError = validateBookData(req.body);
                        if (validationError) {
                            return res.status(400).send(validationError);
                        }

                        parsedData[bookIndex] = req.body; // Replace with updated book data
                        const updatedJson = JSON.stringify(parsedData, null, 2);
                        fs.writeFile("./books.json", updatedJson, (err) => {
                            if (err) {
                                return res
                                    .status(500)
                                    .send("Error writing books.json file");
                            }
                            console.log(req.body);
                            res.status(200).send(req.body); // No content response for successful update
                        });
                    } else {
                        res.status(404).send("Book not found");
                    }
                } catch (parseError) {
                    res.status(500).send("Error parsing books.json file");
                }
            });
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send("Internal server error");
    }
});

app.listen(port, () => {
    console.log("Server is running on port 3000");
});