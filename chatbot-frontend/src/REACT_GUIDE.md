/**
 * REACT CHATBOT COMPONENTS - DETAILED GUIDE
 * ===========================================================
 * 
 * Tất cả components đã được comment chi tiết để giúp bạn
 * hiểu từng dòng code.
 * 
 * -----------------------------------------------------------
 * FILE STRUCTURE
 * -----------------------------------------------------------
 */

/*
src/
├── main.jsx              ⭐ Entry point - khởi tạo React app
├── App.jsx              ⭐ Root component
├── components/
│   ├── ChatWindow.jsx    ⭐ Component chính - quản lý chat logic
│   ├── ChatInput.jsx     ⭐ Input field cho user gửi message
│   └── MessageBubble.jsx ⭐ Component hiển thị từng message
├── api/
│   └── chatApi.js        ⭐ API client để gọi backend
├── index.css             ⭐ Global styles
└── assets/               (hình ảnh, icons, etc)
*/

// ===========================================================
// COMPONENT HIERARCHY (Cây các component)
// ===========================================================

/*
main.jsx
  └── App.jsx
      └── ChatWindow.jsx
          ├── MessageBubble.jsx (rendered nhiều lần cho mỗi message)
          └── ChatInput.jsx

*/

// ===========================================================
// DATA FLOW (Luồng dữ liệu)
// ===========================================================

/*
1. USER TYPES MESSAGE
   ↓
   ChatInput (value={input}, onChange)
   ├─ input state được update
   ├─ User click "Gửi" button
   └─ handleSubmit() được gọi
   
2. SEND MESSAGE
   ↓
   ChatWindow.handleSend() được gọi
   ├─ Add user message vào messages state (UI update ngay)
   ├─ Call API: sendMessage(conversationId, text)
   └─ setLoading(true) để disable input
   
3. API CALL
   ↓
   chatApi.js - sendMessage()
   ├─ Create payload: {message, conversation_id}
   ├─ axios.post() tới backend
   └─ Return response: {reply, conversation_id}
   
4. RECEIVE RESPONSE
   ↓
   ChatWindow received response
   ├─ Save conversation_id
   ├─ Add assistant message vào messages state
   └─ setLoading(false) để enable input lại
   
5. RENDER MESSAGES
   ↓
   messages.map() → MessageBubble
   ├─ Mỗi object message → Render một MessageBubble
   └─ MessageBubble style khác nhau dựa vào role (user/assistant)
*/

// ===========================================================
// COMPONENT DETAILS
// ===========================================================

/*
┌─────────────────────────────────────────────────────────┐
│ ChatWindow.jsx - COMPONENT CHÍNH                        │
└─────────────────────────────────────────────────────────┘

State:
  - messages: array [ {role, content}, ... ]
  - conversationId: string (lưu conversation ID từ backend)
  - loading: boolean (disable input khi chờ response)

Functions:
  - handleSend(text): Gửi message
    1. Thêm user message vào messages[]
    2. Call API gửi message
    3. Thêm assistant response vào messages[]

Render:
  - Messages container (scroll area)
    ├─ MessageBubble × n (render từng message)
    └─ Loading indicator (khi loading = true)
  - ChatInput component
*/

/*
┌─────────────────────────────────────────────────────────┐
│ ChatInput.jsx - INPUT FIELD                            │
└─────────────────────────────────────────────────────────┘

Props:
  - onSend: function (callback từ parent)
  - loading: boolean (disable khi processing)

State:
  - input: string (giá trị input hiện tại)

Functions:
  - handleSubmit(e):
    1. Prevent default form submission
    2. Check input không trống
    3. Call onSend(input)
    4. Clear input field

Render:
  - Form container
    ├─ Input field
    │  └─ value={input}, onChange, disabled={loading}
    └─ Submit button
       └─ disabled={loading}, Show different text
*/

/*
┌─────────────────────────────────────────────────────────┐
│ MessageBubble.jsx - MESSAGE DISPLAY                    │
└─────────────────────────────────────────────────────────┘

Props:
  - role: "user" | "assistant"
  - content: string (message content)

Render:
  - Container flex (align left/right dựa vào role)
    └─ Message bubble
       ├─ Background color: user=blue, assistant=gray
       ├─ Text color: user=white, assistant=black
       └─ Message content text
*/

/*
┌─────────────────────────────────────────────────────────┐
│ chatApi.js - API COMMUNICATION                         │
└─────────────────────────────────────────────────────────┘

Functions:
  - sendMessage(conversationId, message):
    1. Build payload {message, conversation_id?}
    2. axios.post() to backend
    3. Return response data {reply, conversation_id}

Backend Endpoint:
  POST http://127.0.0.1:8000/api/chat/
  
  Request body:
  {
    "message": "user message",
    "conversation_id": "uuid" (optional)
  }
  
  Response:
  {
    "conversation_id": "uuid",
    "reply": "assistant response"
  }
*/

// ===========================================================
// KEY REACT CONCEPTS USED
// ===========================================================

