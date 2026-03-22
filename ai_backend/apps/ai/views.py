import os
from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.files.storage import FileSystemStorage
from .vector_store import ingest_custom_text, ingest_pdf
from .config import DATA_FOLDER_PATH

class AdminIngestView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not request.user.is_staff and not request.user.is_superuser:
            return Response({"error": "Only admins can upload documents."}, status=status.HTTP_403_FORBIDDEN)
            
        input_type = request.data.get("inputType", "text")
        
        try:
            if input_type == "text":
                text = request.data.get("text")
                source_name = request.data.get("source_name", "Admin Input")
                
                if not text:
                    return Response({"error": "Nội dung văn bản bị trống."}, status=status.HTTP_400_BAD_REQUEST)
                    
                ingest_custom_text(text, source_name)
                return Response({"message": "Tài liệu văn bản đã được Vector hóa và lưu thành công!"}, status=status.HTTP_200_OK)
                
            elif input_type == "file":
                file_obj = request.FILES.get("file")
                
                if not file_obj:
                    return Response({"error": "Vui lòng chọn 1 file PDF."}, status=status.HTTP_400_BAD_REQUEST)
                if not file_obj.name.lower().endswith(".pdf"):
                    return Response({"error": "Hệ thống chỉ tạm thời hỗ trợ file định dạng .pdf"}, status=status.HTTP_400_BAD_REQUEST)
                
                # Lưu PDF vào ổ đĩa để PyPDFLoader có thể đọc được
                os.makedirs(DATA_FOLDER_PATH, exist_ok=True)
                fs = FileSystemStorage(location=DATA_FOLDER_PATH)
                
                # Check file trung ten
                if fs.exists(file_obj.name):
                    # Delete the old file locally if it exists to overwrite
                    fs.delete(file_obj.name)
                    
                filename = fs.save(file_obj.name, file_obj)
                file_path = os.path.join(DATA_FOLDER_PATH, filename)
                
                # Chạy quá trình Embedding của File PDF
                ingest_pdf(file_path)
                
                # Bạn có thể uncomment dòng dưới nếu không muốn giữ lại Local File
                # os.remove(file_path)
                
                return Response({"message": f"File '{filename}' đã tải lên và phân tách (chunks) nạp vào DB thành công!"}, status=status.HTTP_200_OK)
            
            else:
                return Response({"error": "Tham số inputType không hợp lệ."}, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
