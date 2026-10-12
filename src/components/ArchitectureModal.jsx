import React from 'react';
import { X, Cpu, Server, ShieldCheck, Zap, KeyRound, ExternalLink, Check } from 'lucide-react';

export function ArchitectureModal({
  isOpen,
  onClose,
  apiKey,
  onChangeApiKey,
  endpoint,
  onChangeEndpoint,
  model,
  onChangeModel
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto no-print">
      <div className="field-card max-w-2xl w-full p-6 sm:p-8 bg-[#FBF9F5] border-2 border-[#E5DFCF] relative shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-[#5E7A6E] hover:text-[#18221E] hover:bg-[#E5DFCF] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#0069FF]/10 border border-[#0069FF]/20 flex items-center justify-center text-[#0069FF]">
            <Server className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-[#18221E]">
              DigitalOcean Serverless Inference Architecture
            </h3>
            <p className="text-xs text-[#5E7A6E]">
              Featured Category: Best Use of DigitalOcean ($200) · Hacktoberfest 2026
            </p>
          </div>
        </div>

        {/* Architecture Flow */}
        <div className="bg-[#FFFDF9] border border-[#E5DFCF] rounded-xl p-4 mb-5 text-xs font-mono">
          <div className="text-[10px] text-[#5E7A6E] uppercase font-bold mb-2">
            Deterministic Pipeline to Open-Weight Inference
          </div>
          <div className="space-y-1.5 text-[#18221E]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#E8F4FC] text-[#0069FF] flex items-center justify-center text-[10px] font-bold">1</span>
              <span><strong>NOAA Solar Engine:</strong> Computes true solar elevation & azimuth</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#E8F4FC] text-[#0069FF] flex items-center justify-center text-[10px] font-bold">2</span>
              <span><strong>Topographic Intersection:</strong> Solves ridge obstacle barrier intersection</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#E8F4FC] text-[#0069FF] flex items-center justify-center text-[10px] font-bold">3</span>
              <span><strong>DigitalOcean Inference:</strong> Runs open-weight Gemma 4 / Llama 3 on DO serverless GPU</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#E8F4FC] text-[#0069FF] flex items-center justify-center text-[10px] font-bold">4</span>
              <span><strong>Field Card Emission:</strong> 30s screen time $\rightarrow$ pocket phone & touch grass</span>
            </div>
          </div>
        </div>

        {/* Benchmark Metrics */}
        <div className="grid grid-cols-3 gap-2.5 mb-5 text-center text-xs">
          <div className="p-3 bg-[#F4F0E8] rounded-lg border border-[#E5DFCF]">
            <span className="text-[10px] uppercase font-mono text-[#5E7A6E] block mb-0.5">Inference Cost</span>
            <span className="font-serif text-base font-bold text-[#213B32]">$0.0002</span>
            <span className="text-[10px] text-[#72807A] block">Per field card</span>
          </div>
          <div className="p-3 bg-[#F4F0E8] rounded-lg border border-[#E5DFCF]">
            <span className="text-[10px] uppercase font-mono text-[#5E7A6E] block mb-0.5">Typical Latency</span>
            <span className="font-serif text-base font-bold text-[#D97724]">~320 ms</span>
            <span className="text-[10px] text-[#72807A] block">DigitalOcean GPU</span>
          </div>
          <div className="p-3 bg-[#F4F0E8] rounded-lg border border-[#E5DFCF]">
            <span className="text-[10px] uppercase font-mono text-[#5E7A6E] block mb-0.5">Model Family</span>
            <span className="font-serif text-base font-bold text-[#0069FF]">Open Weights</span>
            <span className="text-[10px] text-[#72807A] block">Gemma 4 / Llama 3</span>
          </div>
        </div>

        {/* Optional Credentials Setting */}
        <div className="border-t border-[#E5DFCF] pt-4 mb-5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#18221E] mb-2 font-mono">
            <KeyRound className="w-3.5 h-3.5 text-[#0069FF]" />
            <span>DigitalOcean Token (Optional / Testing)</span>
          </div>
          <p className="text-xs text-[#5E7A6E] mb-3">
            SolTerra works 100% out-of-the-box using its built-in deterministic edge synthesizer. If you wish to test live cloud streaming against your DigitalOcean account, enter your token below:
          </p>
          <div className="space-y-2 font-mono">
            <div>
              <label className="text-[10px] text-[#5E7A6E] block mb-0.5">DigitalOcean Inference API Key</label>
              <input
                type="password"
                placeholder="do_inf_live_..."
                value={apiKey}
                onChange={(e) => onChangeApiKey(e.target.value)}
                className="w-full bg-[#FFFDF9] border border-[#D8D0BF] rounded px-3 py-1.5 text-xs focus:outline-none focus:border-[#0069FF]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-[#5E7A6E] block mb-0.5">Model</label>
                <select
                  value={model}
                  onChange={(e) => onChangeModel(e.target.value)}
                  className="w-full bg-[#FFFDF9] border border-[#D8D0BF] rounded px-2 py-1 text-xs"
                >
                  <option value="gemma-4-31B-it">gemma-4-31B-it (Google)</option>
                  <option value="meta-llama-3-8b-instruct">meta-llama-3-8b-instruct (Meta)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-[#5E7A6E] block mb-0.5">Inference Endpoint</label>
                <input
                  type="text"
                  value={endpoint}
                  onChange={(e) => onChangeEndpoint(e.target.value)}
                  className="w-full bg-[#FFFDF9] border border-[#D8D0BF] rounded px-2 py-1 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#E5DFCF]">
          <span className="text-xs text-[#5E7A6E] font-mono">
            Token never logged or saved to server.
          </span>
          <button onClick={onClose} className="btn-primary text-xs py-1.5 px-4">
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
