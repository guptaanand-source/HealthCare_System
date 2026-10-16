import { useState, useRef, useEffect } from 'react'
import { chatbotService } from '../../services/services'
import { useAuth } from '../../context/AuthContext'

const Chatbot = () => {
  const { isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I am the MediConnect assistant. How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  if (!isAuthenticated) return null

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    const userMsg = { role: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await chatbotService.send(userMsg.text)
      setMessages(prev => [...prev, res.data.message])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I am having trouble connecting to the server.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-primary px-4 py-3 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a2 2 0 0 1 2 2c0 1.1-.9 2-2 2s-2-.9-2-2a2 2 0 0 1 2-2zm0 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM4 12c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm16 0c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zm-4.7 6.1c-.4-.4-.4-1 0-1.4l2.8-2.8c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4l-2.8 2.8c-.4.4-1 .4-1.4 0zm-7.6 0c-.4.4-1 .4-1.4 0l-2.8-2.8c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0l2.8 2.8c.4.4.4 1 0 1.4zm0-12.2c.4.4 1 .4 1.4 0l2.8-2.8c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0l-2.8 2.8c-.4.4-.4 1 0 1.4zm7.6 0c.4-.4.4-1 0-1.4l-2.8-2.8c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l2.8 2.8c.4.4 1 .4 1.4 0z"/><circle cx="12" cy="12" r="4"/></svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold">MediConnect Assistant</h3>
                <p className="text-[10px] text-primary-light/80 opacity-80">Automated help</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 p-1.5 rounded-md transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-neutral-50 flex flex-col gap-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-primary text-white rounded-br-sm' : 'bg-white border border-neutral-200 text-neutral-800 rounded-bl-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-neutral-200 rounded-2xl rounded-bl-sm p-3 flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 bg-white border-t border-neutral-200 flex gap-2">
            <input 
              type="text" 
              className="flex-1 form-input text-sm rounded-full py-2 px-4" 
              placeholder="Type your question..." 
              value={input} 
              onChange={e => setInput(e.target.value)}
            />
            <button type="submit" disabled={!input.trim() || loading} className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-primary-dark">
              <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-dark hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-primary-light"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </button>
      )}
    </div>
  )
}

export default Chatbot
