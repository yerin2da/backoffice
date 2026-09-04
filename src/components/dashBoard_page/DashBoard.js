import React, { useState, useEffect, useRef, useMemo } from 'react';
import './DashBoard.css';

// 밀리초를 'M분 SS초'로 전환하는 유틸리티
const formatDwellTime = (ms) => {
  if (ms == null) return '-';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}분 ${seconds < 10 ? '0' : ''}${seconds}초`;
};

// 증감율 계산 유틸리티
const calcDeltaPct = (curr, prev) => {
  if (!prev) return 0;
  return Math.round(((curr - prev) / prev) * 100);
};

export default function Dashboard() {
  const [currentPeriod, setCurrentPeriod] = useState('202607');
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('top5'); // 'top5' | 'noinq'
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 차트 인터랙션용 State
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, text: '' });
  const periodRef = useRef(null);

  // 목업 데이터 로드 시뮬레이션
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setDashboardData(getMockRecord(currentPeriod));
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [currentPeriod]);

  
  // 외부 클릭 시 Dropdown 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (periodRef.current && !periodRef.current.contains(e.target)) {
        setIsPeriodOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 라인 차트 계산 (SVG Path & Hover Hit)
  const chartGeometry = useMemo(() => {
    if (!dashboardData?.visitor_trend?.length) return null;
    const trends = dashboardData.visitor_trend;
    const width = 560;
    const height = 180;
    const paddingY = 10;
    const maxVal = Math.max(...trends.map((t) => t.count), 1);
    const points = trends.map((item, idx) => {
      const x = (idx / (trends.length - 1)) * width;
      const y = height - paddingY - (item.count / maxVal) * (height - paddingY * 2);
      return { x, y, date: item.date, count: item.count };
    });

    const linePathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
    const areaPathD = `${linePathD} L ${width},${height} L 0,${height} Z`;

    return { points, linePathD, areaPathD, width, height };
  }, [dashboardData]);

  const handleMouseMove = (e) => {
    if (!chartGeometry) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * chartGeometry.width;

    let closest = chartGeometry.points[0];
    let minDiff = Math.abs(mouseX - closest.x);

    for (let i = 1; i < chartGeometry.points.length; i++) {
      const diff = Math.abs(mouseX - chartGeometry.points[i].x);
      if (diff < minDiff) {
        minDiff = diff;
        closest = chartGeometry.points[i];
      }
    }

    const [, month, day] = closest.date.split('-');
    setTooltip({
      show: true,
      x: closest.x,
      y: closest.y,
      text: `${parseInt(month, 10)}월 ${parseInt(day, 10)}일 · ${closest.count}명`,
      leftPct: (closest.x / chartGeometry.width) * 100,
      topPct: (closest.y / chartGeometry.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, show: false }));
  };

  if (loading) {
    return <div className="shell">대시보드 데이터를 불러오는 중입니다...</div>;
  }

  if (!dashboardData) {
    return <div className="shell">데이터를 불러오지 못했습니다.</div>;
  }

  const record = dashboardData;
  const periods = record?.available_periods || [];
  const selectedPeriodLabel =
    periods.find((p) => p.period === currentPeriod)?.label ||
    `${currentPeriod.slice(0, 4)}년 ${currentPeriod.slice(4)}월`;

  // 도넛 차트 각도 계산 (Conic Gradient)
  const totalRef =
    (record.referral_breakdown.naver || 0) +
      (record.referral_breakdown.direct || 0) +
      (record.referral_breakdown.other || 0) || 1;
  const pNaver = Math.round(((record.referral_breakdown.naver || 0) / totalRef) * 100);
  const pDirect = Math.round(((record.referral_breakdown.direct || 0) / totalRef) * 100);
  const pOther = 100 - pNaver - pDirect;

  const donutStyle = {
    background: `conic-gradient(
      var(--series-naver) 0% ${pNaver}%,
      var(--series-direct) ${pNaver}% ${pNaver + pDirect}%,
      var(--series-other) ${pNaver + pDirect}% 100%
    )`,
  };

  return (
    <div className="page-container">
      {/* Page Head */}
      <header className="page-head">
        <div>
          <h2>통합 대시보드</h2>
        </div>

        {/* Period Selector */}
        <div
          ref={periodRef}
          className={`period ${isPeriodOpen ? 'open' : ''}`}
          onClick={() => setIsPeriodOpen(!isPeriodOpen)}
        >
          <span>조회기간</span>
          <strong>{selectedPeriodLabel}</strong>
          <svg viewBox="0 0 20 20" fill="none">
            <path
              d="M5 8l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className={`period-menu ${isPeriodOpen ? 'open' : ''}`}>
            {periods.map((p) => (
              <button
                key={p.period}
                type="button"
                className={p.period === currentPeriod ? 'active' : ''}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPeriod(p.period);
                  setIsPeriodOpen(false);
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <section className="grid kpi-row">
        {/* 검색/포털 유입 */}
        <KpiCard
          label="포털/검색 유입"
          hint="주요 포털 검색 및 검색 광고를 통해 방문한 수"
          current={record.kpi.naver_referral.current}
          previous={record.kpi.naver_referral.previous}
          unit="건"
        />

        {/* 총 방문자 수 */}
        <KpiCard
          label="총 방문자 수"
          current={record.kpi.visitor_count.current}
          previous={record.kpi.visitor_count.previous}
          unit="명"
        />

        {/* 상담/문의 전환 */}
        <KpiCard
          label="상담/문의 전환"
          hint="웹사이트 내 문의 버튼 클릭 및 상담 신청 건수"
          current={record.kpi.phone_click.current}
          previous={record.kpi.phone_click.previous}
          unit="건"
        />

        {/* 신규 / 재방문 비율 */}
        <div className="kpi">
          <div className="label">신규 / 재방문</div>
          {(() => {
            const total =
              (record.kpi.new_visitor_count || 0) +
                (record.kpi.returning_visitor_count || 0) || 1;
            const newPct = Math.round((record.kpi.new_visitor_count / total) * 100);
            const retPct = 100 - newPct;
            return (
              <>
                <div className="value" style={{ fontSize: '16px', marginTop: '2px' }}>
                  {newPct}%{' '}
                  <span style={{ color: 'var(--text-faint)', fontWeight: 600 }}>/</span>{' '}
                  {retPct}%
                </div>
                <div className="split-bar">
                  <span style={{ width: `${newPct}%`, background: 'var(--accent)' }} />
                  <span
                    style={{
                      width: `${retPct}%`,
                      background: 'var(--border-strong)',
                    }}
                  />
                </div>
                <div className="split-legend">
                  <span>
                    <span className="sw" style={{ background: 'var(--accent)' }} />
                    신규 {record.kpi.new_visitor_count}명
                  </span>
                  <span>
                    <span
                      className="sw"
                      style={{ background: 'var(--border-strong)' }}
                    />
                    재방문 {record.kpi.returning_visitor_count}명
                  </span>
                </div>
              </>
            );
          })()}
        </div>

        {/* 고객 파이프라인 현황 */}
        <div className="kpi">
          <div className="label">
            파이프라인 현황
            <span
              className="hint"
              title="이번 달 등록된 고객 문의/상담 노트의 진행상태 분포"
            >
              ⓘ
            </span>
          </div>
          <div className="value">
            {record.note_status_breakdown.all.total_count}
            <small>건</small>
          </div>
          {(() => {
            const total = record.note_status_breakdown.all.total_count || 1;
            const cPct = Math.round(
              (record.note_status_breakdown.consulting.total_count / total) * 100
            );
            const pPct = Math.round(
              (record.note_status_breakdown.proposed.total_count / total) * 100
            );
            const kPct = Math.round(
              (record.note_status_breakdown.contracted.total_count / total) * 100
            );
            const lPct = 100 - cPct - pPct - kPct;
            return (
              <>
                <div className="split-bar">
                  <span style={{ width: `${cPct}%`, background: 'var(--accent)' }} />
                  <span style={{ width: `${pPct}%`, background: 'var(--warn)' }} />
                  <span style={{ width: `${kPct}%`, background: 'var(--success)' }} />
                  <span
                    style={{
                      width: `${lPct}%`,
                      background: 'var(--border-strong)',
                    }}
                  />
                </div>
                <div
                  className="split-legend"
                  style={{ flexWrap: 'wrap', rowGap: '6px' }}
                >
                  <span>
                    <span className="sw" style={{ background: 'var(--accent)' }} />
                    상담중 {record.note_status_breakdown.consulting.total_count}
                  </span>
                  <span>
                    <span className="sw" style={{ background: 'var(--warn)' }} />
                    제안 {record.note_status_breakdown.proposed.total_count}
                  </span>
                  <span>
                    <span className="sw" style={{ background: 'var(--success)' }} />
                    완료 {record.note_status_breakdown.contracted.total_count}
                  </span>
                  <span>
                    <span
                      className="sw"
                      style={{ background: 'var(--border-strong)' }}
                    />
                    이탈 {record.note_status_breakdown.lost.total_count}
                  </span>
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* Chart Section */}
      <section className="grid chart-row">
        {/* Line Chart */}
        <div className="card">
          <h3>방문자 트렌드</h3>
          <p className="sub">최근 30일, 일별 방문자 추이</p>
          <div className="linechart">
            {chartGeometry && (
              <svg viewBox="0 0 560 180" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--seq-450)"
                      stopOpacity="0.22"
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--seq-450)"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>
                <line className="gridline" x1="0" y1="30" x2="560" y2="30" />
                <line className="gridline" x1="0" y1="80" x2="560" y2="80" />
                <line className="gridline" x1="0" y1="130" x2="560" y2="130" />
                <path className="area" d={chartGeometry.areaPathD} />
                <path className="line" d={chartGeometry.linePathD} />
                {tooltip.show && (
                  <>
                    <line
                      className="hover-x"
                      x1={tooltip.x}
                      y1="0"
                      x2={tooltip.x}
                      y2="180"
                      style={{ opacity: 1 }}
                    />
                    <circle
                      className="hover-dot"
                      r="4"
                      cx={tooltip.x}
                      cy={tooltip.y}
                      style={{ opacity: 1 }}
                    />
                  </>
                )}
                <rect
                  x="0"
                  y="0"
                  width="560"
                  height="180"
                  fill="transparent"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                />
              </svg>
            )}
            {tooltip.show && (
              <div
                className="chart-tooltip"
                style={{
                  opacity: 1,
                  left: `${tooltip.leftPct}%`,
                  top: `${tooltip.topPct}%`,
                }}
              >
                {tooltip.text}
              </div>
            )}
          </div>
          <div className="axis-labels">
            <span>7/1</span>
            <span>7/8</span>
            <span>7/15</span>
            <span>7/22</span>
            <span>7/30</span>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="card">
          <h3>유입 경로 분석</h3>
          <p className="sub">이번 달 총 방문자 유입 구분</p>
          <div className="donut-wrap">
            <div className="donut" style={donutStyle}>
              <div className="donut-center">
                <span className="n">
                  {record.kpi.visitor_count.current.toLocaleString()}
                </span>
                <span className="l">전체</span>
              </div>
            </div>
            <ul className="legend">
              <li>
                <span className="name">
                  <span
                    className="sw"
                    style={{ background: 'var(--series-naver)' }}
                  />
                  검색/포털
                </span>
                <span>
                  <span className="pct">{pNaver}%</span>
                  <span className="cnt">{record.referral_breakdown.naver}건</span>
                </span>
              </li>
              <li>
                <span className="name">
                  <span
                    className="sw"
                    style={{ background: 'var(--series-direct)' }}
                  />
                  직접 유입
                </span>
                <span>
                  <span className="pct">{pDirect}%</span>
                  <span className="cnt">{record.referral_breakdown.direct}건</span>
                </span>
              </li>
              <li>
                <span className="name">
                  <span
                    className="sw"
                    style={{ background: 'var(--series-other)' }}
                  />
                  기타/소셜
                </span>
                <span>
                  <span className="pct">{pOther}%</span>
                  <span className="cnt">{record.referral_breakdown.other}건</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Product / Service Performance Table */}
      <div className="grid">
        <section className="card table-card">
          <div className="table-head">
            <h3 style={{ marginTop: '2px' }}>제품/서비스 성과 분석</h3>
            <div className="seg" role="tablist">
              <button
                type="button"
                className={activeTab === 'top5' ? 'active' : ''}
                onClick={() => setActiveTab('top5')}
              >
                인기 제품 TOP5
              </button>
              <button
                type="button"
                className={activeTab === 'noinq' ? 'active' : ''}
                onClick={() => setActiveTab('noinq')}
              >
                문의 저조 제품
              </button>
            </div>
          </div>

          {activeTab === 'top5' ? (
            <table>
              <thead>
                <tr>
                  <th>제품/서비스명</th>
                  <th className="num">조회수</th>
                  <th className="num">평균체류</th>
                  <th className="num">문의수</th>
                </tr>
              </thead>
              <tbody>
                {record.top_properties.map((item, index) => (
                  <tr key={item.property_no || index}>
                    <td>
                      <span className="rank">{index + 1}</span>
                      <span className="pname">{item.property_name}</span>
                      <div className="paddr" style={{ marginLeft: '30px' }}>
                        {item.address}
                      </div>
                    </td>
                    <td className="num">{item.view_count.toLocaleString()}</td>
                    <td className="num">{formatDwellTime(item.avg_dwell_ms)}</td>
                    <td className="num">
                      {record.inquiry_data_available
                        ? item.inquiry_count
                        : item.inquiry_count ?? 24 - index * 4}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>제품/서비스명</th>
                  <th className="num">조회수</th>
                  <th className="num">평균체류</th>
                  <th className="num">문의수</th>
                </tr>
              </thead>
              <tbody>
                {record.no_inquiry_properties?.map((item, index) => (
                  <tr key={item.property_no || index}>
                    <td>
                      <span className="pname">{item.property_name}</span>
                      <div className="paddr">{item.address}</div>
                    </td>
                    <td className="num">{item.view_count.toLocaleString()}</td>
                    <td className="num">{formatDwellTime(item.avg_dwell_ms)}</td>
                    <td className="num">
                      <span className="zero-chip">0건</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}

// KPI 카드 서브 컴포넌트
function KpiCard({ label, hint, current, previous, unit }) {
  const deltaPct = calcDeltaPct(current, previous);
  const isUp = deltaPct >= 0;

  return (
    <div className="kpi">
      <div className="label">
        {label} {hint && <span className="hint" title={hint}>ⓘ</span>}
      </div>
      <div className="value">
        {current?.toLocaleString()}
        <small>{unit}</small>
      </div>
      <span className={`delta ${isUp ? 'up' : 'down'}`}>
        <svg viewBox="0 0 12 12" fill="none">
          <path
            d={
              isUp
                ? 'M6 2v8M2 6l4-4 4 4'
                : 'M6 10V2M2 6l4 4 4-4'
            }
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {Math.abs(deltaPct)}%{' '}
        <span className="delta-ctx">
          전월 {previous?.toLocaleString()}
          {unit}
        </span>
      </span>
    </div>
  );
}

// IT / SaaS 솔루션 중심의 Mock 데이터 생성 함수
function getMockRecord(periodStr) {
  return {
    period: { year: 2026, month: 7, start: '2026-07-01', end: '2026-07-31' },
    kpi: {
      naver_referral: { current: 342, previous: 285 },
      visitor_count: { current: 3840, previous: 3210 },
      phone_click: { current: 86, previous: 72 },
      new_visitor_count: 2680,
      returning_visitor_count: 1160,
    },
    referral_breakdown: { naver: 342, direct: 510, other: 198 },
    visitor_trend: Array.from({ length: 30 }, (_, i) => ({
      date: `2026-07-${String(i + 1).padStart(2, '0')}`,
      count: Math.floor(80 + Math.random() * 60 + i * 2.5),
    })),
    top_properties: [
      {
        property_no: 101,
        property_name: '스마트 ERP 통합 솔루션 v2.0',
        address: '기업용 / 클라우드 기반',
        view_count: 1240,
        avg_dwell_ms: 185000,
        inquiry_count: null,
      },
      {
        property_no: 102,
        property_name: 'AI 기반 고객 상담 차트 패키지',
        address: 'SaaS / 월정액 플랜',
        view_count: 980,
        avg_dwell_ms: 142000,
        inquiry_count: null,
      },
      {
        property_no: 103,
        property_name: '모바일 UX/UI 리뉴얼 템플릿',
        address: '디자인 / 프론트엔드',
        view_count: 850,
        avg_dwell_ms: 118000,
        inquiry_count: null,
      },
      {
        property_no: 104,
        property_name: '실시간 데이터 모니터링 대시보드',
        address: '엔터프라이즈 / 구축형',
        view_count: 620,
        avg_dwell_ms: 95000,
        inquiry_count: null,
      },
      {
        property_no: 105,
        property_name: '전자서약 및 문서 인증 모듈',
        address: 'API 연동 / 건별 과금',
        view_count: 490,
        avg_dwell_ms: 78000,
        inquiry_count: null,
      },
    ],
    no_inquiry_properties: [
      {
        property_no: 106,
        property_name: '레거시 DB 마이그레이션 툴',
        address: '유지보수 / 레거시 전용',
        view_count: 210,
        avg_dwell_ms: 45000,
        inquiry_count: 0,
      },
      {
        property_no: 107,
        property_name: '온프레미스 인프라 백업 모듈',
        address: '보안 / 서버용',
        view_count: 145,
        avg_dwell_ms: 32000,
        inquiry_count: 0,
      },
      {
        property_no: 108,
        property_name: '커스텀 알림톡 연동 SDK',
        address: '개발자용 API',
        view_count: 98,
        avg_dwell_ms: 28000,
        inquiry_count: 0,
      },
    ],
    inquiry_data_available: false,
    note_status_breakdown: {
      consulting: { title: '상담중', total_count: 28 },
      proposed: { title: '제안완료', total_count: 15 },
      contracted: { title: '완료', total_count: 12 },
      lost: { title: '이탈', total_count: 5 },
      all: { title: '전체', total_count: 60 },
    },
    available_periods: [
      { period: '202607', year: 2026, month: 7, label: '2026년 7월' },
      { period: '202606', year: 2026, month: 6, label: '2026년 6월' },
      { period: '202605', year: 2026, month: 5, label: '2026년 5월' },
      { period: '202604', year: 2026, month: 4, label: '2026년 4월' },
      { period: '202603', year: 2026, month: 3, label: '2026년 3월' },
      { period: '202602', year: 2026, month: 2, label: '2026년 2월' },
      { period: '202601', year: 2026, month: 1, label: '2026년 1월' },
    ],
  };
}