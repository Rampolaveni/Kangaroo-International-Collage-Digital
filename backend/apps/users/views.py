from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView
from rest_framework import status
from .models import User
from .permissions import IsAdminOrSuperAdmin
from .serializers import CustomTokenObtainPairSerializer, UserProfileSerializer, UserCreateSerializer, UserUpdateSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)


class StudentListView(ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAdminOrSuperAdmin]

    def get_queryset(self):
        return User.objects.filter(role='STUDENT')


class UserCreateView(APIView):
    permission_classes = [IsAdminOrSuperAdmin]

    def post(self, request):
        serializer = UserCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserProfileSerializer(user).data, status=status.HTTP_201_CREATED)

class UserListView(ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAdminOrSuperAdmin]
    queryset = User.objects.all().order_by('username')

class UserUpdateView(RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAdminOrSuperAdmin]