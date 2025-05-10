from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Task, Comment, ActivityLog
from .serializers import (
    TaskSerializer, TaskCreateSerializer,
    CommentSerializer, ActivityLogSerializer
)
from .permissions import IsAdminOrOwner

# Create your views here.

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrOwner]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin():
            return Task.objects.all()
        return Task.objects.filter(created_by=user)

    def get_serializer_class(self):
        if self.action == 'create':
            return TaskCreateSerializer
        return TaskSerializer

    def perform_create(self, serializer):
        task = serializer.save(
            created_by=self.request.user,
            assigned_to=serializer.validated_data.get('assigned_to')
        )
        ActivityLog.objects.create(
            task=task,
            user=self.request.user,
            action='CREATE',
            details=f'Task "{task.title}" was created'
        )

    def perform_update(self, serializer):
        task = serializer.save()
        ActivityLog.objects.create(
            task=task,
            user=self.request.user,
            action='Task updated',
            details=f'Task "{task.title}" was updated'
        )

    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        task = self.get_object()
        serializer = CommentSerializer(data={
            **request.data,
            'task': task.id
        })
        if serializer.is_valid():
            comment = serializer.save(
                task=task,
                user=request.user
            )
            ActivityLog.objects.create(
                task=task,
                user=request.user,
                action='COMMENT',
                details=f'Comment added to task "{task.title}"'
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def activity_logs(self, request, pk=None):
        task = self.get_object()
        logs = ActivityLog.objects.filter(task=task)
        serializer = ActivityLogSerializer(logs, many=True)
        return Response(serializer.data)

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrOwner]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin():
            return Comment.objects.all()
        return Comment.objects.filter(task__created_by=user)

    def perform_create(self, serializer):
        comment = serializer.save(user=self.request.user)
        ActivityLog.objects.create(
            task=comment.task,
            user=self.request.user,
            action='Comment created',
            details=f'Comment added to task "{comment.task.title}"'
        )

    def perform_update(self, serializer):
        comment = serializer.save()
        ActivityLog.objects.create(
            task=comment.task,
            user=self.request.user,
            action='Comment updated',
            details=f'Comment updated on task "{comment.task.title}"'
        )
