import resend
from dataclasses import dataclass

@dataclass
class EmailSender():
	api_key: str

	def __post_init__(self):
		resend.api_key = self.api_key

	def recover_password(self, link, user, name):
		with open("recover_password_template.html", "r") as file:
			template_html = file.read()

			replaced_html = template_html.format(link=link, user=user, name=name)

			r = resend.Emails.send({
				"from": "noreply@biocloudlabs.es",
				"sender": "noreply@biocloudlabs.es",
				"to": user,
				"subject": "Password recovery",
				"html": replaced_html
			})
			
	def poweroff_machine(self, machine_name, user, name):
		with open("poweroff_machine.html", "r") as file:
			template_html = file.read()

			replaced_html = template_html.format(machine_name=machine_name, user=user, name=name)

			r = resend.Emails.send({
				"from": "noreply@biocloudlabs.es",
				"sender": "noreply@biocloudlabs.es",
				"to": user,
				"subject": "Machine powered off",
				"html": replaced_html
			})

