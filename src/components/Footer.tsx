import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Leaf } from 'lucide-react'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/30 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌱</span>
              <span className="font-pretendard font-bold text-xl text-foreground">
                Plantstagram
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-pretendard leading-relaxed">
              식물들의 일상을 공유하는 특별한 공간입니다. 
              자연과 함께하는 아름다운 순간들을 기록하고 나누어보세요.
            </p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for plant lovers</span>
              <Leaf className="w-4 h-4 text-green-500" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-pretendard font-semibold text-foreground">
              빠른 링크
            </h3>
            <nav className="space-y-2">
              <Link 
                to="/" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-pretendard"
              >
                홈
              </Link>
              <Link 
                to="/gallery" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-pretendard"
              >
                갤러리
              </Link>
              <Link 
                to="/create" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-pretendard"
              >
                포스트 작성
              </Link>
            </nav>
          </div>

          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="font-pretendard font-semibold text-foreground">
              회사 정보
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-pretendard">
                <strong className="text-foreground">MediConSol</strong>
              </p>
              <p className="text-sm text-muted-foreground font-pretendard leading-relaxed">
                병원 경영지원을 위한 전문 솔루션 브랜드입니다.
              </p>
              <div className="pt-2">
                <a 
                  href="https://mediconsol.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:text-primary/80 transition-colors font-pretendard"
                >
                  mediconsol.com →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-6">
          {/* Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground font-pretendard">
                © {currentYear} MediConSol. 무단 복제 및 재배포 금지.
              </p>
              <p className="text-xs text-muted-foreground font-pretendard mt-1">
                메디콘솔은 병원 경영지원을 위한 전문 솔루션 브랜드입니다.
              </p>
            </div>

            {/* Additional Links */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <button className="hover:text-foreground transition-colors font-pretendard">
                개인정보처리방침
              </button>
              <span>•</span>
              <button className="hover:text-foreground transition-colors font-pretendard">
                이용약관
              </button>
              <span>•</span>
              <button className="hover:text-foreground transition-colors font-pretendard">
                문의하기
              </button>
            </div>
          </div>
        </div>

        {/* Tech Stack Info (Optional) */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground/70 text-center font-pretendard">
            Built with React, TypeScript, Tailwind CSS, Supabase & Vercel
          </p>
        </div>
      </div>
    </footer>
  )
}
