FROM python:3.10-alpine
RUN pip install --upgrade pip
COPY certs/fullchain.pem /app/certs/fullchain.pem
COPY certs/privkey.pem /app/certs/privkey.pem
WORKDIR /app
COPY ./requirements.txt ./
RUN pip install --no-cache-dir --upgrade -r ./requirements.txt
COPY . /app
EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "--certfile=certs/fullchain.pem", "--keyfile=certs/privkey.pem", "--timeout", "9999990", "app:app"]