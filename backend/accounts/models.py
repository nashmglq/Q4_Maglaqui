from django.db import models
from django.contrib.auth.models import User



class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    last_otp_sent = models.DateTimeField(null=True, blank=True)  # Add this field

    def __str__(self):
        return self.user.username