# [⍺T] AlphaTracker

Your platform to track your alpha in the markets.

https://github.com/user-attachments/assets/9fb7f7b9-4562-44c7-b1ab-24bb65e4a633


<table>
  <tr>
    <td><img width="2056" alt="Screenshot 2024-07-31 at 8 15 51 PM" src="https://github.com/user-attachments/assets/411a352b-2b16-4de9-b56d-d2a871c2516c"></td>
    <td><img width="2056" alt="Screenshot 2024-07-31 at 8 15 34 PM" src="https://github.com/user-attachments/assets/fe64418d-32dd-413d-8a5d-0b6a30d1ac00"></td>
  </tr>
  <tr>
    <td><img width="2056" alt="Screenshot 2024-07-31 at 8 16 31 PM" src="https://github.com/user-attachments/assets/445a3b82-115c-471e-a54f-b95d0f5aa523"></td>
    <td><img width="2056" alt="Screenshot 2024-07-31 at 8 15 42 PM" src="https://github.com/user-attachments/assets/3f6674e8-3ebc-4388-9ce2-a944bb636b79"></td>
  </tr>
</table>

---

This project is incomplete, and likely very broken in many areas. However, I'm stepping back from this to focus on work. 

This was inspired by an interview I was preparing for at Old Mission Capital. I got the job.

---

Here's how to get this up and running. This might not work and this is primarily for my future reference.

```
git clone git@github.com:avhagedorn/AlphaTracker.git

cd ./backend

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install -r dev_requirements.txt

docker pull postgres
docker run --name alpha_tracker_db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres && sleep 1 && alembic upgrade head

[in a separate terminal]
cd ./backend
uvicorn alpha_tracker.main:app --reload --port 8080

[in a separate terminal]
cd ./web
npm run dev
```

You can also use the VS Code "Run + Debug" scripts if you prefer.

---

Backend: FastAPI, Python, Alembic

Frontend: React, Next, Tailwind

DB: Postgres 🐘

---

Built with ❤️ in Minneapolis.
