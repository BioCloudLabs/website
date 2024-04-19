import requests

def send_simple_message():
	return requests.post(
		"https://api.mailgun.net/v3/biocloudlabs.es/messages",
		auth=("api", "3e72dc38d783e68da8901dbb0bc2a154-19806d14-75cb0a47"),
		data={"from": "Excited User <pepe@biocloudlabs.es>",
			"to": ["almamodev@gmail.com", "chrisgonzaco@gmail.com"],
			"subject": "Hello",
			"text": "Just testing!"})

send_simple_message()