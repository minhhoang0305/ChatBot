from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Conversation, Message
from .serializers import ChatSerializer
from apps.ai.agent_service import run_agent


class ChatAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChatSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        conversation_id = serializer.validated_data.get("conversation_id")
        user_message = serializer.validated_data["message"]

        # 1️⃣ Create or get conversation
        if conversation_id:
            try:
                conversation = Conversation.objects.get(id=conversation_id, user=request.user)
            except Conversation.DoesNotExist:
                return Response({"detail": "Conversation không tồn tại"}, status=status.HTTP_404_NOT_FOUND)
        else:
            conversation = Conversation.objects.create(user=request.user)

        # 2️⃣ Save user message
        Message.objects.create(
            conversation=conversation,
            role="user",
            content=user_message,
        )

        # 3️⃣ Load full history
        history = [
            {"role": msg.role, "content": msg.content}
            for msg in conversation.messages.order_by("created_at")
        ]

        # 3.5️⃣ Load User Profile
        user_test_result = getattr(request.user, 'test_result', None)
        if user_test_result:
            user_profile = f"Trình độ (Level): {user_test_result.level}\nĐiểm mạnh: {user_test_result.strengths}\nĐiểm yếu cần cải thiện: {user_test_result.weaknesses}\nĐịnh hướng gợi ý: {user_test_result.recommended_paths}"
        else:
            user_profile = "Học viên chưa làm bài test đánh giá năng lực."

        # 4️⃣ Call Agent
        assistant_reply = run_agent(history, user_profile)

        # 5️⃣ Save assistant message
        Message.objects.create(
            conversation=conversation,
            role="assistant",
            content=assistant_reply,
        )

        return Response(
            {
                "conversation_id": str(conversation.id),
                "reply": assistant_reply,
            },
            status=status.HTTP_200_OK,
        )