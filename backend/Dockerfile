FROM python:3.11

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir --upgrade -r requirements.txt
RUN alembic upgrade head
RUN python3 ./alpha_tracker/scripts/backfill_daily_spy_price_history.py

EXPOSE 8080

CMD ["uvicorn", "alpha_tracker.main:app", "--host", "0.0.0.0", "--port", "8080"]