/*
✅ useState Hook
   const [state, setState] = useState(initialValue)
   - Quản lý component state
   - Trigger re-render khi state thay đổi
   
✅ Props
   <Component prop1={value} prop2={value} />
   - Pass data từ parent → child
   - Read-only từ child perspective
   
✅ Event Handling
   onChange={(e) => setState(e.target.value)}
   onClick={(e) => doSomething()}
   onSubmit={(e) => handleSubmit(e)}
   - Bắt user events
   - e.preventDefault() để prevent default behavior
   
✅ Conditional Rendering
   {loading ? "Loading..." : "Normal"}
   {loading && <LoadingSpinner />}
   - Render different content dựa vào condition
   
✅ List Rendering
   {messages.map((msg, idx) => <MessageBubble key={idx} {...msg} />)}
   - Render list of items
   - key = unique identifier (for React's reconciliation)
   
✅ Async/Await
   const data = await sendMessage(...)
   - Call async function
   - Wait for response
   - continue execution
   
✅ Try/Catch/Finally
   try { ... } catch (error) { ... } finally { ... }
   - Error handling
   - Cleanup code chạy dù có error hay không
*/

// ===========================================================
// STYLING APPROACH
// ===========================================================

/*
Using inline styles: style={{ prop: value }}
Advantages:
  ✅ No CSS files needed
  ✅ Dynamic styles base on state
  ✅ Scoped to component
  
Disadvantages:
  ❌ No media queries
  ❌ Verbose
  ❌ No pseudo-classes (:hover, :focus)
  
Alternative: CSS Modules, Tailwind CSS, Styled Components
*/

// ===========================================================
// STATE UPDATE PATTERNS
// ===========================================================

/*
1. Simple value:
   setLoading(true)
   
2. Using previous value:
   setMessages((prev) => [...prev, newMessage])
   - Why? Ensure latest state if multiple updates happen
   
3. Object/Array update:
   setMessages(prev => [...prev, newMsg])  // Array add
   setFormData(prev => ({...prev, name: value}))  // Object merge
*/

// ===========================================================
// COMMON MISTAKES & HOW TO AVOID
// ===========================================================

/*
❌ MISTAKE 1: Directly mutating state
   messages.push(newMessage)  // ❌ Wrong
   setMessages([...messages, newMessage])  // ✅ Correct
  
❌ MISTAKE 2: Not clearing input after submit
   onSend(input);
   // Input still shows old value
   setInput("");  // ✅ Clear it
   
❌ MISTAKE 3: Not disabling submit button during loading
   // Allow user to click multiple times
   <button disabled={loading}>  // ✅ Prevent double submit
   
❌ MISTAKE 4: Not using key in list rendering
   messages.map((msg, idx) => <div>{msg}</div>)  // ❌ Bad
   messages.map((msg, idx) => <div key={idx}>{msg}</div>)  // ✅ Good
   
❌ MISTAKE 5: Missing error handling
   const data = await sendMessage(...)  // ❌ No try/catch
   // App crashes if API fails
   
   try {
     const data = await sendMessage(...)  // ✅ Proper error handling
   } catch (error) {
     console.error(error)
   }
*/

// ===========================================================
// PERFORMANCE OPTIMIZATION TIPS
// ===========================================================

/*
1. Use key prop correctly in lists
   messages.map((msg, id) => <MessageBubble key={id} ... />)
   
2. Memoize expensive components
   import { memo } from 'react'
   export default memo(MessageBubble)
   
3. Move state down (state colocation)
   Put state as low as possible in component tree
   
4. Use useCallback for callbacks passed to children
   const handleSend = useCallback((text) => { ... }, [])
   
5. Avoid creating objects/arrays in render
   // ❌ Creates new object every render
   <div style={{ color: 'blue' }}>
   
   // ✅ Define outside or use const
   const buttonStyle = { color: 'blue' }
   <div style={buttonStyle}>
*/

// ===========================================================
// DEBUGGING TIPS
// ===========================================================

/*
1. Console logs
   console.log('state value:', messages)
   console.log('after api call:', data)
   
2. React DevTools
   Install React DevTools browser extension
   - See component tree
   - Inspect props/state
   - Profile performance
   
3. Check network tab
   DevTools → Network → See API requests/responses
   
4. Check if state updating
   Add console.log in setState callback:
   useEffect(() => {
     console.log('messages updated:', messages)
   }, [messages])
   
5. Check for errors in console
   DevTools → Console → See JavaScript errors
*/

// ===========================================================
// TESTING CHECKLIST
// ===========================================================

/*
Before submitting:
☐ Type message and send - message appears
☐ Assistant responds - response appears below user message
☐ Multiple messages - all messages show in order
☐ Loading state - button disables during request
☐ Empty message - can't send empty message
☐ Multiple questions - conversation continues
☐ Error handling - error message shows if API fails
☐ Mobile responsive - test on mobile size
☐ No console errors - check DevTools console
*/

// ===========================================================
// FILE LOCATIONS SUMMARY
// ===========================================================

/*
📁 src/
  ├─ 📄 main.jsx ........... React app entry point
  ├─ 📄 App.jsx ............ Root component (title + ChatWindow)
  ├─ 📄 index.css .......... Global styles
  ├─ 📁 components/ ........ Reusable React components
  │  ├─ 📄 ChatWindow.jsx .. Chat logic & message list
  │  ├─ 📄 ChatInput.jsx ... User input field
  │  └─ 📄 MessageBubble.jsx Message display
  ├─ 📁 api/ .............. API client
  │  └─ 📄 chatApi.js ..... HTTP requests to backend
  └─ 📁 assets/ ........... Images, icons, etc

*/

export const ComponentGuide = "✅ All React components are now documented!"
