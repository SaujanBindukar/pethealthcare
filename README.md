# Pet Health Care

This is a personal pet health care application for managing pets, health logs,
care guides, dog breeds, and veterinary services. It helps pet owners keep
important health information organized in one place and find practical care
guidance for their pets.

Users can create an account, manage pet profiles, record health activities,
explore breed-specific care plans, and find useful veterinary support.

## Tech Stack

1. HTML
2. CSS
3. JavaScript
4. Node.js and Express
5. MySQL

## Features

1. Account registration and login with JWT token and password bcrypt
2. Add, edit, delete, and view pets
3. Add, edit, and delete pet health logs
4. Care guides with sections, questions, and answers
5. Dog breeds with images and specific care plans
6. Veterinary services with provider details and phone numbers
7. Responsive desktop and mobile interface

## Requirements

1. Node.js 18 or newer
2. MySQL 8 or newer
3. VS Code Live Server or another static file server

## How to Run

### 1. Clone the repository

Replace the URL with your GitHub repository URL:

```bash
git clone https://github.com/your-username/pethealthcare.git
cd pethealthcare
```

### 2. Create the database

import the database script available in server/database/sbscript.sql

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS pethealthcare;"
mysql -u root -p pethealthcare < server/database/dbscript.sql
```

You can also import `server/database/dbscript.sql` through the phpMyAdmin Import tab.

### 3. Create the environment file

Create `server/.env` with your own MySQL details:

```env
MYSQL_USER=root
MYSQL_HOST=localhost
MYSQL_DATABASE=pethealthcare
MYSQL_PASSWORD=your_mysql_password or (mysql)
MYSQL_PORT=3306
JWT_SECRET=your_long_random_secret or 9cce84436918c818c66c86e67f5bcb0ad3addf6f417f11e7c8678fdddc1033613d8e0366853873fae50c170c539e2d16
```

Do not commit `server/.env` because it contains credentials and secrets.

### 4. Install packages and start the server

```bash
cd server
npm install
node index.js
```

The API runs at:

```text
http://localhost:3000
```

Keep this terminal running.

### 5. Open the client

Open `client/home/index.html` with the VS Code Live Server extension.

### 6. Use the application

Explore and Create an account, log in, add a pet, and start adding health logs.
<img width="1512" height="908" alt="Screenshot 2026-10-20 at 8 47 26 AM" src="https://github.com/user-attachments/assets/c0aa34c2-d471-4e30-9ca5-ef17d10408e8" />
<img width="1512" height="908" alt="Screenshot 2026-10-20 at 8 47 35 AM" src="https://github.com/user-attachments/assets/9ccecd6f-bc1c-40af-af96-e62771eda10e" />
<img width="1512" height="908" alt="Screenshot 2026-10-20 at 8 47 42 AM" src="https://github.com/user-attachments/assets/a0b7688d-fb70-4025-814b-0943acdfd326" />
<img width="1512" height="908" alt="Screenshot 2026-10-20 at 8 47 49 AM" src="https://github.com/user-attachments/assets/4f1a8d9d-94c4-4d3f-9453-135889c836dc" />
<img width="1512" height="908" alt="Screenshot 2026-10-20 at 8 47 55 AM" src="https://github.com/user-attachments/assets/18eeeb0c-9f19-495d-81b7-68204df30c87" />
<img width="1512" height="908" alt="Screenshot 2026-10-20 at 8 48 07 AM" src="https://github.com/user-attachments/assets/f2fa8900-296d-49eb-a0a3-6b3aa1b7704b" />
<img width="1512" height="908" alt="Screenshot 2026-10-20 at 8 48 13 AM" src="https://github.com/user-attachments/assets/4162eb15-8afe-457d-ac56-975e3ca024c2" />

