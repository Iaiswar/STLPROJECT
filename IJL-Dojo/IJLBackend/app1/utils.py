# utils.py or any file

from django.core.mail import send_mail
from django.conf import settings

def send_simple_mail(to_email, subject, message):
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [to_email],
        fail_silently=False,
    )

from django.core.mail import send_mail
from django.conf import settings

def send_milestone_email(subject, message, recipient_list):
    """
    Sends a plain text email to multiple recipients.
    """
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=recipient_list,
        fail_silently=False,
    )
