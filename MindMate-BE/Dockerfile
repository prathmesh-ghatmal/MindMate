FROM python:3.11-slim

WORKDIR /app

# speed, avoid python cache
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# install dependencies
COPY MindMate-BE/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy backend code
COPY MindMate-BE/ .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
