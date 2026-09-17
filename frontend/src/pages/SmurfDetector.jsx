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
    <div className="min-h-screen bg-dark-900 text-white font-sans relative overflow-hidden flex flex-col">
      <Navbar />

      {/* Background Deep Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-dark-900">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-accent-primary/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent-secondary/5 blur-[150px] rounded-full pointer-events-none" />
      </div>

      <div className="pt-32 px-6 max-w-5xl mx-auto relative z-10 flex flex-col items-center w-full flex-1">
        
        {/* Header section */}
        <div className="w-full text-left mb-10 border-l-4 border-accent-primary pl-6 py-2">
          <p className="text-accent-primary text-xs uppercase tracking-[0.2em] font-bold mb-2">SYSTEM_STATUS: ONLINE</p>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-[-0.02em] mb-2 font-riot text-white">
            Smurf Detector
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-2xl font-sans leading-relaxed">
            Powered by K-Means ML Clustering Architecture v4.2. Analyze a Valorant player's recent competitive matches to detect anomalous performance spikes that indicate alternative account usage.
          </p>
        </div>

        {/* Tactical HUD Form */}
        <div className="w-full bg-dark-800/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 mb-12">
          <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex flex-col md:flex-row gap-0 bg-white/5 border border-white/10 rounded-xl relative focus-within:border-accent-primary focus-within:shadow-[0_0_15px_rgba(79,183,221,0.2)] transition-all">
              <input 
                type="text" 
                placeholder="RIOT ID (e.g. TenZ)" 
                className="bg-transparent border-none outline-none px-5 py-4 text-white placeholder:text-white/40 font-mono text-base w-full md:w-2/3"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
              />
              <div className="w-px bg-white/10 hidden md:block my-3" />
              <div className="flex items-center px-4 py-4 w-full md:w-1/3 text-white/40 font-mono text-base">
                #
                <input 
                  type="text" 
                  placeholder="TAG" 
                  className="bg-transparent border-none outline-none w-full ml-2 text-white placeholder:text-white/30 uppercase font-mono"
                  value={tagLine}
                  onChange={(e) => setTagLine(e.target.value)}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-accent-primary to-blue-400 text-black font-black uppercase tracking-widest px-8 rounded-xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(79,183,221,0.4)] disabled:opacity-50 disabled:grayscale hover:scale-[1.02] active:scale-95 flex items-center justify-center h-[56px] cursor-pointer text-xs"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
                  <span>ANALYZING...</span>
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  <SiTarget size={18} className="opacity-90" /> INITIATE SCAN
                </span>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-accent-primary/10 border border-accent-primary/30 rounded-xl text-accent-primary flex items-center gap-3 font-mono text-sm">
              <TiWarningOutline size={22} className="shrink-0" /> 
              <span><strong className="text-white">ERROR:</strong> {error}</span>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div ref={resultRef} className="w-full flex flex-col gap-6 pb-20">
            
            {/* Primary Status Banner */}
            <div className={`w-full relative overflow-hidden rounded-2xl border backdrop-blur-md p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 ${
              result.ml_analysis.smurf_flag 
                ? 'border-accent-tertiary/40 bg-accent-tertiary/10 shadow-[0_0_40px_-10px_rgba(237,255,102,0.2)]' 
                : 'border-accent-primary/40 bg-accent-primary/10 shadow-[0_0_40px_-10px_rgba(79,183,221,0.2)]'
            }`}>
              <div className="flex items-center gap-6">
                {result.ml_analysis.smurf_flag ? (
                  <div className="w-16 h-16 rounded-full bg-accent-tertiary/20 flex items-center justify-center border border-accent-tertiary/50 text-accent-tertiary shadow-lg">
                    <TiWarningOutline size={32} />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-accent-primary/20 flex items-center justify-center border border-accent-primary/50 text-accent-primary shadow-lg">
                    <TiTickOutline size={32} />
                  </div>
                )}
                <div>
                  <h2 className={`text-4xl md:text-5xl font-black uppercase font-riot mb-1 ${
                    result.ml_analysis.smurf_flag ? 'text-accent-tertiary' : 'text-accent-primary'
                  }`}>
                    {result.ml_analysis.smurf_flag ? 'SMURF DETECTED' : 'CLEAR'}
                  </h2>
                  <p className="text-white/60 font-mono text-xs uppercase">Subject <span className="text-white font-bold">[{result.player}]</span> analyzed over <span className="text-white font-bold">{result.matchesAnalyzed}</span> competitive records</p>
                </div>
              </div>

              <div className="flex flex-col items-center bg-dark-900/60 border border-white/10 rounded-xl p-4 px-8 backdrop-blur-md">
                <span className="text-white/50 text-xs font-bold font-mono mb-1 uppercase tracking-widest">Confidence Score</span>
                <span className={`text-3xl md:text-4xl font-black font-riot ${result.ml_analysis.smurf_flag ? 'text-accent-tertiary' : 'text-accent-primary'}`}>
                  {(parseFloat(result.ml_analysis.smurf_probability) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Tactical Data Grid */}
            <div className="grid md:grid-cols-2 gap-6 w-full mt-2">
              
              {/* ML Insights Panel */}
              <div className="bg-dark-800/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                <div className="border-b border-white/10 pb-3 mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                    K-Means Telemetry
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center group">
                    <span className="text-white/60 text-sm font-medium">Peak MMR Variance</span>
                    <span className="font-mono text-white text-base group-hover:text-accent-primary transition-colors">Δ {parseFloat(result.ml_analysis.highest_performance_centroid.avg_mmr_change_variance).toFixed(2)}</span>
                  </div>
                  <div className="w-full h-px bg-white/5" />
                  <div className="flex justify-between items-center group">
                    <span className="text-white/60 text-sm font-medium">Avg ELO in Peak Cluster</span>
                    <span className="font-mono text-white text-base group-hover:text-accent-primary transition-colors">{Math.round(result.ml_analysis.highest_performance_centroid.avg_elo_in_cluster)}</span>
                  </div>
                  <div className="w-full h-px bg-white/5" />
                  <div className="flex justify-between items-center group">
                    <span className="text-white/60 text-sm font-medium">Clusters Formed</span>
                    <span className="font-mono text-white text-base group-hover:text-accent-primary transition-colors">{result.ml_analysis.clusters_found}</span>
                  </div>
                </div>
              </div>

              {/* How it works Panel */}
              <div className="bg-dark-800/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                <div className="border-b border-white/10 pb-3 mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent-primary" />
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                    Documentation
                  </h3>
                </div>
                <div className="space-y-3">
                  <p className="text-xs text-white/70 leading-relaxed font-sans">
                    Our ML architecture classifies matches into behavioral clusters using K-Means algorithms. We scrape high-fidelity telemetry, including Combat Score variance and MMR fluctuations.
                  </p>
                  <p className="text-xs text-white/50 leading-relaxed font-sans">
                    If a player's highest-performing centroid hits mathematical thresholds typical of alternate account usage, a <span className="text-accent-primary font-bold">SMURF FLAG</span> is raised.
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
