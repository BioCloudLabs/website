FROM python:3.10-alpine
RUN pip install --upgrade pip
# COPY certs/biocloudlabs.cer /app/certs/biocloudlabs.cer
# COPY certs/biocloudlabs.key /app/certs/biocloudlabs.key
WORKDIR /app
COPY ./requirements.txt ./
RUN pip install --no-cache-dir --upgrade -r ./requirements.txt
COPY . /app
EXPOSE 5000
# CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "--certfile=certs/biocloudlabs.cer", "--keyfile=certs/biocloudlabs.key", "app:app"]
CMD ["flask", "run", "--host=0.0.0.0", "--port=80"]