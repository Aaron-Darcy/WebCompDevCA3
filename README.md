# Web Component Development Project Year 4 Semester 1 

App created using react where you can log-in as a customer or administrator. Customer can log in and place orders for books whereas an administrator can edit stock and books for sale. They can also add books via JSON. Books are stored with MongoDB and express JS. 
## Description/Instructions

Instructions:
For this assignment, you are requested to use React and MongoDB to create an app for a
small bookstore. The admin of the system should be able to insert, read, update, and delete
book details. As a minimum the book details stored should include: title, ISBN, author, book
category (fiction, history, children, educational etc.), price and number in stock.
To help admin with book insertions, a facility to add books from a JSON file should be
provided.
The system also needs to provide an interface that allows customers to search and buy
books. The book searches should be on title, genre and author. Customers may select/view
an individual book either by book title or the ISBN before purchasing. Customer should be
allowed to buy more than one copy of a book but no more than five copies of a book.
For the app GUI, use features like switching dark/ light backgrounds as used in Tailwindcss.
A GitHub repository has been setup for each student for this CA. Evidence of regular updates must
be shown throughout the CA. Failure to commit and pull code on GitHub will result in no marks
been awarded.
Marking scheme
Admin CRUD ops 30%
Updating book stock amounts 10%
Automatic insertion from file 10%
Search for book Title/Genre/Author 20%
Web GUI 30%

## Quickstart
```bash
git clone https://github.com/Aaron-Darcy/WebCompDevCA3 WebCompDevCA3
cd WebCompDevCA3

# install the dependencies
npm install

# start the server
npm start
server will run on port 3000

cd backend
node server.js
server will run on port 3001

ensure mongo is running on the default url with a db called BookShop and a collection labelled books

```




## Images
![image](https://github.com/Aaron-Darcy/WebCompDevCA3/assets/48316970/cbadd67f-c4d0-4d94-b6b5-0ae727a44a6f)
![image](https://github.com/Aaron-Darcy/WebCompDevCA3/assets/48316970/ee2066fb-2091-42d8-80a2-97bba70b7bf5)
![image](https://github.com/Aaron-Darcy/WebCompDevCA3/assets/48316970/44fa84cc-ce75-4739-8b96-f9ab7a739824)
![image](https://github.com/Aaron-Darcy/WebCompDevCA3/assets/48316970/5c80d6fc-2815-4864-b8df-e135e46137e7)
