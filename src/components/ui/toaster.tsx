'use client'
import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info' | 'warning'
interface Toast { id: string; message: string; type: ToastType }
interface ToastContextType { toast: (message: string, type?: ToastType) => void }

const ToastContext = createContext<ToastContextType>({ toast: () => {} })

export function useToast() { return useContext(ToastContext) }

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" style={{ maxWidth: 380 }}>
        {toasts.map(t => (
          <div key={t.id} className={cn(
            'flex items-start gap-3 px-4 py-3 rounded-xl border text-sm animate-fade-up',
            t.type === 'success' && 'bg-[#0a1a14] border-[rgba(0,212,170,0.3)] text-[#00d4aa]',
            t.type === 'error' && 'bg-[#1a0a0a] border-[rgba(255,80,80,0.3)] text-[#ff6060]',
            t.type === 'warning' && 'bg-[#1a140a] border-[rgba(255,160,50,0.3)] text-[#ffa032]',
            t.type === 'info' && 'bg-[#0f0f18] border-[rgba(124,92,252,0.3)] text-[#a78bfa]',
          )}>
            <span className="flex-1">{t.message}</span>
            <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
              className="opacity-60 hover:opacity-100 transition-opacity mt-0.5">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
