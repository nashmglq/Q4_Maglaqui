from django.urls import path
from .views import *

urlpatterns = [
    path('', get_user, name='profile'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('register/', registerUser, name='register'),
    path('verify-otp/', verifyOTP, name='verify_otp'),  
    path('resend-otp/', resendOTP, name='resend_otp'), 
]
