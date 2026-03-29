import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Navbar from '../components/common/Navbar';
import { TiWarningOutline, TiTickOutline, TiZoomOutline } from 'react-icons/ti';
import { SiTarget } from 'react-icons/si';

const SmurfDetector = () => {
  const [gameName, setGameName] = useState('');
  const [tagLine, setTagLine] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const resultRef = useRef(null);

  useGSAP(() => {
    if (result) {
      gsap.fromTo(resultRef.current, 
        { y: 30, opacity: 0, scale: 0.98 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, [result]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!gameName || !tagLine) {
      setError('Please enter both Riot ID and Tagline.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/users/riot/val/smurf-analyze/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || errData.error || 'Failed to analyze player');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#ecedf6] font-sans relative overflow-hidden flex flex-col">
      <Navbar />

      {/* Background Deep Space Void */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-[#0b0e14]">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-[#1c2028] blur-[150px] rounded-full mix-blend-screen opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#10131a] blur-[150px] rounded-full mix-blend-screen opacity-80" />
        <div className="absolute inset-0 bg-[url('/img/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10" />
      </div>

      <div className="pt-32 px-6 max-w-5xl mx-auto relative z-10 flex flex-col items-center w-full flex-1">
        
        {/* Header section */}
        <div className="w-full text-left mb-10 border-l-4 border-[#9cff93] pl-6 py-2">
          <p className="text-[#a9abb3] text-xs uppercase tracking-[0.2em] font-bold mb-2">SYSTEM_STATUS: ONLINE</p>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-[-0.02em] mb-2 font-['Space_Grotesk'] text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            Smurf Detector
          </h1>
          <p className="text-[#a9abb3] text-sm md:text-base max-w-2xl font-['Inter']">
            Powered by K-Means ML Clustering Architecture v4.2. Analyze a Valorant player's recent competitive matches to detect anomalous performance spikes that indicate alternative account usage.
          </p>
        </div>

        {/* Tactical HUD Form */}
        <div className="w-full bg-[#1c2028]/80 backdrop-blur-xl border border-[#45484f]/15 shadow-[0_40px_40px_-20px_rgba(0,0,0,0.8)] rounded-md p-6 mb-12">
          <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col md:flex-row gap-0 bg-[#22262f] rounded-sm relative focus-within:after:content-[''] focus-within:after:absolute focus-within:after:bottom-0 focus-within:after:left-0 focus-within:after:w-full focus-within:after:h-[2px] focus-within:after:bg-[#9cff93] focus-within:after:shadow-[0_0_10px_rgba(156,255,147,0.5)] transition-all">
              <input 
                type="text" 
                placeholder="RIOT ID (e.g. TenZ)" 
                className="bg-transparent border-none outline-none px-5 py-4 text-white placeholder:text-[#a9abb3] font-mono text-lg w-full md:w-2/3"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
              />
              <div className="w-px bg-[#45484f]/30 hidden md:block my-3" />
              <div className="flex items-center px-4 py-4 w-full md:w-1/3 text-[#a9abb3] font-mono text-lg">
                #
                <input 
                  type="text" 
                  placeholder="TAG" 
                  className="bg-transparent border-none outline-none w-full ml-2 text-white placeholder:text-[#52555c] uppercase"
                  value={tagLine}
                  onChange={(e) => setTagLine(e.target.value)}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-br from-[#9cff93] to-[#00fc40] text-[#006413] font-black uppercase tracking-widest px-10 rounded-md transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(0,252,64,0.4)] disabled:opacity-50 disabled:grayscale hover:scale-[1.02] flex items-center justify-center h-[60px] md:h-auto font-['Space_Grotesk']"
              style={{ transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#006413]" />
                  <span>ANALYZING...</span>
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  <SiTarget size={20} className="opacity-80" /> INITIATE SCAN
                </span>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-[#b92902]/10 border border-[#b92902]/30 rounded-sm text-[#ff7166] flex items-center gap-3 font-mono text-sm">
              <TiWarningOutline size={22} className="shrink-0" /> 
              <span><strong className="text-white">ERROR:</strong> {error}</span>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div ref={resultRef} className="w-full flex flex-col gap-6 pb-20">
            
            {/* Primary Status Banner */}
            <div className={`w-full relative overflow-hidden rounded-md border backdrop-blur-md ${result.ml_analysis.smurf_flag ? 'border-[#ff7166]/30 bg-[#c00014]/10 shadow-[0_0_40px_-10px_rgba(192,0,20,0.3)]' : 'border-[#9cff93]/30 bg-[#00fc40]/10 shadow-[0_0_40px_-10px_rgba(0,252,64,0.2)]'}`}>
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-50" />
              
              <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 z-10 relative">
                <div className="flex items-center gap-6">
                  {result.ml_analysis.smurf_flag ? (
                    <div className="w-20 h-20 rounded-full bg-[#c00014]/20 flex items-center justify-center border border-[#ff7166]/50 shadow-[0_0_15px_rgba(255,113,102,0.5)]">
                      <TiWarningOutline className="text-[#ff7166]" size={40} />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-[#00fc40]/20 flex items-center justify-center border border-[#9cff93]/50 shadow-[0_0_15px_rgba(156,255,147,0.5)]">
                      <TiTickOutline className="text-[#9cff93]" size={40} />
                    </div>
                  )}
                  <div>
                    <h2 className={`text-5xl md:text-6xl font-black uppercase tracking-[-0.02em] font-['Space_Grotesk'] mb-1 ${result.ml_analysis.smurf_flag ? 'text-[#ff7166] drop-shadow-[0_0_10px_rgba(255,113,102,0.8)]' : 'text-[#9cff93] drop-shadow-[0_0_10px_rgba(156,255,147,0.8)]'}`}>
                      {result.ml_analysis.smurf_flag ? 'SMURF DETECTED' : 'CLEAR'}
                    </h2>
                    <p className="text-[#a9abb3] font-mono text-sm uppercase">Subject <span className="text-white font-bold">[{result.player}]</span> analyzed over <span className="text-white font-bold">{result.matchesAnalyzed}</span> competitive records</p>
                  </div>
                </div>

                <div className="flex flex-col items-center bg-[#0b0e14]/50 border border-[#45484f]/20 rounded-sm p-4 px-8 backdrop-blur-md">
                  <span className="text-[#a9abb3] text-xs font-bold font-mono mb-1 uppercase tracking-widest">Confidence Score</span>
                  <span className={`text-4xl font-black font-['Space_Grotesk'] ${result.ml_analysis.smurf_flag ? 'text-[#ff7166]' : 'text-[#9cff93]'}`}>
                    {(parseFloat(result.ml_analysis.smurf_probability) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Tactical Data Grid */}
            <div className="grid md:grid-cols-2 gap-6 w-full mt-4">
              
              {/* ML Insights Panel */}
              <div className="bg-[#1c2028]/80 backdrop-blur-xl border border-[#45484f]/15 rounded-md p-6">
                <div className="bg-[#282c36] absolute top-0 left-0 w-full h-10 rounded-t-md border-b border-[#45484f]/15 flex items-center px-6">
                   <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#a9abb3] flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#81ecff] animate-pulse glow" /> K-Means Telemetry
                  </h3>
                </div>
                
                <div className="mt-12 space-y-5">
                  <div className="flex justify-between items-center group">
                    <span className="text-[#a9abb3] text-sm font-medium">Peak MMR Variance</span>
                    <span className="font-mono text-white text-lg group-hover:text-[#81ecff] transition-colors">Δ {parseFloat(result.ml_analysis.highest_performance_centroid.avg_mmr_change_variance).toFixed(2)}</span>
                  </div>
                  <div className="w-full h-px bg-[#45484f]/20" />
                  <div className="flex justify-between items-center group">
                    <span className="text-[#a9abb3] text-sm font-medium">Avg ELO in Peak Cluster</span>
                    <span className="font-mono text-white text-lg group-hover:text-[#81ecff] transition-colors">{Math.round(result.ml_analysis.highest_performance_centroid.avg_elo_in_cluster)}</span>
                  </div>
                  <div className="w-full h-px bg-[#45484f]/20" />
                  <div className="flex justify-between items-center group">
                    <span className="text-[#a9abb3] text-sm font-medium">Clusters Formed</span>
                    <span className="font-mono text-white text-lg group-hover:text-[#81ecff] transition-colors">{result.ml_analysis.clusters_found}</span>
                  </div>
                </div>
              </div>

              {/* How it works Panel */}
              <div className="bg-[#1c2028]/80 backdrop-blur-xl border border-[#45484f]/15 rounded-md p-6">
                <div className="bg-[#282c36] absolute top-0 left-0 w-full h-10 rounded-t-md border-b border-[#45484f]/15 flex items-center px-6">
                   <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#a9abb3] flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#ff7166]" /> Documentation
                  </h3>
                </div>
                <div className="mt-12 space-y-4">
                  <p className="text-sm text-[#ecedf6] leading-relaxed font-['Inter']">
                    Our ML architecture classifies matches into behavioral clusters using K-Means algorithms. We scrape high-fidelity telemetry, including Combat Score variance and MMR fluctuations.
                  </p>
                  <p className="text-sm text-[#a9abb3] leading-relaxed font-['Inter']">
                    If a player's highest-performing centroid hits mathematical thresholds typical of alternate account usage (high win-rate volatility mapping to disproportionately high ELO), a <span className="text-[#ff7166] border-b border-[#ff7166]/30">SMURF FLAG</span> is raised.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default SmurfDetector;
