"""
Test script for LangGraph Agent integration
Run this after setting up .env with GOOGLE_API_KEY and SUPABASE credentials
"""

import os
import sys
from pathlib import Path

# Add project to path
project_dir = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(project_dir))

# Set Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "chatbot_project.settings")

import django
django.setup()

from apps.ai.agent_service import run_agent, stream_agent
from apps.ai.tools import get_tools


def test_sync_response():
    """Test synchronous agent response"""
    print("=" * 60)
    print("🧪 TEST 1: Synchronous Agent Response")
    print("=" * 60)
    
    messages = [
        {"role": "user", "content": "Công ty của tôi có mấy ngày nghỉ trong năm?"}
    ]
    
    print(f"\n📝 User: {messages[0]['content']}")
    print("\n⏳ Processing...")
    
    response = run_agent(messages)
    print(f"\n🤖 Agent: {response}\n")
    
    return response


def test_stream_response():
    """Test streaming agent response"""
    print("=" * 60)
    print("🧪 TEST 2: Streaming Agent Response")
    print("=" * 60)
    
    messages = [
        {"role": "user", "content": "Chính sách bảo mật của công ty như thế nào?"}
    ]
    
    print(f"\n📝 User: {messages[0]['content']}")
    print("\n⏳ Streaming response...")
    print("-" * 40)
    
    for chunk in stream_agent(messages):
        print(chunk, end="", flush=True)
    
    print("\n" + "-" * 40 + "\n")


def test_multi_turn():
    """Test multi-turn conversation"""
    print("=" * 60)
    print("🧪 TEST 3: Multi-turn Conversation")
    print("=" * 60)
    
    messages = [
        {"role": "user", "content": "Công ty của tôi là gì?"},
        {"role": "assistant", "content": "Tôi không có thông tin cụ thể về tên công ty bạn. Bạn có thể cung cấp tên công ty hoặc hỏi tôi về các chính sách nội bộ."},
        {"role": "user", "content": "Vậy ngày nghỉ lễ Tết của công ty là bao lâu?"}
    ]
    
    print("\n📜 Conversation History:")
    for msg in messages:
        print(f"  {msg['role'].upper()}: {msg['content']}")
    
    print("\n⏳ Processing last message...")
    response = run_agent(messages)
    print(f"\n🤖 Agent: {response}\n")
    
    return response


def test_tools_available():
    """Check available tools"""
    print("=" * 60)
    print("🛠️  TEST 4: Available Tools")
    print("=" * 60)
    
    tools = get_tools()
    
    print(f"\n✅ Loaded {len(tools)} tools:\n")
    for tool in tools:
        print(f"  • {tool.name}")
        print(f"    {tool.description}\n")


def main():
    """Run all tests"""
    print("\n" + "=" * 60)
    print("🚀 LangGraph Agent Integration Test Suite")
    print("=" * 60 + "\n")
    
    try:
        # Test 1: Check tools
        test_tools_available()
        
        # Test 2: Simple response
        test_sync_response()
        
        # Test 3: Multi-turn
        test_multi_turn()
        
        # Test 4: Streaming (optional)
        # test_stream_response()
        
        print("\n" + "=" * 60)
        print("✅ All tests completed successfully!")
        print("=" * 60 + "\n")
        
    except Exception as e:
        print(f"\n❌ Error during testing: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
