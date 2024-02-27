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
from .validation import *
from .serializers import *
from django.http import HttpResponsePermanentRedirect
from django.conf import settings
from rest_framework.permissions import AllowAny
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import get_user_model
from rest_framework import generics, status
from django.utils.http import urlsafe_base64_encode
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.urls import reverse
from .utils import *


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





class CustomRedirect(HttpResponsePermanentRedirect):

    allowed_schemes = [settings.APP_SCHEME, 'http', 'https']

class RequestPasswordResetEmail(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = ResetPasswordEmailRequestSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        email = request.data.get('email', '')

        User = get_user_model()  

        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            current_site = get_current_site(request=request).domain
            relative_link = reverse('password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
            redirect_url = request.data.get('redirect_url', '')
            abs_url = 'http://' + current_site + relative_link
            email_body = f'Hello,\nUse the link below to reset your password:\n{abs_url}?redirect_url={redirect_url}'
            data = {'email_body': email_body, 'to_email': user.email, 'email_subject': 'Reset your password'}
            Util.send_email(data)
            return Response({'success': 'We have sent you a link to reset your password'}, status=status.HTTP_200_OK)
        else:
            # If the email is not found, return an error response
            return Response({'error': 'No user found with this email address'}, status=status.HTTP_404_NOT_FOUND)
        
class PasswordTokenCheckAPI(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = SetNewPasswordSerializer

    def get(self, request, uidb64, token):

        redirect_url = request.GET.get('redirect_url')

        try:
            id = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                if len(redirect_url) > 3:
                    return CustomRedirect(redirect_url+'?token_valid=False')
                else:
                    return CustomRedirect(settings.EMAIL_HOST_USER+'?token_valid=False')

            if redirect_url and len(redirect_url) > 3:
                return CustomRedirect(redirect_url+'?token_valid=True&message=Credentials Valid&uidb64='+uidb64+'&token='+token)
            else:
                return CustomRedirect(settings.EMAIL_HOST_USER+'?token_valid=False')

        except DjangoUnicodeDecodeError as identifier:
            try:
                if not PasswordResetTokenGenerator().check_token(user):
                    return CustomRedirect(redirect_url+'?token_valid=False')
                    
            except UnboundLocalError as e:
                return Response({'error': 'Token is not valid, please request a new one'}, status=status.HTTP_400_BAD_REQUEST)



class SetNewPasswordAPIView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = SetNewPasswordSerializer

    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success': True, 'message': 'Password reset success'}, status=status.HTTP_200_OK)
