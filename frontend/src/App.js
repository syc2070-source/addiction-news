import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // HTML lang 설정
  useEffect(() => {
    document.documentElement.lang = 'ko';
  }, []);

  // 카테고리 목록
  const categories = [
    { id: 'all', name: '전체', icon: '📰' },
    { id: '중독 정책', name: '중독 정책', icon: '📋' },
    { id: '알코올·약물 중독', name: '알코올·약물', icon: '💊' },
    { id: '도박 중독', name: '도박', icon: '🎲' },
    { id: '게임·디지털 중독', name: '게임·디지털', icon: '🎮' },
    { id: 'AI와 중독 정책', name: 'AI와 중독', icon: '🤖' },
    { id: '시사 이슈', name: '시사', icon: '📡' }
  ];

  // 데이터 로드
  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const response = await fetch('/data/news.json');
      
      if (!response.ok) {
        throw new Error('뉴스를 불러올 수 없습니다.');
      }
      
      const data = await response.json();
      setArticles(data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading articles:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // 카테고리별 기사 가져오기
  const getArticlesByCategory = (categoryId) => {
    if (categoryId === 'all') return articles;
    return articles.filter(article => article.category === categoryId);
  };

  // 최신 뉴스 5개
  const latestNews = articles.slice(0, 5);

  // 카테고리로 스크롤
  const scrollToCategory = (categoryId) => {
    if (categoryId === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(`category-${categoryId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>뉴스를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">
          <h3>⚠️ 오류 발생</h3>
          <p>{error}</p>
          <p>news.json 파일이 public/data/ 폴더에 있는지 확인하세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app" lang="ko">
      {/* 헤더 */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">📰</span>
            <h1>중독 뉴스</h1>
          </div>
          <p className="subtitle">Addiction Intelligence Newsroom</p>
        </div>
      </header>

      {/* 카테고리 네비게이션 */}
      <nav className="category-nav sticky">
        <div className="nav-container">
          {categories.map(category => (
            <button
              key={category.id}
              className="nav-item"
              onClick={() => scrollToCategory(category.id)}
            >
              <span className="nav-icon">{category.icon}</span>
              <span className="nav-name">{category.name}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="main-container">
        <div className="content-wrapper">
          {/* 왼쪽: 주요 뉴스 */}
          <div className="main-content">
            {/* Featured 섹션 - 전체 중요 뉴스 3개 */}
            <section className="featured-section">
              <div className="section-header featured-header">
                <span className="section-icon">⭐</span>
                <h2>주요 뉴스</h2>
              </div>

              <div className="featured-grid">
                {articles.slice(0, 3).map((article, index) => (
                  <article key={article.id} className={`featured-card featured-${index + 1}`}>
                    <span className="featured-badge">Featured</span>
                    <div className="featured-category">{article.category}</div>
                    
                    <h3 className="featured-title">
                      <a href={article.url} target="_blank" rel="noopener noreferrer">
                        {article.title}
                      </a>
                    </h3>
                    
                    <p className="featured-summary">{article.summary}</p>
                    
                    <div className="featured-footer">
                      <div className="featured-meta">
                        <span className="featured-date">{article.date}</span>
                        <span className="featured-source">{article.source}</span>
                      </div>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="featured-link"
                      >
                        자세히 보기 →
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* 카테고리별 섹션 */}
            {categories.filter(cat => cat.id !== 'all').map(category => {
              const categoryArticles = getArticlesByCategory(category.id);
              if (categoryArticles.length === 0) return null;

              return (
                <section 
                  key={category.id} 
                  id={`category-${category.id}`}
                  className="category-section"
                >
                  <div className="section-header">
                    <span className="section-icon">{category.icon}</span>
                    <h2>{category.name}</h2>
                    <span className="article-count">{categoryArticles.length}개</span>
                  </div>

                  <div className="article-grid">
                    {categoryArticles.slice(0, 4).map((article) => (
                      <article key={article.id} className="article-card">
                        <div className="article-meta">
                          <span className="article-date">{article.date}</span>
                          <span className="article-source">{article.source}</span>
                        </div>
                        
                        <h3 className="article-title">
                          <a href={article.url} target="_blank" rel="noopener noreferrer">
                            {article.title}
                          </a>
                        </h3>
                        
                        <p className="article-summary">{article.summary}</p>
                        
                        <div className="article-footer">
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="read-more"
                          >
                            원문 보기 →
                          </a>
                        </div>
                      </article>
                    ))}
                  </div>

                  {categoryArticles.length > 4 && (
                    <div className="view-more">
                      <button className="view-more-btn">
                        더 보기 ({categoryArticles.length - 4}개 더)
                      </button>
                    </div>
                  )}
                </section>
              );
            })}
          </div>

          {/* 오른쪽: 최신 뉴스 사이드바 */}
          <aside className="sidebar">
            <div className="sidebar-sticky">
              <div className="sidebar-header">
                <h3>🔥 최신 뉴스</h3>
              </div>
              
              <div className="latest-news">
                {latestNews.map((article, index) => (
                  <div key={article.id} className="latest-item">
                    <span className="latest-number">{index + 1}</span>
                    <div className="latest-content">
                      <span className="latest-category">{article.category}</span>
                      <h4 className="latest-title">
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                          {article.title}
                        </a>
                      </h4>
                      <span className="latest-date">{article.date}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 통계 */}
              <div className="stats">
                <div className="stat-item">
                  <span className="stat-number">{articles.length}</span>
                  <span className="stat-label">총 기사</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{categories.length - 1}</span>
                  <span className="stat-label">카테고리</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2025 중독 뉴스 - Addiction Intelligence Newsroom</p>
          <p>도박·게임·알코올·약물 등 중독 관련 글로벌 뉴스</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
