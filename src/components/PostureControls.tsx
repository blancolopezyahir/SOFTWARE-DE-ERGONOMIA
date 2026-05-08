import { getSegmentPreview } from '../utils/rula';
import { posturePresets } from '../utils/tasks';
import type { ActivityType, BodySide, LoadType, RulaPosture } from '../types/rula';

interface Props { posture: RulaPosture; setPosture: (next: RulaPosture) => void; activeKey: string; setActiveKey: (key: string) => void; activeSide: BodySide; setActiveSide: (side: BodySide) => void; }

const clone = <T,>(v: T): T => structuredClone(v);
const sides: BodySide[] = ['left', 'right'];

function Slider({ label, value, min, max, step=1, onChange, onFocus }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v:number)=>void; onFocus:()=>void }) {
  return <label className="field slider-field"><span>{label}<b>{value}°</b></span><input type="range" min={min} max={max} step={step} value={value} onFocus={onFocus} onChange={(e)=>onChange(Number(e.target.value))} /><input type="number" value={value} min={min} max={max} onFocus={onFocus} onChange={(e)=>onChange(Number(e.target.value))} /></label>;
}

function Toggle({ label, checked, onChange }: { label:string; checked:boolean; onChange:(v:boolean)=>void }) {
  return <label className="check"><input type="checkbox" checked={checked} onChange={(e)=>onChange(e.target.checked)} />{label}</label>;
}

