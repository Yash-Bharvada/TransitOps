'use client'

import { toast as sonnerToast } from 'sonner'
import { AlertCircle, CheckCircle, AlertTriangle, X } from 'lucide-react'

export const premiumToast = {
  success: (message: string, description?: string) => {
    sonnerToast.custom((t) => (
      <div className="w-full max-w-md animate-in fade-in slide-in-from-right-5 duration-300">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-500/95 to-emerald-600/95 p-4 shadow-2xl backdrop-blur-xl border border-green-400/30">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10 opacity-0 hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer" />
          <div className="relative flex items-start gap-3">
            <div className="flex-shrink-0 pt-0.5">
              <CheckCircle className="size-5 text-white drop-shadow-lg animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{message}</p>
              {description && (
                <p className="text-xs text-green-100 mt-1">{description}</p>
              )}
            </div>
            <button
              onClick={() => sonnerToast.dismiss(t)}
              className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      </div>
    ), {
      duration: 4000,
      position: 'top-right',
    })
  },

  error: (message: string, description?: string) => {
    sonnerToast.custom((t) => (
      <div className="w-full max-w-md animate-in fade-in slide-in-from-right-5 duration-300">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-500/95 to-rose-600/95 p-4 shadow-2xl backdrop-blur-xl border border-red-400/30">
          <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 to-rose-400/10 opacity-0 hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer" />
          <div className="relative flex items-start gap-3">
            <div className="flex-shrink-0 pt-0.5">
              <AlertCircle className="size-5 text-white drop-shadow-lg animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{message}</p>
              {description && (
                <p className="text-xs text-red-100 mt-1">{description}</p>
              )}
            </div>
            <button
              onClick={() => sonnerToast.dismiss(t)}
              className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-right',
    })
  },

  warning: (message: string, description?: string) => {
    sonnerToast.custom((t) => (
      <div className="w-full max-w-md animate-in fade-in slide-in-from-right-5 duration-300">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-yellow-500/95 to-amber-600/95 p-4 shadow-2xl backdrop-blur-xl border border-yellow-400/30">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-amber-400/10 opacity-0 hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer" />
          <div className="relative flex items-start gap-3">
            <div className="flex-shrink-0 pt-0.5">
              <AlertTriangle className="size-5 text-white drop-shadow-lg animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{message}</p>
              {description && (
                <p className="text-xs text-yellow-100 mt-1">{description}</p>
              )}
            </div>
            <button
              onClick={() => sonnerToast.dismiss(t)}
              className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      </div>
    ), {
      duration: 4000,
      position: 'top-right',
    })
  },

  info: (message: string, description?: string) => {
    sonnerToast.custom((t) => (
      <div className="w-full max-w-md animate-in fade-in slide-in-from-right-5 duration-300">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500/95 to-cyan-600/95 p-4 shadow-2xl backdrop-blur-xl border border-blue-400/30">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer" />
          <div className="relative flex items-start gap-3">
            <div className="flex-shrink-0 pt-0.5">
              <AlertCircle className="size-5 text-white drop-shadow-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{message}</p>
              {description && (
                <p className="text-xs text-blue-100 mt-1">{description}</p>
              )}
            </div>
            <button
              onClick={() => sonnerToast.dismiss(t)}
              className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      </div>
    ), {
      duration: 3000,
      position: 'top-right',
    })
  },
}
