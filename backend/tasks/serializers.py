from rest_framework import serializers
from .models import Task, Comment, ActivityLog
from django.contrib.auth import get_user_model

User = get_user_model()

class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name')

class CommentSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'task', 'user', 'content', 'created_at', 'updated_at')
        read_only_fields = ('user', 'created_at', 'updated_at')

class ActivityLogSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)

    class Meta:
        model = ActivityLog
        fields = ('id', 'task', 'user', 'action', 'details', 'created_at')
        read_only_fields = ('user', 'created_at')

class TaskSerializer(serializers.ModelSerializer):
    created_by = UserBasicSerializer(read_only=True)
    assigned_to = UserBasicSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    activity_logs = ActivityLogSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = (
            'id', 'title', 'description', 'created_by', 'assigned_to',
            'status', 'priority', 'due_date', 'created_at', 'updated_at',
            'tags', 'comments', 'activity_logs'
        )
        read_only_fields = ('created_by', 'created_at', 'updated_at')

class TaskCreateSerializer(serializers.ModelSerializer):
    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        required=False,
        allow_null=True
    )
    comments = CommentSerializer(many=True, read_only=True)
    activity_logs = ActivityLogSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = (
            'id', 'title', 'description', 'assigned_to',
            'status', 'priority', 'due_date', 'tags',
            'comments', 'activity_logs'
        ) 