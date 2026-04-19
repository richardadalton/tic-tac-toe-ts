FROM python:3.12-slim

WORKDIR /app

# Install dependencies first (separate layer so it's cached on re-deploys)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY . .

EXPOSE 8001

# Use gunicorn for production — Flask's dev server is not used
CMD ["gunicorn", "--bind", "0.0.0.0:8001", "--workers", "2", "--timeout", "30", "tictactoe:app"]

