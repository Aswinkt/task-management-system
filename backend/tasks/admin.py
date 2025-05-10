from django.contrib import admin
from .models import Task, Comment, ActivityLog

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_by', 'assigned_to', 'status', 'priority', 'due_date')
    list_filter = ('status', 'priority', 'created_by', 'assigned_to')
    search_fields = ('title', 'description', 'tags')
    date_hierarchy = 'created_at'

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('task', 'user', 'created_at')
    list_filter = ('user', 'created_at')
    search_fields = ('content', 'task__title')

@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ('task', 'user', 'action', 'created_at')
    list_filter = ('user', 'action', 'created_at')
    search_fields = ('action', 'details', 'task__title')
    date_hierarchy = 'created_at'
