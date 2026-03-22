from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import TestResult

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Bổ sung thông tin vào token
        token['username'] = user.username
        token['email'] = user.email
        return token

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        user = User(
            email=validated_data.get('email', ''),
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class TestResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestResult
        fields = ('id', 'score', 'level', 'strengths', 'weaknesses', 'recommended_paths', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
