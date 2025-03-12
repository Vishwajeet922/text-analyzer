FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY analyze-website/ .

RUN npm install && \
    npm run build

FROM python:3.10-alpine

ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

COPY app.py .

COPY --from=frontend-builder /app/frontend/build /app/analyze-website/build

EXPOSE 8080

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8080", "app:app"]