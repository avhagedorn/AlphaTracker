FROM python:3.11

WORKDIR /app

COPY .env .env
COPY dependencies/requirements.txt requirements.txt
COPY alpha_tracker /app/alpha_tracker
COPY alembic /app/alembic
COPY alembic.ini /app/alembic.ini

RUN pip install --no-cache-dir --upgrade -r requirements.txt

EXPOSE 8080

CMD ["uvicorn", "alpha_tracker.main:app", "--host", "0.0.0.0", "--port", "8080"]
