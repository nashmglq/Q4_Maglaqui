from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserSerializer, MyTokenObtainPairSerializer, UserSerializerWithToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from rest_framework import status
from django.contrib.auth.models import User
from django.core.mail import send_mail
import random
from .models import *

def generate_otp():
    return str(random.randint(100000, 999999))


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
def get_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['POST'])
def registerUser(request):
    data = request.data
    print("Received data:", data)
    try:
        user = User.objects.create(
            username=data.get('username'),
            email=data.get('email'),
            password=make_password(data.get('password')),
            is_active=False
        )
        
        otp = generate_otp()
        profile = Profile.objects.create(user=user, otp=otp) 
        send_mail(
            'OTP Verification',
            f'Your OTP is: {otp}',
            'your_email@example.com',
            [data.get('email')],
            fail_silently=False,
        )

        serializer = UserSerializerWithToken(user, many=False)
        response_data = serializer.data
        response_data['userId'] = user.id  # Include userId in the response
        return Response(response_data)
    except Exception as e:
        print("Exception:", e)
        message = {'detail': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def verifyOTP(request):
    data = request.data
    user_id = data.get('user_id')
    otp_entered = data.get('otp')
    
    try:    
        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)
        if profile.otp == otp_entered:
            user.is_active = True
            user.save()
            serializer = UserSerializerWithToken(user, many=False)
            return Response(serializer.data)
        else:
            return Response({'detail': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Profile.DoesNotExist:
        return Response({'detail': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def resendOTP(request):
    data = request.data
    user_id = data.get('user_id')
    
    try:
        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)
        
        otp = generate_otp()
        profile.otp = otp
        profile.save()
        
        send_mail(
            'OTP Verification',
            f'Your OTP is: {otp}',
            'your_email@example.com',
            [user.email],
            fail_silently=False,
        )

        return Response({'detail': 'OTP resent successfully'})
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Profile.DoesNotExist:
        return Response({'detail': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
