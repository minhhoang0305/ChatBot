from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import TestResult
from .serializers import UserRegisterSerializer, TestResultSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Đăng ký thành công"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TestResultView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            result = TestResult.objects.get(user=request.user)
            serializer = TestResultSerializer(result)
            return Response(serializer.data)
        except TestResult.DoesNotExist:
            return Response({"detail": "Chưa có kết quả test"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        # Lấy điểm số gửi lên
        score = float(request.data.get('score', 0))
        
        # Cập nhật Level và insight dựa trên điểm
        if score < 40:
            level = "Người mới bắt đầu (Beginner)"
            strengths = "Mới bắt đầu làm quen với kiến thức nền tảng"
            weaknesses = "Chưa có kinh nghiệm thực chiến và kiến thức chuyên sâu"
            recommended_paths = "Gợi ý củng cố lý thuyết nền tảng, bài tập cơ bản."
        elif score <= 80:
            level = "Lập trình viên Trung bình (Intermediate)"
            strengths = "Đã có kiến thức nền khá vững"
            weaknesses = "Đôi lúc thiết kế hệ thống chưa tối ưu"
            recommended_paths = "Gợi ý làm bài tập nâng cao, dự án thực tế nhỏ."
        else:
            level = "Chuyên gia (Advanced)"
            strengths = "Sở hữu kiến thức toàn diện và tư duy tốt"
            weaknesses = "Có thể còn thiếu kỹ năng thiết kế System Architecture phức tạp"
            recommended_paths = "Gợi ý học sâu về Architecture, Pattern, và Scaling system."

        data_to_save = {
            'score': score,
            'level': level,
            'strengths': strengths,
            'weaknesses': weaknesses,
            'recommended_paths': recommended_paths
        }

        # Tạo mới hoặc cập nhật
        result, created = TestResult.objects.get_or_create(user=request.user)
        serializer = TestResultSerializer(result, data=data_to_save, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