export default function PostureControls({ posture, setPosture, activeKey, setActiveKey, activeSide, setActiveSide }: Props) {
  const side = posture[activeSide];
  const updateSide = (patch: Partial<typeof side>, key: string) => { const next = clone(posture); next[activeSide] = { ...next[activeSide], ...patch }; setActiveKey(key); setPosture(next); };
  const updateShared = (patch: Partial<RulaPosture>, key: string) => { setActiveKey(key); setPosture({ ...clone(posture), ...patch }); };
  const preview = getSegmentPreview(posture, activeSide, activeKey);
  return <section className="panel controls-panel">
    <div className="section-title"><p>Panel de postura</p><h2>Ajuste del maniquí técnico</h2></div>
    <div className="button-row wrap">{Object.entries(posturePresets).map(([key, preset]) => <button key={key} className="soft" onClick={()=>setPosture(clone(preset.posture))}>{preset.label}</button>)}</div>
    <div className="segmented">{sides.map((s)=><button key={s} className={activeSide===s?'selected':''} onClick={()=>setActiveSide(s)}>{s === 'left' ? 'Lado izquierdo' : 'Lado derecho'}</button>)}</div>
    {preview && <div className="active-card"><strong>{preview.label}</strong><span>{preview.angle !== undefined ? `${Math.round(preview.angle)}° · ` : ''}puntuación provisional {preview.score}</span><small>{preview.explanation} {preview.modifiers.join(', ')}</small></div>}
    <div className="control-grid">
      <Slider label="Brazo flex/ext" value={side.upperArmFlexion} min={-45} max={140} onFocus={()=>setActiveKey('upperArm')} onChange={(v)=>updateSide({upperArmFlexion:v}, 'upperArm')} />
      <div className="checks"><Toggle label="Hombro elevado" checked={side.shoulderRaised} onChange={(v)=>updateSide({shoulderRaised:v}, 'upperArm')} /><Toggle label="Abducción" checked={side.upperArmAbducted} onChange={(v)=>updateSide({upperArmAbducted:v}, 'upperArm')} /><Toggle label="Rotación" checked={side.upperArmRotated} onChange={(v)=>updateSide({upperArmRotated:v}, 'upperArm')} /><Toggle label="Apoyo del brazo" checked={side.armSupported} onChange={(v)=>updateSide({armSupported:v}, 'upperArm')} /></div>
      <Slider label="Antebrazo flexión" value={side.lowerArmFlexion} min={20} max={150} onFocus={()=>setActiveKey('lowerArm')} onChange={(v)=>updateSide({lowerArmFlexion:v}, 'lowerArm')} />
      <div className="checks"><Toggle label="Cruza línea media" checked={side.lowerArmAcrossMidline} onChange={(v)=>updateSide({lowerArmAcrossMidline:v, lowerArmOutToSide:false}, 'lowerArm')} /><Toggle label="Actividad a un lado" checked={side.lowerArmOutToSide} onChange={(v)=>updateSide({lowerArmOutToSide:v, lowerArmAcrossMidline:false}, 'lowerArm')} /></div>
      <Slider label="Muñeca flex/ext" value={side.wristFlexion} min={-45} max={60} onFocus={()=>setActiveKey('wrist')} onChange={(v)=>updateSide({wristFlexion:v}, 'wrist')} />
      <div className="checks"><Toggle label="Desviación radial/cubital" checked={side.wristDeviation} onChange={(v)=>updateSide({wristDeviation:v}, 'wrist')} /><label className="field"><span>Giro muñeca</span><select value={side.wristTwist} onFocus={()=>setActiveKey('wrist')} onChange={(e)=>updateSide({wristTwist:Number(e.target.value) as 1|2}, 'wrist')}><option value={1}>Medio/neutro</option><option value={2}>Extremo</option></select></label></div>
      <Slider label="Cuello flex/ext" value={posture.neckFlexion} min={-30} max={60} onFocus={()=>setActiveKey('neck')} onChange={(v)=>updateShared({neckFlexion:v}, 'neck')} />
      <div className="checks"><Toggle label="Cuello rotado" checked={posture.neckRotated} onChange={(v)=>updateShared({neckRotated:v}, 'neck')} /><Toggle label="Inclinación lateral" checked={posture.neckSideBent} onChange={(v)=>updateShared({neckSideBent:v}, 'neck')} /></div>
      <Slider label="Tronco flexión" value={posture.trunkFlexion} min={0} max={90} onFocus={()=>setActiveKey('trunk')} onChange={(v)=>updateShared({trunkFlexion:v, trunkSeatedSupported:false}, 'trunk')} />
      <div className="checks"><Toggle label="Sentado bien apoyado" checked={posture.trunkSeatedSupported} onChange={(v)=>updateShared({trunkSeatedSupported:v}, 'trunk')} /><Toggle label="Tronco rotado" checked={posture.trunkRotated} onChange={(v)=>updateShared({trunkRotated:v}, 'trunk')} /><Toggle label="Inclinación lateral" checked={posture.trunkSideBent} onChange={(v)=>updateShared({trunkSideBent:v}, 'trunk')} /></div>
      <label className="field"><span>Apoyo de piernas</span><select value={posture.legSupport} onFocus={()=>setActiveKey('legs')} onChange={(e)=>updateShared({legSupport:e.target.value as RulaPosture['legSupport']}, 'legs')}><option value="seatedSupported">Sentado, pies apoyados</option><option value="standingBalanced">De pie equilibrado</option><option value="unsupportedOrUnbalanced">Sin apoyo o desequilibrado</option></select></label>
      <label className="field"><span>Uso muscular</span><select value={posture.activity} onChange={(e)=>updateShared({activity:e.target.value as ActivityType}, activeKey)}><option value="dynamic">Ocasional/dinámica</option><option value="static">Estática &gt; 1 min</option><option value="repetitive">Repetitiva &gt; 4/min</option></select></label>
      <label className="field"><span>Fuerza/carga</span><select value={posture.load} onChange={(e)=>updateShared({load:e.target.value as LoadType}, activeKey)}><option value="under2Intermittent">&lt;2 kg intermitente</option><option value="between2And10Intermittent">2-10 kg intermitente</option><option value="between2And10Static">2-10 kg estática/repetitiva</option><option value="over10Intermittent">&gt;10 kg intermitente</option><option value="over10Static">&gt;10 kg estática/repetitiva</option><option value="shock">Golpes/fuerza brusca</option></select></label>
    </div>
  </section>;
}
