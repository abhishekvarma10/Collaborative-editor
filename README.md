Real-Time Collaborative Document Editor

A web-based document editor, similar to Google Docs, that allows multiple users to create, edit, and view documents simultaneously. Changes are synced in real-time across all connected clients, and documents are permanently saved to a database.

 Core Features

* Real-Time Collaboration**: Text changes from one user appear instantly for all other users in the same document.
* Multi-Document Support**: Create and manage an unlimited number of separate documents using unique URLs.
* Database Persistence**: Documents are saved to a MongoDB database, so data is never lost.
* Rich Text Editing**: Powered by the Quill.js editor, supporting various formatting options.
* Modern UI: A clean, responsive user interface built with Vue.js and the Vuetify component framework.

 Technology Stack

 Backend

* Node.js: JavaScript runtime environment.
* Express.js: Web server framework.
* Socket.IO: Engine for real-time, bidirectional communication.
* MongoDB: NoSQL database for document storage.
* Mongoose: Object Data Modeling (ODM) library for MongoDB and Node.js.

Frontend

* Vue.js: Progressive JavaScript framework.
* Vite: Modern frontend build tool.
* Vue Router: Official routing library for Vue.js.
* Vuetify: Material Design component framework for Vue.
* Quill.js: Rich text editor.

 Local Setup and Installation

Follow these steps to run the project on your local machine.

 Prerequisites

* Node.js (v18.x or later)
* npm (v9.x or later)
* A running local instance of MongoDB Server

 1. Clone the Repository

```
git clone [https://github.com/YOUR_USERNAME/collaborative-editor.git](https://github.com/YOUR_USERNAME/collaborative-editor.git)
cd collaborative-editor 
