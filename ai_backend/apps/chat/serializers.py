from rest_framework import serializers


class ChatSerializer(serializers.Serializer):
    conversation_id = serializers.UUIDField(required=False)
    message = serializers.CharField()